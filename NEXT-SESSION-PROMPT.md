# NEXT SESSION — paste this into Claude Code

*Run the two commands in MASTER-LIST §1 and §2 first (git baseline, then the positive gate). Paste their output in with this prompt.*

---

```
Read MASTER-LIST.md, then CLAUDE.md, then BUILD-SPEC.md.

Here is the output of the positive grep gate:
[PASTE THE OUTPUT HERE]

Work in this order and stop at any point where a locked rule is at risk:

1. VERIFY THE GATE
   Check the output above against CLAUDE.md's locked rules. Confirm explicitly:
   - all three plan prices exact, and the $0.40 overage
   - Local SEO reads "6- or 12-month terms" — never "3-month"
   - the A2P consent sentence is verbatim in EN and the spec line in ES
   - the LLC line count is exactly 12
   - 30-day trials appear on exactly three services and no others
   Tell me every check that FAILS. Do not fix anything yet — report first.

2. BROWSER RENDER
   Start a local preview server and open every page at 375px, 768px, and
   1440px. I am approving that server now, so do not stop to ask.
   Report what actually breaks, with the page and the width. Pay closest
   attention to the VISUAL ELEVATION LAYER at the bottom of styles.css —
   it has never been rendered. If it breaks layout anywhere, tell me before
   fixing, since deleting that whole block is a clean revert.

3. FILL IN MY ANSWERS
   BOOKING_URL:            [PASTE OR WRITE "still pending"]
   LinkedIn URL:           [/company/pairdenai OR /in/pairdenai OR correct one]
   Other socials correct?  [yes / list corrections]
   Demo number still live? [yes / new number]
   Service prices OK?      [yes / list corrections — $497 SEO, $197 booking,
                            $97 missed-call, $147 reviews, $97 chat, $497 win-back]
   FrontDesk setup fees?   [yes / corrections — $250 / $497 / $997]
   LLC header wording:     [confirm "Pairden Technologies LLC, d/b/a PAIRDEN"]
   business_name→company:  [approved / revert]
   Spanish copy:           [approved — remove the [MICHAEL: verify] banners /
                            changes needed]

   Apply every answer I gave. For anything I left pending, leave the
   placeholder exactly as it is and list it back to me at the end.

4. COMMIT
   Commit after each of steps 1-3 separately so I can see what changed and roll
   back one piece without losing the others. Never push to main.

5. CLOSE OUT
   Update MASTER-LIST.md and PENDING-INPUTS.md to strike what is now resolved,
   then give me a short summary I can paste into the planning chat, plus the
   list of anything still blocking ship.

Do not deploy, do not touch Netlify, DNS, Stripe, or the Make scenario, and do
not send anything to Jose. Those are mine.
```

---

## If you only have five minutes

```
Read MASTER-LIST.md. Start a local preview server — I approve it, don't ask —
and open every page at 375px and 1440px. Tell me only what is visibly broken,
worst first. The VISUAL ELEVATION LAYER at the bottom of styles.css has never
been rendered and is the most likely culprit.
```
