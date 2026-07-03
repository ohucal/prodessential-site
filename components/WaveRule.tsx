'use client';

import { useEffect, useRef } from 'react';
import { usePlayer } from '@/stores/usePlayer';
import { ensureAudioAnalyser, getAnalyser, resumeAudioContext } from '@/lib/audioAnalyser';

// ─── Tweakables ──────────────────────────────────────────────────────────
// Stroke color of the line (idle and playing — it never changes).
const LINE_COLOR = 'rgba(42, 42, 42)';
// Stroke thickness in DEVICE pixels (physical screen pixels). 1 = a single
// hardware pixel — the same weight the hr's 0.5px border resolves to on a
// 2x display. Going below 1 only fades the line, it can't get thinner.
const LINE_WIDTH = 1;
// Max wave swing, as a fraction of half the canvas height (0..1).
const WAVE_AMPLITUDE = 0.6;
// Loudness → swing mapping: gain = GAIN_BASE + rms * GAIN_LOUDNESS.
const GAIN_BASE = 0.2;
const GAIN_LOUDNESS = 1;
// ─────────────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// The section-label horizontal rule: a flat hairline when idle; the same
// hairline bends into an oscilloscope waveform while a track plays.
// `active` (optional) overrides the trigger: pass it to scope the waveform to a
// subset of beats (e.g. the hero's Featured Beats rule only reacts to featured
// tracks); omitted, any playing track animates it.
export default function WaveRule({ active }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mixRef = useRef(0); // 0 = flat rule, 1 = full waveform
  const energyRef = useRef(0);
  const waveRef = useRef<Float32Array | null>(null);

  const globalPlaying = usePlayer((s) => s.isPlaying);
  const isPlaying = active ?? globalPlaying;

  // Make sure the analyser graph exists (recovers after dev hot-reloads).
  useEffect(() => {
    const el = usePlayer.getState().el;
    if (el) ensureAudioAnalyser(el);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let data: Uint8Array<ArrayBuffer> | null = null;

    // Hard ceiling on the backing bitmap. Guards against a bad/transient
    // layout read (e.g. mid hot-reload, before flex sizing applies) locking
    // in a runaway canvas size that makes setTransform throw.
    const MAX_CANVAS_DIM = 4096;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      const pixelW = Math.min(MAX_CANVAS_DIM, Math.max(1, Math.floor(w * dpr)));
      const pixelH = Math.min(MAX_CANVAS_DIM, Math.max(1, Math.floor(h * dpr)));
      // Only touch the attributes when the size actually changed — setting
      // canvas.width/height (even to the same value) clears the bitmap and
      // can re-trigger the ResizeObserver.
      if (canvas.width !== pixelW) canvas.width = pixelW;
      if (canvas.height !== pixelH) canvas.height = pixelH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    // Resizing clears the canvas; kick one frame so the (possibly stopped)
    // loop repaints the line.
    const ro = new ResizeObserver(() => {
      resize();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    const draw = () => {
      mixRef.current = lerp(mixRef.current, isPlaying ? 1 : 0, 0.08);
      const mix = mixRef.current;

      // Once fully settled to a flat line, stop the animation loop entirely
      // (no idle rAF burn). The effect restarts it when isPlaying changes.
      const settled = !isPlaying && mix < 0.002;
      if (!settled) rafRef.current = requestAnimationFrame(draw);
      if (settled) mixRef.current = 0;

      const samples = 160;
      if (!waveRef.current || waveRef.current.length !== samples) {
        waveRef.current = new Float32Array(samples);
      }
      const wave = waveRef.current;

      const analyser = getAnalyser();
      if (analyser && (!data || data.length !== analyser.fftSize)) {
        data = new Uint8Array(analyser.fftSize);
      }

      // The element's volume scales the signal the analyser sees; divide it
      // back out so the wave oscillates the same at any volume setting.
      const { volume, muted } = usePlayer.getState();
      const volNorm = !muted && volume > 0.02 ? 1 / volume : 0;

      if (isPlaying && analyser && data && volNorm > 0) {
        resumeAudioContext();
        analyser.getByteTimeDomainData(data);

        // RMS loudness of this frame drives how hard the wave swings.
        let sumSq = 0;
        for (let i = 0; i < data.length; i++) {
          const v = ((data[i] - 128) / 128) * volNorm;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / data.length);
        energyRef.current = lerp(energyRef.current, rms, 0.25);

        const step = data.length / samples;
        const gain = (GAIN_BASE + energyRef.current * GAIN_LOUDNESS) * volNorm;
        for (let i = 0; i < samples; i++) {
          const v = ((data[Math.floor(i * step)] - 128) / 128) * gain;
          wave[i] = lerp(wave[i], Math.max(-1, Math.min(1, v)), 0.6);
        }
      } else {
        energyRef.current = lerp(energyRef.current, 0, 0.05);
        for (let i = 0; i < samples; i++) wave[i] = lerp(wave[i], 0, 0.08);
      }

      ctx.clearRect(0, 0, w, h);

      // Snap the center line to a device-pixel row (like the browser does
      // for the hr's border) so the resting line is 1 physical pixel, crisp
      // and fully opaque, instead of antialiased across two rows.
      const cy = (Math.round((h / 2) * dpr - 0.5) + 0.5) / dpr;
      const amp = (h / 2) * WAVE_AMPLITUDE;

      ctx.beginPath();
      for (let i = 0; i < samples; i++) {
        const x = (i / (samples - 1)) * w;
        const y = cy + wave[i] * amp * mix;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = LINE_COLOR;
      // LINE_WIDTH is in device pixels: 1 = one physical pixel (hr weight).
      ctx.lineWidth = LINE_WIDTH / dpr;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [isPlaying]);

  return <canvas ref={canvasRef} className="wave-rule" aria-hidden="true" />;
}
