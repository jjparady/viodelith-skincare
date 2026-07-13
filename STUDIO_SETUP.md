# Viodelith Studio — content manager

The **Studio** lets your friend add products (name, photo, price, quantity),
write journal articles, and have Spanish filled in automatically — all from her
phone, no code. It lives at:

### `…/admin/` — e.g. https://jjparady.github.io/viodelith-skincare/admin/

It's built on **Sveltia CMS**, a mobile-friendly git-based editor: when she taps **Publish**, the
change is saved as a commit to this repo and the live site updates itself in a
minute or two. There's no separate database or server to run.

---

## Part 1 — One-time setup (owner, ~10 minutes)

This connects the Studio to GitHub so logging in works. You only do it once.

### 1. Give your friend access to the repo
GitHub → this repo → **Settings → Collaborators → Add people** → invite her
GitHub account with **Write** access. (She needs a free GitHub account.)

### 2. Create a GitHub OAuth app
GitHub → your **Settings → Developer settings → OAuth Apps → New OAuth App**:
- **Application name:** Viodelith Studio
- **Homepage URL:** `https://jjparady.github.io/viodelith-skincare/`
- **Authorization callback URL:** the callback of the relay you deploy in step 3
  (for the worker below it's `https://<your-worker>.workers.dev/callback`)

Save it, then note the **Client ID** and generate a **Client secret**.

### 3. Deploy a small OAuth relay (free)
Sveltia needs a tiny helper to complete GitHub login on a static host. The
**`sveltia-cms-auth`** Cloudflare Worker (same author as Sveltia CMS) is free:

1. Create a free [Cloudflare](https://dash.cloudflare.com) account.
2. Deploy the `sveltia-cms-auth` worker (its README has a one-click/`wrangler`
   deploy).
3. In the worker's settings add two variables:
   `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from step 2.
4. Copy the worker's URL (e.g. `https://viodelith-auth.<name>.workers.dev`).

### 4. Point the Studio at the relay
Edit **`admin/config.yml`** in this repo and set:
```yml
backend:
  name: github
  repo: jjparady/viodelith-skincare
  branch: claude/viodelith-skincare-site-6s23zn   # the branch the site deploys from
  base_url: https://viodelith-auth.<name>.workers.dev   # ← your worker URL
```
Commit that change. Login now works.

### 5. (Optional) Turn on auto-translation
So English content translates to Spanish on its own:
1. Create a [DeepL API account](https://www.deepl.com/pro-api) (the **Free** plan
   allows 500,000 characters/month and is plenty).
2. Copy your **Authentication Key**.
3. GitHub → this repo → **Settings → Secrets and variables → Actions → New
   repository secret**: name it `DEEPL_API_KEY`, paste the key.

That's it. Without this step the site still works — she'd just type the Spanish
herself (or leave it, and it falls back to English).

---

## Part 2 — Daily use (your friend, from her phone)

1. Open **`…/viodelith-skincare/admin/`** and tap **Login with GitHub**.
2. **To add a product:** open **Products → Product catalogue → Add product**.
   Fill in the name, pick a category, set the **price** and **quantity in stock**,
   add a **photo**, write a short description. Tap **Publish**.
   - Leave the **Spanish** fields blank — they fill in automatically.
   - Set **quantity to 0** to show something as *Sold out*; raise it when she
     restocks.
3. **To write an article:** open **Journal → Articles → Add article**. Give it a
   title, a short excerpt, and write the article. Add a cover photo if you like.
   Tap **Publish**.
4. Changes go live on the site in about a minute. Spanish appears shortly after
   (once the translation step finishes).

### Good to know
- **Photos** are stored in the `uploads/` folder automatically.
- Product **categories** double as the shop filters.
- She can edit or re-price anything anytime — just change it and Publish.
- Nothing here touches payments. When the Shopify store goes live, products can
  move to the Shopify app; the Journal keeps working in the Studio.
