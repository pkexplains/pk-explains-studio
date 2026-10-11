/* ================= sound: score, voices and mix ================= */
/* Everything plays through one Web Audio graph so it can be mixed like a film:
   narrator and character dialogue on their own buses, a composed orchestral score (pre-rendered cues
   that loop seamlessly and crossfade by scene), stingers in the same orchestra, synthesised foley,
   music that ducks under every spoken line, and a limiter on the master. Pausing suspends the graph. */
const VD=(()=>{try{return JSON.parse($('voiceData').textContent);}catch(e){return {};}})();
const MD=(()=>{try{return JSON.parse($('musicData').textContent);}catch(e){return {};}})();
let VOICE_ON=true,SOUND_ON=true,curVoice=null;
const AU={ctx:null,buf:new Map()};
const MIX={narr:1.0,dlg:.85,music:.55,sfx:.6,amb:.5,duckTo:.4};
function audioInit(){
  if(AU.ctx){if(playing&&AU.ctx.state==='suspended')AU.ctx.resume();return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  const C=new AC();AU.ctx=C;
  const lim=C.createDynamicsCompressor();lim.threshold.value=-6;lim.knee.value=6;lim.ratio.value=4;lim.attack.value=.005;lim.release.value=.2;lim.connect(C.destination);
  AU.master=C.createGain();AU.master.gain.value=SOUND_ON?0.95:0;AU.master.connect(lim);
  AU.narr=C.createGain();AU.narr.gain.value=MIX.narr;AU.narr.connect(AU.master);
  AU.dlg=C.createGain();AU.dlg.gain.value=MIX.dlg;AU.dlg.connect(AU.master);
  AU.duck=C.createGain();AU.duck.gain.value=1;AU.duck.connect(AU.master);
  AU.music=C.createGain();AU.music.gain.value=MIX.music;AU.music.connect(AU.duck);
  AU.sfx=C.createGain();AU.sfx.gain.value=MIX.sfx;AU.sfx.connect(AU.master);
  const len=C.sampleRate*3,ir=C.createBuffer(2,len,C.sampleRate);
  for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
  AU.verb=C.createConvolver();AU.verb.buffer=ir;AU.verbOut=C.createGain();AU.verbOut.gain.value=0.45;AU.verb.connect(AU.verbOut);AU.verbOut.connect(AU.master);
  AU.noise=C.createBuffer(1,C.sampleRate*2,C.sampleRate);const nd=AU.noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  /* room tone */
  AU.amb=C.createGain();AU.amb.gain.value=0;AU.amb.connect(AU.master);
  const nb=C.createBufferSource();nb.buffer=AU.noise;nb.loop=true;const lp=C.createBiquadFilter();lp.type='lowpass';lp.frequency.value=220;
  const ng=C.createGain();ng.gain.value=0.05*MIX.amb*2;nb.connect(lp);lp.connect(ng);ng.connect(AU.amb);nb.start();
  const hum=C.createOscillator();hum.frequency.value=100;const hg=C.createGain();hg.gain.value=0.012*MIX.amb*2;hum.connect(hg);hg.connect(AU.amb);hum.start();
  AU.amb.gain.setValueAtTime(0,C.currentTime);AU.amb.gain.linearRampToValueAtTime(1,C.currentTime+3);
  if(!playing)C.suspend();
  for(const k in MD)getBuf('m:'+k,MD[k]);   /* decode the score up front */
}
const now=()=>AU.ctx.currentTime;
function b64buf(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer;}
function getBuf(key,v){if(!AU.ctx)return Promise.resolve(null);if(AU.buf.has(key))return AU.buf.get(key);
  const p=(v.url?fetch(v.url).then(r=>r.arrayBuffer()):Promise.resolve(b64buf(v[1]))).then(ab=>AU.ctx.decodeAudioData(ab)).catch(()=>null);AU.buf.set(key,p);return p;}
/* music ducks under every spoken line: fast down, slow back up */
let duckEnd=0;
function duckSpan(sec){if(!AU.ctx)return;const t=now(),end=Math.max(duckEnd,t+sec);const g=AU.duck.gain;
  g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(MIX.duckTo,t+0.15);g.setValueAtTime(MIX.duckTo,end);g.linearRampToValueAtTime(1,end+0.9);duckEnd=end;}
function duck(on){if(!on&&AU.ctx){duckEnd=0;const t=now(),g=AU.duck.gain;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(1,t+0.6);}}
/* silence as a sound effect */
function silence(on){if(!AU.ctx)return;const t=now();for(const g of [AU.amb,AU.music]){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);}
  if(on){AU.amb.gain.linearRampToValueAtTime(0.0001,t+0.08);AU.music.gain.linearRampToValueAtTime(0.0001,t+0.25);}
  else{AU.amb.gain.linearRampToValueAtTime(1,t+1.2);AU.music.gain.linearRampToValueAtTime(MIX.music,t+4);}}
