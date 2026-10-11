import sys,asyncio
from playwright.async_api import async_playwright
HOOK="""()=>{window.__ev=[];const S=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...a){
 const d=this.buffer?this.buffer.duration:0;if(!this.loop&&d>0.6&&d<30)window.__ev.push({t:performance.now()/1000,d:d,c:document.getElementById('chap').textContent});return S.apply(this,a);};}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page()
        await pg.goto('file://'+sys.argv[1]+'#fast');await pg.wait_for_timeout(3000);await pg.evaluate(HOOK)
        await pg.click('#bigplay');t0=await pg.evaluate('performance.now()/1000')
        while True:
            await pg.wait_for_timeout(2000)
            if await pg.evaluate("document.getElementById('play').textContent==='Play'"):break
        ev=await pg.evaluate('window.__ev');T=(await pg.evaluate('performance.now()/1000')-t0)*8
        last=0;gaps=[]
        for e in ev:
            t=(e['t']-t0)*8
            if t-last>9:gaps.append((last,t,e['c']))
            last=max(last,t+e['d'])   # audio plays at real speed; film time runs 8x, so durations are approximate
        for a,bb,c in gaps:print(f"{a:7.1f} -> {bb:7.1f}  gap {bb-a:5.1f}s  next: {c}")
        print('film s',round(T),'speech/sting events',len(ev))
        await b.close()
asyncio.run(main())
