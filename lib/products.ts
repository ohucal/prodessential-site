// Data layer — single source of truth is products.json (imported at build time).
// Ports the runtime normalization from the original inline <script>.
import raw from '@/products.json';

export type CheckoutState =
  | 'addable'      // has payhip key + variant → full cart support
  | 'novariant'    // has key, no variant → Payhip defaults to first variant
  | 'unavailable'  // checkoutUrl is "#" or empty
  | 'misconfigured'// non-Payhip / broken URL
  | 'contact';     // exclusive / mailto / price null

export interface License {
  label: string;
  format: string;
  price: number | null;
  checkoutUrl: string;
  payhipKey?: string;
  // derived:
  _state?: CheckoutState;
  _payhipKey?: string | null;
  _variantId?: string | null;
}

export type LicenseTier = 'basic' | 'premium' | 'stems' | 'unlimited' | 'exclusive';

export interface Beat {
  id: string;
  title: string;
  bpm: number;
  key: string;
  tags: string[];
  basePrice: number;
  featured?: boolean;
  dateAdded: string;
  imgGradient: string;
  imgFile: string;
  audioFile: string;
  freeDownload?: boolean;
  freeFile?: string;
  licenses: Record<LicenseTier, License>;
}

export interface Kit {
  id: string;
  title: string;
  type: string;
  price: number;
  dateAdded: string;
  imgGradient: string;
  imgFile: string | null;
  checkoutUrl: string;
  payhipKey?: string;
  description: string;
  descriptionHtml?: string;
  author?: string;
  hidden?: boolean;
  // derived:
  _state?: CheckoutState;
  _payhipKey?: string | null;
  _variantId?: string | null;
}

export const FREE_TAG = 'FREE DOWNLOAD';

// ── Payhip URL parsing ──────────────────────────────────────────────────────
export function parsePayhipCheckout(url: string): { key: string | null; variantId: string | null } {
  if (!url) return { key: null, variantId: null };
  const s = decodeURIComponent(url);
  let key: string | null = null;
  let variantId: string | null = null;
  let m = s.match(/cart_links\[\]=([^&]+)/);
  if (m) key = m[1];
  if (!key) { m = s.match(/[?&]link=([^&]+)/); if (m) key = m[1]; }
  m = s.match(/variant_combination\[([^\]]+)\]=([^&]+)/);
  if (m) { if (!key) key = m[1]; variantId = m[2]; }
  return { key: key || null, variantId: variantId || null };
}

// Derive _payhipKey / _variantId / _state for any product-like object that
// carries a checkoutUrl (and maybe an explicit payhipKey).
function deriveCheckout(obj: License | Kit, isExclusive: boolean): void {
  const url = (obj.checkoutUrl || '').trim();
  if (isExclusive || obj.price === null || url.startsWith('mailto:')) {
    obj._state = 'contact'; obj._payhipKey = null; obj._variantId = null; return;
  }
  if (url === '#' || url === '') {
    obj._state = 'unavailable'; obj._payhipKey = null; obj._variantId = null; return;
  }
  if (!/(payhip\.com|checkout\.prodessential\.com)/i.test(url)) {
    obj._state = 'misconfigured'; obj._payhipKey = null; obj._variantId = null; return;
  }
  const shortMatch = url.match(/(?:payhip\.com|checkout\.prodessential\.com)\/b\/([A-Za-z0-9]+)/);
  if (obj.payhipKey || shortMatch) {
    obj._payhipKey = obj.payhipKey || (shortMatch ? shortMatch[1] : null);
    obj._variantId = null;
    obj._state = 'novariant';
    return;
  }
  const parsed = parsePayhipCheckout(url);
  if (parsed.key && parsed.variantId) {
    obj._payhipKey = parsed.key; obj._variantId = parsed.variantId; obj._state = 'addable';
  } else if (parsed.key) {
    obj._payhipKey = parsed.key; obj._variantId = null; obj._state = 'novariant';
  } else {
    obj._payhipKey = null; obj._variantId = null; obj._state = 'misconfigured';
  }
}

// Build the normalized, derived dataset once (module-level, shared across pages).
function normalize() {
  const beats = (raw.beats as Beat[]).map((b) => ({ ...b, licenses: { ...b.licenses } }));
  const kits = (raw.kits as Kit[]).map((k) => ({ ...k })).filter((k) => !k.hidden);

  beats.forEach((beat) => {
    (Object.keys(beat.licenses) as LicenseTier[]).forEach((tierKey) => {
      const lic = beat.licenses[tierKey];
      deriveCheckout(lic, tierKey === 'exclusive');
    });
  });
  kits.forEach((kit) => deriveCheckout(kit, false));

  return { beats, kits };
}

const data = normalize();

export const beats: Beat[] = data.beats;
export const kits: Kit[] = data.kits;

export function getBeat(id: string): Beat | undefined {
  return beats.find((b) => String(b.id) === String(id));
}
export function getKit(id: string): Kit | undefined {
  return kits.find((k) => String(k.id) === String(id));
}

// ── Free-download helpers ────────────────────────────────────────────────────
export function freeEligible(beat: Beat | undefined): boolean {
  return !!(beat && beat.freeDownload && (beat.freeFile || beat.audioFile));
}
export function freeFileFor(beat: Beat): string {
  return beat.freeFile || beat.audioFile;
}
export function beatTagsWithFree(beat: Beat): string[] {
  return freeEligible(beat) ? [FREE_TAG, ...beat.tags] : beat.tags;
}

// Distinct beat tags (sorted), with FREE_TAG first if any beat is free-eligible.
export function beatTagList(): string[] {
  const set = new Set<string>();
  beats.forEach((b) => b.tags.forEach((t) => set.add(t)));
  const sorted = Array.from(set).sort();
  return beats.some((b) => freeEligible(b)) ? [FREE_TAG, ...sorted] : sorted;
}

// Distinct kit types (sorted).
export function kitTypeList(): string[] {
  const set = new Set<string>();
  kits.forEach((k) => { if (k.type) set.add(k.type); });
  return Array.from(set).sort();
}
