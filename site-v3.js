/* PAIRDEN V3 — shared page behaviours
   Reveals · call-log sequence · FAQ · nav · sticky mobile CTA.
   Per-page calculator logic stays inline (it is data-derived). */

/* Scroll-linked background depth.
   Publishes --scroll (0→1) on <html> for the body::after veil in
   v3.css. rAF-throttled, and the handler performs NO layout reads —
   scrollY and innerHeight are cheap, scrollHeight is read once on
   resize — so this cannot cause scroll-jank. Reduced motion opts out
   entirely and leaves the veil at its static value. */
(function () {
  var root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var max = 1, ticking = false;
  function measure() { max = Math.max(1, root.scrollHeight - window.innerHeight); }
  function apply() {
    ticking = false;
    var p = window.scrollY / max;
    root.style.setProperty('--scroll', (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(3));
  }
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(apply); }
  measure(); apply();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
})();

/* In-page nav — marks the section you are in.
   IntersectionObserver, not a scroll handler: rAF does not fire in a
   backgrounded pane and a scroll listener would need throttling with a
   trailing call to be correct (see the guide launcher). IO has neither
   problem. No-ops on every page that has no .page-nav. */
(function () {
  var bar = document.querySelector('.page-nav');
  if (!bar || !('IntersectionObserver' in window)) return;
  var links = [].slice.call(bar.querySelectorAll('a[href^="#"]'));
  var map = {};
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) map[el.id] = a;
  });
  var ids = Object.keys(map);
  if (!ids.length) return;
  var cs = getComputedStyle(document.documentElement);
  var navH = parseInt(cs.getPropertyValue('--nav-h')) || 78;
  var subH = parseInt(cs.getPropertyValue('--subnav-h')) || 52;
  var barsPx = navH + subH + 8;
  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    var current = null;
    ids.forEach(function (id) { if (visible[id] && !current) current = id; });
    links.forEach(function (a) { a.classList.remove('is-current'); });
    if (current && map[current]) map[current].classList.add('is-current');
    /* The band starts just BELOW both fixed bars and runs to mid-viewport.
       A 40-45% band marked nothing after a jump: an anchored target lands
       around 17% of the viewport, above the band entirely. Derived from
       the tokens so it cannot drift if either bar changes height. */
  }, { rootMargin: '-' + barsPx + 'px 0px -50% 0px' });
  ids.forEach(function (id) { io.observe(document.getElementById(id)); });
})();

/* SYSTEMS GUIDE — mounted wherever its markup exists (homepage and
   /text-us). Lives here rather than inline so there is one copy of the
   behaviour, and it uses the one shared submitToMake from
   lead-submit.js. The element guard at the top means it no-ops on the
   17 routes that do not carry the markup. */
