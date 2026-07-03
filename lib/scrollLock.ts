// Shared body scroll lock for stacked overlays (glass overlays, cart drawer).
// Refcounted: each open layer takes a lock, and the page only scrolls again
// when every layer has released. A plain `body.style.overflow = ''` in each
// component fights when two layers overlap (e.g. cart open above a beat
// overlay — closing the cart would unlock scrolling behind the overlay).
let locks = 0;

export function lockScroll() {
  locks++;
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.body.style.overflow = '';
}
