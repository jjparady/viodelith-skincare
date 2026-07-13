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
styles.css    All styles (single stylesheet, CSS custom properties)
config.js     Store configuration — the one file you edit to go live (see below)
commerce.js   Commerce adapter — mock + Shopify providers behind one API
script.js     UI — product rendering, cart drawer, filters, reveals, mobile menu
```

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
- Bilingual (EN/ES) support and USD/HNL currency for the US + Honduras markets are the
  next planned phase (see `SHOPIFY_SETUP.md`).
