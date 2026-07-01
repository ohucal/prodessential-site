'use client';
import type { Kit } from '@/lib/products';
import { coverStyle } from '@/lib/assets';
import { useUI } from '@/stores/useUI';
import { useCart } from '@/stores/useCart';

function isNewKit(dateAdded?: string): boolean {
  return !!dateAdded && (Date.now() - new Date(dateAdded).getTime()) / 86400000 <= 30;
}

export default function KitCard({ kit, mounted }: { kit: Kit; mounted: boolean }) {
  const openKit = useUI((s) => s.openKit);
  const inCart = useCart((s) => s.items.some((it) => String(it.beatId) === String(kit.id)));
  const isNew = isNewKit(kit.dateAdded);
  const comingSoon = kit.checkoutUrl === '#';

  return (
    <div
      className={`beat-card kit-card${mounted && inCart ? ' in-cart' : ''}`}
      data-id={kit.id}
      onClick={() => openKit(kit.id)}
    >
      {comingSoon && <span className="kit-coming-soon-badge">Coming Soon</span>}
      <div className="beat-card-main">
        <div className={`beat-cover${kit.imgFile ? '' : ' no-img'}`} style={coverStyle(kit.imgFile, kit.imgGradient)}></div>
        <div className="beat-info">
          <span className="beat-title-row">
            <span className="beat-title">{kit.title}</span>
            <span className="cart-dot"></span>
            {isNew && <span className="beat-new-badge">NEW</span>}
          </span>
          <span className="beat-bpm-key">{kit.type}</span>
        </div>
        <div className="beat-price-wrap">
          <span className="beat-price">${kit.price}</span>
        </div>
      </div>
    </div>
  );
}