/* ── Systems guide — conversational capture ─────────────────────────
       Rebuilt for v3. The v3 homepage previously carried this widget's
       JS with no markup or CSS, so it was guarded dead code and the page
       had one fewer conversion path than the live site.

       FIELD PARITY is the hard requirement (contract §10.2): the payload
       must match what the live widget sent, so no lead data is lost in
       the swap. businessSize is captured and folded into `goal` exactly
       as before — `challenge · businessSize` — because submitToMake has
       no businessSize parameter. Same function, same destination. */
    (function () {
      var launcher = document.getElementById('guideLauncher');
      var panel    = document.getElementById('guidePanel');
      var msgs     = document.getElementById('guideMsgs');
      var opts     = document.getElementById('guideOpts');
      var inputRow = document.getElementById('guideInputRow');
      var input    = document.getElementById('guideInput');
      var sendBtn  = document.getElementById('guideSend');
      var closeBtn = document.getElementById('guideClose');
      var gate     = document.getElementById('guideGate');
      var consent  = document.getElementById('guideConsent');
      var submit   = document.getElementById('guideSubmit');
      if (!launcher || !panel || !msgs || !opts || !inputRow || !input || !sendBtn || !closeBtn || !gate || !consent || !submit) return;

      var open = false, step = 0, data = {};

      var FLOW = [
        { ask: 'What would you like to do?', opts: ['Help me choose a system', 'Call the live demo', 'Open the audit form'], key: 'intent' },
        { ask: 'Where do good leads get stuck most often?', opts: ['We are hard to find online', 'We miss calls', 'Booking and no-shows', 'Follow-up after the job'], key: 'challenge' },
        { ask: 'How big is the team?', opts: ['Just me', '2-5', '6-20', '20+'], key: 'businessSize' },
        { ask: 'First name?', free: true, key: 'firstName' },
        { ask: 'Business name?', free: true, key: 'company' },
        { ask: 'Best email for the recommendation?', free: true, key: 'email' }
      ];

      var PICK = {
        'We are hard to find online': 'Website + Google Presence',
        'We miss calls': 'Missed-Call Text-Back',
        'Booking and no-shows': 'Booking + Reminders',
        'Follow-up after the job': 'Review Engine'
      };

      function row(who, text) {
        var d = document.createElement('div');
        d.className = 'guide-msg is-' + who;
        d.textContent = text;
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
        return d;
      }
      function clearOpts() { opts.innerHTML = ''; }
      function showOpts(list, cb) {
        clearOpts();
        inputRow.hidden = true;
        list.forEach(function (o) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'guide-opt'; b.textContent = o;
          b.addEventListener('click', function () { cb(o); });
          opts.appendChild(b);
        });
      }
      function askFree() { clearOpts(); inputRow.hidden = false; input.value = ''; input.focus(); }

      function advance(answer) {
        if (answer !== undefined) {
          row('you', answer);
          data[FLOW[step].key] = answer;
          if (step === 0 && answer === 'Call the live demo') {
            row('bot', 'The demo line is (951) 651-3966 — call it and try to stump it.');
            clearOpts(); inputRow.hidden = true; return;
          }
          if (step === 0 && answer === 'Open the audit form') {
            row('bot', 'Opening the audit form.');
            clearOpts(); inputRow.hidden = true;
            close(); location.hash = '#contact'; return;
          }
          step++;
        }
        if (step >= FLOW.length) return finish();
        var q = FLOW[step];
        row('bot', q.ask);
        if (q.free) askFree(); else showOpts(q.opts, advance);
      }

      function finish() {
        clearOpts(); inputRow.hidden = true;
        data.services = PICK[data.challenge] || 'Systems audit';
        row('bot', 'Based on that, the place to start is ' + data.services + '. Tick the box and I will send this over.');
        gate.hidden = false;
      }

      submit.addEventListener('click', async function () {
        if (!consent.checked) { consent.focus(); return; }
        submit.disabled = true; submit.textContent = 'Sending…';
        var res = await submitToMake({
          firstName:  data.firstName || '',
          lastName:   'Lead',
          company:    data.company || 'Unknown',
          businessType: '',
          email:      data.email || '',
          phone:      '',
          services:   [data.services],
          budget:     '',
          goal:       [data.challenge, data.businessSize].filter(Boolean).join(' · '),
          honeypot:   '',
          smsConsent: !!consent.checked
        });
        if (window.plausible) window.plausible('Systems Guide Completed');
        gate.hidden = true;
        row('bot', res && res.ok === false && !res.fallback
          ? 'That did not send. Email contact@pairden.com and we will pick it up.'
          : 'Sent. We will come back to you with the smallest system that fixes it.');
      });

      function sendFree() {
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        advance(v);
      }
      sendBtn.addEventListener('click', sendFree);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); sendFree(); } });

      function openPanel() {
        open = true;
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        document.body.classList.add('guide-open');
        if (!step && !msgs.childElementCount) {
          row('bot', 'I can help you find the simplest place to start.');
          advance();
        }
      }
      function close() {
        open = false;
        panel.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('guide-open');
        launcher.focus();
      }
      /* The launcher is fixed chrome and was landing on top of the audit
         form's submit button — a conversion-blocking collision the sweep
         caught. It stands down whenever the form or the footer is on
         screen: if you are already in the form, the guide is redundant.

         IntersectionObserver, NOT requestAnimationFrame. The first
         version throttled with rAF and could not be verified — rAF does
         not fire in a backgrounded pane, so the launcher stayed visible
         over the submit button in every test. A guard on a conversion
         path must not depend on a callback that may never run; IO fires
         independently. The scroll listener below is a direct,
         timestamp-throttled backstop with no rAF in the path. */
      var watch = [document.getElementById('contact'), document.querySelector('footer')].filter(Boolean);
      var overlapping = new Set();
      function applyLauncher() {
        launcher.classList.toggle('is-hidden', !open && overlapping.size > 0);
      }
      if ('IntersectionObserver' in window && watch.length) {
        var lio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) overlapping.add(e.target); else overlapping.delete(e.target);
          });
          applyLauncher();
        }, { rootMargin: '0px 0px -40px 0px' });
        watch.forEach(function (el) { lio.observe(el); });
      }
      /* Throttled with a TRAILING call. The first version dropped any
         event that landed inside the window and never re-checked, so a
         fast scroll — or a programmatic jump straight to the form —
         could strand the launcher on top of the submit button. The
         trailing timer guarantees the final position is always applied. */
      var lastCheck = 0, trailing = null;
      function measure() {
        lastCheck = Date.now();
        var vh = window.innerHeight;
        overlapping.clear();
        watch.forEach(function (el) {
          var b = el.getBoundingClientRect();
          if (b.top < vh - 40 && b.bottom > 0) overlapping.add(el);
        });
        applyLauncher();
        /* Collapse to icon-only past the hero: bounded footprint. */
        launcher.classList.toggle('is-compact', window.scrollY > 260);
      }
      function scrollCheck() {
        var now = Date.now();
        if (now - lastCheck >= 120) { measure(); return; }
        clearTimeout(trailing);
        trailing = setTimeout(measure, 130);
      }
      window.addEventListener('scroll', scrollCheck, { passive: true });
      window.addEventListener('resize', scrollCheck);
      scrollCheck();

      launcher.addEventListener('click', function () { open ? close() : openPanel(); });
      closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) close(); });
    })();

