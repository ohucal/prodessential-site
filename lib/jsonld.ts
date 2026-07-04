// Per-product structured data (Product + MusicRecording + offers) for rich
// results and AI answer engines.
import type { Beat, Kit } from './products';
import { beatKeywords, kitKeywords } from './keywords';
import { FAQ } from './faq';

const SITE = 'https://prodessential.com';
const ORG_ID = `${SITE}/#org`;

// The Organization node that every byArtist/brand/seller `@id` reference
// resolves to. Embedded in each page's graph so every page validates standalone.
export function orgJsonLd() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'prod.essential',
    url: SITE,
    logo: `${SITE}/images/favicon.png`,
    email: 'prodessential@gmail.com',
    sameAs: [
      'https://www.youtube.com/@prod.essential',
      'https://www.instagram.com/prod.essential',
      'https://www.tiktok.com/@prod.essential',
    ],
  };
}

function abs(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return SITE + (path.startsWith('/') ? path : '/' + path);
}

export function beatJsonLd(beat: Beat) {
  const url = `${SITE}/beats/${beat.id}/`;
  const image = abs(beat.imgFile);
  const prices = Object.values(beat.licenses)
    .map((l) => l.price)
    .filter((p): p is number => typeof p === 'number');
  const low = prices.length ? Math.min(...prices) : beat.basePrice;
  const high = prices.length ? Math.max(...prices) : beat.basePrice;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicRecording',
        '@id': `${url}#recording`,
        name: beat.title,
        url,
        byArtist: { '@id': ORG_ID },
        ...(image ? { image } : {}),
        genre: beat.tags,
      },
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: `${beat.title} (Type Beat)`,
        sku: beat.id,
        ...(image ? { image } : {}),
        description: `${beat.bpm} BPM ${beat.key} type beat by prod.essential.`,
        category: 'Music Beats',
        keywords: beatKeywords(beat).join(', '),
        brand: { '@id': ORG_ID },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: String(low),
          highPrice: String(high),
          offerCount: prices.length,
          availability: 'https://schema.org/InStock',
          url,
          seller: { '@id': ORG_ID },
        },
      },
      orgJsonLd(),
    ],
  };
}

export function kitJsonLd(kit: Kit) {
  const url = `${SITE}/kits/${kit.id}/`;
  const image = abs(kit.imgFile);
  const available = kit.checkoutUrl !== '#';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: kit.title,
        sku: kit.id,
        ...(image ? { image } : {}),
        description: kit.description || `${kit.title}, a ${kit.type} from prod.essential.`,
        category: kit.type,
        keywords: kitKeywords(kit).join(', '),
        brand: { '@id': ORG_ID },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: String(kit.price),
          availability: available ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          url,
          seller: { '@id': ORG_ID },
        },
      },
      orgJsonLd(),
    ],
  };
}

// FAQPage structured data for the home-page FAQ. AI answer engines and Google
// rich results lift these Q&A pairs directly, so it's derived from the same
// lib/faq.ts source the visible accordion renders.
export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
