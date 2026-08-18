/* ═══════════════════════════════════════════════════════════════════
   LEAD SUBMISSION — the single implementation.

   Extracted verbatim from the homepage's inline script so the audit
   form and the systems guide (now on more than one route) share ONE
   path to Make. Two copies of this would be the failure mode where
   leads quietly stop arriving on one page and nobody notices.

   The region was verified self-contained before moving: no DOM access,
   no identifiers from the surrounding closure. Behaviour is unchanged —
   this is a relocation, not a rewrite. Exposed on window so existing
   bare call sites resolve without edits.
   ═══════════════════════════════════════════════════════════════════ */
/* ── Make.com webhook — payload keys are contract-locked with the Make
   scenario. Lifted verbatim from the live homepage; do not rename. ── */
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/1tmq6r7nokdt6xhvehywqvdqxejqmuw9";

function calculateIntentScore({ services, goal, phone }) {
      let score = 40; // baseline

      // Package-fit signal (+0 to +25)
      const packageScores = {
        "Online Foundation": 8,
        "Growth Engine": 18,
        "AI Front Office": 25,
        "One individual service": 6
      };
      const primaryInterest = Array.isArray(services) ? services[0] : services;
      score += packageScores[primaryInterest] || 0;

      // Number of services selected (+0 to +15)
      const svcCount = Array.isArray(services) ? services.length : 0;
      score += Math.min(svcCount * 5, 15);

      // Filled out optional goal field (+5)
      if (goal && goal.trim().length > 10) score += 5;

      // Provided phone (+5)
      if (phone && phone.trim().length >= 7) score += 5;

      return Math.min(score, 100);
    }

    async function submitToMake({ firstName, lastName, company, businessType, email, phone, services, budget, goal, honeypot, smsConsent = false }) {
      if (!MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL === "YOUR_MAKE_WEBHOOK_URL") {
        console.warn("Make.com webhook not configured — form submission not sent.");
        return { ok: false, fallback: true };
      }
      const intentScore = calculateIntentScore({ services, goal, phone });
      try {
        const res = await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            company,
            businessType,
            email,
            phone,
            services: Array.isArray(services) ? services : [services].filter(Boolean),
            goal:     goal || "",
            budget:   budget || "",
            smsConsent: Boolean(smsConsent),
            intentScore,
            honeypot: honeypot || "",
            submittedAt: new Date().toISOString()
          })
        });
        return { ok: res.ok, intentScore };
      } catch (err) {
        console.error("Make.com webhook error:", err);
        return { ok: false };
      }
    }

window.MAKE_WEBHOOK_URL = MAKE_WEBHOOK_URL;
window.calculateIntentScore = calculateIntentScore;
window.submitToMake = submitToMake;
