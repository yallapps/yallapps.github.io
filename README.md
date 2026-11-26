# yallapps.github.io

Source of the YallApps website: https://yallapps.github.io

Static site (HTML, CSS, a little JavaScript), no build step. Fonts are self-hosted; no analytics, no cookies.

- `index.html` — home and app catalogue
- `athkar360/` — Athkar 360 page, privacy policy and screenshots
- `athkar360/latest.json`, `beta.json`, `android*/` — written by the Athkar 360 release workflow; do not edit by hand
- `nexnum/` — NexNum page, privacy policy and screenshots (release files written by the NexNum workflow)
- `assets/` — shared styles, script, fonts and images

## Languages

English at the root, French under `fr/`, Arabic (RTL) under `ar/`, for the home page and the Athkar 360 pages.
Each page lists its translations with `<link rel="alternate" hreflang>` and has a language switch in the header.
When you change an English page, update its `fr/` and `ar/` copies too. Arabic text uses IBM Plex Sans Arabic
(`assets/fonts/plex-arabic-*.woff2`, OFL); use logical CSS properties (`margin-inline-start`…) so layouts mirror in RTL.

## Identity

Dark-only, cinematic design. Fonts (Sora, Inter) are self-hosted.

- **Studio (YallApps)**: deep black + signal red. Used by the home page, header, footer and 404.
- **Each app**: its own accent colours, set with `data-app="<id>"` on the app page's `<body>` and on its catalogue items.
  The accents live at the end of `assets/site.css` ("App themes").

## Adding an app

1. Add a theme block `[data-app='<id>']` at the end of `assets/site.css` (background tint, brand colours, accent).
2. Copy `athkar360/` to `<id>/`: replace texts, screenshots (`img/`, English UI, 390×844 at 2x, WebP — dark screenshots look best),
   icon and privacy policy.
3. Add or update the app in `APPS` in `tools/catalog.js` (category, tagline in EN/FR/AR, `live: true` once published),
   then run `node tools/catalog.js`: it rebuilds the "All apps" catalogue and category filters on the three home pages.
   Optionally make the app the "Featured" spotlight.
   Add the pages to `sitemap.xml`.
4. The app's release workflow writes `<id>/latest.json`, `beta.json` and the `android*/` download links.
