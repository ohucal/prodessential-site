'use client';
// Inline purchase UI for a beat (license picker + details + free-download flow +
// add-to-cart / buy-now). Rendered on the beat page and inside the glass overlay,
// so both share the exact same buy experience.
import { useEffect, useRef, useState } from 'react';
import { freeEligible, freeFileFor, type Beat, type LicenseTier } from '@/lib/products';
import { LICENSE_DETAILS, LICENSE_KEYS, CONTACT_EMAIL } from '@/lib/licenses';
import { assetUrl } from '@/lib/assets';
import { track, trackEcommerce } from '@/lib/analytics';
import { useUI } from '@/stores/useUI';
import { useCart, beatCartItem } from '@/stores/useCart';

const KIT_FREE_DOWNLOAD_ENDPOINT = 'https://app.kit.com/forms/9627350/subscriptions';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function BeatPurchase({ beat, freeClick }: { beat: Beat; freeClick?: number }) {
  const openLicense = useUI((s) => s.openLicense);
  const openCart = useUI((s) => s.openCart);
  const cartAdd = useCart((s) => s.add);
  const buyNow = useCart((s) => s.buyNow);
  const cartItems = useCart((s) => s.items);

  const [license, setLicense] = useState<LicenseTier | 'free'>('basic');
  const [freeMode, setFreeMode] = useState(false);
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [freeStatus, setFreeStatus] = useState('');
  const [freeBtn, setFreeBtn] = useState('Download Free');
  const [freeSuccess, setFreeSuccess] = useState(false);
  const [addConfirm, setAddConfirm] = useState('');
  const [showViewCart, setShowViewCart] = useState(false);
  const buyRowRef = useRef<HTMLDivElement>(null);

  // Reset transient state when the beat changes.
  useEffect(() => {
    setLicense('basic'); setFreeMode(false); setEmail(''); setAgree(false);
    setFreeStatus(''); setFreeBtn('Download Free'); setFreeSuccess(false);
    setAddConfirm(''); setShowViewCart(false);
  }, [beat.id]);

  // Trigger free download mode when FREE DOWNLOAD link is clicked in BeatDetail.
  useEffect(() => {
    if (freeClick && freeClick > 0) selectFree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeClick]);

  const free = freeEligible(beat);
  const lic = license === 'free' ? null : beat.licenses[license];

  function selectLicense(key: LicenseTier) {
    setLicense(key); setFreeMode(false); setAddConfirm(''); setShowViewCart(false);
    const l = beat.licenses[key];
    trackEcommerce('select_item', [{ item_id: beat.id, item_name: beat.title, item_variant: l?.label || key, price: l?.price ?? null }], { item_list_name: 'Beat Licenses' });
  }
  function selectFree() {
    setLicense('free'); setFreeMode(true);
    trackEcommerce('select_item', [{ item_id: beat.id, item_name: beat.title, item_variant: 'Free', price: 0 }], { item_list_name: 'Beat Licenses' });
  }

  function addToCart() {
    if (!lic || (lic._state !== 'addable' && lic._state !== 'novariant')) return;
    const result = cartAdd(beatCartItem(beat, license as LicenseTier, lic));
    setAddConfirm(result === 'updated' ? 'Cart updated ✓' : 'Added to cart ✓');
    setShowViewCart(true);
  }
  function doBuyNow() {
    if (!lic || (lic._state !== 'addable' && lic._state !== 'novariant')) return;
    buyNow(beatCartItem(beat, license as LicenseTier, lic));
  }

  async function submitFree(e: React.FormEvent) {
    e.preventDefault();
    if (!free || !isValidEmail(email) || !agree) return;
    setFreeBtn('Sending...'); setFreeStatus('');
    try {
      const fd = new FormData();
      fd.append('email_address', email);
      const res = await fetch(KIT_FREE_DOWNLOAD_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      if (!res.ok) throw new Error('fail');
      const a = document.createElement('a');
      a.href = assetUrl(freeFileFor(beat));
      a.download = `[@prod.essential] - ${beat.bpm} - ${beat.key} - ${beat.title} [FREE FOR NON-PROFIT].mp3`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setFreeSuccess(true);
      track('generate_lead', { beat_id: beat.id, beat_title: beat.title });
    } catch {
      setFreeStatus('Something went wrong, try again.');
      setFreeBtn('Download Free');
    }
  }

  const details = license === 'free' ? null : LICENSE_DETAILS[license];
  const state = lic?._state;
  const inCartThisTier = cartItems.some((it) => it.beatId === beat.id && it.tierKey === license);
  const priceText = !lic ? '' : lic.price === null ? 'Negotiable' : '$' + lic.price;

  return (
    <div className="beat-purchase">
      <div className="beat-purchase-picker">
        <div className="modal-license-grid">
          {free && <button className={`modal-license-btn modal-license-btn--free${license === 'free' ? ' active' : ''}`} onClick={selectFree}><span className="modal-license-name">Free</span></button>}
          {LICENSE_KEYS.map((key) => beat.licenses[key] && (
            <button
              key={key}
              className={`modal-license-btn${key === 'premium' ? ' modal-license-btn--premium' : ''}${key === license ? ' active' : ''}`}
              onClick={() => selectLicense(key)}
            >
              <span className="modal-license-name">{beat.licenses[key].label}</span>
              {key === 'premium' && <span className="modal-license-popular">Most Popular</span>}
              {beat.licenses[key].price !== null && <span className="modal-license-price">{`$${beat.licenses[key].price}`}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="beat-purchase-detail">
        {!freeMode && details && (
          <div className="modal-license-details">
            <span className="modal-license-format">{details.format}</span>
            <ul className="modal-license-bullets">{details.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <a href="#" className="modal-read-license" onClick={(e) => { e.preventDefault(); openLicense(license); }}>Read Full License →</a>
          </div>
        )}

        {freeMode && (
          <div className="modal-free-panel">
            <p className="modal-free-summary">Free tagged demo for non-profit use. Drop your email and it unlocks instantly.</p>
            <ul className="modal-license-bullets modal-free-bullets">
              <li>Non-profit / demo use only</li>
              <li>Keep the tag + credit &ldquo;Prod. essential&rdquo;</li>
              <li>No distribution, monetization, or stores</li>
              <li>Buy a license to release commercially</li>
            </ul>
            {!freeSuccess ? (
              <form className="modal-free-form" onSubmit={submitFree}>
                <input type="email" className="modal-free-input" placeholder="YOUR EMAIL ADDRESS" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="modal-free-agree">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>I agree to the <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openLicense('free'); }}>Free License terms</a></span>
                </label>
                <button type="submit" className="modal-free-btn" disabled={!(isValidEmail(email) && agree) || freeBtn === 'Sending...'}>{freeBtn}</button>
                <p className={`modal-free-status${freeStatus ? ' modal-free-status--error' : ''}`} aria-live="polite">{freeStatus}</p>
              </form>
            ) : (
              <div className="modal-free-success">
                <p className="modal-free-success-msg">Download started.</p>
                <a href="#" className="modal-free-upsell" onClick={(e) => { e.preventDefault(); selectLicense('premium'); buyRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}>Want it untagged for release? Get the Premium license →</a>
              </div>
            )}
          </div>
        )}

        {!freeMode && (
          <div className="modal-buy-row" ref={buyRowRef}>
            <div className="modal-buy-main">
              <div className="modal-price-wrap">
                <span className="modal-price-label">Price</span>
                <span className="modal-price-value">{priceText}</span>
              </div>
              <div className={`modal-buy-actions${state === 'contact' ? ' modal-buy-actions--single' : ''}`}>
                {state === 'contact' ? (
                  <button className="modal-add-btn" type="button" onClick={() => { window.location.href = CONTACT_EMAIL; }}>Get In Touch</button>
                ) : state === 'unavailable' || state === 'misconfigured' ? (
                  <>
                    <button className="modal-add-btn modal-btn--disabled" type="button" disabled>Coming Soon</button>
                    <button className="modal-buy-btn--secondary modal-btn--disabled" type="button" disabled>Unavailable</button>
                  </>
                ) : (
                  <>
                    <button className="modal-add-btn" type="button" onClick={addToCart}>{inCartThisTier ? 'In Cart ✓' : 'Add to Cart'}</button>
                    <button className="modal-buy-btn--secondary" type="button" onClick={doBuyNow}>Buy Now</button>
                  </>
                )}
              </div>
            </div>
            {(state === 'addable' || state === 'novariant') && (
              <p className="modal-trust-strip">Instant delivery&nbsp;&nbsp;·&nbsp;&nbsp;Secure Payhip checkout&nbsp;&nbsp;·&nbsp;&nbsp;Written license included</p>
            )}
          </div>
        )}
        {addConfirm && <div className="modal-add-confirm visible" aria-live="polite">{addConfirm}</div>}
        {showViewCart && <button className="modal-view-cart-btn" onClick={openCart}>View Cart →</button>}
      </div>
    </div>
  );
}
