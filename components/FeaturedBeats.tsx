'use client';
// Client island for the hero's featured beats. Holds the "mounted" flag so the
// cards match the store exactly (including the in-cart indicator, which depends
// on localStorage and must only render after hydration). Also owns the section
// label so its WaveRule can react only when a *featured* beat is playing.
import { useEffect, useState } from 'react';
import type { Beat } from '@/lib/products';
import { usePlayer } from '@/stores/usePlayer';
import BeatCard from './BeatCard';
import WaveRule from './WaveRule';

export default function FeaturedBeats({ beats }: { beats: Beat[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isPlaying = usePlayer((s) => s.isPlaying);
  const activeBeatId = usePlayer((s) => s.activeBeatId);
  const featuredPlaying = isPlaying && beats.some((b) => String(b.id) === String(activeBeatId));

  return (
    <>
      <div className="section-label section-label--hero"><span>Featured Beats</span><WaveRule active={featuredPlaying} /></div>
      <div id="heroFeatured">
        {beats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} mounted={mounted} />
        ))}
      </div>
    </>
  );
}
