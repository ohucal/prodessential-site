'use client';
// Beat-reactive "thump": scales an element in time with the low-frequency
// (kick/bass) energy of whatever's playing. Reads the SAME shared analyser the
// waveform uses (lib/audioAnalyser) — it never creates a second Web Audio graph.
//
// Only writes `transform` (a compositor-only property), so each frame is GPU
// cheap — no layout or paint. The rAF loop runs only while `active` is true and
// then briefly as it settles back to rest, so an idle/paused beat burns nothing.
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/stores/usePlayer';
import { getAnalyser, resumeAudioContext } from '@/lib/audioAnalyser';

// ─── Tunables ──────────────────────────────────────────────────────────────
const SCALE_AMOUNT = 0.09;   // extra scale at a full-strength hit (1 → 1.09)
const ATTACK = 0.8;          // how fast it jumps up on a kick (0..1, higher = snappier)
const RELEASE = 0.14;        // how fast it eases back down between hits
const FLUX_GAIN = 22;        // flux-above-threshold → scale sensitivity
const THRESHOLD = 1.6;       // fire only when flux exceeds this × its recent average
const FLUX_AVG_RISE = 0.1;   // how fast the flux baseline adapts
const LO_BIN = 1;            // lowest freq bin to sample (skip DC at 0)
const HI_BIN = 8;            // highest — ~40–180Hz at 44.1kHz/2048, i.e. the kick
// ─────────────────────────────────────────────────────────────────────────
// Raw bass *level* is a poor kick detector: a brick-walled 808 keeps the low
// end pinned near max the whole time. So we measure spectral *flux* — the
// frame-to-frame RISE in low-band energy — and fire only when it jumps above a
// running average of itself (adaptive threshold). That rejects the steady flux
// "noise" of a sustained 808 and leaves a clean spike on each kick attack.

// `active` should be true only when THIS element's beat is the one playing
// (e.g. `isPlaying && activeBeatId === beat.id`). Attach the returned ref to the
// element you want to pulse.
export function useBeatPulse<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  const rafRef = useRef(0);
  const envRef = useRef(0);                          // smoothed 0..1 pulse envelope
  const prevRef = useRef<Float32Array | null>(null); // last frame's per-bin levels
  const fluxAvgRef = useRef(0);                      // running average flux (adaptive threshold)

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: leave the element untouched.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = '';
      return;
    }

    let data: Uint8Array<ArrayBuffer> | null = null;

    const draw = () => {
      const analyser = getAnalyser();
      const { volume, muted, isPlaying } = usePlayer.getState();
      // Only gate on silence — the analyser taps the signal pre-volume (it reads
      // full-scale even at low slider settings), so we use its raw magnitudes
      // directly. The adaptive threshold below is relative, so sensitivity is the
      // same at any volume without dividing anything out.
      const silent = muted || volume < 0.02;

      let target = 0;
      if (active && isPlaying && analyser && !silent) {
        resumeAudioContext();
        if (!data || data.length !== analyser.frequencyBinCount) {
          data = new Uint8Array(analyser.frequencyBinCount);
        }
        if (!prevRef.current) prevRef.current = new Float32Array(HI_BIN + 1);
        const prev = prevRef.current;
        analyser.getByteFrequencyData(data);

        // Spectral flux: sum only the positive frame-to-frame changes across the
        // kick band. Rising low-end (a hit) counts; steady/decaying 808 doesn't.
        let flux = 0;
        for (let i = LO_BIN; i <= HI_BIN; i++) {
          const v = data[i] / 255;
          const rise = v - prev[i];
          if (rise > 0) flux += rise;
          prev[i] = v;
        }
        flux /= HI_BIN - LO_BIN + 1;

        // Adaptive threshold: only the part of this frame's flux that exceeds
        // its own recent average (×THRESHOLD) counts as a hit.
        fluxAvgRef.current += (flux - fluxAvgRef.current) * FLUX_AVG_RISE;
        const excess = Math.max(0, flux - fluxAvgRef.current * THRESHOLD);
        target = Math.min(1, excess * FLUX_GAIN);
      } else if (prevRef.current) {
        prevRef.current.fill(0);
        fluxAvgRef.current = 0;
      }

      // Fast attack on the way up, slower release on the way down.
      const env = envRef.current;
      envRef.current = env + (target - env) * (target > env ? ATTACK : RELEASE);

      const s = 1 + envRef.current * SCALE_AMOUNT;
      el.style.transform = `scale(${s.toFixed(4)})`;

      // Keep animating while playing this beat, or while it's still settling.
      if ((active && isPlaying) || envRef.current > 0.001) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        el.style.transform = '';
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      el.style.transform = '';
    };
  }, [active]);

  return ref;
}
