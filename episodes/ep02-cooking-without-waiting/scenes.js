/* ================= the film · Episode 2 · Cooking Without Waiting =================
   Script approved at Gate 1 (script.md). Facts: facts.md. Story cut for everyone; eng() and vo(..,1) are the
   Engineer's cut and always leave the world exactly as the story cut leaves it. */
const SEQ=[];
function seq(act,name,run){SEQ.push({act,name,run});}
const eng=f=>ENG?f():Promise.resolve();
/* a bubble placed lower or to the side (the Loan Officer's handset sits next to Priya's head) */
function lower(e,h,dx=0){const b=bubs[bubs.length-1];if(b&&b.host===e){b.h=h;b.dx=dx;follow();}}
function readyTo(a,b,ms){return tween(ms,p=>{const n=Math.round(a+(b-a)*p);track({f:n+'/32'},p<1);});}
const HOOK=i=>[HX+46,660+i*50];
const FREEZE=[1360,600,1.25];   /* the "Mira asleep" frame; the payoff matches it */
let hookN=0;
async function hang(t){const [x,y]=HOOK(hookN++);on(t,MX+30,700);await go(t,x,y,700);}
function unhook(){hookN=Math.max(0,hookN-1);}

seq('PK Explains','Opening logo',async()=>{await studioIdent();});

/* ---------- COLD OPEN ---------- */
seq('Cold open','On the line',async()=>{
  coldState();setCam(170,640,2.0);setFade(1);$('frame').classList.remove('brand');expr(priya,'worried');chef(true);
  await fadeClear(1600);
  say(loan_officer,'Send me your last twelve months of statements.',3600);lower(loan_officer,200,40);await W(3800);
  say(loan_officer,"I'll stay on the line.",2400);lower(loan_officer,200,40);await W(2000);
  await vo("This is Priya. Yes, the same Priya. Her train ticket from last night is the first line on her statement. Tonight she's applying for a loan, and the man on the phone wants that statement right now.");
  say(priya,'Sending it… now.',2600);await W(1500);
  await pop(ring,360,750);
  await all(tween(2600,p=>progress(p)),readyTo(0,32,2600));progress(1,true);sfx('chime');expr(priya,'happy');
  say(loan_officer,'Got it. That was quick.',3000);lower(loan_officer,200,40);await W(2600);
  await vo("Here's the twist. The bank's storeroom is exactly as slow as it was last night. Not one bit faster. And last night, the chef cooking for Priya spent most of her time asleep.");
  camTo(MX,600,1.5,5200);
  await vo("So how do you cook faster, when the slowest part of the kitchen hasn't changed at all?");
  cap('');sfx('rewind');stage.classList.add('rewind');$('rwlabel').textContent='◀◀ THE SAME ORDER · THE OLD WAY';$('rwlabel').hidden=false;
  await all(camTo(960,520,1,2200),tween(2200,p=>{CAM.style.opacity=(p*10|0)%2?0.85:1;}));CAM.style.opacity=1;
  await fadeBlack(700);
  resetWorld();earlier();setFade(1);
  title('PK Explains','Cooking Without Waiting','How PostgreSQL 18 stops waiting for the disk');
  await W(4600);untitle();
});

