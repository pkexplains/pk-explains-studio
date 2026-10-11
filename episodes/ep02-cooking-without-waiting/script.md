# Script · Episode 2 · Cooking Without Waiting — for Gate 1

Story cut ≈ 11 min (≈ 1,060 spoken words; Episode 1 ran ≈ 16 min on ≈ 1,620). Engineer's cut ≈ 14 min (+ ≈ 340 words).
This is under the 12–18 min target on purpose: one mechanism, told once. See the Gate 1 note for where to add if wanted.
Lines marked **[ENG]** play only in the Engineer's cut. Fact numbers in ⟨ ⟩ point to `facts.md`.
Bubbles are voiced (cast.json). No narration on the opening logo or the end slate.

## Treatment

1. **Cold open.** The evening after Episode 1. Priya is on the phone with a loan officer who wants her twelve-month
   statement *now*. She taps Download; it lands before he finishes his sentence. Twist: the storeroom is exactly as
   slow as last night, and last night Mira spent most of her time asleep. Question: how do you cook faster when the
   slow part isn't any faster? Rewind. Title.
2. **Act One · The long order** ("Why does Mira keep falling asleep?"). Same kitchen. The statement is a long run of
   pages, 43 to 74. The old way: ask the Manager, nap, wake, cook one page, ask again. The score bar shows the chef
   ASLEEP most of the time.
3. **Act Two · The idle storeroom** ("If the storeroom is slow, why is it bored?"). The storeroom has eight hatches;
   one-at-a-time lights one. The Manager's guess helps on a straight run, but he can't read Mira's slip. What-if
   cutaway: hire a chef per page → not enough lamps ("No lamp, no work").
4. **Act Three · The trick** ("Who waits, if not the chef?"). Callback line: "Pages 43 to 50, please. I'll keep
   working." The Runners carry tickets and do the waiting. Mira catches up once and naps briefly; then she asks
   further ahead. The ticket rail: the other way, on Linux. Recap.
5. **Act Four · The payoff.** Match cut to the cold open: same frame, Mira awake, a Runner dozing in the corridor
   instead. The statement lands. Moral.
6. **Another ending (rule of three):** a tiny order (gains nothing), a write (still waits in 18), the big order
   (wins).
7. **Epilogue · Based on a true story.** The rail's 2019 arrival, its security trouble, why the Runners are the
   default, the people who built it, PostgreSQL 18.
8. **Credits · After-credits tease · End slate.** Tease: one row among a billion.

---

## Scenes

### PK Explains · Opening logo
(3 s ident, no narration)

### Cold open · On the line
*Warm grade. Close on Priya, evening, phone to ear, laptop open. HUD: statement 0/32, CHEF: —.*

LOAN OFFICER (off-screen, through the phone EQ; new cast entry `loan_officer`, voice am_adam):
"Just send me your last twelve months of statements. I'll stay on the line."

NARRATOR (warm): This is Priya. Yes, the same Priya. Her train ticket from last night is the first line on her
statement. Tonight she's applying for a loan, and the man on the phone wants that statement right now.

PRIYA: "Sending it… now."
*She taps Download. A progress ring fills fast; a chime. Expr: relieved.*

LOAN OFFICER: "Got it. That was quick."

NARRATOR (hush): Here's the twist. The bank's storeroom is exactly as slow as it was last night. Not one bit
faster. *(beat)* And last night, the chef cooking for Priya spent most of her time asleep.

NARRATOR (wonder): So how do you cook faster, when the slowest part of the kitchen hasn't changed at all?

*Rewind effect. "Two minutes earlier." Fade.*
**TITLE:** PK Explains · *Cooking Without Waiting* · How PostgreSQL 18 stops waiting for the disk

---

### Act one · The long order · The same kitchen
**ACT CARD:** ACT ONE · The Long Order · *Why does Mira keep falling asleep?*

