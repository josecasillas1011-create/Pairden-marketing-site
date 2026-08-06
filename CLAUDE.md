# CLAUDE.md — Pairden Marketing Site v2 (fresh build)

You are building the public marketing site for **Pairden AI** (legal entity: **Pairden Technologies LLC**), an AI automation agency for local service businesses in Menifee, CA / Inland Empire. Michael (this user) drives the build. Partner: Jose (jose@pairden.com) — he owns the live site, repo, Netlify, and domains; this v2 is built in parallel and handed to him for cutover.

**At the start of every build session: read `BUILD-SPEC.md` and work the phase Michael names. If this file and BUILD-SPEC.md ever disagree, stop and ask — never pick one silently.**

## Locked business rules — never "improve," round, or restate these
- Packages (exact): **Online Foundation** $250 setup / **$147/mo** · **Growth Engine** $500 setup / **$397/mo** · **AI Front Office** $997 setup / **$997/mo**. Setup waived with a 6-month term (12-month for AI Front Office).
- Monthly prices are **never discounted** anywhere on the site.
- 30-day free trials appear on exactly three services and no others: **missed-call text-back, review engine, AI website chat**.
- **Local SEO: 6- or 12-month terms only.** Never "3-month minimum," never month-to-month. (Old site has this wrong — do not port it.)
- AI Front Office includes 1,000 receptionist minutes/mo; overage **$0.50/min**.
  **LOCKED PENDING VERIFICATION** (raised from $0.40 on Aug 3 2026). A live call-cost matrix
  runs separately; the 3× margin bar is **$0.167/min**, so $0.50 clears it. Treat $0.50 as the
  number to publish, but expect one more revision once real per-minute costs land.
  ⚠️ **The Client Service Agreement still says $0.40 and is now out of sync with the site.**
  Michael must update the CSA **before any client signs.** This is a contract mismatch, not a
  copy nit — a signed agreement at $0.40 is enforceable at $0.40.
  On the site it appears in **4 places**: the plan note on `index.html` and `es/index.html`,
  and the receptionist usage note on `frontdesk.html` and `es/frontdesk.html`. One-line edit each.
- FrontDesk standalone tiers: After-Hours Guard $197/mo · Full 24/7 Receptionist $397/mo · High-Volume $797/mo.
- Never invent prices, guarantees, statistics, testimonials, client names, or claims not in BUILD-SPEC.md.

### À la carte menu — LOCKED (verified against the Master Brain, Aug 3 2026)
Format is `setup / monthly`. `$0` setup means no setup fee.

| Service | Setup | Monthly |
|---|---|---|
| Website + Google Business Profile | $250 | $147 |
| Multi-Page Pro | $500 | $247 |
| Booking + Reminders | $250 | $197 |
| Missed-Call Text-Back | $0 | $97 |
| Review Engine | $0 | $147 |
| After-Hours Receptionist | $250 | $197 |
| Full Receptionist | $497 | $397 |
| High-Volume Receptionist | $997 | $797 |
| **Local SEO — 6- or 12-month terms ONLY** | $250 | $497 |
| Website Chat | $0 | $97 |

These are verified and traceable. Do not re-derive them from the legacy site,
and do not flag them as "unverified" in future sessions.

### Receptionist trial — deliberately absent from the site
Source docs describe a capped 14-day receptionist trial. It is **intentionally
omitted from every page** pending attorney review of the auto-conversion
language. Do not re-add it. The only trials that may appear on the site are the
30-day trials on missed-call text-back, review engine, and AI website chat.

## A2P compliance — the highest-stakes content on the site
- Every form that collects a phone number has a consent checkbox: **unchecked by default, required**, with this EXACT text (do not paraphrase, shorten, or reflow into marketing copy):
  > "I agree to receive calls and text messages from PAIRDEN about this request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms of Service."
- `privacy.html` and `terms.html` are **ported word-for-word** from `reference/legacy/`. Never rewrite, summarize, or "modernize" legal pages. Only permitted edits: add "Pairden Technologies LLC" to the headers.
### Business address — SINGLE SOURCE OF TRUTH
> **41877 Enterprise Circle N., 2nd Floor, Temecula, CA 92590**

