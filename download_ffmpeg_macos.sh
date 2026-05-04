#!/bin/bash
# Download static ffmpeg/ffprobe for both x86_64 and arm64, then lipo-merge
# them into universal2 fat binaries. Outputs to ./bin/{ffmpeg,ffprobe}.
#
# Sources:
#   x86_64 — https://evermeet.cx/ffmpeg/  (ffmpeg 8.1)
#   arm64  — https://www.osxexperts.net/  (ffmpeg 8.1 arm)

set -e

BIN_DIR="$(cd "$(dirname "$0")" && pwd)/bin"
TMP="/tmp/ffmpeg_dl_$$"

echo "=== Downloading static ffmpeg/ffprobe (x86_64 + arm64) ==="
mkdir -p "$BIN_DIR" "$TMP/x64" "$TMP/arm64"
cd "$TMP"

echo "Fetching x86_64 ffmpeg + ffprobe (evermeet.cx)..."
curl -fsSL -o x64/ffmpeg.zip   "https://evermeet.cx/ffmpeg/getrelease/zip"
curl -fsSL -o x64/ffprobe.zip  "https://evermeet.cx/ffmpeg/getrelease/ffprobe/zip"

echo "Fetching arm64 ffmpeg + ffprobe (osxexperts.net)..."
curl -fsSL -o arm64/ffmpeg.zip  "https://www.osxexperts.net/ffmpeg81arm.zip"
curl -fsSL -o arm64/ffprobe.zip "https://www.osxexperts.net/ffprobe81arm.zip"

echo "Extracting..."
unzip -oq x64/ffmpeg.zip   -d x64/
unzip -oq x64/ffprobe.zip  -d x64/
unzip -oq arm64/ffmpeg.zip  -d arm64/
unzip -oq arm64/ffprobe.zip -d arm64/

# Verify each side is the architecture it claims to be
echo "Verifying architectures..."
file x64/ffmpeg   | grep -q "x86_64" || { echo "ERROR: x64/ffmpeg is not x86_64"; exit 1; }
file arm64/ffmpeg | grep -q "arm64"  || { echo "ERROR: arm64/ffmpeg is not arm64"; exit 1; }

echo "Merging into universal2 fat binaries..."
lipo -create x64/ffmpeg  arm64/ffmpeg  -output "$BIN_DIR/ffmpeg"
lipo -create x64/ffprobe arm64/ffprobe -output "$BIN_DIR/ffprobe"
chmod +x "$BIN_DIR/ffmpeg" "$BIN_DIR/ffprobe"

rm -rf "$TMP"

echo ""
echo "=== Done ==="
echo "Architectures:"
lipo -info "$BIN_DIR/ffmpeg"
lipo -info "$BIN_DIR/ffprobe"
echo ""
echo "Versions:"
"$BIN_DIR/ffmpeg"  -version | head -1
"$BIN_DIR/ffprobe" -version | head -1
echo ""
ls -la "$BIN_DIR"/ffmpeg "$BIN_DIR"/ffprobe
