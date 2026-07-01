'use client';
import { useEffect, useState } from 'react';
import BeatStore from './BeatStore';
import KitStore from './KitStore';

// Holds the "mounted" flag so cart indicators (which depend on localStorage)
// only render after hydration — avoiding SSR/client mismatch.
export default function LowerGrid() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="lower-grid">
      <BeatStore mounted={mounted} />
      <KitStore mounted={mounted} />
    </div>
  );
}
