import type { MetadataRoute } from 'next';
import { beats, kits } from '@/lib/products';

const SITE = 'https://prodessential.com';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...beats.map((b) => ({
      url: `${SITE}/beats/${b.id}/`,
      lastModified: b.dateAdded ? new Date(b.dateAdded) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...kits.map((k) => ({
      url: `${SITE}/kits/${k.id}/`,
      lastModified: k.dateAdded ? new Date(k.dateAdded) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
