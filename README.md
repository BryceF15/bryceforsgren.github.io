# Bryce Forsgren — portfolio site

Plain HTML, CSS and JavaScript. No build step: open `index.html` or push the folder to GitHub Pages.

## Where things live

| You want to change… | Edit |
|---|---|
| Any text, project, experience entry, photo list, email, LinkedIn | `js/data.js` |
| Colours, fonts, spacing, layout | `css/site.css` (tokens at the top, section 2) |
| The hero flow field (line spacing, speed, colours) | `CONFIG` at the top of `js/flow.js` |
| Page structure / section order | `index.html` |
| Case study layout | `renderCase()` in `js/site.js` |

## Adding photos

Drop files at the paths listed in `js/data.js`. Until a file exists, its slot shows a labelled placeholder saying which photo belongs there.

- Hero: `assets/img/hero.jpg` (landscape, about 2400 px wide)
- Project photos: `assets/img/<project-slug>/…`
- Photography: `assets/img/photos/01.jpg` … plus `edit-before.jpg` / `edit-after.jpg`
- Resume: `assets/docs/Bryce_Forsgren_Resume.pdf`

Export JPGs at 2400 px on the long edge or less, quality 80, to keep the site fast.

## Adding a project

Copy any block in `projects` inside `js/data.js`, give it a new `slug`, and set `group` to `featured`, `also` or `building`. Its page appears automatically at `project.html?p=<slug>`.

## Publishing on GitHub Pages

1. Create a repo (e.g. `bryceforsgren.github.io` or any name) and push this folder to it.
2. Repo **Settings → Pages**: Source = "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Custom domain: buy it, add it under Settings → Pages → Custom domain, then add the DNS records GitHub shows you. GitHub creates the `CNAME` file for you.

## Fonts

Self-hosted in `assets/fonts` (Archivo, Inter Tight, Newsreader italic; SIL Open Font License). No requests to Google.
