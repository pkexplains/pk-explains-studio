/* ================= the film ================= */
const SEQ=[];
function seq(act,name,run){SEQ.push({act,name,run});}
const eng=f=>ENG?f():Promise.resolve();

seq('PK Explains','Opening logo',async()=>{await studioIdent();});

seq('Cold open','Two words',async()=>{
  lateState();track({f:'300',d:'500',n:'on disk ✓'},true);setCam(170,640,2.0);setFade(1);$('frame').classList.remove('brand');
  await fadeClear(1600);
  await vo('This is Priya. She has just paid two hundred rupees for a train ticket, from her banking app.');
  expr(priya,'happy');await pop(badge,175,600);
  await vo("Payment successful. Behind that screen, the bank's database sent back two words: UPDATE 1. Meaning: done. Saved. It will stay that way.");
  await W(700);
  const v=vo('One millisecond later, the power went out.');await W(1600);await powerOff();await v;
  camTo(175,630,2.5,14000);expr(priya,'worried');
  await W(600);
  await vo("So, is Priya's money safe?");
  await W(700);
  await vo("It is. But here's the twist. When the bank said done, her new balance had not been saved anywhere permanent. Not yet.");
  await vo("So how can a bank promise something it hasn't saved? This happens every time you tap Pay. It takes a few milliseconds. Let's slow it right down.");
  cap('');sfx('rewind');stage.classList.add('rewind');$('rwlabel').hidden=false;
  await powerOn();off(badge);
  await all(camTo(960,520,1,2200),tween(2200,p=>{CAM.style.opacity=(p*10|0)%2?0.85:1;}));CAM.style.opacity=1;
  await fadeBlack(700);
  resetWorld();earlier();setFade(1);
  title('PK Explains','The Kitchen That Never Forgets','How your bank keeps a promise it hasn’t saved yet');
  await W(4600);untitle();
});

seq('Act one · The order','The kitchen',async()=>{
  await actCard('ACT ONE','The Order',"Where is Priya's money?");
  setCam(330,560,1.25);
  { const f=fadeClear(1800);await W(400);const j=vo("Every computer works a lot like a restaurant kitchen. This one belongs to Priya's bank, and it's busy, even late at night.");await f;await j; }
  await camTo(790,540,1.3,3600);
  const t1=tag(790,345,'work lamps = CPU cores','t-cpu',20);
  await vo('It has only four work lamps. A chef can only work while a lamp shines on her.');
  hop(0,e5,1100);
  await vo('There are more chefs than lamps, so the lamps keep hopping from chef to chef. Everyone gets a turn.');
  hop(1,e0,1100);await W(1400);hop(0,e1,1100);
  await vo('No lamp, no work. Remember that.');
  await vo("Deciding who gets a lamp next is the operating system's scheduler. It happens thousands of times a second.",1);
  t1.remove();
  await camTo(1365,560,1.45,3200);
  const t2=tag(1365,250,'fridge = memory (RAM)','t-paper',20);
  await vo('This is the fridge. Everything in here is quick to grab. But the moment the power goes out, the fridge forgets everything.');
  t2.remove();
  await camTo(1790,600,1.6,3000);
  const t3=tag(1808,340,'storeroom = disk','t-disk',20);
  await vo("And this is the storeroom. Anything in here survives a power cut. But it's a long, slow walk away.");
  t3.remove();
  await camTo(470,640,1.6,3600);
  await walk(manager,530,900,1500);face(manager,-1);
  await intro(manager,'THE MANAGER','the operating system kernel','Runs the building. Every lamp, every shelf, every trip to the storeroom goes through him.','os');
  say(manager,'Ask me first. Always.',3000);
  await vo('And this is the Manager. He runs the building. Nobody touches a lamp, a shelf or the storeroom without asking him.');
  await camTo(960,520,1.0,2600);pulseTrack();
  await vo("Keep your eye on two places: the fridge and the storeroom. This whole story is about which one Priya's money is in. We'll keep score at the top of the screen.");
});

