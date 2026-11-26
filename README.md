# yallapps.github.io

Source of the YallApps website: https://yallapps.github.io

Static site (HTML, CSS, a little JavaScript), no build step. Fonts are self-hosted; no analytics, no cookies.

- `index.html` — home and app catalogue
- `athkar360/` — Athkar 360 page, privacy policy and screenshots
- `athkar360/latest.json`, `beta.json`, `android*/` — written by the Athkar 360 release workflow; do not edit by hand
- `nexnum/` — NexNum page, privacy policy and screenshots (release files written by the NexNum workflow)
- `assets/` — shared styles, script, fonts and images

## Identity

Dark-only, cinematic design. Fonts (Sora, Inter) are self-hosted.

- **Studio (YallApps)**: deep black + signal red. Used by the home page, header, footer and 404.
- **Each app**: its own accent colours, set with `data-app="<id>"` on the app page's `<body>` and on its catalogue items.
  The accents live at the end of `assets/site.css` ("App themes").

## Adding an app

1. Add a theme block `[data-app='<id>']` at the end of `assets/site.css` (background tint, brand colours, accent).
2. Copy `athkar360/` to `<id>/`: replace texts, screenshots (`img/`, English UI, 390×844 at 2x, WebP — dark screenshots look best),
   icon and privacy policy.
3. On the home page, add a poster in "All apps" (`data-app="<id>"`), and optionally make it the "Featured" spotlight.
   Add the pages to `sitemap.xml`.
4. The app's release workflow writes `<id>/latest.json`, `beta.json` and the `android*/` download links.
