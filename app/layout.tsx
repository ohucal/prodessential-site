import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GA_ID } from '@/lib/analytics';
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
    images: ['/images/cashed-out-multikit.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'prod.essential | Underground Trap & Rap Beats, Drum Kits & Serum Banks',
    description:
      "Premium trap and rap beats, drum kits, one-shots, and Serum banks you won't find anywhere else. Built from scratch for artists and producers.",
    images: ['/images/cashed-out-multikit.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
