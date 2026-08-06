# HANDOFF — PAIRDEN SITE V2 → JOSE
**From:** Michael · **Date:** Aug 5, 2026
**Live preview:** https://curious-kulfi-dcaa51.netlify.app
**Repo:** `~/Desktop/pairden-site-v2-setup/marketing-site/` · branch `session-2-wiring`

---

## 1. WHAT THIS IS

V2 of the marketing site, built in a parallel repo using your V1 as read-only reference. Your structure and page skeleton were kept — they convert. What changed is the brand, the business address, the phone numbers, the A2P setup, and a long list of bugs.

**This is not a redesign.** Legal pages, consent language, the Make webhook, the honeypot, the intentScore function, and the axismarketingai.net 301 block are all ported byte-identical from your V1.

**You own cutover.** Nothing here has touched Netlify, DNS, GHL, Make, or Vapi.

---

## 2. WHAT CHANGED VS V1

### Fixed (these were broken or wrong on V1)
| Item | Was | Now |
|---|---|---|
| Local SEO terms | "3-month minimum" | **"6- or 12-month terms"** — the 3-month version isn't in the contract |
| Booking CTAs | `cal.com/jose-c-upt1mi/axis-setup` (×5) | `/book` → GHL Discovery Call calendar |
| Demo number | (840) 688-2967 — **unassigned area code, could not connect** | (951) 651-3966 |
| Legal entity | absent from every page | Full legal footer line on all 13 pages |
| Receptionist trial | "capped 14-day trial" in 4 places incl. FAQ JSON-LD | removed — no advertised trial on the receptionist |
| Receptionist overage | $0.40/min | **$0.50/min** |

### Added
- **`/text-us`** — LeadConnector chat page, zero form elements. This is the **registered A2P opt-in URL.**
- New brand: Deep Navy `#071A3D`, Electric Blue `#0A84FF`, Cyan `#17C8F4`, Soft White `#F4F7FB`, page bg `#040C1F`. New logo kit with transparent cuts, favicons, and a composed 1200×630 OG card.
- Business address: **41877 Enterprise Circle N., 2nd Floor, Temecula, CA 92590** (Regus) — in the footer and in the Organization JSON-LD, character-for-character identical.
- Business type field is now a free-text input with a datalist, so prospects aren't excluded by a fixed industry list.
- "Book a Call" secondary CTA under each of the three plan cards.
- Deep links: `/growth`, `/foundation`, `/frontoffice`, `/demo`, `/book`.

### Held back
Five Spanish pages (`es/index`, `es/frontdesk`, `es/faq`, `es/privacidad`, `es/terminos`) are **built but not launching.** No native speaker has reviewed them, and the legal pages carry visible `[MICHAEL: verify]` banners. They're excluded four ways: out of sitemap, hreflang stripped, nav toggle hidden, robots + `X-Robots-Tag` noindex. The deploy script also deletes `/es/` outright, which is the real guarantee.

---

## 3. HARD CONSTRAINTS — DO NOT BREAK THESE

**A2P.** The 10DLC brand was rejected on Aug 4 for a name/EIN mismatch — root cause is IRS propagation lag on a newly issued EIN, not a website problem. Resubmission is planned ~30 days from EIN issuance. Three things must stay exactly as they are:

1. **`/text-us` must remain reachable at that exact path.** It's the registered opt-in URL. Never rename, never remove.
2. **The footer legal line must stay on all 13 pages, unchanged**, and must always match GHL's Business Profile. Never change it in one place alone.
3. **Consent language is verbatim CTIA text.** Don't paraphrase, shorten, or reflow it. Privacy §3 contains the no-third-party-sharing-of-mobile-data clause carriers check for.

