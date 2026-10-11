"""PK Films score composer: writes orchestral MIDI cues around the protagonist's theme, renders them
with FluidSynth (FluidR3 GM), and masters them as seamless loops. Usage: python3 compose.py OUTDIR"""
import pretty_midi as pm, random, subprocess, sys, os, numpy as np, soundfile as sf
OUT=sys.argv[1] if len(sys.argv)>1 else 'cues'; os.makedirs(OUT,exist_ok=True)
SF='/usr/share/sounds/sf2/FluidR3_GM.sf2'
random.seed(7)
P=dict(piano=0,celesta=8,glock=9,harp=46,timp=47,strings=48,slowstr=49,violin=40,viola=41,cello=42,bass=43,trem=44,pizz=45,horn=60,brass=61,trombone=57,flute=73,oboe=68,clarinet=71,choir=52)
NOTE={'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11}
Q={'':[0,4,7],'m':[0,3,7],'7':[0,4,7,10],'m7':[0,3,7,10],'maj7':[0,4,7,11],'sus2':[0,2,7],'sus4':[0,5,7],'add9':[0,4,7,14],'madd9':[0,3,7,14],'dim':[0,3,6]}
def parse(sym):
    r=sym[:2] if len(sym)>1 and sym[1] in '#b' else sym[:1];q=sym[len(r):];bass=None
    if '/' in q:q,b=q.split('/');bass=NOTE[b]
    return NOTE[r],Q[q],bass
def voice(sym,lo=55,prev=None):
    r,q,_=parse(sym);pcs=[(r+i)%12 for i in q];best=None
    for base in range(lo,lo+12):
        v=sorted({base+((pc-base)%12) for pc in pcs})
        while len(v)<4:v.append(v[len(v)-len(pcs)]+12)
        cost=sum(abs(a-b) for a,b in zip(v,prev)) if prev else abs(v[0]-lo-4)
        if best is None or cost<best[0]:best=(cost,v)
    return best[1]
def bassnote(sym,lo=36):
    r,q,b=parse(sym);pc=b if b is not None else r;return lo+((pc-lo)%12)
class Cue:
    def __init__(s,bpm):s.m=pm.PrettyMIDI(initial_tempo=bpm);s.bpm=bpm;s.beat=60/bpm;s.ins={}
    def inst(s,name,ch=None):
        if name not in s.ins:
            i=pm.Instrument(program=P[name],is_drum=False,name=name);s.m.instruments.append(i);s.ins[name]=i
        return s.ins[name]
    def note(s,name,pitch,start_beat,dur_beats,vel,jit=0.012):
        t=start_beat*s.beat+random.uniform(-jit,jit);v=max(1,min(127,int(vel+random.randint(-5,5))))
        s.inst(name).notes.append(pm.Note(velocity=v,pitch=int(pitch),start=max(0,t),end=max(0.05,t+dur_beats*s.beat*0.98)))
    def swell(s,name,b0,b1,v0,v1,steps=16):
        """expression (CC11) ramp: strings breathe instead of sitting flat"""
        i=s.inst(name)
        for k in range(steps+1):
            t=(b0+(b1-b0)*k/steps)*s.beat;i.control_changes.append(pm.ControlChange(11,int(v0+(v1-v0)*k/steps),t))
    def render(s,path,loop_beats):
        s.m.write(path+'.mid')
        L=loop_beats*s.beat
        # play the MIDI twice so the loop segment carries its own reverb tail in from the previous pass
        two=pm.PrettyMIDI(initial_tempo=s.bpm)
        for i in s.m.instruments:
            j=pm.Instrument(program=i.program,is_drum=i.is_drum,name=i.name)
            for rep in (0,1):
                for n in i.notes:j.notes.append(pm.Note(n.velocity,n.pitch,n.start+rep*L,n.end+rep*L))
                for c in i.control_changes:j.control_changes.append(pm.ControlChange(c.number,c.value,c.time+rep*L))
            two.instruments.append(j)
        two.write(path+'_x2.mid')
        subprocess.run(['fluidsynth','-ni','-g','0.5','-r','44100','-R','1','-C','0','-F',path+'_raw.wav',SF,path+'_x2.mid'],check=True,capture_output=True)
        a,sr=sf.read(path+'_raw.wav');seg=a[int(L*sr):int(2*L*sr)]
        sf.write(path+'_loop.wav',seg,sr);return L

# Themes (D major / B minor). Mira's motif: D F# A | D (rising, hopeful). Manager: low G-D fall.
MIRA=[(74,0,1),(78,1,1),(81,2,1.5),(86,3.5,2.5)]
def mira_theme(c,inst,b0,vel=70,oct=0):
    for p,o,d in MIRA:c.note(inst,p+oct,b0+o,d,vel)
def mira_answer(c,inst,b0,vel=66,oct=0):
    for p,o,d in [(83,0,1),(81,1,1),(78,2,1),(76,3,3)]:c.note(inst,p+oct,b0+o,d,vel)

def pad(c,inst,prog,bars,vel,lo=55,beats=4):
    prev=None
    for i,ch in enumerate(prog*(bars//len(prog))):
        v=voice(ch,lo,prev);prev=v
        for p in v:c.note(inst,p,i*beats,beats,vel,jit=0.02)
def bassline(c,inst,prog,bars,vel,beats=4,pattern=None):
    for i,ch in enumerate(prog*(bars//len(prog))):
        b=bassnote(ch)
        if pattern:
            for o,d in pattern:c.note(inst,b,i*beats+o,d,vel)
        else:c.note(inst,b,i*beats,beats,vel)

cues={}
# 1. NIGHT: the kitchen at night. Curious, warm, light. Pizzicato walk, celesta theme, soft strings.
c=Cue(76);prog=['Bm','G','D','A','Bm','G','Em7','A'];bars=16
pad(c,'slowstr',prog,bars,46,lo=54);c.swell('slowstr',0,32,60,90);c.swell('slowstr',32,64,90,64)
bassline(c,'pizz',prog,bars,70,pattern=[(0,.5),(1.5,.5),(2,.5),(3,.5)])
for i,ch in enumerate(prog*2):
    v=voice(ch,62)
    for k,o in enumerate([0.5,1,2.5,3]):c.note('pizz',v[k%3]+12 if k==3 else v[k%3],i*4+o,.5,48)
mira_theme(c,'celesta',8*4,64);mira_answer(c,'celesta',10*4,58);mira_theme(c,'flute',12*4,52,-12);mira_answer(c,'flute',14*4,50,-12)
for i in range(0,bars,2):c.note('harp',bassnote(prog[i%8],50)+12,i*4,8,40)
cues['night']=(c,bars*4)
# 2. TENSION: conflict, rival, true story. Low string ostinato, heartbeat timpani, dissonant tremolo.
c=Cue(96);bars=16
for b in range(bars*4):
    for h in (0,.5):c.note('cello',38 if (b//8)%2==0 else 39,b+h,.45,74 if h==0 else 58)
    c.note('bass',26 if (b//8)%2==0 else 27,b,1,60) if b%2==0 else None
for b in range(0,bars*4,2):c.note('timp',38,b,.5,88);c.note('timp',38,b+.35,.4,60)
for b0,ch in [(0,[62,63,69]),(8,[62,63,70]),(16,[63,64,69]),(24,[62,65,68]),(32,[64,65,71]),(40,[63,66,70]),(48,[65,66,72]),(56,[62,63,69])]:
    for p in ch:c.note('trem',p,b0,8,52)
c.swell('trem',0,16,50,95);c.swell('trem',16,32,95,60);c.swell('trem',32,56,60,110);c.swell('trem',56,64,110,55)
for b,p in [(12,50),(28,51),(44,53),(52,51),(60,50)]:c.note('horn',p,b,4,58+b//4)
for b in range(32,64,4):c.note('oboe',74 if (b//4)%2==0 else 75,b+1,2.5,44)
cues['tension']=(c,bars*4)
# 3. BUILD: the trick in progress. Piano arpeggios over rising strings.
c=Cue(88);prog=['G','A','Bm','D/F#','G','A','Bm','A'];bars=16
prev=None
for i,ch in enumerate(prog*2):
    v=voice(ch,60,prev);prev=v;arp=[v[0],v[1],v[2],v[1]+12 if len(v)>1 else v[0]+12]
    for k in range(8):c.note('piano',arp[k%4]+(12 if k>=4 else 0),i*4+k*.5,.6,56+(i%8)*3)
pad(c,'strings',prog,bars,50,lo=55);c.swell('strings',0,32,50,105);c.swell('strings',32,64,70,120)
bassline(c,'cello',prog,bars,66,pattern=[(0,2),(2,2)])
mira_theme(c,'violin',16,62);mira_theme(c,'violin',24,74,12);mira_theme(c,'horn',48,72,-12);mira_answer(c,'violin',56,80,12)
for b in range(32,64,8):c.note('timp',38,b,1,56+b//4)
cues['build']=(c,bars*4)
# 4. WONDER: the payoff. Full theme on horn and strings, warm.
c=Cue(68);prog=['D','A/C#','Bm','G','D/F#','Em7','A','D'];bars=16
pad(c,'slowstr',prog,bars,54,lo=54);c.swell('slowstr',0,16,62,100);c.swell('slowstr',16,32,100,80);c.swell('slowstr',32,52,80,115);c.swell('slowstr',52,64,115,75)
bassline(c,'cello',prog,bars,62);bassline(c,'bass',prog,bars,50)
mira_theme(c,'horn',0,70,-12);mira_answer(c,'horn',8,66,-12);mira_theme(c,'violin',16,72);mira_answer(c,'violin',24,70)
mira_theme(c,'flute',32,60);mira_answer(c,'clarinet',40,58,-12);mira_theme(c,'violin',48,78,12);mira_answer(c,'violin',56,74,12)
pad(c,'choir',prog[4:]+prog[:4],8,30,lo=60)
for i,ch in enumerate(prog*2):
    v=voice(ch,62)
    for k in range(4):c.note('harp',v[k%3]+12*(k//3),i*4+k,1.5,46)
cues['wonder']=(c,bars*4)
# 5. CREDITS: the theme in full, march-like warmth.
c=Cue(80);prog=['D','Bm','G','A','D','Bm','Em7','A','G','A','Bm','G','D','A/C#','Bm','A'];bars=16
pad(c,'strings',prog,bars,56,lo=55);bassline(c,'cello',prog,bars,64,pattern=[(0,1.5),(2,1.5)])
for i in range(bars):c.note('timp',38 if i%2==0 else 33,i*4,1,50)
for b0 in (0,16,32,48):mira_theme(c,'horn' if b0%32==0 else 'violin',b0,72,-12 if b0%32==0 else 0);mira_answer(c,'flute',b0+8,62)
for i,ch in enumerate(prog):
    v=voice(ch,62)
    for k in range(8):c.note('harp',v[k%3]+12*(k%2),i*4+k*.5,.8,40)
cues['credits']=(c,bars*4)
# 6. BUILD toward danger for the cold open (suspense pad + celesta theme hint, then held)
c=Cue(60);bars=8
for b0,ch in [(0,['Bm']),(8,['G']),(16,['Em7']),(24,['F#'])]:
    for p in voice(ch[0],52):c.note('slowstr',p,b0,8,44)
c.swell('slowstr',0,32,55,90)
for b in range(0,32,4):c.note('glock',86 if (b//4)%2==0 else 85,b+2,2,34)
mira_theme(c,'celesta',8,48);c.note('bass',35,0,16,40);c.note('bass',30,16,16,44)
cues['suspense']=(c,bars*4)

meta={}
for name,(c,beats) in cues.items():
    L=c.render(f'{OUT}/{name}',beats)
    # master: clean lows, gentle glue compression, loudness -20 LUFS (music sits under -16 LUFS dialogue)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{OUT}/{name}_loop.wav','-af',
      'highpass=f=32,equalizer=f=250:t=q:w=1:g=-1.5,equalizer=f=9000:t=h:w=1:g=1.5,acompressor=threshold=-20dB:ratio=2:attack=30:release=300:makeup=1,loudnorm=I=-20:TP=-2:LRA=9',
      '-ar','44100','-ac','2','-b:a','80k',f'{OUT}/{name}.mp3'],check=True)
    meta[name]=round(L,3);print(name,round(L,1),'s')
import json;json.dump(meta,open(f'{OUT}/meta.json','w'))

# stingers: act-card hit (timpani roll + low brass), reveal swell
st=Cue(90)
for k in range(12):st.note('timp',38,k*.125,.2,40+k*6)
for p in (38,45,50,57):st.note('brass',p,1.5,3,96)
st.note('timp',38,1.5,2,118);st.note('bass',26,1.5,3,90)
st.m.write(f'{OUT}/sting_act.mid')
subprocess.run(['fluidsynth','-ni','-g','0.6','-r','44100','-R','1','-C','0','-F',f'{OUT}/sting_act_raw.wav',SF,f'{OUT}/sting_act.mid'],check=True,capture_output=True)
sw=Cue(70)
for p in voice('Dmaj7',60)+[50,74]:sw.note('slowstr',p,0,6,70)
sw.swell('slowstr',0,6,20,115);mira_theme(sw,'celesta',3,70)
sw.m.write(f'{OUT}/sting_reveal.mid')
subprocess.run(['fluidsynth','-ni','-g','0.6','-r','44100','-R','1','-C','0','-F',f'{OUT}/sting_reveal_raw.wav',SF,f'{OUT}/sting_reveal.mid'],check=True,capture_output=True)
for n,d in [('sting_act',4.8),('sting_reveal',8)]:
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{OUT}/{n}_raw.wav','-t',str(d),'-af',f'afade=t=out:st={d-1.2}:d=1.2,highpass=f=30,loudnorm=I=-18:TP=-1.5','-ar','44100','-ac','2','-b:a','80k',f'{OUT}/{n}.mp3'],check=True)
# leitmotif stingers in the same orchestra as the score (never a different-sounding synth)
mm=Cue(84);mira_theme(mm,'celesta',0,78);mira_theme(mm,'harp',0,52);mm.note('slowstr',62,0,6,40);mm.note('slowstr',66,0,6,36)
mm.m.write(f'{OUT}/motif_mira.mid')
mg=Cue(60);mg.note('horn',43,0,2,84);mg.note('horn',38,1.5,3,80);mg.note('bass',31,0,2,70);mg.note('bass',26,1.5,3,70);mg.note('timp',31,0,1,60)
mg.m.write(f'{OUT}/motif_manager.mid')
for n,d in [('motif_mira',4.5),('motif_manager',5)]:
    subprocess.run(['fluidsynth','-ni','-g','0.6','-r','44100','-R','1','-C','0','-F',f'{OUT}/{n}_raw.wav',SF,f'{OUT}/{n}.mid'],check=True,capture_output=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{OUT}/{n}_raw.wav','-t',str(d),'-af',f'afade=t=out:st={d-1}:d=1,highpass=f=30,loudnorm=I=-20:TP=-2','-ar','44100','-ac','2','-b:a','80k',f'{OUT}/{n}.mp3'],check=True)
print('stingers ok')
