'use client';
// Centralized audio engine. One <audio> element (owned by <AudioEngine/>) is
// registered here; all UI (cards, modal, bar) reads state and calls actions.
import { create } from 'zustand';
import { beats, type Beat } from '@/lib/products';
import { assetUrl } from '@/lib/assets';
import { track } from '@/lib/analytics';

const VOLUME_KEY = 'prodessential_volume_v1';
const beatsById = new Map(beats.map((b) => [String(b.id), b]));

interface PlayerState {
  el: HTMLAudioElement | null;
  activeBeatId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeatOne: boolean;
  volume: number;
  muted: boolean;
  visible: boolean;
  lastVolume: number;
  filteredIds: string[]; // ids currently visible in the store (drives nav order)

  register: (el: HTMLAudioElement) => void;
  setFilteredIds: (ids: string[]) => void;
  order: () => string[];

  playBeat: (beat: Beat) => void;
  toggle: () => void;          // bar play/pause
  toggleBeat: (beat: Beat) => void; // card play button
  navigate: (dir: 1 | -1) => void;
  randomNext: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  close: () => void;
  seekPct: (pct: number) => void;
  setVolumePct: (pct: number) => void;
  toggleMute: () => void;

  // internal event handlers
  _onTime: () => void;
  _onLoaded: () => void;
  _onEnded: () => void;
  _onPlay: () => void;
  _onPause: () => void;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  el: null,
  activeBeatId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeatOne: false,
  volume: 1,
  muted: false,
  visible: false,
  lastVolume: 1,
  filteredIds: [],

  register: (el) => {
    let v = parseFloat(localStorage.getItem(VOLUME_KEY) || '');
    if (isNaN(v)) v = 1;
    v = Math.max(0, Math.min(1, v));
    el.volume = v;
    set({ el, volume: v, muted: v === 0, lastVolume: v > 0 ? v : 1 });
  },

  setFilteredIds: (ids) => set({ filteredIds: ids }),

  order: () => {
    const { filteredIds } = get();
    const filteredSet = new Set(filteredIds);
    const overflow = [...beats]
      .sort((a, b) => +new Date(b.dateAdded) - +new Date(a.dateAdded))
      .map((b) => String(b.id))
      .filter((id) => !filteredSet.has(id));
    return [...filteredIds, ...overflow];
  },

  playBeat: (beat) => {
    const { el } = get();
    if (!el || !beat.audioFile) return;
    el.src = assetUrl(beat.audioFile);
    el.load();
    el.play().catch(() => {});
    track('beat_preview_play', { beat_id: beat.id, beat_title: beat.title });
    set({ activeBeatId: beat.id, visible: true });
  },

  toggleBeat: (beat) => {
    const { el, activeBeatId } = get();
    if (!el) return;
    if (activeBeatId === beat.id) {
      if (el.paused) el.play().catch(() => {});
      else el.pause();
      return;
    }
    get().playBeat(beat);
  },

  toggle: () => {
    const { el, activeBeatId } = get();
    if (!el) return;
    if (!activeBeatId) {
      const ord = get().order();
      const first = ord.length ? beatsById.get(ord[0]) : undefined;
      if (first) get().playBeat(first);
      return;
    }
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  },

  navigate: (dir) => {
    const { activeBeatId, shuffle } = get();
    const ord = get().order();
    if (!ord.length) return;
    if (shuffle && dir === 1) return get().randomNext();
    let idx = activeBeatId ? ord.indexOf(String(activeBeatId)) : -1;
    if (idx === -1) idx = 0;
    const nextId = ord[(idx + dir + ord.length) % ord.length];
    const beat = beatsById.get(nextId);
    if (beat) get().playBeat(beat);
  },

  randomNext: () => {
    const { activeBeatId } = get();
    const ord = get().order();
    if (!ord.length) return;
    let pool = ord.filter((id) => id !== String(activeBeatId));
    if (!pool.length) pool = ord;
    const id = pool[Math.floor(Math.random() * pool.length)];
    const beat = beatsById.get(id);
    if (beat) get().playBeat(beat);
  },

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  toggleRepeat: () => set((s) => ({ repeatOne: !s.repeatOne })),

  close: () => {
    const { el } = get();
    if (el) { el.pause(); el.currentTime = 0; }
    set({ activeBeatId: null, visible: false, isPlaying: false, currentTime: 0 });
  },

  seekPct: (pct) => {
    const { el } = get();
    if (!el || !el.duration) return;
    el.currentTime = Math.max(0, Math.min(1, pct)) * el.duration;
  },

  setVolumePct: (pct) => {
    const { el } = get();
    if (!el) return;
    const v = Math.max(0, Math.min(1, pct));
    el.volume = v;
    el.muted = v === 0;
    localStorage.setItem(VOLUME_KEY, String(v));
    set({ volume: v, muted: v === 0, lastVolume: v > 0 ? v : get().lastVolume });
  },

  toggleMute: () => {
    const { el, lastVolume, muted, volume } = get();
    if (!el) return;
    if (muted || volume === 0) {
      const v = lastVolume > 0 ? lastVolume : 1;
      el.muted = false;
      el.volume = v;
      localStorage.setItem(VOLUME_KEY, String(v));
      set({ muted: false, volume: v });
    } else {
      el.muted = true;
      localStorage.setItem(VOLUME_KEY, '0');
      set({ muted: true, lastVolume: volume });
    }
  },

  _onTime: () => {
    const { el } = get();
    if (!el) return;
    set({ currentTime: el.currentTime, duration: el.duration || 0 });
  },
  _onLoaded: () => {
    const { el } = get();
    if (!el) return;
    set({ duration: el.duration || 0 });
  },
  _onEnded: () => {
    const { el, repeatOne, shuffle } = get();
    if (!el) return;
    if (repeatOne) { el.currentTime = 0; el.play().catch(() => {}); return; }
    if (shuffle) { get().randomNext(); return; }
    const ord = get().order();
    const idx = get().activeBeatId ? ord.indexOf(String(get().activeBeatId)) : -1;
    const atEnd = idx === ord.length - 1;
    if (idx !== -1 && !atEnd) { get().navigate(1); return; }
    set({ isPlaying: false, currentTime: 0 });
  },
  _onPlay: () => set({ isPlaying: true, visible: true }),
  _onPause: () => set({ isPlaying: false }),
}));

export function activeBeat(): Beat | undefined {
  const id = usePlayer.getState().activeBeatId;
  return id ? beatsById.get(String(id)) : undefined;
}
