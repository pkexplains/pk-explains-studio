window.__mk=async(kind)=>{const N='#121E3B',A='#EAAA45',Wt='#F7F7F5',M='#CBD1E2',F='PKLexend';
const rr=(c,x,y,w,h,r)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
const tileTxt=(c,x,y,t,fs)=>{c.fillStyle=N;c.font=`700 ${fs}px ${F}`;c.letterSpacing=`${-.01*fs}px`;c.textAlign='center';c.textBaseline='alphabetic';const m=c.measureText('PK');const ch=m.actualBoundingBoxAscent;c.fillText('PK',x+t/2,y+t/2+ch/2+.03*fs);c.letterSpacing='0px';};
let cv=document.createElement('canvas'),c,type='image/png';
if(kind==='avatar'){cv.width=cv.height=800;c=cv.getContext('2d');c.fillStyle=N;c.fillRect(0,0,800,800);c.fillStyle=A;rr(c,140,140,520,520,109.2);tileTxt(c,140,140,520,250);}
if(kind==='wm'){cv.width=cv.height=150;c=cv.getContext('2d');c.fillStyle=A;rr(c,0,0,150,150,31.5);tileTxt(c,0,0,150,72);}
if(kind==='banner'){const W=2560,H=1440;cv.width=W;cv.height=H;c=cv.getContext('2d');
 c.fillStyle='#0E1830';c.fillRect(0,0,W,H);c.save();c.translate(W/2,H/2);c.scale(.6*W/2,.55*H/2);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,'#17264A');g.addColorStop(.7,'#121E3B');g.addColorStop(1,'#0E1830');c.fillStyle=g;c.fillRect(-W,-H,2*W,2*H);c.restore();
 c.fillStyle='rgba(203,209,226,.035)';for(let x=0;x<W;x+=64)c.fillRect(x,0,1,H);for(let y=0;y<H;y+=64)c.fillRect(0,y,W,1);
 const ws=132,tile=200,gap=56;c.textAlign='left';c.letterSpacing=`${.01*ws}px`;
 c.font=`700 ${ws}px ${F}`;const wPK=c.measureText('PK').width;const capB=c.measureText('PK').actualBoundingBoxAscent;c.font=`400 ${ws}px ${F}`;const wEx=c.measureText('Explains').width;const sp=.26*ws;
 const lockw=tile+gap+wPK+sp+wEx,top=(H-(tile+44+4+44+50))/2,lx=(W-lockw)/2,cy=top+tile/2;
 c.letterSpacing='0px';c.fillStyle=A;rr(c,lx,top,tile,tile,42);tileTxt(c,lx,top,tile,96);
 c.textAlign='left';c.letterSpacing=`${.01*ws}px`;const by=cy+capB/2;c.font=`700 ${ws}px ${F}`;c.fillStyle=Wt;c.fillText('PK',lx+tile+gap,by);c.font=`400 ${ws}px ${F}`;c.fillStyle=M;c.fillText('Explains',lx+tile+gap+wPK+sp,by);
 c.letterSpacing='0px';const ry=top+tile+44;c.globalAlpha=.9;c.fillStyle=A;rr(c,W/2-60,ry,120,4,2);c.globalAlpha=.8;
 c.font=`400 40px ${F}`;c.letterSpacing='0.8px';c.fillStyle=M;c.textAlign='center';const tc=c.measureText('S').actualBoundingBoxAscent;c.fillText('Short films on how things really work',W/2,ry+4+44+25+tc/2);c.globalAlpha=1;}
return await new Promise(r=>cv.toBlob(r,type));};
window.__put=async(kind,idx,name)=>{const b=await window.__mk(kind);const file=new File([b],name,{type:'image/png'});
 const ins=[];const walk=r=>{r.querySelectorAll('*').forEach(e=>{if(e.tagName==='INPUT'&&e.type==='file')ins.push(e);if(e.shadowRoot)walk(e.shadowRoot);});};walk(document);
 const inp=ins[idx];const dt=new DataTransfer();dt.items.add(file);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));return [ins.length,file.size];};
'ready'
