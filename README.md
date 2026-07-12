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
script.js     Product catalogue, cart (localStorage), filters, reveals, mobile menu
```

## Running

It's a static site — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- Product imagery uses inline SVG bottle illustrations, so the site works fully offline
  (fonts load from Google Fonts when online, with graceful system fallbacks).
- The bag uses `localStorage` as a lightweight demo — no backend yet.
- This is an early showcase build; styling and functionality will be refined.
