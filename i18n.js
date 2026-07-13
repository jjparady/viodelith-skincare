/* =========================================================
   Viodelith Skincare — Localization (language + currency)
   ---------------------------------------------------------
   window.L10n is the single source of truth for the visitor's
   language (en | es) and display currency (USD | HNL).

   - Static copy carries data-i18n / data-i18n-html / data-i18n-ph
     / data-i18n-aria attributes; L10n.apply() fills them in.
   - Dynamic content (product cards, cart) asks L10n.t(), .money(),
     .category(), .tag(), .localizeProduct() at render time and
     re-renders via L10n.onChange().

   Currency note: prices are stored in USD (the settlement currency
   for a US business). HNL is a *display* convenience converted at an
   indicative rate until Shopify Markets provides real localized
   pricing — the UI says so when HNL is selected.
   ========================================================= */

(function () {
  const CFG = window.VIODELITH_CONFIG || {};
  const CUR = CFG.currency || { default: "USD", rates: { USD: 1 }, symbols: { USD: "$" } };
  const STORE_LANG = "viodelith_lang";
  const STORE_CUR = "viodelith_currency";

  /* ---- String dictionary ---- */
  const DICT = {
    // Utility bar
    "util.ships": { en: "Ships to the U.S. & Honduras", es: "Envíos a EE. UU. y Honduras" },
    "util.language": { en: "Language", es: "Idioma" },
    "util.currency": { en: "Currency", es: "Moneda" },

    // Brand / nav
    "brand.tagline": { en: "Korean Skincare", es: "Cuidado Coreano" },
    "nav.shop": { en: "Shop", es: "Tienda" },
    "nav.ritual": { en: "Ritual", es: "Ritual" },
    "nav.story": { en: "Our Story", es: "Nuestra Historia" },
    "nav.journal": { en: "Journal", es: "Diario" },
    "nav.bag": { en: "Bag", es: "Bolsa" },

    // Hero
    "hero.eyebrow": { en: "Seoul · Considered Skincare", es: "Seúl · Cuidado Consciente" },
    "hero.title": { en: "Skin, kept<br /><em>quietly</em> luminous.", es: "Piel, <em>serenamente</em><br />luminosa." },
    "hero.lede": { en: "A curated house of Korean skincare built barrier-first — gentle actives, clean formulations, and rituals that let your skin do the glowing.", es: "Una casa curada de cuidado coreano, pensada primero en la barrera — activos suaves, fórmulas limpias y rituales que dejan brillar tu piel." },
    "hero.shop": { en: "Shop the Edit", es: "Ver la Colección" },
    "hero.discover": { en: "Discover the Ritual", es: "Descubre el Ritual" },
    "hero.scroll": { en: "Scroll", es: "Desliza" },

    // Featured
    "edit.eyebrow": { en: "The Edit", es: "La Colección" },
    "edit.title": { en: "Quietly effective<br />everyday essentials.", es: "Esenciales diarios,<br />discretamente eficaces." },
    "edit.viewall": { en: "View all products", es: "Ver todos los productos" },

    // Philosophy
    "phil.eyebrow": { en: "Our Philosophy", es: "Nuestra Filosofía" },
    "phil.title": { en: "Barrier-first, always.", es: "Primero la barrera, siempre." },
    "phil.p1": { en: "Great skin isn't forced — it's supported. Every Viodelith formula begins with the moisture barrier: the quiet layer that keeps skin calm, resilient, and glowing without irritation.", es: "La buena piel no se fuerza — se cuida. Cada fórmula de Viodelith comienza por la barrera de hidratación: esa capa silenciosa que mantiene la piel calmada, resistente y luminosa sin irritación." },
    "phil.p2": { en: "We pair time-honoured Korean botanicals with modern, gentle actives — no harsh strips, no noise. Just skin that feels like itself again.", es: "Combinamos botánicos coreanos de siempre con activos modernos y suaves — sin agresiones, sin ruido. Solo piel que vuelve a sentirse ella misma." },
    "phil.cta": { en: "Read our story", es: "Lee nuestra historia" },

    // Ritual
    "ritual.eyebrow": { en: "The Ritual", es: "El Ritual" },
    "ritual.title": { en: "Four steps to glass skin.", es: "Cuatro pasos hacia la piel de cristal." },
    "step1.title": { en: "Cleanse", es: "Limpia" },
    "step1.desc": { en: "A low-pH milk cleanser lifts the day without disturbing the barrier.", es: "Un limpiador de leche de pH bajo retira el día sin alterar la barrera." },
    "step2.title": { en: "Tone", es: "Tonifica" },
    "step2.desc": { en: "Fermented essence-toners prep skin to drink in everything that follows.", es: "Los tónicos-esencia fermentados preparan la piel para absorber todo lo que sigue." },
    "step3.title": { en: "Treat", es: "Trata" },
    "step3.desc": { en: "Targeted serums and essences bring hydration, clarity, and glow.", es: "Sueros y esencias específicos aportan hidratación, claridad y luminosidad." },
    "step4.title": { en: "Seal", es: "Sella" },
    "step4.desc": { en: "Cica creams and SPF lock it in and defend through the day.", es: "Las cremas cica y el SPF lo sellan y protegen durante el día." },

    // Values
    "values.eyebrow": { en: "Why Viodelith", es: "Por qué Viodelith" },
    "val1.title": { en: "Clean by design", es: "Limpio por diseño" },
    "val1.desc": { en: "Free from parabens, sulphates, and synthetic fragrance. Formulated for even the most reactive skin.", es: "Sin parabenos, sulfatos ni fragancia sintética. Formulado incluso para las pieles más reactivas." },
    "val2.title": { en: "Sourced in Korea", es: "Origen en Corea" },
    "val2.desc": { en: "Made with heritage botanicals and produced with the labs that pioneered modern K-beauty.", es: "Hecho con botánicos tradicionales y producido con los laboratorios que crearon la K-beauty moderna." },
    "val3.title": { en: "Cruelty-free", es: "Libre de crueldad" },
    "val3.desc": { en: "Never tested on animals. Recyclable glass and refill-ready design across the range.", es: "Nunca probado en animales. Vidrio reciclable y diseño rellenable en toda la gama." },

    // Journal
    "journal.eyebrow": { en: "The Journal", es: "El Diario" },
    "journal.title": { en: "Glass skin, decoded.", es: "La piel de cristal, descifrada." },
    "journal.p1": { en: "From the ten-step ritual to the science of the skin barrier, our journal translates K-beauty into a practice you'll actually keep.", es: "Del ritual de diez pasos a la ciencia de la barrera cutánea, nuestro diario traduce la K-beauty en una práctica que de verdad mantendrás." },
    "journal.p2": { en: "Learn how to layer, when to exfoliate, and why less is so often more.", es: "Aprende a superponer, cuándo exfoliar y por qué menos suele ser más." },
    "journal.cta": { en: "Read the Journal", es: "Leer el Diario" },

    // Newsletter
    "news.eyebrow": { en: "Join the House", es: "Únete a la Casa" },
    "news.title": { en: "Ten percent off your first ritual.", es: "Diez por ciento en tu primer ritual." },
    "news.p": { en: "Subscribe for early access to new arrivals, quiet restocks, and skincare notes from Seoul.", es: "Suscríbete para acceso anticipado a novedades, reabastecimientos y notas de cuidado desde Seúl." },
    "news.placeholder": { en: "Your email address", es: "Tu correo electrónico" },
    "news.subscribe": { en: "Subscribe", es: "Suscríbete" },
    "news.note": { en: "No noise. Unsubscribe anytime.", es: "Sin ruido. Cancela cuando quieras." },
    "news.success": { en: "Welcome to the ritual — check your inbox", es: "Bienvenida al ritual — revisa tu correo" },

    // Footer
    "footer.tagline": { en: "Considered Korean skincare for a calm, luminous complexion. Formulated gently, made to be kept.", es: "Cuidado coreano consciente para un cutis calmado y luminoso. Formulado con suavidad, hecho para conservar." },
    "footer.shop": { en: "Shop", es: "Tienda" },
    "footer.house": { en: "House", es: "La Casa" },
    "footer.care": { en: "Care", es: "Atención" },
    "footer.allproducts": { en: "All Products", es: "Todos los productos" },
    "footer.cleansers": { en: "Cleansers", es: "Limpiadores" },
    "footer.serums": { en: "Serums", es: "Sueros" },
    "footer.suncare": { en: "Sun Care", es: "Protección Solar" },
    "footer.ingredients": { en: "Ingredients", es: "Ingredientes" },
    "footer.contact": { en: "Contact", es: "Contacto" },
    "footer.shipping": { en: "Shipping", es: "Envíos" },
    "footer.returns": { en: "Returns", es: "Devoluciones" },
    "footer.faq": { en: "FAQ", es: "Preguntas Frecuentes" },
    "footer.rights": { en: "All rights reserved.", es: "Todos los derechos reservados." },
    "footer.locations": { en: "Ships to the U.S. & Honduras", es: "Envíos a EE. UU. y Honduras" },

    // Shop page
    "shop.eyebrow": { en: "The Full Edit", es: "La Colección Completa" },
    "shop.title": { en: "Shop the Ritual", es: "Compra el Ritual" },
    "shop.intro": { en: "Every formula is barrier-first, gently active, and made to be kept. Filter by step to build your routine.", es: "Cada fórmula prioriza la barrera, es suavemente activa y está hecha para conservar. Filtra por paso para armar tu rutina." },
    "shopcta.eyebrow": { en: "Not sure where to start?", es: "¿No sabes por dónde empezar?" },
    "shopcta.title": { en: "Build your ritual with us.", es: "Arma tu ritual con nosotras." },
    "shopcta.p": { en: "Tell us your skin type and we'll compose a routine — barrier-first, always.", es: "Cuéntanos tu tipo de piel y compondremos una rutina — primero la barrera, siempre." },
    "shopcta.button": { en: "Take the skin quiz", es: "Haz el test de piel" },

    // About page
    "about.eyebrow": { en: "Our Story", es: "Nuestra Historia" },
    "about.title": { en: "Skincare, quietly.", es: "Cuidado, en silencio." },
    "about.intro": { en: "Viodelith began with a simple conviction: that the best skin is not achieved through force, but through care.", es: "Viodelith nació de una convicción simple: que la mejor piel no se logra a la fuerza, sino con cuidado." },
    "about.p1": { en: "We started Viodelith after years of watching skincare grow louder — more steps, more actives, more promises. Meanwhile, the skin barrier, the quiet foundation of every healthy complexion, was being stripped in the name of results.", es: "Empezamos Viodelith tras años viendo el cuidado de la piel volverse más ruidoso — más pasos, más activos, más promesas. Mientras tanto, la barrera cutánea, base silenciosa de todo cutis sano, se debilitaba en nombre de los resultados." },
    "about.p2": { en: "So we went to Seoul, to the labs and formulators who had spent decades perfecting a gentler philosophy. Korean skincare has always understood something the rest of the world is only now learning: that hydration, patience, and restraint outperform aggression every time.", es: "Así que fuimos a Seúl, a los laboratorios y formuladores que llevaban décadas perfeccionando una filosofía más suave. El cuidado coreano siempre supo algo que el resto del mundo apenas descubre: que la hidratación, la paciencia y la mesura superan a la agresión, siempre." },
    "about.h2": { en: "Barrier-first, always.", es: "Primero la barrera, siempre." },
    "about.p3": { en: "Every Viodelith formula is built around the moisture barrier. We choose heritage botanicals — centella, ginseng, fermented rice, propolis — and pair them with modern, well-tolerated actives. Nothing harsh. Nothing performative. Just formulas that respect the skin you're in.", es: "Cada fórmula de Viodelith gira en torno a la barrera de hidratación. Elegimos botánicos tradicionales — centella, ginseng, arroz fermentado, propóleo — y los unimos con activos modernos y bien tolerados. Nada agresivo. Nada de apariencias. Solo fórmulas que respetan la piel que tienes." },
    "about.p4": { en: "We keep our range small on purpose. Each product earns its place, works beautifully alongside the others, and is made to be kept — in recyclable glass, refill-ready, and free from the noise.", es: "Mantenemos una gama pequeña a propósito. Cada producto se gana su lugar, funciona en armonía con los demás y está hecho para conservar — en vidrio reciclable, listo para rellenar y libre de ruido." },
    "stat1.label": { en: "Considered formulas", es: "Fórmulas cuidadas" },
    "stat2.label": { en: "Synthetic fragrance", es: "Fragancia sintética" },
    "stat3.label": { en: "Cruelty-free", es: "Libre de crueldad" },
    "promise.eyebrow": { en: "The Promise", es: "La Promesa" },
    "promise.title": { en: "Made to be kept.", es: "Hecho para conservar." },
    "promise.p1": { en: "We design for the long term — glass over plastic, refills over waste, and formulas gentle enough to become a ritual rather than a phase.", es: "Diseñamos para el largo plazo — vidrio antes que plástico, recargas antes que desperdicio, y fórmulas tan suaves que se vuelven un ritual, no una etapa." },
    "promise.p2": { en: "Viodelith is skincare you return to, not skincare you cycle through.", es: "Viodelith es un cuidado al que regresas, no uno que descartas." },
    "promise.cta": { en: "Shop the Edit", es: "Ver la Colección" },

    // Cart
    "cart.title": { en: "Your Bag", es: "Tu Bolsa" },
    "cart.empty": { en: "Your bag is empty.", es: "Tu bolsa está vacía." },
    "cart.browse": { en: "Browse the edit", es: "Explora la colección" },
    "cart.remove": { en: "Remove", es: "Quitar" },
    "cart.subtotal": { en: "Subtotal", es: "Subtotal" },
    "cart.note": { en: "Taxes & shipping calculated at checkout.", es: "Impuestos y envío calculados al pagar." },
    "cart.indicative": { en: "Prices shown in HNL are indicative — you'll be charged in USD.", es: "Los precios en HNL son indicativos — el cobro se realiza en USD." },
    "cart.checkout": { en: "Checkout", es: "Pagar" },
    "cart.added": { en: "Added to bag", es: "Agregado a la bolsa" },
    "cart.addbtn": { en: "Add — Bag", es: "Agregar" },
    "cart.soldout": { en: "Sold out", es: "Agotado" },
    "cart.demo": { en: "This is a demo store — connect Shopify to accept real orders.", es: "Tienda de demostración — conecta Shopify para aceptar pedidos reales." },
    "cart.close": { en: "Close bag", es: "Cerrar bolsa" },

    // Misc
    "err.products": { en: "Couldn't load products — please refresh", es: "No se pudieron cargar los productos — actualiza la página" },
    "err.add": { en: "Couldn't add to bag", es: "No se pudo agregar a la bolsa" },
    "err.update": { en: "Couldn't update bag", es: "No se pudo actualizar la bolsa" },
    "menu": { en: "Menu", es: "Menú" },
    "filter.all": { en: "All", es: "Todos" },
  };

  const CATS = {
    Essence: { en: "Essence", es: "Esencia" },
    Cleanser: { en: "Cleanser", es: "Limpiador" },
    Toner: { en: "Toner", es: "Tónico" },
    Moisturiser: { en: "Moisturiser", es: "Hidratante" },
    Serum: { en: "Serum", es: "Suero" },
    Mask: { en: "Mask", es: "Mascarilla" },
    Sun: { en: "Sun", es: "Protección Solar" },
  };
  const TAGS = {
    Bestseller: { en: "Bestseller", es: "Más vendido" },
    New: { en: "New", es: "Nuevo" },
  };
  const INGREDIENTS = [
    { en: "Snail Mucin", es: "Baba de Caracol" },
    { en: "Centella Asiatica", es: "Centella Asiática" },
    { en: "Fermented Rice", es: "Arroz Fermentado" },
    { en: "Propolis", es: "Propóleo" },
    { en: "Ginseng", es: "Ginseng" },
    { en: "Ceramides", es: "Ceramidas" },
  ];

  const listeners = [];

  const L10n = {
    lang: "en",
    currency: (CUR.default) || "USD",

    init() {
      this.lang = localStorage.getItem(STORE_LANG) || "en";
      this.currency = localStorage.getItem(STORE_CUR) || this.currency;
      document.documentElement.lang = this.lang;
    },

    t(key) {
      const e = DICT[key];
      return e ? (e[this.lang] || e.en) : key;
    },
    category(cat) { const e = CATS[cat]; return e ? (e[this.lang] || e.en) : cat; },
    tag(tag) { const e = TAGS[tag]; return e ? (e[this.lang] || e.en) : tag; },
    ingredients() { return INGREDIENTS.map(i => i[this.lang] || i.en); },

    localizeProduct(p) {
      if (this.lang === "es" && p.i18n && p.i18n.es) {
        return { ...p, title: p.i18n.es.title || p.title, description: p.i18n.es.description || p.description };
      }
      return p;
    },

    money(amount, from) {
      from = from || "USD";
      const to = this.currency;
      const rates = CUR.rates || { USD: 1 };
      let val = Number(amount) || 0;
      if (from !== to) val = (val / (rates[from] || 1)) * (rates[to] || 1);
      const locale = this.lang === "es" ? "es-HN" : "en-US";
      const frac = to === "HNL" ? 0 : 2;
      try {
        return new Intl.NumberFormat(locale, {
          style: "currency", currency: to, currencyDisplay: "narrowSymbol",
          minimumFractionDigits: frac, maximumFractionDigits: frac,
        }).format(val);
      } catch (e) {
        const sym = (CUR.symbols && CUR.symbols[to]) || "$";
        return sym + val.toFixed(frac);
      }
    },

    setLang(l) {
      if (l === this.lang) return;
      this.lang = l;
      localStorage.setItem(STORE_LANG, l);
      document.documentElement.lang = l;
      this.apply();
      this._notify("lang");
    },
    setCurrency(c) {
      if (c === this.currency) return;
      this.currency = c;
      localStorage.setItem(STORE_CUR, c);
      this.apply();
      this._notify("currency");
    },

    apply() {
      document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = this.t(el.getAttribute("data-i18n")); });
      document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = this.t(el.getAttribute("data-i18n-html")); });
      document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", this.t(el.getAttribute("data-i18n-ph"))); });
      document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", this.t(el.getAttribute("data-i18n-aria"))); });
      // reflect active state on the toggles
      document.querySelectorAll("[data-set-lang]").forEach(b => b.classList.toggle("is-active", b.dataset.setLang === this.lang));
      document.querySelectorAll("[data-set-currency]").forEach(b => b.classList.toggle("is-active", b.dataset.setCurrency === this.currency));
    },

    onChange(cb) { if (typeof cb === "function") listeners.push(cb); },
    _notify(changed) { listeners.forEach(cb => { try { cb({ lang: this.lang, currency: this.currency, changed }); } catch (e) { console.error(e); } }); },

    wireToggles() {
      document.addEventListener("click", (e) => {
        const l = e.target.closest("[data-set-lang]");
        if (l) { e.preventDefault(); this.setLang(l.dataset.setLang); return; }
        const c = e.target.closest("[data-set-currency]");
        if (c) { e.preventDefault(); this.setCurrency(c.dataset.setCurrency); return; }
      });
    },
  };

  window.L10n = L10n;

  document.addEventListener("DOMContentLoaded", () => {
    L10n.init();
    L10n.wireToggles();
    L10n.apply();
  });
})();
