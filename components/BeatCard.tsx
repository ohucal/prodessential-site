'use client';
import { useRef } from 'react';
import Link from 'next/link';
import type { Beat } from '@/lib/products';
import { freeEligible } from '@/lib/products';
import { coverStyle } from '@/lib/assets';
import { formatTime } from '@/lib/format';
import { usePlayer } from '@/stores/usePlayer';
import { useUI } from '@/stores/useUI';
import { useCart } from '@/stores/useCart';

function isNewBeat(dateAdded?: string): boolean {
  return !!dateAdded && (Date.now() - new Date(dateAdded).getTime()) / 86400000 <= 30;
}

type Variant = 'store' | 'compact';

export default function BeatCard({ beat, mounted = false, variant = 'store' }: { beat: Beat; mounted?: boolean; variant?: Variant }) {
  const isActive = usePlayer((s) => s.activeBeatId === beat.id);
  const isPlaying = usePlayer((s) => s.isPlaying && s.activeBeatId === beat.id);
  const currentTime = usePlayer((s) => (s.activeBeatId === beat.id ? s.currentTime : 0));
  const duration = usePlayer((s) => (s.activeBeatId === beat.id ? s.duration : 0));
  const toggleBeat = usePlayer((s) => s.toggleBeat);
  const seekPct = usePlayer((s) => s.seekPct);
  const openBeat = useUI((s) => s.openBeat);
  const inCart = useCart((s) => s.items.some((it) => String(it.beatId) === String(beat.id)));
  const barRef = useRef<HTMLDivElement>(null);

  const pct = duration ? (currentTime / duration) * 100 : 0;
  const free = freeEligible(beat);
  const isNew = isNewBeat(beat.dateAdded);
  const compact = variant === 'compact';

  const scrub = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    seekPct((clientX - rect.left) / rect.width);
  };

  // The card is an <a> (Link) so clicking navigates to the beat page. Inner
  // controls call preventDefault() to cancel that navigation and act instead.
  const play = (e: React.SyntheticEvent) => { e.preventDefault(); e.stopPropagation(); toggleBeat(beat); };

  // Left-click opens the glass overlay; modifier/middle clicks fall through to the
  // anchor so "open in new tab" still loads the real static page.
  const openOverlay = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    openBeat(beat.id);
  };

  return (
    <Link
      href={`/beats/${beat.id}/`}
      className={`beat-card${mounted && inCart && !compact ? ' in-cart' : ''}${compact ? ' beat-card--compact' : ''}`}
      data-id={beat.id}
      onClick={openOverlay}
    >
      <div className="beat-card-main">
        <div className={`beat-cover${beat.imgFile ? '' : ' no-img'}`} style={coverStyle(beat.imgFile, beat.imgGradient)}>
          <span
            className="card-play-btn"
            role="button"
            tabIndex={0}
            onClick={play}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') play(e); }}
            aria-label="Play preview"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="5" y="3" width="4" height="18" fill="currentColor" /><rect x="15" y="3" width="4" height="18" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><polygon points="5,3 19,12 5,21" fill="currentColor" /></svg>
            )}
          </span>
        </div>
        <div className="beat-info">
          <span className="beat-title-row">
            <span className="beat-title">{beat.title}</span>
            {!compact && <span className="cart-dot"></span>}
          </span>
          <span className="beat-bpm-key">{beat.bpm} BPM · <span className="beat-key">{beat.key}</span></span>
          {!compact && (
            <div className="beat-tags">
              {isNew && <span className="beat-tag beat-tag--new">NEW</span>}
              {beat.tags.map((t) => (
                <span key={t} className="beat-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
        {!compact && (
          <div className="beat-price-wrap">
            {beat.featured && (
              <div className="beat-featured-badge">
                <svg viewBox="0 0 24 24" width="15" height="15"><polygon points="12,2 15.4,7.3 21.5,8.9 17.5,13.8 17.9,20.1 12,17.8 6.1,20.1 6.5,13.8 2.5,8.9 8.6,7.3" fill="#e8c832" /></svg>
              </div>
            )}
            {free ? (
              <div className="beat-price-free">
                <span className="beat-price-free-main">FREE DOWNLOAD
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </span>
                <span className="beat-price-free-sub">or from ${beat.basePrice}</span>
              </div>
            ) : (
              <span className="beat-price">From ${beat.basePrice}</span>
            )}
          </div>
        )}
      </div>
      {!compact && (
        <div
          className={`card-inline-player${isActive ? ' visible' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <div
            className="card-prog-bar"
            ref={barRef}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); scrub(e.clientX); }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrub(e.clientX); }}
          >
            <div className="card-prog-fill" style={{ width: pct + '%' }}></div>
            <div className="card-prog-thumb" style={{ left: pct + '%' }}></div>
          </div>
          <div className="card-time-row">
            <span className="card-time card-time-elapsed">{formatTime(currentTime)}</span>
            <span className="card-time card-time-dur">{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </Link>
  );
}
