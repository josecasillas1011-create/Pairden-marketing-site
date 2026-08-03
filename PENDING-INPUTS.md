# PENDING-INPUTS.md — things Michael supplies before ship

*Running list. Claude Code appends to this as it hits blockers; Michael answers them in one pass at the end.*
*Nothing in here is a bug — these are values that could not be invented, verified, or decided during the build.*

**Status key:** 🔴 blocks ship · 🟡 verify before ship · 🟢 decision only

---

## 🔴 1. `BOOKING_URL` — Pairden GHL calendar link
**Needed by:** Phase 2 (`frontdesk.html`)
**Where it lands:** all five booking CTAs on the FrontDesk page.
Site ships with the literal string `BOOKING_URL` as a visible placeholder until supplied.
**Never** the old cal.com or axis link — those are banned by the Phase 5 grep gate.

## 🔴 2. `reference/a2p-answer-kit.md` — missing file
**Needed by:** Phase 4 / Phase 5
`BUILD-SPEC.md` points at this file for the **consent-scope decision**:
keep the narrow line *"…about this request"* vs. widen to *"…and our services."*
`START-HERE.txt` step 4 flagged it as missing and could not find it.
Site ships with the current **narrow** line until decided.

## 🔴 3. Spanish copy sign-off — **REVIEW GATE WAS SKIPPED**
**Status:** all 5 Spanish pages are already written and live in `/es/`

BUILD-SPEC Phase 4 required presenting the Spanish copy for approval *before* writing files.
**That gate was skipped** at Michael's explicit instruction to complete the whole build in one day.
The copy was written and flagged instead of held back.

**What this means:** every word of Spanish on the site is unreviewed. It is natural
Mexican-Spanish business register, not literal word-swaps, and package names
(Online Foundation / Growth Engine / AI Front Office), prices, and PAIRDEN are kept in English
as required — but **none of it has been read by a human who speaks Spanish.**

- `es/privacidad.html` and `es/terminos.html` carry a visible `[MICHAEL: verify]` banner
  at the top of the page and name the English version as controlling.
- The Spanish consent line matches the exact wording in BUILD-SPEC §ES.
- **Still needs cross-check against `a2p-answer-kit.md` (item 2) before ship.**

---

## 🟡 4. Social profile URLs — **guessed, not confirmed**
**Where:** footer social row on `index.html` (live now)
BUILD-SPEC says the social row points at `@pairdenai`. I built the URLs from that handle:

| Network | URL used |
|---|---|
| Instagram | `https://instagram.com/pairdenai` |
| Facebook | `https://facebook.com/pairdenai` |
| X | `https://x.com/pairdenai` |
| TikTok | `https://tiktok.com/@pairdenai` |
| LinkedIn | `https://linkedin.com/company/pairdenai` |

**Confirm each profile actually exists at that exact URL.** LinkedIn especially —
`/company/` vs. `/in/` is a real fork and I picked `/company/`.

## 🟡 5. Demo phone number — (840) 688-2967
**Where:** hero CTA, contact block, CTA band, footer on `index.html`; ~10 more times on `frontdesk.html` in Phase 2
Carried verbatim from legacy (`tel:+18406882967`). **Confirm the line is still live and still the right demo number** before ship.

## 🟡 6. Individual service prices — ported unverified
**Where:** service detail panels on `index.html`
These are **not** in CLAUDE.md's locked pricing list, so they were ported from legacy as-is
rather than checked against a source of truth:

| Service | Price shown |
|---|---|
| Local SEO | `$497/mo` |
| Booking + Reminders | `$197/mo` |
| Missed-Call Text-Back | `$97/mo` |
| Review Engine | `$147/mo` |
| AI Website Chat | `$97/mo` |
| Customer Win-Back | `$497 one-time` |
| Website + Google Presence | `From $147/mo` |
| AI Receptionist | `Plans from $197/mo` |

**These are public-facing prices on the live site — worth a direct look.**

## 🟡 7. LLC header line — exact wording
**Needed by:** Phase 2 (`privacy.html`, `terms.html`)
CLAUDE.md permits exactly one edit to the verbatim legal ports: adding
"Pairden Technologies LLC" to the headers. **Confirm the exact sentence/placement**
before those files are written — no other change is allowed.

---

## 🟢 8. `business_name` → `company` — needs ratification
**Status:** already changed on `index.html`, awaiting sign-off
Legacy had `<input id="company" name="business_name" ...>`. CLAUDE.md bans the string
`business_name` outright (it is not a real GHL field) and the Phase 5 grep gate scans for it,
so a literal port would ship a guaranteed gate failure.

**What changed:** the HTML `name` attribute only — `name="business_name"` → `name="company"`.
**What did NOT change:** the visible label ("Business name"), `id="company"`, and the
webhook payload key `company`. **Make.com and GHL are unaffected.**

---

## Resolved during the build (no action needed — logged for the record)

- **Local SEO term conflict.** Legacy `index.html:789` had `pills: ["$497/mo", "3-month minimum"]`.
  CLAUDE.md locks Local SEO to **6- or 12-month terms only**. Fixed to `"6- or 12-month terms"`.
  This was the Session 0 gate conflict.
- **EN ⇄ ES toggle** is live in the nav and points at `/es/`, which **404s until Phase 4 builds it.**
  Expected, not a bug.

---

## 🟡 9. No git repository — nothing is version-controlled
**Status:** the whole site exists as plain files with no history

`git init` was declined during the build, so there are no commits, no branches, and no diffs.
CLAUDE.md's rule *"a file that isn't committed doesn't exist"* was not satisfiable, and the
per-phase branch workflow in BUILD-SPEC never happened.

**Consequence:** there is no rollback. An accidental overwrite loses work permanently, and
Jose receives a codebase with no history explaining any of it.
**Recommended:** `git init` plus one baseline commit before any further editing.

## 🟡 10. Nothing has been opened in a browser
**Status:** the site is verified by static inspection and grep only

No local preview server ran, no page was rendered, and no breakpoint was checked.
The responsive CSS is ported from the legacy site (which was tested in production),
but **v2 itself has never been displayed.** The Phase 5 visual QA — every page at
375px / 768px / 1440px, nav, accordions, tiles, chat, scroll-top — is still outstanding,
along with Lighthouse and the OG preview check.

---

## Never Claude Code's job — always Michael's
Pushing to main · deploying · Netlify/DNS/domain settings · the Make scenario ·
buying anything · Stripe · A2P submission · sending anything to Jose or a client.
