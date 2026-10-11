"""Render the film to a master video, frame by frame, with the sound mix rendered offline.
usage: python render.py film.html out_dir WIDTH FPS [max_frames]
Writes out_dir/video.mkv (lossless-ish x264 crf) and out_dir/audio.wav, then muxes elsewhere."""
import sys, asyncio, base64, subprocess, time, struct, os
from playwright.async_api import async_playwright

FILM, OUT, WIDTH, FPS = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
MAXF = int(sys.argv[5]) if len(sys.argv) > 5 else 10**9
AUDIO_MIN = 26  # offline mix buffer length (minutes); trimmed to the film's real end
os.makedirs(OUT, exist_ok=True)

INIT = r"""
(()=>{
window.__vt=0; window.__rafq=[];
window.requestAnimationFrame=cb=>{window.__rafq.push(cb);return window.__rafq.length;};
const SR=48000, LEN=SR*60*%AUDIO_MIN%;
/* --- every AudioParam remembers its automation so .value reads the right level at virtual time --- */
const EV=new WeakMap(), D=Object.getOwnPropertyDescriptor(AudioParam.prototype,'value');
const evs=p=>{let e=EV.get(p);if(!e){e={base:D.get.call(p),list:[]};EV.set(p,e);}return e;};
function valAt(p,T){const e=evs(p);let v=e.base,pt=0;const L=e.list.slice().sort((a,b)=>a.t-b.t);
  for(const ev of L){if(ev.t<=T){v=ev.v;pt=ev.t;continue;}
    const f=(T-pt)/Math.max(1e-9,ev.t-pt);
    if(ev.k==='lin')v=v+(ev.v-v)*f;else if(ev.k==='exp'&&v>0&&ev.v>0)v=v*Math.pow(ev.v/v,f);
    break;}
  return v;}
Object.defineProperty(AudioParam.prototype,'value',{configurable:true,get(){return valAt(this,window.__vt);},
  set(x){D.set.call(this,x);const e=evs(this);e.base=x;e.list=e.list.filter(ev=>ev.t<window.__vt);e.list.push({k:'set',t:window.__vt,v:x});
    AudioParam.prototype.setValueAtTime.__orig.call(this,x,window.__vt);}});
const wrap=(name,k)=>{const o=AudioParam.prototype[name];const f=function(v,t,...r){evs(this).list.push({k,t,v});return o.call(this,v,t,...r);};f.__orig=o;AudioParam.prototype[name]=f;};
wrap('setValueAtTime','set');wrap('linearRampToValueAtTime','lin');wrap('exponentialRampToValueAtTime','exp');
{const o=AudioParam.prototype.cancelScheduledValues;AudioParam.prototype.cancelScheduledValues=function(t){const e=evs(this);e.list=e.list.filter(ev=>ev.t<t);return o.call(this,t);};}
/* sources started "now" start at the film's virtual now */
for(const P of [AudioScheduledSourceNode.prototype,AudioBufferSourceNode.prototype]){
 const s=Object.getOwnPropertyDescriptor(P,'start'),st=Object.getOwnPropertyDescriptor(P,'stop');
 if(s){const f=s.value;P.start=function(when,...r){if(!(when>window.__vt))when=window.__vt;return f.call(this,when,...r);};}
 if(st){const f=st.value;P.stop=function(when){if(!(when>window.__vt))when=window.__vt;try{return f.call(this,when);}catch(e){}};}}
window.AudioContext=window.webkitAudioContext=function(){
  const C=new OfflineAudioContext({numberOfChannels:2,length:LEN,sampleRate:SR});
  Object.defineProperty(C,'currentTime',{get:()=>window.__vt});
  Object.defineProperty(C,'state',{get:()=>'running'});
  C.suspend=()=>Promise.resolve();C.resume=()=>Promise.resolve();
  window.__AC=C;return C;};
/* step one frame: film clock, then every CSS animation/transition by exactly dt */
window.__step=(dt)=>{window.__vt+=dt/1000;const q=window.__rafq;window.__rafq=[];for(const cb of q)cb(window.__vt*1000);
  for(const a of document.getAnimations()){if(!a.__seen){a.__seen=1;a.pause();a.currentTime=0;}else{a.pause();a.currentTime=(a.currentTime||0)+dt;}}};
window.__renderAudio=async(sec)=>{const buf=await window.__AC.startRendering();const n=Math.min(buf.length,Math.round(sec*SR));
  const L=buf.getChannelData(0),R=buf.getChannelData(1);const out=new Float32Array(n*2);
  for(let i=0;i<n;i++){out[2*i]=L[i];out[2*i+1]=R[i];}
  window.__pcm=new Uint8Array(out.buffer);return window.__pcm.length;};
window.__chunk=(i,n)=>{const u=window.__pcm.subarray(i,i+n);let s='';for(let k=0;k<u.length;k+=32768)s+=String.fromCharCode.apply(null,u.subarray(k,k+32768));return btoa(s);};
})();
""".replace('%AUDIO_MIN%', str(AUDIO_MIN))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 1000})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(INIT)
        await pg.goto('file://' + os.path.abspath(FILM))
        # let the poster settle (collect() runs in turbo, no rAF needed)
        for _ in range(20):
            await pg.evaluate('window.__step(16)'); await pg.wait_for_timeout(50)
        await pg.evaluate("document.body.classList.add('clean')")
        # film grain is added in the encode instead (same look, a third of the render time)
        await pg.evaluate("(()=>{const s=document.createElement('style');s.textContent='.grain{display:none!important}';document.head.append(s);})()")
        r = await pg.evaluate("(()=>{const r=document.getElementById('stage').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
        scale = WIDTH / r[2]; H = round(r[3] * scale); H -= H % 2
        print('stage', r, 'scale', scale, 'out', WIDTH, H, flush=True)
        cdp = await pg.context.new_cdp_session(pg)
        clip = {'x': r[0], 'y': r[1], 'width': r[2], 'height': r[3], 'scale': scale}
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-',
                               '-vf', f'scale={WIDTH}:{H}:flags=lanczos', '-pix_fmt', 'yuv444p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '8',
                               f'{OUT}/video.mkv'], stdin=subprocess.PIPE)
        await pg.evaluate("document.getElementById('bigplay').click()")
        dt = 1000 / FPS; n = 0; t0 = time.time(); started = False; tail = None
        while n < MAXF:
            paused = await pg.evaluate(f"(window.__step({dt}),document.getElementById('stage').classList.contains('paused'))")
            await pg.wait_for_timeout(1)  # let decoded buffers resolve and schedule
            shot = await cdp.send('Page.captureScreenshot', {'format': 'png', 'clip': clip, 'optimizeForSpeed': True})
            ff.stdin.write(base64.b64decode(shot['data'])); n += 1
            if n % 300 == 0:
                st = await pg.evaluate("[document.getElementById('chap').textContent,document.getElementById('stage').classList.contains('paused')]")
                el = time.time() - t0
                print(f'{n} frames ({n/FPS:.0f}s film) {el:.0f}s wall {n/el:.1f} fps | {st[0]}', flush=True)
            if n > FPS * 5 and paused and tail is None: tail = n + FPS * 1  # hold one second on the last frame
            if tail is not None and n >= tail: break
        ff.stdin.close(); ff.wait()
        sec = n / FPS
        print('video done', n, 'frames', sec, 's; rendering mix', flush=True)
        size = await pg.evaluate(f'window.__renderAudio({sec})')
        CH = 6_000_000; data = bytearray()
        for i in range(0, size, CH):
            data += base64.b64decode(await pg.evaluate(f'window.__chunk({i},{CH})'))
        with open(f'{OUT}/audio.wav', 'wb') as f:
            f.write(b'RIFF' + struct.pack('<I', 36 + len(data)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 3, 2, 48000, 384000, 8, 32) + b'data' + struct.pack('<I', len(data)))
            f.write(data)
        print('errors', errs[:10], 'time', time.time() - t0, flush=True)
        await b.close()
asyncio.run(main())
