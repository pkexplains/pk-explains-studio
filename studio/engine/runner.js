/* ================= runner & UI ================= */
let cur=-1,RID=0,auto=true,ended=false;
const chips=$('chips');
SEQ.forEach((s,i)=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';
  b.innerHTML=`<span class="n">${String(i+1).padStart(2,'0')}</span>`;b.append(document.createTextNode(s.name));
  b.addEventListener('click',()=>start(i));li.append(b);chips.append(li);});
function mark(){[...chips.querySelectorAll('button')].forEach((b,i)=>b.setAttribute('aria-current',i===cur?'true':'false'));
  const s=SEQ[cur];if(!s)return;$('chap').innerHTML='';if(s){$('chap').append(document.createTextNode(s.act+' · '));const b=document.createElement('b');b.textContent=s.name;$('chap').append(b);}}
function setPlaying(v){playing=v;soundPause(!v);stage.classList.toggle('paused',!v);const p=$('play');p.textContent=v?'Pause':'Play';p.setAttribute('aria-pressed',String(v));}
async function start(k){audioInit();stopVoice();k=Math.max(0,Math.min(SEQ.length-1,k));const id=++RID;$('bigplay').hidden=true;ended=false;
  resetWorld();earlier();turbo=true;
  for(let i=0;i<k;i++){curSeq=i;try{await SEQ[i].run();}catch(e){console.error(e);}if(id!==RID){return;}}
  turbo=false;cap('');setFade(0);$('actcard').hidden=true;untitle();$('credits').hidden=true;
  setPlaying(true);stage.focus({preventScroll:true});
  for(let i=k;i<SEQ.length;i++){cur=i;curSeq=i;mark();if(SCENE_MOOD[SEQ[i].name]!==undefined)setMood(SCENE_MOOD[SEQ[i].name]);{const L=SCENE_LOOK[SEQ[i].name]||['none'];look(L[0],L[1],L[2]||0);}
    try{await SEQ[i].run();}catch(e){console.error(e);}
    if(id!==RID)return;
    if(!auto&&i<SEQ.length-1){ended=true;setPlaying(false);return;}
    await W(700);if(id!==RID)return;}
  ended=true;setMood('none');setPlaying(false);}
function toggle(){audioInit();if(cur<0)return start(0);if(ended)return start(cur<SEQ.length-1?cur+1:0);setPlaying(!playing);}
$('bigplay').addEventListener('click',()=>start(0));
$('play').addEventListener('click',toggle);
$('prev').addEventListener('click',()=>start(cur<=0?0:cur-1));
$('next').addEventListener('click',()=>start(cur+1));
$('autoBtn').addEventListener('click',e=>{auto=!auto;e.currentTarget.setAttribute('aria-pressed',String(auto));});
function toggleCaps(){capsOn=!capsOn;$('capBtn').setAttribute('aria-pressed',String(capsOn));cap(capText);}
$('capBtn').addEventListener('click',toggleCaps);
$('voiceBtn').addEventListener('click',e=>{VOICE_ON=!VOICE_ON;e.currentTarget.setAttribute('aria-pressed',String(VOICE_ON));if(!VOICE_ON)stopVoice();});
$('soundBtn').addEventListener('click',e=>{setSound(!SOUND_ON);e.currentTarget.setAttribute('aria-pressed',String(SOUND_ON));});
function fs(){try{if(document.fullscreenElement)document.exitFullscreen();else{const r=stage.requestFullscreen&&stage.requestFullscreen();if(r&&r.catch)r.catch(()=>{});}}catch(e){}}
$('fsBtn').addEventListener('click',fs);
$('cleanBtn').addEventListener('click',()=>document.body.classList.toggle('clean'));
document.addEventListener('keydown',e=>{const tg=e.target;if(tg.closest&&tg.closest('input,textarea,summary'))return;
  if(tg.tagName==='BUTTON'&&(e.key===' '||e.key==='Enter'))return;
  if(e.key===' '||e.key==='k'){e.preventDefault();toggle();}
  else if(e.key==='ArrowRight'){e.preventDefault();start(cur+1);}
  else if(e.key==='ArrowLeft'){e.preventDefault();start(cur<=0?0:cur-1);}
  else if(e.key==='c'||e.key==='C')toggleCaps();
  else if(e.key==='h'||e.key==='H')document.body.classList.toggle('clean');
  else if(e.key==='f'||e.key==='F')fs();});

/* ================= narration booth: record the film in your own voice ================= */
/* Takes live in this browser (IndexedDB). "Save my takes" exports them in the same format as the
   embedded studio narrator, so they can be baked into the film for every viewer. */
