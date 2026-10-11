# PK Explains · Series bible

The single source of truth for the world, cast and style of every episode. An episode may ADD rooms,
staff and props. It never changes what is written here; changes to this file are a series decision.

## The world: the Kitchen

A restaurant kitchen at night, owned by the bank. Two companies work in it:

- **The building and its Manager = the operating system.** Nobody touches a lamp, a shelf or the storeroom
  without asking him.
- **The catering staff (coral) = PostgreSQL.** They rent the kitchen and cook every order.

| In the Kitchen | Real system part | Look (studio/world, studio/world/cast.js) |
|---|---|---|
| Four work lamps | CPU cores; a chef only works under a lamp | Warm amber beams from the ceiling |
| The fridge | RAM; forgets everything in a power cut | Tall white unit, two shelves |
| Company shelf (in the fridge) | shared_buffers | Upper shelf, coral rule |
| Manager's shelf (in the fridge) | OS page cache | Lower shelf, blue rule |
| Private spots | backend-local memory | Dashed squares under the shelves |
| The storeroom | disk | Green-edged room on the right; a long walk |
| The notebook | write-ahead log (WAL) | Open notebook on a stand |
| The ledger | pg_xact (commit status) | Board top-left: "#812 · COMMITTED" |
| Cards with versions | MVCC row versions on a page | Trays with stacked cards |
| The stamp | row lock | Red stamp on a card |
| The counter | other sessions' work | Long counter with chefs |
| The score bar (top of frame) | where the protagonist's data lives right now | FRIDGE / STOREROOM / NOTE tracker |
| Emergency light | a power cut (never a black screen) | Deep blue wash, 45% |
| Order tickets (ep 2) | read requests; one ticket can cover neighbouring pages (combined I/O) | Paper ticket, "p.43–50" |
| The ticket hook (ep 2) | a backend's in-flight reads (read stream) | Brass hook by the chef's station |
| The ticket rail and pickup shelf (ep 2) | io_uring submission and completion queues (`io_method = io_uring`, Linux) | Steel rail through the Manager's office hatch |
| Storeroom hatches (ep 2) | the disk's parallel queues (NVMe) | Eight hatches in the storeroom wall, a clerk behind each |

## The cast (voices locked in series/cast.json)

| Character | Plays | Look | Voice |
|---|---|---|---|
| Mira | a PostgreSQL backend process (one chef per customer), PID 4127 | Coral chef #FF7A59, chef hat, apron | af_heart |
| Priya | the customer / client app | Lilac #B9B4C9, cap, laptop | hf_alpha |
| The Host | postmaster (greets, forks, never cooks) | Red-orange #E0603F, top hat, bow tie | bm_lewis |
| The Manager | the OS kernel | Blue #7FA8FF, halo, tie | bm_george |
| Arjun | another backend (competing update) | Light coral, chef | hm_psi |
| Leela | a long-running reporting query | Coral, chef, clipboard | hf_beta |
| The Recovery Chef | startup process (crash recovery) | Coral, headband | af_sarah |
| The Helper | background writer (Engineer's cut) | Coral, headband | (not voiced yet) |
| The Supervisor | checkpointer | Coral, cap, clipboard | am_eric |
| The Courier | WAL sender (Engineer's cut) | Coral, cap, bag | (not voiced yet) |
| The Runners (ep 2) | I/O worker processes (`io_method = worker`, `io_workers = 3`) | Coral, cap, small trolley; three of them | lead Runner hm_omega; others silent |
| The Loan Officer (ep 2) | a person on Priya's phone (not a system part) | Never seen; phone EQ | am_adam |
| The Cleaner | autovacuum | Coral, headband, broom | am_echo |
| Extra chefs (e0, e1, e5) | other backends | Coral shades | am_liam, af_river |
| Narrator | the storyteller | never seen | am_michael, directed |

Rules: PostgreSQL staff are always coral, the OS is always blue, customers are lilac. New PostgreSQL
processes are new coral staff with a role prop (WAL writer: a pen? autovacuum launcher: a whistle).
A character introduced once keeps name, look and voice for the whole series.

## Film grammar (every episode)

1. Opening logo (3 s ident) - 2. Cold open on a real-life moment with a stake, ending on a question -
3. Title card - 4. Acts with act cards (ACT ONE · title · question) - 5. Name pills and intro cards the first
time anyone appears - 6. Recap before the payoff - 7. The payoff - 8. "What if" / alternate ending when it
teaches - 9. Epilogue (night shift / true story) - 10. "Who played whom" credits - 11. After-credits tease
of the next episode - 12. End slate. Story cut for everyone; Engineer's cut adds real names and settings.

## Sound

Narrator am_michael with the delivery palette; music in D major / B minor from series/music; Mira's
rising motif D-F#-A-D and the Manager's falling G-D return in every episode; silence and emergency light
for blackouts; the narrator waits for dialogue; music ducks under every line.

## Episode list

| # | Title | Real moment | Topic | YouTube |
|---|---|---|---|---|
| 1 | The Kitchen That Never Forgets | Priya pays ₹200, power cut 1 ms later | processes, caches, MVCC, locks, WAL, recovery, checkpoints, vacuum, fsyncgate | v3bqCk8m6fw |
| 2 | Cooking Without Waiting | Priya downloads her 12-month statement during a loan call | asynchronous I/O in PostgreSQL 18: worker, io_uring, read-ahead, combining | |
| 3 | One in a Billion (teased) | | pages, heaps and B-trees | |
