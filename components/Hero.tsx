// Hero (server component). Featured beats are rendered statically from the data
// at build time (good for SEO); the cards are client islands (BeatCard) that
// add cover-image preview playback and link to each beat page.
import { beats } from '@/lib/products';
import FeaturedBeats from './FeaturedBeats';
import HeroActions from './HeroActions';

export default function Hero() {
  const featured = beats.filter((b) => b.featured);
  const list = featured.length ? featured : beats.slice(0, 2);

  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-kicker">Based In Michigan</p>
        <h1 className="hero-headline"><em>prod. essential</em></h1>
        <p className="hero-desc">Browse beats, drum kits, one shot kits, loops and tons of free stuff.</p>
        <HeroActions />
      </div>

      <div className="hero-right">
        <FeaturedBeats beats={list} />
      </div>
    </section>
  );
}
