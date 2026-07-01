'use client';
// Client island on the static product pages: opens the global modal (player +
// license picker + add-to-cart) which AppChrome mounts site-wide.
import { useUI } from '@/stores/useUI';

export default function ProductActions({ kind, id }: { kind: 'beat' | 'kit'; id: string }) {
  const openBeat = useUI((s) => s.openBeat);
  const openKit = useUI((s) => s.openKit);
  const open = () => (kind === 'beat' ? openBeat(id) : openKit(id));

  return (
    <div className="hero-actions">
      <button className="btn-primary" onClick={open}>
        {kind === 'beat' ? 'Listen & License' : 'View & Buy'}
      </button>
      <a href="/#beats" className="btn-ghost">Browse all beats</a>
    </div>
  );
}
