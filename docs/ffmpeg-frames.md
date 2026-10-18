# Corridor frame sequence (production)

When a corridor flythrough MP4 is delivered:

```bash
# Desktop — 12 fps, 1280px wide WebP
ffmpeg -i corridor.mp4 -an -vf "fps=12,scale=1280:-2:flags=lanczos" \
  -c:v libwebp -quality 75 -compression_level 6 public/media/frames/corridor/d%03d.webp

# Mobile — 720px wide
ffmpeg -i corridor.mp4 -an -vf "fps=12,scale=720:-2:flags=lanczos" \
  -c:v libwebp -quality 72 -compression_level 6 public/media/frames/corridor/m%03d.webp

# Optional AVIF pass (per frame)
node scripts/webp-to-avif.mjs public/media/frames/corridor/
```

Wire in `src/content/site.bg.ts` on the scrub scene: `framePattern`, `frameCount`, and render via `ScrubSequence`.

Test sequence: `npm run assets:frames` (entrance clip, dev-only `?scrubTest=1`).