function env(g,t,a,peak,hold,rel){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+hold);g.gain.exponentialRampToValueAtTime(0.0001,t+a+hold+rel);}
function osc(type,f,dest,t,dur){const o=AU.ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.connect(dest);o.start(t);o.stop(t+dur+0.05);return o;}
function noiseSrc(dest,t,dur){const s=AU.ctx.createBufferSource();s.buffer=AU.noise;s.loop=true;s.connect(dest);s.start(t);s.stop(t+dur+0.05);return s;}
function bus(gain,verb=0.4,to){const g=AU.ctx.createGain();g.gain.value=gain;g.connect(to||AU.sfx);if(verb){const s=AU.ctx.createGain();s.gain.value=verb;g.connect(s);s.connect(AU.verb);}return g;}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
/* stingers and leitmotifs come from the same orchestra as the score */
function sting(name,gain=1){if(turbo||!AU.ctx||!SOUND_ON||!MD[name])return;getBuf('m:'+name,MD[name]).then(b=>{if(!b)return;const s=AU.ctx.createBufferSource();s.buffer=b;const g=AU.ctx.createGain();g.gain.value=gain;s.connect(g);g.connect(AU.music);s.start();});}
/* ---- effects ---- */
function sfx(name,vol=1,pan=0){
  if(turbo||!AU.ctx||!SOUND_ON)return;const t=now()+0.01,C=AU.ctx;
  if(name==='step'){const p=C.createStereoPanner?C.createStereoPanner():null;const g=bus(0.16*vol,0.08,p||AU.sfx);if(p){p.pan.value=Math.max(-.8,Math.min(.8,pan));p.connect(AU.sfx);}
    const f=C.createBiquadFilter();f.type='bandpass';f.frequency.value=700+Math.random()*500;f.Q.value=1.4;const e=C.createGain();f.connect(e);e.connect(g);env(e,t,0.002,0.9,0.01,0.07);noiseSrc(f,t,0.1);
    const k=C.createGain();k.connect(g);env(k,t,0.001,0.5,0.005,0.05);osc('sine',95+Math.random()*20,k,t,0.08);return;}
  /* leitmotifs and the reveal come from the score's own orchestra */
  if(name==='mira'){sting('motif_mira',.9);return;}
  if(name==='promise'){sting('sting_reveal',.9);return;}
  if(name==='manager'){sting('motif_manager',.9);return;}
  if(name==='boom'){const g=bus(1,0.5);const e=C.createGain();e.connect(g);env(e,t,0.005,0.9,0.05,1.8);
    const o=osc('sine',90,e,t,2);o.frequency.exponentialRampToValueAtTime(38,t+1.2);
    const f=C.createBiquadFilter();f.type='lowpass';f.frequency.value=300;const ne=C.createGain();f.connect(ne);ne.connect(g);env(ne,t,0.002,0.5,0.02,0.6);noiseSrc(f,t,0.7);}
  else if(name==='swell'){const g=bus(0.5,0.7);const e=C.createGain();e.connect(g);e.gain.setValueAtTime(0.0001,t);e.gain.exponentialRampToValueAtTime(0.7,t+2.6);e.gain.exponentialRampToValueAtTime(0.0001,t+5.2);
    const f=C.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(2400,t+2.6);f.connect(e);
    [50,57,62,66,69,74].forEach((n,i)=>{const o=osc(i%2?'sawtooth':'triangle',NOTE(n),f,t,5.3);o.detune.value=(i%3-1)*7;});}
  else if(name==='shimmer'){const g=bus(0.22,0.9);[86,90,93,98].forEach((n,i)=>{const e=C.createGain();e.connect(g);env(e,t+i*0.07,0.01,0.6,0.05,2.2);osc('sine',NOTE(n),e,t+i*0.07,2.4);});}
  else if(name==='chord'){const g=bus(0.35,0.8);const e=C.createGain();e.connect(g);env(e,t,1.2,0.6,1.6,2.6);const f=C.createBiquadFilter();f.type='lowpass';f.frequency.value=1600;f.connect(e);
    [50,57,62,66,69].forEach((n,i)=>osc(i%2?'sawtooth':'triangle',NOTE(n),f,t,5.6));}
  else if(name==='whoosh'){const g=bus(0.45,0.3);const f=C.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(3200,t+0.45);f.frequency.exponentialRampToValueAtTime(500,t+0.9);
    const e=C.createGain();f.connect(e);e.connect(g);env(e,t,0.25,0.8,0.1,0.55);noiseSrc(f,t,1);}
  else if(name==='rewind'){const g=bus(0.3,0.2);const e=C.createGain();e.connect(g);env(e,t,0.05,0.6,1.7,0.3);
    const o=osc('sawtooth',900,e,t,2.1);for(let k=0;k<12;k++)o.frequency.setValueAtTime(k%2?1300:700,t+k*0.17);o.frequency.exponentialRampToValueAtTime(120,t+2.1);
    const f=C.createBiquadFilter();f.type='highpass';f.frequency.value=2000;const ne=C.createGain();f.connect(ne);ne.connect(g);env(ne,t,0.05,0.3,1.7,0.3);noiseSrc(f,t,2.1);}
  else if(name==='powerdown'){const g=bus(0.6,0.4);const e=C.createGain();e.connect(g);env(e,t,0.005,0.7,0.05,1.1);
    const o=osc('sawtooth',120,e,t,1.3);o.frequency.exponentialRampToValueAtTime(28,t+1.1);
    const k=C.createGain();k.connect(g);env(k,t,0.002,1,0.02,0.4);osc('sine',60,k,t,0.5);}
  else if(name==='powerup'){const g=bus(0.35,0.3);const e=C.createGain();e.connect(g);env(e,t,0.4,0.5,0.2,0.6);const o=osc('sawtooth',40,e,t,1.3);o.frequency.exponentialRampToValueAtTime(110,t+0.8);
    const c=C.createGain();c.connect(g);env(c,t+0.6,0.002,0.6,0.01,0.08);noiseSrc(c,t+0.6,0.1);}
  else if(name==='alarm'){const g=bus(0.22,0.2);const e=C.createGain();e.connect(g);env(e,t,0.02,0.7,2.4,0.2);const o=osc('square',880,e,t,2.7);for(let k=0;k<10;k++)o.frequency.setValueAtTime(k%2?660:880,t+k*0.26);}
  else if(name==='pop'){const g=bus(0.35,0.5);[76,83].forEach((n,i)=>{const e=C.createGain();e.connect(g);env(e,t+i*0.09,0.004,0.6,0.02,0.5);osc('triangle',NOTE(n),e,t+i*0.09,0.6);});}
  else if(name==='chime'){const g=bus(0.35,0.7);[84,91].forEach((n,i)=>{const e=C.createGain();e.connect(g);env(e,t+i*0.16,0.004,0.7,0.05,1.4);osc('sine',NOTE(n),e,t+i*0.16,1.6);osc('sine',NOTE(n+12),e,t+i*0.16,1.6);});}
  else if(name==='stamp'){const g=bus(0.7,0.15);const e=C.createGain();e.connect(g);env(e,t,0.002,0.9,0.01,0.18);const o=osc('sine',160,e,t,0.25);o.frequency.exponentialRampToValueAtTime(60,t+0.15);
    const f=C.createBiquadFilter();f.type='lowpass';f.frequency.value=1800;const n=C.createGain();f.connect(n);n.connect(g);env(n,t,0.001,0.5,0.01,0.06);noiseSrc(f,t,0.1);}
  else if(name==='scribble'){const g=bus(0.25,0.1);const f=C.createBiquadFilter();f.type='bandpass';f.frequency.value=4200;f.Q.value=2;f.connect(g);
    for(let k=0;k<6;k++){const e=C.createGain();e.connect(f);env(e,t+k*0.09,0.01,0.6,0.03,0.04);noiseSrc(e,t+k*0.09,0.1);}}
}

