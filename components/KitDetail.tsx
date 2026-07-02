'use client';
// Shared kit detail view. Rendered on the standalone /kits/[id] page and inside
// the kit overlay so the two look identical — mirrors BeatDetail for beats.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { kits, type Kit } from '@/lib/products';
import { coverStyle } from '@/lib/assets';
import { trackEcommerce } from '@/lib/analytics';
import { useUI } from '@/stores/useUI';
import { useCart, kitCartItem } from '@/stores/useCart';
import KitCard from './KitCard';

function relatedKits(id: string, type: string): Kit[] {
  return kits
    .filter((k) => k.id !== id)
    .map((k) => ({ k, score: k.type === type ? 1 : 0 }))
    .sort((a, z) => z.score - a.score || +new Date(z.k.dateAdded) - +new Date(a.k.dateAdded))
    .slice(0, 6)
    .map((s) => s.k);
}

export default function KitDetail({ kit, isModal, onNavigate, onBrowseAll }: { kit: Kit; isModal?: boolean; onNavigate?: (id: string) => void; onBrowseAll?: () => void }) {
  const router = useRouter();
  const openCart = useUI((s) => s.openCart);
  const cartAdd = useCart((s) => s.add);
  const buyNow = useCart((s) => s.buyNow);
  const inCart = useCart((s) => s.items.some((it) => String(it.beatId) === String(kit.id)));

  const [addConfirm, setAddConfirm] = useState('');
  const [showViewCart, setShowViewCart] = useState(false);
  const [shareLabel, setShareLabel] = useState('Copy Link');
  const articleRef = useRef<HTMLElement>(null);
  const [navPos, setNavPos] = useState<{ prevLeft: number; nextLeft: number } | null>(null);

  const addable = kit._state === 'addable' || kit._state === 'novariant';
  const related = relatedKits(kit.id, kit.type);

  const currentIndex = kits.findIndex((k) => k.id === kit.id);
  const prevKit = kits[(currentIndex - 1 + kits.length) % kits.length];
  const nextKit = kits[(currentIndex + 1) % kits.length];

  function navigate(id: string) {
    if (onNavigate) onNavigate(id);
    else router.push(`/kits/${id}/`);
  }

  // Return to the kits section without a full reload so any playing beat keeps
  // going — same pattern as BeatDetail's browseAll.
  function browseAll(e: React.MouseEvent) {
    e.preventDefault();
    if (onBrowseAll) onBrowseAll();
    else router.push('/#kits');
  }

  // Reset transient state when the kit changes (modal prev/next navigation).
  useEffect(() => {
    setAddConfirm(''); setShowViewCart(false); setShareLabel('Copy Link');
  }, [kit.id]);

  // Measure the article's viewport-relative position to place fixed arrows exactly
  // 16px outside each content edge — same as the standalone beat page.
  useEffect(() => {
    if (isModal) return;
    const arrowW = 36;
    const gap = 16;
    function update() {
      if (!articleRef.current) return;
      const r = articleRef.current.getBoundingClientRect();
      setNavPos({ prevLeft: r.left - gap - arrowW, nextLeft: r.right + gap });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isModal]);

  useEffect(() => {
    trackEcommerce('view_item', [{ item_id: kit.id, item_name: kit.title, item_variant: kit.type || 'Kit', price: kit.price ?? null }]);
  }, [kit.id, kit.title, kit.type, kit.price]);

  function addToCart() {
    if (!addable) return;
    const result = cartAdd(kitCartItem(kit));
    setAddConfirm(result === 'updated' ? 'Cart updated ✓' : 'Added to cart ✓');
    setShowViewCart(true);
  }
  function copyShare() {
    const url = `${location.origin}/kits/${kit.id}/`;
    navigator.clipboard.writeText(url).then(() => { setShareLabel('Copied!'); setTimeout(() => setShareLabel('Copy Link'), 2000); });
  }

  return (
    <article ref={articleRef} className="beat-detail">
      {!isModal && navPos && (
        <>
          <button className="beat-page-nav" style={{ left: navPos.prevLeft }} onClick={() => navigate(prevKit.id)} aria-label="Previous kit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button className="beat-page-nav" style={{ left: navPos.nextLeft }} onClick={() => navigate(nextKit.id)} aria-label="Next kit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </>
      )}
      <div className="beat-detail-top">
        <div className="beat-detail-art" style={coverStyle(kit.imgFile, kit.imgGradient)} role="img" aria-label={`${kit.title} cover art`}></div>
        <div className="beat-detail-head">
          <p className="beat-detail-kicker">{kit.type}</p>
          <h1 className="beat-detail-title"><em>{kit.title}</em></h1>
          {kit.author && <p className="beat-detail-meta">By {kit.author}</p>}
          {kit.descriptionHtml
            ? <div className="modal-kit-desc kit-detail-desc" dangerouslySetInnerHTML={{ __html: kit.descriptionHtml }} />
            : <p className="beat-detail-copy">{kit.description || ''}</p>}
        </div>
      </div>

      <section className="beat-detail-license">
        <h2 className="product-section-title">Get &ldquo;{kit.title}&rdquo;</h2>
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
        {showViewCart && <button className="modal-view-cart-btn" onClick={openCart}>View Cart →</button>}
        <button className="modal-share-btn kit-detail-share" onClick={copyShare}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          <span>{shareLabel}</span>
        </button>
      </section>

      {related.length > 0 && (
        <section className="product-related">
          <h2 className="product-section-title">More kits &amp; packs</h2>
          <div className="product-related-grid">
            {related.map((k) => (
              <KitCard key={k.id} kit={k} variant="compact" />
            ))}
          </div>
          <a href="/#kits" className="product-related-browse" onClick={browseAll}>Browse all kits &amp; packs</a>
        </section>
      )}
    </article>
  );
}
