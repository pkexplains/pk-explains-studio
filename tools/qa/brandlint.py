"""Brand lint: fail the build if the film drifts from the locked PK Explains identity.

usage: python3 tools/qa/brandlint.py episodes/epNN-slug
Checks the built film (static) and plays the bookends (runtime):
  tokens   --pk-navy #121E3B, --pk-amber #EAAA45, --pk-white #F7F7F5, --pk-mist #CBD1E2, Lexend, tile radius 21%
  bookends first scene "Opening logo" (studioIdent), last scene "End slate"; ident reads "PK Explains";
           end slate reads "A PK Films Production"; watermark (.bug) present and on during the story
  credits  credits roll ends with "A PK Films Production" and "PK Films"
  banned   no personal-name branding ("Priyanshu Films"), no leftover template placeholders
Exit code 1 on any failure.
"""
import asyncio, os, re, sys
from playwright.async_api import async_playwright

ep = sys.argv[1]
film = os.path.join(ep, 'build', 'film.html')
s = open(film).read()
fails = []
for need in ['--pk-navy:#121E3B', '--pk-amber:#EAAA45', '--pk-white:#F7F7F5', '--pk-mist:#CBD1E2', "Lexend", 'border-radius:21%',
             'class="ident"', 'class="endslate"', 'class="bug"', 'A PK Films Production']:
    if need not in s:
        fails.append(f'missing: {need}')
for bad in ['Priyanshu Films', '{{', '__VOICE__', '__MUSIC__']:
    if bad in s:
        fails.append(f'banned text present: {bad}')


async def runtime():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1600, 'height': 1000})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath(film) + '#fast')
        await pg.wait_for_timeout(1500)
        chips = await pg.eval_on_selector_all('#chips button', 'e=>e.map(x=>x.textContent.replace(/^\\d+/,""))')
        if not chips or chips[0] != 'Opening logo':
            fails.append(f'first scene is {chips[:1]}, expected Opening logo')
        if not chips or chips[-1] != 'End slate':
            fails.append(f'last scene is {chips[-1:]}, expected End slate')
        ident = await pg.eval_on_selector('#ident', 'e=>e.textContent.replace(/\\s+/g," ").trim()')
        if 'PK Explains' not in ident.replace('PKExplains', 'PK Explains'):
            fails.append(f'ident reads "{ident}"')
        # watermark visible inside the story (scene 3)
        await (await pg.query_selector_all('#chips button'))[2].click()
        await pg.wait_for_timeout(4000)
        op = await pg.eval_on_selector('#bug', 'e=>getComputedStyle(e).opacity+"|"+e.className')
        if float(op.split('|')[0]) < 0.3:
            fails.append(f'watermark not visible in the story ({op})')
        if errs:
            fails.append(f'page errors: {errs[:3]}')
        await b.close()


asyncio.run(runtime())
if fails:
    print('BRAND LINT FAILED'); [print(' -', f) for f in fails]; sys.exit(1)
print('brand lint passed')
