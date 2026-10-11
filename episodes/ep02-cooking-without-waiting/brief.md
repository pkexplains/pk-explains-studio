# Brief · Episode 2 · Cooking Without Waiting

- **Topic (one line from the creator):** Asynchronous I/O in PostgreSQL 18, the episode teased at the end of Episode 1:
  Mira asks for pages 43 to 50 ahead and keeps working.
- **Real-life moment for the cold open:** The evening after Episode 1. Priya is on the phone with a loan officer who
  says: "Send me your last twelve months of statements while I'm still on the call." She taps *Download statement*.
  Stake: the call, the loan, her ₹200 train ticket is line one of that statement (order #812).
- **The question the film answers:** The storeroom (disk) is just as slow as last night. So how does the same kitchen
  finish a big order sooner?
- **Viewer leaves knowing (3 bullets max):**
  1. Waiting for the disk one page at a time leaves the chef asleep and the disk mostly idle.
  2. PostgreSQL 18 lets a chef ask for many pages ahead and keep working; someone still waits, just not the chef.
  3. It helps big reads (whole-table reads, bitmap scans, vacuum) in PostgreSQL 18; tiny orders and writes still work
     the old way.
- **Characters reused:** Mira, Priya, the Manager, the Host (one line), Arjun (one gag: the cashback that never
  happened), Leela (cameo in the "another ending"), the Supervisor (cameo, writes still wait). Narrator am_michael.
- **New staff, rooms or props** (each 1:1; added to `series/bible.md` and `series/cast.json` in this change):

  | In the Kitchen | Real part | Look |
  |---|---|---|
  | **The Runners** (three of them) | I/O worker processes, `io_method = worker` (default), `io_workers = 3` | Coral, cap, a small trolley. The lead Runner is voiced (hm_omega, unused so far); the other two are silent |
  | **Order tickets** | read requests; one ticket can cover several neighbouring pages | Paper ticket, "p.43–50" |
  | **The ticket hook** by Mira's station | the backend's queue of in-flight reads (the read stream) | A brass hook, tickets hang on it |
  | **The ticket rail and pickup counter** at the Manager's hatch | io_uring submission and completion queues (`io_method = io_uring`, Linux only) | A steel rail through the Manager's office hatch; a pickup shelf under it |
  | **Storeroom hatches** | the SSD's many queues working in parallel | The storeroom wall gets eight hatches; one-at-a-time lights only one |
  | **The Loan Officer** (heard, never seen) | a person on Priya's call, not a system part | Phone EQ; voice am_adam (unused so far) |
  | **Priya's phone with a progress ring** | the client waiting for its result | Part of the HUD |

  The score bar becomes **PRIYA'S STATEMENT · PAGES READY 0/32 · CHEF: AWAKE/ASLEEP**.
- **Story assumption (stated, not asked):** Priya's year of orders sits on pages 43 to 74, right after her account on
  page 42, and Mira reads them straight through. That is a whole-table style read, the case PostgreSQL 18 speeds up.
  The Engineer's cut says plainly that a real bank would usually find her rows with an index, and that a bitmap heap
  scan gets the same read-ahead. Nobody in the story contradicts Episode 1 (balance 300 after #812, the cashback never
  happened).
- **Target length:** about 11 min story cut, about 14 min Engineer's cut (below the 12–18 min target; see script.md).
- **Not used from the raw notes:** the CPU-cache and NUMA lesson ("The Chef's Elbow") is kept for a later episode. The
  raw notes' after-lesson question (pages, heaps and B-trees) becomes the Episode 3 tease.
