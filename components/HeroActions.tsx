'use client';
// Client island for the hero's "Browse Beats" / "Shop Kits" CTAs so they can
// smooth-scroll to their in-page sections (same feel as the header nav) instead
// of the browser's instant hash jump. Off-page (product pages), the links fall
// through to normal navigation.
import { onHashNavClick } from '@/lib/scrollNav';

export default function HeroActions() {
  return (
    <div className="hero-actions">
      <a href="/#beats" className="btn-primary" onClick={onHashNavClick}>Browse Beats</a>
      <a href="/#kits" className="btn-ghost" onClick={onHashNavClick}>Shop Kits</a>
    </div>
  );
}
