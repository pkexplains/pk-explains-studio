"""Assemble one episode into a single self-contained film page.

usage: python3 tools/build.py episodes/epNN-slug [--no-media] [--out PATH]

Reads   studio/templates/film.html + studio/** (engine, world, cast, brand, sound, runner)
        episodes/<ep>/episode.json, world.js, scenes.js, looks.js, hud.html, world.svg (optional)
        episodes/<ep>/voice/index.json + mp3s   (from tools/voice.py)
        series/music/*.mp3 + meta.json, plus episodes/<ep>/music/*.mp3 if the episode adds cues
Writes  episodes/<ep>/build/film.html   (default)

--no-media builds without voice and music (fast preview while writing scenes).
"""
import base64, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def b64(path):
    return base64.b64encode(open(path, 'rb').read()).decode()


def voice_pack(ep):
    idx = os.path.join(ep, 'voice', 'index.json')
    if not os.path.exists(idx):
        return {}
    out = {}
    for text, v in json.load(open(idx)).items():
        out[text] = [v['d'], b64(os.path.join(ep, 'voice', v['f']))]
    return out


def music_pack(ep):
    out = {}
    for d in (os.path.join(ROOT, 'series', 'music'), os.path.join(ep, 'music')):
        if not os.path.isdir(d):
            continue
        meta = json.load(open(os.path.join(d, 'meta.json'))) if os.path.exists(os.path.join(d, 'meta.json')) else {}
        for f in sorted(os.listdir(d)):
            if f.endswith('.mp3'):
                name = f[:-4]
                out[name] = [meta.get(name, 0), b64(os.path.join(d, f))]
    return out


def build(ep, media=True, out=None):
    ep = os.path.abspath(ep)
    meta = json.load(open(os.path.join(ep, 'episode.json')))
    t = open(os.path.join(ROOT, 'studio', 'templates', 'film.html')).read()

    def inc(m):
        return open(os.path.join(ROOT, m.group(1))).read().rstrip('\n')

    def epi(m):
        p = os.path.join(ep, m.group(1))
        return open(p).read().rstrip('\n') if os.path.exists(p) else ''

    t = re.sub(r'\{\{INCLUDE ([^}]+)\}\}', inc, t)
    t = re.sub(r'\{\{EPISODE ([^}]+)\}\}', epi, t)
    world_svg = os.path.join(ep, 'world.svg')
    t = t.replace('{{EPISODE_WORLD_SVG}}', open(world_svg).read().rstrip('\n') if os.path.exists(world_svg) else '')
    t = t.replace('{{EPISODE_HUD}}', open(os.path.join(ep, 'hud.html')).read().rstrip('\n'))
    t = t.replace('{{TITLE_HTML}}', html.escape(meta['title']))
    t = t.replace('{{LEDE_HTML}}', html.escape(meta['lede'], quote=False))
    pub = {k: meta[k] for k in ('number', 'title', 'logline')}
    t = t.replace('{{EPISODE_JSON}}', json.dumps(pub, ensure_ascii=False))
    v = json.dumps(voice_pack(ep) if media else {}, ensure_ascii=False)
    m = json.dumps(music_pack(ep) if media else {}, ensure_ascii=False)
    t = t.replace('__VOICE__', v.replace('</', '<\\/')).replace('__MUSIC__', m.replace('</', '<\\/'))
    left = re.findall(r'\{\{[A-Z_ ]+[^}]*\}\}', t)
    if left:
        sys.exit(f'unfilled placeholders: {left[:5]}')
    out = out or os.path.join(ep, 'build', 'film.html')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w').write(t)
    print(f'built {out} ({len(t) / 1e6:.1f} MB)')
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    out = a[a.index('--out') + 1] if '--out' in a else None
    build(a[0], media='--no-media' not in a, out=out)
