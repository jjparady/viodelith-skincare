# Viodelith Skincare

A classy, minimal storefront for **Viodelith Skincare** — a curated house of
considered Korean skincare. Built as a fast, dependency-free static site.

## Aesthetic

- **Neutral, warm-paper palette** — off-whites, sand, stone, taupe, soft charcoal ink.
- **Type** — Cormorant Garamond (serif display) paired with Jost (clean sans), with system fallbacks.
- **Quiet, editorial layout** — generous whitespace, thin rules, subtle scroll reveals.

## Structure

```
index.html    Home — hero, featured edit, philosophy, ritual, values, journal, newsletter
shop.html     Shop — filterable product grid
about.html    Our Story — brand narrative + promise
journal.html  Journal — listing of articles
article.html  Journal — single article, rendered from ?slug=
styles.css    All styles (single stylesheet, CSS custom properties)
config.js     Store configuration — the one file you edit to go live (see below)
commerce.js   Commerce adapter — mock + Shopify providers behind one API
i18n.js       Localization — EN/ES dictionary, USD/HNL currency (window.L10n)
journal.js    Journal — bilingual article data + list/article rendering
script.js     UI — product rendering, cart drawer, filters, reveals, mobile menu
```

## Journal

A static, data-driven blog. Articles live as bilingual data in `journal.js`;
`journal.html` renders the list and `article.html` renders a single post from a
`?slug=` query. To add an article, append one entry to the `ARTICLES` array —
no new files needed. Localizes and re-renders through `window.L10n` like the
rest of the site.

## Language & currency

The site is bilingual (English / Spanish) with a USD / HNL price display, toggled
from the utility bar and remembered per visitor. All of it runs through
`window.L10n` (`i18n.js`):

- **Copy** carries `data-i18n` attributes filled from one dictionary; product names
  and descriptions are localized from the catalogue.
- **Currency** converts from the USD base at an indicative rate for display only —
  a US business settles in USD, and the cart says so when HNL is selected. Real
  localized pricing comes from Shopify Markets once the store is live.

## Commerce

The storefront talks to the store only through `window.Commerce` (in
`commerce.js`), which has two interchangeable providers selected in `config.js`:

- **`mock`** (default) — a built-in demo catalogue with a `localStorage` cart and
  a demo checkout. The site behaves like a real shop but takes no payments.
- **`shopify`** — the full Shopify Storefront API implementation (products, cart,
  hosted checkout). Built and ready, dormant until configured.

Going live is a config change, not a rebuild: create the Shopify store, paste the
domain + Storefront API token into `config.js`, flip `provider` to `"shopify"`,
and push. **See [`SHOPIFY_SETUP.md`](SHOPIFY_SETUP.md) for the full checklist.**

## Running

It's a static site — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- Demo product imagery uses inline SVG bottle illustrations, so the site works fully
  offline (fonts load from Google Fonts when online, with graceful system fallbacks).
  Once on Shopify, real product photos are used automatically.
- In demo mode the bag uses `localStorage`; on Shopify it uses a real Storefront cart.
- Bilingual EN/ES and USD/HNL display are built in (`i18n.js`). When Shopify goes
  live, pair it with Shopify's *Translate & Adapt* and *Markets* for server-side
  translations and real localized pricing (see `SHOPIFY_SETUP.md`).
