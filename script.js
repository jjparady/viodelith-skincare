/* =========================================================
   Viodelith Skincare — UI
   Talks to the store only through window.Commerce (see
   commerce.js), so it works identically on the demo catalogue
   or a live Shopify backend.
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
function mediaFor(p, cls) {
  return p.image
    ? `<img class="${cls || ""}" src="${p.image}" alt="${p.title}" loading="lazy" />`
    : bottleSVG(p.tone);
}

/* ---- Product cards ---- */
function productCard(p) {
  const price = window.Commerce.format(p.price, p.currencyCode);
  const soldOut = p.available === false;
  return `
  <article class="card reveal" data-cat="${p.category}">
    <div class="card__media">
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
      ${mediaFor(p, "card__img")}
    </div>
    <div class="card__body">
      <span class="card__cat">${p.category}</span>
      <h3 class="card__name">${p.title}</h3>
      <p class="card__desc">${p.description}</p>
      <div class="card__foot">
        <span class="card__price">${price}</span>
        <button class="card__add" data-add="${p.variantId || p.id}" ${soldOut ? "disabled" : ""}>
          ${soldOut ? "Sold out" : "Add &mdash; Bag"}
        </button>
      </div>
    </div>
  </article>`;
}

let ALL_PRODUCTS = [];

function renderList(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCard).join("");
  observeReveals(el);
}

async function loadProducts() {
  try {
    ALL_PRODUCTS = await window.Commerce.getProducts();
  } catch (err) {
    console.error("Could not load products:", err);
    ALL_PRODUCTS = [];
    toast("Couldn't load products — please refresh");
  }
  if (document.getElementById("featured-grid")) renderList("featured-grid", ALL_PRODUCTS.slice(0, 4));
  if (document.getElementById("shop-grid")) { renderList("shop-grid", ALL_PRODUCTS); initFilters(); }
}

/* ---- Filters (shop) ---- */
function initFilters() {
  const bar = document.getElementById("filters");
  if (!bar) return;
  const cats = ["All", ...new Set(ALL_PRODUCTS.map(p => p.category))];
  bar.innerHTML = cats.map((c, i) => `<button class="${i === 0 ? "is-active" : ""}" data-filter="${c}">${c}</button>`).join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    bar.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    renderList("shop-grid", f === "All" ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === f));
  });
}

/* ---- Cart drawer ---- */
function ensureCartDrawer() {
  if (document.querySelector(".cart-drawer")) return;
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="cart-scrim" data-cart-close></div>
    <aside class="cart-drawer" aria-label="Shopping bag" aria-hidden="true">
      <header class="cart-drawer__head">
        <span class="eyebrow">Your Bag</span>
        <button class="cart-drawer__close" aria-label="Close bag" data-cart-close>&times;</button>
      </header>
      <div class="cart-drawer__body" id="cart-lines"></div>
      <footer class="cart-drawer__foot" id="cart-foot" hidden>
        <div class="cart-drawer__subtotal"><span>Subtotal</span><span id="cart-subtotal"></span></div>
        <p class="cart-drawer__note">Taxes &amp; shipping calculated at checkout.</p>
        <button class="btn cart-drawer__checkout" data-checkout>Checkout</button>
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
    linesEl.innerHTML = `<p class="cart-drawer__empty">Your bag is empty.<br /><a data-cart-close href="shop.html">Browse the edit</a></p>`;
    if (footEl) footEl.hidden = true;
    return;
  }
  linesEl.innerHTML = cart.lines.map(l => `
    <div class="cart-line" data-key="${l.key}">
      <div class="cart-line__media">${l.image ? `<img src="${l.image}" alt="${l.title}" />` : bottleSVG(l.tone)}</div>
      <div class="cart-line__info">
        <span class="cart-line__title">${l.title}</span>
        <span class="cart-line__price">${window.Commerce.format(l.price, cart.currencyCode)}</span>
        <div class="cart-line__qty">
          <button data-qty-dec="${l.key}" aria-label="Decrease quantity">&minus;</button>
          <span>${l.qty}</span>
          <button data-qty-inc="${l.key}" aria-label="Increase quantity">+</button>
          <button class="cart-line__remove" data-remove="${l.key}">Remove</button>
        </div>
      </div>
      <span class="cart-line__total">${window.Commerce.format(l.lineTotal, cart.currencyCode)}</span>
    </div>`).join("");
  if (footEl) {
    footEl.hidden = false;
    document.getElementById("cart-subtotal").textContent = window.Commerce.format(cart.subtotal, cart.currencyCode);
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
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 2400);
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
      try { await window.Commerce.addToCart(add.dataset.add, 1); toast("Added to bag"); openCart(); }
      catch (err) { console.error(err); toast("Couldn't add to bag"); }
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
      const key = (inc || dec || rem).dataset.qtyInc || (inc || dec || rem).dataset.qtyDec || (inc || dec || rem).dataset.remove;
      const cur = line ? parseInt(line.querySelector(".cart-line__qty span").textContent, 10) : 1;
      try {
        if (rem) await window.Commerce.removeLine(key);
        else await window.Commerce.setLineQty(key, inc ? cur + 1 : cur - 1);
        renderCart();
      } catch (err) { console.error(err); toast("Couldn't update bag"); }
      return;
    }

    const co = e.target.closest("[data-checkout]");
    if (co) {
      const res = await window.Commerce.checkout();
      if (res && res.mode === "demo") toast(res.message);
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
      if (input && input.value) { toast("Welcome to the ritual — check your inbox"); input.value = ""; }
    });
  });
}

/* ---- Decorative art ---- */
function injectArt() {
  document.querySelectorAll("[data-bottle]").forEach(el => { el.innerHTML = bottleSVG(el.dataset.bottle); });
  document.querySelectorAll("[data-leaf]").forEach(el => { el.innerHTML = leafSVG(); });
}

/* ---- Boot ---- */
document.addEventListener("DOMContentLoaded", async () => {
  injectArt();
  ensureCartDrawer();
  initEvents();
  initMobileMenu();
  initNewsletter();

  if (window.Commerce) {
    try { await window.Commerce.init(); } catch (e) { console.error(e); }
    refreshCartCount();
    loadProducts();
  }

  observeReveals(document);
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