NARRATOR (warm): Welcome back to the kitchen. If you missed last night: four work lamps are the computer's
processors, the fridge is its memory, and the storeroom is the disk. The Manager runs the building.

MANAGER: "Ask me first. Always."

*Priya's request slides in at the door. The Host waves. Mira steps up, hat on.*

NARRATOR: The Host hands Priya's order to a chef. Tonight's chef is Mira again.
NARRATOR **[ENG]**: Strictly, every new connection gets a brand new chef with a new process number. In our kitchen, she's always played by Mira.

MIRA: "A whole year of orders? Let's go."

NARRATOR: Last night, Mira needed one page. Tonight she needs thirty-two. Priya's year of orders sits on pages
43 to 74, right next door to her account on page 42.
NARRATOR **[ENG]**: A real bank would usually find Priya's rows with an index. We read them straight through here, like a whole-table read. If her rows were scattered, PostgreSQL 18 would use a bitmap heap scan and read ahead the same way.

*Score bar pulses: PAGES READY 0/32 · CHEF: AWAKE.*
NARRATOR: Keep your eye on the score. Pages ready, and whether Mira is awake.

### Act one · The long order · Pages, one by one
*Mira checks the company shelf. Empty.*

MIRA: "Manager, page 43, please."
MANAGER (annoyed): "The storeroom again? Long walk."

*He walks. Mira's lamp hops away. ZZ. Score: ASLEEP.*

NARRATOR (aside): Remember this walk? If every move under a lamp took one second, one trip to the storeroom would
take days. ⟨27⟩

*He returns with 43. Mira wakes, cooks it in a blink. Pill: 1/32.*
MIRA: "Done. Page 44, please."

*Montage, faster each time: ask, ZZ, walk, wake, blink of cooking. Score flickers ASLEEP… AWAKE… ASLEEP.*

NARRATOR (grave): Ask. Sleep. Wake. Cook for a blink. Ask again. Thirty-two times.

NARRATOR: Computer people call this synchronous reading. It means: one at a time, and wait for each one.

*Freeze on Mira asleep, the score reading 3/32.*
NARRATOR (hush): Mira is the fastest cook in the building, and she's spending almost the whole order asleep. Who
is working while she sleeps?

---

### Act two · The idle storeroom · Eight hatches
**ACT CARD:** ACT TWO · The Idle Storeroom · *If the storeroom is slow, why is it bored?*

*Camera travels into the storeroom for the first time. Cold grade. A wall with eight hatches, each with a clerk.*

NARRATOR (wonder): Let's look inside the storeroom. It isn't one long shelf with one clerk. A modern disk is more like
this: many hatches, and a clerk behind every one, all able to fetch at the same time.
NARRATOR **[ENG]**: A modern NVMe drive allows up to sixty-five thousand queues, each holding up to sixty-five thousand requests. ⟨20⟩

*The Manager arrives with Mira's single ask. One hatch lights. Seven clerks lean on their elbows.*

NARRATOR: And Mira sends one request at a time. One hatch busy. Seven clerks idle.

*Introduce the term once, on a tag: "one at a time = synchronous I/O".*
NARRATOR: The slow part isn't only the walk. It's that we're using one hatch out of eight.

### Act two · The idle storeroom · The Manager's guess
*Back in the kitchen. The Manager, on his way back, grabs 44 and 45 as well and drops them on his own shelf.*

MANAGER (pleased): "Forty-three, forty-four… I see where this is going."

NARRATOR: The Manager isn't silly. When someone reads pages in a straight line, he guesses the next ones and
fetches them early. It's called read-ahead, and for years PostgreSQL leaned on it. ⟨4⟩

*Mira still walks to his office for every page, knocks, and takes it from his shelf.*
NARRATOR **[ENG]**: Even with his guess, Mira still knocks on his door for every page. Since PostgreSQL 17 she can ask for neighbouring pages in one knock. And older versions could leave him a note: you'll want these soon. ⟨16⟩ ⟨19⟩