/* ---- score: composed cues per mood, crossfaded, looping seamlessly ---- */
const CUE={night:'night',tension:'tension',build:'build',wonder:'wonder',credits:'credits',suspense:'suspense'};
let moodNow='none',cueNow=null;
function setMood(m){
  if(turbo)return;if(m===moodNow&&cueNow)return;moodNow=m;if(!AU.ctx)return;
  const t=now();
  if(cueNow){const o=cueNow;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0.0001,t+2.5);o.s.stop(t+2.7);cueNow=null;}
  const name=CUE[m];if(!name||!MD[name])return;
  const my=m;getBuf('m:'+name,MD[name]).then(b=>{if(!b||moodNow!==my)return;const s=AU.ctx.createBufferSource();s.buffer=b;s.loop=true;
    const g=AU.ctx.createGain();const t2=now();g.gain.setValueAtTime(0.0001,t2);g.gain.linearRampToValueAtTime(1,t2+2.5);s.connect(g);g.connect(AU.music);s.start();cueNow={s,g};});
}
/* ---- voices ---- */
let narrUntil=0,dlgUntil=0;
function stopVoice(){if(curVoice){try{curVoice.stop();}catch(e){}curVoice=null;}duck(false);}
function playVoice(v,key){stopVoice();duckSpan(v.d??v[0]);getBuf(key,v).then(b=>{if(!b||turbo)return;
  const s=AU.ctx.createBufferSource();s.buffer=b;s.connect(AU.narr);s.start(0,v.lead||0);curVoice=s;s.onended=()=>{if(curVoice===s)curVoice=null;};});}
/* a character's line, placed where the character stands; quieter (background chatter) if the narrator is mid-line */
function playLine(v,key,e){getBuf(key,v).then(b=>{if(!b||turbo||!AU.ctx)return;
  const s=AU.ctx.createBufferSource();s.buffer=b;const p=AU.ctx.createStereoPanner?AU.ctx.createStereoPanner():null;const g=AU.ctx.createGain();
  const [sx]=scr(e.x,e.y);if(p)p.pan.value=Math.max(-.7,Math.min(.7,(sx-960)/960*.7));
  g.gain.value=clock<narrUntil?0.32:1;s.connect(g);if(p){g.connect(p);p.connect(AU.dlg);}else g.connect(AU.dlg);
  const rv=AU.ctx.createGain();rv.gain.value=.12;g.connect(rv);rv.connect(AU.verb);s.start();});}
function soundPause(p){if(AU.ctx){if(p)AU.ctx.suspend();else AU.ctx.resume();}}
function setSound(on){SOUND_ON=on;if(AU.master)AU.master.gain.value=on?0.95:0;}