seq('Act one · The order','The hire',async()=>{
  await camTo(250,680,1.6,2600);
  on(priya,-120,900,1);await walk(priya,110,900,2600);
  await intro(priya,'PRIYA','a customer, using her banking app','Wants to pay ₹200. She will wait at the door for an answer.','cu');
  await vo("Priya's payment arrives at the door of the bank's database. It's called PostgreSQL. Picture it as a catering company that rents this kitchen. Its staff wear coral.");
  await intro(host,'THE HOST','the postmaster','Greets every new customer. Never cooks.');
  await vo('The Host greets every new customer, but he never cooks. Instead, he asks the Manager for an exact copy of himself.');
  await hop(0,host,1300);
  say(host,'Manager: copy me, please.',2800);await W(1500);
  on(clone,235,900,1);clone.o=.5;ap(clone);await go(clone,340,900,1600);
  await fadeOut(clone,350);await pop(mira,340,900,1);hop(0,mira,700);
  await intro(mira,'MIRA','a backend process · PID 4127','A brand new chef, hired for Priya alone. She will see this order through to the end.');
  expr(mira,'happy');say(mira,"Hi Priya! I'm all yours.",3200);W(3400).then(()=>expr(mira));
  await vo('That copy becomes Mira: a brand new chef, just for Priya. Computer people call her a process. Making the copy is called a fork.');
  await eng(async()=>{
    await camTo(860,600,1.0,2600);
    const l=await mapLine(340,700,1275,800,'m-pg');const t=tag(1275,766,'4127 only','t-pg',16);
    await vo('The Manager gives her a private spot in the fridge that no other chef can open.',1);
    l.remove();t.remove();
    await vo("Hiring a chef takes time and memory, which is why busy apps put a pooler, like PgBouncer, in front, to reuse chefs.",1);
  });
  await vo("One chef per customer has a big upside: if another chef burns something, Mira's work is safe.");
  await camTo(560,660,1.4,2200);
  await walk(mira,SPOT.mira,900,2000);face(mira,1);
  hop(0,e5,1100);zz(mira,true);
  await vo('No order yet, so Mira dozes off, and her lamp goes to someone busier. Computer people call this waiting.');
  await camTo(330,620,1.5,2000);
  await pop(slip,430,560);const tr=tag(430,620,'= take ₹200 from Priya','t-paper',20);
  await vo('Then the order arrives. It looks scary, but it only says: take two hundred rupees from Priya.');
  tr.remove();
  await all(go(slip,SPOT.mira,560,2400),camTo(700,620,1.5,2400));off(slip);
  say(manager,'Mira! Wake up!',2400);await W(900);zz(mira,false);pill(mira,'READY');
  await vo("The Manager wakes her. She's ready to go, but she still needs a lamp.");
  await hop(0,mira,1300);pill(mira,'');
  await vo('There. Lamp on. Now she can work.');
});

seq('Act one · The order','Reading the order',async()=>{
  await camTo(SPOT.mira,640,1.9,1800);
  say(mira,"Where does Priya's account live?",3400);
  await vo("First, Mira has to find Priya's account. The bank keeps an index, just like the index at the back of a book. It says: Priya is on page 42.");
  await eng(async()=>{
    await camTo(1050,560,1.05,2600);
    await pop(tsign,1365,478);
    await vo('She also hangs a small sign on the accounts table: rows are being changed here, so nobody may delete this table until she is done. Other chefs can still change other rows.',1);
    await camTo(SPOT.mira,640,1.9,2200);
  });
  say(mira,'Page 42!',2400);
  await W(800);
  await vo('Page 42. But where is it right now? In the fridge? Or out in the storeroom?');
});

