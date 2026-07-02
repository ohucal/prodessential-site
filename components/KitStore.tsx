'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { kits, kitTypeList } from '@/lib/products';
import KitCard from './KitCard';

type KitSort = 'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_az' | 'name_za';

const SORT_LABELS: Record<KitSort, string> = {
  newest: 'Date (Newest)', oldest: 'Date (Oldest)',
  price_low: 'Price (Low-High)', price_high: 'Price (High-Low)',
  name_az: 'Name (A-Z)', name_za: 'Name (Z-A)',
};

export default function KitStore({ mounted }: { mounted: boolean }) {
  const tagList = useMemo(() => ['All', ...kitTypeList()], []);
  const [selected, setSelected] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<KitSort>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const close = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    const id = window.setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('click', close);
    };
  }, [sortOpen]);

  const filtered = useMemo(() => {
    let list = selected === 'All' ? [...kits] : kits.filter((k) => k.type === selected);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((k) => k.title.toLowerCase().includes(q) || (k.type || '').toLowerCase().includes(q));
    list.sort((a, b) => {
      switch (sort) {
        case 'oldest': return +new Date(a.dateAdded) - +new Date(b.dateAdded);
        case 'price_low': return a.price - b.price;
        case 'price_high': return b.price - a.price;
        case 'name_az': return a.title.localeCompare(b.title);
        case 'name_za': return b.title.localeCompare(a.title);
        default: return +new Date(b.dateAdded) - +new Date(a.dateAdded);
      }
    });
    return list;
  }, [selected, query, sort]);

  return (
    <section id="kits" className="grid-column">
      <div className="section-header">
        <div className="section-label"><span>Kits &amp; Packs</span><div className="section-rule"><hr /></div></div>
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" className="search-input" placeholder="Search kits &amp; packs" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="search-clear" aria-label="Clear search" hidden={query.trim() === ''} onClick={() => setQuery('')}>
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="tag-filters" id="kitFilters">
          {tagList.map((tag) => (
            <button key={tag} className={`tag-filter-btn${selected === tag ? ' active' : ''}`} onClick={() => setSelected(tag)}>{tag}</button>
          ))}
        </div>
        <div className="filter-controls-row">
          <div className="sort-wrap">
            <span className="mode-label">Sort:</span>
            <div
              className={`custom-select${sortOpen ? ' open' : ''}`}
              id="customKitSort"
              ref={sortRef}
              onKeyDown={(e) => { if (e.key === 'Escape' && sortOpen) { setSortOpen(false); sortRef.current?.querySelector('button')?.focus(); } }}
            >
              <button type="button" className="custom-select-btn" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((o) => !o)}>
                <span>{SORT_LABELS[sort]}</span>
                <svg className="select-arrow" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <ul className="custom-select-list" role="listbox" aria-label="Sort kits">
                {(Object.keys(SORT_LABELS) as KitSort[]).map((k) => (
                  <li
                    key={k}
                    role="option"
                    aria-selected={sort === k}
                    tabIndex={sortOpen ? 0 : -1}
                    className={`custom-select-item${sort === k ? ' active' : ''}`}
                    onClick={() => { setSort(k); setSortOpen(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSort(k); setSortOpen(false); } }}
                  >{SORT_LABELS[k]}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="filter-controls-spacer shuffle-btn shuffle-btn--placeholder" aria-hidden="true">Shuffle</div>
        </div>
        <div className="item-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="scroll-list" id="kitList">
        {filtered.length === 0 ? (
          <div className="no-results">{query.trim() ? `No results for "${query.trim()}"` : 'No items match criteria'}</div>
        ) : (
          filtered.map((kit) => <KitCard key={kit.id} kit={kit} mounted={mounted} />)
        )}
      </div>
    </section>
  );
}
