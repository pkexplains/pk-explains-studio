"""Prepare a large file for the trip to the creator's Mac through the device bridge.

The bridge refuses files over ~16 MB per file, so: split into 15 MiB parts in the session's outputs
folder, print the SHA-256 of the whole file, and print the commands to run on the Mac side.

usage: python3 tools/deliver.py FILE [OUTDIR=/mnt/user-data/outputs/deliver]

Then (Claude, with the bridge tools):
  1. device_commit_files: each part -> ~/Movies/pk_parts/<part>   (6 parts per call, <=100 MB per call)
  2. device_bash: cd "$HOME/mnt/Movies" && cat pk_parts/p_?? > "<name>" && shasum -a 256 "<name>"
  3. compare the hash with the one printed here; if equal, delete pk_parts (ask for delete permission once)
Never stage parts anywhere except the outputs folder, and never trust a re-joined file without the hash.
"""
import hashlib, os, sys

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else '/mnt/user-data/outputs/deliver'
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    if f.startswith('p_'):
        os.remove(os.path.join(out, f))
h = hashlib.sha256()
CH = 15 * 1024 * 1024
with open(src, 'rb') as f:
    i = 0
    while True:
        b = f.read(CH)
        if not b:
            break
        h.update(b)
        open(os.path.join(out, f'p_{i:02d}'), 'wb').write(b)
        i += 1
print(f'{i} parts in {out}')
print('sha256', h.hexdigest(), os.path.basename(src))