seq('Act one · The order','The hunt for page 42',async()=>{
  await all(walk(mira,1180,900,3000),camTo(1250,600,1.45,3000));face(mira,1);
  const t1=tag(1365,345,'company shelf = shared buffers','t-pg',17);
  await vo("She checks the company's own shelf in the fridge first.");
  await eng(async()=>{
    const a=await mapLine(1180,700,1365,372,'m-pg');const b=await mapLine(SPOT.leela,700,1365,372,'m-b');
    await vo("Every chef can reach this same shelf. Each one uses her own shelf numbers, and the Manager's translation book, the page table, points them all at the same real shelf. That's shared memory.",1);
    a.remove();b.remove();
  });
  t1.remove();
  const q=tag(1365,400,'?','t-paper',34);
  await vo('Not there.');
  q.remove();
  say(mira,'Manager, can you fetch page 42?',3000);await W(1200);
  await all(walk(manager,1330,900,3600),camTo(1300,620,1.3,3600));face(manager,-1);
  const t2=tag(1365,710,"manager's shelf = page cache",'t-os',16);const q2=tag(1365,610,'?','t-os',34);
  await vo('The Manager keeps a shelf of his own in the fridge, too. Not there either.');
  t2.remove();q2.remove();
  expr(manager,'annoyed');say(manager,'The storeroom? Ugh. Long walk.',3400);await W(1500);
  zz(mira,true);hop(0,e1,1200);
  await vo("So the Manager has to walk all the way to the storeroom. Mira can't do a thing until he's back, so she naps, and her lamp goes to another chef.");
  const w=walk(manager,1790,900,5600);camTo(1560,610,1.15,5600);
  const t3=tag(1530,360,'1 lamp-step = 1 second  →  this walk = days','t-paper',18);
  await vo('How long is this walk? If every move under a lamp took one second, this one trip would take days.');
  await w;t3.remove();
  on(pgc,1808,600);pgc.s=.72;ap(pgc);carry(pgc,manager,40,-100,.5);await W(500);
  await all(walk(manager,1330,900,4600),camTo(1300,600,1.35,4600));
  drop(pgc);off(pgc);on(pg42m,1365,640);pg42m.s=.5;await tween(500,p=>{pg42m.s=.5+.34*p;ap(pg42m);});
  on(pg42,1365,640);pg42.s=.84;await all(go(pg42,1365,430,1000),tween(1000,p=>{pg42.s=.84+.16*p;ap(pg42);}));
  track({f:'500'});expr(manager);
  await vo("He's back with page 42, and puts it on the company shelf. Look at the score: Priya's account is in the fridge now, saying 500.");
  await eng(async()=>{
    const t4=tag(1530,540,'same page, twice in memory','t-paper',17);
    await vo("He also keeps a copy on his own shelf, so the same page now sits in memory twice. That's called double caching.",1);
    t4.remove();
  });
  zz(mira,false);pill(mira,'READY');await W(1500);await hop(0,mira,1300);pill(mira,'');
  await W(900);
  await camTo(1300,520,1.85,1800);
  pset(pg42,'pin',true);await W(900);pset(pg42,'sign',true);say(mira,'Hands off, everyone. Writing!',3000);
  await W(2600);
  await vo("The hands-off sign is held for only microseconds, while she writes. It's called a latch.",1);
});

seq('Act two · The change','Two versions',async()=>{
  await actCard('ACT TWO','The Change','Two chefs, one account. Who wins?');
  { const f=fadeClear(1400);await W(300);const j=vo('Now Mira makes the change, very carefully.');await f;await j; }
  prow(pg42,0,{stamp:'replaced by #812'});const t1=tag(1283,320,'stamp = row lock','t-pg',16);
  await vo("First she stamps Priya's card: mine, until order 812 is finished. That stamp is a lock. Anyone else who wants this card has to wait. Remember that.");
  t1.remove();
  prow(pg42,1,{on:true});track({f:'300'});
  await vo('Then, instead of rubbing out 500, she writes a brand new card: 300. The old card stays where it is.');
  await camTo(1120,600,1.15,2600);
  await intro(leela,'LEELA','a backend process · PID 4133','Halfway through counting every account for a monthly report.');
  const l=await mapLine(SPOT.leela,700,1283,368,'m-b');say(leela,'Still counting… Priya: 500',3600);
  await vo("Why keep the old card? Because of Leela. She's halfway through adding up every account for a monthly report. If Priya's 500 turned into 300 in the middle of her count, her totals would not add up.");
  const t2=tag(1365,335,'MVCC: many versions of one row','t-pg',16);
  await vo('So Leela keeps reading the old card, Mira writes the new one, and nobody waits for anybody.');
  await vo('Keeping several versions of the same row like this is called MVCC. Readers never block writers, and writers never block readers.',1);
  l.remove();t2.remove();
  await vo('The old card will need cleaning up later.');
});

seq('Act two · The change','The notebook',async()=>{
  await all(walk(mira,1530,900,2400),camTo(1560,600,1.7,2400));face(mira,1);
  await introAt(1600,640,150,'THE NOTEBOOK','the write-ahead log (WAL)','Every change gets a short note here before it counts.','obj');
  await vo("Now, the most important habit in this kitchen. It's the secret to the whole story.");
  await vo('Before any change counts, it must be written in the company notebook. Not the page itself, just a short note about the change.');
  await camTo(1600,610,2.3,1600);
  await pop(fpi,1600,540);await go(fpi,1600,640,800);off(fpi);note('▣ FULL PAGE 42','nbfull');
  await vo('This is the first change to page 42 since the last checkpoint, the last time everything was fully saved. So Mira also copies the entire page into the notebook. Seems like overkill. Remember it anyway.');
  note('p.42 v2: 300 #812');
  await vo('Then the note itself: page 42, Priya, now 300, order 812.');
  track({n:'in fridge'});
  await vo('But look at the score: the notebook is still in the fridge. Nothing has reached the storeroom yet.');
  await camTo(1320,520,1.85,2000);
  pset(pg42,'dirty',true);await W(1000);pset(pg42,'sign',false);await W(700);pset(pg42,'pin',false);
  await vo('She sticks a reminder on page 42: changed, but not saved.');
});

