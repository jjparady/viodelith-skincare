/* =========================================================
   Viodelith Skincare — Journal
   ---------------------------------------------------------
   Static, data-driven blog. Articles live here as bilingual
   data; journal.html renders the list and article.html renders
   a single post from ?slug=. Everything localizes through
   window.L10n and re-renders on language change.
   ========================================================= */

(function () {
  const ARTICLES = [
    {
      slug: "glass-skin-decoded",
      date: "2026-06-02",
      readMins: 5,
      tone: "amber",
      title: { en: "Glass skin, decoded", es: "La piel de cristal, descifrada" },
      excerpt: {
        en: "It isn't a filter — it's the look of a barrier that's genuinely, deeply hydrated. Here's how to build it.",
        es: "No es un filtro — es el aspecto de una barrera realmente hidratada en profundidad. Así se construye.",
      },
      body: [
        { t: "p", en: "\"Glass skin\" gets talked about like a finish you apply. It isn't. It's what skin looks like when the moisture barrier is intact and deeply hydrated — light bounces off an even, well-cushioned surface instead of scattering across dry, flaky patches.", es: "Se habla de la \"piel de cristal\" como si fuera un acabado que se aplica. No lo es. Es cómo se ve la piel cuando la barrera de hidratación está intacta y profundamente hidratada — la luz rebota en una superficie uniforme y acolchada en lugar de dispersarse en zonas secas." },
        { t: "h2", en: "It starts with water, not shine", es: "Empieza con agua, no con brillo" },
        { t: "p", en: "Chasing glow with oils and highlighters skips the actual step. Hydration is water held in the skin; the glow is a side effect of that water being there. Layer humectants — hyaluronic acid, snail mucin, fermented essences — onto damp skin, then seal them so they don't evaporate.", es: "Buscar luminosidad con aceites e iluminadores se salta el paso real. La hidratación es agua retenida en la piel; el brillo es un efecto de que esa agua esté ahí. Aplica humectantes — ácido hialurónico, baba de caracol, esencias fermentadas — sobre la piel húmeda y séllalos para que no se evaporen." },
        { t: "h2", en: "The three habits that matter", es: "Los tres hábitos que importan" },
        { t: "p", en: "Cleanse gently (a low-pH milk cleanser, never a squeaky-clean strip). Layer thin, not thick — several light passes of essence beat one heavy cream. And protect in the day with SPF, because UV quietly undoes the barrier you're building.", es: "Limpia con suavidad (un limpiador de leche de pH bajo, nunca uno que deje la piel tirante). Aplica capas finas, no gruesas — varias pasadas ligeras de esencia superan a una crema pesada. Y protege de día con SPF, porque los rayos UV deshacen en silencio la barrera que construyes." },
        { t: "p", en: "Do that consistently for a few weeks and the glass look arrives on its own — no filter required.", es: "Hazlo de forma constante durante unas semanas y el aspecto de cristal llega solo — sin filtro." },
      ],
    },
    {
      slug: "why-barrier-first",
      date: "2026-05-18",
      readMins: 4,
      tone: "sage",
      title: { en: "Why we build barrier-first", es: "Por qué priorizamos la barrera" },
      excerpt: {
        en: "The skin barrier is the quiet foundation of every healthy complexion. Strip it, and nothing else works.",
        es: "La barrera cutánea es la base silenciosa de todo cutis sano. Si la dañas, nada más funciona.",
      },
      body: [
        { t: "p", en: "The moisture barrier is the outermost layer of skin — a mesh of cells and lipids that keeps water in and irritants out. When it's healthy, skin is calm, resilient, and quietly radiant. When it's compromised, you get tightness, redness, breakouts, and sensitivity that no serum can outrun.", es: "La barrera de hidratación es la capa más externa de la piel — una malla de células y lípidos que retiene el agua y mantiene fuera a los irritantes. Cuando está sana, la piel está calmada, resistente y radiante. Cuando se daña, aparecen tirantez, enrojecimiento, brotes y sensibilidad que ningún sérum puede compensar." },
        { t: "h2", en: "More actives isn't more results", es: "Más activos no es más resultados" },
        { t: "p", en: "The instinct when skin misbehaves is to add stronger actives. Often that's exactly what broke the barrier in the first place — over-exfoliation, high-strength acids, harsh cleansers. We formulate the other way: support first, correct gently, and let a resilient barrier do most of the work.", es: "El instinto cuando la piel se porta mal es añadir activos más fuertes. A menudo eso es justo lo que rompió la barrera — sobreexfoliación, ácidos muy concentrados, limpiadores agresivos. Nosotras formulamos al revés: primero apoyar, corregir con suavidad y dejar que una barrera resistente haga la mayor parte del trabajo." },
        { t: "p", en: "That's why every Viodelith formula starts with ceramides, centella, and humectants — and why we keep the range small. Fewer, gentler steps you can actually keep beat a ten-product routine your skin resents.", es: "Por eso cada fórmula de Viodelith empieza con ceramidas, centella y humectantes — y por eso mantenemos una gama pequeña. Pocos pasos, más suaves y que de verdad puedas mantener, superan a una rutina de diez productos que tu piel resiente." },
      ],
    },
    {
      slug: "layering-order",
      date: "2026-04-27",
      readMins: 6,
      tone: "rose",
      title: { en: "The right order to layer", es: "El orden correcto para superponer" },
      excerpt: {
        en: "Thinnest to thickest is the short version. Here's the full sequence, and where the common mistakes hide.",
        es: "De lo más ligero a lo más denso es la versión corta. Aquí la secuencia completa y dónde se esconden los errores.",
      },
      body: [
        { t: "p", en: "The guiding rule is simple: apply from thinnest to thickest, giving water-based layers a moment to sink in before the richer ones seal everything down. A workable morning sequence looks like this.", es: "La regla es simple: aplica de lo más ligero a lo más denso, dando a las capas acuosas un momento para absorberse antes de que las más ricas lo sellen todo. Una secuencia de mañana que funciona se ve así." },
        { t: "h2", en: "Cleanse → Tone → Essence → Serum → Cream → SPF", es: "Limpia → Tonifica → Esencia → Sérum → Crema → SPF" },
        { t: "p", en: "Cleanse with a low-pH milk cleanser. Tone to rebalance and add the first layer of hydration. Press in an essence while skin is still damp. Follow with a targeted serum, then a barrier cream to seal. In the morning, finish — always — with SPF.", es: "Limpia con un limpiador de leche de pH bajo. Tonifica para reequilibrar y añadir la primera capa de hidratación. Presiona una esencia mientras la piel sigue húmeda. Sigue con un sérum específico y luego una crema barrera para sellar. Por la mañana, termina — siempre — con SPF." },
        { t: "h2", en: "Where it goes wrong", es: "Dónde se tuerce" },
        { t: "p", en: "Two mistakes are almost universal: letting skin dry completely between steps (apply to damp skin so humectants have water to grab), and applying oils or creams before water-based layers (nothing water-based will get through afterward). At night, swap SPF for a sleeping mask once or twice a week.", es: "Dos errores son casi universales: dejar que la piel se seque del todo entre pasos (aplica sobre piel húmeda para que los humectantes tengan agua que retener) y poner aceites o cremas antes de las capas acuosas (después nada acuoso podrá penetrar). De noche, cambia el SPF por una mascarilla de dormir una o dos veces por semana." },
      ],
    },
    {
      slug: "ingredient-glossary",
      date: "2026-04-05",
      readMins: 5,
      tone: "cream",
      title: { en: "A short K-beauty glossary", es: "Breve glosario K-beauty" },
      excerpt: {
        en: "Snail mucin, centella, propolis, ceramides — what the heritage ingredients actually do.",
        es: "Baba de caracol, centella, propóleo, ceramidas — qué hacen realmente los ingredientes tradicionales.",
      },
      body: [
        { t: "p", en: "K-beauty leans on ingredients with long track records rather than the trend of the month. A few worth knowing:", es: "La K-beauty se apoya en ingredientes con larga trayectoria más que en la tendencia del mes. Algunos que vale la pena conocer:" },
        { t: "h2", en: "Snail mucin", es: "Baba de caracol" },
        { t: "p", en: "A humectant powerhouse that hydrates, smooths, and helps skin repair. It's the backbone of that plumped, dewy essence texture.", es: "Un potente humectante que hidrata, alisa y ayuda a la piel a repararse. Es la base de esa textura de esencia jugosa y rellenadora." },
        { t: "h2", en: "Centella asiatica (cica)", es: "Centella asiática (cica)" },
        { t: "p", en: "A calming botanical that reduces redness and supports the barrier — the ingredient to reach for when skin is reactive or overworked.", es: "Un botánico calmante que reduce el enrojecimiento y apoya la barrera — el ingrediente al que recurrir cuando la piel está reactiva o agotada." },
        { t: "h2", en: "Propolis & ceramides", es: "Propóleo y ceramidas" },
        { t: "p", en: "Propolis brings a clarifying, lit-from-within finish; ceramides are the lipids that rebuild the barrier itself. Together they're calm and glow in the same step.", es: "El propóleo aporta un acabado clarificado y luminoso desde el interior; las ceramidas son los lípidos que reconstruyen la propia barrera. Juntos son calma y luminosidad en el mismo paso." },
      ],
    },
  ];

  const GRADIENTS = {
    amber: "linear-gradient(150deg, #E9D8B8, var(--paper-2))",
    sage:  "linear-gradient(150deg, #DCE0D3, var(--paper-2))",
    rose:  "linear-gradient(150deg, #EBD9D2, var(--paper-2))",
    cream: "linear-gradient(150deg, var(--sand), var(--paper-2))",
    sand:  "linear-gradient(150deg, var(--sand), var(--paper-2))",
  };

  function lang() { return window.L10n ? window.L10n.lang : "en"; }
  function tt(key) { return window.L10n ? window.L10n.t(key) : key; }
  function pick(field) { return field[lang()] || field.en; }
  function leaf() { return (typeof window.leafSVG === "function") ? window.leafSVG() : ""; }

  function fmtDate(iso) {
    try {
      const locale = lang() === "es" ? "es-HN" : "en-US";
      return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso + "T00:00:00"));
    } catch (e) { return iso; }
  }
  function meta(a) { return `${fmtDate(a.date)} · ${a.readMins} ${tt("journal.minread")}`; }

  function articleCard(a) {
    return `
    <a class="jcard reveal" href="article.html?slug=${encodeURIComponent(a.slug)}">
      <div class="jcard__media" style="background:${GRADIENTS[a.tone] || GRADIENTS.cream}">${leaf()}</div>
      <div class="jcard__body">
        <span class="jcard__meta">${meta(a)}</span>
        <h3 class="jcard__title">${pick(a.title)}</h3>
        <p class="jcard__excerpt">${pick(a.excerpt)}</p>
        <span class="link-underline">${tt("journal.readmore")}</span>
      </div>
    </a>`;
  }

  function renderIndex() {
    const grid = document.getElementById("journal-grid");
    if (!grid) return;
    grid.innerHTML = ARTICLES.map(articleCard).join("");
    if (typeof window.observeReveals === "function") window.observeReveals(grid);
    else grid.querySelectorAll(".reveal").forEach(el => el.classList.add("is-in"));
  }

  function renderArticle() {
    const root = document.getElementById("article");
    if (!root) return;
    const slug = new URLSearchParams(location.search).get("slug");
    const a = ARTICLES.find(x => x.slug === slug);
    if (!a) {
      root.innerHTML = `<div class="wrap article"><p class="prose">${tt("journal.notfound")}</p><a class="link-underline" href="journal.html">${tt("journal.back")}</a></div>`;
      return;
    }
    document.title = `${pick(a.title)} — Viodelith Skincare`;
    const blocks = a.body.map(b => b.t === "h2" ? `<h2>${pick(b)}</h2>` : `<p>${pick(b)}</p>`).join("");
    const others = ARTICLES.filter(x => x.slug !== a.slug).slice(0, 3);
    root.innerHTML = `
      <div class="wrap article">
        <a class="article__back link-underline" href="journal.html">← ${tt("journal.back")}</a>
        <span class="eyebrow">${tt("journalpage.eyebrow")}</span>
        <h1 class="article__title">${pick(a.title)}</h1>
        <span class="article__meta">${meta(a)}</span>
        <div class="article__media" style="background:${GRADIENTS[a.tone] || GRADIENTS.cream}">${leaf()}</div>
        <div class="article__body prose">${blocks}</div>
      </div>
      <section class="section">
        <div class="wrap">
          <div class="section__head"><div><span class="eyebrow">${tt("journal.more")}</span></div></div>
          <div class="journal-grid">${others.map(articleCard).join("")}</div>
        </div>
      </section>`;
    if (typeof window.observeReveals === "function") window.observeReveals(root);
  }

  function render() { renderIndex(); renderArticle(); }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    if (window.L10n) window.L10n.onChange(render);
  });
})();
