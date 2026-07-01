// Hero (server component). Featured beats are rendered statically from the data
// at build time (good for SEO); interactive preview playback is layered on later.
import Link from 'next/link';
import { beats } from '@/lib/products';
import { coverStyle } from '@/lib/assets';

export default function Hero() {
  const featured = beats.filter((b) => b.featured);
  const list = featured.length ? featured : beats.slice(0, 2);

  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-kicker">Based In Michigan</p>
        <h1 className="hero-headline"><em>prod. essential</em></h1>
        <p className="hero-desc">Browse beats, drum kits, one shot kits, loops and tons of free stuff.</p>
        <div className="hero-actions">
          <a href="/#beats" className="btn-primary">Browse Beats</a>
          <a href="/#kits" className="btn-ghost">Shop Kits</a>
        </div>
      </div>

      <div className="hero-right">
        <p className="hero-right-label">Featured Beats</p>
        <div id="heroFeatured">
          {list.map((beat) => (
            <Link key={beat.id} href={`/beats/${beat.id}/`} className="beat-card" data-id={beat.id}>
              <div className="beat-card-main">
                <div className="beat-cover" style={coverStyle(beat.imgFile, beat.imgGradient)}></div>
                <div className="beat-info">
                  <div className="beat-title">{beat.title}</div>
                  <div className="beat-bpm-key">{beat.bpm} BPM · {beat.key}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
