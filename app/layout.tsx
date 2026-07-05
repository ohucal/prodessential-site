import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
import { orgJsonLd } from '@/lib/jsonld';
import AppChrome from '@/components/AppChrome';
import '@/style.css';

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://prodessential.com'),
  title: 'prod.essential | Underground Trap & Rap Beats, Drum Kits & Serum Banks',
  description:
    "Premium trap and rap beats, drum kits, one-shots, and Serum banks you won't find anywhere else. Built from scratch for artists and producers.",
  alternates: { canonical: '/' },
  icons: { icon: '/images/favicon.png', apple: '/images/favicon.png' },
  openGraph: {
    type: 'website',
    siteName: 'prod.essential',
    title: 'prod.essential | Underground Trap & Rap Beats, Drum Kits & Serum Banks',
    description:
      "Premium trap and rap beats, drum kits, one-shots, and Serum banks you won't find anywhere else. Built from scratch for artists and producers.",
    url: '/',
    images: ['/images/cashed-out-multikit.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'prod.essential | Underground Trap & Rap Beats, Drum Kits & Serum Banks',
    description:
      "Premium trap and rap beats, drum kits, one-shots, and Serum banks you won't find anywhere else. Built from scratch for artists and producers.",
    images: ['/images/cashed-out-multikit.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Type system: Archivo (expanded display) + Hanken Grotesk (titles) + DM Mono (utility/body)
            + Chakra Petch (price tags — the "$" figures on beat/kit cards) */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Chakra+Petch:wght@600;700&family=Hanken+Grotesk:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...orgJsonLd() }) }}
        />
        {children}
        <AppChrome />

        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {/* Payhip embed */}
        <Script src="https://payhip.com/payhip.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
