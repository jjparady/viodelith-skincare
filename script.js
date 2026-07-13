/* =========================================================
   Viodelith Skincare — UI
   Talks to the store through window.Commerce (commerce.js) and
   localizes through window.L10n (i18n.js), so it works on the
   demo catalogue or a live Shopify backend, in English or Spanish,
   priced in USD or HNL.
   ========================================================= */

/* ---- Inline SVG art (used when a product has no image) ---- */
function bottleSVG(tone) {
  const fills = {
    amber: ["#E9D8B8", "#D8BE8E"], cream: ["#F0EAE0", "#E4D9C7"],
    rose:  ["#EBD9D2", "#DEC3B8"], sage:  ["#DCE0D3", "#C6CDB6"],
  };
  const [c1, c2] = fills[tone] || fills.cream;
  return `
  <svg class="bottle" viewBox="0 0 120 180" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g-${tone}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect x="46" y="6" width="28" height="20" rx="3" fill="#2A2823" opacity=".85"/>
    <rect x="42" y="24" width="36" height="10" rx="2" fill="#6E6555"/>
    <rect x="30" y="34" width="60" height="132" rx="12" fill="url(#g-${tone})" stroke="#2A2823" stroke-opacity=".12"/>
    <rect x="38" y="70" width="44" height="58" rx="4" fill="#FCFBF8" opacity=".72"/>
    <rect x="46" y="82" width="28" height="2.4" rx="1" fill="#6E6555"/>
    <rect x="46" y="90" width="20" height="2" rx="1" fill="#8B8172" opacity=".7"/>
    <circle cx="60" cy="112" r="7" fill="none" stroke="#6E6555" stroke-width="1.2" opacity=".7"/>
  </svg>`;
}
function leafSVG() {
  return `
  <svg class="leaf" viewBox="0 0 120 120" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 6 C24 30 20 78 60 114 C100 78 96 30 60 6 Z" fill="none" stroke="#6E6555" stroke-width="1.2" opacity=".7"/>
    <path d="M60 14 L60 108" stroke="#6E6555" stroke-width="1" opacity=".5"/>
    <path d="M60 40 L38 30 M60 40 L82 30 M60 62 L34 54 M60 62 L86 54 M60 84 L40 78 M60 84 L80 78" stroke="#6E6555" stroke-width="1" opacity=".45"/>
  </svg>`;
}

/* ---- Localization helpers (fall back gracefully if L10n is absent) ---- */
const T   = (k) => (window.L10n ? window.L10n.t(k) : k);
const CAT = (c) => (window.L10n ? window.L10n.category(c) : c);
const TAG = (t) => (window.L10n ? window.L10n.tag(t) : t);
const MONEY = (a, from) => (window.L10n ? window.L10n.money(a, from) : "$" + Number(a).toFixed(2));
const LOC = (p) => (window.L10n ? window.L10n.localizeProduct(p) : p);

/* ---- Product cards ---- */
function productCard(p) {
  const lp = LOC(p);
  const price = MONEY(p.price, p.currencyCode);
  const soldOut = p.available === false;
  const img = p.image
    ? `<img class="card__img" src="${p.image}" alt="${lp.title}" loading="lazy" />`
    : bottleSVG(p.tone);
  return `
  <article class="card reveal" data-cat="${p.category}">
    <div class="card__media">
      ${p.tag ? `<span class="card__tag">${TAG(p.tag)}</span>` : ""}
      ${img}
    </div>
    <div class="card__body">
      <span class="card__cat">${CAT(p.category)}</span>
      <h3 class="card__name">${lp.title}</h3>
      <p class="card__desc">${lp.description}</p>
      <div class="card__foot">
        <span class="card__price">${price}</span>
        <button class="card__add" data-add="${p.variantId || p.id}" ${soldOut ? "disabled" : ""}>
          ${soldOut ? T("cart.soldout") : T("cart.addbtn")}
        </button>
      </div>
    </div>
  </article>`;
}

let ALL_PRODUCTS = [];
let CURRENT_FILTER = "All";

function renderList(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCard).join("");
  observeReveals(el);
}
function renderFeatured() { if (document.getElementById("featured-grid")) renderList("featured-grid", ALL_PRODUCTS.slice(0, 4)); }
function renderShop() {
  if (!document.getElementById("shop-grid")) return;
  const list = CURRENT_FILTER === "All" ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === CURRENT_FILTER);
  renderList("shop-grid", list);
}

