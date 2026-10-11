# Fact sheet · Episode 2 · Cooking Without Waiting

Every claim the film makes, with a primary source. No source, no claim. Checked 2026-10-12.
"ENG" = said only in the Engineer's cut.

| # | Claim as the film says it | Precise technical statement | Source |
|---|---|---|---|
| 1 | Since PostgreSQL 18, a chef can ask for many pages ahead and keep working. | PG 18 adds an asynchronous I/O subsystem that "allows backends to queue multiple read requests". | [S1] release notes E.6.3.1.3 |
| 2 | PostgreSQL 18 came out in September 2025. (ENG: 25 September 2025) | Release announcement dated 2025-09-25. | [S2] |
| 3 | It helps big reads: reading a whole table, bitmap scans, and vacuum. | "AIO operations supported in PostgreSQL 18 include sequential scans, bitmap heap scans, and vacuum." Release notes add "etc." | [S1] [S2] |
| 4 | Before, PostgreSQL mostly relied on the Manager's guess. | "PostgreSQL previously relied on operating system readahead mechanisms … operating systems lack insight into database-specific access patterns." | [S2] |
| 5 | The Manager can't read Mira's order slip; only she knows what comes next. | Same passage as #4, put in story terms. | [S2] |
| 6 | Three Runners by default do the waiting for the chefs. | `io_method` default `worker`: "execute asynchronous I/O using worker processes"; `io_workers` default 3. | [S3] |
| 7 | The Runners still ask the Manager. ("Ask me first. Always.") | With the worker method, workers perform the I/O synchronously through normal system calls on behalf of the backend. | [S4] |
| 8 | Somebody still waits for the storeroom. It just isn't the chef. | Worker method: "dispatching the IO to one of several worker processes"; the workers perform it synchronously, so the issuing backend sees asynchronous behaviour. | [S4] |
| 9 | The other way is the ticket rail at the Manager's hatch, Linux only. | `io_method = io_uring`, "requires a build with --with-liburing"; io_uring available on Linux 5.1+. | [S3] [S4] |
| 10 | With the rail, Mira clips tickets herself; nobody else has to carry them. | io_uring "dispatches all IO from within the process, lowering context switch rate / latency". | [S4] |
| 11 | ENG: two rings shared with the kernel: one for requests, one for results; results can come back in any order. | io_uring uses "two ring buffers … a submission queue and a completion queue", mmap()ed into the process; I/O "may well complete in an order different from the submission order". | [S5] |
| 12 | ENG: the rail was built by Jens Axboe and arrived in Linux in 2019. | Proposed by Jens Axboe (LWN, 15 Jan 2019); merged in Linux 5.1, released 5 May 2019. | [S5] [S6] |
| 13 | ENG: in one mode a kernel helper watches the rail, so no knock at all. | IORING_SETUP_SQPOLL: a kernel thread polls the submission queue; it sleeps after about a second idle. | [S5] |
| 14 | ENG: why the Runners are the default and not the rail: the rail has had many security problems; Google switched it off on its servers and ChromeOS. | Google (14 Jun 2023): 60% of kCTF VRP submissions exploited io_uring; disabled on ChromeOS and production Google servers, unreachable to Android apps. The film does NOT claim this is PostgreSQL's reason for the default; it says "one reason the rail isn't everywhere". | [S7] [S3] |
| 15 | One ticket can cover several neighbouring pages, carried in one box. (ENG: up to 128 kB, 16 pages, by default) | `io_combine_limit` / `io_max_combine_limit`: largest I/O size in operations that combine I/O; default 128kB; block size typically 8kB. | [S3] |
| 16 | ENG: combining neighbours already arrived in PostgreSQL 17. | PG 17: "Allow the grouping of file system reads with the new system variable io_combine_limit". | [S8] |
| 17 | ENG: how many tickets may hang at once: effective_io_concurrency, 16 by default in 18. | Default raised to 16 in PG 18 ("more accurately reflects modern hardware"); range 0–1000; vacuum uses maintenance_io_concurrency, also 16. | [S1] [S3] |
| 18 | ENG: she starts by asking one page ahead; each time she has to wait, she asks twice as far ahead; when pages are already in the fridge she eases off. | read_stream.c: distance starts at 1; doubled when a pending I/O is waited on (capped); decremented by one when no I/O is needed. | [S9] |
| 19 | ENG: older PostgreSQL could already drop hints to the Manager ("you'll want these soon") with effective_io_concurrency. | effective_io_concurrency existed in 8.4 and depended on posix_fadvise. | [S10] |
| 20 | The storeroom has many hatches; one request at a time keeps most of them idle. (ENG: NVMe allows up to 65,535 queues of 65,535 commands) | NVMe "supports 65,535 I/O queues each with 65,535 commands"; queue depth = outstanding commands. | [S11] |
| 21 | ENG: PostgreSQL's own tests showed up to three times faster reads in some cases. | "Benchmarking has demonstrated performance gains of up to 3x in certain scenarios." Hedged; never stated as typical. | [S2] |
| 22 | Writes still work the old way in PostgreSQL 18; the notebook still waits. | PG 18 AIO is used for reads; Andres Freund (30 Aug 2025): infrastructure supports writes "it's just md.c and bufmgr.c … aren't ready to use it today". pganalyze: "In Postgres 18 AIO is limited to read operations; writes remain synchronous". | [S12] [S13] |
| 23 | A tiny order (one page already in the fridge) gains nothing. | Read stream: "When no I/O is necessary, there is no benefit in looking ahead more than one block." | [S9] |
| 24 | ENG: the new view pg_aios shows tickets in flight. | "The new system view pg_aios shows the file handles being used for asynchronous I/O." | [S1] |
| 25 | ENG: the people credited: Andres Freund, Thomas Munro, Nazir Bilal Yavuz, Melanie Plageman. | Release-note credit for the AIO subsystem. | [S1] |
| 26 | ENG: `io_method = sync` keeps the old behaviour. | "sync (execute asynchronous-eligible I/O synchronously)". | [S3] |
| 27 | Callback: "If every move under a lamp took one second, one trip to the storeroom would take days." | Reused verbatim from Episode 1; no new number. | Episode 1 fact sheet (see note) |

