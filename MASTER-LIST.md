# MASTER LIST — everything Michael must supply or decide

*Read this first. Then `PENDING-INPUTS.md` for detail, then `HANDOFF.md` for Jose.*
*Nothing here is a bug. These are values that could not be invented, verified, or decided during the build.*

---

## THE SITE AS IT STANDS

**12 pages, complete and styled.** 7 English (`index`, `frontdesk`, `tools`, `faq`, `privacy`, `terms`, `404`) and 5 Spanish (`es/index`, `es/frontdesk`, `es/faq`, `es/privacidad`, `es/terminos`), plus `styles.css`, `site.js`, `netlify.toml`, `robots.txt`, `sitemap.xml`.

**What is verified:** negative greps only — zero retired brand hexes, zero retired RGB triples, zero `business_name`, zero `"3-month"`, zero `cal.com`, zero legacy asset references, `axis` confined to `netlify.toml` where it belongs. Consent checkbox is `required` with no `checked` attribute on both EN and ES forms.

**What is NOT verified — and this is the important part:** every check above proves something bad is *absent*. **None of them prove anything correct is *present*.** A page with no pricing at all would pass all of them. The positive gate — do the right prices actually appear, is the consent line actually verbatim, does the LLC line exist on all 12 pages — has **not been run**. Neither has any browser render.

---

## 1 · DO THIS FIRST (two minutes, no thinking required)

```bash
cd ~/Desktop/pairden-site-v2-setup/marketing-site
git init && git add -A && git commit -m "Baseline: v2 site, phases 0-5"
```

Twelve pages currently have no version history. Until this runs, one bad edit is unrecoverable. Do it before anything else touches the folder.

---

## 2 · THE POSITIVE GATE (run it, read the output)

This is the check that never ran. Paste as one block:

```bash
cd ~/Desktop/pairden-site-v2-setup/marketing-site
echo "── 1. LOCKED PRICES ──"
grep -rn '\$147\|\$397\|\$997\|\$250\|\$500\|\$0\.40' --include=*.html . | head -40
echo "── 2. LOCAL SEO TERM ──"
grep -rn "6- or 12-month\|6 o 12 meses" --include=*.html .
echo "── 3. EN CONSENT ──"
grep -rn "Consent is not a condition of purchase" --include=*.html .
echo "── 4. ES CONSENT ──"
grep -rn "El consentimiento no es una condición" es/
echo "── 5. LLC LINE (must equal 12) ──"
grep -rln "Pairden Technologies LLC" --include=*.html . | wc -l
echo "── 6. MENIFEE ──"
grep -rln "Menifee" --include=*.html .
echo "── 7. TRIALS (must be ONLY missed-call, reviews, website chat) ──"
grep -rn "30-day trial\|Prueba de 30 días" --include=*.html .
```

**What correct output looks like:**
- **#1** — `$147`/`$397`/`$997` on `index.html`, `es/index.html`, `faq.html`, `es/faq.html`, `tools.html`. `$0.40` on those plus both frontdesk pages.
- **#2** — hits on `index.html`, `es/index.html`, `faq.html`, `es/faq.html`. **Zero hits anywhere is a failure.**
- **#3 / #4** — exactly one hit each, on `index.html` and `es/index.html`.
- **#5** — must print **12**. Anything less means a page is missing the LLC footer.
- **#6** — should list `index.html` and `es/index.html` (JSON-LD) plus every page's footer.
- **#7** — must appear on **exactly three** services: missed-call text-back, review engine, AI website chat. A fourth is a compliance problem.

---

## 3 · BLOCKERS ONLY YOU CAN CLEAR

### 🔴 A. `BOOKING_URL` — the calendar doesn't exist yet
**Seven dead CTAs.** Five on `frontdesk.html`, two on `es/frontdesk.html`, all reading `href="BOOKING_URL"`. They currently do nothing when clicked.