/* ---------- ACT ONE ---------- */
seq('Act one · The long order','The same kitchen',async()=>{
  await actCard('ACT ONE','The Long Order','Why does Mira keep falling asleep?');
  setCam(330,560,1.25);
  {const f=fadeClear(1100);await W(300);
   const t1=tag(790,345,'lamps = processors','t-cpu',20);
   const j=vo("Welcome back to the kitchen. If you missed last night: four work lamps are the computer's processors, the fridge is its memory, and the storeroom is the disk. The Manager runs the building.");
   await f;await camTo(790,540,1.3,2600);t1.remove();
   const t2=tag(1365,250,'fridge = memory','t-paper',20);await camTo(1365,560,1.45,2600);t2.remove();
   const t3=tag(1808,340,'storeroom = disk','t-disk',20);await camTo(1790,600,1.6,2400);await j;t3.remove();}
  await camTo(470,640,1.6,2600);
  await walk(manager,530,900,1400);face(manager,-1);
  await intro(manager,'THE MANAGER','the operating system kernel','Every lamp, every shelf, every trip to the storeroom goes through him.','os');
  say(manager,'Ask me first. Always.',3000);
  await camTo(250,680,1.6,2000);
  on(priya,-120,900,1);await walk(priya,110,900,2000);
  await intro(priya,'PRIYA','a customer, on her banking app','Needs her twelve-month statement. Now.','cu');
  on(mira,340,900,1);mira.o=0;ap(mira);
  const vh=vo("The Host hands Priya's order to a chef. Tonight's chef is Mira again.");
  await tween(900,p=>{mira.o=p;ap(mira);});await vh;
  await intro(mira,'MIRA','a backend process','Cooks for one customer at a time. Tonight: Priya’s statement.');
  await vo("Strictly, every new connection gets a brand new chef with a new process number. In our kitchen, she's always played by Mira.",1);
  expr(mira,'happy');say(mira,"A whole year of orders? Let's go.",3000);
  await all(walk(mira,MX,900,3400),camTo(1250,600,1.3,3400),walk(manager,1330,900,4200));face(mira,1);face(manager,-1);expr(mira);
  hop(0,mira,1000);chef(true);
  await vo("Last night, Mira needed one page. Tonight she needs thirty-two. Priya's year of orders sits on pages 43 to 74, right next door to her account on page 42.");
  await vo("A real bank would usually find Priya's rows with an index. We read them straight through here, like a whole-table read. If her rows were scattered, PostgreSQL 18 would use a bitmap heap scan and read ahead the same way.",1);
  pulseTrack();
  await vo('Keep your eye on the score. Pages ready, and whether Mira is awake.');
});

/* one trip the old way: ask, sleep, the Manager walks, wake, cook for a blink */
async function oldTrip(c,ms,lamp=true){
  zz(mira,true);chef(false);if(lamp)hop(0,e5,900);
  await walk(manager,1790,900,ms);hatch(0,true);await W(ms*.18);
  carry(c,manager,40,-100);hatch(0,false);
  await walk(manager,1330,900,ms);face(manager,-1);drop(c);await go(c,SHELF[0],428,ms*.2);
  zz(mira,false);chef(true);await hop(0,mira,ms*.25);
  pill(mira,'COOKING');await W(ms*.15);await fadeOut(c,ms*.12);pill(mira,'');}
seq('Act one · The long order','Pages, one by one',async()=>{
  await camTo(1300,600,1.3,1400);
  const q=tag(1365,400,'empty','t-paper',20);await W(500);q.remove();
  say(mira,'Manager, page 43, please.',2800);await W(2600);
  expr(manager,'annoyed');say(manager,'The storeroom again? Long walk.',3000);await W(2600);expr(manager);
  zz(mira,true);chef(false);hop(0,e5,1000);
  const w=walk(manager,1790,900,4200);camTo(1520,600,1.15,4200);
  await vo("Remember this walk? If every move under a lamp took one second, one trip to the storeroom would take days.");
  await w;hatch(0,true);await W(700);carry(CR['43'],manager,40,-100);hatch(0,false);
  await all(walk(manager,1330,900,4000),camTo(1300,600,1.3,4000));face(manager,-1);drop(CR['43']);await go(CR['43'],SHELF[0],428,600);
  zz(mira,false);chef(true);await hop(0,mira,900);pill(mira,'COOKING');await W(500);await fadeOut(CR['43'],400);pill(mira,'');ready(1);
  say(mira,'Done. Page 44, please.',2600);await W(2200);
  await camTo(1460,600,1.05,1600);
  const v1=vo('Ask. Sleep. Wake. Cook for a blink. Ask again. Thirty-two times.');
  await oldTrip(CR['44'],2300);ready(2);await v1;
  const v2=vo('Computer people call this synchronous reading. It means: one at a time, and wait for each one.');
  await oldTrip(CR['45'],1700);ready(3);await v2;
  /* the freeze: Mira asleep again, the Manager on his way */
  zz(mira,true);chef(false);hop(0,e5,900);walk(manager,1600,900,1600);
  await camTo(...FREEZE,1800);
  await vo("Mira is the fastest cook in the building, and she's spending almost the whole order asleep. Who is working while she sleeps?");
});

