import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { kits, getKit } from '@/lib/products';
import { coverStyle, assetUrl } from '@/lib/assets';
import { kitTitle, kitDescription, kitKeywords } from '@/lib/keywords';
import { kitJsonLd } from '@/lib/jsonld';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import ProductActions from '@/components/ProductActions';

export function generateStaticParams() {
  return kits.map((k) => ({ id: k.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const kit = getKit(id);
  if (!kit) return {};
  const title = kitTitle(kit);
  const description = kitDescription(kit);
  const image = assetUrl(kit.imgFile);
  const url = `/kits/${kit.id}/`;
  return {
    title,
    description,
    keywords: kitKeywords(kit),
    alternates: { canonical: url },
    openGraph: { type: 'website', title, description, url, images: image ? [image] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function KitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kit = getKit(id);
  if (!kit) notFound();

  const others = kits.filter((k) => k.id !== kit.id).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(kitJsonLd(kit)) }} />
      <Header />
      <main className="product-main">
        <nav className="product-breadcrumb">
          <Link href="/">prod.essential</Link> &nbsp;/&nbsp; <Link href="/#kits">Kits</Link> &nbsp;/&nbsp; <span>{kit.title}</span>
        </nav>

        <section className="hero product-hero">
          <div className="hero-left">
            <p className="hero-kicker">{kit.type}</p>
            <h1 className="hero-headline"><em>{kit.title}</em></h1>
            {kit.descriptionHtml
              ? <div className="hero-desc" dangerouslySetInnerHTML={{ __html: kit.descriptionHtml }} />
              : <p className="hero-desc">{kit.description}</p>}
            {kit.author && <p className="product-meta">By {kit.author}</p>}
            <ProductActions kind="kit" id={kit.id} />
          </div>
          <div className="hero-right">
            <div className="product-cover" style={coverStyle(kit.imgFile, kit.imgGradient)} role="img" aria-label={`${kit.title} cover art`}></div>
            <p className="product-meta">${kit.price}{kit.checkoutUrl === '#' ? ' · Coming Soon' : ''}</p>
          </div>
        </section>

        {others.length > 0 && (
          <section className="product-related">
            <h2 className="product-section-title">More kits &amp; packs</h2>
            <div className="product-related-grid">
              {others.map((k) => (
                <Link key={k.id} href={`/kits/${k.id}/`} className="beat-card kit-card" data-id={k.id}>
                  <div className="beat-card-main">
                    <div className={`beat-cover${k.imgFile ? '' : ' no-img'}`} style={coverStyle(k.imgFile, k.imgGradient)}></div>
                    <div className="beat-info">
                      <span className="beat-title-row"><span className="beat-title">{k.title}</span></span>
                      <span className="beat-bpm-key">{k.type}</span>
                    </div>
                    <div className="beat-price-wrap"><span className="beat-price">${k.price}</span></div>
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
