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
  out.add('prod.essential');
  return Array.from(out);
}

// SEO <title>: primary keyword leftmost, beat name quoted, year, brand.
export function beatTitle(beat: Beat): string {
  return `${beatDescriptor(beat)} Type Beat — "${beat.title}" | ${SITE_YEAR} prod.essential`;
}

// Natural-reading meta description (NOT keyword-stuffed).
export function beatDescription(beat: Beat): string {
  const g = group(beat.tags);
  const vibe = [...g.moods, ...g.subgenres].join(', ');
  const artist = g.artists.length ? ` in the style of ${g.artists.join(' & ')}` : '';
  const free = freeEligible(beat) ? ' Free download available for non-profit use.' : '';
  return `${beat.title} is a ${beat.bpm} BPM ${beat.key}${vibe ? ' ' + vibe : ''} type beat by prod.essential${artist}. Stream the preview and license instantly from $${beat.basePrice}.${free}`;
}

// Clean, visitor-facing genre label for the on-page kicker — moods + subgenres
// only (no artist names, no "type beat" phrasing). Keywords live in the <head>.
export function beatVisibleGenre(beat: Beat): string {
  const g = group(beat.tags);
  const parts = [...g.moods, ...g.subgenres];
  return parts.length ? parts.join(' · ') : 'Beat';
}

// One natural sentence for the visible page body — descriptive, not keyword-y.
export function beatBodyCopy(beat: Beat): string {
  const g = group(beat.tags);
  const descriptors = [...g.moods, ...g.instruments].map((s) => s.toLowerCase());
  const feel = descriptors.length ? `, ${descriptors.join(', ')} in feel` : '';
  return `${beat.title} is a ${beat.bpm} BPM beat in the key of ${beat.key}${feel}. Preview it below and pick the license that fits your release — every tier includes instant delivery.`;
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
  return `${kit.title} — ${kit.type} | ${SITE_YEAR} prod.essential`;
}

export function kitDescription(kit: Kit): string {
  const base = kit.description || `${kit.title}, a ${kit.type} from prod.essential.`;
  return `${base} Instant download — $${kit.price}.`;
}
