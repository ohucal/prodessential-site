'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/stores/usePlayer';
import { useUI } from '@/stores/useUI';

// Owns the single <audio> element and wires its events into the player store.
export default function AudioEngine() {
  const ref = useRef<HTMLAudioElement>(null);
  const register = usePlayer((s) => s.register);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    register(el);
    const s = usePlayer.getState();
    const onTime = () => s._onTime();
    const onLoaded = () => s._onLoaded();
    const onEnded = () => s._onEnded();
    const onPlay = () => s._onPlay();
    const onPause = () => s._onPause();
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [register]);

  // Space toggles play/pause when not typing and no modal/drawer open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      const ui = useUI.getState();
      const anyModalOpen = ui.cartOpen || !!ui.activeBeatId || !!ui.activeKitId || !!ui.licenseModalTier;
      if (typing || anyModalOpen || !usePlayer.getState().visible) return;
      e.preventDefault();
      usePlayer.getState().toggle();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return <audio id="audioPlayer" ref={ref} preload="none" />;
}
