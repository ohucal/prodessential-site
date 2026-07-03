'use client';

import { useEffect, useState } from 'react';

/**
 * Testing-branch-only font switcher (branch: design-mockups).
 * Sets html[data-lab] so design-lab.css can swap --font-mono/--font-display.
 */

const THEMES = [
  { id: '', label: 'Current', note: 'DM Serif Display + DM Mono' },
  { id: 'pressing-plant', label: 'Pressing Plant', note: 'Archivo + IBM Plex Mono — tight tracking, true expansion' },
  { id: 'shrink-wrap', label: 'Shrink Wrap', note: 'Syne + Martian Mono — dense, very tight, large' },
  { id: 'boxcar', label: 'Boxcar', note: 'Antonio + Chivo Mono — condensed, wide tracking, caps' },
  { id: 'blackout', label: 'Blackout', note: 'Gasoek One + Fragment Mono — huge, single-weight poster' },
  { id: '180-gram', label: '180 Gram', note: 'Hanken Grotesk + Sometype Mono — smaller, quieter, clean' },
  { id: 'master-cut', label: 'Master Cut', note: 'Pressing Plant headers + 180 Gram beat titles + Boxcar nav/labels' },
];

const STORAGE_KEY = 'design-lab-theme';

export default function DesignLab() {
  const [theme, setTheme] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    if (THEMES.some((t) => t.id === saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-lab', theme);
    } else {
      document.documentElement.removeAttribute('data-lab');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className={`design-lab${collapsed ? ' collapsed' : ''}`}>
      <div className="design-lab-title">
        <span>Design lab</span>
        <button
          type="button"
          className="design-lab-toggle"
          aria-label={collapsed ? 'Expand design lab' : 'Collapse design lab'}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? '+' : '−'}
        </button>
      </div>
      {THEMES.map((t) => (
        <button
          key={t.id || 'current'}
          type="button"
          className={`design-lab-btn${t.id === theme ? ' active' : ''}`}
          onClick={() => setTheme(t.id)}
        >
          {t.label}
        </button>
      ))}
      <div className="design-lab-note">{active.note}</div>
    </div>
  );
}