**Phone numbers — three, with separate jobs:**
- **(951) 477-5918** — registered business contact. Footer legal line on all 13 pages, plus the "Office" line on the two FrontDesk contact cards. **Nowhere else.**
- **(951) 651-3966** — Vapi AI receptionist demo line. All demo CTAs, hero, demo cards, CTA bands, tel: links, JSON-LD `telephone`.
- Zero references to the retired (840) 688-2967 or (909) 415-8481 remain. Please keep it that way.

**Form routing.** The audit form and chatbot POST to the existing Make webhook with the 13-key payload unchanged (`firstName, lastName, company, businessType, email, phone, services[], goal, budget, smsConsent, intentScore, honeypot, submittedAt`). The GHL handoff belongs **inside Make**, not in the site. Don't reroute the page.

**GHL field mapping.** `company` maps to `contact.company_name`. A field called `business_name` **does not exist in GHL** — confirmed live. Don't introduce that string anywhere.

**Locked pricing.** Online Foundation $250/$147 · Growth Engine $500/$397 · AI Front Office $997/$997. Setup waived at 6 months (12 for AI Front Office). Monthly is never discounted. 30-day trials on exactly three services: missed-call text-back, review engine, website chat. FrontDesk tiers $197/$397/$797 with setup $250/$497/$997.

**`netlify.toml` blocks that must survive:** the axismarketingai.net 301s (ported verbatim from your V1), the legacy filename 301s, the `.md` doc guards, and the `/book` → `qdwamJ3e9xLaooRS8t8g` redirect.

---

## 4. CUTOVER — TWO OPTIONS

**Option A — merge into your existing repo. Recommended.**
Keeps pairden.com, DNS, SSL, the axis redirects, and your deploy pipeline exactly where they are. Nothing to reassign. Bring the V2 files in, review the diff, push.

**Option B — new Netlify site, move the domains.**
`netlify.toml` already carries the full axis redirect block, so nothing is lost — but you'd be reassigning pairden.com and axismarketingai.net, and re-issuing SSL.

Either way, publish directory is the repo root. `reference/` and all `.md` files are gitignored or blocked; they must never deploy.

---

## 5. OPEN ITEMS

| Item | Owner | Notes |
|---|---|---|
| **Form → Make round trip untested** | Michael | Payload verified by source inspection only. One real submission needs to land in the scenario. This is the last unverified path in the system. |
| Vapi margin test — actual cost/min | Jose | 3× bar is $0.167/min against the $0.50 overage |
| Make → GHL module | Jose | The site posts to Make; the CRM handoff happens there |
| CSA still says $0.40 | Michael | Contract exposure before the next signature |
| Spanish native review | Michael | 5 pages incl. 2 legal docs |
| A2P resubmission | Michael | ~30 days from EIN issuance |
| Vapi account ownership | Both | Whose account holds client numbers long-term |

**Please don't publish the site and resubmit A2P in the same motion.** If the brand fails again, we need to isolate which variable caused it.

---

## 6. VERIFIED BEFORE HANDOFF

Rendered and measured at 320 / 375 / 414px across all 13 pages: zero horizontal overflow, `scrollWidth === clientWidth` everywhere, no phantom whitespace, all overlays fully on-screen, sticky header working, 45 eyebrow headings audited. Booking CTA confirmed landing on the Discovery Call calendar with correct availability rules. Demo line confirmed answering and booking correctly. Positive grep gate passed on prices, consent text, legal line, trials, and phone-number placement.

**One notable bug worth knowing about** (logged as MASTER-LIST §0): a stacking rule listed `.nav`, `.nav-mobile-menu`, `.chat-panel`, `.chat-bubble`, and `.scroll-top-btn` with `position: relative`, silently overriding their `position: fixed` at equal specificity. It broke every overlay, the sticky header, and added dead space to every page bottom — and was invisible in source review. Fixed, but easy to reintroduce if that selector list grows.

---

*Questions → Michael. Repo docs: `CLAUDE.md` (locked rules), `MASTER-LIST.md` (decision log), `PENDING-INPUTS.md` (open checklist).*
