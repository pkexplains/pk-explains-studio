/* ================= Episode 2 · Cooking Without Waiting · world additions =================
   New in this episode (series/bible.md, ep 2): the Runners (I/O workers), order tickets, the ticket hook
   (a backend's in-flight reads), the ticket rail and pickup shelf (io_uring), the storeroom hatches (the
   disk's parallel queues), Priya's phone with a progress ring and the Loan Officer on the line.
   Everything is drawn with the shared rig (makeChar) and the series colour families. */

/* ---- places ---- */
const MX=1160;          /* Mira's work spot tonight: beside the fridge */
const HX=1085;          /* the ticket hook */
const DOORX=1655;       /* the Manager at the storeroom door */
const CORR=1560;        /* the corridor, where a Runner waits */

/* ---- the set: drawn into the camera layer, behind the props ---- */
const SET2=S('g',{},null);CAM.insertBefore(SET2,$('beams'));
const sty=s=>({style:s});
/* storeroom hatches: eight clerks who can all fetch at once */
const HATCH=[];
for(let i=0;i<8;i++){const x=1724+(i%4)*47,y=410+Math.floor(i/4)*62;const g=S('g',{transform:`translate(${x} ${y})`},SET2);
  const fr=S('rect',{x:0,y:0,width:38,height:52,rx:4,style:'fill:#0C1719;stroke:#2E5E57;stroke-width:2'},g);
  const head=S('circle',{cx:19,cy:20,r:8,style:'fill:#5E8D88'},g);
  const body=S('rect',{x:9,y:28,width:20,height:20,rx:6,style:'fill:#2E5E57'},g);
  const box=S('rect',{x:11,y:34,width:16,height:12,rx:2,style:'fill:#F2C14E;stroke:#14121D;stroke-width:1.5;display:none'},g);
  HATCH.push({g,fr,head,body,box,busy:false});}
T('text',{x:1808,y:546,'text-anchor':'middle',class:'lbl small'},'HATCHES · parallel queues',SET2);
function hatch(i,busy){const h=HATCH[i];if(!h)return;h.busy=!!busy;
  h.fr.style.fill=busy?'#1E4A44':'#0C1719';h.fr.style.stroke=busy?'#3FC1B0':'#2E5E57';
  h.head.style.fill=busy?'#BFF3EA':'#5E8D88';h.body.style.fill=busy?'#3FC1B0':'#2E5E57';h.box.style.display=busy?'':'none';
  const n=HATCH.filter(x=>x.busy).length;track({n:n+'/8'},true);}
function hatchesOff(){for(let i=0;i<8;i++)hatch(i,false);}
/* the ticket hook beside Mira's spot */
S('rect',{x:HX-5,y:640,width:10,height:260,rx:4,style:'fill:#6E6886'},SET2);
S('path',{d:`M${HX} 646 h46 v14`,style:'fill:none;stroke:#C9A96E;stroke-width:6;stroke-linecap:round'},SET2);
T('text',{x:HX,y:628,'text-anchor':'middle',class:'lbl small'},'TICKET HOOK',SET2);
/* the ticket rail through the Manager's hatch (io_uring): hidden until the other kitchen is shown */
const RAIL=S('g',{style:'display:none'},SET2);
S('rect',{x:300,y:600,width:250,height:150,rx:10,style:'fill:#1A2340;stroke:#7FA8FF;stroke-width:4'},RAIL);
T('text',{x:425,y:590,'text-anchor':'middle',class:'lbl small'},"MANAGER'S HATCH",RAIL);
S('line',{x1:330,y1:640,x2:1130,y2:640,style:'stroke:#AEB6C8;stroke-width:7;stroke-linecap:round'},RAIL);
T('text',{x:880,y:626,'text-anchor':'middle',class:'lbl small'},'TICKET RAIL · requests',RAIL);
S('line',{x1:330,y1:780,x2:1000,y2:780,style:'stroke:#7FA8FF;stroke-width:7;stroke-linecap:round'},RAIL);
T('text',{x:760,y:808,'text-anchor':'middle',class:'lbl small'},'PICKUP SHELF · results',RAIL);
const LOCK=S('g',{style:'display:none',transform:'translate(700 650)'},RAIL);
S('path',{d:'M-16 -6 v-14 a16 16 0 0 1 32 0 v14',style:'fill:none;stroke:#E8E4EE;stroke-width:6'},LOCK);
S('rect',{x:-24,y:-6,width:48,height:40,rx:6,style:'fill:#E5484D;stroke:#14121D;stroke-width:2'},LOCK);
function railOn(v){RAIL.style.display=v?'':'none';if(!v)LOCK.style.display='none';}

