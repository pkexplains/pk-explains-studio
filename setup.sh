#!/usr/bin/env bash
# One-time setup of a fresh session (Linux container). Idempotent; ~5 minutes.
set -euo pipefail
cd "$(dirname "$0")"
command -v ffmpeg >/dev/null || (apt-get update -qq && apt-get install -y -qq ffmpeg)
command -v fluidsynth >/dev/null || (apt-get update -qq && apt-get install -y -qq fluidsynth fluid-soundfont-gm)
pip install -q --break-system-packages playwright kokoro-onnx soundfile numpy pillow pretty_midi faster-whisper
# Chromium: use the preinstalled one if PLAYWRIGHT_BROWSERS_PATH is set, else install
[ -n "${PLAYWRIGHT_BROWSERS_PATH:-}" ] || python3 -m playwright install chromium
# Kokoro TTS model (~340 MB, not in git)
mkdir -p models/kokoro
B=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -f models/kokoro/kokoro-v1.0.onnx ] || curl -sSL -o models/kokoro/kokoro-v1.0.onnx $B/kokoro-v1.0.onnx
[ -f models/kokoro/voices-v1.0.bin ] || curl -sSL -o models/kokoro/voices-v1.0.bin $B/voices-v1.0.bin
chmod +x tools/master.sh
echo "setup done"
