"""Listen-back QA: transcribe every voice clip and flag lines that don't match the script.
usage: python3 tools/asr_check.py episodes/epNN-slug   (needs faster-whisper; ~1 s per clip on CPU)
A flagged line is usually a pronunciation: add a rule to direction.json "pronounce" (episode) or
series/pronunciation.json (every episode), then re-run tools/voice.py, which re-renders only changed lines."""
import json,re,sys,difflib,subprocess,numpy as np
def pcm(f):return np.frombuffer(subprocess.run(['ffmpeg','-loglevel','error','-i',f,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout,np.int16).astype(np.float32)/32768
from faster_whisper import WhisperModel
import os
D=os.path.join(sys.argv[1],'voice');I=json.load(open(f'{D}/index.json'))
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAMES=', '.join(c['name'].replace('The ','') for c in json.load(open(os.path.join(ROOT,'series','cast.json')))['cast'].values())
m=WhisperModel('small.en',device='cpu',compute_type='int8')
U={w:i for i,w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
U.update({w:10*(i+2) for i,w in enumerate('twenty thirty forty fifty sixty seventy eighty ninety'.split())})
def words2num(ws):
    """'two hundred' -> '200' so spoken numbers match the digits a transcriber writes"""
    out=[];cur=None
    for w in ws+['']:
        if w in U:cur=(cur or 0)+U[w];continue
        if w=='hundred' and cur is not None:cur*=100;continue
        if w=='thousand' and cur is not None:cur*=1000;out.append(str(cur));cur=None;continue
        if cur is not None:out.append(str(cur));cur=None
        if w:out.append(w)
    return out
def norm(t):
    t=t.lower().replace('postgresql','postgres q l').replace('₹','').replace('-',' ')
    return words2num(re.sub(r'[^a-z0-9 ]',' ',t).split())
bad=[]
for t,v in I.items():
    segs,_=m.transcribe(pcm(f"{D}/{v['f']}"),beam_size=3,language='en',initial_prompt=NAMES+', PostgreSQL, MVCC, WAL, fdatasync.')
    hyp=' '.join(s.text for s in segs)
    tt=t.split('|',1)[-1];r=difflib.SequenceMatcher(None,norm(tt),norm(hyp)).ratio()
    if r<0.88:bad.append((round(r,2),t,hyp.strip()))
for b in sorted(bad):print(b[0],'\n  SCRIPT:',b[1],'\n  HEARD: ',b[2])
print('checked',len(I),'flagged',len(bad))
