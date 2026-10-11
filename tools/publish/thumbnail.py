"""PK Explains thumbnail from the brand template and one frame of the film.

usage: python3 tools/publish/thumbnail.py episodes/epNN-slug TIME "KICKER" "Line one" "Line two with {accent}" "Subline" [SCALE X Y]
example: python3 tools/publish/thumbnail.py episodes/ep01-... 38 "POWER CUT" "Is her" "{₹200} safe?" "How databases keep a promise"

Template (locked, see pk-brand): navy #0B1226 left 45% with amber kicker in caps, a two-line white question
(one word in amber via {braces}), a mist subline, the PK tile bottom-left; the chosen frame on the right,
faded into the navy. SCALE/X/Y position the frame (defaults 1560 -215 -60 fit a 1080p frame).
Pick a frame with one character's face and one prop that carries the question; no captions on screen.
writes release/thumbnail.jpg (1280x720, < 2 MB)
"""
import asyncio, html, os, re, subprocess, sys
from playwright.async_api import async_playwright

ep, t, kicker, l1, l2, sub = sys.argv[1:7]
scale, x, y = (sys.argv[7:10] + ['1560', '-215', '-60'][len(sys.argv[7:10]):])
rel = os.path.join(ep, 'release')
os.makedirs(rel, exist_ok=True)
frame = os.path.abspath(os.path.join(ep, 'build', 'thumb_frame.png'))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', t, '-i', os.path.join(ep, 'build', 'render', 'video.mkv'),
                '-frames:v', '1', frame], check=True)
acc = lambda s: re.sub(r'\{(.+?)\}', r'<span>\1</span>', html.escape(s))
page = f"""<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700;800&display=swap" rel="stylesheet">
<style>*{{margin:0;box-sizing:border-box}}body{{width:1280px;height:720px;overflow:hidden;font-family:Lexend}}
#t{{position:relative;width:1280px;height:720px;background:#0B1226;overflow:hidden}}
.shot{{position:absolute;right:-40px;top:0;width:900px;height:720px;background:url('file://{frame}') no-repeat;background-size:{scale}px auto;background-position:{x}px {y}px;filter:saturate(1.05) brightness(1.1)}}
.dark{{position:absolute;inset:0;background:radial-gradient(ellipse 50% 60% at 72% 48%,rgba(0,0,0,0) 40%,rgba(0,0,0,.55) 100%)}}
.topf{{position:absolute;inset:0;background:linear-gradient(180deg,#0B1226 0,#0B1226 4%,rgba(11,18,38,0) 16%)}}
.fade{{position:absolute;inset:0;background:linear-gradient(90deg,#0B1226 0%,#0B1226 34%,rgba(11,18,38,.85) 46%,rgba(11,18,38,0) 66%)}}
.txt{{position:absolute;left:64px;top:120px;width:640px;color:#F7F7F5}}
.k{{font-weight:800;font-size:58px;letter-spacing:.06em;color:#EAAA45;text-transform:uppercase}}
.h{{font-weight:800;font-size:112px;line-height:1.0;margin-top:18px;letter-spacing:-.01em}}.h span{{color:#EAAA45}}
.s{{margin-top:28px;font-size:34px;color:#CBD1E2}}
.tile{{position:absolute;left:64px;bottom:52px;width:64px;height:64px;border-radius:21%;background:#EAAA45;color:#121E3B;font-weight:700;font-size:31px;display:grid;place-items:center}}</style></head>
<body><div id="t"><div class="shot"></div><div class="dark"></div><div class="topf"></div><div class="fade"></div>
<div class="txt"><div class="k">{html.escape(kicker)}</div><div class="h">{acc(l1)}<br>{acc(l2)}</div><div class="s">{html.escape(sub)}</div></div>
<div class="tile">PK</div></div></body></html>"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        tmp = os.path.abspath(os.path.join(ep, 'build', 'thumb.html'))
        open(tmp, 'w').write(page)
        await pg.goto('file://' + tmp)
        await pg.wait_for_timeout(2500)
        await pg.screenshot(path=os.path.join(ep, 'build', 'thumb.png'))
        await b.close()
    from PIL import Image
    Image.open(os.path.join(ep, 'build', 'thumb.png')).convert('RGB').save(os.path.join(rel, 'thumbnail.jpg'), quality=92)
    print(os.path.join(rel, 'thumbnail.jpg'))


asyncio.run(main())
