# Integrations

How to wire ShrinkMaster's marketing surfaces into KellyPeng.com.

## What's in this folder

- **`kellypeng-products-section.html`** — drop-in HTML+CSS+JS snippet that renders a "Products / 产品" section on KellyPeng.com. Self-contained, scoped (`.km-` prefix), bilingual (EN/中文 auto-swap based on `<html lang>` or `body.km-lang-{en,zh}`).

---

## Architecture

```
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│ kellypeng.com                   │    │ shrinkmaster.kellypeng.com      │
│  (your personal site)           │ →  │  (this product's landing)       │
│                                 │    │                                 │
│  About                          │    │  Hero                           │
│  Featured Work                  │    │  Examples table                 │
│  ▶ Products section ◀ — NEW     │    │  Features                       │
│      ┌────────────────────┐    │    │  Use cases                      │
│      │ ShrinkMaster card  │ ─┼────→ │  VS comparison                  │
│      └────────────────────┘    │    │  App shot                       │
│  Services                      │    │  About Kelly                    │
│  Contact                       │    │  FAQ + CTA                      │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

The two sites live separately. The **product card** on the main site is just a teaser pointing at the **subdomain** which has the full marketing landing.

---

## Step 1 — Pick a host for `shrinkmaster.kellypeng.com`

GitHub Pages (the obvious default) requires a public repo on free GitHub plans. Three alternatives:

| Host | Setup | Cost | Works with private repo |
|---|---|---|---|
| **GitHub Pages** | Settings → Pages → Source = `main /docs` | Free | ❌ requires public repo or GitHub Pro ($4/mo) |
| **Vercel** | Connect repo, set output dir = `docs`, add custom domain | Free | ✅ |
| **Netlify** | Connect repo, set publish dir = `docs`, add custom domain | Free | ✅ |
| **Cloudflare Pages** | Connect repo, set output = `docs`, add custom domain | Free | ✅ |

**Recommended**: Make the repo public (it's already MIT licensed and the landing claims "Source is public on GitHub") and use GitHub Pages. Otherwise pick Vercel — fastest setup.

### If using GitHub Pages

After making the repo public:

```bash
# This file already exists in docs/CNAME — GitHub Pages reads it.
cat docs/CNAME
# → shrinkmaster.kellypeng.com
```

Then:
1. Go to https://github.com/kellypeng/shrinkmaster/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** · Folder: **/docs**
4. Save. Wait ~1 minute for the first build.

### If using Vercel

1. Sign in to vercel.com with your GitHub account
2. **Add New → Project** → import `kellypeng/shrinkmaster`
3. Framework preset: **Other**
4. Output directory: **docs**
5. Build command: leave empty
6. Deploy
7. Project Settings → Domains → add `shrinkmaster.kellypeng.com`

(Netlify and Cloudflare Pages are nearly identical — same fields with slightly different labels.)

---

## Step 2 — DNS for `shrinkmaster.kellypeng.com`

You need to point the subdomain at the host you picked. Log in to whoever manages DNS for `kellypeng.com` (Cloudflare / Route 53 / Namecheap / GoDaddy / etc.) and add **one CNAME record**:

| Host             | Value (target)            | TTL   |
|------------------|---------------------------|-------|
| `shrinkmaster`   | (depends on host, see below) | Auto |

**Targets per host**:
- GitHub Pages: `kellypeng.github.io`
- Vercel: `cname.vercel-dns.com`
- Netlify: `<your-site>.netlify.app`
- Cloudflare Pages: `<your-project>.pages.dev`

DNS propagation usually takes 1-10 minutes. The host will issue an HTTPS cert automatically once DNS resolves.

---

## Step 3 — Drop the Products section into KellyPeng.com

Open `kellypeng-products-section.html` and copy its contents. Paste into your site source between the **Featured Work** section and the **Services** section.

Three things to verify after pasting:

1. **Locale toggle**: the section auto-detects locale from `<html lang>` or `body.km-lang-{en,zh}`. If your existing EN/中 toggle uses something different, dispatch a `km:langchange` custom event from your toggle:
   ```js
   document.dispatchEvent(new CustomEvent('km:langchange', { detail: 'zh' }));
   ```
   Or modify the `detectLang()` function inside the snippet to read whatever signal you use.

2. **Typography**: the snippet uses `font-family: inherit`, so it picks up whatever stack is on the parent. If your site uses a specific brand font, it'll match automatically.

3. **Visual rhythm**: the section has its own padding (`80px 24px`). If your site uses a different vertical scale, adjust the outer `.km-products { padding: ... }` value.

---

## What if I want to add another product later?

Open `kellypeng-products-section.html`. After the existing `<a class="km-product">` block, copy-paste another one. Update:

- The icon (the inline SVG)
- The icon's gradient color (`background: linear-gradient(...)` in `.km-product-icon`)
- The product name
- The tags (`.km-tag` chips)
- The description (both `data-i18n-en` and `data-i18n-zh`)
- The href

The grid auto-stacks vertically. Future products with different brand colors can use a custom CSS class (`.km-product-icon--orange { background: ...; box-shadow: ...; }`) on the icon div.

---

## What if I want to change the section heading later?

Edit these three elements in the snippet:

```html
<div class="km-products-eyebrow"  data-i18n-en="Products"  data-i18n-zh="产品">Products</div>
<h2 class="km-products-title"     data-i18n-en="..."        data-i18n-zh="...">...</h2>
<p  class="km-products-lede"      data-i18n-en="..."        data-i18n-zh="...">...</p>
```

The `data-i18n-en` and `data-i18n-zh` attributes are what the locale switch reads from. The text inside the element is the EN default for the no-script case.
