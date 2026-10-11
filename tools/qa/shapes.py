import sys,asyncio
from playwright.async_api import async_playwright
SIZES={'imax_1.43':(1430,1000),'ultrawide_21x9':(2520,1080),'laptop_16x10':(1440,900),'phone_portrait':(390,844)}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,(w,h) in SIZES.items():
            pg=await b.new_page(viewport={'width':w,'height':h})
            await pg.goto('file://'+sys.argv[1]+'#fast');await pg.wait_for_timeout(1200)
            chips=await pg.query_selector_all('#chips button');await chips[5].click()
            await pg.wait_for_timeout(2600)
            if name!='phone_portrait':
                await pg.evaluate("document.getElementById('stage').requestFullscreen()");await pg.wait_for_timeout(500)
            r=await pg.evaluate("(()=>{const f=document.getElementById('frame').getBoundingClientRect(),s=document.getElementById('stage').getBoundingClientRect();return {stage:[Math.round(s.width),Math.round(s.height)],frame:[Math.round(f.width),Math.round(f.height)],ratio:(f.width/f.height).toFixed(3),fs:!!document.fullscreenElement}})()")
            print(name,r)
            await pg.screenshot(path=f'shape_{name}.png')
            await pg.close()
        await b.close()
asyncio.run(main())
