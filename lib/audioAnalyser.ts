// Web Audio graph for the global <audio> element.
// createMediaElementSource may only be called once per element, and module
// state resets on dev hot-reload — so the graph is cached on globalThis,
// keyed by the element it was built for.
interface AnalyserCache {
  ctx: AudioContext;
  analyser: AnalyserNode;
  el: HTMLAudioElement;
}

const g = globalThis as typeof globalThis & { __peAudioAnalyser?: AnalyserCache };

export function ensureAudioAnalyser(el: HTMLAudioElement): AnalyserNode | null {
  if (typeof window === 'undefined') return null;

  const cached = g.__peAudioAnalyser;
  if (cached) {
    if (cached.el === el) return cached.analyser;
    // The audio element was remounted; the old graph is orphaned.
    void cached.ctx.close().catch(() => {});
    g.__peAudioAnalyser = undefined;
  }

  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  let source: MediaElementAudioSourceNode;
  try {
    source = ctx.createMediaElementSource(el);
  } catch {
    // Element already has a source from a previous (lost) graph; nothing we
    // can do until a full page reload.
    void ctx.close().catch(() => {});
    return null;
  }
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.82;
  source.connect(analyser);
  analyser.connect(ctx.destination);
  g.__peAudioAnalyser = { ctx, analyser, el };
  return analyser;
}

export function getAnalyser(): AnalyserNode | null {
  return g.__peAudioAnalyser?.analyser ?? null;
}

export function resumeAudioContext(): void {
  const ctx = g.__peAudioAnalyser?.ctx;
  if (ctx?.state === 'suspended') void ctx.resume();
}