This is ~30 minutes in GHL to build the calendar, then one find-and-replace. Never restore the old cal.com/axis link — it's caught by the grep gate.

### 🔴 B. `reference/a2p-answer-kit.md` — missing file
`START-HERE.txt` step 4 flagged it and it was never found. It's the source for the **consent-scope decision**: keep the narrow *"…about this request"* or widen to *"…and our services."* The site ships narrow until you decide. Needed before A2P submission.

### 🔴 C. Spanish sign-off — the review gate was skipped
All five Spanish pages were written **without** the pre-review BUILD-SPEC required, because you asked for the full build in one day. Every word is unreviewed.

`es/privacidad.html` and `es/terminos.html` carry visible `[MICHAEL: verify]` banners naming English as controlling. **Those banners cannot go live.** Read the Spanish, then delete both banner elements.

---

## 4 · VERIFY BEFORE SHIP (I could not confirm these)

| # | Item | Why it needs you |
|---|---|---|
| D | **Social URLs** | I built all five from the `@pairdenai` handle in the spec. **LinkedIn is a genuine coin-flip** — I used `/company/pairdenai`, but `/in/` is equally plausible. Check all five resolve. |
| E | ~~Demo number~~ | ✅ **RESOLVED** — replaced with (909) 415-8481. See §4b. |
| F | **Individual service prices** | `$497/mo` Local SEO · `$197` booking · `$97` missed-call · `$147` reviews · `$97` chat · `$497` win-back. **None are in CLAUDE.md's locked list**, so they were ported unverified. These are public prices on a live page. |
| G | **FrontDesk setup fees** | `$250` / `$497` / `$997`. Monthly prices are locked and correct; setup fees came from legacy unverified. |
| H | **LLC header wording** | I used `Pairden Technologies LLC, d/b/a PAIRDEN` on the legal pages. Confirm that's the exact form you want. |

---

## 0 · KNOWN DEFECT (FIXED) — `position: fixed` silently overridden
### The single most consequential bug in this build. Do not reintroduce it.

**What shipped.** The visual elevation layer added a stacking rule in `styles.css`:

```css
/* Stacking order for real content */
.nav, .nav-mobile-menu, section, footer, .doc, .chat-panel,
.chat-bubble, .scroll-top-btn, .page-head, main { position: relative; z-index: 2; }
```

Five of those selectors — `.nav`, `.nav-mobile-menu`, `.chat-panel`, `.chat-bubble`,
`.scroll-top-btn` — were declared `position: fixed` earlier in the same file. **Equal
specificity (one class each), later rule wins.** Every fixed overlay on the site silently
became `position: relative`.

**What it broke.**
- **Mobile nav menu** — on a relative element `right` is ignored in LTR, so `left: 12px`
  shifted it 12px right at full body width. Constant 12px clipped off the right edge at
  every viewport (320 / 375 / 414). Looked "cut off and not centered."
- **Chat panel** — `right: 14px` shifted it *left* by 14px, clipping its left edge, and it
  dropped into document flow instead of anchoring to the viewport.
- **Sticky header** — `.nav` scrolled away with the page instead of pinning.
- **Phantom whitespace** — the chat panel is `opacity: 0` but was still in flow, adding up
  to ~520px of dead space to the bottom of **every page**. The bubble and scroll-top button
  joined the flow too.

**Why it survived two rounds of fixes.** Every symptom looked like a sizing problem, so the
attempted fixes were width tweaks — which cannot work, because width was never the cause.
It is also **invisible in source review**: both rules are individually correct and sit ~350
lines apart. Only a computed-style check on the rendered page reveals it.

**The fix** — narrow the selector to in-flow containers only:
```css
section, footer, .doc, .page-head, main { position: relative; z-index: 2; }
```
The rule existed to lift content above a film-grain overlay that has since been deleted. The
aurora sits at `z-index: -2`, so in-flow content needs no z-index bump to clear it. The rule
could arguably be removed outright.