This address must always match **GHL's Business Profile** and the **A2P 10DLC registration**.
**Never change it in one place alone** — site, GHL, and the registration move together or the
campaign fails. It lives in exactly two forms on the site: the footer legal line (13 pages) and
the JSON-LD `PostalAddress` (3 pages). Those two must agree character for character; carriers
and Google both cross-check them.

**History:** the first A2P campaign was **rejected on Aug 3 2026** while the site carried the
previous address (32880 Earlsburn Circle, Menifee, CA 92584). The site was corrected to the
Temecula address before resubmission. The old address must appear nowhere in the repo.

**Service area is a different thing.** Body copy saying "Inland Empire" or "Southern California"
describes who PAIRDEN serves, not where it is registered. That copy stays.

### Footer legal line — A2P 10DLC REQUIRED (supersedes the Aug 3 "Southern California Based" wording)
Carriers re-scan the site during campaign review. Every page must carry this exact line,
small and muted, in the footer:

> `Pairden Technologies LLC · 41877 Enterprise Circle N., 2nd Floor, Temecula, CA 92590 · Admin@pairden.com · (951) 477-5918`

- Present on **all 13 pages** (12 original + `/text-us`), **in English on the Spanish pages too** —
  it is a legal-entity string, not marketing copy.
- The separate copyright line sits directly above it and reads exactly:
  `© 2026 PAIRDEN, a d/b/a of Pairden Technologies LLC`
  *(Updated Aug 3 2026. An earlier revision had the entity name on both lines, which rendered
  as a visible duplication. This wording states the d/b/a relationship once, above the legal
  address line. Settled — do not re-flag.)*
- **This reverses the Aug 3 "Southern California Based" footer.** That wording is gone.
  A2P compliance overrides the earlier positioning decision. Do not restore it.

### `/text-us` — registered opt-in URL, DO NOT REMOVE OR RENAME
`/text-us` is named in the A2P campaign registration as the SMS opt-in URL.
Removing, renaming, or redirecting it elsewhere can fail the registration.

- The page must contain **zero form elements** — no `<form>`, `<input>`, `<select>`, `<textarea>`.
- It must load **only** the LeadConnector widget (`data-widget-id="6a7244eca4347d15e390c25a"`).
- It must **not** load the site's own chat widget. The page has no chat markup, which is
  what keeps `site.js` from initialising it — do not add chat markup to this page.

### Organization schema — must match the footer
JSON-LD `PostalAddress` on `index.html`, `es/index.html`, and `frontdesk.html` carries:
```
"streetAddress":   "41877 Enterprise Circle N., 2nd Floor"
"addressLocality": "Temecula"
"addressRegion":   "CA"
"postalCode":      "92590"
"addressCountry":  "US"
```
Structured data and the visible footer must agree character for character.
`addressLocality` is also the strongest local-relevance signal Google reads — never strip it.

### Two phone numbers — they do NOT overwrite each other
- **(951) 477-5918** — **registered A2P business contact.** Footer legal line only, all 13 pages.
  **This number must always match GHL's Business Profile.** Changing it in one place and not the
  other can fail or invalidate the A2P 10DLC campaign. Never change it here without updating GHL
  in the same pass — and vice versa. It appears nowhere else on the site.
- **(951) 651-3966** — Vapi AI receptionist demo line (`tel:+19516513966`). All demo CTAs, hero,
  demo cards, contact blocks, CTA bands, every `tel:` link outside the footer, and the JSON-LD
  `telephone` field. **This one can change freely** — it carries no registration dependency.
- Retired, never reintroduce: (909) 415-8481 (superseded) and (840) 688-2967 (840 is not an
  assigned NANP area code, so it could not be dialed at all).
- Spanish pages use the Spanish consent line from BUILD-SPEC.md §ES exactly.
- The chatbot and free tools must never collect a phone number without the consent line. If a task seems to require it, stop and ask.

## Brand — new kit only
- Logos come only from `assets/brand/`. **Never** use anything from `reference/legacy/assets/` — those are the retired logos.
- Tokens: Deep Navy `#071A3D` · Electric Blue `#0A84FF` · Cyan Accent `#17C8F4` · Slate `#5D6B82` · Soft White `#F4F7FB` · page background `#040C1F`.
- Fonts: Space Grotesk (headings) · Inter (body) · JetBrains Mono (numbers, optional).
- Usage rules: white lockup on dark backgrounds; never stretch, rotate, recolor, outline, shadow, or rearrange logos; P icon (not full lockup) below 180px widths.

