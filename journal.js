/* =========================================================
   Viodelith Skincare — Journal
   ---------------------------------------------------------
   Loads articles from data/articles.json (editable in the CMS)
   and renders the list (journal.html) or a single article
   (article.html, from ?slug=). Bilingual; re-renders on
   language change. Article bodies are Markdown.
   ========================================================= */

(function () {
  // Fallback used only if data/articles.json can't be loaded (e.g. a bad edit).
  const FALLBACK = [
    { slug: "glass-skin-decoded", date: "2026-06-02", readMins: 5, tone: "amber", image: "",
      title: { en: "Glass skin, decoded", es: "La piel de cristal, descifrada" },
      excerpt: { en: "It isn't a filter — it's the look of a barrier that's genuinely, deeply hydrated.", es: "No es un filtro — es el aspecto de una barrera realmente hidratada en profundidad." },
      body: { en: "\"Glass skin\" is what skin looks like when the moisture barrier is intact and deeply hydrated.", es: "La \"piel de cristal\" es cómo se ve la piel cuando la barrera está intacta y profundamente hidratada." } },
  ];

  const GRADIENTS = {
    amber: "linear-gradient(150deg, #E9D8B8, var(--paper-2))",
    sage:  "linear-gradient(150deg, #DCE0D3, var(--paper-2))",
    rose:  "linear-gradient(150deg, #EBD9D2, var(--paper-2))",
    cream: "linear-gradient(150deg, var(--sand), var(--paper-2))",
    sand:  "linear-gradient(150deg, var(--sand), var(--paper-2))",
  };

  let ARTICLES = FALLBACK;

  function normalize(r) {
    return {
      slug: r.slug, date: r.date, readMins: r.readMins || 3, tone: r.tone || "cream", image: r.image || "",
      title:   { en: r.title_en   || "", es: r.title_es   || r.title_en   || "" },
      excerpt: { en: r.excerpt_en || "", es: r.excerpt_es || r.excerpt_en || "" },
      body:    { en: r.body_en    || "", es: r.body_es    || r.body_en    || "" },
    };
  }

  async function loadArticles() {
    try {
      const res = await fetch("data/articles.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const list = (json.articles || []).map(normalize);
      if (list.length) ARTICLES = list;
    } catch (e) {
      console.warn("Falling back to built-in articles:", e.message);
    }
  }

  /* Minimal, safe Markdown → HTML (headings, paragraphs, bold/italic, links, lists) */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  }
  function md(src) {
    return String(src).split(/\n{2,}/).map(b => {
      b = b.trim();
      if (!b) return "";
      if (b.startsWith("## ")) return "<h2>" + inline(b.slice(3)) + "</h2>";
      if (b.startsWith("# ")) return "<h2>" + inline(b.slice(2)) + "</h2>";
      if (/^[-*] /.test(b)) {
        const items = b.split(/\n/).map(l => "<li>" + inline(l.replace(/^[-*] /, "")) + "</li>").join("");
        return "<ul>" + items + "</ul>";
      }
      return "<p>" + inline(b.replace(/\n/g, " ")) + "</p>";
    }).join("");
  }

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
  function mediaBlock(a, cls) {
    if (a.image) return `<div class="${cls}"><img class="${cls}-img" src="${a.image}" alt="${pick(a.title)}" loading="lazy" /></div>`;
    return `<div class="${cls}" style="background:${GRADIENTS[a.tone] || GRADIENTS.cream}">${leaf()}</div>`;
  }

  function articleCard(a) {
    return `
    <a class="jcard reveal" href="article.html?slug=${encodeURIComponent(a.slug)}">
      ${mediaBlock(a, "jcard__media")}
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
    const others = ARTICLES.filter(x => x.slug !== a.slug).slice(0, 3);
    root.innerHTML = `
      <div class="wrap article">
        <a class="article__back link-underline" href="journal.html">← ${tt("journal.back")}</a>
        <span class="eyebrow">${tt("journalpage.eyebrow")}</span>
        <h1 class="article__title">${pick(a.title)}</h1>
        <span class="article__meta">${meta(a)}</span>
        ${mediaBlock(a, "article__media")}
        <div class="article__body prose">${md(pick(a.body))}</div>
      </div>
      ${others.length ? `<section class="section">
        <div class="wrap">
          <div class="section__head"><div><span class="eyebrow">${tt("journal.more")}</span></div></div>
          <div class="journal-grid">${others.map(articleCard).join("")}</div>
        </div>
      </section>` : ""}`;
    if (typeof window.observeReveals === "function") window.observeReveals(root);
  }

  function render() { renderIndex(); renderArticle(); }

  document.addEventListener("DOMContentLoaded", async () => {
    await loadArticles();
    render();
    if (window.L10n) window.L10n.onChange(render);
  });
})();
