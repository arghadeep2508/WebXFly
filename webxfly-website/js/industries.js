/* ==========================================================
   WebXFly — industry showcase (carousel)
   Swipe on phones, drag with the mouse / trackpad on PC, or use the
   arrows, chips and keyboard. Page scrolling up/down is never blocked.
   render() writes transforms only, so it stays smooth.
   ========================================================== */
(function () {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  /* ---------- Content ---------- */
  const DATA = [
    { key: 'Restaurants', name: 'Restaurants', url: 'spiceroute.demo',
      desc: 'Menu, photos and <span class="nw">one-tap</span> table booking — so diners choose you before they choose the street.',
      tags: ['Digital menu', 'Table booking', 'Google Maps'], scope: 'Typically 3–4 pages · live in 3–5 days',
      site: { bg: '#161312', fg: '#f6f2ec', ac: '#e4253a', art: 'linear-gradient(145deg,#6d1119,#1c1413)', card: 'rgba(255,255,255,.06)',
        logo: 'Spice<em>Route</em>', h: 'Flavours worth<br><em>the table.</em>', p: '<span class="nw">North-Indian</span> kitchen in Kolkata. Open 12pm – 11pm, every day.',
        btn: 'Book a Table', ghost: 'View Menu',
        block: 'row', items: [['Butter Chicken', '₹340'], ['Paneer Tikka', '₹260'], ['Biryani', '₹290']] } },

    { key: 'Cafés', name: 'Cafés & Bakeries', url: 'cafeluna.demo',
      desc: 'A warm, <span class="nw">photo-led</span> page with your menu, timings and location — built to bring in the morning crowd.',
      tags: ['Menu board', 'Timings', 'Instagram feed'], scope: 'Single page · live in 2–3 days',
      site: { bg: '#faf6ef', fg: '#1d1a16', ac: '#ce1a2b', art: 'linear-gradient(150deg,#d8a06a,#8a4a2a)', card: 'rgba(20,18,16,.05)',
        logo: 'Cafe<em>Luna</em>', h: 'Fresh bakes,<br><em>slow mornings.</em>', p: '<span class="nw">Hand-brewed</span> coffee and daily bakes, from 7am.',
        btn: 'See Menu', ghost: 'Find Us',
        block: 'row', items: [['Cappuccino', '₹160'], ['Croissant', '₹120'], ['Cheesecake', '₹210']] } },

    { key: 'Clinics', name: 'Clinics & Doctors', url: 'carepoint.demo',
      desc: 'A calm, trustworthy site with doctor profiles and an appointment form patients actually finish.',
      tags: ['Appointments', 'Doctor profiles', 'WhatsApp'], scope: '5–7 pages · live in 5–7 days',
      site: { bg: '#ffffff', fg: '#16191d', ac: '#ce1a2b', art: 'linear-gradient(150deg,#c9d6e4,#6d8299)', card: '#f2f5f8',
        logo: 'Care<em>Point</em>', h: 'Care that<br><em>fits your day.</em>', p: 'General medicine & diagnostics. <span class="nw">Walk-ins</span> welcome.',
        btn: 'Book Appointment', ghost: 'Our Doctors',
        block: 'slots', items: ['10:00', '11:30', '04:00', '06:30'] } },

    { key: 'Salons', name: 'Salons & Spas', url: 'glowsalon.demo',
      desc: 'Service list with prices, a gallery of your work, and online booking that cuts the phone calls.',
      tags: ['Price list', 'Gallery', 'Online booking'], scope: '3–4 pages · live in 3–5 days',
      site: { bg: '#141010', fg: '#f7f1ee', ac: '#e4253a', art: 'linear-gradient(150deg,#8e3b4a,#241216)', card: 'rgba(255,255,255,.06)',
        logo: 'Glow<em>Salon</em>', h: 'Look the way<br><em>you feel.</em>', p: 'Hair, skin and bridal studio. Open 10am – 8pm.',
        btn: 'Book a Slot', ghost: 'Price List',
        block: 'list', items: [['Haircut & Style', '₹499'], ['Facial', '₹899'], ['Bridal Package', '₹6,500']] } },

    { key: 'Gyms', name: 'Gyms & Trainers', url: 'fitzone.demo',
      desc: 'Bold, <span class="nw">high-energy</span> page with class timings, plans and a <span class="nw">free-trial</span> form that fills your batches.',
      tags: ['Class schedule', 'Plans', 'Free trial form'], scope: 'Single page · live in 2–3 days',
      site: { bg: '#0f0e0d', fg: '#f4f2ed', ac: '#e4253a', art: 'linear-gradient(150deg,#b3121f,#17100f)', card: 'rgba(255,255,255,.07)',
        logo: 'Fit<em>Zone</em>', h: 'Stronger<br><em>every week.</em>', p: 'Strength, HIIT and personal training. 5am – 10pm.',
        btn: 'Free Trial', ghost: 'Plans',
        block: 'list', items: [['Morning HIIT · 6am', 'Mon–Fri'], ['Strength · 7pm', 'Mon–Sat'], ['Personal Training', 'On request'] ] } },

    { key: 'Local shops', name: 'Local Shops', url: 'citystore.demo',
      desc: 'A clean catalogue of what you sell, with prices and a WhatsApp order button — no cart needed.',
      tags: ['Product catalogue', 'WhatsApp order', 'Offers'], scope: '5–7 pages · live in 5–7 days',
      site: { bg: '#f6f4f0', fg: '#141312', ac: '#ce1a2b', art: 'linear-gradient(150deg,#9aa6b4,#434c57)', card: '#ffffff',
        logo: 'City<em>Store</em>', h: 'Everything,<br><em>around the corner.</em>', p: 'Daily needs, delivered across the neighbourhood.',
        btn: 'Order on WhatsApp', ghost: 'Catalogue',
        block: 'row', items: [['Groceries', '₹99+'], ['Home care', '₹149+'], ['Snacks', '₹49+']] } },
  ];

  /* ---------- Build the markup ---------- */
  const block = (s) => {
    if (s.block === 'row')
      return `<div class="ms-row">${s.items.map(([t, p]) => `<div class="ms-card"><div class="im"></div><div class="tx"><i></i><i></i><b>${p}</b></div></div>`).join('')}</div>`;
    if (s.block === 'list')
      return `<div class="ms-list">${s.items.map(([t, p]) => `<div class="ms-item"><span>${t}</span><em>${p}</em></div>`).join('')}</div>`;
    return `<div class="ms-list"><div class="ms-item" style="flex-direction:column;align-items:flex-start;gap:1.4cqw">
      <span>Next available today</span><div class="ms-slots">${s.items.map((t, i) => `<i class="${i === 1 ? 'on' : ''}">${t}</i>`).join('')}</div></div></div>`;
  };
  const site = (s, tall) => `<div class="ms${tall ? ' tall' : ''}" style="--bg:${s.bg};--fg:${s.fg};--ac:${s.ac};--art:${s.art};--card:${s.card}">
      <div class="ms-nav"><div class="ms-logo">${s.logo}</div>${tall ? '' : '<div class="ms-links"><span>Home</span><span>Menu</span><span>About</span><span>Contact</span></div>'}<div class="ms-cta">${tall ? 'Book' : s.btn}</div></div>
      <div class="ms-body"><div class="ms-left"><div class="ms-h">${s.h}</div><div class="ms-p">${s.p}</div>
        <div class="ms-btns"><div class="ms-btn">${s.btn}</div>${tall ? '' : `<div class="ms-btn ghost">${s.ghost}</div>`}</div></div>
        <div class="ms-art"><b>${s.logo.replace(/<\/?em>/g, '')}</b></div></div>
      ${tall ? '' : block(s)}</div>`;

  const rail = document.getElementById('rail');
  rail.innerHTML = DATA.map((d, i) => `
    <article class="panel">
      <div></div>
      <div class="p-devices" aria-hidden="true"><div class="dev">
        <div class="browser"><div class="b-bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><div class="b-url">${d.url}</div></div>${site(d.site, false)}</div>
        <div class="phone"><div class="scr">${site(d.site, true)}</div></div>
      </div></div>
    </article>`).join('');

  document.getElementById('copy').innerHTML = DATA.map((d, i) => `
    <div class="p-meta">
      <div class="p-num">0${i + 1}</div>
      <h3 class="p-name">${d.name}</h3>
      <p class="p-desc">${d.desc}</p>
      <div class="p-tags">${d.tags.map(t => `<span>${t}</span>`).join('')}</div>
      <p class="p-scope"><i></i>${d.scope}</p>
    </div>`).join('');

  document.getElementById('chips').innerHTML = DATA.map(d => `<button class="chip"><i></i><span>${d.key}</span></button>`).join('');
  document.getElementById('counterWin').innerHTML = DATA.map((_, i) => `<b>0${i + 1}</b>`).join('');
  document.getElementById('ghostWord').textContent = DATA.map(d => d.key.toUpperCase()).join(' · ') + ' · ';

  const sec = document.getElementById('indSec');
  const stage = document.getElementById('indStage');
  const ghost = document.getElementById('ghostWord');
  const chips = [...document.getElementById('chips').children];
  const win = document.getElementById('counterWin');
  const bar = document.getElementById('indBar');
  const panels = [...rail.children];
  const metas = [...document.getElementById('copy').children];
  const devs = panels.map(p => p.querySelector('.dev'));
  const phones = panels.map(p => p.querySelector('.phone'));
  const N = DATA.length;

  const hint = document.getElementById('indHint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  document.getElementById('indHintText').textContent = coarse ? 'Swipe to explore' : 'Drag to explore';

  /* ---------- carousel state ---------- */
  let pos = 0;          // where the rail is now (0 … N-1, fractional while moving)
  let goal = 0;         // the panel it is heading to
  let drag = null;      // active drag gesture
  let used = false;     // has the visitor interacted yet (hides the hint, skips the peek)
  let peekAt = -1;      // one gentle "there's more →" nudge the first time the section is seen
  let lastTime = 0;
  let step = innerWidth * 0.68;                 // one panel's width in px
  let digitH = 34;                             // height of one counter digit (smaller on phones)
  const measureStep = () => { step = panels[0].offsetWidth || innerWidth * 0.68; digitH = (win.firstElementChild || {}).offsetHeight || 34; };
  measureStep(); addEventListener('resize', measureStep); addEventListener('load', measureStep);

  const goTo = (k) => { goal = clamp(Math.round(k), 0, N - 1); markUsed(); };
  function markUsed() { if (!used) { used = true; hint.classList.add('is-used'); } }

  chips.forEach((c, k) => c.addEventListener('click', () => goTo(k)));
  document.getElementById('indPrev').addEventListener('click', () => goTo(goal - 1));
  document.getElementById('indNext').addEventListener('click', () => goTo(goal + 1));
  sec.addEventListener('keydown', (e) => {           // ← → anywhere in the section (arrows / chips focused too)
    if (e.key === 'ArrowRight') { goTo(goal + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { goTo(goal - 1); e.preventDefault(); }
  });

  /* ---------- drag / swipe (pointer events: mouse, touch and pen alike) ---------- */
  const band = (v) => v < 0 ? v * 0.35 : v > N - 1 ? N - 1 + (v - N + 1) * 0.35 : v;   // stretchy ends
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('a, button')) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, from: pos, moved: false, trail: [[e.clientX, performance.now()]] };
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }   // mostly vertical → it's a page scroll, let it go
      drag.moved = true; markUsed();
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    }
    const now = performance.now();
    drag.trail.push([e.clientX, now]);                                // recent positions → release speed
    while (drag.trail.length > 2 && now - drag.trail[0][1] > 100) drag.trail.shift();
    pos = band(drag.from - dx / step);
    goal = clamp(Math.round(pos), 0, N - 1);
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    if (drag.moved) {
      const [x0, t0] = drag.trail[0], [x1, t1] = drag.trail[drag.trail.length - 1];
      const speed = (x1 - x0) / Math.max(1, t1 - t0);                // px per ms over the last ~0.1 s
      goal = settleFrom(drag.from, pos, Math.abs(speed) > 0.3);
      stage.classList.remove('is-dragging');
      stage.__justDragged = performance.now();
    }
    drag = null;
  }
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  // a drag that ends over a link must not also "click" it
  stage.addEventListener('click', (e) => {
    if (performance.now() - (stage.__justDragged || 0) < 250) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // where to land after a gesture: a quick flick or a pull past 20% of a panel moves exactly one panel
  function settleFrom(from, now, fast) {
    const base = Math.round(from), moved = now - from;
    if (fast && Math.abs(moved) > 0.02) return clamp(base + Math.sign(moved), 0, N - 1);
    if (Math.abs(moved) > 0.2) return clamp(base + Math.sign(moved) * Math.max(1, Math.round(Math.abs(moved))), 0, N - 1);
    return clamp(base, 0, N - 1);
  }

  // trackpads / shift+wheel scroll sideways through the panels; normal wheel still scrolls the page
  let wheelTimer = 0, wheelFrom = null;
  stage.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); markUsed();
    if (wheelFrom === null) wheelFrom = goal;
    pos = band(pos + e.deltaX / step);
    goal = clamp(Math.round(pos), 0, N - 1);
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { goal = settleFrom(wheelFrom, pos, false); wheelFrom = null; }, 140);
  }, { passive: false });

  /* ---------- draw ---------- */
  function render(y, time, m) {
    const dt = Math.min(64, lastTime ? time - lastTime : 16); lastTime = time;

    // glide toward the target panel (critically damped, frame-rate independent)
    if (!drag && wheelFrom === null) {             // hands off while a finger / trackpad is moving it
      pos = reduced ? goal : pos + (goal - pos) * (1 - Math.exp(-dt / 120));
      if (Math.abs(goal - pos) < 0.0005) pos = goal;
    }

    // first time the section is on screen: a small nudge so people see it moves sideways
    if (!used && !reduced && peekAt < 0 && m && y + innerHeight * 0.55 > m.top) peekAt = time + 450;
    let peek = 0;
    if (!used && peekAt > 0 && time > peekAt) peek = Math.sin(Math.PI * clamp((time - peekAt) / 1300)) * 0.16;

    const t = pos + peek;                        // which panel is centred
    const p = clamp(t / (N - 1));

    rail.style.transform = `translate3d(${(-t * step).toFixed(2)}px,0,0)`;
    ghost.style.transform = `translate3d(${(-t * 34 - p * 10).toFixed(3)}vw,-50%,0)`;   // slower = parallax

    panels.forEach((_, k) => {
      const d = t - k, a = clamp(1 - Math.abs(d));           // 1 when centred
      // copy stays put and swaps over — only the devices travel
      const c = clamp(1.5 - Math.abs(d) * 2.4);
      metas[k].style.transform = `translate3d(0,${((1 - c) * 30 * Math.sign(d || 1)).toFixed(2)}px,0)`;
      metas[k].style.opacity = c.toFixed(3);
      metas[k].style.pointerEvents = c > .5 ? 'auto' : 'none';
      metas[k].setAttribute('aria-hidden', c > .5 ? 'false' : 'true');
      // device cluster: 3D turn + push back when off-centre
      devs[k].style.transform = `translate3d(${(-d * 4).toFixed(3)}vw,0,${(-Math.abs(d) * 260).toFixed(1)}px) rotateY(${(d * -20).toFixed(2)}deg) scale(${lerp(.86, 1, easeOut(a)).toFixed(4)})`;
      devs[k].style.opacity = clamp(1.25 - Math.abs(d) * 1.1).toFixed(3);
      // phone floats once its panel is close
      phones[k].style.transform = `translate3d(0,${(Math.sin(time / 1100 + k) * 7 * a - (1 - a) * 18).toFixed(2)}px,0) rotate(${((1 - a) * -5).toFixed(2)}deg)`;
    });

    const near = clamp(Math.round(t), 0, N - 1);
    chips.forEach((c, k) => { c.classList.toggle('on', k === near); c.setAttribute('aria-pressed', k === near); });
    win.style.transform = `translate3d(0,${-near * digitH}px,0)`;
    bar.style.transform = `scaleX(${clamp((t + 1) / N).toFixed(4)})`;          // how far through the six
  }

  WXF.add({ el: sec, render, live: true });     // live: phones float and the rail glides between frames
})();
