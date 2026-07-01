'use client';
import { useEffect, useState } from 'react';
import { getKit, kits } from '@/lib/products';
import { coverStyle } from '@/lib/assets';
import { track } from '@/lib/analytics';
import { useUI } from '@/stores/useUI';
import { useCart, kitCartItem } from '@/stores/useCart';

export default function KitModal() {
  const activeKitId = useUI((s) => s.activeKitId);
  const closeKit = useUI((s) => s.closeKit);
  const openKit = useUI((s) => s.openKit);
  const openCart = useUI((s) => s.openCart);
  const cartAdd = useCart((s) => s.add);
  const buyNow = useCart((s) => s.buyNow);
  const inCart = useCart((s) => (activeKitId ? s.items.some((it) => String(it.beatId) === String(activeKitId)) : false));

  const kit = activeKitId ? getKit(activeKitId) : undefined;
  const [addConfirm, setAddConfirm] = useState('');
  const [showViewCart, setShowViewCart] = useState(false);
  const [shareLabel, setShareLabel] = useState('Copy Link');

  useEffect(() => {
    if (!kit) return;
    setAddConfirm(''); setShowViewCart(false); setShareLabel('Copy Link');
    track('view_item', { items: [{ item_id: kit.id, item_name: kit.title }] });
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeKit(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [kit, closeKit]);

  if (!kit) return null;
  const addable = kit._state === 'addable' || kit._state === 'novariant';

  function navigate(dir: 1 | -1) {
    const ord = [...kits].sort((a, b) => +new Date(b.dateAdded) - +new Date(a.dateAdded)).map((k) => String(k.id));
    const idx = ord.indexOf(String(kit!.id));
    if (idx === -1) return;
    openKit(ord[(idx + dir + ord.length) % ord.length]);
  }
  function addToCart() {
    if (!addable) return;
    const result = cartAdd(kitCartItem(kit!));
    setAddConfirm(result === 'updated' ? 'Cart updated ✓' : 'Added to cart ✓');
    setShowViewCart(true);
  }
  function copyShare() {
    const url = `${location.origin}/kits/${kit!.id}/`;
    navigator.clipboard.writeText(url).then(() => { setShareLabel('Copied!'); setTimeout(() => setShareLabel('Copy Link'), 2000); });
  }

  return (
    <div className="glass-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) closeKit(); }}>
      <div className="glass-rail" onMouseDown={(e) => { if (e.target === e.currentTarget) closeKit(); }} />
      <div className="glass-panel" role="dialog" aria-modal="true" aria-label={`${kit.title} details`}>
        <button className="glass-close" onClick={closeKit} aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <button className="modal-nav-btn modal-nav-prev" onClick={() => navigate(-1)} aria-label="Previous kit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button className="modal-nav-btn modal-nav-next" onClick={() => navigate(1)} aria-label="Next kit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <div className="glass-panel-scroll">
          <div className="modal-top-row">
            <div className="modal-art-col modal-art-col--kit">
              <div className="modal-cover-art modal-cover-art--kit" style={coverStyle(kit.imgFile, kit.imgGradient)}></div>
            </div>
            <div className="modal-header-col">
              <span className="modal-kit-type">{kit.type}</span>
              <h2 className="modal-title">{kit.title}</h2>
              {kit.author && <p className="modal-kit-author">{kit.author}</p>}
              {kit.descriptionHtml
                ? <p className="modal-kit-desc" dangerouslySetInnerHTML={{ __html: kit.descriptionHtml }} />
                : <p className="modal-kit-desc">{kit.description || ''}</p>}
            </div>
          </div>

          <div className="modal-info">
            <div className="modal-buy-row">
              <div className="modal-price-wrap">
                <span className="modal-price-label">Price</span>
                <span className="modal-price-value">${kit.price}</span>
              </div>
              <div className="modal-buy-actions">
                {addable ? (
                  <>
                    <button className="modal-add-btn" type="button" onClick={addToCart}>{inCart ? 'In Cart ✓' : 'Add to Cart'}</button>
                    <button className="modal-buy-btn--secondary" type="button" onClick={() => buyNow(kitCartItem(kit))}>Buy Now</button>
                  </>
                ) : (
                  <>
                    <button className="modal-add-btn modal-btn--disabled" type="button" disabled>Coming Soon</button>
                    <button className="modal-buy-btn--secondary modal-btn--disabled" type="button" disabled>Unavailable</button>
                  </>
                )}
              </div>
            </div>
            {addConfirm && <div className="modal-add-confirm visible" aria-live="polite">{addConfirm}</div>}
            {showViewCart && <button className="modal-view-cart-btn" onClick={() => { closeKit(); openCart(); }}>View Cart →</button>}
            <button className="modal-share-btn" onClick={copyShare}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              <span>{shareLabel}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="glass-rail" onMouseDown={(e) => { if (e.target === e.currentTarget) closeKit(); }} />
    </div>
  );
}
