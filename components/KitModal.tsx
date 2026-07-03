'use client';
// Glass overlay for kits — the same shell as the beat overlay (GlassModal), with
// KitDetail inside so the overlay and /kits/<id>/ page look identical. URL sync
// (?kit=<id> on the home page) is handled by DeepLink.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getKit, kits } from '@/lib/products';
import { useUI } from '@/stores/useUI';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import KitDetail from './KitDetail';

export default function KitModal() {
  const activeKitId = useUI((s) => s.activeKitId);
  const closeKit = useUI((s) => s.closeKit);
  const openKit = useUI((s) => s.openKit);
  const router = useRouter();
  const pathname = usePathname();
  const kit = activeKitId ? getKit(activeKitId) : undefined;
  const panelRef = useFocusTrap<HTMLDivElement>(!!kit);

  const currentIndex = kit ? kits.findIndex((k) => k.id === kit.id) : -1;
  const prevKit = currentIndex >= 0 ? kits[(currentIndex - 1 + kits.length) % kits.length] : null;
  const nextKit = currentIndex >= 0 ? kits[(currentIndex + 1) % kits.length] : null;

  // Lock body scroll + Escape to dismiss while open. When the cart drawer or
  // license modal is stacked above this overlay, Escape belongs to that layer.
  useEffect(() => {
    if (!kit) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const { cartOpen, licenseModalTier } = useUI.getState();
      if (cartOpen || licenseModalTier) return;
      closeKit();
    };
    document.addEventListener('keydown', onKey);
    return () => { unlockScroll(); document.removeEventListener('keydown', onKey); };
  }, [kit, closeKit]);

  // Close overlay and return home without a full reload (keeps playback alive).
  function goHome(e: React.MouseEvent) {
    e.preventDefault();
    closeKit();
    if (pathname !== '/') router.push('/');
  }

  // Same as goHome but lands on the kits section — used by "Browse all kits"
  // so a playing beat keeps going instead of being cut off by a reload.
  function goBrowse() {
    closeKit();
    if (pathname === '/') {
      requestAnimationFrame(() => document.getElementById('kits')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else {
      router.push('/#kits');
    }
  }

  if (!kit) return null;

  return (
    <div className="glass-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) closeKit(); }}>
      <div className="glass-rail glass-rail--left" onMouseDown={(e) => { if (e.target === e.currentTarget) closeKit(); }} />
      <div className="glass-panel" role="dialog" aria-modal="true" aria-label={`${kit.title} details`} ref={panelRef} tabIndex={-1}>
        <div className="glass-header">
          <Link href="/" className="glass-logo" onClick={goHome}>prod.essential</Link>
          <button className="glass-close" onClick={closeKit} aria-label="Close">
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        {prevKit && (
          <button className="modal-nav-btn modal-nav-prev" onClick={() => openKit(prevKit.id)} aria-label="Previous kit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        {nextKit && (
          <button className="modal-nav-btn modal-nav-next" onClick={() => openKit(nextKit.id)} aria-label="Next kit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
        <div className="glass-panel-scroll">
          <KitDetail kit={kit} isModal onNavigate={openKit} onBrowseAll={goBrowse} />
        </div>
      </div>
      <div className="glass-rail glass-rail--right" onMouseDown={(e) => { if (e.target === e.currentTarget) closeKit(); }} />
    </div>
  );
}
