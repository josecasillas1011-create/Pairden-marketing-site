# CLAUDE.md — Pairden Marketing Site v2 (fresh build)

You are building the public marketing site for **Pairden AI** (legal entity: **Pairden Technologies LLC**), an AI automation agency for local service businesses in Menifee, CA / Inland Empire. Michael (this user) drives the build. Partner: Jose (jose@pairden.com) — he owns the live site, repo, Netlify, and domains; this v2 is built in parallel and handed to him for cutover.

**At the start of every build session: read `BUILD-SPEC.md` and work the phase Michael names. If this file and BUILD-SPEC.md ever disagree, stop and ask — never pick one silently.**

## Locked business rules — never "improve," round, or restate these
- Packages (exact): **Online Foundation** $250 setup / **$147/mo** · **Growth Engine** $500 setup / **$397/mo** · **AI Front Office** $997 setup / **$997/mo**. Setup waived with a 6-month term (12-month for AI Front Office).
- Monthly prices are **never discounted** anywhere on the site.
- 30-day free trials appear on exactly three services and no others: **missed-call text-back, review engine, AI website chat**.
- **Local SEO: 6- or 12-month terms only.** Never "3-month minimum," never month-to-month. (Old site has this wrong — do not port it.)
- AI Front Office includes 1,000 receptionist minutes/mo; overage **$0.40/min**.
- FrontDesk standalone tiers: After-Hours Guard $197/mo · Full 24/7 Receptionist $397/mo · High-Volume $797/mo.
- Never invent prices, guarantees, statistics, testimonials, client names, or claims not in BUILD-SPEC.md.

## A2P compliance — the highest-stakes content on the site
- Every form that collects a phone number has a consent checkbox: **unchecked by default, required**, with this EXACT text (do not paraphrase, shorten, or reflow into marketing copy):
  > "I agree to receive calls and text messages from PAIRDEN about this request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms of Service."
- `privacy.html` and `terms.html` are **ported word-for-word** from `reference/legacy/`. Never rewrite, summarize, or "modernize" legal pages. Only permitted edits: add "Pairden Technologies LLC" to the headers.
- Footer on every page: `© 2026 Pairden Technologies LLC, d/b/a PAIRDEN · Menifee, CA`
- Organization schema (JSON-LD) includes `addressLocality: "Menifee"`, `addressRegion: "CA"`.
- Spanish pages use the Spanish consent line from BUILD-SPEC.md §ES exactly.
- The chatbot and free tools must never collect a phone number without the consent line. If a task seems to require it, stop and ask.

## Brand — new kit only
- Logos come only from `assets/brand/`. **Never** use anything from `reference/legacy/assets/` — those are the retired logos.
- Tokens: Deep Navy `#071A3D` · Electric Blue `#0A84FF` · Cyan Accent `#17C8F4` · Slate `#5D6B82` · Soft White `#F4F7FB` · page background `#040C1F`.
- Fonts: Space Grotesk (headings) · Inter (body) · JetBrains Mono (numbers, optional).
- Usage rules: white lockup on dark backgrounds; never stretch, rotate, recolor, outline, shadow, or rearrange logos; P icon (not full lockup) below 180px widths.

## Integrations — port exactly
- Lead form and chatbot POST to the Make.com webhook (URL in `reference/legacy/index.html`). Keep the payload keys byte-identical: `firstName, lastName, company, businessType, email, phone, services[], goal, budget, smsConsent, intentScore, honeypot, submittedAt`. Michael extends the Make scenario separately — the site must not break it.
- Keep the honeypot field (`hp_field`) and the intentScore function from legacy.
- CRM note: the `company` value maps to GHL's `contact.company_name`. A field called `business_name` **does not exist** in GHL — never introduce that name anywhere.

## Architecture
- Pure static: HTML + one shared `styles.css` (CSS variables) + vanilla JS. No frameworks, no build step. Netlify publishes the repo root.
- English pages: `index, frontdesk, tools, faq, privacy, terms, 404`. Spanish mirrors under `/es/` per BUILD-SPEC.md.
- `netlify.toml` must retain the full `axismarketingai.net` 301 block from legacy, verbatim.

## Working rules (git & safety)
- Work on a branch per phase. **Never push to main; never deploy; never touch DNS, domains, Netlify settings, Stripe, phone numbers, or the Make scenario.** Prepare and hand off.
- A file that isn't committed doesn't exist. Every phase ends with: local preview checked, changed files listed, committed on the branch, one-paragraph summary Michael can paste into planning chat for review.
- Pause for Michael's approval before: deleting files, changing netlify.toml, or any edit to legal pages or consent text.
- If legacy content conflicts with a rule in this file (e.g., the SEO "3-month minimum"), this file wins — and say so out loud when it happens.
