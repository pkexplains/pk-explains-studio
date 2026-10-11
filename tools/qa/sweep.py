import sys,asyncio,json,collections
from playwright.async_api import async_playwright
PROBE='''()=>{
 const F=document.getElementById('frame').getBoundingClientRect();
 const vis=id=>{const e=document.getElementById(id);return e&&!e.hidden&&getComputedStyle(e).display!=='none'};
 const op=id=>+(document.getElementById(id).style.opacity||0);
 if(vis('titlecard')||vis('actcard')||vis('credits')||op('fade')>.5||op('dark')>.5||op('spotdim')>.5)return null;
 const S={t:F.top+F.height*0.11,b:F.bottom-F.height*0.165,l:F.left+F.width*0.015,r:F.right-F.width*0.015};
 const out=[];
 const chk=(el,name)=>{if(!el)return;const cs=getComputedStyle(el);if(cs.display==='none')return;let o=1,n=el;while(n&&n.id!=='world'){const st=n.style&&n.style.opacity;if(st!==''&&st!=null&&+st<.2)return;if(getComputedStyle(n).display==='none')return;n=n.parentNode;}
   const r=el.getBoundingClientRect();if(r.width<2)return;
   const inside=!(r.right<S.l||r.left>S.r||r.bottom<S.t||r.top>S.b);if(!inside)return;
   const cut=[];const hid=(a,b)=>Math.max(0,a)/Math.max(1,b);
   const kind=name.split(':')[0],id=name.split(':')[1];
   const topCut=r.top<S.t-2, botCut=r.bottom>S.b+2;
   const lfrac=hid(S.l-r.left,r.width), rfrac=hid(r.right-S.r,r.width), bfrac=hid(r.bottom-S.b,r.height);
   if(kind==='char'){ if(topCut)cut.push('head'); if(lfrac>.4)cut.push('left'); if(rfrac>.4)cut.push('right'); if(bfrac>.5)cut.push('body'); }
   else if(kind==='prop'&&/^(pg42d|pg42r|walOld|bundle|wpc|tsign)$/.test(id)){ if(lfrac>.5||rfrac>.5)cut.push('mostly off'); }
   else { if(topCut)cut.push('top'); if(botCut)cut.push('bottom'); if(lfrac>.05)cut.push('left'); if(rfrac>.05)cut.push('right'); }
   if(cut.length)out.push(name+' ['+cut.join(',')+']');};
 document.querySelectorAll('#chars > g').forEach(g=>chk(g,'char:'+g.dataset.id));
 document.querySelectorAll('#props > g').forEach(g=>chk(g,'prop:'+g.dataset.id));
 document.querySelectorAll('#fx > g').forEach(g=>chk(g,'bubble:'+(g.textContent||'zz').slice(0,28)));
 document.querySelectorAll('#tags > g').forEach(g=>chk(g,'tag:'+g.textContent.slice(0,28)));
 chk(document.getElementById('notebook'),'notebook');
 return {scene:document.getElementById('chap').textContent,out};
}'''
async def main():
    eng=sys.argv[2]=='eng'
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1600,'height':1000})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+sys.argv[1]+'#fast');await pg.wait_for_timeout(1500)
        if eng: await pg.click('#engBtn');await pg.wait_for_timeout(1500)
        await pg.click('#bigplay')
        agg=collections.Counter();n=0
        while True:
            await pg.wait_for_timeout(150);n+=1
            r=await pg.evaluate(PROBE)
            if r:
                for o in r['out']:agg[(r['scene'],o)]+=1
            done=await pg.evaluate("document.getElementById('play').textContent==='Play' && document.getElementById('chap').textContent.includes('One more thing')")
            if done or n>2600:break
        for (sc,o),c in sorted(agg.items()):
            if c>=2:print(f'{c:4d}  {sc:55s} {o}')
        print('samples',n,'errors',errs)
        await b.close()
asyncio.run(main())
