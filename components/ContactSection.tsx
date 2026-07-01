// Static contact + social links (server component).
export default function ContactSection() {
  return (
    <div className="contact-wrapper" id="contact">
      <div className="contact-header">
        <h2 className="contact-title">Contacts</h2>
        <p className="contact-email">
          Inquiries: <a href="mailto:prodessential@gmail.com">prodessential@gmail.com</a>
        </p>
      </div>
      <section className="producer-contacts">
        <a href="mailto:prodessential@gmail.com" className="social-link email-link">
          <svg viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Email
        </a>
        <a href="https://www.youtube.com/@prod.essential" target="_blank" rel="noopener noreferrer" className="social-link yt-link">
          <svg viewBox="0 0 24 24">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
          </svg>
          YouTube
        </a>
        <a href="https://www.instagram.com/prod.essential" target="_blank" rel="noopener noreferrer" className="social-link ig-link">
          <svg viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          Instagram
        </a>
        <a href="https://www.tiktok.com/@prod.essential" target="_blank" rel="noopener noreferrer" className="social-link tt-link">
          <svg viewBox="0 0 24 24" className="tiktok-icon">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
          TikTok
        </a>
      </section>
    </div>
  );
}
