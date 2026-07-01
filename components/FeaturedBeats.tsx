'use client';
// Client island for the hero's featured beats. Holds the "mounted" flag so the
// cards match the store exactly (including the in-cart indicator, which depends
// on localStorage and must only render after hydration).
import { useEffect, useState } from 'react';
import type { Beat } from '@/lib/products';
import BeatCard from './BeatCard';

export default function FeaturedBeats({ beats }: { beats: Beat[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div id="heroFeatured">
      {beats.map((beat) => (
        <BeatCard key={beat.id} beat={beat} mounted={mounted} />
      ))}
    </div>
  );
}
