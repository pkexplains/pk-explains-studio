/* ================= cast ================= */
function shade(hex,f=.72){const n=parseInt(hex.slice(1),16);const r=(n>>16)&255,g=(n>>8)&255,b=n&255;return `rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`;}
function makeChar(id,o){
  const g=S('g',{class:'char'+(o.cpu?' cpu':'')},CHARS);
  S('ellipse',{cx:0,cy:2,rx:34,ry:7,class:'shadow'},g);
  const f=S('g',{class:'flipg'},g);
  S('rect',{x:-15,y:-60,width:12,height:60,rx:6,class:'leg legA'},f);
  S('rect',{x:3,y:-60,width:12,height:60,rx:6,class:'leg legB'},f);
  const b=S('g',{class:'bodyg'},f);
  const dk=shade(o.color);
  if(o.prop==='bag'){S('line',{x1:-20,y1:-130,x2:-34,y2:-96,stroke:'#0E3B36','stroke-width':4},b);S('rect',{x:-50,y:-104,width:28,height:34,rx:6,fill:'#3FC1B0',stroke:'#0E3B36','stroke-width':2},b);}
  S('rect',{x:-36,y:-124,width:12,height:52,rx:6,fill:dk,class:'arm armB'},b);
  S('rect',{x:-30,y:-138,width:60,height:86,rx:26,fill:o.color},b);
  if(o.apron)S('rect',{x:-18,y:-116,width:36,height:56,rx:9,class:'apron'},b);
  if(o.tie)S('path',{d:'M0 -130 l-7 10 l7 36 l7 -36z',fill:'#2C4A8E'},b);
  if(o.bow)S('path',{d:'M-13 -136 l13 7 l13 -7 v14 l-13 -7 l-13 7z',fill:'#14121D'},b);
  S('rect',{x:24,y:-124,width:12,height:52,rx:6,fill:o.color,stroke:dk,'stroke-width':1.5,class:'arm armF'},b);
  S('circle',{cx:0,cy:-164,r:26,class:'head'},b);
  S('circle',{cx:11,cy:-168,r:3.6,class:'eye',style:`animation-delay:${(-(id.length*1.37+id.charCodeAt(0)%7)%5.2).toFixed(2)}s;animation-duration:${(4.4+(id.charCodeAt(1)%5)*.45).toFixed(2)}s`},b);
  S('path',{d:'M4 -181 l12 -4',class:'brow'},b);
  S('path',{d:'M6 -153 q6 5 12 0',class:'mouth'},b);
  if(o.hat==='chef'){S('rect',{x:-21,y:-204,width:42,height:22,rx:5,class:'hat'},b);for(const [cx,cy,r] of [[-14,-207,14],[1,-216,16],[15,-207,14]])S('circle',{cx,cy,r,class:'hat'},b);}
  if(o.hat==='halo')S('ellipse',{cx:0,cy:-200,rx:30,ry:8,fill:'none',stroke:'#7FA8FF','stroke-width':5},b);
  if(o.hat==='top'){S('rect',{x:-18,y:-226,width:36,height:36,rx:3,fill:'#14121D'},b);S('rect',{x:-18,y:-200,width:36,height:6,fill:o.color},b);S('rect',{x:-29,y:-194,width:58,height:7,rx:3,fill:'#14121D'},b);}
  if(o.hat==='cap'){S('path',{d:'M-26 -180 a26 22 0 0 1 52 0 z',fill:o.capc||dk},b);S('rect',{x:16,y:-184,width:24,height:6,rx:3,fill:o.capc||dk},b);}
  if(o.hat==='band')S('rect',{x:-27,y:-190,width:54,height:11,rx:5,fill:'#F3EEE4'},b);
  if(o.prop==='laptop'){S('rect',{x:30,y:-114,width:42,height:28,rx:3,fill:'#3A3550',stroke:'#14121D','stroke-width':2},b);S('rect',{x:35,y:-110,width:32,height:18,fill:'#7FA8FF',opacity:.7},b);}
  if(o.prop==='clipboard'){S('rect',{x:30,y:-120,width:28,height:36,rx:3,fill:'#F3EEE4',stroke:'#14121D','stroke-width':2},b);S('rect',{x:38,y:-124,width:12,height:7,rx:2,fill:'#14121D'},b);S('line',{x1:35,y1:-106,x2:53,y2:-106,stroke:'#14121D','stroke-width':2},b);S('line',{x1:35,y1:-97,x2:50,y2:-97,stroke:'#14121D','stroke-width':2},b);}
  if(o.prop==='broom'){S('line',{x1:34,y1:-130,x2:64,y2:-8,stroke:'#C9A96E','stroke-width':6},b);S('path',{d:'M50 -14 L78 -14 L84 4 L46 4 Z',fill:'#F2C14E',stroke:'#14121D','stroke-width':2},b);}
  const e=ent(id,g,{x:0,y:900,o:0});
  if(o.tag){const tg=S('g',{},g);const w=o.tag.length*9.3+24;S('rect',{x:-w/2,y:-272,width:w,height:28,rx:14,class:'cpill '+(o.pill||'')},tg);T('text',{x:0,y:-252,'text-anchor':'middle',class:'cpillt'},o.tag,tg);e.tg=tg;e.tgw=w;e.tagHidden=!!o.hideTag;e.tagWant=!o.hideTag;}
  if(o.cpu)CPUS.push(e);
  return e;
}
const CAST={
  priya:{color:'#B9B4C9',hat:'cap',capc:'#6E6886',prop:'laptop',tag:'Priya',pill:'cu'},
  host:{color:'#E0603F',hat:'top',bow:true,tag:'Host · postmaster',cpu:1},
  clone:{color:'#E0603F',hat:'top',bow:true,cpu:1},
  manager:{color:'#7FA8FF',hat:'halo',tie:true,tag:'Manager · OS kernel',pill:'os'},
  e0:{color:'#C9705A',hat:'chef',apron:true,cpu:1},
  e1:{color:'#D98268',hat:'chef',apron:true,cpu:1},
  arjun:{color:'#F59A7C',hat:'chef',apron:true,tag:'Arjun · PID 4130',hideTag:1,cpu:1},
  leela:{color:'#E8694A',hat:'chef',apron:true,prop:'clipboard',tag:'Leela · PID 4133',hideTag:1,cpu:1},
  e5:{color:'#BF6650',hat:'chef',apron:true,cpu:1},
  mira:{color:'#FF7A59',hat:'chef',apron:true,tag:'Mira · PID 4127',cpu:1},
  startup:{color:'#FF7A59',hat:'band',apron:true,tag:'Recovery · startup process',cpu:1},
  helper:{color:'#FF7A59',hat:'band',apron:true,tag:'Helper · bgwriter',cpu:1},
  supervisor:{color:'#FF7A59',hat:'cap',prop:'clipboard',tag:'Supervisor · checkpointer',cpu:1},
  courier:{color:'#FF7A59',hat:'cap',prop:'bag',tag:'Courier · walsender',cpu:1},
  cleaner:{color:'#FF7A59',hat:'band',prop:'broom',tag:'Cleaner · autovacuum',cpu:1}
};
for(const k in CAST)makeChar(k,CAST[k]);
const {priya,host,clone,manager,e0,e1,arjun,leela,e5,mira,startup,helper,supervisor,courier,cleaner}=E;
const SPOT={e0:560,e1:650,mira:740,arjun:830,leela:920,e5:1010};

