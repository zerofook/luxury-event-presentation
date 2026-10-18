#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/sources/video"
OUT="$ROOT/public/media/video"
mkdir -p "$OUT"

encode_one() {
  local in="$1"
  local base="$2"
  ffmpeg -y -i "$in" -an \
    -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p \
    -movflags +faststart \
    "$OUT/${base}.mp4" 2>/dev/null
  ffmpeg -y -ss 0.05 -i "$in" -frames:v 1 -vf "scale=1264:-2" \
    "$OUT/${base}-poster.webp" 2>/dev/null
  ffmpeg -y -ss 0.05 -i "$in" -frames:v 1 -vf "scale=1264:-2" \
    "$OUT/${base}-poster.jpg" 2>/dev/null
  echo "✓ video $base"
}

encode_one "$SRC/grand-entrance.mp4" "grand-entrance"
encode_one "$SRC/vintage-car.mp4" "vintage-car"

# Trim car video to reduce visible pose jump at end (~3.2s)
ffmpeg -y -i "$SRC/vintage-car.mp4" -an -t 3.2 \
  -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUT/vintage-car-trimmed.mp4" 2>/dev/null
ffmpeg -y -ss 3.0 -i "$SRC/vintage-car.mp4" -frames:v 1 -vf "scale=1264:-2" \
  "$OUT/vintage-car-lastframe.jpg" 2>/dev/null

echo "Done — videos in public/media/video/"