/* ---------- ACT TWO ---------- */
seq('Act two · The idle storeroom','Eight hatches',async()=>{
  await actCard('ACT TWO','The Idle Storeroom','If the storeroom is slow, why is it bored?');
  CR['43'].txt.textContent='p.46';on(manager,1790,900,1);
  setCam(1808,560,2.0);
  {const f=fadeClear(1400);await W(300);
   const j=vo("Let's look inside the storeroom. It isn't one long shelf with one clerk. A modern disk is more like this: many hatches, and a clerk behind every one, all able to fetch at the same time.");
   await f;await W(2600);for(let i=0;i<8;i++){hatch(i,true);await W(160);}await W(1400);hatchesOff();await j;}
  await vo('A modern NVMe drive allows up to sixty-five thousand queues, each holding up to sixty-five thousand requests.',1);
  hatch(0,true);
  const t=tag(1808,600,'one at a time = synchronous I/O','t-disk',15);
  await vo('And Mira sends one request at a time. One hatch busy. Seven clerks idle.');
  await vo("The slow part isn't only the walk. It's that we're using one hatch out of eight.");
  t.remove();
});

seq('Act two · The idle storeroom','The Manager\'s guess',async()=>{
  carry(CR['43'],manager,40,-100);hatch(0,false);
  const wk=all(walk(manager,1330,900,2600),camTo(1300,580,1.35,2600));
  await W(900);expr(manager,'happy');say(manager,'Forty-three, forty-four… I see where this is going.',3400);await wk;face(manager,-1);
  drop(CR['43']);await go(CR['43'],SHELF[0],428,500);
  guessSlot(0,'p.47');await W(300);guessSlot(1,'p.48');await W(900);expr(manager);
  await vo("The Manager isn't silly. When someone reads pages in a straight line, he guesses the next ones and fetches them early. It's called read-ahead, and for years PostgreSQL leaned on it.");
  zz(mira,false);chef(true);hop(0,mira,500);pill(mira,'COOKING');await fadeOut(CR['43'],300);pill(mira,'');ready(4);
  guessSlot(0,'');shelfSlot(0,'p.47');await W(300);shelfSlot(0,'');ready(5);
  await vo("Even with his guess, Mira still knocks on his door for every page. Since PostgreSQL 17 she can ask for neighbouring pages in one knock. And older versions could leave him a note: you'll want these soon.",1);
  guessSlot(1,'');shelfSlot(0,'p.48');await W(300);shelfSlot(0,'');ready(6);
  camTo(1250,560,1.55,1000);
  await pop(scat,1250,600);
  guessSlot(0,'p.49');guessSlot(1,'p.50');expr(manager,'annoyed');
  say(manager,'Sixty-one? Twelve? Nobody told me that.',3200);await W(2800);
  await vo("That's the catch. Only Mira can read her order slip. The Manager can only guess from the outside.");
  off(scat);guessSlot(0,'');guessSlot(1,'');expr(manager);
});

