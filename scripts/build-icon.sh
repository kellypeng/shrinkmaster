#!/bin/bash
# Generate build/icon.icns from build/icon.svg using only macOS built-in tools.
# No homebrew dependencies — sips on macOS Sonoma+ renders SVG natively.

set -e
cd "$(dirname "$0")/.."

SVG=build/icon.svg
ICONSET=build/icon.iconset
OUT=build/icon.icns

if [ ! -f "$SVG" ]; then
  echo "ERROR: $SVG not found"
  exit 1
fi

rm -rf "$ICONSET"
mkdir -p "$ICONSET"

# Render SVG → 1024×1024 master PNG
echo "Rendering $SVG → 1024x1024 master..."
sips -s format png -Z 1024 "$SVG" --out "$ICONSET/icon_512x512@2x.png" >/dev/null

# Generate every size required by macOS iconset spec
for size in 16 32 64 128 256 512; do
  sips -z $size $size "$ICONSET/icon_512x512@2x.png" \
    --out "$ICONSET/icon_${size}x${size}.png" >/dev/null
  doubled=$((size*2))
  sips -z $doubled $doubled "$ICONSET/icon_512x512@2x.png" \
    --out "$ICONSET/icon_${size}x${size}@2x.png" >/dev/null
done
sips -z 1024 1024 "$ICONSET/icon_512x512@2x.png" \
  --out "$ICONSET/icon_1024x1024.png" >/dev/null

# Pack into .icns
iconutil -c icns "$ICONSET" -o "$OUT"

echo ""
echo "✓ $OUT generated ($(du -h "$OUT" | cut -f1))"
echo "  Preview: qlmanage -p $OUT"
