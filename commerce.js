/* =========================================================
   Viodelith Skincare — Commerce adapter
   ---------------------------------------------------------
   One stable API (window.Commerce) with two interchangeable
   providers. The rest of the site never talks to Shopify (or
   localStorage) directly — it only calls Commerce.* methods,
   so switching providers in config.js requires no other edits.

   Normalized product shape returned everywhere:
     { id, handle, title, category, price, currencyCode,
       tag, tone, image, description, available, variantId }

   Normalized cart shape:
     { lines: [{ key, id, title, price, qty, lineTotal,
                 image, tone, variantId }],
       count, subtotal, currencyCode, checkoutUrl }
   ========================================================= */

(function () {
  const CFG = window.VIODELITH_CONFIG || { provider: "mock" };
  const CURRENCY = (CFG.currency && CFG.currency.default) || "USD";

  /* ---------------------------------------------------------
     MOCK PROVIDER — demo catalogue + localStorage cart
     --------------------------------------------------------- */
  const MOCK_PRODUCTS = [
    { id: "hy-essence",  handle: "dew-veil-essence",   title: "Dew Veil Essence",       category: "Essence",     price: 42, tag: "Bestseller", tone: "amber",
      description: "A weightless hydrating essence with snail mucin and hyaluronic acid for glass-skin luminosity." },
    { id: "rice-cleanse", handle: "rice-milk-cleanser", title: "Rice Milk Cleanser",     category: "Cleanser",    price: 28, tag: null, tone: "cream",
      description: "A low-pH gel-to-milk cleanser that softens without stripping the moisture barrier." },
    { id: "gin-toner",   handle: "ginseng-softening-toner", title: "Ginseng Softening Toner", category: "Toner", price: 34, tag: "New", tone: "rose",
      description: "Fermented ginseng and rice water tone, prep, and firm in one restorative step." },
    { id: "cica-cream",  handle: "cica-barrier-cream",  title: "Cica Barrier Cream",     category: "Moisturiser", price: 46, tag: null, tone: "sage",
      description: "Centella asiatica and ceramides calm redness and rebuild a resilient barrier overnight." },
    { id: "prop-serum",  handle: "propolis-glow-serum", title: "Propolis Glow Serum",    category: "Serum",       price: 52, tag: "Bestseller", tone: "amber",
      description: "Black-bee propolis and niacinamide deliver a clarified, lit-from-within finish." },
    { id: "rice-mask",   handle: "overnight-rice-mask", title: "Overnight Rice Mask",    category: "Mask",        price: 38, tag: null, tone: "cream",
      description: "A sleeping mask of rice extract and squalane for cushioned, plumped morning skin." },
    { id: "spf-fluid",   handle: "airlight-sun-fluid",  title: "Airlight Sun Fluid SPF50+", category: "Sun",      price: 32, tag: "New", tone: "sage",
      description: "An invisible, no-white-cast daily defence with hydrating mugwort and broad-spectrum filters." },
    { id: "eye-conc",    handle: "peptide-eye-concentrate", title: "Peptide Eye Concentrate", category: "Serum", price: 44, tag: null, tone: "rose",
      description: "Peptides and green-tea caffeine smooth fine lines and de-puff the delicate eye area." },
  ].map(p => ({ ...p, currencyCode: CURRENCY, image: null, available: true, variantId: p.id }));

  const MOCK_CART_KEY = "viodelith_cart";

  const MockProvider = {
    async init() {},
    async getProducts() { return MOCK_PRODUCTS.map(p => ({ ...p })); },
    async getProduct(id) { const p = MOCK_PRODUCTS.find(x => x.id === id); return p ? { ...p } : null; },

    _read() { try { return JSON.parse(localStorage.getItem(MOCK_CART_KEY)) || {}; } catch { return {}; } },
    _write(c) { localStorage.setItem(MOCK_CART_KEY, JSON.stringify(c)); },

    async addToCart(id, qty = 1) { const c = this._read(); c[id] = (c[id] || 0) + qty; this._write(c); return this.getCart(); },
    async setLineQty(key, qty) {
      const c = this._read();
      if (qty <= 0) delete c[key]; else c[key] = qty;
      this._write(c); return this.getCart();
    },
    async removeLine(key) { const c = this._read(); delete c[key]; this._write(c); return this.getCart(); },

    async getCart() {
      const c = this._read();
      const lines = Object.entries(c).map(([id, qty]) => {
        const p = MOCK_PRODUCTS.find(x => x.id === id);
        if (!p) return null;
        return { key: id, id, title: p.title, price: p.price, qty, lineTotal: p.price * qty,
                 image: p.image, tone: p.tone, variantId: p.variantId };
      }).filter(Boolean);
      const count = lines.reduce((n, l) => n + l.qty, 0);
      const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
      return { lines, count, subtotal, currencyCode: CURRENCY, checkoutUrl: null };
    },

    async checkout() {
      // No real payment provider in demo mode.
      return { mode: "demo", message: "This is a demo store — connect Shopify to accept real orders." };
    },
  };

  /* ---------------------------------------------------------
     SHOPIFY PROVIDER — Storefront API (dormant until config'd)
     --------------------------------------------------------- */
  const CART_ID_KEY = "viodelith_shopify_cart_id";

  const ShopifyProvider = {
    _endpoint() {
      const s = CFG.shopify;
      return `https://${s.domain}/api/${s.apiVersion}/graphql.json`;
    },

    async _gql(query, variables = {}) {
      const res = await fetch(this._endpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": CFG.shopify.storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
      if (json.errors) throw new Error(json.errors.map(e => e.message).join("; "));
      return json.data;
    },

    _normalizeProduct(node) {
      const v = node.variants.edges[0] && node.variants.edges[0].node;
      const money = (v && v.price) || node.priceRange.minVariantPrice;
      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        category: node.productType || "Skincare",
        price: parseFloat(money.amount),
        currencyCode: money.currencyCode,
        tag: (node.tags && node.tags[0]) || null,
        tone: "cream", // fallback art tone if a product has no image
        image: node.featuredImage ? node.featuredImage.url : null,
        description: node.description || "",
        available: node.availableForSale,
        variantId: v ? v.id : null,
      };
    },

    async init() {},

    async getProducts() {
      const data = await this._gql(`
        query Products($n: Int!) {
          products(first: $n) {
            edges { node {
              id handle title description availableForSale tags productType
              featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } }
              variants(first: 1) { edges { node { id availableForSale price { amount currencyCode } } } }
            } }
          }
        }`, { n: CFG.shopify.productsToLoad || 60 });
      return data.products.edges.map(e => this._normalizeProduct(e.node));
    },

    async getProduct(handleOrId) {
      const data = await this._gql(`
        query Product($handle: String!) {
          product(handle: $handle) {
            id handle title description availableForSale tags productType
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) { edges { node { id availableForSale price { amount currencyCode } } } }
          }
        }`, { handle: handleOrId });
      return data.product ? this._normalizeProduct(data.product) : null;
    },

    _cartId() { return localStorage.getItem(CART_ID_KEY); },
    _setCartId(id) { if (id) localStorage.setItem(CART_ID_KEY, id); else localStorage.removeItem(CART_ID_KEY); },

    _cartFragment() {
      return `
        id checkoutUrl totalQuantity
        cost { subtotalAmount { amount currencyCode } }
        lines(first: 100) { edges { node {
          id quantity
          merchandise { ... on ProductVariant {
            id image { url } price { amount currencyCode }
            product { title featuredImage { url } }
          } }
        } } }`;
    },

    _normalizeCart(cart) {
      if (!cart) return { lines: [], count: 0, subtotal: 0, currencyCode: CURRENCY, checkoutUrl: null };
      const lines = cart.lines.edges.map(({ node }) => {
        const m = node.merchandise;
        const price = parseFloat(m.price.amount);
        return {
          key: node.id,                       // Shopify cart line id (for update/remove)
          id: m.id,                           // variant id
          title: m.product.title,
          price,
          qty: node.quantity,
          lineTotal: price * node.quantity,
          image: (m.image && m.image.url) || (m.product.featuredImage && m.product.featuredImage.url) || null,
          tone: "cream",
          variantId: m.id,
        };
      });
      return {
        lines,
        count: cart.totalQuantity,
        subtotal: parseFloat(cart.cost.subtotalAmount.amount),
        currencyCode: cart.cost.subtotalAmount.currencyCode,
        checkoutUrl: cart.checkoutUrl,
      };
    },

    async _ensureCart() {
      const id = this._cartId();
      if (id) {
        const data = await this._gql(`query($id: ID!){ cart(id:$id){ ${this._cartFragment()} } }`, { id });
        if (data.cart) return data.cart;
        this._setCartId(null); // stale/expired cart — start fresh
      }
      const data = await this._gql(`mutation{ cartCreate{ cart{ ${this._cartFragment()} } } }`);
      const cart = data.cartCreate.cart;
      this._setCartId(cart.id);
      return cart;
    },

    async addToCart(variantId, qty = 1) {
      const cart = await this._ensureCart();
      const data = await this._gql(`
        mutation($id: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $id, lines: $lines) { cart { ${this._cartFragment()} } userErrors { message } }
        }`, { id: cart.id, lines: [{ merchandiseId: variantId, quantity: qty }] });
      return this._normalizeCart(data.cartLinesAdd.cart);
    },

    async setLineQty(lineId, qty) {
      const id = this._cartId();
      if (!id) return this.getCart();
      if (qty <= 0) return this.removeLine(lineId);
      const data = await this._gql(`
        mutation($id: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $id, lines: $lines) { cart { ${this._cartFragment()} } userErrors { message } }
        }`, { id, lines: [{ id: lineId, quantity: qty }] });
      return this._normalizeCart(data.cartLinesUpdate.cart);
    },

    async removeLine(lineId) {
      const id = this._cartId();
      if (!id) return this.getCart();
      const data = await this._gql(`
        mutation($id: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $id, lineIds: $lineIds) { cart { ${this._cartFragment()} } userErrors { message } }
        }`, { id, lineIds: [lineId] });
      return this._normalizeCart(data.cartLinesRemove.cart);
    },

    async getCart() {
      const id = this._cartId();
      if (!id) return { lines: [], count: 0, subtotal: 0, currencyCode: CURRENCY, checkoutUrl: null };
      const data = await this._gql(`query($id: ID!){ cart(id:$id){ ${this._cartFragment()} } }`, { id });
      if (!data.cart) { this._setCartId(null); return this.getCart(); }
      return this._normalizeCart(data.cart);
    },

    async checkout() {
      const cart = await this.getCart();
      if (cart.checkoutUrl) { window.location.href = cart.checkoutUrl; return { mode: "shopify" }; }
      return { mode: "empty", message: "Your bag is empty." };
    },
  };

  /* ---------------------------------------------------------
     Facade — pick a provider from config and expose it.
     --------------------------------------------------------- */
  const active = CFG.provider === "shopify" ? ShopifyProvider : MockProvider;

  window.Commerce = {
    provider: CFG.provider,
    currency: CFG.currency || { default: "USD", symbols: { USD: "$" } },
    format(amount, code) {
      const cur = code || CURRENCY;
      const sym = (this.currency.symbols && this.currency.symbols[cur]) || "$";
      return sym + Number(amount).toFixed(2);
    },
    init:       ()          => active.init(),
    getProducts:()          => active.getProducts(),
    getProduct: (id)        => active.getProduct(id),
    addToCart:  (id, q)     => active.addToCart(id, q),
    setLineQty: (key, q)    => active.setLineQty(key, q),
    removeLine: (key)       => active.removeLine(key),
    getCart:    ()          => active.getCart(),
    checkout:   ()          => active.checkout(),
  };
})();
