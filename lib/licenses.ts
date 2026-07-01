import type { LicenseTier } from './products';

export const CONTACT_EMAIL = 'mailto:prodessential@gmail.com';
export const TIER_ORDER: LicenseTier[] = ['basic', 'premium', 'stems', 'unlimited', 'exclusive'];
export const LICENSE_KEYS: LicenseTier[] = ['basic', 'premium', 'stems', 'unlimited', 'exclusive'];

export interface LicenseDetail {
  format: string;
  bullets: string[];
}

export const LICENSE_DETAILS: Record<LicenseTier, LicenseDetail> = {
  basic: {
    format: 'MP3 (Tagged)',
    bullets: ['Tagged MP3 file', 'Up to 50,000 streams', 'Up to 2,000 copies', '1 non-monetized video', 'Non-profit performances', 'Non-exclusive'],
  },
  premium: {
    format: 'WAV + MP3 (Untagged)',
    bullets: ['Untagged WAV + MP3', 'Up to 100,000 streams', 'Up to 3,000 copies', '1 monetized video', 'For-profit performances', 'Non-exclusive'],
  },
  stems: {
    format: 'WAV + MP3 + Track Stems',
    bullets: ['Untagged WAV + MP3', 'Full track stems included', 'Up to 500,000 streams', 'Up to 10,000 copies', 'Unlimited music videos', 'For-profit performances', 'Non-exclusive'],
  },
  unlimited: {
    format: 'WAV + MP3 + Stems',
    bullets: ['Untagged WAV + MP3 + stems', 'Unlimited streams', 'Unlimited distribution', 'Unlimited music videos', 'For-profit + radio', 'Non-exclusive'],
  },
  exclusive: {
    format: 'All Files + Sole Rights',
    bullets: ['WAV + MP3 + stems', 'Sole usage rights', 'Beat removed from store', 'Unlimited everything', 'Full commercial rights', 'Contact to discuss'],
  },
};

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Render the long license body text into structured HTML (ported verbatim).
export function renderLicenseText(text: string): string {
  const lines = text.split('\n');
  let html = '';
  let inMetaBlock = true;
  let metaBlockHtml = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (inMetaBlock) {
      if (!line) {
        if (metaBlockHtml) {
          html += `<div class="lic-meta-block">${metaBlockHtml}</div>`;
          metaBlockHtml = '';
          inMetaBlock = false;
        }
        continue;
      }
      metaBlockHtml += `<p class="lic-meta">${escHtml(line)}</p>`;
      continue;
    }

    if (!line) {
      html += '<div class="lic-spacer"></div>';
      continue;
    }

    if (/^\d+\. /.test(line)) {
      html += `<h3 class="lic-section">${escHtml(line)}</h3>`;
    } else if (/^\([a-z]\) /.test(line)) {
      html += `<p class="lic-item">${escHtml(line)}</p>`;
    } else {
      html += `<p class="lic-para">${escHtml(line)}</p>`;
    }
  }

  if (metaBlockHtml) {
    html += `<div class="lic-meta-block">${metaBlockHtml}</div>`;
  }

  return html;
}
