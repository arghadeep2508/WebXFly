/* ==========================================================
   WebXFly — industry showcase
   Scrolling the pinned section slides a horizontal rail.
   render(y) writes transforms only, so it stays smooth.
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

  sec.style.height = (N + 0.75) * 100 + 'vh';

  function render(y, time) {
    const p = clamp((y - sec.offsetTop) / (sec.offsetHeight - innerHeight));
    const t = p * (N - 1);                       // which panel is centred

    rail.style.transform = `translate3d(${-t * 68}vw,0,0)`;
    ghost.style.transform = `translate3d(${-t * 34 - p * 10}vw,-50%,0)`;   // slower = parallax

    panels.forEach((_, k) => {
      const d = t - k, a = clamp(1 - Math.abs(d));           // 1 when centred
      // left copy stays put and swaps over — only the devices travel
      const c = clamp(1.5 - Math.abs(d) * 2.4);   // holds, then swaps quickly
      metas[k].style.transform = `translate3d(0,${(1 - c) * 30 * Math.sign(d || 1)}px,0)`;
      metas[k].style.opacity = c;
      metas[k].style.pointerEvents = c > .5 ? 'auto' : 'none';
      // device cluster: 3D turn + push back when off-centre
      devs[k].style.transform = `translate3d(${-d * 4}vw,0,${-Math.abs(d) * 260}px) rotateY(${d * -20}deg) scale(${lerp(.86, 1, easeOut(a))})`;
      devs[k].style.opacity = clamp(1.25 - Math.abs(d) * 1.1);
      // phone floats once its panel is close
      phones[k].style.transform = `translate3d(0,${Math.sin(time / 1100 + k) * 7 * a - (1 - a) * 18}px,0) rotate(${(1 - a) * -5}deg)`;
    });

    const near = Math.round(t);
    chips.forEach((c, k) => c.classList.toggle('on', k === near));
    win.style.transform = `translate3d(0,${-near * 34}px,0)`;
    bar.style.transform = `scaleX(${p})`;
  }

  WXF.add({ el: sec, render, live: true });     // live: the phones float continuously
})();
