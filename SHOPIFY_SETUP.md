# Going live with Shopify

The store is already built. It runs today on a **built-in demo catalogue**
(`provider: "mock"` in `config.js`) so the site looks and behaves like a real
shop — product grid, filters, cart drawer, quantities — but takes no real
payments.

When your friend is ready to sell, switching to a live Shopify backend is a
**config change, not a rebuild**. The whole storefront (design, pages, cart)
stays exactly the same; only where the products, cart, and checkout come from
changes.

## One-time setup

1. **Create the Shopify store** at [shopify.com](https://www.shopify.com) using
   the US business details and bank account. Choose a plan that includes the
   Storefront API (all paid plans do).

2. **Add products.** For each item set a title, price, description, at least one
   photo, and — importantly — a **stock quantity** and a **product type**
   (e.g. "Serum", "Cleanser"). The site uses product type as the shop filter
   category, and hides items automatically when they sell out.

3. **Turn on Shopify Payments** (Settings → Payments). As a US business this lets
   you accept cards; customers in Honduras can pay with any international card.

4. **Create a Storefront API access token:**
   - Shopify admin → **Settings → Apps and sales channels → Develop apps**
   - **Create an app** (name it e.g. "Viodelith Website")
   - **Configure Storefront API scopes** → enable at least:
     `unauthenticated_read_product_listings`,
     `unauthenticated_read_product_inventory`,
     `unauthenticated_write_checkouts`,
     `unauthenticated_read_checkouts`
   - **Install app**, then copy the **Storefront API access token**
   - This token is *public by design* — it's safe to put in the website.

5. **Edit `config.js`** and set:
   ```js
   provider: "shopify",
   shopify: {
     domain: "your-store.myshopify.com",   // your Shopify domain
     storefrontToken: "PASTE_TOKEN_HERE",
     apiVersion: "2024-10",
     productsToLoad: 60,
   },
   ```

6. **Commit and push.** GitHub Pages redeploys in a minute or two and the site is
   now backed by live inventory, cart, and Shopify's secure checkout.

## Shipping, currency, and Spanish (Phase 2)

- **Shipping to US + Honduras:** Shopify admin → Settings → Shipping. Create a US
  zone and an international zone that includes Honduras, with your rates.
- **Currency (USD / HNL):** enable **Shopify Markets** to show localized prices;
  funds still settle in USD.
- **Spanish:** the bilingual toggle is a separate front-end task we can do next;
  Shopify's *Translate & Adapt* app can localize product text to pair with it.

## How to verify after switching

1. Open the site — the product grid should now show your **real** products/photos.
2. Add something to the bag — the cart drawer shows it with the live price.
3. Click **Checkout** — you should land on Shopify's secure checkout page.
4. Do a real (or Shopify test-mode) order and confirm it appears in Shopify admin.

## Rolling back

Set `provider: "mock"` in `config.js` and push. The site returns to the demo
catalogue instantly — handy for screenshots or if the store is ever paused.