*Mira's order slip, close-up: it jumps — p.43, p.44, then "p.61, p.12, p.70". The Manager squints at his shelf: wrong guesses.*

MANAGER: "Sixty-one? Twelve? Nobody told me that."

NARRATOR (bright): That's the catch. Only Mira can read her order slip. The Manager can only guess from the
outside. ⟨5⟩

### Act two · The idle storeroom · What if: a chef per page
*Sepia. Label: WHAT IF.*

NARRATOR (aside): So, what if we hired a chef for every page? Thirty-two chefs, thirty-two trips, all at once.

*The Host hires a crowd of coral chefs; they jostle under the four lamps. Lamps hop frantically.*

ARJUN (squeezed): "Excuse me — has anyone seen my cashback?"

NARRATOR: Arjun is still looking for the cashback that never happened last night. *(beat)* Thirty-two chefs, four
lamps. You know the rule.

MANAGER: "No lamp, no work."

NARRATOR: Every chef costs memory, and they spend their night queueing for lamps. More chefs isn't the answer.

*Restore colour and exact state: Mira asleep, 3/32.*
NARRATOR (hush): So we need one chef who never stops cooking, and a storeroom with every hatch busy. Can we have
both?

---

### Act three · The trick · Pages 43 to 50
**ACT CARD:** ACT THREE · The Trick · *Who waits, if not the chef?*

*Dawn grade begins. Rewind to the top of the order. Mira at her station, a new brass hook beside her.*

NARRATOR (warm): Same kitchen. Same storeroom. Same order. But this kitchen runs PostgreSQL 18.

*Mira tears a ticket, writes, hangs it on the hook.*
MIRA: "Pages 43 to 50, please. I'll keep working."

NARRATOR: Instead of asking and sleeping, Mira writes a ticket for the pages she'll need next, hangs it up, and
carries on. Computer people call this asynchronous reading. Ask now, collect later. ⟨1⟩

*Tag: "ticket = a read request". Second ticket: 51–58.*
NARRATOR: Neighbouring pages go on one ticket, and come back in one box.
NARRATOR **[ENG]**: One ticket can cover up to 128 kilobytes by default. That's sixteen pages. The setting is io_combine_limit. ⟨15⟩

### Act three · The trick · The Runners
*Three coral figures with caps and trolleys roll in. Freeze-frame intro card.*

**INTRO CARD:** THE RUNNERS · I/O workers · *Carry the tickets, do the waiting, so the chefs don't have to.*

NARRATOR: Meet the Runners. There are three of them, and their whole job is to take tickets off the hooks and fetch
what's on them. ⟨6⟩
NARRATOR **[ENG]**: This is io_method equals worker, the default in PostgreSQL 18. The number of Runners is io_workers. Three by default. ⟨6⟩

LEAD RUNNER (taking the ticket): "Forty-three to fifty. On it."

*Runner to the Manager's office.*
MANAGER: "Ask me first. Always."
LEAD RUNNER: "Always, boss."

NARRATOR: The Runners still ask the Manager. Still wait for the storeroom. ⟨7⟩
*The Runner dozes in the corridor, ZZ, while in the background Mira works under her lamp. Score: CHEF AWAKE.*

NARRATOR (wonder): Look who's asleep now. Somebody still waits for the storeroom. It just isn't the chef. ⟨8⟩

*Second and third Runners take tickets 51–58 and 59–66. Storeroom: three hatches lit, then more.*
NARRATOR: And because several tickets are out at once, several hatches light up. The clerks finally have work.

*Box lands on the company shelf. Pages pop to READY. Score: 8/32.*
NARRATOR **[ENG]**: The pages land straight on the company shelf, shared buffers, where any chef can use them. The Manager may keep his own copy too. ⟨7⟩

### Act three · The trick · Catching up
*Mira cooks so fast she reaches page 51 before its box is back. She glances at the hook. Short ZZ.*