seq('Act two · The change','The rival',async()=>{
  await camTo(1080,600,1.15,2600);
  await intro(arjun,'ARJUN','a backend process · PID 4130','Working for another customer: ₹100 cashback for Priya.');
  say(arjun,'Cashback time!',2800);
  await vo('Meanwhile, Arjun, one of the chefs at the counter, has an order for the very same account: a hundred rupees cashback for Priya.');
  await all(walk(arjun,1180,900,2600),camTo(1250,580,1.6,2600));face(arjun,1);
  const t=tag(1283,320,'stamped: order 812, not finished','t-pg',16);
  await vo("He finds Mira's stamp: order 812, not finished.");
  expr(arjun,'annoyed');say(arjun,"Seriously? Fine. I'll wait.",3200);await W(2200);
  zz(arjun,true);expr(arjun);hop(2,e5,1200);t.remove();
  await W(1800);
  await whatIf('WHAT IF THERE WERE NO STAMP?',async()=>{
    prow(pg42,0,{stamp:false});prow(pg42,1,{on:false});zz(arjun,false);
    say(mira,'I read 500',2600);say(arjun,'I read 500',2600);
    await vo('Picture it without the stamp. Both chefs read 500.');
    say(mira,'500 − 200 = 300',2400);await W(1100);prow(pg42,0,{val:'Priya 300',hot:true});await W(1300);
    say(arjun,'500 + 100 = 600',2400);await W(1100);prow(pg42,0,{val:'Priya 600',hot:true});expr(mira,'shock');
    const x=tag(1365,335,'the ₹200 payment vanished','t-alarm',18);
    await vo("Mira writes 300. Then Arjun writes 600. Mira's payment just vanished. The train company never gets paid. Engineers call this a lost update.");
    x.remove();expr(mira);prow(pg42,0,{val:'Priya 500',hot:false,stamp:'replaced by #812'});prow(pg42,1,{on:true});zz(arjun,true);
  });
  await vo("That's why Arjun waits.");
});

