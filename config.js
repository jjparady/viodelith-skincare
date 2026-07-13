/* =========================================================
   Viodelith Skincare — Store configuration
   ---------------------------------------------------------
   This is the ONLY file you edit to switch the storefront
   from the built-in demo catalogue to a live Shopify store.

   To go live (see SHOPIFY_SETUP.md for the full checklist):
     1. Create the Shopify store and add products.
     2. Create a Storefront API access token.
     3. Fill in `domain` and `storefrontToken` below.
     4. Change `provider` from "mock" to "shopify".
   Nothing else in the site needs to change.
   ========================================================= */

window.VIODELITH_CONFIG = {
  // "mock"    -> built-in demo catalogue + localStorage cart (no real payments)
  // "shopify" -> live products, cart, and checkout via the Shopify Storefront API
  provider: "mock",

  shopify: {
    // e.g. "viodelith.myshopify.com" (or your custom Shopify domain)
    domain: "",
    // Storefront API public access token (safe to expose in the browser)
    storefrontToken: "",
    // Storefront API version to target
    apiVersion: "2024-10",
    // How many products to load at once
    productsToLoad: 60,
  },

  // Presentation only. Settlement currency is set in Shopify (USD for a US
  // business). When Shopify Markets is enabled it supplies real localized
  // prices; until then this drives the demo catalogue's formatting.
  currency: {
    default: "USD",
    symbols: { USD: "$", HNL: "L" },
  },

  // Where orders ship. Used for copy and, later, Shopify shipping zones.
  markets: ["US", "HN"],
};