NARRATOR: Sometimes Mira cooks faster than the boxes arrive, and she catches up with a ticket still out. Then she
waits, just for that one.

*She wakes. Writes the next tickets further ahead: 67–74.*
MIRA: "Right. I'll ask further ahead."

NARRATOR: So she asks further ahead. The more she has to wait, the further ahead she asks.
NARRATOR **[ENG]**: The real rule: she starts by asking one page ahead, and each time she has to wait, she asks twice as far, up to a limit. When pages are already in the fridge, she eases off. ⟨18⟩
NARRATOR **[ENG]**: The limit on tickets out at once is effective_io_concurrency, sixteen by default in PostgreSQL 18. Vacuum uses maintenance_io_concurrency. ⟨17⟩

### Act three · The trick · The ticket rail
*Cutaway: a kitchen down the road with the same layout; a steel rail runs through the Manager's office hatch.*

NARRATOR: Some kitchens do it another way. On Linux, the Manager can put up a ticket rail right through his hatch.
⟨9⟩

*Mira clips three tickets onto the rail, knocks once.*
MIRA: "Three on the rail!"
*Boxes come back to the pickup shelf below, out of order: 59–66 first, then 43–50.*

NARRATOR: Mira clips her tickets on herself, knocks once for the lot, and picks up the boxes as they come back,
in whatever order they finish. No Runners needed. ⟨10⟩
NARRATOR **[ENG]**: This is io_method equals io_uring. Two rings sit in memory both sides can see: one for requests, one for results. ⟨11⟩
NARRATOR **[ENG]**: The rail even has a mode where a helper in the Manager's office watches it, so there's no knock at all. The price: that helper keeps a lamp busy while it watches. ⟨13⟩

*Back to our kitchen.*

### Act three · The trick · Recap
*Slow push on Mira cooking, hook full of tickets.*

NARRATOR (warm): So. The storeroom is just as slow. But Mira asks before she needs a page, the Runners do the
waiting, and many hatches work at once.

---

### Act four · The payoff · Before he hangs up
*Match cut: exactly the cold-open framing of the kitchen. Last night's shot played Mira asleep; now Mira is awake
under her lamp, and the lead Runner dozes in the corridor in the same spot.*

NARRATOR (hush): Same kitchen. Same storeroom. Same thirty-two pages.

*Score climbs 24… 28… 32/32. CHEF: AWAKE stayed lit the whole time.*
MIRA (happy): "Thirty-two of thirty-two. Order up!"

*Cut to Priya: the ring fills, chime.*
LOAN OFFICER: "Got it. That was quick."
PRIYA (smiles, to herself): "…and still no cashback."

NARRATOR (warm): The storeroom didn't get faster. Mira just stopped waiting for it.

**MORAL (on screen):** *Don't wait for the slow thing. Ask early, and keep working.*

---

### Another ending · Three orders
*Rule of three. Three order slips on the pass.*

NARRATOR (aside): Does this make everything faster? Not quite. Three orders.

*Order one: Priya checks her balance. Page 42 is already on the company shelf.*
NARRATOR: One: Priya checks her balance. Page 42 is already in the fridge. Nothing to fetch, nothing to ask ahead.
No change. ⟨23⟩

*Order two: the notebook. The Supervisor taps his clipboard.*
SUPERVISOR: "Writes still go the old way, I'm afraid."
NARRATOR: Two: writing. In PostgreSQL 18, saving to the notebook and the storeroom still waits the old way. The
tickets are coming for writes too, in later versions. ⟨22⟩

*Order three: Leela's monthly report, a huge stack of pages; tickets fly; every hatch lights.*
LEELA: "Every account in the bank? Hooks, please."
NARRATOR (bright): Three: the big reads. Whole tables, scattered rows, and the Cleaner's sweep. That's where it
pays. ⟨3⟩
NARRATOR **[ENG]**: PostgreSQL's own tests showed reads up to three times faster in some cases. Your mileage depends on your storage. ⟨21⟩
NARRATOR **[ENG]**: To see the tickets in flight, there's a new view: pg_aios. To get the old behaviour back, set io_method to sync. ⟨24⟩ ⟨26⟩