seq('Act three · The promise','The trip to disk',async()=>{
  await actCard('ACT THREE','The Promise','How can the bank say “done” so fast?');
  setCam(1600,610,2.2);
  pulseTrack();
  { const f=fadeClear(1600);await W(300);const j=vo("Quick recap. Priya's new balance, 300, exists only in the fridge. One power cut, and it's gone. So how can the bank tell Priya done, right now?");await f;await j; }
  note('#812 COMMIT','nbok');
  await vo('Mira writes one final note: order 812, finished.');
  await camTo(1500,600,1.2,2200);
  await vo("Here's the trick. She doesn't carry page 42 to the storeroom. A payment can touch pages all over the place, and there are thousands of them.");
  await vo('But the notes all sit together, on one notebook page. So she only sends the notebook. One small, quick trip.');
  say(mira,'Manager! Notebook to the storeroom. Now, please.',3600);await W(1300);
  await walk(manager,1450,900,1000);face(manager,1);
  await vo('She asks the Manager to save the notebook to disk.');
  await vo('On Linux, PostgreSQL makes this request with a call named fdatasync.',1);
  zz(mira,true);hop(0,e1,1200);
  await vo('And then she waits. Every payment you have ever made has waited for this one trip.');
  await camTo(1200,600,1.0,2200);
  say(e0,'Done with #813!',2600);say(e1,'Done with #814!',2600);note('#813 COMMIT','nbok');note('#814 COMMIT','nbok');
  await W(1300);zz(e0,true);zz(e1,true);hop(0,null);hop(1,null);
  await vo("Two other chefs finish at the same moment. The Manager takes all their notes in the same trip. That's called group commit.");
  on(bundle,1600,600);carry(bundle,manager,40,-100);
  await all(walk(manager,1790,900,3800),camTo(1680,610,1.4,3800));
  drop(bundle);await go(bundle,1840,830,700);const t=tag(1808,770,'notes: safe on disk','t-disk',18);track({n:'on disk ✓'});
  await vo("The notes are in the storeroom. Now, even if the lights go out, Priya's payment can be rebuilt from them.");
  t.remove();
  await all(walk(manager,1450,900,3400),camTo(1420,600,1.25,3400));face(manager,-1);
  say(manager,'Done. Safe on disk.',2800);await W(1300);
  zz(mira,false);zz(e0,false);zz(e1,false);pill(mira,'READY');await W(1300);await hop(0,mira,1200);pill(mira,'');hop(1,e1,1200);hop(3,leela,0);
  await camTo(810,420,1.5,2400);
  await introAt(810,370,230,'THE LEDGER','pg_xact, the commit log','One mark per order: in progress, committed or aborted.','obj');
  ledger('#812 · COMMITTED','ok');
  await vo('Only now does Mira mark order 812 as done, in the company ledger.');
  await eng(async()=>{
    await camTo(1150,560,1.1,2000);await fadeOut(tsign,900);
    await vo('Her locks are released too: the sign on the accounts table comes down.',1);
  });
  await camTo(1250,580,1.6,2400);
  zz(arjun,false);await hop(2,arjun,1200);
  expr(arjun,'happy');say(arjun,'Finally! 300 plus 100 is 400.',3600);W(3800).then(()=>expr(arjun));
  await vo('Order 812 is finished, so Arjun wakes up. He sees the new 300, and adds his cashback on top: 400. His order is not finished yet.');
  prow(pg42,1,{stamp:'replaced by #815'});prow(pg42,2,{on:true});note('p.42 v3: 400 #815');
  await camTo(175,640,2.0,3400);
  await pop(badge,175,600);
  await vo('And Mira tells Priya: done. UPDATE 1.');
  await W(800);
  await vo('Which is exactly where our story began.');
});

seq('Act four · The blackout','What survived',async()=>{
  await W(800);
  const v=vo('And then, the lights go out.');await W(1300);await powerOff();await v;
  await W(1200);
  zz(arjun,false);zz(mira,false);
  setCam(1790,620,1.6);spotTo(1808,640,240);SPOTDIM.style.opacity=.7;DARK.style.opacity=0;
  await W(800);expr(mira,'worried');
  await vo("Look inside the storeroom. Mira's notes are here. And page 42? Still says 500.");
  await camTo(1365,560,1.45,1600);spotTo(1365,500,260);await spotLevel(.7,600);
  await all(fadeOut(pg42,1600),fadeOut(pg42m,1600));nbClear();track({f:'gone'});
  await vo('The 300 only ever lived in the fridge. And the fridge has just forgotten everything.');
  await W(700);
  await vo('So, did the bank just lie to Priya?');
  await spotLevel(1,500);
  off(mira,arjun,leela,e0,e1,e5,priya,badge,tsign);lampsOff();on(manager,530,900,-1);
  SPOTDIM.style.opacity=0;setCam(960,540,1);DARK.style.opacity=1;
  await actCard('ACT FOUR','The Blackout','Did the bank just lie?');
  DARK.style.opacity=1;setFade(0);$('actcard').hidden=true;
  await powerOn();
  await camTo(500,620,1.4,1800);
  setMood('wonder');look('dawn');
  await pop(startup,340,900,1);hop(0,startup,800);
  await intro(startup,'THE RECOVERY CHEF','the startup process','After a crash, opens the notebook and replays it, note by note.');
  await vo('When the power comes back, a recovery chef opens the notebook and replays every note, in order.');
  await all(walk(startup,1500,900,5200),camTo(1450,600,1.25,5200));face(startup,1);
  on(pg42,1808,600);pg42.s=.72;ap(pg42);pinit(pg42);await all(go(pg42,1365,430,1500),tween(1500,p=>{pg42.s=.72+.28*p;ap(pg42);}));
  track({f:'500'});
  await vo('First, it fetches page 42 from the storeroom. It says 500.');
  on(fpi,1808,830);await go(fpi,1365,420,1500);off(fpi);prow(pg42,0,{stamp:'replaced by #812'});prow(pg42,1,{on:true});pset(pg42,'dirty',true);
  track({f:'300'});
  await vo('Then it finds the full-page copy Mira made. Remember it? Page 42 comes back exactly as she left it: 300.');
  ledger('#812 · COMMITTED','ok');
  sfx('promise');expr(startup,'happy');
  await vo("Order 812: done. Priya's money is safe. The notebook kept the promise.");expr(startup);
  const t=tag(1460,320,'cashback note never reached disk','t-alarm',16);
  await vo("And Arjun's cashback? It was never finished, and its note never reached the storeroom. So it simply never happened. His app tries again.");
  t.remove();off(startup);hop(0,null);
});