let IDBH=null;
function idb(){if(IDBH)return Promise.resolve(IDBH);return new Promise(res=>{try{const r=indexedDB.open('pkfilms-booth',1);
  r.onupgradeneeded=()=>r.result.createObjectStore('takes');r.onsuccess=()=>{IDBH=r.result;res(IDBH);};r.onerror=()=>res(null);}catch(e){res(null);}});}
async function idbDo(mode,fn){const db=await idb();if(!db)return null;return new Promise(res=>{try{const tx=db.transaction('takes',mode);const out=fn(tx.objectStore('takes'));
  tx.oncomplete=()=>res(out&&out.result);tx.onerror=()=>res(null);}catch(e){res(null);}});}
async function loadTakes(){const db=await idb();if(!db)return;await new Promise(res=>{try{const rq=db.transaction('takes').objectStore('takes').openCursor();
  rq.onsuccess=()=>{const c=rq.result;if(!c)return res();const v=c.value;TAKES[c.key]={url:URL.createObjectURL(v.blob),d:v.d,lead:v.lead,blob:v.blob,mime:v.blob.type};c.continue();};rq.onerror=()=>res();}catch(e){res();}});}
let MIC=null,REC=null,recKey=null,chunks=[];
function boothMsg(t){$('boothMsg').textContent=t;}
async function analyse(blob){/* find where speech starts and ends, so pauses stay natural */
  try{const C=new (window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,44100,44100);const buf=await C.decodeAudioData(await blob.arrayBuffer());
    const d=buf.getChannelData(0),sr=buf.sampleRate,win=Math.round(sr*0.02);let peak=0;for(let i=0;i<d.length;i++)peak=Math.max(peak,Math.abs(d[i]));
    const th=Math.max(0.02,peak*0.08);let a=0,b=d.length;
    for(let i=0;i<d.length;i+=win){let m=0;for(let j=i;j<Math.min(d.length,i+win);j++)m=Math.max(m,Math.abs(d[j]));if(m>th){a=i;break;}}
    for(let i=d.length-win;i>0;i-=win){let m=0;for(let j=i;j<Math.min(d.length,i+win);j++)m=Math.max(m,Math.abs(d[j]));if(m>th){b=i+win;break;}}
    const lead=Math.max(0,a/sr-0.12);return {lead,d:Math.max(0.5,Math.min(buf.duration,b/sr+0.2)-lead)};}
  catch(e){return {lead:0,d:3};}}
async function startRec(key,btn){
  if(REC){stopRec();return;}
  try{if(!MIC)MIC=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:true,autoGainControl:true}});}
  catch(e){boothMsg("The microphone isn't available on this page. Download the film's HTML file, open it in Chrome on your computer, and record there.");return;}
  chunks=[];recKey=key;REC=new MediaRecorder(MIC);REC.ondataavailable=ev=>{if(ev.data.size)chunks.push(ev.data);};
  REC.onstop=async()=>{const blob=new Blob(chunks,{type:REC.mimeType||'audio/webm'});const k=recKey;REC=null;recKey=null;
    const a=await analyse(blob);await idbDo('readwrite',st=>st.put({blob,d:a.d,lead:a.lead},k));
    if(TAKES[k])URL.revokeObjectURL(TAKES[k].url);TAKES[k]={url:URL.createObjectURL(blob),d:a.d,lead:a.lead,blob,mime:blob.type};renderBooth();boothMsg('Saved. Press Play to hear it back.');};
  REC.start();btn.setAttribute('aria-pressed','true');btn.textContent='Stop';boothMsg('Recording… read the line, then press Stop.');}
function stopRec(){if(REC&&REC.state!=='inactive')REC.stop();}
function renderBooth(){const box=$('takes');box.innerHTML='';const seen=new Set();let n=0,have=0;
  SCRIPT.forEach(arr=>(arr||[]).forEach(t=>{if(seen.has(t))return;seen.add(t);n++;const has=!!TAKES[t];if(has)have++;
    const row=document.createElement('div');row.className='take'+(has?' has':'');
    const k=document.createElement('span');k.className='k';k.textContent=String(n).padStart(3,'0');
    const p=document.createElement('p');p.textContent=t;
    const act=document.createElement('div');act.className='act';
    const rec=document.createElement('button');rec.type='button';rec.className='rec';rec.textContent=has?'Re-record':'Record';rec.setAttribute('aria-pressed','false');
    rec.addEventListener('click',()=>startRec(t,rec));act.append(rec);
    if(has){const pl=document.createElement('button');pl.type='button';pl.textContent='Play';pl.addEventListener('click',()=>{const v=TAKES[t];const a=new Audio(v.url);a.currentTime=v.lead||0;a.play().catch(()=>{});});act.append(pl);
      const del=document.createElement('button');del.type='button';del.textContent='Delete';del.addEventListener('click',async()=>{await idbDo('readwrite',st=>st.delete(t));URL.revokeObjectURL(TAKES[t].url);delete TAKES[t];renderBooth();});act.append(del);}
    row.append(k,p,act);box.append(row);}));
  $('booth').querySelector('summary').textContent=`Narration booth · record the film in your own voice · ${have} of ${n} lines recorded`;}