seq('Act two · The idle storeroom','What if: a chef per page',async()=>{
  await whatIf('WHAT IF · A CHEF FOR EVERY PAGE',async()=>{
    camTo(800,600,1.05,1200);
    const v=vo('So, what if we hired a chef for every page? Thirty-two chefs, thirty-two trips, all at once.');
    for(let i=0;i<CROWD.length;i++){pop(CROWD[i],600+i*90,900,i%2?-1:1);await W(240);}
    await v;
    const spin=(async()=>{for(let k=0;k<10;k++){hop(k%4,CROWD[(k*3)%CROWD.length],400);await W(420);}})();
    walk(arjun,900,900,900);expr(arjun,'worried');
    say(arjun,'Excuse me — has anyone seen my cashback?',3200);await W(3000);
    await vo("Arjun is still looking for the cashback that never happened last night. Thirty-two chefs, four lamps. You know the rule.");
    await spin;
    say(manager,'No lamp, no work.',2600);await W(2400);
    await vo("Every chef costs memory, and they spend their night queueing for lamps. More chefs isn't the answer.");
    off(...CROWD);expr(arjun);on(arjun,SPOT.arjun,900,-1);
  });
  /* restore: exactly the kitchen before the what-if */
  lampsOff();hop(0,mira,0);hop(1,e1,0);hop(2,arjun,0);hop(3,leela,0);
  zz(mira,true);chef(false);hop(0,e5,0);
  await camTo(...FREEZE,1600);
  await vo('So we need one chef who never stops cooking, and a storeroom with every hatch busy. Can we have both?');
});

/* ---------- ACT THREE ---------- */
seq('Act three · The trick','Pages 43 to 50',async()=>{
  await actCard('ACT THREE','The Trick','Who waits, if not the chef?');
  /* the same order, from the top, in a kitchen running PostgreSQL 18 */
  zz(mira,false);hop(0,mira,0);on(manager,DOORX,900,-1);shelfClear();ready(0);chef(true);hatchesOff();hookN=0;
  setCam(MX-20,620,1.6);
  {const f=fadeClear(1400);await W(300);const j=vo('Same kitchen. Same storeroom. Same order. But this kitchen runs PostgreSQL 18.');await f;await j;}
  expr(mira,'happy');say(mira,'Pages 43 to 50, please. I’ll keep working.',3600);
  await hang(TK['43–50']);await W(2000);expr(mira);
  await vo('Instead of asking and sleeping, Mira writes a ticket for the pages she’ll need next, hangs it up, and carries on. Computer people call this asynchronous reading. Ask now, collect later.');
  const t=tag(HX+46,620,'ticket = a read request','t-paper',16);
  await hang(TK['51–58']);
  await vo('Neighbouring pages go on one ticket, and come back in one box.');
  t.remove();
  await vo("One ticket can cover up to 128 kilobytes by default. That's sixteen pages. The setting is io_combine_limit.",1);
});

