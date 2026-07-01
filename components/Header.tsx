'use client';
import { useEffect, useState } from 'react';
import { useUI } from '@/stores/useUI';
import { useCart } from '@/stores/useCart';
import { track } from '@/lib/analytics';

export default function Header() {
  const openCart = useUI((s) => s.openCart);
  const count = useCart((s) => s.items.length);
  // Avoid hydration mismatch: persisted cart count is only known after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showCount = mounted && count > 0;

  return (
    <header>
      <a href="/" className="logo">prod.essential</a>
      <nav>
        <a href="/#beats">Beats</a>
        <a href="/#kits">Kits</a>
        <a
          href="/#newsletter"
          onClick={() => track('weekly_loops_nav_click')}
        >
          Weekly Loops
        </a>
        <a href="/#licensing">Licensing</a>
        <a href="/#contact">Contact</a>
        <a
          href="/#beats"
          className="nav-cta"
          onClick={(e) => {
            // On the home page, filter the store to free beats in place.
            if (document.getElementById('beats')) {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('pe:freebeats'));
            }
          }}
        >
          FREE STUFF
        </a>
        <button className="nav-cart" id="navCartBtn" onClick={openCart} aria-label="Open cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="nav-cart-count" id="navCartCount" hidden={!showCount}>
            {showCount ? count : 0}
          </span>
        </button>
      </nav>
    </header>
  );
}
