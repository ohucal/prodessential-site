// SEO keyword generation from beat/kit tags — the payoff of the crawlable port.
// Research-backed (2026 "type beat" SEO): long-tail combos beat broad head terms;
// buyers search [artist]/[mood][subgenre] + "type beat" and artist crossovers.
import type { Beat, Kit } from './products';
import { freeEligible } from './products';

export const SITE_YEAR = new Date().getFullYear(); // baked at build; refreshes on redeploy

type TagCategory = 'artist' | 'subgenre' | 'mood' | 'instrument';

// Classified tag taxonomy (confirmed with the owner). Unknown tags fall through
// to a title-cased "mood/descriptor" so newly-added tags degrade gracefully.
const TAG_TAXONOMY: Record<string, { category: TagCategory; display: string }> = {
  veeze: { category: 'artist', display: 'Veeze' },
  lucki: { category: 'artist', display: 'Lucki' },
  detroit: { category: 'subgenre', display: 'Detroit' },
  glo: { category: 'subgenre', display: 'Glo' },
  dark: { category: 'mood', display: 'Dark' },
  chill: { category: 'mood', display: 'Chill' },
  emotional: { category: 'mood', display: 'Emotional' },
  melodic: { category: 'mood', display: 'Melodic' },
  upbeat: { category: 'mood', display: 'Upbeat' },
  brass: { category: 'instrument', display: 'Brass' },
  epiano: { category: 'instrument', display: 'Electric Piano' },
  piano: { category: 'instrument', display: 'Piano' },
  sample: { category: 'instrument', display: 'Sample' },
  vocals: { category: 'instrument', display: 'Vocals' },
};

const titleCase = (s: string) => s.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function classify(tag: string): { category: TagCategory; display: string } {
  return TAG_TAXONOMY[tag.toLowerCase()] || { category: 'mood', display: titleCase(tag) };
}

interface TagGroups { artists: string[]; subgenres: string[]; moods: string[]; instruments: string[]; }

function group(tags: string[]): TagGroups {
  const g: TagGroups = { artists: [], subgenres: [], moods: [], instruments: [] };
  tags.forEach((t) => {
    const { category, display } = classify(t);
    if (category === 'artist') g.artists.push(display);
    else if (category === 'subgenre') g.subgenres.push(display);
    else if (category === 'mood') g.moods.push(display);
    else g.instruments.push(display);
  });
  return g;
}

// Short descriptor that leads the <title> (primary keyword first, ≤3 words).
// Priority: artist(s) → subgenre → mood.
export function beatDescriptor(beat: Beat): string {
  const g = group(beat.tags);
  if (g.artists.length >= 2) return `${g.artists[0]} x ${g.artists[1]}`;
  if (g.artists.length === 1) {
    const extra = g.subgenres[0] || g.moods[0];
    return extra ? `${extra} ${g.artists[0]}` : g.artists[0];
  }
  const parts = [g.moods[0], g.subgenres[0] || g.instruments[0]].filter(Boolean);
  return parts.length ? parts.join(' ') : 'Type';
}

// Exhaustive long-tail keyword list for JSON-LD + meta (not visible → safe).
export function beatKeywords(beat: Beat): string[] {
  const g = group(beat.tags);
  const out = new Set<string>();
  const free = freeEligible(beat);

  [...g.artists, ...g.subgenres, ...g.moods].forEach((t) => {
    out.add(`${t} type beat`);
    if (free) out.add(`free ${t} type beat`);
  });
  // Artist crossover
  if (g.artists.length >= 2) out.add(`${g.artists[0]} x ${g.artists[1]} type beat`);
  // Mood + subgenre combos (highest buyer intent)
  g.moods.forEach((m) => g.subgenres.forEach((s) => out.add(`${m} ${s} type beat`)));
  // Artist + subgenre/mood combos
  g.artists.forEach((a) => {
    g.subgenres.forEach((s) => out.add(`${s} ${a} type beat`));
    g.moods.forEach((m) => out.add(`${m} ${a} type beat`));
  });

  out.add(`${beat.title} type beat`);
  out.add(`${beat.bpm} bpm type beat`);
  out.add(`type beat ${SITE_YEAR}`);
  if (free) out.add('free type beat');
  out.add('trap type beat');
  out.add('rap beat');
  // Underground long-tails (hot buyer keywords).
  out.add('underground type beat');
  out.add('underground trap beat');
  out.add('underground rap beat');
  [...g.moods, ...g.subgenres].forEach((t) => out.add(`underground ${t.toLowerCase()} type beat`));
  if (free) out.add('free underground type beat');
  out.add('prod.essential');
  return Array.from(out);
}