seq('Act three · The trick','The Runners',async()=>{
  camTo(900,600,1.15,1400);
  on(runner,-60,900,1);on(runner2,-160,900,1);on(runner3,-260,900,1);
  const vr=vo('Meet the Runners. There are three of them, and their whole job is to take tickets off the hooks and fetch what’s on them.');
  await all(walk(runner,980,900,3600),walk(runner2,900,900,3600),walk(runner3,820,900,3600));
  look('dawn',1,0);await vr;
  await intro(runner,'THE RUNNERS','I/O workers','Carry the tickets, do the waiting, so the chefs don’t have to.');
  await vo("This is io_method equals worker, the default in PostgreSQL 18. The number of Runners is io_workers. Three by default.",1);
  look('dawn',0,0);
  await walk(runner,1040,900,800);face(runner,1);unhook();carry(TK['43–50'],runner,46,-96);
  say(runner,'Forty-three to fifty. On it.',2600);hop(1,runner,800);await W(1200);
  await all(walk(runner,DOORX-90,900,2600),camTo(1450,600,1.2,2600));face(runner,1);
  say(manager,'Ask me first. Always.',2600);await W(2200);
  say(runner,'Always, boss.',2000);await W(1600);
  drop(TK['43–50']);off(TK['43–50']);hatch(0,true);
  await vo('The Runners still ask the Manager. Still wait for the storeroom.');
  await walk(runner,CORR,900,900);zz(runner,true);hop(1,e1,800);
  await all(walk(runner2,1040,900,1400),camTo(1300,600,1.15,1400));unhook();carry(TK['51–58'],runner2,46,-96);
  await hang(TK['59–66']);
  await walk(runner3,1000,900,600);unhook();carry(TK['59–66'],runner3,46,-96);
  await all(walk(runner2,DOORX-90,900,3000),walk(runner3,DOORX-150,900,3000),camTo(1500,600,1.1,3000));
  drop(TK['51–58']);off(TK['51–58']);hatch(1,true);await W(300);drop(TK['59–66']);off(TK['59–66']);hatch(2,true);
  await vo('And because several tickets are out at once, several hatches light up. The clerks finally have work.');
  walk(runner2,CORR-40,900,700).then(()=>zz(runner2,true));walk(runner3,CORR-90,900,800).then(()=>zz(runner3,true));
  /* the first box comes back */
  hatch(0,false);on(CR['43–50'],DOORX,800);carry(CR['43–50'],manager,40,-100);
  zz(runner,false);await walk(runner,DOORX-90,900,500);drop(CR['43–50']);carry(CR['43–50'],runner,46,-96);
  await all(walk(runner,1250,900,2400),camTo(...FREEZE,2400));
  drop(CR['43–50']);off(CR['43–50']);shelfSlot(0,'p.43–50');
  walk(runner,CORR+30,900,2200).then(()=>{face(runner,-1);zz(runner,true);});
  look('dawn',1,0);
  pill(mira,'COOKING');const cook=readyTo(0,8,5200);
  await vo('Look who’s asleep now. Somebody still waits for the storeroom. It just isn’t the chef.');
  await cook;shelfSlot(0,'');pill(mira,'');look('dawn',0,0);
  await vo('The pages land straight on the company shelf, shared buffers, where any chef can use them. The Manager may keep his own copy too.',1);
});

seq('Act three · The trick','Catching up',async()=>{
  await camTo(MX,620,1.6,1200);
  expr(mira,'worried');const q=tag(HX+46,620,'p.51–58: still out','t-paper',16);
  zz(mira,true);chef(false);
  await vo('Sometimes Mira cooks faster than the boxes arrive, and she catches up with a ticket still out. Then she waits, just for that one.');
  q.remove();
  hatch(1,false);on(CR['51–58'],DOORX,800);carry(CR['51–58'],manager,40,-100);zz(runner2,false);
  await walk(runner2,DOORX-90,900,500);drop(CR['51–58']);carry(CR['51–58'],runner2,46,-96);
  await walk(runner2,1250,900,2200);drop(CR['51–58']);off(CR['51–58']);shelfSlot(0,'p.51–58');
  zz(mira,false);chef(true);expr(mira);
  say(mira,"Right. I'll ask further ahead.",2800);
  await hang(TK['67–74']);
  walk(runner2,1040,900,900).then(()=>{unhook();carry(TK['67–74'],runner2,46,-96);return walk(runner2,DOORX-90,900,2600);}).then(()=>{drop(TK['67–74']);off(TK['67–74']);hatch(3,true);return walk(runner2,CORR-40,900,600);}).then(()=>zz(runner2,true));
  pill(mira,'COOKING');const cook=readyTo(8,16,6000);
  await vo('So she asks further ahead. The more she has to wait, the further ahead she asks.');
  await vo('The real rule: she starts by asking one page ahead, and each time she has to wait, she asks twice as far, up to a limit. When pages are already in the fridge, she eases off.',1);
  await vo('The limit on tickets out at once is effective_io_concurrency, sixteen by default in PostgreSQL 18. Vacuum uses maintenance_io_concurrency.',1);
  await cook;shelfSlot(0,'');pill(mira,'');
  /* box 59–66 is already back on the shelf */
  hatch(2,false);shelfSlot(1,'p.59–66');
});

