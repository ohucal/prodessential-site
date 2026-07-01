import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ContactSection from '@/components/ContactSection';
import LowerGrid from '@/components/LowerGrid';
import NewsletterForm from '@/components/NewsletterForm';
import LicensingSection from '@/components/LicensingSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ContactSection />
      <LowerGrid />
      <NewsletterForm />
      <LicensingSection />
    </>
  );
}
