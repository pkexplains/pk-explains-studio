#!/usr/bin/env bash
# Master the render into the YouTube file: 1080p H.264 (CRF 16, slow), AAC 320k, -14 LUFS / -1 dBTP.
# usage: tools/master.sh episodes/epNN-slug
# needs:  episodes/<ep>/build/render/video.mkv + audio.wav   (from tools/render.py)
# writes: episodes/<ep>/build/PK-Explains-<Title>-1080p.mp4
set -euo pipefail
EP="$1"; R="$EP/build/render"
TITLE=$(python3 -c "import json,sys;print(json.load(open('$EP/episode.json'))['title'])")
SLUG=$(echo "$TITLE" | tr -cs 'A-Za-z0-9' '-' | sed 's/-$//')
OUT="$EP/build/PK-Explains-$SLUG-1080p.mp4"
# Grain is NOT added here: per-frame noise makes the file ~15x bigger and YouTube re-encodes it away.
ffmpeg -y -loglevel error -i "$R/video.mkv" -vf format=yuv420p -c:v libx264 -preset slow -crf 16 \
  -tune animation -profile:v high -level 4.2 -g 60 -an "$R/v_final.mp4"
# The film's own limiter leaves the mix near -14 LUFS; trim and true-peak limit it.
ffmpeg -y -loglevel error -i "$R/audio.wav" -af "volume=-0.6dB,alimiter=limit=0.89:level=false" \
  -c:a aac -b:a 320k -ar 48000 "$R/a_final.m4a"
ffmpeg -y -loglevel error -i "$R/v_final.mp4" -i "$R/a_final.m4a" -map 0:v -map 1:a -c copy -shortest \
  -movflags +faststart -metadata title="$TITLE — PK Explains" -metadata artist="PK Films" \
  -metadata copyright="© $(date +%Y) PK Films" "$OUT"
ffmpeg -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size -of compact "$OUT"
echo "$OUT"