---

### Epilogue · Based on a true story
*Sepia stills: a calendar page "2019", the steel rail being bolted on.*

NARRATOR (warm): The ticket rail is real. A Linux developer named Jens Axboe built it, and it arrived in 2019. ⟨12⟩

*A padlock snaps shut on the rail.*
NARRATOR (grave): It was fast, and it was new, and attackers loved it. In 2023 Google said most of the Linux break-ins
sent to its bug bounty went through the rail, and switched it off on its own servers. ⟨14⟩ That's one reason
the rail isn't in every kitchen, and why the Runners, who work everywhere, are PostgreSQL's default.

*Dawn. Four names on a whiteboard.*
NARRATOR: Teaching a kitchen that has cooked for decades to stop waiting took years of work. In September 2025, PostgreSQL 18
shipped it. ⟨2⟩
NARRATOR **[ENG]**: The release notes credit Andres Freund, Thomas Munro, Nazir Bilal Yavuz and Melanie Plageman. ⟨25⟩

---

### Credits · Who played whom
NARRATOR: Every character tonight was a real part of your computer, and of PostgreSQL.
*Roll: Mira (a backend process) · Priya (the customer) · The Manager (the kernel) · The Runners (I/O workers) · The
ticket rail (io_uring) · The tickets (read requests) · The storeroom hatches (the disk's parallel queues) · The Host,
Arjun, Leela, the Supervisor · Fact-checked against: S1–S13.*

### After the credits · One more thing
*Late night. Priya's statement scrolls on the laptop.*
NARRATOR: One more thing. Tonight, Priya's pages were easy to find: right next door to page 42. But the bank has a
billion customers.
MIRA: "Page 42… but how did I know it was page 42?"
NARRATOR (wonder): How do you find one customer among a billion, in three or four trips to the storeroom?
**TITLE:** Next episode · *One in a Billion* · Pages, heaps and B-trees

### PK Explains · End slate
(no narration)

---

## Naive-viewer audit (Phase 4)

| Minute | Check | Verdict / fix applied |
|---|---|---|
| 0:03–0:15 | Person + stake in 15 s? | Priya on a live loan call by 0:05; the officer's line is the stake. ✓ |
| 0:30 | Jargon before reason to care? | None until Act One; "storeroom" only, which returning viewers know and new viewers get in the recap line. ✓ |
| 1:30 | New viewers lost? | Added the 15-second "If you missed last night" line (lamps, fridge, storeroom, Manager). ✓ |
| 2–4 | Where are we / what are we waiting for? | Score bar: PAGES READY and CHEF AWAKE/ASLEEP, called out once. ✓ |
| 4–6 | Anyone unintroduced? | Storeroom clerks are shown, not named (props). Runners get an intro card. ✓ |
| 5–7 | More than 2 explanation lines without action? | "The Manager's guess" had 3; the slip close-up and the Manager's wrong grabs now play between lines. ✓ |
| 7–8 | Detour that never pays off? | Prefetch hints, PG17 combining and the NVMe numbers moved to [ENG]. The what-if pays off with the lamp gag. ✓ |
| 9–11 | One new term per scene? | synchronous (Act 1), read-ahead (Act 2), asynchronous (Act 3, Pages 43–50), Runners (I/O workers). io_uring is only named in [ENG]; story cut says "ticket rail". ✓ |
| 11 | Key insight three times? | "Somebody still waits… just isn't the chef" (Runners), match cut visual, moral. ✓ |
| 12–13 | Honest limits? | Three orders: tiny order, writes, big reads. ✓ |
| Risk | The epilogue's security beat may feel like a tangent | Kept short (2 lines) because it answers "why aren't Runners and rail the same?"; cut first if the audience test shows a dip. |
