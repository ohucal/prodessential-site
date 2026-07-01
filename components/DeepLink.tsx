'use client';
import { useEffect } from 'react';
import { useUI } from '@/stores/useUI';
import { getBeat, getKit } from '@/lib/products';

// Backward-compatible ?beat=/?kit= deep links on the home page. The beat overlay
// owns its own /beats/<id>/ URL (see GlassModal); this only handles the kit modal
// URL sync and the legacy query-string entry points.
export default function DeepLink() {
  const activeKitId = useUI((s) => s.activeKitId);

  // Legacy ?beat= / ?kit= links + kit back/forward on the home page.
  useEffect(() => {
    const apply = () => {
      if (window.location.pathname !== '/') return;
      const p = new URLSearchParams(window.location.search);
      const b = p.get('beat');
      const k = p.get('kit');
      if (b && getBeat(b)) useUI.getState().openBeat(b);
      else if (k && getKit(k)) useUI.getState().openKit(k);
      else useUI.getState().closeKit();
    };
    apply();
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, []);

  // Reflect kit modal state in the URL (home page only).
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    if (activeKitId) window.history.replaceState({ kitId: activeKitId }, '', `?kit=${activeKitId}`);
    else if (!window.location.search.includes('beat=')) window.history.replaceState({}, '', window.location.pathname);
  }, [activeKitId]);

  return null;
}
