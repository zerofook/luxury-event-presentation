#!/usr/bin/env bash
# Extract scroll-scrub test sequence from entrance clip (12 fps) for ScrubSequence dev route.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IN="$ROOT/sources/video/grand-entrance.mp4"
OUT_D="$ROOT/public/media/frames/entrance-test-desktop"
OUT_M="$ROOT/public/media/frames/entrance-test-mobile"
mkdir -p "$OUT_D" "$OUT_M"

ffmpeg -y -i "$IN" -an -vf "fps=12,scale=1280:-2:flags=lanczos" \
  -c:v libwebp -quality 75 -compression_level 6 \
  "$OUT_D/f%03d.webp" 2>/dev/null

ffmpeg -y -i "$IN" -an -vf "fps=12,scale=720:-2:flags=lanczos" \
  -c:v libwebp -quality 72 -compression_level 6 \
  "$OUT_M/m%03d.webp" 2>/dev/null

COUNT=$(ls -1 "$OUT_D"/f*.webp 2>/dev/null | wc -l)
echo "{\"desktopPattern\":\"/media/frames/entrance-test-desktop/f%03d.webp\",\"mobilePattern\":\"/media/frames/entrance-test-mobile/m%03d.webp\",\"frameCount\":$COUNT}" \
  > "$ROOT/public/media/frames/entrance-test-meta.json"
echo "✓ $COUNT frames (entrance test sequence)"
