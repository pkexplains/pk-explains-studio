"""Cut a vertical 9:16 Short from the rendered film, with the PK hook overlay.

usage: python3 tools/short.py episodes/epNN-slug START END "KICKER" "Headline line 1<br>Headline <span>accent</span>"
example: python3 tools/short.py episodes/ep01-... 3.0 56.5 "1 MILLISECOND LATER" "The power went out.<br>Is her <span>₹200</span> safe?"

Layout (1080x1920): navy top band with the hook, the film centre-cropped to 4:3 and scaled to 1080x810,
PK lockup and a call to the full film below. Keep it under 60 s. Audio is the master mix for that span.
writes episodes/<ep>/build/PK-Explains-Short.mp4
"""
import asyncio, os, subprocess, sys
from playwright.async_api import async_playwright

ep, a, b, kicker, head = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4], sys.argv[5]
dur = b - a
R = os.path.join(ep, 'build', 'render')
OV = f"""<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap" rel="stylesheet">
<style>*{{margin:0;box-sizing:border-box}}body{{width:1080px;height:1920px;background:transparent;font-family:Lexend}}
.top{{position:absolute;left:0;right:0;top:0;height:470px;background:#0B1226}}.bot{{position:absolute;left:0;right:0;top:1280px;bottom:0;background:#0B1226}}
.k{{position:absolute;left:70px;top:170px;font-weight:700;font-size:44px;letter-spacing:.08em;color:#EAAA45}}
.h{{position:absolute;left:70px;top:236px;width:960px;font-weight:700;font-size:84px;line-height:1.05;color:#F7F7F5}}.h span{{color:#EAAA45}}
.lock{{position:absolute;left:70px;top:1340px;display:flex;align-items:center;gap:22px}}
.tile{{width:76px;height:76px;border-radius:21%;background:#EAAA45;color:#121E3B;font-weight:700;font-size:36px;display:grid;place-items:center}}
.word{{font-size:46px;color:#CBD1E2}}.word b{{color:#F7F7F5;margin-right:.26em}}
.cta{{position:absolute;left:70px;top:1450px;font-size:38px;color:#CBD1E2;width:900px;line-height:1.35}}.cta b{{color:#F7F7F5}}</style></head>
<body><div class="top"></div><div class="bot"></div><div class="k">{kicker}</div><div class="h">{head}</div>
<div class="lock"><div class="tile">PK</div><div class="word"><b>PK</b>Explains</div></div>
<div class="cta">The answer is in the <b>full film</b>.<br>Tap the link above the title.</div></body></html>"""


async def overlay(path):
    async with async_playwright() as p:
        br = await p.chromium.launch()
        pg = await br.new_page(viewport={'width': 1080, 'height': 1920})
        await pg.set_content(OV)
        await pg.wait_for_timeout(2500)
        await pg.screenshot(path=path, omit_background=True)
        await br.close()


ov = os.path.join(ep, 'build', 'short_overlay.png')
asyncio.run(overlay(ov))
out = os.path.join(ep, 'build', 'PK-Explains-Short.mp4')
fc = (f"[0:v]crop=1440:1080:240:0,scale=1080:810:flags=lanczos,format=yuv420p[v];color=c=0x0B1226:s=1080x1920:d={dur}[bg];"
      f"[bg][v]overlay=0:470[x];[x][2:v]overlay=0:0,fade=t=in:st=0:d=0.3,fade=t=out:st={dur - 1}:d=1,format=yuv420p[out];"
      f"[1:a]afade=t=in:st=0:d=0.2,afade=t=out:st={dur - 1.5}:d=1.5,volume=-0.6dB,alimiter=limit=0.89:level=false[aa]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(a), '-t', str(dur), '-i', f'{R}/video.mkv', '-ss', str(a), '-t', str(dur),
                '-i', f'{R}/audio.wav', '-i', ov, '-filter_complex', fc, '-map', '[out]', '-map', '[aa]', '-c:v', 'libx264', '-preset', 'slow',
                '-crf', '17', '-r', '30', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', out], check=True)
print(out)
