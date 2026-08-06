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

## 3b. Live preview — where to look before you touch anything

**https://curious-kulfi-dcaa51.netlify.app**

⚠️ **This is a manual drag-and-drop deploy. It is NOT connected to any git repo.**

That matters more than it sounds:
- **Nothing you push to git will appear there.** The preview only changes if someone
  drags the folder onto Netlify again. It is a snapshot, not a branch.
- **It will drift from the repo silently.** Treat the repo as the source of truth and this
  URL as a dated screenshot. When in doubt, redeploy rather than assume it is current.
- **It is not the cutover target.** Do not point `pairden.com` at this site. Use one of the
  two options in §4, both of which deploy from git.
- The random Netlify subdomain is fine for review, but it should not be shared with
  clients or submitted anywhere — including in the A2P registration, which must reference
  the real domain.

Use it to check the render, click the nav, open `/text-us` and confirm the LeadConnector
bubble appears, and read the footer legal line. Then come back to the repo for the actual work.

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

## 5. Booking, pricing, and phone — resolved

**Booking is wired.** Every booking CTA points at `/book` (English, 5) or `/es/reservar`
(Spanish, 5). Both 302-redirect to the GHL calendar via `netlify.toml`. **No page hardcodes
the vendor URL** — if the calendar moves, it changes in one place. Do not "simplify" this by
inlining the GHL link into the buttons.

**Two phone numbers, deliberately separate — do not merge them.**
- **(951) 477-5918** is the registered A2P business contact. It appears in the footer legal
  line on all 13 pages and **nowhere else**. It must always match GHL's Business Profile.
- **(951) 651-3966** / `tel:+19516513966` is the Vapi AI receptionist demo line. It appears in
  every demo CTA, hero, demo card, contact block, CTA band, and the JSON-LD `telephone` field.

Retired and never to be reintroduced: (909) 415-8481 and (840) 688-2967 — the latter was never
dialable, since 840 is not an assigned NANP area code.

**All à la carte prices are verified** against the Master Brain and locked in CLAUDE.md.
That table is the source of truth, not the legacy site.

**Receptionist trial:** source docs mention a capped 14-day receptionist trial. It is
**deliberately absent from every page** pending attorney review of the auto-conversion
language. It was removed from four places, including the FAQPage JSON-LD where Google would
have ingested it. Do not re-add it.

---

## 5b · ⚠️ A2P 10DLC — DO NOT BREAK THESE AT CUTOVER

**Why the first campaign was rejected — it was not the site.** TCR's verbatim reason was
*"The submitted legal company name does not match with US EIN."* The submission matched the
CP 575 exactly; the cause was IRS propagation lag on a newly issued EIN. Resubmission waits
roughly 30 days from EIN issuance. **No site change fixes this and none was ever required.**

That said, carriers re-scan the live site during review, so four things below are load-bearing
for the resubmission. Breaking any of them can fail it for a *new* reason.

**1. `/text-us` is the registered opt-in URL.**
Never rename, remove, or redirect it elsewhere. It must keep its `netlify.toml` 200-rewrite
and its sitemap entry. The page must contain **zero form elements** and must load **only**
the LeadConnector widget — never the site's own chat widget.

**2. The footer legal line must appear on all 13 pages**, exactly:
`Pairden Technologies LLC · 41877 Enterprise Circle N., 2nd Floor, Temecula, CA 92590 · Admin@pairden.com · (951) 477-5918`
English on the Spanish pages too — it is a legal-entity string, not marketing copy.

**3. The address must match everywhere.** The footer line and the JSON-LD `PostalAddress`
(on `index.html`, `es/index.html`, `frontdesk.html`) must agree character for character, and
both must match GHL's Business Profile and the A2P registration. **Never change one alone.**

**4. Two phone numbers, never merged.** `(951) 477-5918` is the registered business contact
and appears in the footer legal line *only*. `(951) 651-3966` is the Vapi demo line and appears
in every demo CTA and the JSON-LD `telephone` field. Keeping them separate is deliberate.

Also unchanged and not to be touched: the SMS consent checkbox and its exact wording on both
`index.html` and `es/index.html` — unchecked by default, required, verbatim.

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

## 7. Spanish is BUILT but HELD — English-only launch

All five Spanish pages (`es/index`, `es/frontdesk`, `es/faq`, `es/privacidad`, `es/terminos`)
are complete, styled, and working. **They are deliberately held back pending a native-speaker
review.** No Spanish copy has been read by anyone who speaks Spanish, and the two legal pages
still display visible `[MICHAEL: verify]` banners naming the English as controlling.

**The files still deploy.** They were not deleted — this is a soft launch gate, not a removal.
Four things hold them back:

| # | Where | What was done |
|---|---|---|
| 1 | `sitemap.xml` | all `/es/` URLs and hreflang alternates removed |
| 2 | 5 EN pages | `hreflang` en/es/x-default trios removed (`index`, `frontdesk`, `faq`, `privacy`, `terms`) |
| 3 | `styles.css` | `.lang-toggle { display: none !important; }` hides the EN ⇄ ES switch site-wide |
| 4 | `robots.txt` + `netlify.toml` | `Disallow: /es/` plus an `X-Robots-Tag: noindex, nofollow` header on `/es/*` |

Items 1–3 stop the Spanish pages being *linked or advertised*. **Item 4 is the one that matters
for risk** — without it, `/es/privacidad` would still resolve publicly and could be indexed with
an unreviewed-translation banner on it. A `Disallow` alone does not deindex a page that has
already been discovered, so the header is the real guarantee.

### To ship Spanish later — four reversals, in this order
1. Delete the `.lang-toggle { display: none !important; }` rule in `styles.css`.
2. Restore the `/es/` `<url>` entries and `xhtml:link` alternates in `sitemap.xml`.
3. Restore the `hreflang` trios on the 5 English pages (each has a comment marking the spot).
4. Remove `Disallow: /es/` from `robots.txt` **and** the `/es/*` header block from `netlify.toml`.

**Do not do any of that before the Spanish copy has been reviewed and the two
`[MICHAEL: verify]` banners removed from `es/privacidad.html` and `es/terminos.html`.**

Also outstanding on the Spanish side: `es/index.html` has no chat widget (the English homepage
does), there is no `es/tools.html` (Spanish footers link to the English `/tools`), and there is
no Spanish `/text-us`, which matters if the A2P campaign is meant to cover Spanish-language opt-in.

## 8. Known gaps at handoff

- **No git history.** This build was produced as files; the repo was never initialized, so there are no commits, branches, or diffs behind it. Recommend `git init` and one baseline commit before any further edits.
- **No browser or device testing has been performed.** The pages have not been opened in a browser, rendered, or checked at any breakpoint. Responsive CSS is ported from the legacy site (which was tested), but v2 itself is **verified by static inspection and grep only**. Treat §6 as real work, not a formality.
- **Lighthouse has not been run.**
- `/tools` has no Spanish counterpart — the calculators are English-only by design. `es/` pages link to the English `/tools`.