## Corrections to the raw notes (`ep02-raw/cooking-without-waiting.txt`)

- "For decades, Postgres mostly read one page at a time": too strong. PG 17 already combined neighbouring reads
  (io_combine_limit, [S8]), and since 8.4 effective_io_concurrency sent prefetch hints to the OS ([S10]). The film says
  PostgreSQL "mostly relied on the Manager's guess" ([S2]) and puts the hints in the Engineer's cut.
- "PostgreSQL 18 (released September 2025)": exact date 25 September 2025 ([S2]).
- "Old Linux AIO only worked properly with O_DIRECT", "Spectre/Meltdown made each knock more expensive", "an SSD rated
  at 500,000 operations per second only reaches that with many requests": not used; no primary source fetched. The
  NVMe queue figures ([S11]) replace the SSD number.
- "Some container platforms disable io_uring by default": not used as stated; replaced by Google's own published
  decision ([S7]).
- Index scans: the sources list sequential scans, bitmap heap scans and vacuum; the film does not claim anything about
  plain index scans either way.

## Staging notes checked against the mechanism (bible rule 3)

- Mira does not fetch the pages herself in worker mode; a Runner does, through the Manager. The page lands on the
  **company shelf** (shared buffers), as in Episode 1. Correct: workers read into shared buffers.
- When Mira catches up with a ticket still in flight, she waits for it (one short nap). Correct: the backend waits on
  the I/O handle if it is not complete.
- The Manager may also keep a copy on his own shelf (buffered I/O, double caching from Episode 1). Correct: PG 18 still
  uses buffered I/O by default.
- With the rail, results come back out of order; Mira still uses pages in order. Correct.

## Open item

- Episode 1's `brief.md`, `facts.md` and `script.md` are not in the repository (the scaffold creates them, but the ep01
  folder has none). Callback #27 relies on Episode 1's published line. Worth committing Episode 1's fact sheet.

## Sources (for the credits)

- [S1] PostgreSQL 18 release notes — https://www.postgresql.org/docs/18/release-18.html
- [S2] "PostgreSQL 18 Released!" (2025-09-25) — https://www.postgresql.org/about/news/postgresql-18-released-3142/
- [S3] PostgreSQL 18 docs, Resource Consumption (io_method, io_workers, io_combine_limit, effective_io_concurrency) — https://www.postgresql.org/docs/18/runtime-config-resource.html
- [S4] PostgreSQL source, src/backend/storage/aio/README.md (REL_18_STABLE) — https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/storage/aio/README.md
- [S5] Jonathan Corbet, "Ringing in a new asynchronous I/O API", LWN (2019-01-15) — https://lwn.net/Articles/776703/
- [S6] Linux 5.1 (released 2019-05-05), KernelNewbies — https://kernelnewbies.org/Linux_5.1
- [S7] Google Security Blog, "Learnings from kCTF VRP's 42 Linux kernel exploits submissions" (2023-06-14) — https://security.googleblog.com/2023/06/learnings-from-kctf-vrps-42-linux.html
- [S8] PostgreSQL 17 release notes — https://www.postgresql.org/docs/17/release-17.html
- [S9] PostgreSQL source, src/backend/storage/aio/read_stream.c (REL_18_STABLE) — https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/storage/aio/read_stream.c
- [S10] PostgreSQL 8.4 docs, effective_io_concurrency — https://www.postgresql.org/docs/8.4/runtime-config-resource.html
- [S11] NVM Express FAQ, "What makes NVMe architecture so efficient?" — https://nvmexpress.org/faq-items/what-makes-nvme-architecture-so-efficient/
- [S12] Andres Freund, pgsql-hackers, 2025-08-30 — https://www.postgresql.org/message-id/uebw3wuq3iudyx7xjgfqt7icqrtk4xv22cmwjittcy4s3rsaj2%40d6sf52qwppbe
- [S13] pganalyze, "Waiting for Postgres 18: Accelerating disk reads with asynchronous I/O" — https://pganalyze.com/blog/postgres-18-async-io (secondary; corroborates S12)