seq('Act three · The trick','The ticket rail',async()=>{
  /* a cutaway to another kitchen; afterwards the world is exactly as it was */
  const keep={rn:[runner.o,runner2.o,runner3.o]};
  sfx('whoosh');const l=$('wilabel');l.textContent='ANOTHER KITCHEN · THE TICKET RAIL';l.hidden=false;
  off(runner,runner2,runner3);railOn(true);on(manager,425,900,1);
  await camTo(760,610,1.05,1800);
  await vo('Some kitchens do it another way. On Linux, the Manager can put up a ticket rail right through his hatch.');
  const rt=[TK['44'],TK['45'],TK['43']];rt[0].txt.textContent='p.75–82';rt[1].txt.textContent='p.83–90';rt[2].txt.textContent='p.91–98';
  for(let i=0;i<3;i++){on(rt[i],MX-60,700);go(rt[i],1060-i*90,646,600);await W(260);}
  say(mira,'Three on the rail!',2400);await W(900);
  sfx('step',1.4);shake(4);
  await all(...rt.map((t,i)=>go(t,470,646,1500+i*350)));off(...rt);
  const back=[CR['44'],CR['45'],CR['43']];back[0].txt.textContent='p.91–98';back[1].txt.textContent='p.75–82';back[2].txt.textContent='p.83–90';
  const v=vo('Mira clips her tickets on herself, knocks once for the lot, and picks up the boxes as they come back, in whatever order they finish. No Runners needed.');
  for(let i=0;i<3;i++){on(back[i],480,778);go(back[i],880-i*80,778,1300);await W(900);}
  await v;
  await vo('This is io_method equals io_uring. Two rings sit in memory both sides can see: one for requests, one for results.',1);
  await vo("The rail even has a mode where a helper in the Manager's office watches it, so there's no knock at all. The price: that helper keeps a lamp busy while it watches.",1);
  off(...back);
  rt[0].txt.textContent='p.44';rt[1].txt.textContent='p.45';rt[2].txt.textContent='p.43';back[0].txt.textContent='p.44';back[1].txt.textContent='p.45';back[2].txt.textContent='p.46';
  sfx('whoosh');l.hidden=true;railOn(false);on(manager,DOORX,900,-1);
  [runner,runner2,runner3].forEach((r,i)=>{r.o=keep.rn[i];ap(r);});
  await camTo(1300,600,1.15,1600);
});

seq('Act three · The trick','Recap',async()=>{
  const p=camTo(MX+60,600,1.5,5200);
  pill(mira,'COOKING');shelfSlot(1,'');const cook=readyTo(16,24,5000);
  await vo('So. The storeroom is just as slow. But Mira asks before she needs a page, the Runners do the waiting, and many hatches work at once.');
  await all(p,cook);pill(mira,'');
});

/* ---------- ACT FOUR ---------- */
seq('Act four · The payoff','Before he hangs up',async()=>{
  await actCard('ACT FOUR','The Payoff','Will it land before he hangs up?');
  setCam(...FREEZE);for(const r of [runner,runner2,runner3])zz(r,false);zz(runner,true);on(runner,CORR,900,-1);on(runner2,1040,900,1);on(runner3,980,900,1);
  {const f=fadeClear(1200);await W(300);const j=vo('Same kitchen. Same storeroom. Same thirty-two pages.');await f;await j;}
  hatch(3,false);shelfSlot(0,'p.67–74');
  pill(mira,'COOKING');await readyTo(24,32,3600);pill(mira,'');shelfSlot(0,'');
  expr(mira,'happy');sfx('mira');say(mira,'Thirty-two of thirty-two. Order up!',3000);await W(2800);
  cap('');await fadeBlack(500);setCam(170,640,2.0);on(priya,110,900,1);on(loan_officer,152,745);on(ring,360,750);progress(.85);expr(priya,'worried');await fadeClear(500);
  await tween(900,p=>progress(.85+.15*p));progress(1,true);sfx('chime');expr(priya,'happy');
  say(loan_officer,'Got it. That was quick.',3000);lower(loan_officer,200,40);await W(2800);
  say(priya,'…and still no cashback.',2800);await W(2800);
  await vo("The storeroom didn't get faster. Mira just stopped waiting for it.");
  sfx('promise');cap('');title('The moral','Don’t wait for the slow thing.','Ask early, and keep working.');await W(4200);untitle();
});

