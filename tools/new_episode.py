"""Start a new episode folder from episodes/_template.

usage: python3 tools/new_episode.py NUMBER "Title" "One-line logline" ["Next episode teaser"]
example: python3 tools/new_episode.py 2 "Cooking Without Waiting" "Why PostgreSQL 18 stops standing in line for the disk."

Creates episodes/epNN-<slug>/ with brief.md, facts.md, script.md, scenes.js, world.js, looks.js, hud.html,
direction.json, release.json and episode.json filled in. Next: write brief.md and facts.md, then script.md
(Gate 1), then scenes.js, then: tools/build.py --no-media -> tools/lines.py -> tools/voice.py -> tools/build.py.
"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
num, title, logline = int(sys.argv[1]), sys.argv[2], sys.argv[3]
nxt = sys.argv[4] if len(sys.argv) > 4 else ''
slug = f'ep{num:02d}-' + re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
dst = os.path.join(ROOT, 'episodes', slug)
if os.path.exists(dst):
    sys.exit(f'{dst} already exists')
shutil.copytree(os.path.join(ROOT, 'episodes', '_template'), dst)
e = json.load(open(os.path.join(dst, 'episode.json')))
e.update(number=num, slug=slug, title=title, logline=logline, next=nxt,
         lede=f'A short animated film from PK Explains. {logline} Story cut for everyone; switch on Engineer\'s cut for every technical detail.')
json.dump(e, open(os.path.join(dst, 'episode.json'), 'w'), ensure_ascii=False, indent=1)
print(dst)
