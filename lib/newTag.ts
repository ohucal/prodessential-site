// ── "NEW" sticker font ────────────────────────────────────────────────────────
// The gold "NEW" sticker on beat pages can wear any of these faces. To switch,
// change NEW_TAG_FONT below to one of the keys and save (styles live in
// style.css under `.new-stamp[data-newfont="..."]`).
//
//   archivo — expanded-black display face (the site's default headline face)
//   anton   — ultra-condensed poster face, loudest / most "hype sticker"
//   chakra  — squared techy face (same one the $ price tags use)
//   space   — modern geometric grotesk, clean and current
//   mono    — utilitarian monospace, understated
//   hanken  — humanist italic black (the earlier look)
//
// Prefer to eyeball them first? Open any new beat's page and run, in the
// browser console:  window.setNewFont('anton')  — it swaps the sticker live so
// you can flip through every option before committing one here.

export type NewTagFont = 'archivo' | 'anton' | 'chakra' | 'space' | 'mono' | 'hanken';

export const NEW_TAG_FONTS: NewTagFont[] = ['archivo', 'anton', 'chakra', 'space', 'mono', 'hanken'];

export const NEW_TAG_FONT: NewTagFont = 'archivo';
