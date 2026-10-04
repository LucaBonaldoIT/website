#!/usr/bin/env bash
# Regenerates the raster icons in public/ from the SVG sources (needs rsvg-convert and ImageMagick).
#   public/favicon.svg        rounded tile, used by browsers directly
#   scripts/assets/icon.svg   full-bleed square, used for apple-touch / Android (OS applies the mask)
set -euo pipefail
cd "$(dirname "$0")/.."

for s in 16 32; do rsvg-convert -w $s -h $s public/favicon.svg -o public/favicon-$s.png; done
rsvg-convert -w 48 -h 48 public/favicon.svg -o /tmp/favicon-48.png
magick public/favicon-16.png public/favicon-32.png /tmp/favicon-48.png public/favicon.ico
rsvg-convert -w 180 -h 180 scripts/assets/icon.svg -o public/apple-touch-icon.png
rsvg-convert -w 192 -h 192 scripts/assets/icon.svg -o public/icon-192.png
rsvg-convert -w 512 -h 512 scripts/assets/icon.svg -o public/icon-512.png
echo "==> Wrote icons to public/"