// SEO <title>: primary keyword leftmost, beat name quoted, year, brand.
export function beatTitle(beat: Beat): string {
  return `${beatDescriptor(beat)} Underground Type Beat "${beat.title}" | ${SITE_YEAR} prod.essential`;
}

// Natural-reading meta description (NOT keyword-stuffed).
export function beatDescription(beat: Beat): string {
  const g = group(beat.tags);
  const artist = g.artists.length ? ` in the style of ${g.artists.join(' & ')}` : '';
  const free = freeEligible(beat) ? ' Free download available for non-profit use.' : '';
  return `${beat.title} is a ${beat.bpm} BPM ${beat.key} underground type beat by prod.essential${artist}. Stream the preview and license instantly from $${beat.basePrice}.${free}`;
}

// Clean, visitor-facing tag line for the on-page kicker — the single place tags
// appear on the beat page: moods + subgenres + instruments (no artist names,
// no "type beat" phrasing). Keywords live in the <head>.
export function beatVisibleGenre(beat: Beat): string {
  const g = group(beat.tags);
  const parts = [...g.moods, ...g.subgenres, ...g.instruments];
  return parts.length ? parts.join(' · ') : 'Beat';
}

// Visible page-body copy. Deliberately varied per beat (deterministic on the
// id so the static export is stable) — 40+ pages of one identical template
// sentence reads machine-made.
export function beatBodyCopy(beat: Beat): string {
  const g = group(beat.tags);
  const mood = g.moods[0]?.toLowerCase();
  const rawInst = g.instruments[0]?.toLowerCase();
  const inst = rawInst === 'sample' ? 'samples' : rawInst;
  const hash = [...beat.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const variants = [
    `${beat.title} is a ${beat.bpm} BPM underground beat in the key of ${beat.key}. Preview it below and pick the license that fits your release.`,
    mood ? `A ${mood} one: ${beat.bpm} BPM in ${beat.key}${inst ? `, built around ${inst}` : ''}. Run the preview, then grab the license that matches your release.` : null,
    `${beat.bpm} BPM in ${beat.key}. If ${beat.title} fits your sound, licensing starts below and every tier delivers instantly.`,
    mood ? `${beat.title} keeps it ${mood} at ${beat.bpm} BPM in ${beat.key}. Preview it below; files land right after checkout.` : null,
  ].filter((v): v is string => v !== null);
  return variants[hash % variants.length];
}

// ── Kits ─────────────────────────────────────────────────────────────────────
export function kitKeywords(kit: Kit): string[] {
  const out = new Set<string>();
  out.add(kit.title);
  if (kit.type) {
    const t = kit.type.toLowerCase();
    out.add(t);
    out.add(`free ${t}`);
    out.add(`${t} ${SITE_YEAR}`);
  }
  out.add('drum kit');
  out.add('sample pack');
  out.add('serum bank');
  out.add('prod.essential');
  return Array.from(out);
}

export function kitTitle(kit: Kit): string {
  return `${kit.title} | ${kit.type} | ${SITE_YEAR} prod.essential`;
}

export function kitDescription(kit: Kit): string {
  const base = kit.description || `${kit.title}, a ${kit.type} from prod.essential.`;
  const cta = kit.checkoutUrl === '#' ? `Coming soon for $${kit.price}.` : `Instant download for $${kit.price}.`;
  return `${base} ${cta}`;
}
