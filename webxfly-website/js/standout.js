/* WebXFly — 08 · Stand out from the noise (scroll-driven) */
(function () {
  const $ = (id) => document.getElementById(id);
  const clamp = (v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const range = (p,a,b)=>clamp((p-a)/(b-a));
  const lerp  = (a,b,t)=>a+(b-a)*t;
  const easeOut = t=>1-Math.pow(1-t,3);
  const back = t=>{const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};

  const sec=$('soSec'), scene=$('scene'), fig=$('fig'), figGrey=$('figGrey');
  const glow=$('glow'), pool=$('pool'), mark=$('mark'), ping=$('ping');
  const lines=[...document.querySelectorAll('.so-head .ln > span')];
  const side=document.querySelector('.so-head .side');
  const fTag=$('fTag'), fH=$('fH');

  function render(p, time){
    /* headline */
    const h=easeOut(range(p,0.01,0.18));
    lines.forEach((s,i)=>s.style.transform=`translate3d(0,${(1-clamp(h*1.3-i*0.3))*112}%,0)`);
    const sd=range(p,0.08,0.24);
    side.style.opacity=sd; side.style.transform=`translate3d(0,${(1-sd)*18}px,0)`;

    /* slow push into the crowd */
    const enter=easeOut(range(p,0,0.16));          // crowd arrives quickly, no long black hold
    scene.style.setProperty('--z', lerp(1.12,1.0,easeOut(range(p,0,0.40))).toFixed(4));
    scene.style.opacity=lerp(0.14,1,enter).toFixed(3);

    /* colour floods into the one that's yours */
    const lit=range(p,0.30,0.56);
    figGrey.style.opacity=1-easeOut(lit);
    glow.style.opacity=lit; glow.style.setProperty('--g', lerp(.5,1.05,easeOut(lit)).toFixed(3));
    pool.style.opacity=lit*.9;
    fig.style.setProperty('--s', lerp(1,1.1,easeOut(range(p,0.34,0.76))).toFixed(4));

    /* logo above its head */
    const m=range(p,0.46,0.62);
    mark.style.opacity=m; mark.style.setProperty('--m', back(m).toFixed(3));
    const rp=range(p,0.58,0.98);
    ping.style.opacity=(1-rp)*m*.85; ping.style.setProperty('--p', lerp(1,2.8,rp).toFixed(3));

    /* closing line */
    const f=easeOut(range(p,0.70,0.88));
    fTag.style.opacity=f; fTag.style.transform=`translate3d(0,${(1-f)*16}px,0)`;
    fH.style.opacity=f;   fH.style.transform=`translate3d(0,${(1-f)*22}px,0)`;
  }

  const at=(y,t)=>(render(clamp((y-sec.offsetTop)/(sec.offsetHeight-innerHeight)),t));
  WXF.add({ el: sec, render: at, live: true });   // live: the glow breathes continuously
})();
