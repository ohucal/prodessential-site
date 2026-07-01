'use client';
import { useUI } from '@/stores/useUI';

export default function LicensingSection() {
  const openLicense = useUI((s) => s.openLicense);
  const read = (tier: string) => (e: React.MouseEvent) => { e.preventDefault(); openLicense(tier); };

  return (
    <section className="licensing" id="licensing">
      <div className="licensing-header">
        <h2 className="licensing-title">Licensing</h2>
        <p className="licensing-sub">Every beat comes with a license. Pick the tier that fits your release.</p>
      </div>
      <div className="license-grid">
        <div className="license-card">
          <div className="license-top">
            <span className="license-name">Basic</span><span className="license-price">$25</span><span className="license-format">MP3 (Tagged)</span>
          </div>
          <ul className="license-features">
            <li>Tagged MP3 file</li><li>Up to 50,000 streams</li><li>Up to 2,000 copies</li><li>1 non-monetized video</li><li>Non-profit performances</li><li>Non-exclusive</li>
          </ul>
          <a href="#" className="license-btn" onClick={read('basic')}>Read Full License</a>
        </div>
        <div className="license-card">
          <div className="license-top">
            <span className="license-name">Premium</span><span className="license-price">$40</span><span className="license-format">WAV + MP3 (Untagged)</span>
          </div>
          <ul className="license-features">
            <li>Untagged WAV + MP3</li><li>Up to 100,000 streams</li><li>Up to 3,000 copies</li><li>1 monetized video</li><li>For-profit performances</li><li>Non-exclusive</li>
          </ul>
          <a href="#" className="license-btn" onClick={read('premium')}>Read Full License</a>
        </div>
        <div className="license-card license-card--featured">
          <div className="license-badge">Most Popular</div>
          <div className="license-top">
            <span className="license-name">Premium + Stems</span><span className="license-price">$90</span><span className="license-format">WAV + MP3 + Track Stems</span>
          </div>
          <ul className="license-features">
            <li>Untagged WAV + MP3</li><li>Full track stems included</li><li>Up to 500,000 streams</li><li>Up to 10,000 copies</li><li>Unlimited music videos</li><li>For-profit performances</li><li>Non-exclusive</li>
          </ul>
          <a href="#" className="license-btn license-btn--featured" onClick={read('stems')}>Read Full License</a>
        </div>
        <div className="license-card">
          <div className="license-top">
            <span className="license-name">Unlimited</span><span className="license-price">$250</span><span className="license-format">WAV + MP3 + Stems</span>
          </div>
          <ul className="license-features">
            <li>Untagged WAV + MP3 + stems</li><li>Unlimited streams</li><li>Unlimited distribution</li><li>Unlimited music videos</li><li>For-profit + radio</li><li>Non-exclusive</li>
          </ul>
          <a href="#" className="license-btn" onClick={read('unlimited')}>Read Full License</a>
        </div>
        <div className="license-card license-card--exclusive">
          <div className="license-top">
            <span className="license-name">Exclusive</span><span className="license-price">Negotiable</span><span className="license-format">All Files Included</span>
          </div>
          <ul className="license-features">
            <li>WAV + MP3 + stems</li><li>Sole usage rights</li><li>Beat removed from store</li><li>Unlimited everything</li><li>Full commercial rights</li><li>Contact to discuss</li>
          </ul>
          <a href="mailto:prodessential@gmail.com" className="license-btn">Get In Touch</a>
        </div>
      </div>
      <p className="license-free-note">Select beats include a free tagged download for non-profit use. Look for the FREE option on the beat. Credit required.</p>
    </section>
  );
}
