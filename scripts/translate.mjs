/* =========================================================
   Viodelith — auto-translate English → Spanish
   ---------------------------------------------------------
   Fills empty *_es fields from their *_en counterparts using
   the DeepL API. Runs in GitHub Actions after content changes.
   If DEEPL_API_KEY is not set, it exits cleanly and changes
   nothing (Spanish can still be written by hand in the Studio).
   ========================================================= */

import { readFile, writeFile } from "node:fs/promises";

const KEY = process.env.DEEPL_API_KEY;
// Free keys end in ":fx" and use the api-free host.
const ENDPOINT = (KEY && KEY.endsWith(":fx"))
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

// Which English field maps to which Spanish field, per content type.
const FIELD_PAIRS = [
  ["title_en", "title_es"],
  ["description_en", "description_es"],
  ["excerpt_en", "excerpt_es"],
  ["body_en", "body_es"],
];

async function translate(text) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": "DeepL-Auth-Key " + KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: "EN",
      target_lang: "ES",
      preserve_formatting: true,
    }),
  });
  if (!res.ok) throw new Error("DeepL " + res.status + ": " + (await res.text()));
  const data = await res.json();
  return data.translations[0].text;
}

function isBlank(v) { return v == null || String(v).trim() === ""; }

async function processFile(path, listKey) {
  let json;
  try { json = JSON.parse(await readFile(path, "utf8")); }
  catch (e) { console.log(`Skipping ${path}: ${e.message}`); return 0; }

  const items = json[listKey] || [];
  let filled = 0;
  for (const item of items) {
    for (const [en, es] of FIELD_PAIRS) {
      if (en in item && !isBlank(item[en]) && isBlank(item[es])) {
        try {
          item[es] = await translate(item[en]);
          filled++;
          console.log(`  ✓ ${listKey}: ${es} for "${item.id || item.slug || "?"}"`);
        } catch (e) {
          console.error(`  ✗ ${es} for "${item.id || item.slug || "?"}": ${e.message}`);
        }
      }
    }
  }
  if (filled > 0) await writeFile(path, JSON.stringify(json, null, 2) + "\n");
  return filled;
}

async function main() {
  if (!KEY) {
    console.log("DEEPL_API_KEY not set — skipping auto-translate (Spanish can be written by hand).");
    return;
  }
  let total = 0;
  total += await processFile("data/products.json", "products");
  total += await processFile("data/articles.json", "articles");
  console.log(total ? `Filled ${total} Spanish field(s).` : "Nothing to translate.");
}

main().catch(e => { console.error(e); process.exit(1); });
