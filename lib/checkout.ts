// Payhip checkout URL building (ported from the original inline script).
export const CHECKOUT_DOMAIN = 'https://payhip.com';

export interface CartItem {
  beatId: string;
  beatTitle: string;
  tierKey: string;   // license tier key, or 'kit'
  tierLabel: string;
  payhipKey: string | null;
  variantId: string | null;
  price: number | null;
  type: 'beat' | 'kit';
  imgFile: string | null;
  imgGradient: string;
}

// Build ONE combined Payhip cart URL. Each item contributes cart_links[]=KEY,
// qty[KEY]=1, and (only when present) variant_combination[KEY]=VARIANT.
export function buildCheckoutUrl(items: CartItem[]): string {
  const parts: string[] = [];
  items.forEach((it) => {
    if (!it.payhipKey) return;
    const k = encodeURIComponent(it.payhipKey);
    parts.push('cart_links%5B%5D=' + k);
    if (it.variantId) parts.push('variant_combination%5B' + k + '%5D=' + encodeURIComponent(it.variantId));
    parts.push('qty%5B' + k + '%5D=1');
  });
  return CHECKOUT_DOMAIN + '/buy?' + parts.join('&');
}
