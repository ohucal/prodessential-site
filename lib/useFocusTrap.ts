'use client';
// Keyboard focus trap for dialogs/overlays. While active, Tab/Shift+Tab loop
// within the container instead of leaking into the page behind it; on
// deactivation, focus returns to whatever triggered the dialog.
import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables()[0];
    (first || container).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      const toRestore = restoreRef.current;
      if (!toRestore) return;
      // Deferred: GlassModal/KitModal close via window.history.back(), which
      // routes through Next's router (usePathname/useRouter resync on
      // popstate) and that resets focus to <body> for its own route-change
      // handling — after a same-tick or single-rAF restore, not before. A
      // short timeout runs after that settles so our restore is the one
      // that sticks.
      setTimeout(() => toRestore.focus(), 100);
    };
  }, [active]);

  return ref;
}
