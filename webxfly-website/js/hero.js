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
  const content = document.querySelector('.hero__content');

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
  wordLetters.forEach((l, i) => l.style.setProperty('--i', i));
  // impact sparks: thin streaks in brand red / black / silver
  const sparkBox = $('xsparks'), sparks = [];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('i');
    el.style.setProperty('--a', (i * 360 / 22 + (i % 3) * 7) + 'deg');
    el.style.setProperty('--l', 10 + (i * 13 % 22) + 'px');
    el.style.setProperty('--c', ['#e11d2e', '#111', '#b9bec4', '#ff4757'][i % 4]);
    el.style.setProperty('--dl', (i % 5) * 0.02 + 's');
    sparkBox.appendChild(el); sparks.push(el);
  }
  welcomeLetters.forEach((s, i) => (s.style.transitionDelay = i * 0.04 + 's'));
  const mid = (wordLetters.length - 1) / 2;
  const delaysIn  = () => wordLetters.forEach((s, i) => (s.style.transitionDelay = 0.22 + i * 0.06 + 's'));
  const delaysOut = () => wordLetters.forEach((s, i) => (s.style.transitionDelay = Math.abs(i - mid) * 0.05 + 's'));

  /* ---------- Measure + place everything for this screen ---------- */
  function measure() {
    const vw = innerWidth, vh = Math.max(innerHeight, 620), mobile = vw <= 760;

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

    // phones: the sculpture sits below the text, never on top of it. On short phones the hero
    // grows a little taller than the screen (scroll to see the rest) instead of overlapping.
    let lift = 0;
    if (mobile) {
      const textBottom = content.offsetTop + content.offsetHeight + 14;
      const minFig = vh * 0.4;
      let room = vh - textBottom;
      if (room < minFig) { lift = Math.ceil(textBottom + minFig - vh); room = minFig; }
      h = Math.min(h, room); w = h * RATIO;
    }
    hero.style.minHeight = lift ? vh + lift + 'px' : '';
    hero.style.setProperty('--lift', lift + 'px');
    hero.style.setProperty('--screen-h', lift ? innerHeight + 'px' : '100%');
    hero.style.setProperty('--intro-top', lift ? innerHeight / 2 + 'px' : '50%');
    const right = mobile ? (vw - w) / 2 : rightGap;
    figure.style.setProperty('--fig-h', h + 'px');
    figure.style.setProperty('--fig-right', right + 'px');

    // intro sculpture — centred and a little bigger
    let ih = vh * (mobile ? 0.6 : 0.86);
    if (ih * RATIO > vw * 0.9) ih = (vw * 0.9) / RATIO;
    const centreX = vw - right - w / 2;

    // how far WEB and FLY must part so the sculpture fits between them
    [gWeb, gX, gFly].forEach(g => (g.style.transform = 'none'));
    const r = gX.getBoundingClientRect();            // the X's slot, ignoring any spin in progress
    const xs = Math.min(3.2, Math.max(1.15, (Math.min(vw, innerHeight) * (mobile ? 0.27 : 0.2)) / (r.height || 1)));
    const half = ih * RATIO * 0.42, rWeb = gWeb.getBoundingClientRect(), rFly = gFly.getBoundingClientRect();
    const webShift = Math.max(vw / 2 - half - rWeb.right, vw * 0.02 - rWeb.left);
    const flyShift = Math.min(vw / 2 + half - rFly.left, vw * 0.98 - rFly.right);
    gX.style.transform = '';                            // let the CSS scale the X again
    if (mobile) {
      // phones: the outline X drops out of the word and stands behind the sculpture — as tall as
      // the sculpture and centred on it, so its arms frame the head on both sides (like desktop)
      const cy = r.top + r.height / 2 - vh * 0.27;      // X centre once the word has lifted
      const figMid = vh - ih / 2;                        // sculpture centre during the intro (bottom sits at vh)
      word.style.setProperty('--x-scale', ((ih * 1.04) / (gX.offsetHeight || 1)).toFixed(3));
      word.style.setProperty('--x-dy', figMid - cy + 'px');
      // and sideways onto the head (it sits a touch left of the image centre)
      word.style.setProperty('--x-dx', vw / 2 - ih * RATIO * 0.03 - (r.left + r.width / 2) + 'px');
    } else {
      word.style.setProperty('--x-scale', Math.max(2.6, (ih * RATIO * 1.2) / (gX.offsetWidth || 1)).toFixed(2));
      word.style.setProperty('--x-dy', '0px');
      word.style.setProperty('--x-dx', '0px');
    }

    // ghost wordmark centred behind the settled sculpture
    ghost.style.setProperty('--ghost-size', '100px');
    const g100 = ghost.scrollWidth || 1, gw = w * 1.45;
    ghost.style.setProperty('--ghost-size', (100 * gw) / g100 + 'px');
    ghost.style.setProperty('--ghost-x', centreX - gw / 2 + 'px');

    // badge: just left of the sculpture's head
    // phones: in the empty space to the right of the buttons; desktop: just left of the sculpture's head
    if (mobile) {
      // beside the buttons if they leave room, else on the sculpture's shoulder, else hidden
      const actions = content.querySelector('.actions'), B = 90, bx = vw - B - 14;
      const usedRight = content.offsetLeft + Math.max(...[...actions.children].map(c => c.offsetLeft + c.offsetWidth));
      const figTop = vh + lift - h, waTop = innerHeight - 96;
      let by = -1;
      if (usedRight + 10 < bx) by = content.offsetTop + actions.offsetTop + (actions.offsetHeight - B) / 2;
      else if (figTop + 8 + B < waTop) by = figTop + 8;
      badge.classList.toggle('is-off', by < 0);
      hero.style.setProperty('--badge-x', bx + 'px');
      hero.style.setProperty('--badge-y', Math.max(0, by) + 'px');
    } else {
      // just left of the sculpture's head, but never on top of the label or headline
      const textRight = Math.max(...[...content.querySelectorAll('.kicker span, .title .line > span')].map(e => e.getBoundingClientRect().right));
      const bx = Math.max(10, vw - right - w - 110, textRight + 16);
      badge.classList.toggle('is-off', bx + 118 > vw - 8);
      hero.style.setProperty('--badge-x', bx + 'px');
      hero.style.setProperty('--badge-y', vh * 0.2 + 'px');
    }

    // prelude: how far the X must move to sit dead-centre, and how big it spins
    hero.style.setProperty('--xdx', vw / 2 - (r.left + r.width / 2) + 'px');
    hero.style.setProperty('--xdy', innerHeight / 2 - (r.top + r.height / 2) + 'px');
    hero.style.setProperty('--xs', xs.toFixed(3));
    const ring = Math.round(r.height * xs * 1.75);
    hero.style.setProperty('--ring', ring + 'px');
    hero.style.setProperty('--xfs', parseFloat(word.style.fontSize) * xs + 'px');
    sparks.forEach((el, i) => { el.style.setProperty('--r0', ring * 0.32 + 'px'); el.style.setProperty('--d', ring * (0.85 + (i * 37 % 11) / 14) + 'px'); });
    // where each WEB / FLY letter flies in from (WEB from the left, FLY swoops in from the upper right)
    wordLetters.forEach((s2, i) => {
      if (s2.closest('.g--x')) return;
      const fly = !!s2.closest('.g--fly'), k = fly ? i - 4 : 2 - i;
      s2.style.setProperty('--fx', (fly ? 1 : -1) * vw * (0.18 + k * 0.11) + 'px');
      s2.style.setProperty('--fy', (fly ? -1 : 1) * innerHeight * [0.34, -0.22, 0.4][k] + 'px');
      s2.style.setProperty('--fr', (fly ? 1 : -1) * [48, -32, 70][k] + 'deg');
      s2.style.setProperty('--fry', (fly ? -1 : 1) * [85, 60, 95][k] + 'deg');
    });

    M = { vw, vh, h, mobile, lift, introScale: ih / h, introX: vw / 2 - centreX, webShift, flyShift };
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
      hero.classList.remove('x0', 'x1', 's0', 's1', 's2', 's3', 's4');
      figure.classList.remove('is-rising', 'is-moving');
      nav.classList.add('is-hidden');
      measure(); splitWord(false); delaysIn();
      setFigure(M.introX, M.h * M.introScale + 80 - M.lift, M.introScale * 1.06);
      figure.style.setProperty('--fig-o', 0);
      counter.textContent = '000';
    });
    introBtn.textContent = 'Skip intro';
  }

  function showFinal() {
    timers.forEach(clearTimeout); timers = [];
    instantly(() => {
      measure();
      hero.classList.remove('x0', 'x1');
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
    // 0 — a lone chrome-red X spins with motion trails while the dial draws (doubles as the loader)
    at(60, () => hero.classList.add('s0', 'x0'));
    for (let k = 1; k <= 25; k++) at(160 + k * 74, () => {
      const t = k / 25, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      counter.textContent = String(Math.round(e * 100)).padStart(3, '0');
    });
    // impact — flash, shockwaves, sparks, shake; X glides into its slot
    at(2050, () => hero.classList.replace('x0', 'x1'));
    // 1 — WEB and FLY letters fly in from all sides, silver glint runs across
    at(2450, () => hero.classList.add('s1'));
    // 2 — WEB / FLY smear apart, sculpture rises into the gap
    at(4500, () => { hero.classList.remove('x1'); hero.classList.add('s2'); splitWord(true); });
    at(4600, () => {
      figure.classList.add('is-rising');
      figure.style.setProperty('--fig-o', 1);
      setFigure(M.introX, -M.lift, M.introScale);
    });
    // 3 — wordmark leaves, sculpture glides right
    at(6600, () => { delaysOut(); hero.classList.add('s3'); });
    at(6750, () => { figure.classList.replace('is-rising', 'is-moving'); setFigure(0, 0, 1); });
    // 4 — headline, nav, badge
    at(7500, () => { hero.classList.add('s4'); nav.classList.remove('is-hidden'); });
    at(9500, () => { done = true; introBtn.textContent = '↺ Replay intro'; });
  }

  /* ---------- Smooth mouse parallax + idle float (one rAF loop) ---------- */
  const cursor = $('cursor');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, px = 0, py = 0;
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
  document.addEventListener('mouseover', (e) => cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .chip, .pcard, .rail-wrap')));
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
  // Phones fire 'resize' every time the address bar slides in or out while you scroll.
  // Re-laying out the hero then makes the whole page jump — so on touch screens only a
  // real width change (rotation, split screen) triggers a re-measure.
  let lastW = innerWidth;
  const touch = matchMedia('(pointer: coarse)').matches;
  addEventListener('resize', () => {
    if (touch && innerWidth === lastW) return;
    lastW = innerWidth;
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
