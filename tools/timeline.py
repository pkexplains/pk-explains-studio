"""Exact scene, caption and dialogue timings of the story cut, using the same virtual clock as render.py,
so chapters and subtitles line up frame-for-frame with the rendered video.

usage: python3 tools/timeline.py episodes/epNN-slug      -> episodes/<ep>/release/timeline.json
Rows: ["chap", t, "Act · Scene"] | ["cap", t, "narration text" or ""] | ["bub", t, "dialogue || dialogue"] | ["end", t, ""]
Takes ~5 minutes for a 17-minute film (it yields to the page every frame, like the renderer).
"""
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
INIT = re.search(r'INIT = r"""(.*?)"""', open(os.path.join(HERE, 'render.py')).read(), re.S).group(1).replace('%AUDIO_MIN%', '1')


async def main(ep):
    film = os.path.join(ep, 'build', 'film.html')
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1600, 'height': 1000})
        await pg.add_init_script(INIT)
        await pg.goto('file://' + os.path.abspath(film))
        for _ in range(20):
            await pg.evaluate('window.__step(16)')
            await pg.wait_for_timeout(50)
        await pg.evaluate("document.getElementById('bigplay').click()")
        log = await pg.evaluate("""async()=>{const out=[];let lastChap='',lastCap='',lastB='';const dt=1000/30;
          for(let n=1;n<60000;n++){window.__step(dt);await new Promise(r=>setTimeout(r,0));if(n%3)continue;
            const t=n/30;const chap=document.getElementById('chap').textContent;if(chap!==lastChap){out.push(['chap',t,chap]);lastChap=chap;}
            const capEl=document.getElementById('caption');const cap=capEl?capEl.textContent.trim():'';if(cap!==lastCap){out.push(['cap',t,cap]);lastCap=cap;}
            const bs=[...document.querySelectorAll('#fx > g')].map(g=>g.textContent.trim()).filter(x=>x&&!/^z/i.test(x)).join(' || ');if(bs!==lastB){out.push(['bub',t,bs]);lastB=bs;}
            if(n>300&&document.getElementById('stage').classList.contains('paused')){out.push(['end',t,'']);break;}}
          return out;}""")
        await b.close()
    out = os.path.join(ep, 'release', 'timeline.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(log, open(out, 'w'), ensure_ascii=False, indent=0)
    print(f'{len(log)} events, film ends at {log[-1][1]:.1f}s -> {out}')


asyncio.run(main(sys.argv[1]))
