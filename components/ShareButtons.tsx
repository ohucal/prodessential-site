'use client';
// Copy Link + native Share for beat/kit detail views. Always builds the canonical
// `${origin}${path}` URL (e.g. /beats/<id>/) so a link shared from inside a glass
// overlay resolves to the real static page — which carries that item's own OG
// title/image — instead of the site root's default social card.
import { useEffect, useState } from 'react';

export default function ShareButtons({ path, title, className }: { path: string; title: string; className?: string }) {
  const [label, setLabel] = useState('Copy Link');
  const [canShare, setCanShare] = useState(false);

  // Web Share API is mobile-mostly; detect after mount so SSR/hydration match.
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const url = () => `${location.origin}${path}`;

  function copy() {
    navigator.clipboard.writeText(url()).then(() => {
      setLabel('Copied!');
      setTimeout(() => setLabel('Copy Link'), 2000);
    });
  }

  async function share() {
    try {
      await navigator.share({ title, url: url() });
    } catch {
      /* user cancelled or share failed — no-op */
    }
  }

  return (
    <div className={`share-row${className ? ` ${className}` : ''}`}>
      <button className="modal-share-btn" type="button" onClick={copy}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        <span>{label}</span>
      </button>
      {canShare && (
        <button className="modal-share-btn" type="button" onClick={share} aria-label="Share">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          <span>Share</span>
        </button>
      )}
    </div>
  );
}