seq('Act four · The blackout','Another ending',async()=>{
  await whatIf('ANOTHER ENDING · THE LIGHTS GO OUT A MOMENT EARLIER',async()=>{
    prow(pg42,0,{stamp:'replaced by #812'});prow(pg42,1,{on:true});ledger('#812 · in progress','prog');track({f:'300',n:'in fridge'});
    off(bundle);on(priya,110,900,1);on(manager,1600,900,1);on(bundle,0,0);carry(bundle,manager,40,-100);
    setCam(1600,600,1.3);
    await vo('Now imagine the lights went out a moment earlier, while the Manager was still walking with the notebook.');
    await walk(manager,1690,900,1400);await powerOff();off(bundle,pg42);track({f:'gone',n:'lost'});await W(900);await powerOn();
    on(pg42,1365,430);pinit(pg42);ledger('#812 · never committed','bad');track({f:'500'});
    await camTo(175,640,2.0,2600);expr(priya,'worried');say(priya,'Payment failed. Try again?',3600);
    await vo("Then Priya never hears done. Her app shows an error, her balance is still 500, and she simply taps Pay again.");
    await vo('No promise was made, so no promise was broken.');
    expr(priya);off(priya);
  });
  on(pg42,1365,430);pinit(pg42);prow(pg42,0,{stamp:'replaced by #812'});prow(pg42,1,{on:true});pset(pg42,'dirty',true);
  on(bundle,1840,830);ledger('#812 · COMMITTED','ok');on(manager,1450,900,-1);track({f:'300',d:'500',n:'on disk ✓'});
  setCam(1250,560,1.1);
  setMood('wonder');sfx('promise');cap('');title('The whole secret','Write the note first. Say “done” second.','That is all “write-ahead log” means.');
  await vo("That's the whole secret. The bank only says done once the note about the change is safe in the storeroom.");
  await W(1200);untitle();
});

