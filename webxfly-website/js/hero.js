/* ==========================================================
   WebXFly — Hero intro
   The CSS holds every animation; this file only measures the
   screen, places things, and switches the hero between states
   (.s0 → .s4) at the right moments.
   ========================================================== */
(function () {
  const $ = (id) => document.getElementById(id);
  const hero = $('hero'), nav = $('nav'), intro = $('intro');
  const welcome = $('welcome'), word = $('word'), ghost = $('ghost');
  const figure = $('figure'), figFloat = $('figFloat'), figImg = $('figImg');
  const badge = $('badge'), counter = $('count'), introBtn = $('introBtn');

  const RATIO = 1056 / 1400;                       // sculpture width / height
  const REC = new URLSearchParams(location.search).has('rec');
  if (REC) document.body.classList.add('is-rec');

  let timers = [], done = false, M = {};

  /* ---------- Build the wordmark letters ---------- */
  welcome.innerHTML = ['WELCOME', 'TO']
    .map(w => '<b>' + [...w].map(c => `<span>${c}</span>`).join('') + '</b>').join('');
  const group = (cls, text) =>
    `<span class="g ${cls}">` + [...text].map(c => `<span class="ch"><span>${c}</span></span>`).join('') + '</span>';
  word.innerHTML = group('g--web', 'WEB') + group('g--x', 'X') + group('g--fly', 'FLY');
  const gWeb = word.querySelector('.g--web'), gX = word.querySelector('.g--x'), gFly = word.querySelector('.g--fly');
  const welcomeLetters = [...welcome.querySelectorAll('span')];
  const wordLetters = [...word.querySelectorAll('.ch span')];
  welcomeLetters.forEach((s, i) => (s.style.transitionDelay = i * 0.04 + 's'));
  const mid = (wordLetters.length - 1) / 2;
  const delaysIn  = () => wordLetters.forEach((s, i) => (s.style.transitionDelay = 0.22 + i * 0.06 + 's'));
  const delaysOut = () => wordLetters.forEach((s, i) => (s.style.transitionDelay = Math.abs(i - mid) * 0.05 + 's'));

  /* ---------- Measure + place everything for this screen ---------- */
  function measure() {
    const vw = innerWidth, vh = Math.max(innerHeight, 620), mobile = vw < 760;

    // wordmark size: wide and readable, never stretched
    word.style.fontSize = '100px';
    const w100 = gWeb.offsetWidth + gX.offsetWidth + gFly.offsetWidth || 1;
    word.style.fontSize = Math.min((100 * vw * (mobile ? 0.9 : 0.66)) / w100, vh * 0.42) + 'px';

    // settled sculpture — sized so it never touches the headline
    const textRight = Math.max(28, (vw - 1240) / 2 + 28) + Math.min(600, vw * 0.48);
    const rightGap = mobile ? 0 : Math.max(vw * 0.02, (vw - 1440) / 2);
    let h = mobile ? vh * 0.5 : vh * 0.92, w = h * RATIO;
    const maxW = mobile ? vw * 0.86 : Math.min(vw * 0.47, vw - rightGap - textRight - 24);
    if (w > maxW) { w = maxW; h = w / RATIO; }
    const right = mobile ? (vw - w) / 2 : rightGap;
    figure.style.setProperty('--fig-h', h + 'px');
    figure.style.setProperty('--fig-right', right + 'px');

    // intro sculpture — centred and a little bigger
    let ih = vh * (mobile ? 0.6 : 0.86);
    if (ih * RATIO > vw * 0.9) ih = (vw * 0.9) / RATIO;
    const centreX = vw - right - w / 2;

    // how far WEB and FLY must part so the sculpture fits between them
    [gWeb, gX, gFly].forEach(g => (g.style.transform = 'none'));
    const half = ih * RATIO * 0.42, rWeb = gWeb.getBoundingClientRect(), rFly = gFly.getBoundingClientRect();
    const webShift = Math.max(vw / 2 - half - rWeb.right, vw * 0.02 - rWeb.left);
    const flyShift = Math.min(vw / 2 + half - rFly.left, vw * 0.98 - rFly.right);
    gX.style.transform = '';                            // let the CSS scale the X again
    word.style.setProperty('--x-scale', Math.max(2.6, (ih * RATIO * 1.2) / (gX.offsetWidth || 1)).toFixed(2));

    // ghost wordmark centred behind the settled sculpture
    ghost.style.setProperty('--ghost-size', '100px');
    const g100 = ghost.scrollWidth || 1, gw = w * 1.45;
    ghost.style.setProperty('--ghost-size', (100 * gw) / g100 + 'px');
    ghost.style.setProperty('--ghost-x', centreX - gw / 2 + 'px');

    // badge: just left of the sculpture's head
    hero.style.setProperty('--badge-x', Math.max(10, mobile ? vw - 118 - 12 : vw - right - w - 110) + 'px');
    hero.style.setProperty('--badge-y', (mobile ? vh - h - 30 : vh * 0.2) + 'px');

    M = { vw, vh, h, mobile, introScale: ih / h, introX: vw / 2 - centreX, webShift, flyShift };
  }

  const setFigure = (x, y, s) => {
    figure.style.setProperty('--fig-x', x + 'px');
    figure.style.setProperty('--fig-y', y + 'px');
    figure.style.setProperty('--fig-s', s);
  };
  const splitWord = (on) => {
    if (M.mobile) {                      // phones: wordmark lifts up instead of splitting
      gWeb.style.transform = gFly.style.transform = 'none';
      intro.style.transform = on ? `translate3d(0,calc(-54% - ${M.vh * 0.27}px),0)` : '';
      return;
    }
    intro.style.transform = '';
    gWeb.style.transform = on ? `translate3d(${M.webShift}px,0,0)` : 'none';
    gFly.style.transform = on ? `translate3d(${M.flyShift}px,0,0)` : 'none';
  };
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const instantly = (fn) => { hero.classList.add('no-anim'); fn(); void hero.offsetWidth; hero.classList.remove('no-anim'); };

  /* ---------- States ---------- */
  function resetToStart() {
    timers.forEach(clearTimeout); timers = []; done = false;
    instantly(() => {
      hero.classList.remove('s0', 's1', 's2', 's3', 's4');
      figure.classList.remove('is-rising', 'is-moving');
      nav.classList.add('is-hidden');
      measure(); splitWord(false); delaysIn();
      setFigure(M.introX, M.h * M.introScale + 80, M.introScale * 1.06);
      figure.style.setProperty('--fig-o', 0);
      counter.textContent = '000';
    });
    introBtn.textContent = 'Skip intro';
  }

  function showFinal() {
    timers.forEach(clearTimeout); timers = [];
    instantly(() => {
      measure();
      hero.classList.add('s0', 's1', 's2', 's3', 's4');
      splitWord(true);
      figure.classList.remove('is-rising', 'is-moving');
      setFigure(0, 0, 1); figure.style.setProperty('--fig-o', 1);
      nav.classList.remove('is-hidden');
    });
    done = true; introBtn.textContent = '↺ Replay intro';
  }

  function play() {
    resetToStart();
    // 0 — loader
    at(60, () => hero.classList.add('s0'));
    for (let k = 1; k <= 25; k++) at(60 + k * 48, () => {
      const t = k / 25, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      counter.textContent = String(Math.round(e * 100)).padStart(3, '0');
    });
    // 1 — wordmark rises in
    at(250, () => hero.classList.add('s1'));
    // 2 — WEB / FLY part, sculpture rises into the gap
    at(1500, () => { hero.classList.add('s2'); splitWord(true); });
    at(1600, () => {
      figure.classList.add('is-rising');
      figure.style.setProperty('--fig-o', 1);
      setFigure(M.introX, 0, M.introScale);
    });
    // 3 — wordmark leaves, sculpture glides right
    at(3600, () => { delaysOut(); hero.classList.add('s3'); });
    at(3750, () => { figure.classList.replace('is-rising', 'is-moving'); setFigure(0, 0, 1); });
    // 4 — headline, nav, badge
    at(4500, () => { hero.classList.add('s4'); nav.classList.remove('is-hidden'); });
    at(6500, () => { done = true; introBtn.textContent = '↺ Replay intro'; });
  }

  /* ---------- Smooth mouse parallax + idle float (one rAF loop) ---------- */
  const cursor = $('cursor');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, px = 0, py = 0;
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
  document.addEventListener('mouseover', (e) => cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .chip, .pcard')));
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick(t) {
    // cursor eases toward the mouse (mouse/trackpad devices only)
    if (finePointer && (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1)) {
      cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    }
    // sculpture drifts opposite the mouse + breathes — only while the hero is on screen
    if (scrollY < innerHeight * 1.1) {
      const settled = hero.classList.contains('s4');
      const tx = settled && finePointer ? (mx / innerWidth - 0.5) * -26 : 0;
      const ty = settled && finePointer ? (my / innerHeight - 0.5) * -14 : 0;
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      const breathe = settled && !reducedMotion ? Math.sin(t / 1000) * 6 : 0;
      figFloat.style.transform = `translate3d(${px.toFixed(2)}px,${(py + breathe).toFixed(2)}px,0)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---------- Magnetic main button ---------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px,0)`;
    });
    btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
  });

  /* ---------- Controls ---------- */
  introBtn.addEventListener('click', () => (done ? play() : showFinal()));
  addEventListener('resize', () => {
    if (!done) return;
    instantly(() => { measure(); splitWord(true); setFigure(0, 0, 1); });
  });

  /* ---------- Start once fonts + image are ready ---------- */
  const imgReady = figImg.complete ? Promise.resolve() : new Promise(r => { figImg.onload = r; figImg.onerror = r; });
  const KEY = 'wxf-intro-seen';
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* private mode: just play it */ }

  // scrolling during the intro skips straight to the finished hero — never trap the visitor
  addEventListener('scroll', () => { if (!done && !REC && scrollY > 60) showFinal(); }, { passive: true });

  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), imgReady]).then(() => {
    if (REC) { resetToStart(); window.__startIntro = play; return; }   // video recorder starts it
    if (reducedMotion || seen || scrollY > 60) { showFinal(); return; } // repeat visit, or reload mid-page
    play();
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  });
})();
