'use client';
import { useState } from 'react';
import { track } from '@/lib/analytics';

const KIT_LOOPS_ENDPOINT = 'https://app.kit.com/forms/9481440/subscriptions';

export default function NewsletterForm() {
  const [collapsed, setCollapsed] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ text: string; kind: '' | 'success' | 'error' }>({ text: '', kind: '' });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ text: '', kind: '' });
    try {
      const fd = new FormData();
      fd.append('email_address', email.trim());
      const res = await fetch(KIT_LOOPS_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      if (!res.ok) throw new Error('fail');
      setStatus({ text: "You're in. Check your inbox.", kind: 'success' });
      track('sign_up', { method: 'newsletter' });
      setEmail('');
    } catch {
      setStatus({ text: 'Something went wrong. Try again.', kind: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={`newsletter${collapsed ? ' newsletter--collapsed' : ''}`} id="newsletter">
      <button className="newsletter-close" onClick={() => setCollapsed((c) => !c)} aria-label="Collapse" style={{ opacity: collapsed ? 0 : 1 }}>
        <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <div className="newsletter-toggle" onClick={() => setCollapsed((c) => !c)} title="Collapse section">
        <span className="newsletter-toggle-label" style={{ opacity: collapsed ? 1 : 0 }}>Free Loops Weekly</span>
      </div>
      <div className="newsletter-content">
        <p className="newsletter-kicker">Newsletter</p>
        <h2 className="newsletter-headline">Free Loops Weekly</h2>
        <p className="newsletter-desc">Join the list to get weekly free loops, exclusive kits and early access to new beats sent straight to your inbox.</p>
        <form className="newsletter-form" onSubmit={submit}>
          <input type="email" placeholder="YOUR EMAIL ADDRESS" required className="newsletter-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn-primary" style={{ border: 'none' }} disabled={submitting}>{submitting ? 'SENDING...' : 'SUBSCRIBE'}</button>
        </form>
        <p className="newsletter-fineprint">
          no spam. unsubscribe anytime. see the <a href="/privacy/">privacy policy</a>.
        </p>
        <p className={`newsletter-status${status.kind ? ` newsletter-status--${status.kind}` : ''}`}>{status.text}</p>
      </div>
    </section>
  );
}