/* pages with row versions */
function makePage(id,label,d,rowText=['Priya 500','Priya 300','Priya 400']){
  const g=S('g',{},PROPS);
  S('rect',{x:-125,y:-84,width:250,height:84,rx:8,class:'tray'},g);
  T('text',{x:-114,y:-68,class:'trayl'},label,g);
  const rows=[];
  [-80,2,84].forEach((cx,i)=>{const og=S('g',{transform:`translate(${cx} -6)`},g);const ig=S('g',{},og);
    S('rect',{x:-38,y:-54,width:76,height:50,rx:5,class:'card'},ig);
    T('text',{x:0,y:-40,'text-anchor':'middle',class:'cardn'},'version '+(i+1),ig);
    const v=T('text',{x:0,y:-21,'text-anchor':'middle',class:'cardv'},rowText[i],ig);
    const st=S('g',{style:'display:none'},ig);S('rect',{x:-36,y:-15,width:72,height:12,rx:3,class:'stamp'},st);const stt=T('text',{x:0,y:-6,'text-anchor':'middle',class:'stampt'},'replaced by #812',st);
    rows.push({og,ig,v,st,stt,text0:rowText[i]});});
  const torn=S('g',{style:'display:none'},g);S('path',{d:'M-125 -70 L125 -70 L125 -40 L-125 -10 Z',class:'torn'},torn);T('text',{x:0,y:-46,'text-anchor':'middle',class:'torntx'},'TORN · half old, half new',torn);
  const dirty=S('g',{style:'display:none',transform:'translate(104 -88) rotate(10)'},g);S('rect',{x:-26,y:-15,width:52,height:30,rx:2,class:'sticky'},dirty);T('text',{x:0,y:5,'text-anchor':'middle',class:'stickyt'},'dirty',dirty);
  const pin=S('g',{style:'display:none',transform:'translate(-126 -84)'},g);S('line',{x1:0,y1:0,x2:10,y2:12,class:'pinl'},pin);S('circle',{r:9,class:'pinh'},pin);
  const sign=S('g',{style:'display:none',transform:'translate(0 -94)'},g);S('rect',{x:-62,y:-30,width:124,height:32,rx:6,class:'sign'},sign);T('text',{x:0,y:-8,'text-anchor':'middle',class:'signt'},'HANDS OFF',sign);
  const p=ent(id,g,d);p.rows=rows;p.parts={torn,dirty,pin,sign};pinit(p);return p;}
