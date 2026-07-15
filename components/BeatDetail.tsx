'use client';
// Shared beat detail view. Rendered on the standalone /beats/[id] page and inside
// the glass overlay so the two look identical. Cover is playable; purchase is inline.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { beats, freeEligible, type Beat } from '@/lib/products';
import { NEW_TAG_FONT, NEW_TAG_FONTS } from '@/lib/newTag';
import { coverStyle } from '@/lib/assets';
import { trackEcommerce } from '@/lib/analytics';
import { beatVisibleGenre, beatBodyCopy } from '@/lib/keywords';
import { usePlayer } from '@/stores/usePlayer';
import { useBeatPulse } from '@/lib/useBeatPulse';
import { scrollToTopThen } from '@/lib/scrollNav';
import BeatCard from './BeatCard';
import BeatPurchase from './BeatPurchase';
import ShareButtons from './ShareButtons';
import WaveRule from './WaveRule';

function isNewBeat(dateAdded?: string): boolean {
  return !!dateAdded && (Date.now() - new Date(dateAdded).getTime()) / 86400000 <= 30;
}

function relatedBeats(id: string, tags: string[]): Beat[] {
  const tagSet = new Set(tags);
  return beats
    .filter((b) => b.id !== id)
    .map((b) => ({ b, score: b.tags.filter((t) => tagSet.has(t)).length }))
    .sort((a, z) => z.score - a.score || +new Date(z.b.dateAdded) - +new Date(a.b.dateAdded))
    .slice(0, 6)
    .map((s) => s.b);
}