/* ---- the Runners: I/O worker processes (io_method = worker, io_workers = 3) ---- */
function trolley(e){const f=e.el.querySelector('.flipg');const g=S('g',{},f);
  S('line',{x1:30,y1:-96,x2:44,y2:-40,style:'stroke:#6E6886;stroke-width:5;stroke-linecap:round'},g);
  S('rect',{x:38,y:-46,width:52,height:30,rx:4,style:'fill:#3A3550;stroke:#CFC8DD;stroke-width:2'},g);
  S('circle',{cx:48,cy:-8,r:8,style:'fill:#14121D;stroke:#CFC8DD;stroke-width:2'},g);S('circle',{cx:80,cy:-8,r:8,style:'fill:#14121D;stroke:#CFC8DD;stroke-width:2'},g);}
makeChar('runner',{color:'#F08A6C',hat:'cap',capc:'#8A3B28',tag:'Runner · I/O worker',hideTag:1});
makeChar('runner2',{color:'#E37658',hat:'cap',capc:'#8A3B28'});
makeChar('runner3',{color:'#F49B80',hat:'cap',capc:'#8A3B28'});
const {runner,runner2,runner3}=E;
for(const r of [runner,runner2,runner3])trolley(r);
TAG_RANK.push('runner');
/* extra chefs for the "a chef per page" what-if: no names, no voices */
const CROWD=[];for(let i=0;i<6;i++){makeChar('crowd'+i,{color:['#C9705A','#D98268','#BF6650','#E8694A','#F59A7C','#D4765E'][i],hat:'chef',apron:true});CROWD.push(E['crowd'+i]);}

/* ---- props ---- */
function ticket(id,text){const g=S('g',{},PROPS);S('rect',{x:-34,y:0,width:68,height:44,rx:3,style:'fill:#F6F0E2;stroke:#14121D;stroke-width:2'},g);
  S('line',{x1:-26,y1:30,x2:26,y2:30,style:'stroke:#B8432A;stroke-width:2;stroke-dasharray:4 3'},g);
  const t=T('text',{x:0,y:20,'text-anchor':'middle',style:'font:800 13px var(--mono);fill:#14121D'},text,g);const e=ent(id,g,{x:0,y:0});e.txt=t;return e;}
function crate(id,text){const g=S('g',{},PROPS);S('rect',{x:-30,y:-40,width:60,height:40,rx:4,style:'fill:#3FC1B0;stroke:#0E3B36;stroke-width:2.5'},g);
  S('line',{x1:-30,y1:-26,x2:30,y2:-26,style:'stroke:#0E3B36;stroke-width:2'},g);
  const t=T('text',{x:0,y:-8,'text-anchor':'middle',style:'font:800 12px var(--mono);fill:#0B1F1C'},text,g);const e=ent(id,g,{x:0,y:0});e.txt=t;return e;}
const TK={};for(const r of ['43','43–50','51–58','59–66','67–74','44','45'])TK[r]=ticket('tk'+r,'p.'+r);
const CR={};for(const r of ['43','44','45','43–50','51–58','59–66','67–74'])CR[r]=crate('cr'+r,'p.'+r);
/* the company shelf (shared buffers): what is ready for Mira; the Manager's shelf (page cache): his guesses */
const SHELF=[1268,1330,1396,1460];
const READYT=[];for(let i=0;i<4;i++){const g=S('g',{style:'display:none',transform:`translate(${SHELF[i]} 428)`},SET2);
  S('rect',{x:-27,y:-44,width:54,height:42,rx:4,style:'fill:#3FC1B0;stroke:#0E3B36;stroke-width:2'},g);const t=T('text',{x:0,y:-18,'text-anchor':'middle',style:'font:800 11px var(--mono);fill:#0B1F1C'},'',g);READYT.push({g,t});}
function shelfSlot(i,text){const s=READYT[i];if(!s)return;s.g.style.display=text?'':'none';s.t.textContent=text||'';}
function shelfClear(){for(let i=0;i<4;i++)shelfSlot(i,'');}
const GUESS=[];for(let i=0;i<3;i++){const g=S('g',{style:'display:none',transform:`translate(${SHELF[i]} 638)`},SET2);
  S('rect',{x:-27,y:-44,width:54,height:42,rx:4,style:'fill:#7FA8FF;stroke:#14121D;stroke-width:2'},g);const t=T('text',{x:0,y:-18,'text-anchor':'middle',style:'font:800 11px var(--mono);fill:#14121D'},'',g);GUESS.push({g,t});}
function guessSlot(i,text){const s=GUESS[i];if(!s)return;s.g.style.display=text?'':'none';s.t.textContent=text||'';}
/* the order slip for the "scattered rows" picture */
const scat=ent('scat',(()=>{const g=S('g',{},PROPS);S('rect',{x:-210,y:-70,width:420,height:70,rx:6,class:'slip'},g);
  T('text',{x:0,y:-44,'text-anchor':'middle',style:'font:700 13px var(--mono);fill:#6E6886'},'IF HER ROWS WERE SCATTERED',g);
  T('text',{x:0,y:-18,'text-anchor':'middle',class:'slipt'},'next: p.61 · p.12 · p.70 · p.3',g);return g;})(),{x:0,y:0});
