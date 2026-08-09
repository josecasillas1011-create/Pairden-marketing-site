/* PAIRDEN — shared page behaviors (nav, reveal, scroll-top, smooth scroll, FAQ) */

// Hamburger menu
(function () {
  const btn  = document.getElementById("navHamburger");
  const menu = document.getElementById("navMobileMenu");
  if (!btn || !menu) return;
  function setMenu(open) {
    menu.classList.toggle("open", open);
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", open ? "false" : "true");
  }
  setMenu(false);
  btn.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      setMenu(false);
      btn.focus();
    }
  });
})();

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  });
});

// Auto-stagger reveals inside a group so cards cascade instead of popping together.
// MUST run BEFORE the reveal observer below — the observer snapshots .reveal
// elements once, so anything given the class afterwards is never observed and
// would stay stuck at opacity:0 forever.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const GROUPS = [
    ".services-row", ".package-grid", ".why-grid", ".problem-grid",
    ".include-grid", ".fit-grid", ".workflow-steps", ".reporting-strip",
    ".faq-list", ".receptionist-pricing-grid", ".steps-grid"
  ];
  GROUPS.forEach(sel => {
    document.querySelectorAll(sel).forEach(group => {
      [...group.children].forEach((child, i) => {
        if (!child.classList.contains("reveal")) child.classList.add("reveal");
        // Only set a delay if the markup didn't already choose one
        if (!/reveal-d\d/.test(child.className)) {
          child.style.transitionDelay = Math.min(i * 0.07, 0.42) + "s";
        }
      });
    });
  });
})();

// Reveal-on-scroll
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
})();

// Scroll-to-top
(function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

// ?plan= deep link — smooth-scroll to #plans, highlight the card, preselect in the form.
// Values: foundation | growth | frontoffice. Unknown values are a graceful no-op.
(function () {
  const params = new URLSearchParams(window.location.search);
  const plan = (params.get("plan") || "").toLowerCase().trim();
  if (!plan) return;

  const PLANS = {
    foundation:  { id: "plan-foundation",  label: "Online Foundation" },
    growth:      { id: "plan-growth",      label: "Growth Engine" },
    frontoffice: { id: "plan-frontoffice", label: "AI Front Office" }
  };
  const match = PLANS[plan];
  if (!match) return; // unknown value → no-op

  const card = document.getElementById(match.id);
  if (!card) return; // not on a page with the plan ladder → no-op

  card.classList.add("plan-highlight");

  const packageInterest = document.getElementById("packageInterest");
  if (packageInterest) packageInterest.value = match.label;

  // Wait a beat so reveal-on-scroll and fonts settle before scrolling.
  window.addEventListener("load", () => {
    setTimeout(() => {
      const plans = document.getElementById("plans");
      (plans || card).scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  });
})();

/* ═══════════════════════════════════════════════════════════════
   Motion layer — everything below degrades gracefully and is
   fully disabled when the user prefers reduced motion.
   ═══════════════════════════════════════════════════════════════ */
const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll progress bar
(function () {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${pct})`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

// Nav solidifies once you leave the hero
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  let ticking = false;
  function update() {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

// Count-up for any [data-count] element (opt-in via markup)
(function () {
  const targets = document.querySelectorAll("[data-count]");
  if (!targets.length) return;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach(el => { el.textContent = el.dataset.count; });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const end = parseFloat(el.dataset.count) || 0;
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(end * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.4 });
  targets.forEach(el => io.observe(el));
})();

// FAQ accordion
document.querySelectorAll(".faq-q").forEach((btn, index) => {
  const item = btn.closest(".faq-item");
  const answer = item && item.querySelector(".faq-a");
  if (!item || !answer) return;
  const answerId = answer.id || `faq-answer-${index + 1}`;
  answer.id = answerId;
  btn.setAttribute("aria-controls", answerId);
  btn.setAttribute("aria-expanded", "false");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(openItem => {
      openItem.classList.remove("open");
      const openButton = openItem.querySelector(".faq-q");
      if (openButton) openButton.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});
