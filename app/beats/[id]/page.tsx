import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { beats, getBeat, freeEligible } from '@/lib/products';
import { TIER_ORDER, LICENSE_DETAILS } from '@/lib/licenses';
import { coverStyle, assetUrl } from '@/lib/assets';
import { beatTitle, beatDescription, beatKeywords, beatVisibleGenre, beatBodyCopy } from '@/lib/keywords';
import { beatJsonLd } from '@/lib/jsonld';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import ProductActions from '@/components/ProductActions';

export function generateStaticParams() {
  return beats.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const beat = getBeat(id);
  if (!beat) return {};
  const title = beatTitle(beat);
  const description = beatDescription(beat);
  const image = assetUrl(beat.imgFile);
  const url = `/beats/${beat.id}/`;
  return {
    title,
    description,
    keywords: beatKeywords(beat),
    alternates: { canonical: url },
    openGraph: { type: 'music.song', title, description, url, images: image ? [image] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

function relatedBeats(id: string, tags: string[]) {
  const tagSet = new Set(tags);
  const scored = beats
    .filter((b) => b.id !== id)
    .map((b) => ({ b, score: b.tags.filter((t) => tagSet.has(t)).length }))
    .sort((a, z) => z.score - a.score || +new Date(z.b.dateAdded) - +new Date(a.b.dateAdded));
  return scored.slice(0, 6).map((s) => s.b);
}

export default async function BeatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beat = getBeat(id);
  if (!beat) notFound();

  const free = freeEligible(beat);
  const related = relatedBeats(beat.id, beat.tags);
  const tiers = TIER_ORDER.filter((tk) => beat.licenses[tk]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(beatJsonLd(beat)) }} />
      <Header />
      <main className="product-main">
        <nav className="product-breadcrumb">
          <Link href="/">prod.essential</Link> &nbsp;/&nbsp; <Link href="/#beats">Beats</Link> &nbsp;/&nbsp; <span>{beat.title}</span>
        </nav>

        <section className="hero product-hero">
          <div className="hero-left">
            <p className="hero-kicker">{beatVisibleGenre(beat)}</p>
            <h1 className="hero-headline"><em>{beat.title}</em></h1>
            <p className="hero-desc">{beatBodyCopy(beat)}</p>
            <div className="beat-tags product-tags">
              {beat.tags.map((t) => <span key={t} className="beat-tag">{t}</span>)}
              {free && <span className="beat-tag beat-tag--free">FREE DOWNLOAD</span>}
            </div>
            <ProductActions kind="beat" id={beat.id} />
          </div>
          <div className="hero-right">
            <div className="product-cover" style={coverStyle(beat.imgFile, beat.imgGradient)} role="img" aria-label={`${beat.title} cover art`}></div>
            <p className="product-meta">{beat.bpm} BPM &nbsp;·&nbsp; {beat.key}</p>
          </div>
        </section>

        <section className="product-licenses">
          <h2 className="product-section-title">Licensing for &ldquo;{beat.title}&rdquo;</h2>
          <ul className="product-tier-list">
            {tiers.map((tk) => {
              const lic = beat.licenses[tk];
              const detail = LICENSE_DETAILS[tk];
              return (
                <li key={tk} className="product-tier">
                  <span className="product-tier-name">{lic.label}</span>
                  <span className="product-tier-format">{detail.format}</span>
                  <span className="product-tier-price">{lic.price === null ? 'Negotiable' : '$' + lic.price}</span>
                </li>
              );
            })}
          </ul>
          {free && <p className="license-free-note">This beat includes a free tagged download for non-profit use — credit &ldquo;prod.essential&rdquo; required. Use the Listen &amp; License button to grab it.</p>}
        </section>

        {related.length > 0 && (
          <section className="product-related">
            <h2 className="product-section-title">More from prod.essential</h2>
            <div className="product-related-grid">
              {related.map((b) => (
                <Link key={b.id} href={`/beats/${b.id}/`} className="beat-card" data-id={b.id}>
                  <div className="beat-card-main">
                    <div className={`beat-cover${b.imgFile ? '' : ' no-img'}`} style={coverStyle(b.imgFile, b.imgGradient)}></div>
                    <div className="beat-info">
                      <span className="beat-title-row"><span className="beat-title">{b.title}</span></span>
                      <span className="beat-bpm-key">{b.bpm} BPM · <span className="beat-key">{b.key}</span></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <ContactSection />
    </>
  );
}