async function loadProducts() {
  try {
    ALL_PRODUCTS = await window.Commerce.getProducts();
  } catch (err) {
    console.error("Could not load products:", err);
    ALL_PRODUCTS = [];
    toast(T("err.products"));
  }
  renderFeatured();
  if (document.getElementById("shop-grid")) { renderShop(); initFilters(); }
}

/* ---- Filters (shop) ---- */
function initFilters() {
  const bar = document.getElementById("filters");
  if (!bar) return;
  const cats = ["All", ...new Set(ALL_PRODUCTS.map(p => p.category))];
  bar.innerHTML = cats.map(c =>
    `<button class="${c === CURRENT_FILTER ? "is-active" : ""}" data-filter="${c}">${c === "All" ? T("filter.all") : CAT(c)}</button>`
  ).join("");
}
function bindFilters() {
  const bar = document.getElementById("filters");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    CURRENT_FILTER = btn.dataset.filter;
    bar.querySelectorAll("button").forEach(b => b.classList.toggle("is-active", b === btn));
    renderShop();
  });
}

/* ---- Ingredient ticker ---- */
function buildTicker() {
  const track = document.querySelector("[data-ticker]");
  if (!track) return;
  const items = (window.L10n ? window.L10n.ingredients() : ["Snail Mucin", "Centella Asiatica", "Fermented Rice", "Propolis", "Ginseng", "Ceramides"]);
  const html = items.map(i => `<span>${i}</span>`).join("");
  track.innerHTML = html + html; // duplicate for seamless loop
}

