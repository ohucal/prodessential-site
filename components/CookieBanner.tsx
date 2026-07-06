'use client';
// Cookie consent notice wired to Google Consent Mode v2. Consent defaults to
// denied in app/layout.tsx (GA loads cookieless/ping-only until granted). This
// banner only appears when the visitor has not chosen yet; the choice persists
// in localStorage and is re-applied on load by the inline gtag init script, so
// returning visitors are never re-prompted.
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pe_consent';

type Choice = 'granted' | 'denied';

// Consent Mode v2 signals. Analytics + ad signals move together so a future Meta
// Pixel inherits the same choice without extra prompting.
const GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const;

function store(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now() }));
  } catch {
    /* private mode / storage disabled — nothing to persist */
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the notice only when no prior choice is stored.
    let choice: string | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) choice = (JSON.parse(raw) as { choice?: string }).choice ?? null;
    } catch {
      /* ignore parse/storage errors — treat as no choice */
    }
    if (choice !== 'granted' && choice !== 'denied') setVisible(true);
  }, []);

  function accept() {
    store('granted');
    window.gtag?.('consent', 'update', { ...GRANTED });
    setVisible(false);
  }

  function decline() {
    store('denied');
    // Leave consent at its denied default; GA stays cookieless.
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <p className="cookie-banner-text">
        this site uses cookies for analytics. fine with that?{' '}
        <a className="cookie-banner-link" href="/privacy/">
          privacy
        </a>
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-banner-ok" onClick={accept}>
          ok
        </button>
        <button type="button" className="cookie-banner-no" onClick={decline}>
          no thanks
        </button>
      </div>
    </div>
  );
}