/* Priya's phone: the statement's progress ring */
const RING=(()=>{const g=S('g',{},PROPS);S('rect',{x:-150,y:-150,width:300,height:150,rx:22,class:'badge',style:'fill:#1A1726;stroke:#CFC8DD'},g);
  S('circle',{cx:-90,cy:-75,r:40,style:'fill:none;stroke:#3A3550;stroke-width:10'},g);
  const arc=S('circle',{cx:-90,cy:-75,r:40,transform:'rotate(-90 -90 -75)',style:'fill:none;stroke:#3FC1B0;stroke-width:10;stroke-linecap:round;stroke-dasharray:251.3;stroke-dashoffset:251.3'},g);
  const tick=T('text',{x:-90,y:-63,'text-anchor':'middle',style:'font:800 34px var(--body);fill:#3FC1B0;display:none'},'✓',g);
  T('text',{x:-30,y:-92,style:'font:800 21px var(--body);fill:#F3EEE4'},'Statement',g);
  const sub=T('text',{x:-30,y:-62,style:'font:700 15px var(--mono);fill:#9C96AE'},'12 months · PDF',g);
  const e=ent('ring',g,{x:0,y:0});e.arc=arc;e.tick=tick;e.sub=sub;return e;})();const ring=RING;
function progress(p,done){RING.arc.style.strokeDashoffset=(251.3*(1-Math.max(0,Math.min(1,p)))).toFixed(1);RING.tick.style.display=done?'':'none';RING.sub.textContent=done?'sent ✓':'12 months · PDF';}
/* the Loan Officer: heard, never seen; his voice comes from Priya's handset */
const loan_officer=ent('loan_officer',(()=>{const g=S('g',{},PROPS);
  S('path',{d:'M-8 -40 q-14 20 0 40 l10 -4 q-8 -16 0 -32 z',style:'fill:#3A3550;stroke:#CFC8DD;stroke-width:2'},g);
  for(const r of [14,24])S('path',{d:`M${r-6} -32 a${r} ${r} 0 0 1 0 24`,style:'fill:none;stroke:#7FA8FF;stroke-width:3;stroke-linecap:round;opacity:.8'},g);
  return g;})(),{x:0,y:0});

/* ---- the score bar ---- */
function ready(n){track({f:n+'/32'});}
function chef(awake){track({d:awake?'AWAKE':'ASLEEP'});const el=$('trD');el.style.color=awake?'':'#7FA8FF';}

/* ================= world states ================= */
function resetWorld(){jobs=[];atts=[];bubs=[];FX.innerHTML='';clearTags();
  for(const id in E){const e=E[id];Object.assign(e,e.d);e.act=0;e.el.classList.remove('walk','lit','sleep','antic');expr(e);if(e.rows)pinit(e);if(e.tg)e.tagWant=!e.tagHidden;ap(e);}
  lampsOff();for(const L of LAMPS){L.x=L.d;drawLamp(L);}
  nbClear();ledger('#812 · COMMITTED','ok');DARK.style.opacity=0;DARK.classList.remove('red','emer');SPOTDIM.style.opacity=0;$('storeErr').style.display='none';
  stage.classList.remove('whatif','rewind');$('wilabel').hidden=true;$('rwlabel').hidden=true;$('actcard').hidden=true;$('credits').hidden=true;$('intro').classList.remove('show');
  setFade(0);HAND=0;narrUntil=0;dlgUntil=0;shakeAt=-1e9;look('none');cam.x=960;cam.y=540;cam.z=1;apCam();cap('');untitle();
  hatchesOff();shelfClear();for(let i=0;i<3;i++)guessSlot(i,'');railOn(false);progress(0,false);
  track({f:'0/32',d:'—',n:'0/8'},true);$('trD').style.color='';$('track').classList.remove('pulse');for(const k of ['ident','endslate'])$(k).hidden=true;$('frame').classList.remove('brand');bug(true);}
function earlier(){ /* the next evening: the kitchen before Priya's statement arrives */
  nbClear();on(host,235,900,1);on(manager,430,900,1);
  on(e0,SPOT.e0,900,1);on(e1,SPOT.e1,900,1);on(arjun,SPOT.arjun,900,-1);on(leela,SPOT.leela,900,-1);on(e5,SPOT.e5,900,-1);
  hop(0,e0,0);hop(1,e1,0);hop(2,arjun,0);hop(3,leela,0);
  note('p.42 v2: 300 #812');note('#812 COMMIT','nbok');
}
/* the moment of the cold open: Priya on the line, Mira at work (PostgreSQL 18) */
function coldState(){earlier();on(manager,DOORX,900,-1);on(priya,110,900,1);on(loan_officer,152,745);on(mira,MX,900,1);hop(0,mira,0);}
