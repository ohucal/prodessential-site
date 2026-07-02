import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { kits, getKit } from '@/lib/products';
import { assetUrl } from '@/lib/assets';
import { kitTitle, kitDescription, kitKeywords } from '@/lib/keywords';
import { kitJsonLd } from '@/lib/jsonld';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import KitDetail from '@/components/KitDetail';

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(kitJsonLd(kit)) }} />
      <Header />
      <main className="product-main">
        <nav className="product-breadcrumb">
          <Link href="/">prod.essential</Link> &nbsp;/&nbsp; <Link href="/#kits">Kits</Link> &nbsp;/&nbsp; <span>{kit.title}</span>
        </nav>
        <KitDetail kit={kit} />
      </main>
      <ContactSection />
    </>
  );
}