/* Reveals — fire once, then stop observing. */
(function () {
  var els = document.querySelectorAll('.rv');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (e) { io.observe(e); });
})();

/* Call log — the exchange plays once at a call's pace. */
(function () {
  var log = document.getElementById('callLog');
  if (!log) return;
  if (!('IntersectionObserver' in window)) { log.classList.add('in-view'); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { log.classList.add('in-view'); io.unobserve(log); } });
  }, { threshold: 0.25 });
  io.observe(log);
})();

/* FAQ — one open at a time, aria kept honest. */
document.querySelectorAll('.faq-q').forEach(function (btn, i) {
  var item = btn.closest('.faq-item');
  var ans = item.querySelector('.faq-a');
  ans.id = ans.id || ('faq-a-' + (i + 1));
  btn.setAttribute('aria-controls', ans.id);
  btn.addEventListener('click', function () {
    var open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (o) {
      o.classList.remove('open');
      o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

/* Nav — hamburger, mobile services accordion, escape to close. */
(function () {
  var b = document.getElementById('burger'), m = document.getElementById('navMobile');
  if (!b || !m) return;
  b.addEventListener('click', function () {
    var open = m.classList.toggle('open');
    b.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  m.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      m.classList.remove('open'); b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && m.classList.contains('open')) {
      m.classList.remove('open'); b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false'); b.focus();
    }
  });
  var acc = m.querySelector('.m-acc-btn'), panel = document.getElementById('mServices');
  if (acc && panel) acc.addEventListener('click', function () {
    var o = panel.classList.toggle('open');
    acc.setAttribute('aria-expanded', o ? 'true' : 'false');
    var chev = acc.querySelector('.m-acc-chev');
    if (chev) chev.style.transform = o ? 'rotate(180deg)' : '';
  });
})();

/* Sticky mobile CTA — dismissible, and never resting over the footer.
   Deliberately a throttled scroll check rather than IntersectionObserver:
   IO did not reliably re-fire when the footer moved by layout shift
   rather than scroll, which left the bar sitting on the legal line. */
(function () {
  var bar = document.getElementById('stickyCta');
  if (!bar) return;
  if (sessionStorage.getItem('pairdenStickyDismissed') === '1') { bar.remove(); return; }
  document.body.classList.add('has-sticky');

  var close = document.getElementById('stickyClose');
  if (close) close.addEventListener('click', function () {
    bar.classList.add('is-hidden');
    document.body.classList.remove('has-sticky');
    try { sessionStorage.setItem('pairdenStickyDismissed', '1'); } catch (e) {}
    setTimeout(function () { bar.remove(); }, 300);
  });

  var footer = document.querySelector('footer');
  if (!footer) return;
  var ticking = false;
  function sync() {
    ticking = false;
    bar.classList.toggle('is-hidden', footer.getBoundingClientRect().top < window.innerHeight - 40);
  }
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(sync); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sync();
})();
