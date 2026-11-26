/* WebXFly — Pricing: cards assemble as you scroll (reveals + nav live in motion.js) */
(function () {
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const range=(p,a,b)=>clamp((p-a)/(b-a));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const easeOut=t=>1-Math.pow(1-t,3);

  const pin=document.getElementById('prPin');
  const cards=[...document.getElementById('pcards').children];
  const head=[document.getElementById('prKick'),document.getElementById('prTitle'),document.getElementById('prSub')];
  const rows=cards.map(c=>[...c.querySelectorAll('li')]);
  const nums=[...document.querySelectorAll('.price [data-n]')];
  const fmt=n=>'₹'+Math.round(n).toLocaleString('en-IN');

  const narrow=()=>innerWidth<980;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* positions measured once (offsetTop ignores transforms), refreshed on resize/load */
  const offTop=el=>{let t=0;for(let e=el;e;e=e.offsetParent)t+=e.offsetTop;return t;};
  let headTops=[],cardTops=[];
  function measure(){ headTops=head.map(offTop); cardTops=cards.map(offTop); }
  measure(); addEventListener('resize',measure); addEventListener('load',measure);
  if('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

  /* prices count up from ₹0 — one timed count per card, started when that card arrives */
  const COUNT_MS=1400;
  const counts=cards.map(c=>({els:[...c.querySelectorAll('[data-n]')],start:-1,e:-1}));
  const startCount=(i,now)=>{ if(counts[i].start<0) counts[i].start=now; };
  const resetCount=i=>{ counts[i].start=-1; };
  function tickCounts(now){
    counts.forEach(k=>{
      const e=reduced?1:(k.start<0?0:easeOut(clamp((now-k.start)/COUNT_MS)));
      if(e===k.e) return;                          // nothing changed — no DOM write
      k.e=e; k.els.forEach(n=>n.textContent=fmt(+n.dataset.n*e));
    });
  }

  // once a card has fully left the screen, reset it to ₹0 so it counts up again next time it's seen
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{
      if(en.isIntersecting) return;
      const i=cards.indexOf(en.target), k=counts[i];
      if(k.start<0) return;
      k.start=-1; k.e=0; k.els.forEach(n=>n.textContent=fmt(0));
    }));
    cards.forEach(c=>io.observe(c));
  }

  let lastY=null,lastNarrow=null;
  function render(y,now,m){
    const nw=narrow();
    if(y!==lastY||nw!==lastNarrow){ lastY=y; lastNarrow=nw; layout(y,m,nw,now); }
    tickCounts(now);
  }

  function layout(y,m,nw,now){
    if(nw){                  // phones: no pinning — each card animates as it scrolls into view
      head.forEach((el,i)=>{
        const t=clamp((innerHeight*0.92-(headTops[i]-y))/(innerHeight*0.20));
        el.style.opacity=t; el.style.transform=`translate3d(0,${((1-t)*22).toFixed(1)}px,0)`;
      });
      cards.forEach((c,i)=>{
        const top=cardTops[i]-y;
        const t=easeOut(clamp((innerHeight*0.88-top)/(innerHeight*0.30)));
        c.style.opacity=t;
        c.style.transform=`translate3d(0,${((1-t)*46).toFixed(1)}px,0) scale(${lerp(.95,1,t).toFixed(4)})`;
        rows[i].forEach((li,jj)=>{
          const rr=clamp(t*1.6-jj*0.09);
          li.style.opacity=rr; li.style.transform=`translate3d(${((1-rr)*-12).toFixed(1)}px,0,0)`;
        });
        if(t>0.45) startCount(i,now);              // price starts counting as the card settles
        else if(top>innerHeight) resetCount(i);    // scrolled back away → count again next time
      });
      return;
    }

    const p=clamp((y-m.top)/Math.max(1,m.h-m.inner));
    // header
    const h=easeOut(range(p,0,0.05));
    head.forEach((el,i)=>{
      const t=clamp(h*1.35-i*0.18);
      el.style.opacity=t; el.style.transform=`translate3d(0,${(1-t)*26}px,0)`;
    });
    // cards fly up and settle, one after another
    cards.forEach((c,i)=>{
      const a=easeOut(range(p,0.03+i*0.07,0.34+i*0.07));
      const lift=c.classList.contains('feat')?easeOut(range(p,0.56,0.80)):0;   // popular card rises clear
      c.style.opacity=a;
      c.style.transform=`translate3d(0,${(1-a)*160-lift*20}px,0) rotateX(${(1-a)*26}deg) scale(${(lerp(.9,1,a)+lift*.04).toFixed(4)})`;
      rows[i].forEach((li,j)=>{                                                 // features tick in
        const r=range(p,0.22+i*0.045+j*0.02,0.34+i*0.045+j*0.02);
        li.style.opacity=r; li.style.transform=`translate3d(${(1-r)*-14}px,0,0)`;
      });
      if(a>0.55) startCount(i,now);              // price counts up once the card has landed
      else if(p<=0) resetCount(i);               // back above the section → count again next time
    });
  }

  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    cards.forEach(c=>c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px');
    }));
  }

  WXF.add({ el: pin, render, live: true });   // live: keeps ticking while a price is counting (no writes once done)
})();
