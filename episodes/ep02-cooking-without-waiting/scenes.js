/* ================= the film =================
   Episode scenes. Everything above this file (engine, Kitchen world, cast, brand, sound) is shared and locked.
   Keep the bookends: first scene 'Opening logo', last scene 'End slate' (tools/qa/brandlint.py checks).
   Grammar (pk-series-bible): cold open on a real-life moment -> title card -> act cards -> recap before the
   payoff -> "Who played whom" credits -> after-credits tease of the next episode -> end slate. */
const SEQ=[];
function seq(act,name,run){SEQ.push({act,name,run});}
const eng=f=>ENG?f():Promise.resolve();

seq('PK Explains','Opening logo',async()=>{await studioIdent();});

seq('Cold open','TODO scene name',async()=>{
  lateState();setCam(960,540,1.2);setFade(1);$('frame').classList.remove('brand');
  await fadeClear(1600);
  await vo('TODO: the real-life moment, in one sentence.');
  await vo('TODO: the question the film answers.');
  await fadeBlack(700);
  resetWorld();earlier();setFade(1);
  title('PK Explains',EPISODE.title,'TODO: one-line promise of the film');
  await W(4600);untitle();
});

seq('Act one · TODO','TODO scene',async()=>{
  await actCard('ACT ONE','TODO','TODO question?');
  setFade(0);
  await vo('TODO');
});

const CREDITS=[
  ['h','PK Explains'],
  ['big',EPISODE.title],
  ['p','A PK Films Production'],
  ['h','Starring'],
  ['p','Mira','a backend process'],['p','The Manager','the operating system kernel'],
  ['h','Featuring'],
  ['p','Four work lamps','CPU cores'],['p','The fridge','RAM'],['p','The storeroom','disk'],['p','The notebook','write-ahead log (WAL)'],
  ['h','Fact-checked against'],
  ['p','PostgreSQL documentation'],
  ['h','PK Films'],['p','© 2026 PK Films']
];
seq('Credits','Who played whom',async()=>{
  const roll=$('roll');roll.innerHTML='';
  for(const c of CREDITS){const el=document.createElement(c[0]==='h'?'h3':'p');if(c[0]==='big')el.className='big';el.textContent=c[1];if(c[2]){const s=document.createElement('span');s.textContent=c[2];el.append(document.createElement('br'),s);}roll.append(el);}
  earlier();setCam(960,540,1);
  $('credits').hidden=false;
  const v=vo('Every character tonight was a real part of your computer, and of PostgreSQL.');
  const H=roll.offsetHeight||1400,box=$('credits').offsetHeight||600;
  await tween(28000,p=>{roll.style.transform=`translateY(${-(box*.7+p*(H+box*.3))}px)`;});await v;
  $('credits').hidden=true;roll.style.transform='';
});

seq('After the credits','One more thing',async()=>{
  setFade(1);await fadeClear(1200);
  await vo('TODO: one line that sets up the next episode.');
  cap('');title('Next episode','TODO next title','TODO next subtitle');await W(5000);untitle();
});

seq('PK Explains','End slate',async()=>{await endSlate();});
