'use client';
// Shared beat detail view. Rendered on the standalone /beats/[id] page and inside
// the glass overlay so the two look identical. Cover is playable; purchase is inline.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { beats, freeEligible, type Beat } from '@/lib/products';
import { coverStyle } from '@/lib/assets';
import { track } from '@/lib/analytics';
import { beatVisibleGenre, beatBodyCopy } from '@/lib/keywords';
import { usePlayer } from '@/stores/usePlayer';
import BeatCard from './BeatCard';
import BeatPurchase from './BeatPurchase';

function relatedBeats(id: string, tags: string[]): Beat[] {
  const tagSet = new Set(tags);
  return beats
    .filter((b) => b.id !== id)
    .map((b) => ({ b, score: b.tags.filter((t) => tagSet.has(t)).length }))
    .sort((a, z) => z.score - a.score || +new Date(z.b.dateAdded) - +new Date(a.b.dateAdded))
    .slice(0, 6)
    .map((s) => s.b);
}

export default function BeatDetail({ beat, isModal, onNavigate }: { beat: Beat; isModal?: boolean; onNavigate?: (id: string) => void }) {
  const router = useRouter();
  const toggleBeat = usePlayer((s) => s.toggleBeat);
  const isPlayingThis = usePlayer((s) => s.isPlaying && s.activeBeatId === beat.id);
  const [freeClick, setFreeClick] = useState(0);
  const articleRef = useRef<HTMLElement>(null);
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
    track('view_item', { items: [{ item_id: beat.id, item_name: beat.title }] });
  }, [beat.id, beat.title]);

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
        <div className="beat-detail-art" style={coverStyle(beat.imgFile, beat.imgGradient)}>
          <button className="beat-detail-play" onClick={() => toggleBeat(beat)} aria-label={isPlayingThis ? 'Pause preview' : 'Play preview'}>
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
          <p className="beat-detail-meta">{beat.bpm} BPM &nbsp;·&nbsp; <span className="beat-key">{beat.key}</span></p>
          <div className="beat-tags beat-detail-tags">
            {beat.tags.map((t) => <span key={t} className="beat-tag">{t}</span>)}
          </div>
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
        <h2 className="product-section-title">Licensing for &ldquo;{beat.title}&rdquo;</h2>
        <BeatPurchase beat={beat} freeClick={freeClick} />
        {free && <p className="license-free-note">This beat includes a free tagged download for non-profit use. Credit &ldquo;prod.essential&rdquo; is required. Pick the Free option above to grab it.</p>}
      </section>

      {related.length > 0 && (
        <section className="product-related">
          <h2 className="product-section-title">More from prod.essential</h2>
          <div className="product-related-grid">
            {related.map((b) => (
              <BeatCard key={b.id} beat={b} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