**Verified after fix** (rendered pages, computed styles, not source):
`position: fixed` restored on all five · nav menu 12/12 margins at 320/375/414 · chat panel
fully on-screen at all three · zero horizontal overflow on all 13 pages · gap after footer
between −0.6px and +0.2px.

### 🚨 THE RULE FOR FUTURE SESSIONS
**Never add a fixed-position element to that selector list.** If a new overlay is added, do
not "fix" its stacking by appending it there — set its `z-index` on its own rule instead.
A warning comment sits above the selector in `styles.css`; leave it there.

**General lesson:** a shared `position:` declaration applied to a broad selector list can
silently overwrite positioning set elsewhere at equal specificity. When an overlay misbehaves,
**check its computed `position` before touching its width.**

---

## 4a · A2P REJECTION — CAUSE IS KNOWN. DO NOT RE-LITIGATE.

**Verbatim from TCR:**
> "The submitted legal company name does not match with US EIN."

**The submission matched the CP 575 exactly.** The root cause is **IRS propagation lag on a
newly issued EIN** — TCR's lookup had not yet picked up the registration. Nothing on the site
and nothing in the submission was wrong.

**Resubmission waits ~30 days from EIN issuance.** There is no site change that fixes this and
no site change that was ever required for it.

**This was NOT a consent-scope rejection.** Earlier sessions repeatedly speculated that the
narrow "…about this request" consent line might have caused it. **That speculation was wrong.**
Do not raise it again as a rejection cause. The consent-scope question (narrow vs. wider
wording) remains an open *product* decision tied to the missing `a2p-answer-kit.md` — but it is
unrelated to why the campaign was rejected.

---

## 4b · DECISIONS MADE — logged (Aug 3, 2026)

### Phone numbers — THREE numbers, three jobs, none overwriting another
| Number | Role | Where it lives |
|---|---|---|
| **(951) 477-5918** | Registered A2P business contact | Footer legal line ONLY, all 13 pages |
| **(951) 651-3966** | Vapi AI receptionist demo line | All demo CTAs, hero, demo cards, contact blocks, CTA bands, JSON-LD `telephone`, every `tel:` outside the footer |
| ~~(909) 415-8481~~ | superseded | retired |
| ~~(840) 688-2967~~ | never dialable — 840 is not an assigned NANP area code | retired |

**The footer number must always match GHL's Business Profile.** Changing one without
the other can fail the pending A2P 10DLC campaign. The demo line has no such
dependency and can change freely.

### Business address — CHANGED after A2P rejection (Aug 3, 2026)
`32880 Earlsburn Circle, Menifee, CA 92584` → **`41877 Enterprise Circle N., 2nd Floor, Temecula, CA 92590`**

The first A2P 10DLC campaign was **rejected**. The site was corrected to the Temecula
address before resubmission. Updated in both places that carry it: the footer legal line
(13 pages) and the JSON-LD `PostalAddress` (`index.html`, `es/index.html`, `frontdesk.html`,
where `addressLocality` also moved Menifee → Temecula).

**Must always match GHL Business Profile and the A2P registration. Never change in one
place alone.** Service-area copy ("Inland Empire", "Southern California") is unrelated and
deliberately unchanged.

### Receptionist overage — $0.40 → **$0.50/min** (Aug 3 2026)
**LOCKED PENDING VERIFICATION.** A live call-cost matrix runs separately; the 3× margin bar
is **$0.167/min**, so $0.50 clears it comfortably. Publish $0.50, but expect one more
revision once real per-minute costs land.

🔴 **The Client Service Agreement still says $0.40.** The site and the contract now disagree.
**Michael must update the CSA before any client signs** — a signed agreement at $0.40 is
enforceable at $0.40 regardless of what the website says. This is the highest-consequence
open item on this list.

