import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContactSection from '@/components/ContactSection';
import LowerGrid from '@/components/LowerGrid';
import NewsletterForm from '@/components/NewsletterForm';
import LicensingSection from '@/components/LicensingSection';
import FaqSection from '@/components/FAQ';
import { faqJsonLd } from '@/lib/jsonld';

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <Header />
      <Hero />
      <ContactSection />
      <LowerGrid />
      <NewsletterForm />
      <LicensingSection />
      <FaqSection />
    </>
  );
}