$('ownBtn').addEventListener('click',e=>{OWN_ON=!OWN_ON;e.currentTarget.setAttribute('aria-pressed',String(OWN_ON));
  boothMsg(OWN_ON?'The film now plays your takes. Lines you haven’t recorded use the studio narrator.':'The film now plays the studio narrator.');});
function b64(blob){return new Promise(res=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.readAsDataURL(blob);});}
$('exportTakes').addEventListener('click',async()=>{const out={};for(const t in TAKES){const v=TAKES[t];out[t]={d:+v.d.toFixed(3),lead:+(v.lead||0).toFixed(3),mime:v.mime,b64:await b64(v.blob)};}
  const n=Object.keys(out).length;if(!n){boothMsg('Record at least one line first.');return;}
  const data=JSON.stringify(out),name='pk-films-narration-takes.json';
  try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;
    if(dl){await dl.save({filename:name,data});boothMsg(`Saved ${n} takes. Attach the file in chat to bake your voice into the film.`);return;}}
  catch(e){if(e&&e.code==='declined'){boothMsg('Save cancelled.');return;}}
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=name;document.body.append(a);a.click();a.remove();
    boothMsg(`Saved ${n} takes. Attach the file in chat to bake your voice into the film.`);}catch(e){boothMsg("This page can't save files here.");}});

/* collect the narration script for the current cut, then show the poster frame */
let scriptLines=[];
function selectBody(){const sb=$('sbody');const r=document.createRange();r.selectNodeContents(sb);const s=getSelection();s.removeAllRanges();s.addRange(r);$('copyMsg').textContent='Selected. Press Ctrl+C or Cmd+C to copy.';}
$('copyScript').addEventListener('click',()=>{const txt=scriptLines.join('\n');const ok=()=>{$('copyMsg').textContent='Copied.';};
  try{navigator.clipboard.writeText(txt).then(ok,selectBody);}catch(e){selectBody();}});
async function collect(){
  RID++;SCRIPT.length=0;collecting=true;turbo=true;resetWorld();earlier();
  for(let i=0;i<SEQ.length;i++){curSeq=i;try{await SEQ[i].run();}catch(e){console.error(e);}}
  collecting=false;turbo=false;
  const sb=$('sbody');sb.innerHTML='';scriptLines=[(ENG?"ENGINEER'S CUT":'STORY CUT')+' \u2014 '+EPISODE.title,''];let words=0;
  SEQ.forEach((s,i)=>{const d=document.createElement('div');const h=document.createElement('h4');h.textContent=`${String(i+1).padStart(2,'0')} \u00B7 ${s.act} \u00B7 ${s.name}`;d.append(h);scriptLines.push(h.textContent);
    (SCRIPT[i]||['(no narration)']).forEach(t=>{words+=t.split(/\s+/).length;const p=document.createElement('p');p.textContent=t;d.append(p);scriptLines.push(t);});scriptLines.push('');sb.append(d);});
  $('scriptBox').querySelector('summary').textContent=`Narration script for your voiceover \u00B7 ${ENG?"Engineer's cut":'Story cut'} \u00B7 about ${Math.round(words/150)} min of narration`;
  renderBooth();
}
function poster(){resetWorld();earlier();on(priya,110,900,1);cam.x=960;cam.y=540;cam.z=1;apCam();cur=-1;mark();
  $('chap').textContent='PK Explains';
  title('PK Explains',EPISODE.title,EPISODE.logline);
  $('bigplay').hidden=false;setPlaying(false);}
$('engBtn').addEventListener('click',async e=>{ENG=!ENG;e.currentTarget.setAttribute('aria-pressed',String(ENG));const was=cur;await collect();if(was>=0)start(was);else poster();});
(async()=>{await loadTakes();await collect();poster();})();
requestAnimationFrame(frame);
})();
