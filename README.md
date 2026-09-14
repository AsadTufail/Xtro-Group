# Xtro Group — website

Static marketing site for Xtro Group, an eCommerce agency in Multan managing
international brands on Amazon, eBay, Walmart and adjacent marketplaces.

No build step, no dependencies, no framework. Open `index.html` or drop the folder
on any static host.

```
index.html         Homepage — hero globe, services, process, operation, careers, contact
careers.html       Full eCommerce Specialist role + application form
assets/styles.css  Design tokens, layout, artwork and keyframes
assets/app.js      Hero globe, mobile menu, copyright year
assets/mark.svg    The globe mark, standalone (it is inlined in both pages)
```

## The brand world

Colours are sampled from the LinkedIn logo, not approximated:

| Token | Value | Where it came from |
| --- | --- | --- |
| `--void` | `#030805` | The logo ground — black with a green bias (`#000300`) |
| `--forest` | `#004400` | The globe wireframe |
| `--forest-lit` | `#0B6B22` | Structure: rules, icons, orbit rings, radar grid |
| `--lime` | `#BFFF13` | The "Group" wordmark. The signature — one bold colour |
| `--text` | `#E9F3E6` | The white "X", warmed toward green |

State colours (`--ok` lime, `--watch` `#F5A524`, `--risk` `#FF6B57`) are separate
hues so nothing in the console reads as decoration.

**The site commits to one dark world.** There is no light theme and no toggle — the
identity is a dark globe, and a light variant would fight it. Every colour is painted
explicitly, so the page holds on any background.

Type: **Sora** for display, **Manrope** for body, **JetBrains Mono** for labels,
SKUs and figures. All three load from Google Fonts.

## Artwork and motion

Everything animated renders complete at rest — nothing waits on a scroll trigger,
and every effect is disabled under `prefers-reduced-motion`.

- **Hero globe** (`assets/app.js`) — a real sphere on canvas: orthographic
  projection, 12 meridians and 5 parallels depth-cued by z, with the eight
  marketplace geographies we operate in (Seattle, Bentonville, Toronto, London,
  Berlin, Dubai, Tokyo, Sydney) and great-circle routes running back to Multan.
  Pulses travel the routes; the Multan node breathes. Pauses when scrolled out of
  view or the tab is hidden. Under reduced motion it draws one still frame.
- **Service icons** — eight hand-drawn SVGs, each `pathLength="100"` so hovering a
  card redraws the strokes.
- **Process rail** — a luminous signal running down the stage rail, staggered per
  stage so it reads as a relay rather than four things blinking together.
- **Channel marquee** — continuous ribbon, pauses on hover, becomes a plain
  scrollable row under reduced motion.
- **Orbit** (careers) and **radar** (contact) — dashed rings and a sweep over the
  real office coordinates, 30.16°N 71.52°E.
- **Grain** — one fixed SVG-noise layer at 4% over the whole page.

## Before you launch

These are placeholders. Replace them or the site will send mail nowhere:

- `hello@xtrogroup.com` — enquiry form action and contact block (`index.html`)
- `careers@xtrogroup.com` — application form action and contact block (`careers.html`)
- `https://pk.linkedin.com/company/xtro-group` — LinkedIn link in the contact block
- `https://xtrogroup.com/` — the `<link rel="canonical">` in `index.html`
- Street address — currently "Gulgasht Colony, Multan, Punjab" with no building or road

**Both forms post via `mailto:`**, which opens the visitor's mail client and loses a
share of submissions. Before launch, point `action` at a real endpoint — Formspree,
Web3Forms, Netlify Forms (`data-netlify="true"`) or your own handler — and drop the
`enctype="text/plain"` attribute when you do.

The hero account console carries **example figures**, labelled as such in the panel
footer. If you swap in real numbers, get the client's permission first and keep the
labelling honest.

**The logo.** The masthead mark is a clean vector redraw of the LinkedIn logo, not
the logo file — that file is a 100×100 JPEG on a white square and would look broken
at any size here. If you have the original vector, swap it into `assets/mark.svg` and
the two inlined copies in the page headers.

## Hosting

Any static host works. Netlify or Cloudflare Pages: connect the repo, no build
command, publish directory `.`. GitHub Pages: push and enable Pages on the branch root.
