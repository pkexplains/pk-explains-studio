"""Captions (.srt) and YouTube chapters straight from release/timeline.json.

usage: python3 tools/publish/captions.py episodes/epNN-slug
writes release/captions-en.srt and release/chapters.txt

Captions: narration is split into readable cues (<= ~84 chars, sentence and comma breaks) and timed
across the time the line is on screen; dialogue bubbles become quoted cues. Sign-like bubbles
(READY, arithmetic) are skipped because nobody speaks them. Overlaps are trimmed.
Chapters: one per scene, the opening logo folded into 0:00, scene names without the act prefix.
"""
import json, os, re, sys

SKIP = re.compile(r'^(READY|[\d\s+−=-]+)$')


def ts(t):
    h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60
    return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}'


def spans(L, kind, end):
    ev = [(t, x) for k, t, x in L if k == kind] + [(end, '')]
    return [[t, t2, x] for (t, x), (t2, _) in zip(ev, ev[1:]) if x]


def chunks(text):
    sents = re.split(r'(?<=[.?!:])\s+(?=[A-Z0-9“"‘])', text)
    out = []
    for s in sents:
        if out and len(out[-1]) + len(s) < 70:
            out[-1] += ' ' + s
        else:
            out.append(s)
    fin = []
    for c in out:
        while len(c) > 84:
            i = c.rfind(', ', 0, 80)
            i = i if i > 30 else c.rfind(' ', 0, 80)
            fin.append(c[:i + 1].strip())
            c = c[i + 1:].strip()
        fin.append(c)
    return fin


def main(ep):
    L = json.load(open(os.path.join(ep, 'release', 'timeline.json')))
    end = [t for k, t, x in L if k == 'end'][-1]
    cues = []
    for a, b, x in spans(L, 'cap', end):
        parts = chunks(x)
        tot = sum(len(c) for c in parts)
        speak = min(b - a, tot / 15 + 0.6)
        t = a
        for c in parts:
            d = speak * len(c) / tot
            cues.append([t, t + d, c])
            t += d
    for a, b, x in spans(L, 'bub', end):
        for part in x.split(' || '):
            if SKIP.match(part.replace('−', '-').strip()):
                continue
            cues.append([a, min(b, a + len(part) / 13 + 1.2), '“' + part + '”'])
    cues.sort()
    clean = []
    for c in cues:
        if clean and c[2] == clean[-1][2] and c[0] <= clean[-1][1] + 3:
            clean[-1][1] = max(clean[-1][1], c[1])
            continue
        clean.append(c)
    for i in range(len(clean) - 1):
        clean[i][1] = min(clean[i][1], clean[i + 1][0])
    clean = [c for c in clean if c[1] - c[0] >= 0.3]
    srt = '\n'.join(f'{i}\n{ts(a)} --> {ts(b)}\n{x}\n' for i, (a, b, x) in enumerate(clean, 1))
    open(os.path.join(ep, 'release', 'captions-en.srt'), 'w').write(srt)
    chap = []
    for k, t, x in L:
        if k != 'chap':
            continue
        name = x.split(' · ')[-1]
        if name in ('Opening logo', 'End slate'):
            continue
        chap.append([0 if not chap else int(t), name])
    lines = [f'{t // 60}:{t % 60:02d} {n}' for t, n in chap]
    open(os.path.join(ep, 'release', 'chapters.txt'), 'w').write('\n'.join(lines) + '\n')
    print(f'{len(clean)} caption cues, {len(chap)} chapters')


main(sys.argv[1])
