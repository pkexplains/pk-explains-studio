/* ================= world states ================= */
function resetWorld(){jobs=[];atts=[];bubs=[];FX.innerHTML='';clearTags();
  for(const id in E){const e=E[id];Object.assign(e,e.d);e.act=0;e.el.classList.remove('walk','lit','sleep','antic');expr(e);if(e.rows)pinit(e);if(e.tg)e.tagWant=!e.tagHidden;ap(e);}
  lampsOff();for(const L of LAMPS){L.x=L.d;drawLamp(L);}
  nbClear();ledger('#812 · —');DARK.style.opacity=0;DARK.classList.remove('red','emer');SPOTDIM.style.opacity=0;$('storeErr').style.display='none';
  stage.classList.remove('whatif','rewind');$('wilabel').hidden=true;$('rwlabel').hidden=true;$('actcard').hidden=true;$('credits').hidden=true;$('intro').classList.remove('show');
  setFade(0);HAND=0;narrUntil=0;dlgUntil=0;shakeAt=-1e9;look('none');cam.x=960;cam.y=540;cam.z=1;apCam();cap('');untitle();track({f:'\u2014',d:'500',n:'\u2014'},true);$('track').classList.remove('pulse');for(const k of ['ident','endslate'])$(k).hidden=true;$('frame').classList.remove('brand');bug(true);}
function earlier(){ /* the night, before Priya arrives */
  nbClear();on(host,235,900,1);on(manager,430,900,1);
  on(e0,SPOT.e0,900,1);on(e1,SPOT.e1,900,1);on(arjun,SPOT.arjun,900,-1);on(leela,SPOT.leela,900,-1);on(e5,SPOT.e5,900,-1);
  hop(0,e0,0);hop(1,e1,0);hop(2,arjun,0);hop(3,leela,0);
  note('p.17 order #810','nbold');
}
function lateState(){ /* the moment of the cold open: just after UPDATE 1 */
  earlier();on(priya,110,900,1);on(mira,SPOT.mira,900,1);on(manager,1460,900,-1);
  on(pg42,1365,430);prow(pg42,0,{stamp:'replaced by #812'});prow(pg42,1,{on:true});pset(pg42,'dirty',true);on(pg42m,1365,640);
  note('▣ FULL PAGE 42','nbfull');note('p.42 v2: 300 #812');note('#812 COMMIT','nbok');ledger('#812 · COMMITTED','ok');on(bundle,1840,830);
  hop(0,mira,0);
}
