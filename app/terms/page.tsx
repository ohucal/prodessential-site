import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Terms of Service | prod.essential',
  description:
    'The terms that govern your use of prodessential.com and any products you buy through it, including licenses, refunds, and policies.',
  alternates: { canonical: '/terms/' },
  openGraph: {
    type: 'website',
    title: 'Terms of Service | prod.essential',
    description: 'The terms that govern your use of prodessential.com and any products you buy through it.',
    url: '/terms/',
  },
};

// External links in legal text open in a new tab with safe rel attributes.
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="legal-main">
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-dates">
          <strong>Effective Date: July 5, 2026</strong>
          <br />
          <strong>Last Updated: July 5, 2026</strong>
        </p>

        <div className="legal-body">
          <p>
            These Terms of Service (the "Terms") govern your use of prodessential.com (the "Site") and your purchase
            of products offered through the Site. The Site is operated by Owen Hucal, doing business as
            prod.essential ("prod.essential", "we", "us"). By using the Site or purchasing a product, you agree to
            these Terms. If you do not agree, do not use the Site.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            prod.essential is an independent music production brand operated by Owen Hucal, based in Michigan, United
            States. Contact: <strong>prodessential@gmail.com</strong>.
          </p>

          <h2>2. Products</h2>
          <p>The Site offers two categories of digital products:</p>
          <p>
            <strong>Beats.</strong> Instrumental music tracks offered under tiered license agreements (Free/Demo,
            Basic, Premium, Premium + Stems, Unlimited, and Exclusive). Beats are licensed, never sold outright,
            except under a negotiated Exclusive agreement.
          </p>
          <p>
            <strong>Producer products.</strong> Drum kits, one-shot kits, loop kits, MIDI packs, synthesizer preset
            banks, multikits, and bundles, offered on a royalty-free basis as described in Section 5.
          </p>

          <h2>3. Checkout, Payment, and Delivery</h2>
          <p>
            Purchases are processed by <strong>Payhip Limited</strong> ("Payhip"), our e-commerce and digital
            delivery platform. When you check out, you are transacting on Payhip's checkout system and Payhip's own
            Terms of Use (<Ext href="https://payhip.com/terms">payhip.com/terms</Ext>) and Privacy Policy (
            <Ext href="https://payhip.com/privacy">payhip.com/privacy</Ext>) also apply to the transaction. Payments
            are processed by Stripe or PayPal; we never see or store your payment card details.
          </p>
          <p>
            All prices are listed in US dollars. For customers located in the European Union or the United Kingdom,
            Payhip acts as the reseller of our digital products and is responsible for calculating, collecting, and
            remitting applicable EU or UK VAT, which will be added at checkout where required. Other taxes, duties,
            or bank fees applicable in your country are your responsibility.
          </p>
          <p>
            Products are delivered by digital download immediately after payment. A download link is also sent to
            the email address you provide at checkout, and you can use that link to re-download your files. You are
            responsible for providing an accurate email address and for downloading and backing up your files.
          </p>

          <h2>4. Beat Licenses</h2>
          <p>
            Every beat purchase is governed by the written license agreement for the tier you select, which is
            presented before purchase and delivered with your order. The license agreement for your tier is the
            controlling document for your rights in the beat. If there is any conflict between these Terms and a beat
            license agreement, the license agreement controls with respect to the beat.
          </p>
          <p>In summary, and without limiting the full license terms:</p>
          <ul>
            <li>
              Non-exclusive tiers (Basic, Premium, Premium + Stems, Unlimited) grant limited rights to create and
              exploit one new song, subject to the caps, restrictions, publishing splits, and credit requirements
              stated in the applicable agreement. The same beat may be licensed to other buyers.
            </li>
            <li>
              Free/Demo downloads are tagged files licensed for non-profit and demo use only. No monetized or
              commercial release is permitted under the free tier.
            </li>
            <li>Exclusive licenses are negotiated individually and remove the beat from sale.</li>
            <li>Producer credit in the form "Prod. essential" is required on releases as stated in each agreement.</li>
            <li>
              Ownership of each beat, including its master and underlying composition, remains with the Licensor
              except as expressly granted in a license agreement.
            </li>
          </ul>
          <p>
            By completing a purchase or free download, you accept the applicable license agreement by electronic
            acceptance as described in that agreement.
          </p>

          <h2>5. Producer Product License (Kits, Loops, One-Shots, MIDI, Preset Banks)</h2>
          <p>
            Unless a product page states otherwise, producer products are sold under the following royalty-free
            license:
          </p>
          <ul>
            <li>
              You may use the included sounds, loops, MIDI files, and presets in your own original musical
              compositions, beats, and productions, including commercial releases, without paying additional
              royalties and without crediting prod.essential.
            </li>
            <li>
              Your original works created using these products belong to you, including works you sell or license to
              others.
            </li>
            <li>
              You may NOT resell, redistribute, share, sublicense, or give away the files themselves, in whole or in
              part, on their own or repackaged in any sample pack, loop kit, preset bank, or similar product,
              whether modified or not, whether free or paid.
            </li>
            <li>
              You may NOT upload the files to any file-sharing service, sample library, marketplace, AI training
              dataset, or platform that enables third parties to obtain them.
            </li>
            <li>You may NOT claim authorship of the original sounds as standalone works.</li>
            <li>This license is granted to a single user and is non-transferable.</li>
          </ul>

          <h2>6. Refund Policy</h2>
          <p>
            <strong>Producer products (kits, packs, banks, bundles):</strong> we offer a 7-day money-back guarantee
            from the date of purchase. If you are not satisfied, email prodessential@gmail.com within 7 days of
            purchase with your order details and we will refund you.
          </p>
          <p>
            <strong>Beat licenses:</strong> because untagged files and stems cannot be returned once delivered, all
            beat license sales are final upon delivery, as stated in each license agreement, except where the
            Licensor materially breaches the warranties in the applicable license agreement and fails to cure that
            breach.
          </p>
          <p>
            <strong>Delivery problems:</strong> if your files are corrupted, incomplete, or otherwise not as
            described, email us and we will fix the issue or provide replacement files.
          </p>
          <p>
            Nothing in this section limits any non-waivable statutory rights you have as a consumer in your country
            of residence.
          </p>

          <h2>7. Digital Content and the Right of Withdrawal (EU and UK Customers)</h2>
          <p>
            If you are a consumer in the EU or UK, you normally have a 14-day right to withdraw from a distance
            purchase. By purchasing digital content on the Site, you expressly consent to immediate delivery of the
            digital content and acknowledge that you lose your statutory right of withdrawal once delivery has begun.
            This does not affect the voluntary 7-day guarantee for producer products in Section 6 or your rights in
            respect of faulty digital content.
          </p>

          <h2>8. Free Downloads and Email List</h2>
          <p>
            Free downloads may be conditioned on providing your email address. By requesting a free download or
            joining the email list, you agree to receive emails from prod.essential, from which you can unsubscribe
            at any time. Free beat downloads are subject to the Free/Demo license terms and must be accepted before
            download. Handling of your email address is described in our Privacy Policy.
          </p>

          <h2>9. Intellectual Property in the Site</h2>
          <p>
            All content on the Site, including beats, audio previews, artwork, product names, text, code, and the
            prod.essential name and branding, is owned by Owen Hucal or used with permission, and is protected by
            copyright and other intellectual property laws. Except as expressly permitted by a purchased license,
            you may not copy, download, scrape, reproduce, distribute, or create derivative works from Site content.
            Audio previews are for evaluation on the Site only and may not be extracted, recorded, or used in any
            production.
          </p>

          <h2>10. Acceptable Use</h2>
          <p>
            You agree not to: use the Site for any unlawful purpose; attempt to gain unauthorized access to any part
            of the Site or its infrastructure; interfere with the Site's operation; use bots, scrapers, or automated
            tools to access or download Site content; misrepresent your identity in connection with a purchase; or
            circumvent any technical measure, license restriction, or payment requirement.
          </p>

          <h2>11. Third-Party Services</h2>
          <p>
            Checkout runs on Payhip, email runs on Kit, and the Site links to third-party platforms such as YouTube,
            Instagram, and TikTok. We are not responsible for the content, policies, or practices of third-party
            services. Your use of those services is governed by their own terms.
          </p>

          <h2>12. Intellectual Property Complaints</h2>
          <p>
            We respect the intellectual property rights of others. If you believe any content on the Site infringes
            your rights, send a notice to prodessential@gmail.com including: identification of the work claimed to be
            infringed, the location of the allegedly infringing material on the Site, your contact information, a
            statement of good-faith belief that the use is unauthorized, a statement under penalty of perjury that
            your notice is accurate and that you are the rights owner or authorized to act on the owner's behalf, and
            your physical or electronic signature. We will review and respond to valid notices consistent with the
            US Digital Millennium Copyright Act.
          </p>

          <h2>13. Disclaimers</h2>
          <p>
            The Site and all products are provided "as is" and "as available" without warranties of any kind,
            express or implied, including implied warranties of merchantability, fitness for a particular purpose,
            and non-infringement, except for the express warranties stated in the beat license agreements. We do not
            warrant that the Site will be uninterrupted, error-free, or secure.
          </p>

          <h2>14. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, prod.essential and Owen Hucal will not be liable for any
            indirect, incidental, consequential, special, or punitive damages, or for lost profits, lost data, or
            lost business opportunities, arising out of or relating to the Site or any product, even if advised of
            the possibility of such damages. To the fullest extent permitted by law, our total aggregate liability
            for any claim arising out of the Site or a product will not exceed the amount you paid for the product
            giving rise to the claim, or ten US dollars if no purchase was made.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of certain warranties or damages. Nothing in
            these Terms excludes or limits any liability that cannot be excluded or limited under applicable law,
            including the statutory rights of consumers in the EU, UK, Canada, Australia, or elsewhere.
          </p>

          <h2>15. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless prod.essential and Owen Hucal from any claims, damages, and
            expenses (including reasonable attorneys' fees) arising from your breach of these Terms, your violation
            of any law or third-party right, or your misuse of any product outside the scope of its license.
          </p>

          <h2>16. Governing Law and Venue</h2>
          <p>
            These Terms are governed by the laws of the State of Michigan, United States, without regard to its
            conflict-of-laws principles. Any dispute arising out of these Terms or the Site will be brought
            exclusively in the state or federal courts located in Wayne County, Michigan, and both parties consent
            to the personal jurisdiction of those courts. If you are a consumer residing in the EU, UK, or another
            jurisdiction whose law grants you mandatory consumer protections or the right to bring proceedings in
            your local courts, nothing in this section deprives you of those protections or rights.
          </p>

          <h2>17. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. The "Last Updated" date shows the latest revision. Changes
            apply prospectively from the date they are posted. Purchases are governed by the Terms and license
            agreements in effect at the time of purchase. Continued use of the Site after changes take effect means
            you accept the updated Terms.
          </p>

          <h2>18. General</h2>
          <p>
            If any provision of these Terms is held unenforceable, the remaining provisions remain in full force.
            Our failure to enforce any provision is not a waiver. You may not assign these Terms; we may assign them
            in connection with a transfer of the business. These Terms, together with the applicable license
            agreement for any purchased beat and our Privacy Policy, are the entire agreement between you and us
            regarding the Site.
          </p>

          <h2>19. Contact</h2>
          <p>
            Questions about these Terms: <strong>prodessential@gmail.com</strong>
          </p>
          <p>Owen Hucal d/b/a prod.essential, Michigan, United States.</p>
        </div>
      </main>
    </>
  );
}
