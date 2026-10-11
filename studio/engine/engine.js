(()=>{
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
function S(t,a,p){const e=document.createElementNS(NS,t);if(a)for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(t,a,txt,p){const e=S(t,a,p);e.textContent=txt;return e;}
const CAM=$('cam'),PROPS=$('props'),CHARS=$('chars'),FX=$('fx'),TAGS=$('tags'),DARK=$('dark'),SPOTDIM=$('spotdim'),SPOTC=$('spotc'),stage=$('stage'),FADE=$('fade');

/* ================= engine ================= */
let clock=0,playing=false,lastT=null,jobs=[],turbo=false;const SPEED=location.hash==='#fast'?8:1;
function tween(ms,fn){if(turbo||!(ms>0)){fn(1);return Promise.resolve();}return new Promise(res=>{jobs.push({s:clock,d:ms,fn,res});fn(0);});}
const W=ms=>tween(ms,()=>{});
const all=(...p)=>Promise.all(p);
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const back=p=>{const c1=1.7,c3=c1+1;return 1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2);};
function frame(t){if(lastT===null)lastT=t;const dt=Math.min(80,t-lastT);lastT=t;if(playing)clock+=dt*SPEED;
  for(const j of jobs.slice()){const p=Math.min(1,(clock-j.s)/j.d);j.fn(p);if(p>=1){const i=jobs.indexOf(j);if(i>=0)jobs.splice(i,1);j.res();}}
  follow();apCam();requestAnimationFrame(frame);}

/* entities */
const E={};
function ent(id,el,d){const dd={x:d.x??0,y:d.y??0,s:d.s??1,o:d.o??0,flip:d.flip??1};el.setAttribute('data-id',id);const e={id,el,...dd,d:dd,fl:el.querySelector('.flipg')};E[id]=e;ap(e);return e;}
function ap(e){e.el.setAttribute('transform',`translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) scale(${Math.max(0,e.s).toFixed(3)})`);e.el.style.opacity=e.o;e.el.style.display=e.o<0.01?'none':'';if(e.fl)e.fl.setAttribute('transform',`scale(${e.flip} 1)`);}
function on(e,x,y,flip){e.x=x;e.y=y;if(flip)e.flip=flip;e.s=e.d.s;e.o=1;ap(e);return e;}
function off(...es){for(const e of es){e.o=0;drop(e);killBub(e,'say');killBub(e,'zz');killBub(e,'pill');ap(e);}}
async function pop(e,x,y,flip){if(e===E.badge)sfx('chime');on(e,x,y,flip);const s1=e.d.s;e.s=0;ap(e);await tween(420,p=>{e.s=s1*back(p);ap(e);});e.s=s1;ap(e);}
async function fadeOut(e,ms=600){const o0=e.o;await tween(ms,p=>{e.o=o0*(1-p);ap(e);});e.o=0;ap(e);drop(e);}
async function go(e,x,y,ms){const x0=e.x,y0=e.y;if(ms==null)ms=Math.max(400,Math.hypot(x-x0,y-y0)*2.6);await tween(ms,p=>{const q=ease(p);e.x=x0+(x-x0)*q;e.y=y0+(y-y0)*q;ap(e);});}
async function walk(e,x,y,ms){if(y==null)y=e.y;const x0=e.x,y0=e.y;if(Math.abs(x-x0)>3)e.flip=x<x0?-1:1;if(ms==null)ms=Math.max(500,Math.hypot(x-x0,y-y0)*4.6);
  /* anticipation: a small dip before the first step (animation principle) */
  if(!turbo){ap(e);e.el.classList.add('antic');await W(130);e.el.classList.remove('antic');}
  e.act=clock;e.el.classList.add('walk');let st=-1;
  await tween(ms,p=>{e.x=x0+(x-x0)*p;e.y=y0+(y-y0)*p;ap(e);const k=Math.floor(p*ms/250);if(k!==st){st=k;if(p<1)footstep(e);}});e.el.classList.remove('walk');}
/* foley: footsteps, quieter the further the character is from the centre of the shot */
function footstep(e){if(turbo||!AU.ctx)return;const [sx]=scr(e.x,e.y);const d=Math.min(1,Math.abs(sx-960)/1100);sfx('step',(1-d*.7)*(e===E.manager?1.15:1),(sx-960)/960);}
/* expressions: the face tells the story before the narrator does */
const MOUTH={smile:'M6 -153 q6 5 12 0',happy:'M3 -155 q9 10 18 0',worried:'M6 -150 q6 -5 12 0',shock:'M12 -156 a3.6 4.4 0 1 0 0.1 0',flat:'M6 -153 h12'};
const BROW={worried:'M4 -181 l12 -4',annoyed:'M4 -184 l13 5',shock:'M4 -184 q7 -5 14 0'};
function expr(e,k='smile'){const m=e.el.querySelector('.mouth'),b=e.el.querySelector('.brow');if(!m)return;
  m.setAttribute('d',MOUTH[k==='annoyed'?'flat':k]||MOUTH.smile);if(BROW[k]){b.setAttribute('d',BROW[k]);b.style.opacity=1;}else b.style.opacity=0;}
function face(e,f){e.flip=f;ap(e);}

let atts=[],bubs=[];
function carry(prop,host,dx=46,dy=-96,s){drop(prop);if(s!=null)prop.s=s;atts.push({prop,host,dx,dy});prop.o=1;}
function drop(prop){atts=atts.filter(a=>a.prop!==prop);}
function killBub(e,kind){bubs=bubs.filter(b=>{if(b.host===e&&b.kind===kind){b.g.remove();return false;}return true;});}
function follow(){
  for(const a of atts){a.prop.x=a.host.x+a.dx*a.host.flip;a.prop.y=a.host.y+a.dy;ap(a.prop);}
  for(const b of bubs){b.g.setAttribute('transform',`translate(${(b.host.x+(b.dx||0)).toFixed(1)} ${(b.host.y-(b.h||282)).toFixed(1)})`);b.g.style.display=b.host.o<0.01?'none':'';}
  for(const L of LAMPS){if(L.lock&&L.t)L.x=L.t.x;drawLamp(L);}
  for(const c of CPUS){const lit=LAMPS.some(L=>L.t===c);c.el.classList.toggle('lit',lit);}
  declutter();
}
/* name pills never overlap: when two collide, whoever acted most recently keeps the label (then by rank) */
const TAG_RANK=['mira','manager','priya','arjun','leela','startup','supervisor','cleaner','helper','courier','host'];
function declutter(){const shown=[];
  const order=TAG_RANK.slice().sort((a,b)=>((E[b].act||0)-(E[a].act||0))||(TAG_RANK.indexOf(a)-TAG_RANK.indexOf(b)));
  for(const id of order){const e=E[id];if(!e||!e.tg)continue;let on=e.tagWant&&e.o>0.01;
    if(on){const a=e.x-e.tgw/2-8,b=e.x+e.tgw/2+8;if(shown.some(([l,r])=>a<r&&b>l))on=false;else shown.push([a,b]);}
    e.tg.style.display=on?'':'none';}}
function say(e,text,ms=2800){killBub(e,'say');e.act=clock;
  {const k='@'+e.id+'|'+text,v=VD[k];if(v&&!turbo&&VOICE_ON&&AU.ctx){const d=v[0]*1000;ms=Math.max(ms,d+600);if(clock>=narrUntil)dlgUntil=Math.max(dlgUntil,clock+d);playLine(v,'d:'+k,e);}}const g=S('g',{},FX);const inner=S('g',{class:'popin'},g);
  const w=Math.max(64,text.length*12.4+36),h=50;
  S('rect',{x:-w/2,y:-h,width:w,height:h,rx:18,class:'bub'},inner);
  S('path',{d:'M-10 -2 L0 16 L10 -2Z',class:'bub'},inner);
  S('rect',{x:-12,y:-6,width:24,height:6,fill:'#F3EEE4'},inner);
  T('text',{x:0,y:-h/2+8,'text-anchor':'middle',class:'bubt'},text,inner);
  const b={g,host:e,kind:'say'};bubs.push(b);follow();
  W(ms).then(()=>{if(bubs.includes(b)){g.remove();bubs=bubs.filter(x=>x!==b);}});}
function zz(e,v){killBub(e,'zz');e.el.classList.toggle('sleep',!!v);if(!v)return;const g=S('g',{},FX);
  T('text',{x:26,y:0,class:'zzz'},'z',g);T('text',{x:46,y:-22,class:'zzz',style:'animation-delay:.6s'},'z',g);T('text',{x:68,y:-46,class:'zzz',style:'animation-delay:1.2s'},'Z',g);
  bubs.push({g,host:e,kind:'zz',h:200});follow();}
function pill(e,text){killBub(e,'pill');if(!text)return;const g=S('g',{},FX);const w=text.length*9+26;S('rect',{x:-w/2,y:-28,width:w,height:28,rx:14,class:'rdy'},g);T('text',{x:0,y:-9,'text-anchor':'middle',class:'rdyt'},text,g);bubs.push({g,host:e,kind:'pill',h:300});follow();}
function tag(x,y,text,cls='t-paper',fs=20){const g=S('g',{transform:`translate(${x} ${y})`},TAGS);const inner=S('g',{class:'popin'},g);
  const w=text.length*fs*0.62+30,h=fs+18;S('rect',{x:-w/2,y:-h,width:w,height:h,rx:h/2,class:'tagr '+cls},inner);
  T('text',{x:0,y:-h/2+fs*0.36,'text-anchor':'middle',class:'tagt '+cls,style:`font-size:${fs}px`},text,inner);return g;}
function clearTags(){TAGS.innerHTML='';}
async function mapLine(x1,y1,x2,y2,cls){const p=S('path',{d:`M${x1} ${y1} C${x1+40} ${y1-160} ${x2-80} ${y2-140} ${x2} ${y2}`,class:'map '+cls},FX);
  if(turbo){p.remove();return p;}
  const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;await tween(1100,q=>{p.style.strokeDashoffset=L*(1-ease(q));});p.style.strokeDasharray='12 9';p.style.strokeDashoffset=0;return p;}

/* camera */
const cam={x:960,y:540,z:1};
let HAND=0,shakeAt=-1e9,shakeAmp=0;
function shake(a=14){if(!turbo){shakeAt=clock;shakeAmp=a;}}
function apCam(){let hx=0,hy=0;if(!turbo){const t=clock/1000;hx=HAND*(Math.sin(t*.9)*1.0+Math.sin(t*2.3+1)*.45);hy=HAND*(Math.sin(t*1.3+2)*.8+Math.sin(t*3.1)*.3);
  const k=(clock-shakeAt)/650;if(k<1){const a=shakeAmp*(1-k)*(1-k);hx+=a*Math.sin(clock*.09);hy+=a*Math.cos(clock*.113);}}
  CAM.setAttribute('transform',`translate(${(960+hx).toFixed(2)} ${(515+hy).toFixed(2)}) scale(${cam.z.toFixed(4)}) translate(${(-cam.x).toFixed(1)} ${(-(cam.y+40)).toFixed(1)})`);}
/* framing rule for every shot: chefs' heads stay above the subtitles, and inside the kitchen
   the shelf labels, stamps and the page being worked on stay below the top strip.
   Visible safe band on screen: y 119..902 of 1080 (top info strip, subtitles). */
function safe(x,y,z){
  const fridge=x>1150&&x<1480, kitchen=x>480&&x<1500;
  if(fridge&&z>1.55)z=1.55;
  const lo=720-387/z;                 /* world y 760 (heads and shoulders) at the safe bottom */
  if(y<lo)y=lo;
  if(kitchen&&z<=1.598){const hi=230+396/z;if(y>hi)y=Math.max(lo,hi);}   /* world y 270 at the safe top */
  return [x,y,z];}
function setCam(x,y,z){[cam.x,cam.y,cam.z]=safe(x,y,z);apCam();}
function camTo(x,y,z,ms=2000){[x,y,z]=safe(x,y,z);const a={...cam};return tween(ms,p=>{const q=ease(p);cam.x=a.x+(x-a.x)*q;cam.y=a.y+(y-a.y)*q;cam.z=a.z+(z-a.z)*q;apCam();});}
function scr(x,y){return [(x-cam.x)*cam.z+960,(y-cam.y-40)*cam.z+515];}

/* lamps = CPU cores */
const LAMPS=[],CPUS=[];
for(let i=0;i<4;i++){const beam=S('polygon',{class:'beam'},$('beams'));const fx=S('g',{},$('fixtures'));
  S('rect',{x:-32,y:-16,width:64,height:24,rx:6,class:'lampcap'},fx);S('ellipse',{cx:0,cy:10,rx:22,ry:6,class:'lampbulb'},fx);
  T('text',{x:0,y:-24,'text-anchor':'middle',class:'lbl small'},'CORE '+i,fx);
  LAMPS.push({beam,fx,x:300+i*200,t:null,lock:false,d:300+i*200});}
function drawLamp(L){L.fx.setAttribute('transform',`translate(${L.x.toFixed(1)} 198)`);const on=!!L.t;
  L.beam.setAttribute('points',`${(L.x-16).toFixed(1)},210 ${(L.x+16).toFixed(1)},210 ${(L.x+96).toFixed(1)},905 ${(L.x-96).toFixed(1)},905`);
  L.beam.style.opacity=on?1:0;L.fx.classList.toggle('on',on);}
function hop(i,target,ms=1000){const L=LAMPS[i];L.lock=false;L.t=target;if(!target){drawLamp(L);return Promise.resolve();}
  const x0=L.x;return tween(ms,p=>{L.x=x0+(target.x-x0)*ease(p);drawLamp(L);}).then(()=>{L.lock=true;});}
function lampsOff(){for(const L of LAMPS){L.t=null;L.lock=false;drawLamp(L);}}

/* lights, notebook, ledger */
/* a blackout is a beat, not a scene: one second of black, then dim blue emergency light so the viewer can still see the story */
const EMER=.45;
async function powerOff(){if(turbo){DARK.classList.add('emer');DARK.style.opacity=EMER;return;}silence(true);sfx('powerdown');shake(18);DARK.classList.remove('emer');
  for(const v of [.85,.15,.9,.35,1]){DARK.style.opacity=v;await W(110);}DARK.style.opacity=1;await W(900);
  DARK.classList.add('emer');await tween(700,p=>{DARK.style.opacity=1-(1-EMER)*p;});}
async function powerOn(){if(turbo){DARK.style.opacity=0;DARK.classList.remove('emer');return;}silence(false);sfx('powerup');DARK.style.opacity=.6;await W(160);DARK.style.opacity=.2;await W(120);DARK.style.opacity=0;DARK.classList.remove('emer');}
async function alarm(n=3){sfx('alarm');shake(10);DARK.classList.add('red');for(let i=0;i<n;i++){DARK.style.opacity=.45;await W(260);DARK.style.opacity=0;await W(260);}DARK.classList.remove('red');DARK.style.opacity=0;}
const NB=$('nblines');let nbn=0;
function note(t,cls='nbt'){sfx('scribble');T('text',{x:-92,y:-48+nbn*15.5,class:cls+(turbo?'':' nbnew')},t,NB);nbn++;}
function nbClear(){NB.innerHTML='';nbn=0;}
function ledger(t,cls=''){const r=$('ledgerRow');r.textContent=t;r.setAttribute('class','ledger '+cls);}

/* subtitles, cards, fades */
const CAP=$('caption');let capsOn=true,capText='';
let collecting=false,curSeq=0;const SCRIPT=[];
function cap(t){capText=t;CAP.textContent=t;CAP.style.visibility=(t&&capsOn)?'visible':'hidden';}
function readMs(t){const w=t.trim().split(/\s+/).length;return Math.max(2400,950+w*370);}
let ENG=false;
function vo(t,e){if(e&&!ENG)return Promise.resolve();if(collecting)(SCRIPT[curSeq]=SCRIPT[curSeq]||[]).push(t);
  return (async()=>{
    /* never talk over a character: wait for their line to finish */
    if(!turbo&&clock<dlgUntil)await W(dlgUntil-clock+150);
    cap(t);const own=OWN_ON&&TAKES[t],v=own||VD[t];
    if(!turbo&&VOICE_ON&&v){const d=(v.d??v[0])*1000;narrUntil=clock+d;playVoice(v,own?'t:'+own.url:'v:'+t);return W(Math.max(1500,d+550));}
    return W(readMs(t));})();}
let OWN_ON=false;const TAKES={};
function setFade(v){FADE.style.opacity=v;}
/* the look of a scene: colour grade, scope letterbox, handheld camera */
const FRAME=$('frame');
function look(g,scope=false,hand=0){FRAME.classList.remove('g-warm','g-teal','g-cold','g-noir','g-dawn');if(g&&g!=='none')FRAME.classList.add('g-'+g);FRAME.classList.toggle('scope',!!scope);HAND=hand;}
function fadeBlack(ms=900){const a=+FADE.style.opacity||0;return tween(ms,p=>setFade(a+(1-a)*p));}
function fadeClear(ms=1200){const a=+FADE.style.opacity||0;return tween(ms,p=>setFade(a*(1-p)));}
async function actCard(a,b,q){cap('');sfx('whoosh');await fadeBlack(900);if(MD.sting_act)sting('sting_act');else sfx('boom');$('acA').textContent=a;$('acB').textContent=b;$('acQ').textContent=q||'';$('actcard').hidden=false;await W(q?3200:2200);$('actcard').hidden=true;}
const TRK={f:'trF',d:'trD',n:'trN'};
function track(o,quiet){for(const k in o){const el=$(TRK[k]);if(el.textContent!==o[k]){el.textContent=o[k];if(!turbo&&!quiet){const ti=el.parentNode;ti.classList.remove('flash');void ti.offsetWidth;ti.classList.add('flash');}}}}
async function pulseTrack(){if(turbo)return;$('track').classList.add('pulse');await W(2600);$('track').classList.remove('pulse');}
function title(eb,t,sub){$('tcEb').textContent=eb||'';$('tcT').textContent=t||'';const s=$('tcS');s.textContent=sub||'';s.hidden=!sub;$('titlecard').hidden=false;sfx('shimmer');}
function untitle(){$('titlecard').hidden=true;}
function spotTo(x,y,r){const [sx,sy]=scr(x,y);SPOTC.setAttribute('cx',sx.toFixed(1));SPOTC.setAttribute('cy',sy.toFixed(1));SPOTC.setAttribute('r',(r*cam.z).toFixed(1));}
function spotLevel(v,ms=500){const a=+SPOTDIM.style.opacity||0;return tween(ms,p=>{SPOTDIM.style.opacity=a+(v-a)*p;});}
async function introAt(x,y,r,name,role,line,kind=''){if(turbo)return;cap('');spotTo(x,y,r);
  const c=$('intro');c.className='intro '+kind;$('inN').textContent=name;$('inR').textContent=role;$('inL').textContent=line;
  await spotLevel(.78,500);c.classList.add('show');sfx('pop');await W(4000);c.classList.remove('show');await spotLevel(0,500);}
function showTag(e,v){if(e.tg)e.tagWant=!!v;}
async function intro(e,name,role,line,kind=''){showTag(e,true);e.act=clock;if(e===E.mira)sfx('mira');else if(e===E.manager)sfx('manager');await introAt(e.x,e.y-110,150,name,role,line,kind);}
async function whatIf(label,fn){sfx('whoosh');const l=$('wilabel');l.textContent=label;l.hidden=false;stage.classList.add('whatif');await W(900);await fn();await W(600);stage.classList.remove('whatif');l.hidden=true;await W(600);}
