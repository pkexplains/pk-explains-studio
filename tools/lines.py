"""Collect every line that needs a voice: narration (story + engineer's cut) from the built film's own
script panel, dialogue from say(<character>,'text') calls in scenes.js.

usage: python3 tools/lines.py episodes/epNN-slug      (build with --no-media first)
writes episodes/<ep>/voice/lines.json and voice/dialogue.json
"""
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright


async def narration(film):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto('file://' + os.path.abspath(film))
        await pg.wait_for_timeout(1500)
        story = await pg.eval_on_selector_all('#sbody p', 'e=>e.map(x=>x.textContent)')
        await pg.click('#engBtn')
        await pg.wait_for_timeout(1500)
        eng = await pg.eval_on_selector_all('#sbody p', 'e=>e.map(x=>x.textContent)')
        await b.close()
    out = []
    for t in story + eng:
        if t not in out and t != '(no narration)':
            out.append(t)
    return out


def dialogue(scenes):
    src = open(scenes).read()
    out, seen = [], set()
    for who, q, text in re.findall(r"say\((\w+),\s*(['\"])((?:\\.|(?!\2).)*)\2", src):
        text = text.replace("\\'", "'").replace('\\"', '"')
        if (who, text) not in seen:
            seen.add((who, text))
            out.append({'who': who, 'text': text})
    return out


ep = sys.argv[1]
os.makedirs(os.path.join(ep, 'voice'), exist_ok=True)
n = asyncio.run(narration(os.path.join(ep, 'build', 'film.html')))
d = dialogue(os.path.join(ep, 'scenes.js'))
json.dump(n, open(os.path.join(ep, 'voice', 'lines.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(d, open(os.path.join(ep, 'voice', 'dialogue.json'), 'w'), ensure_ascii=False, indent=0)
print(f'{len(n)} narration lines ({sum(len(x.split()) for x in n)} words), {len(d)} dialogue lines')
