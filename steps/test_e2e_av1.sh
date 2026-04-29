#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

echo "=== E2E Test: Step 17 (AV1 encoding) ==="
echo ""

# Clean output
rm -rf output/*

# Use just one test clip to save time since AV1 is slow
export TEST_VIDEOS="$PWD/test_videos/clip_00.mp4"
export TEST_AUTO_COMPRESS="1"
export TEST_CODEC="av1"

echo "Test videos: $TEST_VIDEOS"
echo "Test codec: $TEST_CODEC"

echo "Launching Electron..."
ELECTRON_ENABLE_LOGGING=1 npx electron . --no-sandbox 2>/tmp/e2e_av1.log &
EPID=$!
echo "PID: $EPID"

echo "Wait for 25s for AV1 test encode..."
sleep 25
kill $EPID 2>/dev/null || true
wait $EPID 2>/dev/null || true

echo "=== Output files ==="
ls -lh output/ 2>/dev/null || echo "(no output files)"
echo ""

echo "=== FFmpeg args used ==="
grep "ffmpeg args" /tmp/e2e_av1.log || echo "No args found"
echo ""

echo "=== Done ==="
