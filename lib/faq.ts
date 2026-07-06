// Single source of truth for the on-site FAQ. Feeds both the FAQ accordion
// (components/FAQ.tsx) and the FAQPage JSON-LD (lib/jsonld.ts) so the visible
// copy and the structured data can never drift apart.
//
// Brand voice: lowercase, no em dashes, confident and minimal, no hype.
// Answers are specific to this catalog's actual terms — kits are royalty-free
// but beats are licensed (publishing splits + required credit), so the copy
// deliberately avoids a blanket "100% royalty-free" claim.

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'will these work in my daw?',
    a: 'yes, all of it. fl studio, ableton, logic, cubase, bitwig. drums, one-shots and loops are standard wav. serum banks include the presets plus every sound bounced to wav, so you can use them even without serum.',
  },
  {
    q: 'do i need serum to use the serum banks?',
    a: 'no. every preset is bounced to wav and included as one-shots, so you can drag them straight into any daw. if you have serum you get the editable presets too. vertigo is built for serum 2, sub-zero works in serum 1 and 2.',
  },
  {
    q: 'are the kits royalty-free?',
    a: 'yes. the drum kits, one-shots, loops and serum banks are royalty-free. use them in your beats and releases and keep your masters. beats work differently, see below.',
  },
  {
    q: "what's the difference between a free beat and a paid license?",
    a: 'free downloads are tagged and for non-profit and demo use only, so you can test a beat in a song before you commit. to release, monetize or distribute it you need a paid license, which removes the tag and gives you the untagged files.',
  },
  {
    q: 'can i release a song made with one of your beats?',
    a: 'yes, once you buy a license. each tier sets what you can do with it, streams, sales, videos, shows. you keep your lyrics and your master. the beat stays licensed, not owned, unless you buy exclusive. credit "prod. essential" is required on releases.',
  },
  {
    q: 'what do the license tiers mean?',
    a: 'basic is a tagged mp3 for demos. premium is untagged wav and mp3. premium + stems adds the track-outs for full mixing control. unlimited removes the caps. exclusive pulls the beat off the store and transfers sole rights. full terms are on every beat.',
  },
  {
    q: 'how do i get my files?',
    a: 'instantly. checkout runs through payhip and your download is ready right after payment. a link is also emailed to you so you can grab it again anytime.',
  },
  {
    q: 'can i redownload if i lose my files?',
    a: 'yes. use the link in your purchase email to download again whenever you need.',
  },
  {
    q: 'what payments do you take?',
    a: 'card and paypal through secure payhip checkout.',
  },
  {
    q: 'do you offer refunds?',
    a: "kits, packs and banks come with a 7 day money back guarantee, just email prodessential@gmail.com. beat licenses are final once the files are delivered, per the license agreement. if anything is wrong with your files, email me and i'll fix it.",
  },
];
