'use client';
// Glass overlay that shows a beat's full detail view over the live site, with the
// URL synced to /beats/<id>/ via history so it reads as a real page. Static-export
// friendly (no server interception): direct loads / refresh hit the static page.
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { beats, getBeat } from '@/lib/products';
import { useUI } from '@/stores/useUI';
import { useFocusTrap } from '@/lib/useFocusTrap';
import BeatDetail from './BeatDetail';

export default function GlassModal() {
  const activeBeatId = useUI((s) => s.activeBeatId);
  const closeBeat = useUI((s) => s.closeBeat);
  const openBeat = useUI((s) => s.openBeat);
  const router = useRouter();
  const pathname = usePathname();
  const pushed = useRef(false);
  const beat = activeBeatId ? getBeat(activeBeatId) : undefined;
  const panelRef = useFocusTrap<HTMLDivElement>(!!beat);

  const currentIndex = beat ? beats.findIndex((b) => b.id === beat.id) : -1;
  const prevBeat = currentIndex >= 0 ? beats[(currentIndex - 1 + beats.length) % beats.length] : null;
  const nextBeat = currentIndex >= 0 ? beats[(currentIndex + 1) % beats.length] : null;

  // Sync the URL to /beats/<id>/ while the overlay is open.
  useEffect(() => {
    if (!activeBeatId) return;
    const url = `/beats/${activeBeatId}/`;
    if (!pushed.current) {
      window.history.pushState({ beatOverlay: activeBeatId }, '', url);
      pushed.current = true;
    } else {
      window.history.replaceState({ beatOverlay: activeBeatId }, '', url);
    }
  }, [activeBeatId]);

  // Back button / gesture closes the overlay and restores the previous URL.
  useEffect(() => {
    const onPop = () => { pushed.current = false; closeBeat(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [closeBeat]);

  // Lock body scroll + Escape to dismiss while open.
  useEffect(() => {
    if (!beat) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  function dismiss() {
    if (pushed.current) window.history.back(); // popstate handler runs closeBeat
    else closeBeat();
  }

  // Close overlay and return home without a full reload (keeps playback alive).
  function goHome(e: React.MouseEvent) {
    e.preventDefault();
    pushed.current = false;
    closeBeat();
    if (pathname === '/') window.history.replaceState({}, '', '/');
    else router.push('/');
  }

  // Same as goHome but lands on the beat store section — used by "Browse all
  // beats" so a playing beat keeps going instead of being cut off by a reload.
  function goBrowse() {
    pushed.current = false;
    closeBeat();
    if (pathname === '/') {
      window.history.replaceState({}, '', '/#beats');
      requestAnimationFrame(() => document.getElementById('beats')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else {
      router.push('/#beats');
    }
  }

  if (!beat) return null;

  return (
    <div className="glass-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div className="glass-rail glass-rail--left" onMouseDown={(e) => { if (e.target === e.currentTarget) dismiss(); }} />
      <div className="glass-panel" role="dialog" aria-modal="true" aria-label={`${beat.title} details`} ref={panelRef} tabIndex={-1}>
        <div className="glass-header">
          <Link href="/" className="glass-logo" onClick={goHome}>prod.essential</Link>
          <button className="glass-close" onClick={dismiss} aria-label="Close">
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        {prevBeat && (
          <button className="modal-nav-btn modal-nav-prev" onClick={() => openBeat(prevBeat.id)} aria-label="Previous beat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        {nextBeat && (
          <button className="modal-nav-btn modal-nav-next" onClick={() => openBeat(nextBeat.id)} aria-label="Next beat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
        <div className="glass-panel-scroll">
          <BeatDetail beat={beat} isModal onBrowseAll={goBrowse} />
        </div>
      </div>
      <div className="glass-rail glass-rail--right" onMouseDown={(e) => { if (e.target === e.currentTarget) dismiss(); }} />
    </div>
  );
}