export default function BeatDetail({ beat, isModal, onNavigate, onBrowseAll }: { beat: Beat; isModal?: boolean; onNavigate?: (id: string) => void; onBrowseAll?: () => void }) {
  const router = useRouter();
  const toggleBeat = usePlayer((s) => s.toggleBeat);
  const isPlayingThis = usePlayer((s) => s.isPlaying && s.activeBeatId === beat.id);
  // Pulse the play button (not the artwork) to the beat on the large header.
  const pulseRef = useBeatPulse<HTMLButtonElement>(isPlayingThis);
  const [freeClick, setFreeClick] = useState(0);
  // Gated on mount — see BeatCard.tsx for why (static export build-time vs
  // hydration-time clock mismatch at the 30-day "new" boundary).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isNew = mounted && isNewBeat(beat.dateAdded);

  // Dev-only helper to audition the "NEW" sticker fonts without a rebuild:
  // run window.setNewFont('anton') in the console (options logged on load).
  // Once you've picked one, set NEW_TAG_FONT in lib/newTag.ts to keep it.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    (window as unknown as { setNewFont?: (f: string) => void }).setNewFont = (f: string) => {
      document.querySelectorAll('.new-stamp').forEach((el) => el.setAttribute('data-newfont', f));
      console.log(`NEW sticker font → ${f}`);
    };
    console.log(`Try window.setNewFont('<key>'). Options: ${NEW_TAG_FONTS.join(', ')}`);
  }, []);
  const articleRef = useRef<HTMLElement>(null);
  const relatedRef = useRef<HTMLElement>(null);
  const [navPos, setNavPos] = useState<{ prevLeft: number; nextLeft: number } | null>(null);

  const free = freeEligible(beat);
  const related = relatedBeats(beat.id, beat.tags);

  const currentIndex = beats.findIndex((b) => b.id === beat.id);
  const prevBeat = beats[(currentIndex - 1 + beats.length) % beats.length];
  const nextBeat = beats[(currentIndex + 1) % beats.length];

  function navigate(id: string) {
    if (onNavigate) onNavigate(id);
    else router.push(`/beats/${id}/`);
  }

  // Related-beat click: glide back to the top first, then swap the beat in once
  // the suggestions strip is out of view — reads like a seamless page change.
  function openRelated(id: string) {
    const container = articleRef.current?.closest<HTMLElement>('.glass-panel-scroll') ?? null;
    scrollToTopThen(container, relatedRef.current, () => {
      if (onNavigate) onNavigate(id);
      else router.push(`/beats/${id}/`, { scroll: false });
    });
  }

  // Return to the beat store without a full reload so any playing beat keeps
  // going. In the overlay, onBrowseAll closes it and restores the home URL;
  // on the standalone page, a client-side push preserves the persistent player.
  function browseAll(e: React.MouseEvent) {
    e.preventDefault();
    if (onBrowseAll) onBrowseAll();
    else router.push('/#beats');
  }

  // Measure the article's viewport-relative position to place fixed arrows exactly
  // 16px outside each content edge — symmetric regardless of scrollbar width.
  useEffect(() => {
    if (isModal) return;
    const arrowW = 36;
    const gap = 16;
    function update() {
      if (!articleRef.current) return;
      const r = articleRef.current.getBoundingClientRect();
      setNavPos({ prevLeft: r.left - gap - arrowW, nextLeft: r.right + gap });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isModal]);

  useEffect(() => {
    trackEcommerce('view_item', [{ item_id: beat.id, item_name: beat.title, price: beat.basePrice ?? null }]);
  }, [beat.id, beat.title, beat.basePrice]);

  return (
    <article ref={articleRef} className="beat-detail">
      {!isModal && navPos && (
        <>
          <button className="beat-page-nav" style={{ left: navPos.prevLeft }} onClick={() => navigate(prevBeat.id)} aria-label="Previous beat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button className="beat-page-nav" style={{ left: navPos.nextLeft }} onClick={() => navigate(nextBeat.id)} aria-label="Next beat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </>
      )}
      <div className="beat-detail-top">
        {isNew && <span className="new-stamp" data-newfont={NEW_TAG_FONT}>New</span>}
        <div className="beat-detail-art" style={coverStyle(beat.imgFile, beat.imgGradient)}>
          <button ref={pulseRef} className="beat-detail-play" onClick={() => toggleBeat(beat)} aria-label={isPlayingThis ? 'Pause preview' : 'Play preview'}>
            {isPlayingThis ? (
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22"><rect x="5" y="3" width="4" height="18" fill="currentColor" /><rect x="15" y="3" width="4" height="18" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22"><polygon points="5,3 19,12 5,21" fill="currentColor" /></svg>
            )}
          </button>
        </div>
        <div className="beat-detail-head">
          <p className="beat-detail-kicker">{beatVisibleGenre(beat)}</p>
          <h1 className="beat-detail-title"><em>{beat.title}</em></h1>
          {free && (
            <button className="beat-detail-free" onClick={() => setFreeClick((c) => c + 1)} aria-label="Select free download">
              FREE DOWNLOAD
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          )}
          <p className="beat-detail-copy">{beatBodyCopy(beat)}</p>
        </div>
      </div>

      <section className="beat-detail-license">
        <h2 className="product-section-title product-section-title--wave">
          <span>Licensing for &ldquo;{beat.title}&rdquo;</span>
          <WaveRule active={isPlayingThis} />
        </h2>
        <BeatPurchase beat={beat} freeClick={freeClick} />
        {free && <p className="license-free-note">This beat includes a free tagged download for non-profit use. Credit &ldquo;prod.essential&rdquo; is required. Pick the Free option above to grab it.</p>}
        <ShareButtons path={`/beats/${beat.id}/`} title={beat.title} className="beat-detail-share" />
      </section>

      {related.length > 0 && (
        <section className="product-related" ref={relatedRef}>
          <h2 className="product-section-title">More of my beats</h2>
          <div className="product-related-grid">
            {related.map((b) => (
              <BeatCard key={b.id} beat={b} variant="compact" onOpen={openRelated} />
            ))}
          </div>
          <a href="/#beats" className="product-related-browse" onClick={browseAll}>Browse all beats</a>
        </section>
      )}
    </article>
  );
}