function prow(p,i,o){const r=p.rows[i];
  if('on' in o){r.og.style.display=o.on?'':'none';if(o.on&&!turbo){r.ig.classList.remove('popin');void r.ig.getBBox();r.ig.classList.add('popin');}}
  if(o.val!=null)r.v.textContent=o.val;
  if('hot' in o)r.v.setAttribute('class','cardv'+(o.hot?' hot':''));
  if('stamp' in o){if(o.stamp&&r.st.style.display==='none')sfx('stamp');r.st.style.display=o.stamp?'':'none';if(o.stamp)r.stt.textContent=o.stamp;}}
function pset(p,k,v){p.parts[k].style.display=v?'':'none';}
function pinit(p){p.rows.forEach((r,i)=>{r.og.style.display=i===0?'':'none';r.v.textContent=r.text0;r.v.setAttribute('class','cardv');r.st.style.display='none';});for(const k in p.parts)pset(p,k,false);}
const pg42=makePage('pg42','PAGE 42',{x:1365,y:430});
const pg42m=makePage('pg42m','PAGE 42',{x:1365,y:640,s:.84});
const pg42d=makePage('pg42d','PAGE 42',{x:1808,y:600,s:.72,o:1});
const pg42r=makePage('pg42r','PAGE 42',{x:2460,y:660,s:.66,o:1});
const pgc=makePage('pgc','PAGE 42',{x:1365,y:640,s:.84});
const pg88=makePage('pg88','PAGE 88',{x:1365,y:640,s:.84},['orders','','']);

function makeSheets(id,cls,n,d){const g=S('g',{},PROPS);for(let k=0;k<n;k++){const s=S('g',{transform:`translate(${k*14-14} ${-k*6})`},g);S('rect',{x:-16,y:-44,width:32,height:44,rx:3,class:'sheet '+cls},s);for(let i=0;i<3;i++)S('line',{x1:-10,y1:-35+i*10,x2:8,y2:-35+i*10,class:'sheetl'},s);}return ent(id,g,d);}
const walOld=makeSheets('walOld','old',3,{x:1745,y:830,o:1});
const bundle=makeSheets('bundle','',3,{x:1840,y:830});
const wpc=makeSheets('wpc','',1,{x:0,y:0});
const fpi=ent('fpi',(()=>{const g=S('g',{},PROPS);S('rect',{x:-30,y:-70,width:60,height:70,rx:4,class:'fullp'},g);T('text',{x:0,y:-42,'text-anchor':'middle',class:'fullt'},'FULL',g);T('text',{x:0,y:-26,'text-anchor':'middle',class:'fullt'},'PAGE 42',g);return g;})(),{x:0,y:0});
const slip=ent('slip',(()=>{const g=S('g',{},PROPS);S('rect',{x:-330,y:-52,width:660,height:52,rx:6,class:'slip'},g);T('text',{x:0,y:-20,'text-anchor':'middle',class:'slipt'},"UPDATE accounts SET balance = balance - 200 WHERE name = 'Priya';",g);return g;})(),{x:0,y:0});
const badge=ent('badge',(()=>{const g=S('g',{},PROPS);S('rect',{x:-170,y:-96,width:340,height:96,rx:22,class:'badge'},g);T('text',{x:0,y:-52,'text-anchor':'middle',class:'badget'},'\u2713 \u20B9200 paid',g);T('text',{x:0,y:-20,'text-anchor':'middle',class:'badges'},'database said: UPDATE 1',g);return g;})(),{x:0,y:0});
const tsign=ent('tsign',(()=>{const g=S('g',{},PROPS);S('rect',{x:-118,y:0,width:236,height:30,rx:6,class:'tsign'},g);T('text',{x:0,y:20,'text-anchor':'middle',class:'tsignt'},'accounts: rows being changed',g);return g;})(),{x:1365,y:478});
