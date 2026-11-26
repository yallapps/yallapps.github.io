# yallapps.github.io

Source of the YallApps website: https://yallapps.github.io

Static site (HTML, CSS, a little JavaScript), no build step. Fonts are self-hosted; no analytics, no cookies.

- `index.html` — home and app catalogue
- `athkar360/` — Athkar 360 page, privacy policy and screenshots
- `athkar360/latest.json`, `beta.json`, `android*/` — written by the Athkar 360 release workflow; do not edit by hand
- `assets/` — shared styles, script, fonts and images

## Identity

- **Studio (YallApps)**: night blue + yellow accent, dot-grid pattern. Used by the home page, header, footer and 404.
- **Each app**: its own palette, set with `data-app="<id>"` on the app page's `<body>` and on its catalogue card.
  The palettes live at the end of `assets/site.css` ("App themes").

## Adding an app

1. Add a theme block `[data-app='<id>']` (light) and `:root[data-theme='dark'] [data-app='<id>']` (dark) in `assets/site.css`,
   with the app's colours and an optional hero pattern in `assets/img/`.
2. Copy `athkar360/` to `<id>/`: replace texts, screenshots (`img/`, English UI, 390×844 at 2x, WebP), icon and privacy policy.
3. Add a card to the catalogue in `index.html` (`data-app="<id>"`, `data-release="/<id>"`) and the pages to `sitemap.xml`.
4. The app's release workflow writes `<id>/latest.json`, `beta.json` and the `android*/` download links.