/* ---- Cart drawer ---- */
function ensureCartDrawer() {
  if (document.querySelector(".cart-drawer")) return;
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="cart-scrim" data-cart-close></div>
    <aside class="cart-drawer" aria-label="Shopping bag" aria-hidden="true">
      <header class="cart-drawer__head">
        <span class="eyebrow" data-i18n="cart.title">Your Bag</span>
        <button class="cart-drawer__close" data-i18n-aria="cart.close" aria-label="Close bag" data-cart-close>&times;</button>
      </header>
      <div class="cart-drawer__body" id="cart-lines"></div>
      <footer class="cart-drawer__foot" id="cart-foot" hidden>
        <div class="cart-drawer__subtotal"><span data-i18n="cart.subtotal">Subtotal</span><span id="cart-subtotal"></span></div>
        <p class="cart-drawer__note"><span data-i18n="cart.note">Taxes &amp; shipping calculated at checkout.</span><span id="cart-indicative"></span></p>
        <button class="btn cart-drawer__checkout" data-checkout data-i18n="cart.checkout">Checkout</button>
      </footer>
    </aside>`;
  document.body.appendChild(el);
}

async function renderCart() {
  const cart = await window.Commerce.getCart();
  updateCartCount(cart.count);
  const linesEl = document.getElementById("cart-lines");
  const footEl = document.getElementById("cart-foot");
  if (!linesEl) return;

  if (!cart.lines.length) {
    linesEl.innerHTML = `<p class="cart-drawer__empty">${T("cart.empty")}<br /><a data-cart-close href="shop.html">${T("cart.browse")}</a></p>`;
    if (footEl) footEl.hidden = true;
    return;
  }
  linesEl.innerHTML = cart.lines.map(l => {
    const prod = ALL_PRODUCTS.find(p => p.id === l.id || p.variantId === l.variantId);
    const title = prod ? LOC(prod).title : l.title;
    const media = l.image ? `<img src="${l.image}" alt="${title}" />` : bottleSVG(l.tone || (prod && prod.tone));
    return `
    <div class="cart-line" data-key="${l.key}">
      <div class="cart-line__media">${media}</div>
      <div class="cart-line__info">
        <span class="cart-line__title">${title}</span>
        <span class="cart-line__price">${MONEY(l.price, cart.currencyCode)}</span>
        <div class="cart-line__qty">
          <button data-qty-dec="${l.key}" aria-label="-">&minus;</button>
          <span>${l.qty}</span>
          <button data-qty-inc="${l.key}" aria-label="+">+</button>
          <button class="cart-line__remove" data-remove="${l.key}">${T("cart.remove")}</button>
        </div>
      </div>
      <span class="cart-line__total">${MONEY(l.lineTotal, cart.currencyCode)}</span>
    </div>`;
  }).join("");
  if (footEl) {
    footEl.hidden = false;
    document.getElementById("cart-subtotal").textContent = MONEY(cart.subtotal, cart.currencyCode);
    const ind = document.getElementById("cart-indicative");
    if (ind) ind.textContent = (window.L10n && window.L10n.currency === "HNL") ? " " + T("cart.indicative") : "";
  }
}

function openCart() {
  ensureCartDrawer();
  document.querySelector(".cart-drawer").classList.add("is-open");
  document.querySelector(".cart-scrim").classList.add("is-open");
  document.querySelector(".cart-drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderCart();
}
function closeCart() {
  const d = document.querySelector(".cart-drawer");
  if (!d) return;
  d.classList.remove("is-open");
  document.querySelector(".cart-scrim").classList.remove("is-open");
  d.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateCartCount(n) {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}
async function refreshCartCount() {
  try { const c = await window.Commerce.getCart(); updateCartCount(c.count); } catch { /* ignore */ }
}

/* ---- Toast ---- */
let toastTimer;
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("is-show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 2600);
}

/* ---- Scroll reveal ---- */
let revealObserver;
function observeReveals(scope) {
  scope = scope || document;
  if (!("IntersectionObserver" in window)) { scope.querySelectorAll(".reveal").forEach(el => el.classList.add("is-in")); return; }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
  }
  scope.querySelectorAll(".reveal:not(.is-in)").forEach(el => revealObserver.observe(el));
}

/* ---- Event delegation ---- */
function initEvents() {
  document.addEventListener("click", async (e) => {
    const add = e.target.closest("[data-add]");
    if (add && !add.disabled) {
      add.disabled = true;
      try { await window.Commerce.addToCart(add.dataset.add, 1); toast(T("cart.added")); openCart(); }
      catch (err) { console.error(err); toast(T("err.add")); }
      finally { add.disabled = false; }
      return;
    }
    if (e.target.closest("[data-cart-open]")) { e.preventDefault(); openCart(); return; }
    if (e.target.closest("[data-cart-close]")) { e.preventDefault(); closeCart(); return; }

    const inc = e.target.closest("[data-qty-inc]");
    const dec = e.target.closest("[data-qty-dec]");
    const rem = e.target.closest("[data-remove]");
    if (inc || dec || rem) {
      const line = e.target.closest(".cart-line");
      const node = inc || dec || rem;
      const key = node.dataset.qtyInc || node.dataset.qtyDec || node.dataset.remove;
      const cur = line ? parseInt(line.querySelector(".cart-line__qty span").textContent, 10) : 1;
      try {
        if (rem) await window.Commerce.removeLine(key);
        else await window.Commerce.setLineQty(key, inc ? cur + 1 : cur - 1);
        renderCart();
      } catch (err) { console.error(err); toast(T("err.update")); }
      return;
    }

    const co = e.target.closest("[data-checkout]");
    if (co) {
      const res = await window.Commerce.checkout();
      if (res && (res.mode === "demo" || res.mode === "empty")) toast(res.mode === "demo" ? T("cart.demo") : T("cart.empty"));
      return;
    }
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("is-open")));
}

/* ---- Newsletter (demo) ---- */
function initNewsletter() {
  document.querySelectorAll(".newsletter__form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (input && input.value) { toast(T("news.success")); input.value = ""; }
    });
  });
}

/* ---- Decorative art ---- */
function injectArt() {
  document.querySelectorAll("[data-bottle]").forEach(el => { el.innerHTML = bottleSVG(el.dataset.bottle); });
  document.querySelectorAll("[data-leaf]").forEach(el => { el.innerHTML = leafSVG(); });
}

/* ---- Re-render everything language/currency-sensitive ---- */
function rerenderStore(detail) {
  buildTicker();
  renderFeatured();
  if (document.getElementById("shop-grid")) { initFilters(); renderShop(); }
  if (document.querySelector(".cart-drawer.is-open")) renderCart();
  if (window.L10n) window.L10n.apply(); // re-translate any freshly injected static nodes
  if (detail && detail.changed === "currency" && window.L10n && window.L10n.currency === "HNL") {
    toast(T("cart.indicative"));
  }
}

/* ---- Boot ---- */
document.addEventListener("DOMContentLoaded", async () => {
  injectArt();
  buildTicker();
  ensureCartDrawer();
  initEvents();
  bindFilters();
  initMobileMenu();
  initNewsletter();
  if (window.L10n) { window.L10n.apply(); window.L10n.onChange(rerenderStore); }

  if (window.Commerce) {
    try { await window.Commerce.init(); } catch (e) { console.error(e); }
    refreshCartCount();
    loadProducts();
  }

  observeReveals(document);
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
