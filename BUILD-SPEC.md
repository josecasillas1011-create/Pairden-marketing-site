# BUILD-SPEC.md — Pairden Site v2 — Phases & Requirements (v1.0, Aug 2 2026)
*Read together with CLAUDE.md (rules always win). Companion context: `website-audit-and-rebuild-spec.md` explains WHY each requirement exists.*

## Repo layout (target)
```
/                     index.html, frontdesk.html, tools.html, faq.html,
                      privacy.html, terms.html, 404.html
/es/                  index.html, frontdesk.html, faq.html, privacidad.html, terminos.html
/assets/brand/        new logo kit + derived cuts (icon, lockups, favicons, og-card)
/styles.css  /site.js  /netlify.toml  /robots.txt  /sitemap.xml
/reference/legacy/    the old site (read-only source for ported content — never shipped)
```

---

## PHASE 0 — Scaffold & assets
1. Git init, `.gitignore` (macOS junk, `reference/` optional), commit empty scaffold.
2. Confirm `reference/legacy/` contains the old site (Michael supplies the unzipped folder).
3. Asset prep in `assets/brand/` from the new kit: transparent P-icon; tight horizontal lockup crops (dark-bg and light-bg versions); favicon set (32/180/512 + `favicon.ico`); `og-card.png` at exactly 1200×630 cropped from the desktop-background render. If Michael supplies a pre-cut pack, use it as-is.
4. `styles.css` started: token block only (colors from CLAUDE.md, fonts, radii, glass surfaces). Port structural/utility CSS patterns from legacy where useful — recolored to new tokens, never old hexes (`#139DFF`, `#39C7FF`, `#020711`, `#006EE6` must appear nowhere in v2).

## PHASE 1 — index.html (English)
Keep the legacy page skeleton — it converts. Sections in order:
1. **Nav**: logo, Home / Services / Plans / AI Front Desk / FAQ / Contact, EN⇄ES toggle, `Get Free Audit →` CTA. Mobile hamburger.
2. **Hero**: "More Calls Answered. More Jobs Booked." + subline; CTAs `Get a Free Systems Audit →` and `Call the Live AI Demo` (tel: from legacy); trust row (built for local services · English & Spanish · live within a week).
3. **Services** (8 tiles, expandable detail panel — port copy from legacy, fix the Local SEO pill to "6- or 12-month terms"): Website + Google Presence · Booking + Reminders · Missed-Call Text-Back · Review Engine · AI Receptionist · Local SEO · AI Website Chat · Customer Win-Back.
4. **Plans**: three cards per CLAUDE.md pricing, Growth Engine marked "Most popular", minutes/overage note, reporting strip.
5. **How It Works**: Find the Leak → Connect the System → Go Live & Measure.
6. **Why PAIRDEN**: six cards from legacy (incl. English & Spanish, Human Handoff Rules).
7. **Contact / audit form**: fields + validation + honeypot + consent checkbox + Make webhook submit + intentScore — all ported from legacy exactly. Success and error states.
8. **CTA band**: "Call the AI Receptionist. Try to Stump It." + demo number.
9. **Footer**: services/company link columns, social row (Instagram, Facebook, X, TikTok, LinkedIn → @pairdenai), legal links, LLC + Menifee line.
10. Chat widget: port the guided flow from legacy (collects name/company/email only — no phone).
11. Head: title, meta description, canonical, OG/Twitter cards pointing at new og-card, Organization JSON-LD with Menifee address, theme-color `#040C1F`.

## PHASE 2 — Inner pages (English)
- **frontdesk.html**: port structure and copy; three receptionist tiers per CLAUDE.md; **all five booking CTAs point to `BOOKING_URL` placeholder** — Michael supplies the Pairden GHL calendar link before ship (never the old cal.com/axis link).
- **faq.html**, **tools.html** (three calculators, no PII beyond what legacy collects), **404.html**: port and rebrand.
- **privacy.html / terms.html**: verbatim port + LLC header line (see CLAUDE.md).

## PHASE 3 — Wiring & conversion
1. **Deep links**: on `index`, read `?plan=` → values `foundation | growth | frontoffice` → smooth-scroll to #plans, add a highlight class to that card, preselect it in the form's package dropdown. Graceful no-op for unknown values.
2. **netlify.toml**: publish "."; clean-URL 200 rewrites for all pages (EN + ES); the verbatim axismarketingai.net 301 block from legacy; legacy old-filename 301s; short links:
   `/growth → /?plan=growth` · `/foundation → /?plan=foundation` · `/frontoffice → /?plan=frontoffice` · `/demo → /frontdesk` (302s are fine).
3. **sitemap.xml** (EN now, ES added in Phase 4), **robots.txt**, security headers block from legacy.

## PHASE 4 — Spanish (/es/)
- Mirror pages: `es/index.html`, `es/frontdesk.html`, `es/faq.html`, `es/privacidad.html`, `es/terminos.html`. `<html lang="es">`; reciprocal `hreflang` (`en`, `es`, `x-default`) on every EN/ES pair; nav toggle links each page to its twin.
- Translation quality: natural Mexican-Spanish business register, not literal word-swaps. **Prices, package names (Online Foundation / Growth Engine / AI Front Office), and PAIRDEN stay in English.** Michael reviews all Spanish copy before commit.
- **Spanish consent line (exact — Michael verifies against a2p-answer-kit.md before ship):**
  > "Acepto recibir llamadas y mensajes de texto de PAIRDEN sobre esta solicitud. La frecuencia de los mensajes varía. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para cancelar o AYUDA para obtener ayuda. El consentimiento no es una condición de compra. Consulte nuestra Política de Privacidad y Términos de Servicio."
- Legal pages: translated from the ported English versions, flagged `[MICHAEL: verify]` at the top until reviewed.
- Add ES URLs to sitemap + ES clean-URL redirects.

## PHASE 5 — QA & handoff
- Every page at 375px / 768px / 1440px; nav, accordions, tiles, chat, scroll-top all work.
- Form test: valid submit reaches the Make webhook (Michael watches the scenario); invalid states render; honeypot filled = handled.
- `?plan=` all three values; every short link; every footer link; tel: links.
- Grep gate: zero hits for old hexes, `business_name`, "3-month", "axis", cal.com.
- Consent checkbox present + unchecked on every phone-collecting form (EN and ES).
- Lighthouse pass (target 90+ perf/SEO); OG preview check.
- Output `HANDOFF.md` for Jose: what changed vs. legacy, cutover options —
  **A)** merge v2 into his existing repo/Netlify site (keeps domains + axis redirects in place, recommended), or
  **B)** new Netlify site → move `pairden.com` and `axismarketingai.net` assignments (redirect block already in our netlify.toml).

## Open placeholders (Michael supplies before ship)
- `BOOKING_URL` — Pairden GHL calendar link (replaces cal.com/axis everywhere).
- Consent scope decision: keep "about this request" vs. widen to "…and our services" (check a2p-answer-kit.md). Site ships with the current narrow line until decided.
- Spanish copy sign-off + a2p kit cross-check.
