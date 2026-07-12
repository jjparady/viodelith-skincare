/* =========================================================
   Viodelith Skincare — Interactions
   Vanilla JS. No dependencies. Progressive enhancement.
   ========================================================= */

/* ---- Shared product catalogue (single source of truth) ---- */
const PRODUCTS = [
  { id: "hy-essence",  name: "Dew Veil Essence",      cat: "Essence",     price: 42, tag: "Bestseller", tone: "amber",
    desc: "A weightless hydrating essence with snail mucin and hyaluronic acid for glass-skin luminosity." },
  { id: "rice-cleanse", name: "Rice Milk Cleanser",   cat: "Cleanser",    price: 28, tag: null, tone: "cream",
    desc: "A low-pH gel-to-milk cleanser that softens without stripping the moisture barrier." },
  { id: "gin-toner",   name: "Ginseng Softening Toner", cat: "Toner",     price: 34, tag: "New", tone: "rose",
    desc: "Fermented ginseng and rice water tone, prep, and firm in one restorative step." },
  { id: "cica-cream",  name: "Cica Barrier Cream",     cat: "Moisturiser", price: 46, tag: null, tone: "sage",
    desc: "Centella asiatica and ceramides calm redness and rebuild a resilient barrier overnight." },
  { id: "prop-serum",  name: "Propolis Glow Serum",    cat: "Serum",      price: 52, tag: "Bestseller", tone: "amber",
    desc: "Black-bee propolis and niacinamide deliver a clarified, lit-from-within finish." },
  { id: "rice-mask",   name: "Overnight Rice Mask",    cat: "Mask",       price: 38, tag: null, tone: "cream",
    desc: "A sleeping mask of rice extract and squalane for cushioned, plumped morning skin." },
  { id: "spf-fluid",   name: "Airlight Sun Fluid SPF50+", cat: "Sun",     price: 32, tag: "New", tone: "sage",
    desc: "An invisible, no-white-cast daily defence with hydrating mugwort and broad-spectrum filters." },
  { id: "eye-conc",    name: "Peptide Eye Concentrate", cat: "Serum",     price: 44, tag: null, tone: "rose",
    desc: "Peptides and green-tea caffeine smooth fine lines and de-puff the delicate eye area." },
];

/* Bottle illustration — inline SVG keyed by tone (no external assets) */
function bottleSVG(tone) {
  const fills = {
    amber: ["#E9D8B8", "#D8BE8E"],
    cream: ["#F0EAE0", "#E4D9C7"],
    rose:  ["#EBD9D2", "#DEC3B8"],
    sage:  ["#DCE0D3", "#C6CDB6"],
  };
  const [c1, c2] = fills[tone] || fills.cream;
  return `
  <svg class="bottle" viewBox="0 0 120 180" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-${tone}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
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
    <path d="M60 40 L38 30 M60 40 L82 30 M60 62 L34 54 M60 62 L86 54 M60 84 L40 78 M60 84 L80 78"
          stroke="#6E6555" stroke-width="1" opacity=".45"/>
  </svg>`;
}

/* ---- Render product cards into a container ---- */
function productCard(p) {
  return `
  <article class="card reveal" data-cat="${p.cat}">
    <div class="card__media">
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
      ${bottleSVG(p.tone)}
    </div>
    <div class="card__body">
      <span class="card__cat">${p.cat}</span>
      <h3 class="card__name">${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
      <div class="card__foot">
        <span class="card__price">$${p.price}</span>
        <button class="card__add" data-add="${p.id}">Add — Bag</button>
      </div>
    </div>
  </article>`;
}

function renderProducts(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(productCard).join("");
  observeReveals(el);
}

/* ---- Cart (localStorage) ---- */
const CART_KEY = "viodelith_cart";
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
function addToCart(id) {
  const c = getCart();
  c[id] = (c[id] || 0) + 1;
  saveCart(c);
  const p = PRODUCTS.find(x => x.id === id);
  toast(`${p ? p.name : "Item"} added to bag`);
}
function cartTotalItems() { return Object.values(getCart()).reduce((a, b) => a + b, 0); }
function updateCartCount() {
  const n = cartTotalItems();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
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
function observeReveals(scope = document) {
  if (!("IntersectionObserver" in window)) {
    scope.querySelectorAll(".reveal").forEach(el => el.classList.add("is-in"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
  }
  scope.querySelectorAll(".reveal:not(.is-in)").forEach(el => revealObserver.observe(el));
}

/* ---- Shop filtering ---- */
function initFilters() {
  const bar = document.getElementById("filters");
  if (!bar) return;
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat))];
  bar.innerHTML = cats.map((c, i) =>
    `<button class="${i === 0 ? "is-active" : ""}" data-filter="${c}">${c}</button>`).join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    bar.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    renderProducts("shop-grid", f === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === f));
  });
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => menu.classList.toggle("is-open"));
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

/* ---- Global click delegation for add-to-bag ---- */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
});

/* ---- Hero art + splash decorations inject ---- */
function injectArt() {
  document.querySelectorAll("[data-bottle]").forEach(el => { el.innerHTML = bottleSVG(el.dataset.bottle); });
  document.querySelectorAll("[data-leaf]").forEach(el => { el.innerHTML = leafSVG(); });
}

/* ---- Boot ---- */
document.addEventListener("DOMContentLoaded", () => {
  injectArt();
  updateCartCount();
  initMobileMenu();
  initNewsletter();

  // Home: featured (first 4)
  if (document.getElementById("featured-grid")) renderProducts("featured-grid", PRODUCTS.slice(0, 4));
  // Shop: all + filters
  if (document.getElementById("shop-grid")) { renderProducts("shop-grid", PRODUCTS); initFilters(); }

  observeReveals(document);
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
