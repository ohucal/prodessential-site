import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { beats, getBeat } from '@/lib/products';
import { assetUrl } from '@/lib/assets';
import { beatTitle, beatDescription, beatKeywords } from '@/lib/keywords';
import { beatJsonLd } from '@/lib/jsonld';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import BeatDetail from '@/components/BeatDetail';

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

export default async function BeatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beat = getBeat(id);
  if (!beat) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(beatJsonLd(beat)) }} />
      <Header />
      <main className="product-main">
        <nav className="product-breadcrumb">
          <Link href="/">prod.essential</Link> &nbsp;/&nbsp; <Link href="/#beats">Beats</Link> &nbsp;/&nbsp; <span>{beat.title}</span>
        </nav>
        <BeatDetail beat={beat} />
      </main>
      <ContactSection />
    </>
  );
}
