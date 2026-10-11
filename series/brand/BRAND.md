# PK Explains · Brand kit

Everything the channel looks like, in one folder. Vectors are the masters; PNGs are exports. Fonts are
embedded as paths in every SVG, so they open correctly anywhere (Figma, Illustrator, Canva, a browser).

## Logo

| Asset | File | Use |
|---|---|---|
| Tile (amber, transparent bg) | `svg/pk-explains-tile-transparent.svg`, `png/pk-explains-tile-1024.png` | App icons, favicons, social avatars on any background |
| Avatar (tile on navy) | `svg/pk-explains-logo-tile.svg`, `png/pk-explains-avatar-navy-1024.png`, `youtube/pk-explains-profile-800.png` | YouTube / LinkedIn / X profile picture |
| Lockup, dark backgrounds | `svg/pk-explains-lockup-on-dark.svg`, `png/pk-explains-lockup-on-dark.png` | Title cards, slides, website header on navy |
| Lockup, light backgrounds | `svg/pk-explains-lockup-on-light.svg`, `png/pk-explains-lockup-on-light.png` | Documents, white pages, print |
| Watermark | `svg/pk-explains-watermark.svg`, `youtube/pk-explains-watermark-150.png` | YouTube branding watermark; in-film bug (55% opacity, top right) |
| Banner 2560×1440 | `svg/pk-explains-banner.svg`, `youtube/pk-explains-banner-2560x1440.png/.jpg` | YouTube channel art (logo + tagline sit inside the 1546×423 safe area) |

Rules: the tile is always amber with navy "PK", corner radius 21% of its width. Don't recolour, stretch,
outline, add shadows or put the tile on amber. Keep clear space of half a tile around the lockup.
Wordmark: **PK** bold + Explains regular, one space, never one word.

## Colours

| Name | Hex | Role |
|---|---|---|
| Navy | `#121E3B` | Background of every brand surface, text on amber |
| Amber | `#EAAA45` | The tile, accent words, rules, highlights (one accent per frame) |
| White | `#F7F7F5` | Headlines, "PK" in the wordmark |
| Mist | `#CBD1E2` | "Explains", body text, sublines |
| Deep navy | `#0E1830` | Vignette edge / gradient end |
| Glow navy | `#17264A` | Radial gradient centre |

In-film character colours (series rule, not logo colours): PostgreSQL staff coral `#FF7A59`, the OS blue
`#7FA8FF`, customers lilac `#B9B4C9`.

## Type

Lexend (SIL Open Font License, `source/fonts/OFL.txt`). Bold 700 for "PK" and headlines, ExtraBold 800 for
thumbnail headlines, Regular 400 for "Explains" and body, Medium 500 for small caps labels (letter-spacing .24em).
Fallbacks: Inter, Segoe UI, Arial.

## Tagline and voice

Tagline: **Short animated films on how things really work.** Production credit: **A PK Films Production.**
Voice: calm, curious, exact; a story first, the jargon second; no hype words.

## Templates

- `templates/thumbnail.html` - 1280×720 thumbnail layout (kicker / two-line headline with one amber word / subline over a real frame). `tools/publish/thumbnail.py` renders it per episode. Example: `templates/thumbnail-example-ep01.jpg`.
- `templates/short-overlay.html` - 1080×1920 Shorts frame (kicker, headline, PK tile, "full film" end card). `tools/short.py` uses it.
- In-film ident, watermark bug and end slate: `studio/brand/brand.css`, `studio/brand/brand.js` (shared by every episode).
- `brand.html` - the HTML source the YouTube PNGs were captured from.

## Regenerating

```
pip install fonttools
python3 series/brand/source/make_svg.py      # rewrites svg/*
```
`source/draw_canvas.js` draws the same assets on a canvas in the browser (used to upload straight into YouTube Studio).
`tools/qa/brandlint.py` checks a film uses only these colours, fonts and assets.

## Channel

See `channel.md` for the YouTube channel name, handle, description, links and playlist.
