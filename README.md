# pk-explains-studio

Everything needed to make a PK Explains episode: the shared film engine, the Kitchen world and cast, the
brand, the voices and music, the QA checks, the renderer and the YouTube release tools. A new episode adds
one folder under `episodes/`; nothing else changes.

Skills that drive this repo: **pk-brand**, **pk-series-bible**, **explainer-film**, **pk-sound-studio**,
**pk-render-master**, **pk-youtube-release**.

## Layout

```
studio/                    shared and locked: edit only as a series decision
  templates/film.html      page skeleton with {{INCLUDE}} / {{EPISODE}} slots
  engine/engine.js         clock, tweens, camera, safe framing, seeking, story/engineer cuts, acting
  engine/sound.js          Web Audio mix: buses, ducking, limiter, foley, score crossfades, voices
  engine/runner.js         scene runner, player UI, narration booth, script panel, poster
  world/kitchen.svg        the Kitchen set
  world/cast.js            makeChar + every recurring character and prop
  brand/brand.css, .js     PK tile, ident, watermark, end slate
  style/core-*.css         film look: grade, vignette, grain, letterbox, acting
series/
  bible.md                 world map, cast, film grammar, episode list
  continuity.md            what each episode established; lessons
  cast.json                locked voices (narrator palette + one voice per character)
  pronunciation.json       regex -> spoken form for every episode
  music/                   the score library (cues, stingers, motifs) + meta.json loop lengths
  score/compose.py         how the library was composed (re-run only to add cues)
  brand/                   avatar, banner, watermark, logo reference, brand.html (source of the images)
episodes/
  _template/               copied by tools/new_episode.py
  ep01-kitchen-that-never-forgets/   the reference episode
tools/
  new_episode.py  build.py  lines.py  voice.py  asr_check.py
  qa/brandlint.py  qa/sweep.py  qa/shapes.py  qa/darkscan.py  qa/gaps.py
  render.py  timeline.py  master.sh  short.py  deliver.py
  publish/thumbnail.py  publish/captions.py  publish/metadata.py  publish/studio.js
setup.sh                   one-time per session: ffmpeg, fluidsynth, python deps, Kokoro model
```

## Episode runbook

```
./setup.sh
python3 tools/new_episode.py 2 "Cooking Without Waiting" "Why PostgreSQL 18 stops standing in line for the disk." "Next teaser"
#   write brief.md, facts.md (sources!), script.md  -> GATE 1: creator approves the script
#   write scenes.js (+ world.js state, looks.js, hud.html, direction.json)
python3 tools/build.py episodes/ep02-... --no-media        # fast preview, no sound
python3 tools/lines.py episodes/ep02-...                   # narration + dialogue to voice
python3 tools/voice.py episodes/ep02-...                   # only changed lines re-render
python3 tools/asr_check.py episodes/ep02-...               # fix pronunciations, re-run voice.py
python3 tools/build.py episodes/ep02-...                   # full film with sound
python3 tools/qa/brandlint.py episodes/ep02-...            # must pass
python3 tools/qa/sweep.py  episodes/ep02-.../build/film.html story   # framing
python3 tools/qa/darkscan.py episodes/ep02-.../build/film.html      # no dark runs > 1 s
python3 tools/qa/gaps.py episodes/ep02-.../build/film.html          # no silent gaps
#   publish the film page as an artifact -> GATE 2: creator watches the preview
python3 tools/render.py episodes/ep02-.../build/film.html episodes/ep02-.../build/render 1920 30   # ~2.5 h, unattended
tools/master.sh episodes/ep02-...
python3 tools/timeline.py episodes/ep02-...                # ~5 min
python3 tools/publish/captions.py episodes/ep02-...
python3 tools/publish/thumbnail.py episodes/ep02-... 38 "KICKER" "Line one" "{accent} line two" "Subline"
python3 tools/short.py episodes/ep02-... 3.0 56.0 "KICKER" "Headline<br>with <span>accent</span>"
python3 tools/publish/metadata.py episodes/ep02-...        # description, tags, short text, checklist
python3 tools/deliver.py episodes/ep02-.../build/PK-Explains-...-1080p.mp4   # then the bridge steps it prints
#   creator uploads film + Short (2 clicks); Claude fills Studio with publish/studio.js -> GATE 3: publish
```

Rebuilding episode 1 from this repo reproduces the published film exactly (verified 2026-10-12).
