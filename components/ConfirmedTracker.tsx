'use client';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';

// Fires the GA4 confirmation event once on mount (parity with confirmed.html).
export default function ConfirmedTracker() {
  useEffect(() => { track('sign_up_confirmed'); }, []);
  return null;
}
