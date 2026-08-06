# PENDING-INPUTS.md — what's still open

*Updated Aug 3, 2026 (end of Session 2). Resolved items moved to the bottom for the record.*
*Nothing here is a bug — these are values or decisions that still need Michael.*

**Status key:** 🔴 blocks ship · 🟡 verify before ship · 🟢 decision only

---

## 🟡 1. `reference/a2p-answer-kit.md` — missing file
**Needed by:** the consent-scope product decision — **NOT** by the A2P resubmission.
`START-HERE.txt` step 4 flagged it and it was never found. It is the source for deciding
whether to keep the narrow *"…about this request"* consent line or widen it to
*"…and our services."* The site ships with the narrow line until you decide.

**This did not cause the A2P rejection.** TCR's stated reason was an EIN/legal-name
mismatch caused by IRS propagation lag — see `MASTER-LIST.md` §4a. Downgraded from
blocker to verify-before-ship accordingly.

## 🔴 2. Spanish copy sign-off — review gate was skipped
All five Spanish pages were written **without** the pre-review BUILD-SPEC required,
because the full build was compressed into one day. Every word is still unreviewed.

- `es/privacidad.html` and `es/terminos.html` carry visible `[MICHAEL: verify]` banners
  naming the English as controlling. **Those banners cannot go live.**
- The Spanish consent line matches BUILD-SPEC §ES exactly.
- Cross-check against the a2p kit (item 1) before ship.

## 🔴 3. Spanish homepage has no chat widget
`index.html` has the guided chat widget; `es/index.html` **does not** — the feature was
never built for Spanish. This is what the phone-instance count difference (5 vs 4) actually
measures: the fifth English instance is the chatbot's `tel:` handoff.

BUILD-SPEC Phase 1 §10 specifies the widget and Phase 4 calls `/es/` a mirror, so this is a
genuine gap, not a stylistic choice. Building it means ~150 lines of new **unreviewed Spanish
copy** and a new A2P surface — the widget must collect name/company/email only, never a phone.
**Decision needed: build it, or ship without and log the asymmetry.**

---

## 🟡 3b. Form → Make webhook — NEVER TESTED END TO END
**Verified by static source inspection only. No submission has ever been sent.**

Confirmed by reading the source: the webhook URL is present and identical in `index.html` and
`es/index.html`, all 13 payload keys are constructed and unchanged, the `hp_field` honeypot is
intact, and `calculateIntentScore()` is unmodified. **That proves the code is correct. It does
not prove the pipeline works.**

Untested and unknowable without a real submission:
- whether the Make scenario still accepts this payload shape
- whether the webhook URL is still live
- whether `intentScore` lands where the scenario expects it
- whether the chatbot's separate submit (name/company/email, `smsConsent: false`) is handled

**How to close this:** open the Make scenario, submit the audit form once from the deploy
preview, and confirm the run appears with all 13 keys populated. Until then, treat lead capture
as unproven — a silent failure here loses leads with no visible error on the page.

## 🟡 4. Social profile URLs — guessed, never confirmed
Built from the `@pairdenai` handle in the spec. Present in the footer of 7 pages.

| Network | URL used |
|---|---|
| Instagram | `https://instagram.com/pairdenai` |
| Facebook | `https://facebook.com/pairdenai` |
| X | `https://x.com/pairdenai` |
| TikTok | `https://tiktok.com/@pairdenai` |
| LinkedIn | `https://linkedin.com/company/pairdenai` |

✅ **RESOLVED Aug 3 2026** — Michael supplied the verified URLs. LinkedIn was indeed wrong:
the guess was `/company/pairdenai`, the real profile is `/in/pairden-ai-659501426/`.
All five corrected across 8 footers.

## 🟡 5. LLC header wording on legal pages
Currently `Pairden Technologies LLC, d/b/a PAIRDEN` in the meta line of `privacy.html`
and `terms.html`. Confirm that exact form is what you want on legal documents.

---

## ✅ 6. `business_name` → `company` — RATIFIED Aug 3 2026
Confirmed correct: `business_name` does not exist in GHL; the real field is
`contact.company_name`. Closed — no longer a pending deviation.

## 🟢 7. Spanish visitors are sent to the English `/tools`
All five Spanish pages link to `/tools` in the footer as "Herramientas Gratis".
No Spanish tools page exists — BUILD-SPEC Phase 4 doesn't list one. Options: remove the
link from Spanish footers, leave it, or build `es/tools.html` (~45 min, out of current scope).

---

## ✅ RESOLVED — kept for the record

- **`BOOKING_URL`** → wired to `/book` (EN, 5 CTAs) and `/es/reservar` (ES, 5 CTAs),
  both 302-redirecting to the GHL calendar via `netlify.toml`. No page hardcodes the
  vendor URL, so the calendar can move in one edit. *(Session 2, Checkpoint 1)*
- **Demo phone number** → `(951) 651-3966` / `tel:+19516513966` (Vapi receptionist demo).
  Superseded (909) 415-8481; before that (840) 688-2967, which could not be dialed at all
  since 840 is not an assigned NANP area code. Kept strictly separate from the registered
  A2P business contact **(951) 477-5918**, which lives in the footer legal line only.
- **À la carte prices** → verified against the Master Brain and now locked in CLAUDE.md.
  No longer an open question.
- **FrontDesk setup fees** ($250 / $497 / $997) → confirmed correct, part of the locked list.
- **Location wording** → visible footer reads "Southern California Based" on all 12 pages;
  JSON-LD keeps `addressLocality: "Menifee"`. Approved Aug 3.
- **Receptionist 14-day trial** → removed from all 4 places it appeared, including the
  FAQPage JSON-LD. Deliberately omitted pending attorney review; noted in CLAUDE.md.
- **Git version control** → baseline commit plus `session-2-wiring` branch.
- **Browser render** → performed in Session 2; four bugs found and fixed
  (invisible gradient headlines, blank step numbers, invisible FrontDesk FAQ, trial copy).

---

## Never Claude Code's job — always Michael's
Pushing to main · deploying · Netlify/DNS/domain settings · the Make scenario ·
buying anything · Stripe · A2P submission · sending anything to Jose or a client.
