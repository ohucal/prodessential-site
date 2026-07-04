'use client';
import { useState } from 'react';
import { FAQ } from '@/lib/faq';

export default function FaqSection() {
  // Single-open accordion. null = all closed.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq" id="faq">
      <div className="faq-header section-label">
        <span>FAQ</span>
        <hr />
      </div>
      <ul className="faq-list">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </button>
              <div id={`faq-a-${i}`} className="faq-a" role="region">
                <p className="faq-a-text">{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
