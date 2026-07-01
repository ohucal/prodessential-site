'use client';
import { useEffect } from 'react';
import { useUI } from '@/stores/useUI';
import { getBeat, getKit } from '@/lib/products';

// Backward-compatible ?beat=/?kit= deep links on the home page, plus URL sync
// when a modal opens/closes there. Per-product pages (/beats/<id>) own their URL.
export default function DeepLink() {
  const activeBeatId = useUI((s) => s.activeBeatId);
  const activeKitId = useUI((s) => s.activeKitId);

  // Initial deep link + back/forward.
  useEffect(() => {
    const apply = () => {
      if (window.location.pathname !== '/') return;
      const p = new URLSearchParams(window.location.search);
      const b = p.get('beat');
      const k = p.get('kit');
      if (b && getBeat(b)) useUI.getState().openBeat(b);
      else if (k && getKit(k)) useUI.getState().openKit(k);
      else { useUI.getState().closeBeat(); useUI.getState().closeKit(); }
    };
    apply();
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, []);

  // Reflect modal state in the URL (home page only).
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    const base = window.location.pathname;
    if (activeBeatId) window.history.replaceState({ beatId: activeBeatId }, '', `?beat=${activeBeatId}`);
    else if (activeKitId) window.history.replaceState({ kitId: activeKitId }, '', `?kit=${activeKitId}`);
    else window.history.replaceState({}, '', base);
  }, [activeBeatId, activeKitId]);

  return null;
}