/* ---------- ANOTHER ENDING: rule of three ---------- */
seq('Another ending','Three orders',async()=>{
  off(ring,loan_officer);expr(priya);
  await camTo(1300,560,1.35,1800);
  await vo('Does this make everything faster? Not quite. Three orders.');
  on(pg42,1365,430);pinit(pg42);prow(pg42,0,{stamp:'replaced by #812'});prow(pg42,1,{on:true});
  const t1=tag(1365,330,'1 · page 42: already in the fridge','t-paper',16);
  await vo('One: Priya checks her balance. Page 42 is already in the fridge. Nothing to fetch, nothing to ask ahead. No change.');
  t1.remove();off(pg42);
  await camTo(1560,600,1.5,1800);
  await pop(supervisor,1460,900,1);hop(2,supervisor,800);
  const t2=tag(1600,520,'2 · writes: still the old way','t-alarm',16);
  say(supervisor,"Writes still go the old way, I'm afraid.",3200);await W(3000);
  await vo('Two: writing. In PostgreSQL 18, saving to the notebook and the storeroom still waits the old way. The tickets are coming for writes too, in later versions.');
  t2.remove();off(supervisor);hop(2,arjun,600);
  await camTo(1150,600,1.0,2000);
  await walk(leela,1000,900,1000);face(leela,1);
  say(leela,'Every account in the bank? Hooks, please.',3200);await W(1600);
  const t3=tag(1250,330,'3 · big reads: every hatch busy','t-disk',16);
  for(let i=0;i<8;i++){hatch(i,true);await W(120);}
  zz(runner,false);walk(runner,DOORX-90,900,1600);walk(runner2,DOORX-150,900,1800);walk(runner3,DOORX-210,900,2000);
  await vo("Three: the big reads. Whole tables, scattered rows, and the Cleaner's sweep. That's where it pays.");
  await vo("PostgreSQL's own tests showed reads up to three times faster in some cases. Your mileage depends on your storage.",1);
  await vo('To see the tickets in flight, there’s a new view: pg_aios. To get the old behaviour back, set io_method to sync.',1);
  t3.remove();hatchesOff();
});

/* ---------- EPILOGUE ---------- */
seq('Epilogue','Based on a true story',async()=>{
  await actCard('BASED ON A TRUE STORY','2019 – 2025','Why isn’t the rail everywhere?');
  railOn(true);on(manager,425,900,1);on(leela,SPOT.leela,900,-1);off(runner,runner2,runner3);
  setCam(700,620,1.1);
  const t1=tag(700,560,'2019 · Linux 5.1 · io_uring','t-os',18);
  {const f=fadeClear(1400);await W(300);const j=vo('The ticket rail is real. A Linux developer named Jens Axboe built it, and it arrived in 2019.');await f;await j;}
  t1.remove();
  LOCK.style.display='';sfx('stamp');shake(8);expr(manager,'shock');
  const t2=tag(700,560,'2023 · switched off on Google’s servers','t-alarm',17);
  await vo("It was fast, and it was new, and attackers loved it. In 2023 Google said most of the Linux break-ins sent to its bug bounty went through the rail, and switched it off on its own servers. That's one reason the rail isn't in every kitchen, and why the Runners, who work everywhere, are PostgreSQL's default.");
  t2.remove();expr(manager);
  on(runner,1000,900,-1);on(runner2,1090,900,-1);on(runner3,1180,900,-1);for(const r of [runner,runner2,runner3])zz(r,false);
  await camTo(810,480,1.3,2400);
  ledger('PostgreSQL 18 · 25 Sep 2025','ok');sfx('chime');
  await vo('Teaching a kitchen that has cooked for decades to stop waiting took years of work. In September 2025, PostgreSQL 18 shipped it.');
  await eng(async()=>{const t=tag(810,280,'Andres Freund · Thomas Munro · Nazir Bilal Yavuz · Melanie Plageman','t-pg',14);
    await vo('The release notes credit Andres Freund, Thomas Munro, Nazir Bilal Yavuz and Melanie Plageman.',1);t.remove();});
  railOn(false);
});

