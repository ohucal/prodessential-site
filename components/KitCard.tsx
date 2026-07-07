'use client';
import Link from 'next/link';
import type { Kit } from '@/lib/products';
import { coverStyle } from '@/lib/assets';
import { useUI } from '@/stores/useUI';
import { useCart } from '@/stores/useCart';

function isNewKit(dateAdded?: string): boolean {
  return !!dateAdded && (Date.now() - new Date(dateAdded).getTime()) / 86400000 <= 30;
}

type Variant = 'store' | 'compact';

export default function KitCard({ kit, mounted = false, variant = 'store', onOpen }: { kit: Kit; mounted?: boolean; variant?: Variant; onOpen?: (id: string) => void }) {
  const openKit = useUI((s) => s.openKit);
  const inCart = useCart((s) => s.items.some((it) => String(it.beatId) === String(kit.id)));
  // Gated on mounted — see BeatCard.tsx for why (static export build-time vs
  // hydration-time clock mismatch at the 30-day boundary).
  const isNew = mounted && isNewKit(kit.dateAdded);
  const comingSoon = kit.checkoutUrl === '#';
  const compact = variant === 'compact';

  // The card is an <a> (Link) so modifier/middle clicks open the real static
  // page; a plain left-click opens the kit overlay instead — same as BeatCard.
  const openOverlay = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (onOpen) onOpen(kit.id);
    else openKit(kit.id);
  };

  return (
    <Link
      href={`/kits/${kit.id}/`}
      className={`beat-card${compact ? ' beat-card--compact' : ' kit-card'}${mounted && inCart && !compact ? ' in-cart' : ''}${!compact && !comingSoon && isNew ? ' is-new' : ''}`}
      data-id={kit.id}
      onClick={openOverlay}
    >
      <div className="beat-card-main">
        <div className={`beat-cover${kit.imgFile ? '' : ' no-img'}${comingSoon ? ' is-soon' : ''}`} style={coverStyle(kit.imgFile, kit.imgGradient)}>
          {!compact && comingSoon && <span className="cover-soon">Coming Soon</span>}
        </div>
        <div className="beat-info">
          <span className="beat-title-row">
            <span className="beat-title">{kit.title}</span>
            {!compact && !comingSoon && isNew && <span className="new-tag">New</span>}
            {!compact && <span className="cart-dot"></span>}
          </span>
          <span className="beat-bpm-key">{kit.type}</span>
        </div>
        {!compact && (
          <div className="beat-price-wrap">
            <span className="beat-price">${kit.price}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
