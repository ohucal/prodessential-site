// Thin gtag wrapper — safe to call before/without GA loaded.
type GtagArgs = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = 'G-9XBRPVVXPP';

export function track(event: string, params?: GtagArgs): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}