seq('Epilogue','The night shift',async()=>{
  await actCard('EPILOGUE','Later that night','Who tidies up?');
  setCam(1250,580,1.15);
  await fadeClear(1200);
  await eng(async()=>{
    await pop(helper,1000,900,1);await hop(1,helper,1000);
    await intro(helper,'THE HELPER','the background writer','Keeps clean space free on the company shelf.');
    await walk(helper,1180,900,1400);face(helper,1);
    on(pgc,1365,430);pgc.s=1;ap(pgc);prow(pgc,0,{stamp:'replaced by #812'});prow(pgc,1,{on:true});carry(pgc,helper,40,-100,.5);pset(pg42,'dirty',false);
    await walk(helper,1230,900,700);drop(pgc);off(pg42m);await all(go(pgc,1365,640,900),tween(900,p=>{pgc.s=.5+.34*p;ap(pgc);}));pset(pgc,'dirty',true);
    await vo("The Helper, the background writer, keeps clean space free on the company shelf by handing dirty pages over to the Manager's shelf.",1);
    await vo('That still is not the storeroom. Handing a page to the Manager is not the same as saving it.',1);
    walk(helper,900,900,1800).then(()=>{off(helper);hop(1,null);});
  });
  if(!ENG){on(pgc,1365,430);pgc.s=1;ap(pgc);prow(pgc,0,{stamp:'replaced by #812'});prow(pgc,1,{on:true});pgc.o=0;ap(pgc);}
  await pop(supervisor,1040,900,1);await hop(2,supervisor,1000);
  await intro(supervisor,'THE SUPERVISOR','the checkpointer','Every few minutes, makes sure every changed page truly reaches the storeroom.');
  await vo('Later that night, the clean-up crew arrives. Every few minutes, the Supervisor makes sure every changed page really gets carried to the storeroom.');
  await vo("This is called a checkpoint. By default it runs every five minutes, or sooner when the notebook fills up.",1);
  await walk(supervisor,1190,900,1300);face(supervisor,1);
  say(supervisor,'Manager: save page 42 to disk.',3200);await W(1300);
  await walk(manager,1330,900,800);carry(pgc,manager,40,-100,.5);pset(pg42,'dirty',false);
  await all(walk(manager,1790,900,4200),camTo(1650,600,1.3,4200));
  await whatIf('WHAT IF THE LIGHTS GO OUT MID-DELIVERY?',async()=>{
    drop(pgc);off(pg42d);await go(pgc,1808,600,700);pgc.s=.72;ap(pgc);pset(pgc,'dirty',false);pset(pgc,'torn',true);
    await powerOff();await W(900);await powerOn();
    await camTo(1808,560,2.0,1200);
    await vo("What if the lights go out halfway through this delivery? Page 42 could land half old, half new. Torn. A short note can't fix that.");
    on(fpi,1840,830);await go(fpi,1808,560,1400);off(fpi);pset(pgc,'torn',false);
    await vo("But the full-page copy can. That's exactly why Mira made it.");
    off(pgc);on(pg42d,1808,600);carry(pgc,manager,40,-100,.5);
  });
  await camTo(1700,600,1.4,1200);
  drop(pgc);off(pg42d);await go(pgc,1808,600,700);pgc.s=.72;ap(pgc);pset(pgc,'dirty',false);
  track({d:'300'});const t=tag(1808,500,'page 42: 300, on disk','t-disk',16);
  await vo('This time all goes well. Look at the score: page 42 is finally in the storeroom, saying 300.');
  t.remove();
  const t2=tag(1745,770,'old notes: thrown away','t-disk',15);await fadeOut(walOld,1200);
  await vo('And old notebook pages, no longer needed, can finally be thrown away.');
  t2.remove();walk(manager,1450,900,2600);off(supervisor);hop(2,null);
  await eng(async()=>{
    await camTo(2050,600,1.0,2400);
    await pop(courier,1660,900,1);await hop(3,courier,1200);
    await intro(courier,'THE COURIER','the WAL sender','Carries notebook notes to a replica across town.');
    on(wpc,0,0);carry(wpc,courier,-46,-96);
    await walk(courier,2400,900,3800);
    drop(wpc);await go(wpc,2460,600,700);off(wpc);prow(pg42r,0,{stamp:'replaced by #812'});prow(pg42r,1,{on:true});
    const t3=tag(2460,520,'replayed: 300','t-disk',17);
    await vo("Meanwhile, the Courier, the WAL sender, carries copies of the notes across town to a replica, which replays them. Priya's balance is 300 there too.",1);
    t3.remove();off(courier);hop(3,null);
  });
  await camTo(1310,540,1.55,3200);
  await pop(cleaner,1040,900,1);await hop(0,cleaner,1000);await walk(cleaner,1180,900,1300);face(cleaner,1);
  await intro(cleaner,'THE CLEANER','autovacuum','Sweeps away old versions nobody can see anymore.');
  prow(pg42,0,{on:false});say(cleaner,'Nobody needs this old one now.',3000);
  await vo('Last, the Cleaner sweeps away the old 500 card. Nobody needs it anymore.');
  await vo('If a long report kept old cards in use for hours, they would pile up. That is called table bloat.',1);
  off(cleaner);hop(0,null);
});

seq('Epilogue','Based on a true story',async()=>{
  await actCard('BASED ON A TRUE STORY','2018','What if the Manager is wrong?');
  setCam(1450,600,1.1);
  on(pg88,1365,640);pset(pg88,'dirty',true);on(manager,1330,900,1);on(supervisor,1190,900,1);hop(2,supervisor,0);
  { const f=fadeClear(1600);await W(300);const j=vo("This whole story rests on trust. When the Manager says it's in the storeroom, it has to be true. In 2018, engineers found that it wasn't always.");await f;await j; }
  say(supervisor,'Manager: save page 88, please.',3200);await W(1300);
  carry(pg88,manager,40,-100,.5);await walk(manager,1790,900,3600);
  $('storeErr').style.display='';expr(manager,'shock');shake(8);say(manager,'Disk error!',2400);
  await vo('A delivery to the storeroom failed. The Manager reported the error, once.');
  await walk(manager,1330,900,3200);drop(pg88);await all(go(pg88,1365,640,700),tween(700,p=>{pg88.s=.5+.34*p;ap(pg88);}));
  pset(pg88,'dirty',false);const t=tag(1365,720,'marked as fine','t-os',17);
  await vo('Then, on Linux, he could quietly mark the page as fine, and later drop it from his shelf.');
  t.remove();await fadeOut(pg88,1200);$('storeErr').style.display='none';
  expr(manager);expr(supervisor,'worried');say(supervisor,'Try again?',2400);await W(1500);expr(manager,'happy');say(manager,'All good!',2600);
  const t2=tag(1808,520,'page 88 never arrived','t-alarm',16);
  await vo("PostgreSQL asked again. This time the Manager said all good. The page never reached the storeroom.");
  t2.remove();expr(manager);
  await alarm(3);expr(supervisor);
  await vo('Today, if this ever happens, PostgreSQL stops on purpose, restarts, and rebuilds everything from the notebook.');
  await powerOff();await W(700);await powerOn();
  await pop(pg88,1365,640);
  await vo('A promise is only as strong as the promises underneath it.');
  off(supervisor,pg88);hop(2,null);
});

