"""Write ID3 tags (Title, Subtitle, Artist, Publisher, Comments) onto every beat's
audio file, driven by products.json. Safe to re-run after adding new beats —
each run overwrites the same frames rather than appending duplicates.
"""
import json
import os

from mutagen.id3 import ID3, ID3NoHeaderError, TIT2, TIT3, TPE1, TPUB, COMM

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_JSON = os.path.join(ROOT, "products.json")
# Assets live under public/ since the Next.js port (products.json paths are
# stored root-relative, e.g. "audio/x.mp3", and served from public/).
ASSETS_ROOT = os.path.join(ROOT, "public")

ARTIST = "prod.essential"
SUBTITLE = "prodessential.com — Free Beats & More"
COMMENT = (
    "Free tagged demo for non-profit use only. "
    "No distribution, monetization, or resale. License at prodessential.com"
)


def build_title(beat):
    suffix = "[FREE FOR NON-PROFIT]" if beat.get("freeDownload") else "[PREVIEW]"
    return f"[@prod.essential] - {beat['bpm']} - {beat['key']} - {beat['title']} {suffix}"


def tag_file(path, beat):
    try:
        tags = ID3(path)
    except ID3NoHeaderError:
        tags = ID3()

    tags.setall("TIT2", [TIT2(encoding=3, text=build_title(beat))])
    tags.setall("TIT3", [TIT3(encoding=3, text=SUBTITLE)])
    tags.setall("TPE1", [TPE1(encoding=3, text=ARTIST)])
    tags.setall("TPUB", [TPUB(encoding=3, text=ARTIST)])
    tags.setall("COMM", [COMM(encoding=3, lang="eng", desc="", text=COMMENT)])
    tags.delall("TDRC")  # drop the year — not wanted in the file metadata

    tags.save(path, v2_version=3)


def main():
    with open(PRODUCTS_JSON, encoding="utf-8") as f:
        data = json.load(f)

    free_count = 0
    preview_count = 0

    for beat in data["beats"]:
        audio_path = os.path.join(ASSETS_ROOT, beat["audioFile"])
        if not os.path.isfile(audio_path):
            print(f"  SKIP (missing file): {beat['audioFile']}")
            continue
        tag_file(audio_path, beat)
        is_free = bool(beat.get("freeDownload"))
        free_count += is_free
        preview_count += not is_free
        label = "free" if is_free else "preview"
        print(f"  tagged ({label}): {beat['audioFile']}")

    total = free_count + preview_count
    print(f"\n{total} files tagged: {free_count} free, {preview_count} preview")


if __name__ == "__main__":
    main()
