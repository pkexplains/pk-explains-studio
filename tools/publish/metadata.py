"""Build every YouTube text field for an episode from one file, episodes/<ep>/release.json.

usage: python3 tools/publish/metadata.py episodes/epNN-slug
reads   release.json (written per episode, see the template), release/chapters.txt, series/cast.json
writes  release/description.txt, release/short.txt, release/tags.txt, release/translations.json, release/checklist.md

release.json fields:
  title            "Real moment + question | How X works"  (<= 100 chars; formula locked by pk-brand)
  hook             2-3 sentences: the real moment and the question
  about            2-3 sentences: what the film follows, the world framing, what the viewer will know
  whos_who         [["Mira, the chef", "a PostgreSQL backend process"], ...]   (only characters in this episode)
  hashtags         three, e.g. ["PostgreSQL","OperatingSystems","Databases"]
  tags             <= 500 chars total
  short            {"title": "... #shorts", "start": 3.0, "end": 56.5, "kicker": "...", "headline": "..."}
  pinned_comment   one question that sends viewers to a timestamp
  translations     {"hi": {"title": "...", "description": "..."}, ...}  same 8 languages every episode:
                   hi, es, pt-BR, id, fr, de, ja, ar. Each translated description keeps the chapter
                   timestamps (translated names) and ends with "A PK Films Production."
"""
import json, os, sys

LANGS = ['hi', 'es', 'pt-BR', 'id', 'fr', 'de', 'ja', 'ar']
LANG_NAMES = {'hi': 'Hindi', 'es': 'Spanish', 'pt-BR': 'Portuguese (Brazil)', 'id': 'Indonesian', 'fr': 'French',
              'de': 'German', 'ja': 'Japanese', 'ar': 'Arabic'}


def main(ep):
    r = json.load(open(os.path.join(ep, 'release.json')))
    e = json.load(open(os.path.join(ep, 'episode.json')))
    rel = os.path.join(ep, 'release')
    chapters = open(os.path.join(rel, 'chapters.txt')).read().strip()
    assert len(r['title']) <= 100, 'title over 100 characters'
    who = '\n'.join(f'{a}: {b}' for a, b in r['whos_who'])
    nxt = f"\n\nNext episode: {e['next']}." if e.get('next') else ''
    desc = (f"{r['hook']}\n\n{r['about']}\n\nChapters\n{chapters}\n\nWho's who\n{who}{nxt}\n\n"
            f"A PK Films Production. © {e.get('year', 2026)} PK Films\n\n" + ' '.join('#' + h for h in r['hashtags']))
    assert len(desc) <= 5000, 'description over 5000 characters'
    open(os.path.join(rel, 'description.txt'), 'w').write(desc)
    tags = ', '.join(r['tags'])
    assert len(tags) <= 500, 'tags over 500 characters'
    open(os.path.join(rel, 'tags.txt'), 'w').write(tags)
    s = r['short']
    vid = e.get('youtube', {}).get('video_id', 'VIDEO_ID')
    open(os.path.join(rel, 'short.txt'), 'w').write(
        f"{s['title']}\n\n{r['hook']}\n\nThe full film: https://youtu.be/{vid}\n\nA PK Films Production.\n\n#shorts " +
        ' '.join('#' + h for h in r['hashtags'][:2]))
    missing = [l for l in LANGS if l not in r.get('translations', {})]
    json.dump(r.get('translations', {}), open(os.path.join(rel, 'translations.json'), 'w'), ensure_ascii=False, indent=1)
    checklist = f"""# Release checklist: {e['title']}

- [ ] Film uploaded; Studio checks complete; SD/HD processed
- [ ] Title: {r['title']}
- [ ] Description from release/description.txt (chapters start at 0:00, 3+ chapters, each >= 10 s)
- [ ] Thumbnail release/thumbnail.jpg
- [ ] Captions release/captions-en.srt (With timing) published
- [ ] Translations: {', '.join(LANG_NAMES[l] for l in LANGS)}{'  MISSING: ' + ', '.join(missing) if missing else ''}
- [ ] Tags from release/tags.txt; category Education; language English; not made for kids; no paid promotion
- [ ] AI use: "No" unless a real person, real event, realistic scene or AI music as the main focus (ask the creator if unsure)
- [ ] Playlist: PK Explains: How Things Really Work
- [ ] End screen: 1 video + 1 subscribe template
- [ ] Short uploaded with release/short.txt; related video = the film (needs advanced features)
- [ ] Creator says publish (Gate 3) -> Public; pinned comment: {r['pinned_comment']}
- [ ] Episode folder episode.json updated with video_id and short_id; series/continuity.md updated
"""
    open(os.path.join(rel, 'checklist.md'), 'w').write(checklist)
    print('description', len(desc), 'chars; tags', len(tags), 'chars; translations missing:', missing or 'none')


main(sys.argv[1])
