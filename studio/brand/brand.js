/* ================= PK Explains brand kit ================= */
/* Grounded and professional: no lens flares, no gold, no flying letters. The logo is set in HTML (Lexend), never redrawn. */
function bug(v){const b=$('bug');if(b)b.classList.toggle('off',!v);}
/* Opening: the tile fades up and settles, the wordmark eases in beside it, a short hold, fade. About 3 s. */
async function studioIdent(){
  bug(false);cap('');setFade(1);$('frame').classList.add('brand');const id=$('ident');id.hidden=false;id.style.opacity=1;
  const tile=id.querySelector('.pk-tile'),word=id.querySelector('.pk-word');
  tile.style.opacity=0;tile.style.transform='scale(.94)';word.style.opacity=0;word.style.transform='translateX(-.4em)';
  await W(250);sfx('chime');
  await all(tween(600,p=>{const q=ease(p);tile.style.opacity=q;tile.style.transform=`scale(${(.94+.06*q).toFixed(3)})`;}),
            W(250).then(()=>tween(650,p=>{const q=ease(p);word.style.opacity=q;word.style.transform=`translateX(${(-.4*(1-q)).toFixed(3)}em)`;})));
  await W(1300);
  await tween(500,p=>{id.style.opacity=1-p;});id.hidden=true;
  bug(true); /* the top strip stays hidden until the first scene fades up */
}
/* End slate: the logo at rest with the production credit. */
async function endSlate(){
  bug(false);cap('');setFade(1);$('frame').classList.add('brand');const es=$('endslate');es.hidden=false;es.style.opacity=0;sfx('chord');
  await tween(800,p=>{es.style.opacity=p;});await W(3600);await tween(800,p=>{es.style.opacity=1-p;});es.hidden=true;
}
