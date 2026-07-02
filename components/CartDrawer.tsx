'use client';
import { useEffect } from 'react';
import { getBeat, type LicenseTier } from '@/lib/products';
import { TIER_ORDER } from '@/lib/licenses';
import { coverStyle } from '@/lib/assets';
import { fmtPrice } from '@/lib/format';
import { useUI } from '@/stores/useUI';
import { useCart, beatCartItem } from '@/stores/useCart';
import { usePlayer } from '@/stores/usePlayer';
import { useFocusTrap } from '@/lib/useFocusTrap';

export default function CartDrawer() {
  const cartOpen = useUI((s) => s.cartOpen);
  const drawerRef = useFocusTrap<HTMLElement>(cartOpen);
  const closeCart = useUI((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const setTier = useCart((s) => s.setTier);
  const checkout = useCart((s) => s.checkout);
  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0), 0);

  const toggleBeat = usePlayer((s) => s.toggleBeat);
  const activeBeatId = usePlayer((s) => s.activeBeatId);
  const isPlaying = usePlayer((s) => s.isPlaying);

  useEffect(() => {
    if (!cartOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [cartOpen, closeCart]);

  return (
    <div className={`cart-overlay${cartOpen ? ' active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeCart(); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" ref={drawerRef} tabIndex={-1}>
        <div className="cart-header">
          <span className="cart-header-title">Your Cart</span>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-sub">Add a beat or kit to get started.</p>
            </div>
          ) : (
            items.map((it) => {
              const beat = it.type === 'beat' ? getBeat(it.beatId) : undefined;
              const tierOpts = beat
                ? TIER_ORDER.filter((tk) => beat.licenses[tk] && (beat.licenses[tk]._state === 'addable' || beat.licenses[tk]._state === 'novariant'))
                : [];
              const canPlay = it.type === 'beat' && !!beat?.audioFile;
              const showPause = canPlay && String(it.beatId) === String(activeBeatId) && isPlaying;
              return (
                <div className="cart-item" data-id={it.beatId} key={it.beatId}>
                  <div className={`cart-item-cover${canPlay ? ' cart-item-cover--playable' : ''}`} style={coverStyle(it.imgFile, it.imgGradient)}>
                    {canPlay && (
                      <button className={`cart-item-play${showPause ? ' playing' : ''}`} onClick={(e) => { e.stopPropagation(); if (beat) toggleBeat(beat); }} aria-label={`Play ${it.beatTitle}`}>
                        {showPause
                          ? <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><rect x="5" y="3" width="4" height="18" fill="currentColor" /><rect x="15" y="3" width="4" height="18" fill="currentColor" /></svg>
                          : <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><polygon points="5,3 19,12 5,21" fill="currentColor" /></svg>}
                      </button>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-title">{it.beatTitle}</span>
                    {tierOpts.length > 0 && beat ? (
                      <select className="cart-item-tier" value={it.tierKey} aria-label={`Change tier for ${it.beatTitle}`}
                        onChange={(e) => { const tk = e.target.value as LicenseTier; setTier(beatCartItem(beat, tk, beat.licenses[tk])); }}>
                        {tierOpts.map((tk) => <option key={tk} value={tk}>{beat.licenses[tk].label} (${beat.licenses[tk].price})</option>)}
                      </select>
                    ) : (
                      <span className="cart-item-tier-static">{it.tierLabel}</span>
                    )}
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-price">{fmtPrice(it.price)}</span>
                    <button className="cart-item-remove" onClick={() => remove(it.beatId)} aria-label={`Remove ${it.beatTitle}`}>
                      <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={`cart-footer${items.length === 0 ? ' cart-footer--hidden' : ''}`}>
          <div className="cart-subtotal-row">
            <span className="cart-subtotal-label">Subtotal</span>
            <span className="cart-subtotal-value">{fmtPrice(subtotal)}</span>
          </div>
          <button className="cart-checkout-btn" onClick={checkout}>Checkout</button>
          <button className="cart-clear-btn" onClick={clear}>Clear cart</button>
        </div>
      </aside>
    </div>
  );
}
