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

  function render(p){
    if(narrow()){            // phones: no pinning — each card animates as it scrolls into view
      head.forEach(el=>{
        const r=el.getBoundingClientRect();
        const t=clamp((innerHeight*0.92-r.top)/(innerHeight*0.20));
        el.style.opacity=t; el.style.transform=`translate3d(0,${((1-t)*22).toFixed(1)}px,0)`;
      });
      cards.forEach((c,i)=>{
        const r=c.getBoundingClientRect();
        const t=easeOut(clamp((innerHeight*0.88-r.top)/(innerHeight*0.30)));
        c.style.opacity=t;
        c.style.transform=`translate3d(0,${((1-t)*46).toFixed(1)}px,0) scale(${lerp(.95,1,t).toFixed(4)})`;
        rows[i].forEach((li,jj)=>{
          const rr=clamp(t*1.6-jj*0.09);
          li.style.opacity=rr; li.style.transform=`translate3d(${((1-rr)*-12).toFixed(1)}px,0,0)`;
        });
      });
      const r0=cards[0].getBoundingClientRect();
      const cp=easeOut(clamp((innerHeight*0.85-r0.top)/(innerHeight*0.40)));
      nums.forEach(n=>n.textContent=fmt(+n.dataset.n*cp));
      return;
    }

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
    });
    // prices count up
    const cp=easeOut(range(p,0.08,0.46));
    nums.forEach(n=>n.textContent=fmt(+n.dataset.n*cp));
  }

  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    cards.forEach(c=>c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px');
    }));
  }

  const at=y=>render(clamp((y-pin.offsetTop)/Math.max(1,pin.offsetHeight-innerHeight)));
  WXF.add({ el: pin, render: at });
})();