const CREDITS=[
  ['h','PK Explains'],
  ['big','The Kitchen That Never Forgets'],
  ['p','A PK Films Production'],
  ['h','Starring'],
  ['p','Mira','a backend process'],['p','Priya','a client application'],['p','The Host','postmaster'],['p','The Manager','the operating system kernel'],
  ['p','Arjun & Leela','backend processes'],['p','The Recovery Chef','the startup process'],['p','The Supervisor','checkpointer'],['p','The Cleaner','autovacuum'],
  ['p','The Helper','background writer (Engineer’s cut)'],['p','The Courier','WAL sender (Engineer’s cut)'],
  ['h','Featuring'],
  ['p','Four work lamps','CPU cores'],['p','The fridge','RAM'],['p','The company shelf','shared_buffers'],['p',"The Manager's shelf",'OS page cache'],
  ['p','The storeroom','disk'],['p','The notebook','write-ahead log (WAL)'],['p','The ledger','pg_xact'],['p','The stamp','row lock'],['p','Old and new cards','MVCC row versions'],
  ['h','Settings behind the scenes'],
  ['p','PgBouncer, max_connections','how many chefs get hired'],['p','synchronous_commit','whether Mira waits for the trip'],
  ['p','wal_sync_method = fdatasync','how the trip is made on Linux'],['p','full_page_writes','the whole-page copy'],
  ['p','checkpoint_timeout = 5min, max_wal_size','the Supervisor’s schedule'],['p','huge_pages','a thinner translation book'],['p','autovacuum','the Cleaner’s rounds'],
  ['h','Fact-checked against'],
  ['p','PostgreSQL 18 documentation'],['p','The Internals of PostgreSQL, H. Suzuki'],['p','Linux man-pages'],['p','pgsql-hackers and LWN, 2018'],
  ['h','PK Films'],['p','\u00A9 2026 PK Films']
];
seq('Credits','Who played whom',async()=>{
  const roll=$('roll');roll.innerHTML='';
  for(const c of CREDITS){const el=document.createElement(c[0]==='h'?'h3':'p');if(c[0]==='big')el.className='big';el.textContent=c[1];if(c[2]){const s=document.createElement('span');s.textContent=' — '+c[2];el.append(s);}roll.append(el);}
  earlier();on(priya,110,900,1);on(mira,SPOT.mira,900,1);hop(0,mira,0);setCam(960,540,1);
  $('credits').hidden=false;
  const v=vo('Every character tonight was a real part of your computer, and of PostgreSQL.');
  const H=roll.offsetHeight||1400,box=$('credits').offsetHeight||600;
  /* the roll starts with the title already on screen: no empty dark frame */
  await tween(28000,p=>{roll.style.transform=`translateY(${-(box*.7+p*(H+box*.3))}px)`;});await v;
  $('credits').hidden=true;roll.style.transform='';
});

seq('After the credits','One more thing',async()=>{
  setCam(SPOT.mira,640,1.7);setFade(1);await fadeClear(1200);
  await vo('One more thing. Tonight, every time Mira needed the storeroom, she had to stop and wait.');
  say(mira,'Pages 43 to 50, please. I’ll keep working.',3800);
  await vo('Since PostgreSQL 18, for big jobs like reading a whole table, PostgreSQL can ask for many pages ahead of time, and keep working while they arrive.');
  cap('');title('Next episode','Cooking without waiting','Asynchronous I/O in PostgreSQL 18');await W(5000);untitle();
});

seq('PK Explains','End slate',async()=>{await endSlate();});
