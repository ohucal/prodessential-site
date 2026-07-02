// Thin gtag wrapper — safe to call before/without GA loaded.
type GtagArgs = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = 'G-9XBRPVVXPP';
export const CURRENCY = 'USD';

export function track(event: string, params?: GtagArgs): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

// A single GA4 ecommerce line item. Prices may be null (negotiable/exclusive).
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price?: number | null;
  [key: string]: unknown;
}

// GA4 ecommerce event: attaches `currency` and a computed `value` (sum of item
// prices, ignoring null/negotiable) so monetization + funnel reports populate.
export function trackEcommerce(event: string, items: EcommerceItem[], extra?: GtagArgs): void {
  const value = items.reduce((sum, it) => sum + (typeof it.price === 'number' ? it.price : 0), 0);
  track(event, { currency: CURRENCY, value, items, ...extra });
}