**Where it lives on the site — 4 places, not 6:**
| File | Location |
|---|---|
| `index.html` | plan note under the package ladder |
| `es/index.html` | same |
| `frontdesk.html` | receptionist usage note under the tier grid |
| `es/frontdesk.html` | same |

It does **not** appear in any JSON-LD, in the FAQ pages, or in `tools.html`. An earlier note
in this file claimed 6 places including the FAQ answers; that was wrong.

### Location wording — SPLIT (option A, later superseded by the A2P footer)
**Visible footer** on all 12 pages: `Menifee, CA` → **`Southern California Based`**
**Organization JSON-LD**: `addressLocality: "Menifee"`, `addressRegion: "CA"` — **UNCHANGED**

**This deviates from CLAUDE.md**, which locks the footer as
`© 2026 Pairden Technologies LLC, d/b/a PAIRDEN · Menifee, CA`.
Michael approved the deviation explicitly on Aug 3, 2026.

**Why the split rather than removing Menifee outright:** `addressLocality` is the
strongest local-relevance signal in Organization schema. Stripping the city while
selling Local SEO would tell Google this is not a local business and likely cost
map-pack and "near me" ranking. Keeping it in structured data preserves that
signal and the verifiable address A2P/carrier registration expects, while every
human-visible surface reads Southern California.

**Note for Jose at cutover:** CLAUDE.md still specifies the Menifee footer.
Either update CLAUDE.md to match, or this reads as drift in a later audit.

---

## 5 · DECISIONS AWAITING YOUR YES

**I. `business_name` → `company`.** I changed the form input's `name` attribute. Required — CLAUDE.md bans that string and the grep gate scans for it, so a literal port would ship a guaranteed failure. **The webhook payload key `company` is untouched, so Make and GHL are unaffected.** Visible label still reads "Business name." Say the word if you want it reverted.

**J. The visual elevation layer — judge this, don't inherit it.** Aurora background, film grain, gradient card edges, pointer tilt, scroll progress, staggered reveals. **Written but never rendered.**

Two separate questions, and don't let them blur:

1. **Does it break?** Delete from `/* ═══ VISUAL ELEVATION LAYER` to the `Reduced motion` block in `styles.css` for a clean revert to plain.
2. **Does it fit the brand?** The guideline flyer is a flat system — defined palette, no ornament. Grain and a drifting aurora are a *different design language*. That may be an upgrade or it may be off-brand, but it is a real choice and it should be made deliberately, with the flyer open next to the screen. Effects are easy to fall in love with in the abstract.

**Performance matters more than usual here.** The buyer is a hauler opening this on a phone in a truck. The aurora animates a blurred full-viewport layer and the grain is a fixed overlay — both are cheap on a Mac and not necessarily cheap on a mid-range Android. If the browser pass shows any jank on mobile, cut the aurora animation first (`body::before { animation: none }`), then the grain.

**One rule breach was already found and fixed:** a `drop-shadow` glow had been applied to the PAIRDEN lockup in the CTA band. CLAUDE.md forbids shadowing the logo. It is removed; the band behind the lockup is lit instead. Worth checking the rest of the layer against the flyer with the same eye.

---

## 6 · STILL OUTSTANDING (not blockers, but not done)

- **Browser render at 375 / 768 / 1440** — never performed. No page has been displayed at any size.
- **Lighthouse** — never run. Target 90+ performance and SEO.
- **Form → Make round trip** — never tested end to end. Watch the scenario while submitting.
- **`?plan=` deep links** — logic written, never exercised. Test all three values.
- **Short links** `/growth` `/foundation` `/frontoffice` `/demo` — need a deploy preview to test.
- **OG card preview** — never checked on a real platform.

---

## 7 · NOT YOURS TO RUSH

**Nothing goes near Netlify until Jose knows.** The live site, repo, and domains are his lane; cutover runs through him regardless of how ready this is. `HANDOFF.md` §4 lays out both cutover options — merging into his existing repo is the recommended one, since it keeps the domains and the axis redirects exactly where they sit.
