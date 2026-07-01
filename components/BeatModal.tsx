'use client';
import { useEffect, useRef, useState } from 'react';
import { getBeat, freeEligible, freeFileFor, type LicenseTier } from '@/lib/products';
import { LICENSE_DETAILS, LICENSE_KEYS, CONTACT_EMAIL } from '@/lib/licenses';
import { coverStyle, assetUrl } from '@/lib/assets';
import { track } from '@/lib/analytics';
import { useUI } from '@/stores/useUI';
import { useCart, beatCartItem } from '@/stores/useCart';
import { usePlayer } from '@/stores/usePlayer';

const KIT_FREE_DOWNLOAD_ENDPOINT = 'https://app.kit.com/forms/9627350/subscriptions';

function isNew(dateAdded?: string) {
  return !!dateAdded && (Date.now() - new Date(dateAdded).getTime()) / 86400000 <= 30;
}
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function BeatModal() {
  const activeBeatId = useUI((s) => s.activeBeatId);
  const closeBeat = useUI((s) => s.closeBeat);
  const openBeat = useUI((s) => s.openBeat);
  const openLicense = useUI((s) => s.openLicense);
  const openCart = useUI((s) => s.openCart);
  const cartAdd = useCart((s) => s.add);
  const buyNow = useCart((s) => s.buyNow);
  const cartItems = useCart((s) => s.items);
  const toggleBeat = usePlayer((s) => s.toggleBeat);
  const order = usePlayer((s) => s.order);
  const isPlayingThis = usePlayer((s) => s.isPlaying && s.activeBeatId === activeBeatId);

  const beat = activeBeatId ? getBeat(activeBeatId) : undefined;
  const [license, setLicense] = useState<LicenseTier | 'free'>('basic');
  const [freeMode, setFreeMode] = useState(false);
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [freeStatus, setFreeStatus] = useState('');
  const [freeBtn, setFreeBtn] = useState('Download Free');
  const [freeSuccess, setFreeSuccess] = useState(false);
  const [addConfirm, setAddConfirm] = useState('');
  const [showViewCart, setShowViewCart] = useState(false);
  const [shareLabel, setShareLabel] = useState('Copy Link');
  const buyRowRef = useRef<HTMLDivElement>(null);

  // Reset transient state when the beat changes; fire view_item + lock scroll.
  useEffect(() => {
    if (!beat) return;
    setLicense('basic'); setFreeMode(false); setEmail(''); setAgree(false);
    setFreeStatus(''); setFreeBtn('Download Free'); setFreeSuccess(false);
    setAddConfirm(''); setShowViewCart(false); setShareLabel('Copy Link');
    track('view_item', { items: [{ item_id: beat.id, item_name: beat.title }] });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [beat]);

  // Escape to close.
  useEffect(() => {
    if (!beat) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeBeat(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [beat, closeBeat]);

  if (!beat) return null;

  const free = freeEligible(beat);
  const lic = license === 'free' ? null : beat.licenses[license];

  function selectLicense(key: LicenseTier) {
    setLicense(key); setFreeMode(false); setAddConfirm(''); setShowViewCart(false);
    if (beat) track('select_item', { beat_id: beat.id, tier: beat.licenses[key]?.label || key });
  }
  function selectFree() {
    setLicense('free'); setFreeMode(true);
    if (beat) track('select_item', { beat_id: beat.id, tier: 'Free' });
  }

  function navigate(dir: 1 | -1) {
    const ord = order();
    const idx = ord.indexOf(String(beat!.id));
    if (idx === -1) return;
    openBeat(ord[(idx + dir + ord.length) % ord.length]);
  }

  function addToCart() {
    if (!beat || !lic || (lic._state !== 'addable' && lic._state !== 'novariant')) return;
    const result = cartAdd(beatCartItem(beat, license as LicenseTier, lic));
    setAddConfirm(result === 'updated' ? 'Cart updated ✓' : 'Added to cart ✓');
    setShowViewCart(true);
  }
  function doBuyNow() {
    if (!beat || !lic || (lic._state !== 'addable' && lic._state !== 'novariant')) return;
    buyNow(beatCartItem(beat, license as LicenseTier, lic));
  }

  async function submitFree(e: React.FormEvent) {
    e.preventDefault();
    if (!beat || !free || !isValidEmail(email) || !agree) return;
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
      setFreeStatus('Something went wrong — try again.');
      setFreeBtn('Download Free');
    }
  }

  function copyShare() {
    const url = `${location.origin}/beats/${beat!.id}/`;
    navigator.clipboard.writeText(url).then(() => {
      setShareLabel('Copied!');
      setTimeout(() => setShareLabel('Copy Link'), 2000);
    });
  }

  const details = license === 'free' ? null : LICENSE_DETAILS[license];
  const state = lic?._state;
  const inCartThisTier = cartItems.some((it) => it.beatId === beat.id && it.tierKey === license);
  const priceText = !lic ? '' : lic.price === null ? 'Negotiable' : '$' + lic.price;

  return (
    <div className="modal-overlay active" id="modalOverlay" onClick={(e) => { if (e.target === e.currentTarget) closeBeat(); }}>
      <div className="modal" id="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={closeBeat} aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <button className="modal-nav-btn modal-nav-prev" onClick={() => navigate(-1)} aria-label="Previous beat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button className="modal-nav-btn modal-nav-next" onClick={() => navigate(1)} aria-label="Next beat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <div className="modal-top-row">
          <div className="modal-art-col">
            <div className="modal-cover-art" id="modalCoverArt" style={coverStyle(beat.imgFile, beat.imgGradient)}>
              <button className="modal-play-btn" onClick={() => toggleBeat(beat)} aria-label="Play/Pause">
                {isPlayingThis ? (
                  <svg className="pause-icon" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="4" height="18" fill="currentColor" /><rect x="15" y="3" width="4" height="18" fill="currentColor" /></svg>
                ) : (
                  <svg className="play-icon" viewBox="0 0 24 24" fill="none"><polygon points="5,3 19,12 5,21" fill="currentColor" /></svg>
                )}
              </button>
            </div>
          </div>
          <div className="modal-header-col">
            <h2 className="modal-title">{beat.title}</h2>
            <span className="modal-bpm-key">{beat.bpm} BPM &nbsp;/&nbsp; <span className="beat-key">{beat.key}</span></span>
            <div className="modal-tags">
              {beat.featured && <span className="modal-tag modal-tag--featured"><svg viewBox="0 0 24 24" width="11" height="11"><polygon points="12,2 15.4,7.3 21.5,8.9 17.5,13.8 17.9,20.1 12,17.8 6.1,20.1 6.5,13.8 2.5,8.9 8.6,7.3" fill="#111111" /></svg>Featured</span>}
              {isNew(beat.dateAdded) && <span className="modal-tag modal-tag--new">NEW</span>}
              {beat.tags.map((t) => <span key={t} className="modal-tag">{t}</span>)}
            </div>
            <div className="modal-free-tag-row">
              {free && (
                <span className="modal-tag modal-tag--free" onClick={selectFree}>FREE DOWNLOAD AVAILABLE
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-info">
          <div className="modal-license-wrap">
            <label className="modal-license-label">Select License</label>
            <div className="modal-license-grid">
              {free && <button className={`modal-license-btn modal-license-btn--free${license === 'free' ? ' active' : ''}`} onClick={selectFree}>Free</button>}
              {LICENSE_KEYS.map((key) => beat.licenses[key] && (
                <button key={key} className={`modal-license-btn${key === license ? ' active' : ''}`} onClick={() => selectLicense(key)}>{beat.licenses[key].label}</button>
              ))}
            </div>

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
                    <p className="modal-free-success-msg">Download started. Check your email for a backup link.</p>
                    <a href="#" className="modal-free-upsell" onClick={(e) => { e.preventDefault(); selectLicense('premium'); buyRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}>Want it untagged for release? Get the Premium license →</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {!freeMode && (
            <div className="modal-buy-row" ref={buyRowRef}>
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
          )}
          {addConfirm && <div className="modal-add-confirm visible" aria-live="polite">{addConfirm}</div>}
          {showViewCart && <button className="modal-view-cart-btn" onClick={() => { closeBeat(); openCart(); }}>View Cart →</button>}

          <button className="modal-share-btn" onClick={copyShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
            <span>{shareLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