## Settled decisions — do NOT re-open these in future sessions
*Every line below was decided and ratified. Re-raising them wastes a session.*

- **Receptionist overage is $0.50/min** (raised from $0.40, Aug 3 2026). LOCKED pending the
  live call-cost matrix; the 3× margin bar is $0.167/min. **The Client Service Agreement still
  says $0.40 — Michael must update it before any client signs.**
- **Business address is 41877 Enterprise Circle N., 2nd Floor, Temecula, CA 92590.** LOCKED.
  Must always match GHL's Business Profile and the A2P registration. Never change alone.
- **Footer copyright:** `© 2026 PAIRDEN, a d/b/a of Pairden Technologies LLC`, sitting directly
  above the legal address line. Settled.
- **`company` field mapping approved.** `business_name` does not exist in GHL; the real field is
  `contact.company_name`. Do not revert or re-flag.
- **Make.com remains the form receiver. Never reroute the site.** The site POSTs to Make and
  only to Make. The GHL handoff happens *inside the Make scenario*, not in page JavaScript.
  Do not "simplify" this by posting directly to GHL — it breaks the pipeline silently.
- **`/book` and `/es/reservar` target calendar ID `qdwamJ3e9xLaooRS8t8g`**, ID-based URL only.
  Never a name slug — slugs break when a calendar is renamed. The previous calendar
  `GICmHjNXus2auxqe65re` was **deleted in GHL** and must never reappear.
- **`/text-us` is the registered A2P opt-in URL.** Never rename, remove, or redirect it.
- **The A2P brand was rejected for a legal-name-vs-EIN mismatch**, caused by IRS propagation
  lag on a newly issued EIN. The submission matched the CP 575 exactly. **This was NOT a website
  problem and NOT a consent-scope problem.** Resubmit ~30 days from EIN issuance.
  **Do not re-raise consent scope as a rejection cause.**

## Integrations — port exactly
- Lead form and chatbot POST to the Make.com webhook (URL in `reference/legacy/index.html`). Keep the payload keys byte-identical: `firstName, lastName, company, businessType, email, phone, services[], goal, budget, smsConsent, intentScore, honeypot, submittedAt`. Michael extends the Make scenario separately — the site must not break it.
- Keep the honeypot field (`hp_field`) and the intentScore function from legacy.
- CRM note: the `company` value maps to GHL's `contact.company_name`. A field called `business_name` **does not exist** in GHL — never introduce that name anywhere.
- **RATIFIED Aug 3 2026:** the lead form's input uses `name="company"`, not `name="business_name"`.
  Legacy shipped `name="business_name"`; that was wrong, since the real GHL field is
  `contact.company_name`. The visible label still reads "Business name" and the webhook payload
  key `company` is unchanged, so Make and GHL are unaffected. **This is settled — it is no longer
  a pending deviation. Do not revert it and do not re-flag it.**

## Architecture
- Pure static: HTML + one shared `styles.css` (CSS variables) + vanilla JS. No frameworks, no build step. Netlify publishes the repo root.
- English pages: `index, frontdesk, tools, faq, privacy, terms, 404`. Spanish mirrors under `/es/` per BUILD-SPEC.md.
- `netlify.toml` must retain the full `axismarketingai.net` 301 block from legacy, verbatim.

## Working rules (git & safety)
- Work on a branch per phase. **Never push to main; never deploy; never touch DNS, domains, Netlify settings, Stripe, phone numbers, or the Make scenario.** Prepare and hand off.
- A file that isn't committed doesn't exist. Every phase ends with: local preview checked, changed files listed, committed on the branch, one-paragraph summary Michael can paste into planning chat for review.
- Pause for Michael's approval before: deleting files, changing netlify.toml, or any edit to legal pages or consent text.
- If legacy content conflicts with a rule in this file (e.g., the SEO "3-month minimum"), this file wins — and say so out loud when it happens.
