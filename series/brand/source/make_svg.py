"""Regenerate the PK Explains vector logo, banner and watermark (text converted to paths, no font needed to view).
usage: python3 series/brand/source/make_svg.py   -> series/brand/svg/*.svg"""
import os
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(HERE,'..','svg')
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
F={w:TTFont(os.path.join(HERE,'fonts',{400:'Lexend-Regular.ttf',700:'Lexend-Bold.ttf'}[w])) for w in (400,700)}
def text(s,w,size,x,y,ls=0.0):
    f=F[w];gs=f.getGlyphSet();cmap=f.getBestCmap();upm=f['head'].unitsPerEm;sc=size/upm
    pen=SVGPathPen(gs,ntos=lambda v:('%.1f'%v).rstrip('0').rstrip('.'));cx=0
    for ch in s:
        g=cmap[ord(ch)];tp=TransformPen(pen,(sc,0,0,-sc,x+cx,y));gs[g].draw(tp);cx+=gs[g].width*sc+ls*size
    return pen.getCommands(),cx-ls*size
def width(s,w,size,ls=0):return text(s,w,size,0,0,ls)[1]
cap={w:F[w]['OS/2'].sCapHeight/F[w]['head'].unitsPerEm for w in F}
xh=F[400]['OS/2'].sxHeight/F[400]['head'].unitsPerEm
W,H=2560,1440
NAVY,AMB,WHITE,MIST='#121E3B','#EAAA45','#F7F7F5','#CBD1E2'
tile=200;gap=56;ws=132
wPK=width('PK',700,ws,.01);sp=.26*ws;wEx=width('Explains',400,ws,.01)
lockw=tile+gap+wPK+sp+wEx
tag='Short animated films on how things really work';tw=width(tag,400,40,.02)
total=tile+44+4+44+50;top=(H-total)/2
lx=(W-lockw)/2;cy=top+tile/2
parts=[]
parts.append(f'<rect x="{lx:.1f}" y="{top:.1f}" width="{tile}" height="{tile}" rx="42" fill="{AMB}"/>')
tp,tpw=text('PK',700,96,0,0,-.01)
d,_=text('PK',700,96,lx+(tile-tpw)/2,cy+cap[700]*96/2+.03*96,-.01);parts.append(f'<path fill="{NAVY}" d="{d}"/>')
bx=lx+tile+gap;by=cy+cap[700]*ws/2
d,_=text('PK',700,ws,bx,by,.01);parts.append(f'<path fill="{WHITE}" d="{d}"/>')
d,_=text('Explains',400,ws,bx+wPK+sp,by,.01);parts.append(f'<path fill="{MIST}" d="{d}"/>')
ry=top+tile+44;parts.append(f'<rect x="{W/2-60}" y="{ry}" width="120" height="4" rx="2" fill="{AMB}" opacity=".9"/>')
ty=ry+4+44+25+cap[400]*40/2
d,_=text(tag,400,40,(W-tw)/2,ty,.02);parts.append(f'<path fill="{MIST}" opacity=".8" d="{d}"/>')
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform="translate(.5 .5) scale(.6 .55) translate(-.5 -.5)" ><stop offset="0" stop-color="#17264A"/><stop offset=".7" stop-color="#121E3B"/><stop offset="1" stop-color="#0E1830"/></radialGradient><pattern id="p" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M0 .5H64M.5 0V64" stroke="#CBD1E2" stroke-opacity=".035" stroke-width="1"/></pattern></defs><rect width="{W}" height="{H}" fill="#0E1830"/><rect width="{W}" height="{H}" fill="url(#g)"/><rect width="{W}" height="{H}" fill="url(#p)"/>{''.join(parts)}</svg>'''
open(os.path.join(OUT,'pk-explains-banner.svg'),'w').write(svg);print(len(svg))

def tilesvg(S,t,fs,bg):
    _,pw=text('PK',700,fs,0,0,-.01);o=(S-t)/2
    d,_=text('PK',700,fs,o+(t-pw)/2,o+t/2+cap[700]*fs/2+.03*fs,-.01)
    b=f'<rect width="{S}" height="{S}" fill="{NAVY}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">{b}<rect x="{o}" y="{o}" width="{t}" height="{t}" rx="{t*.21:.1f}" fill="{AMB}"/><path fill="{NAVY}" d="{d}"/></svg>'
open(os.path.join(OUT,'pk-explains-logo-tile.svg'),'w').write(tilesvg(800,520,250,True))
open(os.path.join(OUT,'pk-explains-watermark.svg'),'w').write(tilesvg(150,150,72,False))

# Horizontal lockups (tile + wordmark), transparent background: on-dark and on-light versions
def lockup(word_pk, word_ex):
    t=200;g=56;s=132;wpk=width('PK',700,s,.01);spc=.26*s;wex=width('Explains',400,s,.01)
    Wd=t+g+wpk+spc+wex;Hd=t;cyy=t/2
    p=[f'<rect width="{t}" height="{t}" rx="42" fill="{AMB}"/>']
    _,pw=text('PK',700,96,0,0,-.01)
    d,_=text('PK',700,96,(t-pw)/2,cyy+cap[700]*96/2+.03*96,-.01);p.append(f'<path fill="{NAVY}" d="{d}"/>')
    by2=cyy+cap[700]*s/2
    d,_=text('PK',700,s,t+g,by2,.01);p.append(f'<path fill="{word_pk}" d="{d}"/>')
    d,_=text('Explains',400,s,t+g+wpk+spc,by2,.01);p.append(f'<path fill="{word_ex}" d="{d}"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{Wd:.0f}" height="{Hd}" viewBox="0 0 {Wd:.1f} {Hd}">{"".join(p)}</svg>'
open(os.path.join(OUT,'pk-explains-lockup-on-dark.svg'),'w').write(lockup(WHITE,MIST))
open(os.path.join(OUT,'pk-explains-lockup-on-light.svg'),'w').write(lockup(NAVY,'#3A4766'))
open(os.path.join(OUT,'pk-explains-tile-transparent.svg'),'w').write(tilesvg(512,512,246,False))
