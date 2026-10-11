"""Directed narration and the voiced cast (Kokoro TTS, locked voices from series/cast.json).

usage: python3 tools/voice.py episodes/epNN-slug [--only dialogue|narration] [--redo]

A narrator is a performer: every line is broken into phrases, each with a delivery (pace, level) and a
pause. episodes/<ep>/direction.json holds the hand-directed key moments ("direct": {line: [[phrase,
delivery, pause_ms], ...]}) and episode pronunciations ("pronounce": [[regex, spoken], ...]); everything
else gets automatic direction. series/pronunciation.json applies to every episode.

Unchanged lines are skipped (same text + same direction = same file), so re-running after a script edit
only renders what changed. --redo renders everything. Then run tools/asr_check.py.
"""
import hashlib, json, os, re, subprocess, sys
import numpy as np, soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ep = sys.argv[1]
ONLY = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else ''
REDO = '--redo' in sys.argv
OUT = os.path.join(ep, 'voice')
CAST = json.load(open(os.path.join(ROOT, 'series', 'cast.json')))
FIX = [tuple(r) for r in json.load(open(os.path.join(ROOT, 'series', 'pronunciation.json')))['rules']]
DIRN = json.load(open(os.path.join(ep, 'direction.json'))) if os.path.exists(os.path.join(ep, 'direction.json')) else {}
FIX = [tuple(r) for r in DIRN.get('pronounce', [])] + FIX           # episode rules first (more specific)
DIRECT = {k: [tuple(s) for s in v] for k, v in DIRN.get('direct', {}).items()}
D = {k: tuple(v) for k, v in CAST['narrator']['palette'].items()}
NARRATOR = CAST['narrator']['voice']
MODEL = os.environ.get('KOKORO_DIR', os.path.join(ROOT, 'models', 'kokoro'))

from kokoro_onnx import Kokoro
K = Kokoro(os.path.join(MODEL, 'kokoro-v1.0.onnx'), os.path.join(MODEL, 'voices-v1.0.bin'))


def say(t):
    for a, b in FIX:
        t = re.sub(a, b, t)
    return t


ASIDE = re.compile(r"^(Engineers call|Computer people call|That's called|It's called|This is called|That is called|Making the copy is called)")


def auto(line):
    """default direction: sentence by sentence; short sentences land as beats, questions breathe, jargon is an aside"""
    sents = re.findall(r'[^.?!]+[.?!]+', line) or [line]
    out = []
    for i, s in enumerate(sents):
        s = s.strip(); w = len(s.split()); d = 'warm'; p = 260
        if ASIDE.match(s): d = 'aside'
        elif s.startswith('Remember'): d = 'hush'; p = 300
        elif w <= 4: d = 'beat'; p = 380
        if s.endswith('?'): p = 480
        if i == len(sents) - 1: p = 0
        out.append((s, d, p))
    return out


def synth(text, voice, speed, lang='en-us'):
    a, sr = K.create(say(text), voice=voice, speed=speed, lang=lang)
    return a.astype(np.float32), sr


def trim(a, th=0.01):
    idx = np.where(np.abs(a) > th)[0]
    return a[max(0, idx[0] - 240):idx[-1] + 480] if len(idx) else a


def perform(segments, voice, lang='en-us'):
    parts = []; sr = 24000
    for text, dlv, pause in segments:
        sp, g = D[dlv]; a, sr = synth(text, voice, sp, lang); a = trim(a) * (10 ** (g / 20))
        n = min(240, len(a) // 4); a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n)
        parts += [a, np.zeros(int(sr * pause / 1000), np.float32)]
    return np.concatenate(parts), sr


# narrator: dry, close, warm.  dialogue: in the room (short early reflections), slightly band-limited
NCHAIN = ("highpass=f=60,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=6500:t=q:w=2:g=-2.5,"
          "acompressor=threshold=-22dB:ratio=2.5:attack=10:release=200:makeup=1.5,adelay=120|120,apad=pad_dur=0.12,loudnorm=I=-16:TP=-1.5:LRA=9")
DCHAIN = ("highpass=f=110,lowpass=f=9000,equalizer=f=2500:t=q:w=1:g=2,aecho=0.8:0.6:23|41:0.18|0.10,"
          "acompressor=threshold=-20dB:ratio=3:attack=6:release=150:makeup=2,apad=pad_dur=0.08,loudnorm=I=-18:TP=-2")


def finish(a, sr, chain, mp3):
    raw = mp3[:-4] + '.wav'; sf.write(raw, a, sr)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', chain, '-ac', '1', '-ar', '24000', '-b:a', '64k', mp3], check=True)
    os.remove(raw)
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)


os.makedirs(OUT, exist_ok=True)
ip = os.path.join(OUT, 'index.json')
old = json.load(open(ip)) if os.path.exists(ip) else {}
index, made, kept = {}, 0, 0
LINES = json.load(open(os.path.join(OUT, 'lines.json')))
DLG = json.load(open(os.path.join(OUT, 'dialogue.json')))
for t in LINES:
    segs = DIRECT.get(t) or auto(t)
    key = hashlib.md5((t + json.dumps(segs) + NARRATOR).encode()).hexdigest()[:10]
    prev = old.get(t)
    if ONLY == 'dialogue' or (not REDO and prev and prev.get('key') == key and os.path.exists(os.path.join(OUT, prev['f']))):
        if prev: index[t] = prev; kept += 1
        continue
    a, sr = perform(segs, NARRATOR)
    index[t] = {'f': key + '.mp3', 'd': round(finish(a, sr, NCHAIN, os.path.join(OUT, key + '.mp3')), 3), 'kind': 'n', 'direction': segs, 'key': key}
    made += 1
for d in DLG:
    who, t = d['who'], d['text']
    if who not in CAST['cast']:
        sys.exit(f"'{who}' has no voice in series/cast.json: cast them first (pick an unused Kokoro voice, keep it forever)")
    c = CAST['cast'][who]; v, sp = c['voice'], c['speed']; lang = 'en-gb' if v.startswith('b') else 'en-us'
    k = '@' + who + '|' + t
    key = hashlib.md5((who + t + v + str(sp)).encode()).hexdigest()[:10]
    prev = old.get(k)
    if ONLY == 'narration' or (not REDO and prev and prev.get('key') == key and os.path.exists(os.path.join(OUT, prev['f']))):
        if prev: index[k] = prev; kept += 1
        continue
    a, sr = synth(t, v, sp, lang); a = trim(a)
    index[k] = {'f': key + '.mp3', 'd': round(finish(a, sr, DCHAIN, os.path.join(OUT, key + '.mp3')), 3), 'kind': 'd', 'voice': v, 'key': key}
    made += 1
json.dump(index, open(ip, 'w'), ensure_ascii=False, indent=0)
used = {v['f'] for v in index.values()}
for f in os.listdir(OUT):
    if f.endswith('.mp3') and f not in used:
        os.remove(os.path.join(OUT, f))
n = [v['d'] for v in index.values() if v['kind'] == 'n']
print(f'rendered {made}, kept {kept}; narration {len(n)} lines {sum(n) / 60:.1f} min; dialogue {len(index) - len(n)}')
