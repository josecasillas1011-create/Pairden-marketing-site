# HANDOFF.md — PAIRDEN Marketing Site v2

**For:** Jose (jose@pairden.com) · **From:** Michael · **Built:** August 2, 2026

This is a complete, from-scratch rebuild of the PAIRDEN public marketing site.
It is **static HTML + one shared CSS file + vanilla JS** — no framework, no build step.
Netlify publishes the repo root exactly as-is.

> **Status: NOT YET DEPLOYED.** Placeholders remain (see §5). Read §5 before pushing anything live.

---

## 1. What's in the repo

```
/                  index.html · frontdesk.html · tools.html · faq.html
                   privacy.html · terms.html · 404.html
/es/               index.html · frontdesk.html · faq.html
                   privacidad.html · terminos.html
/assets/brand/     new logo kit (icon, lockups, favicons, og-card)
/styles.css        shared design system — all brand tokens live here
/site.js           shared behaviors (nav, reveal, scroll-top, FAQ, ?plan= deep links)
/netlify.toml      redirects, rewrites, security headers
/robots.txt  /sitemap.xml
/reference/legacy/ the OLD site — read-only source, git-ignored, never shipped
```

**12 pages total** — 7 English, 5 Spanish.

---

## 2. What changed vs. the legacy site

### Brand — completely new kit
- New palette: Deep Navy `#071A3D` · Electric Blue `#0A84FF` · Cyan `#17C8F4` · Slate `#5D6B82` · Soft White `#F4F7FB` · page background `#040C1F`.
- **Every retired brand color is gone** from the codebase — verified by grep across all 12 pages.
- All logos now come from `/assets/brand/`. The old logo files in `reference/legacy/assets/` are retired and referenced nowhere.
- Fonts unchanged: Space Grotesk (headings) · Inter (body) · JetBrains Mono (numbers).

### Content and compliance corrections
| # | Change | Why |
|---|---|---|
| 1 | **Local SEO now reads "6- or 12-month terms"** | Legacy `index.html` said `"3-month minimum"`, which contradicts the locked business rule. Corrected in EN and ES, plus a new FAQ entry explaining the term. |
| 2 | **Form input `name="business_name"` → `name="company"`** | `business_name` is not a real GHL field. The webhook payload key was already `company`, so **the Make scenario and GHL are unaffected**. Visible label ("Business name") unchanged. |
| 3 | **Footer is now the LLC line** on every page | `© 2026 Pairden Technologies LLC, d/b/a PAIRDEN · Menifee, CA` |
| 4 | **Organization JSON-LD now carries the Menifee, CA address** | Was missing entirely. Also added `legalName`. |
| 5 | **Clean URLs everywhere** | Internal links are now `/faq`, `/frontdesk`, `/privacy` etc. rather than `.html`. `netlify.toml` has matching 200-rewrites. |

### New in v2 (not in legacy)
- **Full Spanish site** at `/es/` with reciprocal `hreflang` on every EN/ES pair and an EN ⇄ ES toggle in the nav.
- **`?plan=` deep links** — `?plan=foundation|growth|frontoffice` scrolls to the plan ladder, highlights the matching card, and preselects it in the audit form. Unknown values are a silent no-op.
- **Short links** — `/growth`, `/foundation`, `/frontoffice`, `/demo` (302s).
- **Social row** in the footer (Instagram, Facebook, X, TikTok, LinkedIn).
- **FAQPage JSON-LD** on `faq.html` for rich results.
- `sitemap.xml` and `robots.txt` (legacy had these; regenerated with ES URLs and hreflang alternates).

### Ported unchanged — do not "fix" these
- **The Make.com webhook URL and all 13 payload keys** are byte-identical to legacy:
  `firstName, lastName, company, businessType, email, phone, services[], goal, budget, smsConsent, intentScore, honeypot, submittedAt`
  Renaming any key silently breaks the lead pipeline.
