import sys,asyncio,io
from PIL import Image,ImageStat
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':960,'height':700})
        await pg.goto('file://'+sys.argv[1]+'#fast');await pg.wait_for_timeout(1500)
        if len(sys.argv)>2: await pg.click('#engBtn');await pg.wait_for_timeout(1500)
        await pg.click('#bigplay');t0=await pg.evaluate('performance.now()')
        rows=[]
        while True:
            png=await pg.locator('#frame').screenshot()
            im=Image.open(io.BytesIO(png)).convert('L');L=ImageStat.Stat(im).mean[0]
            st=await pg.evaluate("""()=>{const g=id=>document.getElementById(id);return {c:g('chap').textContent,cap:g('caption').textContent.slice(0,50),fade:+g('fade').style.opacity||0,dark:+g('dark').style.opacity||0,spot:+g('spotdim').style.opacity||0,act:!g('actcard').hidden,tc:!g('titlecard').hidden,id:!g('ident').hidden,cls:g('frame').className,play:g('play').textContent}}""")
            t=(await pg.evaluate('performance.now()')-t0)*8/1000
            rows.append((t,L,st))
            if st['play']=='Play' and t>20:break
            if t>1500:break
        await b.close()
    # report dark stretches (film seconds)
    run=None
    for t,L,st in rows:
        if L<14:
            if run is None:run=[t,t,st]
            run[1]=t
        else:
            if run and run[1]-run[0]>=1.0:print(f"{run[0]:7.1f}-{run[1]:7.1f}s  {run[1]-run[0]:5.1f}s  {run[2]['c'][:45]:45s} fade={run[2]['fade']} dark={run[2]['dark']} spot={run[2]['spot']} act={run[2]['act']} tc={run[2]['tc']} cls={run[2]['cls']} cap={run[2]['cap']}")
            run=None
    print('total film s',round(rows[-1][0]),'samples',len(rows),'dark samples',sum(1 for r in rows if r[1]<14))
asyncio.run(main())
