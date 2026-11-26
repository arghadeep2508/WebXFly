/* ==========================================================
   WebXFly — motion conductor
   ONE requestAnimationFrame loop for the whole page.
   - draws every frame at the REAL scroll position, so pinned stages and the
     animation inside them move together (no wobble / flutter)
   - never reads layout while animating: positions are measured once and cached
   - only renders sections that are on (or near) the screen
   - goes idle when nothing is moving (saves battery on phones)
   - owns the page "chrome": nav state, progress bar, scroll-spy,
     reveal-on-scroll blocks, footer wordmark, WhatsApp button
   Sections register with WXF.add({ el, render(y, time), live }).
   Must load before the section scripts.
   ========================================================== */
(function () {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const REC = new URLSearchParams(location.search).has('rec');          // video capture mode
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sections = [];
  let cur = scrollY, last = -1, dirty = true;

  /* ---------- cached layout (re-measured on resize / load / content change) ---------- */
  const docTop = (el) => el.getBoundingClientRect().top + scrollY;
  function measure() {
    sections.forEach((s) => {
      s.top = docTop(s.el); s.h = s.el.offsetHeight;
      s.inner = (s.el.firstElementChild || s.el).offsetHeight;   // height of the sticky stage inside
    });
    chrome.measure();
    dirty = true;
  }
  const visible = (s, y) => y + innerHeight > s.top - innerHeight * 0.5 && y < s.top + s.h + innerHeight * 0.5;

  /* ---------- page chrome ---------- */
  const chrome = (() => {
    const nav = document.getElementById('nav');
    const bar = document.getElementById('progress');
    const wa = document.getElementById('waFloat');
    const mark = document.querySelector('.ft-mark');
    const darkEls = [...document.querySelectorAll('[data-dark]')];
    const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    let reveals = [], dark = [], spy = [], max = 1, markTop = 0, markH = 1;

    function measure() {
      // remember where each reveal block sits (minus the slide it is currently doing)
      reveals = [...document.querySelectorAll('.reveal')].map((el) => ({ el, top: docTop(el) - (el.__ty || 0), t: -1 }));
      if (mark) { markTop = docTop(mark); markH = mark.offsetHeight || 1; }
      dark = darkEls.map((el) => ({ top: docTop(el), bot: docTop(el) + el.offsetHeight }));
      spy = targets.map((el) => (el ? docTop(el) : Infinity));
      max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    }

    function update(y) {
      // nav: backdrop once past the hero, light-on-dark over dark sections
      nav.classList.toggle('is-scrolled', y > innerHeight * 0.55);
      nav.classList.toggle('is-dark', dark.some((d) => y + 56 > d.top && y + 56 < d.bot));
      // thin progress line along the top
      if (bar) bar.style.transform = `scaleX(${(y / max).toFixed(4)})`;
      // scroll-spy: highlight the section you're in
      let active = -1;
      spy.forEach((t, i) => { if (y + innerHeight * 0.4 >= t) active = i; });
      links.forEach((a, i) => a.classList.toggle('is-active', i === active));
      // blocks that fade up as they enter
      reveals.forEach((r) => {
        const t = reduced ? 1 : +clamp((innerHeight * 0.92 - (r.top - y)) / (innerHeight * 0.24)).toFixed(3);
        if (t === r.t) return;                      // unchanged — skip the style write
        r.t = t; r.el.__ty = (1 - t) * 30;
        r.el.style.opacity = t;
        r.el.style.transform = t >= 1 ? 'none' : `translate3d(0,${r.el.__ty.toFixed(1)}px,0)`;
      });
      // footer wordmark rises and its X fills red as you reach the very bottom
      if (mark) {
        const t = clamp((innerHeight - (markTop - y)) / (markH * 1.6));
        mark.style.setProperty('--t', t.toFixed(3));
      }
    }

    // WhatsApp button appears once the hero intro has finished
    function tick() {
      if (wa) wa.classList.toggle('is-on', !nav.classList.contains('is-hidden'));
    }
    return { measure, update, tick };
  })();

  /* ---------- the loop ---------- */
  function frame(ts) {
    cur = scrollY;                                  // the real position: stages and their contents stay locked together
    const moved = dirty || cur !== last;

    for (const s of sections) {
      if (!visible(s, cur)) continue;
      if (moved || (s.live && !reduced)) s.render(cur, ts, s);
    }
    if (moved) { chrome.update(cur); last = cur; dirty = false; }
    chrome.tick();
    requestAnimationFrame(frame);
  }

  /* ---------- in-page links land where each section looks its best ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : document.body;
    if (!el) return;
    e.preventDefault();
    const at = parseFloat(el.dataset.at || 0);                // 0–1 through a pinned section
    const y = id ? docTop(el) + at * Math.max(0, el.offsetHeight - innerHeight) : 0;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- public API ---------- */
  window.WXF = {
    add(s) {
      s.top = 0; s.h = 0; s.inner = innerHeight; sections.push(s);
      if (!REC) { s.top = docTop(s.el); s.h = s.el.offsetHeight; s.inner = (s.el.firstElementChild || s.el).offsetHeight; }
      dirty = true;
    },
  };

  // deterministic hook used to film demo videos (?rec=1)
  window.__render = (y, ms = performance.now()) => {
    measure();
    sections.forEach((s) => s.render(y, ms, s));
    chrome.update(y); chrome.tick();
  };
  window.__renderAt = window.__render;

  addEventListener('resize', measure);
  addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  if (document.fonts) document.fonts.ready.then(measure);

  if (!REC) requestAnimationFrame(() => { measure(); requestAnimationFrame(frame); });
})();
