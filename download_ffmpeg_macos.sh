#!/bin/bash
set -e

BIN_DIR="$(cd "$(dirname "$0")" && pwd)/bin"
TEMP_DIR="/tmp/ffmpeg_download_$$"

echo "=== Downloading static ffmpeg/ffprobe into $BIN_DIR ==="
mkdir -p "$BIN_DIR"
mkdir -p "$TEMP_DIR"

cd "$TEMP_DIR"
echo "Fetching ffmpeg..."
curl -L -o ffmpeg.zip "https://evermeet.cx/ffmpeg/getrelease/zip"
echo "Fetching ffprobe..."
curl -L -o ffprobe.zip "https://evermeet.cx/ffmpeg/getrelease/ffprobe/zip"

unzip -o ffmpeg.zip -d "$BIN_DIR"
unzip -o ffprobe.zip -d "$BIN_DIR"

chmod +x "$BIN_DIR/ffmpeg" "$BIN_DIR/ffprobe"
rm -rf "$TEMP_DIR"

echo ""
echo "=== Done ==="
"$BIN_DIR/ffmpeg"  -version | head -1
"$BIN_DIR/ffprobe" -version | head -1
ls -la "$BIN_DIR"