- **The `hp_field` honeypot** and the **`calculateIntentScore()`** function — logic untouched.
- **`privacy.html` and `terms.html` are word-for-word ports.** The only edit is the LLC line in the header. Do not rewrite, summarize, or modernize these.
- **The entire `axismarketingai.net` 301 block** in `netlify.toml`, verbatim, including the `force = true` flags.

---

## 3. A2P / SMS compliance — the highest-stakes part of this site

- Every form that collects a phone number has a consent checkbox that is **unchecked by default and required**. Verified on both `index.html` and `es/index.html`.
- The English consent sentence is **verbatim**; the Spanish is the approved translation. Neither may be paraphrased, shortened, or reflowed into marketing copy.
- **The chat widget collects name, company, and email only — never a phone number.** This is deliberate. If chat is ever changed to collect a phone, it must get the full consent line first.
- The free tools collect no PII beyond what legacy collected.

---

## 4. Cutover options

### Option A — merge v2 into the existing repo + Netlify site (**recommended**)
Keeps domains, DNS, and the live axis redirects exactly where they are. Lowest risk.
1. Branch off the current live repo.
2. Copy in all 12 pages, `styles.css`, `site.js`, `netlify.toml`, `robots.txt`, `sitemap.xml`, `assets/brand/`.
3. Delete the retired logo files from the old `assets/` folder once nothing references them.
4. Deploy preview → check §6 → merge.

### Option B — new Netlify site, then move the domains
1. Create a new Netlify site from this repo, publish directory `.`.
2. Move `pairden.com` **and** `axismarketingai.net` to the new site.
3. The axis redirect block is already in our `netlify.toml`, so the redirects survive the move — **but they only work while `axismarketingai.net` stays assigned to the Netlify site serving this config.** Do not release that domain.

---

## 5. ⚠️ Placeholders — the site is NOT ship-ready until these are resolved

**`BOOKING_URL` — hard blocker.** All five booking CTAs on `frontdesk.html` and the two on `es/frontdesk.html` currently have `href="BOOKING_URL"`, which is not a real link. **These buttons do nothing.** Michael supplies the Pairden GHL calendar link. Never restore the old cal.com/axis link.

The remaining open items are tracked in **`PENDING-INPUTS.md`** in this repo — including unverified social profile URLs, the demo phone number, individual service prices carried over from legacy without verification, and the Spanish copy sign-off. **Read that file before deploying.**

---

## 6. Pre-deploy checklist

- [ ] `BOOKING_URL` replaced in `frontdesk.html` and `es/frontdesk.html` (7 spots)
- [ ] Everything in `PENDING-INPUTS.md` resolved
- [ ] Spanish copy reviewed and the two `[MICHAEL: verify]` banners removed from `es/privacidad.html` and `es/terminos.html`
- [ ] Submit the audit form and confirm it lands in the Make scenario
- [ ] Test `?plan=foundation`, `?plan=growth`, `?plan=frontoffice`
- [ ] Test `/growth`, `/foundation`, `/frontoffice`, `/demo`
- [ ] Check every page at 375px / 768px / 1440px
- [ ] Confirm an `axismarketingai.net` URL still 301s to `pairden.com`
- [ ] Lighthouse ≥ 90 performance and SEO
- [ ] OG card preview renders on one social platform

---

## 7. Known gaps at handoff

- **No git history.** This build was produced as files; the repo was never initialized, so there are no commits, branches, or diffs behind it. Recommend `git init` and one baseline commit before any further edits.
- **No browser or device testing has been performed.** The pages have not been opened in a browser, rendered, or checked at any breakpoint. Responsive CSS is ported from the legacy site (which was tested), but v2 itself is **verified by static inspection and grep only**. Treat §6 as real work, not a formality.
- **Lighthouse has not been run.**
- `/tools` has no Spanish counterpart — the calculators are English-only by design. `es/` pages link to the English `/tools`.
