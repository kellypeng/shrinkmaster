#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

echo "=== E2E Test: Steps 9-13 with 2 test clips ==="
echo ""

# Clean output
rm -rf output/*

# We'll inject test videos via an env var that main.js will read
# to auto-add videos without needing the file dialog
export TEST_VIDEOS="/home/villedepommes/github/video_compressor/test_videos/clip_00.mp4,/home/villedepommes/github/video_compressor/test_videos/clip_01.mp4"
export TEST_AUTO_COMPRESS="1"

ENCODE_TIME_PER_VIDEO=37
TOTAL_WAIT=$((5 + 2 * ENCODE_TIME_PER_VIDEO + 20)) # 5s startup + 2*37s encode + 20s buffer

echo "Test videos: $TEST_VIDEOS"
echo "Auto-compress: enabled"
echo "Total wait: ${TOTAL_WAIT}s"
echo ""

echo "Launching Electron..."
ELECTRON_ENABLE_LOGGING=1 npx electron . --no-sandbox 2>/tmp/e2e_test.log &
EPID=$!
echo "PID: $EPID"

echo "Waiting..."
START=$(date +%s)
for i in $(seq 5 5 $TOTAL_WAIT); do
  sleep 5
  ELAPSED=$(($(date +%s) - START))
  COUNT=$(ls output/h265_*.mp4 2>/dev/null | wc -l)
  echo "  [$ELAPSED/${TOTAL_WAIT}s] Output files: $COUNT"
done

echo ""
echo "=== Results ==="
ls -lh output/ 2>/dev/null || echo "(no output files)"
echo ""

# Check stderr log for summary
echo "=== Log (last 30 lines) ==="
tail -30 /tmp/e2e_test.log
echo ""

# Check for the SUMMARY in the log
if grep -q "SUMMARY" /tmp/e2e_test.log; then
  echo "✅ Summary was printed"
  grep -A 10 "SUMMARY" /tmp/e2e_test.log
else
  echo "⚠️ No summary found in log (encode may still be running)"
fi

echo ""
kill $EPID 2>/dev/null || true
wait $EPID 2>/dev/null || true
echo "Electron stopped."
echo ""
echo "=== E2E Test complete ==="
