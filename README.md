# Swipe Québec — Website (Next.js)

Dating-directory website for **all of Québec**, organized by **categories** (no cities / regions), with a **Tinder-style swipe** on the home page.

## 🔥 The swipe (home page)

| Gesture | Button | Keyboard | Result |
|---|---|---|---|
| Swipe **left** | ✕ | ← | Next profile |
| Swipe **right** | ❤ | → | Opens her profile page |
| Swipe **up** | 💬 | ↑ | Goes to your **affiliate link** (the profile's own link, otherwise the global link in ⚙️ Paramètres du site) |

- Works with the finger on phones and with the mouse on computers. No filters.
- Profiles marked ⭐ **En vedette** in Sanity come first, then all the others, in random order (40 per visit; change `DECK_SIZE` in `app/page.tsx`).
- Under the swipe, a box tells visitors that **all profiles are in the Annonces page**.
- The card is sized to the screen, so the 3 buttons are always visible on phones.
- Code: `components/SwipeDeck.tsx`, styles at the bottom of `app/globals.css`.

Note: swiping up goes **directly** to the affiliate link. Emails are still collected by the button on each profile page.
Content (profiles, categories, blog, settings) is managed in the Sanity Studio (`swipe-quebec-sanity` folder).

## Pages

| URL | What it shows |
|-----|---------------|
| `/` | Title + **swipe deck** + link to all profiles |
| `/annonces` | All profiles + category filter + search (`?cat=…`, `?q=…`) |
| `/categories` | All categories with profile count |
| `/categories/[slug]` | Profiles of one category + SEO text (top/bottom) |
| `/profil/[slug]` | Profile page, gallery, email popup → affiliate link, similar profiles |
| `/tags`, `/blog`, `/blog/[slug]` | Tags and blog |
| `/legal`, `/confidentialite`, `/conditions` | Legal pages |
| `/sitemap.xml`, `/robots.txt` | Generated automatically for Google |

Old `/regions/...` links are redirected automatically (no 404s).

## Environment variables

Copy `.env.example` to `.env.local` for local work. On Netlify, add the same 4 variables.

| Variable | Example | Secret? |
|----------|---------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `abc123xy` | no |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | no |
| `SANITY_API_TOKEN` | `sk…` (Editor token) | **YES — never put it in GitHub** |
| `NEXT_PUBLIC_SITE_URL` | `https://www.swipequebec.com` | no |

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Change the brand name

Everything is in **`lib/site.ts`** (`SITE_NAME`, description, location).
The global affiliate link, home subtitle and SEO titles are edited in Sanity → ⚙️ Paramètres du site.

---

# 🚀 Go live — step by step

Do the **Sanity steps first** (see the README in `swipe-quebec-sanity`), so you have:
- your **Project ID**
- an **Editor token** (sanity.io/manage → your project → API → Tokens → Add API token → permission **Editor**)

### 1. Put this folder on GitHub

Create an **empty private** repository on github.com (e.g. `swipe-quebec-frontend`), then in this folder:

```bash
git init
git add .
git commit -m "Swipe Québec website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/swipe-quebec-frontend.git
git push -u origin main
```

(Or use **GitHub Desktop**: File → Add local repository → Publish.)
`.env.local` is ignored on purpose. Your token never goes to GitHub.

### 2. Create the site on Netlify

1. app.netlify.com → **Add new site → Import an existing project → GitHub**
2. Choose the `swipe-quebec-frontend` repository
3. Build settings are read from `netlify.toml` (nothing to change)
4. Before deploying, open **Environment variables** and add the 4 variables above
   (for now, `NEXT_PUBLIC_SITE_URL` = the Netlify address, e.g. `https://swipe-quebec.netlify.app`)
5. Click **Deploy**. After 2–3 minutes the site is online.

### 3. Buy / connect the domain on Netlify

1. Netlify → your site → **Domain management → Add a domain**
2. Type the domain you want (e.g. `rencontrequebec.com`)
   - If it is available, Netlify offers **Register** → pay → done (DNS is automatic)
   - If you already own it elsewhere, choose **Add domain** and follow the DNS instructions
3. HTTPS certificate is created automatically (can take up to 1 hour)
4. Update the variable **`NEXT_PUBLIC_SITE_URL`** to `https://www.your-domain.com`
   → **Deploys → Trigger deploy → Deploy site** (needed so canonical URLs and the sitemap use the domain)

### 4. Tell Google

Google Search Console → add your domain → Sitemaps → submit `https://www.your-domain.com/sitemap.xml`.

### Updating the site later

Any `git push` to `main` redeploys automatically.
Content changes in Sanity (profiles, categories, blog) appear **immediately**, with no redeploy.

## Checklist after going live

- [ ] Sanity → ⚙️ Paramètres du site → **affiliate link** filled in and published
- [ ] Open a profile → click the button → enter an email → you are redirected to the partner
- [ ] Sanity → 📧 Leads → the email appears there
- [ ] `https://your-domain/sitemap.xml` lists your profiles
