'use client';
import { useEffect } from 'react';
import { LICENSE_TEXTS } from '@/lib/licenseTexts';
import { renderLicenseText } from '@/lib/licenses';
import { useUI } from '@/stores/useUI';

export default function LicenseModal() {
  const tier = useUI((s) => s.licenseModalTier);
  const closeLicense = useUI((s) => s.closeLicense);
  const lic = tier ? LICENSE_TEXTS[tier] : undefined;

  useEffect(() => {
    if (!lic) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLicense(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lic, closeLicense]);

  if (!lic) return null;

  return (
    <div className="license-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeLicense(); }}>
      <div className="license-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={closeLicense} aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <h2 className="license-modal-title">{lic.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: renderLicenseText(lic.body) }} />
      </div>
    </div>
  );
}
