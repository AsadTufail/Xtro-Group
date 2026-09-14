# Xtro Group — website

Static marketing site for Xtro Group, an eCommerce agency in Multan managing
international brands on Amazon, eBay, Walmart and adjacent marketplaces.

No build step, no dependencies. Open `index.html` or drop the folder on any host.

```
index.html        Homepage — hero, services, process, operation, careers teaser, contact
careers.html      Full eCommerce Specialist role + application form
assets/styles.css Design tokens and all layout
assets/app.js     Theme toggle + copyright year (that is all the JS there is)
```

## Design system

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--paper` | `#E8EBEE` | `#0C1A23` | Ground |
| `--ink` | `#102532` | `#DFE8ED` | Body and headlines |
| `--marigold` | `#E8A317` | `#F0B03A` | The single accent — fills and marks only |
| `--good` / `--warn` / `--risk` | `#12795F` / `#B3792B` / `#B3462F` | lightened | Metric states, separate from the accent |

Type is **Archivo** on its width axis (`wdth 112` for headlines, `100` for body) with
**IBM Plex Mono** for row labels, SKUs and figures. Both load from Google Fonts.

Light and dark both work in all three viewer states: OS preference, and an explicit
choice stored in `localStorage` under `xtro-theme`.

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

The hero account panel carries **example figures**, labelled as such in the panel
footer. If you swap in real numbers, get the client's permission first and keep the
labelling honest.

Add a phone number and a WhatsApp link if you want them — there is room in the contact
card in both pages.

## Hosting

Any static host works. Netlify or Cloudflare Pages: connect the repo, no build command,
publish directory `.`. GitHub Pages: push and enable Pages on the branch root.
