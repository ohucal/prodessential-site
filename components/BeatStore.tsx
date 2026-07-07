'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { beats, beatTagList, beatTagsWithFree, FREE_TAG } from '@/lib/products';
import { usePlayer } from '@/stores/usePlayer';
import BeatCard from './BeatCard';
import WaveRule from './WaveRule';

type Sort = 'newest' | 'oldest' | 'bpm_high' | 'bpm_low' | 'name_az' | 'name_za' | 'shuffle';

const SORT_LABELS: Record<Exclude<Sort, 'shuffle'>, string> = {
  newest: 'Date (Newest)', oldest: 'Date (Oldest)',
  bpm_high: 'BPM: High to Low', bpm_low: 'BPM: Low to High',
  name_az: 'Name (A-Z)', name_za: 'Name (Z-A)',
};

function matchesSearch(b: (typeof beats)[number], q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return b.title.toLowerCase().includes(s)
    || b.tags.some((t) => t.toLowerCase().includes(s))
    || String(b.bpm).includes(s)
    || (b.key || '').toLowerCase().includes(s);
}

export default function BeatStore({ mounted }: { mounted: boolean }) {
  const tagList = useMemo(() => ['All', ...beatTagList()], []);
  const [selected, setSelected] = useState<string[]>(['All']);
  const [mode, setMode] = useState<'any' | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<string[]>([]);
  const [spinKey, setSpinKey] = useState(0);
  const prevSortRef = useRef<Sort>('newest');
  const sortRef = useRef<HTMLDivElement>(null);
  const setFilteredIds = usePlayer((s) => s.setFilteredIds);

  // "FREE STUFF" nav → show free beats.
  useEffect(() => {
    const handler = () => {
      setSelected([FREE_TAG]);
      document.getElementById('beats')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('pe:freebeats', handler);
    return () => window.removeEventListener('pe:freebeats', handler);
  }, []);

  // Close sort dropdown on outside click (only while open).
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
    let list = selected.includes('All')
      ? [...beats]
      : beats.filter((item) => {
          const itemTags = beatTagsWithFree(item);
          return mode === 'any'
            ? selected.some((t) => itemTags.includes(t))
            : selected.every((t) => itemTags.includes(t));
        });
    if (query.trim()) list = list.filter((b) => matchesSearch(b, query));

    if (sort === 'shuffle') {
      list.sort((a, b) => {
        const ia = shuffleOrder.indexOf(String(a.id));
        const ib = shuffleOrder.indexOf(String(b.id));
        return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
      });
    } else {
      list.sort((a, b) => {
        switch (sort) {
          case 'oldest': return +new Date(a.dateAdded) - +new Date(b.dateAdded);
          case 'bpm_high': return b.bpm - a.bpm;
          case 'bpm_low': return a.bpm - b.bpm;
          case 'name_az': return a.title.localeCompare(b.title);
          case 'name_za': return b.title.localeCompare(a.title);
          default: return +new Date(b.dateAdded) - +new Date(a.dateAdded);
        }
      });
    }
    return list;
  }, [selected, mode, query, sort, shuffleOrder]);

  // Feed playback order from the visible list.
  useEffect(() => {
    setFilteredIds(filtered.map((b) => String(b.id)));
  }, [filtered, setFilteredIds]);

  const activeTagCount = selected.filter((t) => t !== 'All').length;

  function handleTagClick(tag: string) {
    if (tag === 'All') { setSelected(['All']); return; }
    setSelected((prev) => {
      let next = prev.filter((t) => t !== 'All');
      if (next.includes(tag)) {
        next = next.filter((t) => t !== tag);
        if (next.length === 0) next = ['All'];
      } else {
        next = [...next, tag];
        if (next.length > 5) next.shift();
      }
      return next;
    });
  }

  function doShuffle() {
    if (sort !== 'shuffle') prevSortRef.current = sort;
    const ids = beats.map((b) => String(b.id));
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffleOrder(ids);
    setSort('shuffle');
    setSpinKey((k) => k + 1);
  }
  function stopShuffle(e: React.MouseEvent) {
    e.stopPropagation();
    if (sort !== 'shuffle') return;
    setSort(prevSortRef.current || 'newest');
  }

  const sortLabel = sort === 'shuffle' ? 'Shuffled' : SORT_LABELS[sort];

  return (
    <section id="beats" className="grid-column left-col">
      <div className="section-header">
        <div className="section-label"><span>Beat Store</span><WaveRule /></div>
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" className="search-input" placeholder="Search beats, tags, key, BPM" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="search-clear" aria-label="Clear search" hidden={query.trim() === ''} onClick={() => setQuery('')}>
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="tag-filters" id="beatFilters">
          {tagList.map((tag) => (
            <button
              key={tag}
              className={`tag-filter-btn${tag === FREE_TAG ? ' tag-filter-btn--free' : ''}${selected.includes(tag) ? ' active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="filter-controls-row">
          <div className="filter-mode-wrap" hidden={activeTagCount < 2}>
            <span className="mode-label">Match:</span>
            <div className="match-seg" role="group" aria-label="Tag match mode">
              <button
                className={`mode-toggle-btn${mode === 'any' ? ' active' : ''}`}
                onClick={() => setMode('any')}
                title={`Show beats that have at least one of the ${activeTagCount} selected tags`}
              >Any tag</button>
              <button
                className={`mode-toggle-btn${mode === 'all' ? ' active' : ''}`}
                onClick={() => setMode('all')}
                title={`Show only beats that have all ${activeTagCount} selected tags`}
              >All tags</button>
            </div>
          </div>
          <div className="sort-wrap">
            <span className="mode-label">Sort:</span>
            <div
              className={`custom-select${sortOpen ? ' open' : ''}`}
              id="customSort"
              ref={sortRef}
              onKeyDown={(e) => { if (e.key === 'Escape' && sortOpen) { setSortOpen(false); sortRef.current?.querySelector('button')?.focus(); } }}
            >
              <button type="button" className="custom-select-btn" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((o) => !o)}>
                <span>{sortLabel}</span>
                <svg className="select-arrow" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <ul className="custom-select-list" role="listbox" aria-label="Sort beats">
                {(Object.keys(SORT_LABELS) as (keyof typeof SORT_LABELS)[]).map((k) => (
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
          <button className={`shuffle-btn${sort === 'shuffle' ? ' active' : ''}`} onClick={doShuffle} aria-label="Shuffle beats" title="Shuffle beats randomly">
            <svg key={spinKey} className={`shuffle-icon${spinKey > 0 ? ' shuffle-icon--spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
            <span>Shuffle</span>
            <span className="shuffle-clear" role="button" tabIndex={0} onClick={stopShuffle} aria-label="Turn off shuffle" title="Turn off shuffle">
              <svg viewBox="0 0 12 12" fill="none" width="11" height="11"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </span>
          </button>
        </div>
        <div className="item-count-row">
          <span className="store-hint">
            <svg viewBox="0 0 24 24" fill="none" width="9" height="9" aria-hidden="true"><polygon points="5,3 19,12 5,21" fill="currentColor" /></svg>
            tap play on any cover to listen
          </span>
          <span className="item-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="scroll-list" id="beatList">
        {filtered.length === 0 ? (
          <div className="no-results">{query.trim() ? `No results for "${query.trim()}"` : 'No items match criteria'}</div>
        ) : (
          filtered.map((beat) => <BeatCard key={beat.id} beat={beat} mounted={mounted} />)
        )}
      </div>
    </section>
  );
}
