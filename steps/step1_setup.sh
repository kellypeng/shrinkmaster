#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT_DIR="$(pwd)"
NODE="/home/villedepommes/miniconda3/envs/node/bin/node"
export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

echo "=== Step 1: Download Dependencies ==="

# --- 1a. Download ffmpeg static build ---
echo "[1/3] Downloading ffmpeg static binary..."
mkdir -p bin
if [ ! -f bin/ffmpeg ]; then
  curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz" -o /tmp/ffmpeg-static.tar.xz
  echo "  Extracting..."
  tar -xf /tmp/ffmpeg-static.tar.xz -C /tmp/
  FFMPEG_DIR=$(ls -d /tmp/ffmpeg-*-amd64-static 2>/dev/null | head -1)
  cp "$FFMPEG_DIR/ffmpeg" bin/ffmpeg
  cp "$FFMPEG_DIR/ffprobe" bin/ffprobe
  chmod +x bin/ffmpeg bin/ffprobe
  rm -rf /tmp/ffmpeg-static.tar.xz "$FFMPEG_DIR"
  echo "  ffmpeg downloaded to bin/ffmpeg"
else
  echo "  bin/ffmpeg already exists, skipping download."
fi

# Verify
echo "  ffmpeg version:"
./bin/ffmpeg -version | head -1

# --- 1b. npm init + install electron ---
echo "[2/3] Initializing npm project..."
if [ ! -f package.json ]; then
  npm init -y
fi

echo "[3/3] Installing Electron..."
npm install --save-dev electron

echo ""
echo "=== Verification ==="
echo "ffmpeg: $(./bin/ffmpeg -version 2>&1 | head -1)"
echo "ffprobe: $(./bin/ffprobe -version 2>&1 | head -1)"
echo "node: $($NODE --version)"
echo "npm: $(npm --version)"
echo "electron: $(npx electron --version 2>/dev/null || echo 'check node_modules')"
echo ""
echo "=== Step 1 complete ==="

# --- Git commit ---
git add -A
git commit -m "Step 1: setup dependencies (ffmpeg static + electron)"
echo "Git commit created."