/* ---------- CREDITS ---------- */
const CREDITS=[
  ['h','PK Explains'],
  ['big','Cooking Without Waiting'],
  ['p','A PK Films Production'],
  ['h','Starring'],
  ['p','Mira','a backend process'],['p','Priya','a client application'],['p','The Manager','the operating system kernel'],
  ['p','The Runners','I/O worker processes'],['p','The Host','postmaster'],['p','Arjun & Leela','backend processes'],['p','The Supervisor','checkpointer'],
  ['p','The Loan Officer','a voice on the phone'],
  ['h','Featuring'],
  ['p','The tickets','read requests'],['p','The ticket hook','a read stream'],['p','The ticket rail','io_uring'],
  ['p','The storeroom hatches','the disk’s parallel queues'],['p',"The Manager's guess",'OS read-ahead'],
  ['p','Four work lamps','CPU cores'],['p','The fridge','RAM'],['p','The company shelf','shared_buffers'],['p','The storeroom','disk'],
  ['h','Settings behind the scenes'],
  ['p','io_method = worker | io_uring | sync','who carries the tickets'],['p','io_workers = 3','how many Runners'],
  ['p','io_combine_limit = 128kB','how many pages per ticket'],['p','effective_io_concurrency = 16','tickets out at once'],
  ['p','maintenance_io_concurrency = 16','the same, for vacuum'],['p','pg_aios','the tickets in flight'],
  ['h','Fact-checked against'],
  ['p','PostgreSQL 17 and 18 release notes and documentation'],['p','PostgreSQL source: aio/README.md, read_stream.c'],
  ['p','LWN, KernelNewbies (Linux 5.1)'],['p','Google Security Blog, June 2023'],['p','NVM Express'],['p','pgsql-hackers, August 2025; pganalyze'],
  ['h','PK Films'],['p','© 2026 PK Films']
];
seq('Credits','Who played whom',async()=>{
  const roll=$('roll');roll.innerHTML='';
  for(const c of CREDITS){const el=document.createElement(c[0]==='h'?'h3':'p');if(c[0]==='big')el.className='big';el.textContent=c[1];if(c[2]){const s=document.createElement('span');s.textContent=' — '+c[2];el.append(s);}roll.append(el);}
  earlier();ledger('#812 · COMMITTED','ok');off(runner2,runner3);on(priya,110,900,1);on(mira,MX,900,1);hop(0,mira,0);on(runner,CORR,900,-1);setCam(960,540,1);
  $('credits').hidden=false;
  const v=vo('Every character tonight was a real part of your computer, and of PostgreSQL.');
  const H=roll.offsetHeight||1400,box=$('credits').offsetHeight||600;
  await tween(30000,p=>{roll.style.transform=`translateY(${-(box*.7+p*(H+box*.3))}px)`;});await v;
  $('credits').hidden=true;roll.style.transform='';
});

seq('After the credits','One more thing',async()=>{
  off(runner);setCam(250,660,1.7);setFade(1);await fadeClear(1200);
  await vo("One more thing. Tonight, Priya's pages were easy to find: right next door to page 42. But the bank has a billion customers.");
  await camTo(MX,620,1.6,2400);
  expr(mira,'worried');say(mira,'Page 42… but how did I know it was page 42?',3600);await W(3400);expr(mira);
  await vo('How do you find one customer among a billion, in three or four trips to the storeroom?');
  cap('');title('Next episode','One in a Billion','Pages, heaps and B-trees');await W(5000);untitle();
});

seq('PK Explains','End slate',async()=>{await endSlate();});
