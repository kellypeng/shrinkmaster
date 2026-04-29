#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

FFMPEG="./bin/ffmpeg"
OUTPUT="output_h265.mp4"
ENCODE_TIME=36  # from step 3
AUTO_CLICK_DELAY=30
BUFFER=15

# Clean up any previous output
rm -f "$OUTPUT"

TOTAL_WAIT=$((AUTO_CLICK_DELAY + ENCODE_TIME + BUFFER))

echo "=== Step 6: Verify output file creation ==="
echo "Auto-click delay: ${AUTO_CLICK_DELAY}s"
echo "Expected encode time: ${ENCODE_TIME}s"
echo "Buffer: ${BUFFER}s"
echo "Total wait: ${TOTAL_WAIT}s"
echo ""

echo "Launching Electron..."
npx electron . --no-sandbox &
ELECTRON_PID=$!
echo "Electron PID: $ELECTRON_PID"

echo "Waiting ${TOTAL_WAIT}s for auto-click + encode..."
START=$(date +%s)

# Poll every 5s to show progress
for i in $(seq 5 5 $TOTAL_WAIT); do
  sleep 5
  ELAPSED=$(($(date +%s) - START))
  if [ -f "$OUTPUT" ]; then
    SIZE=$(stat --printf='%s' "$OUTPUT")
    echo "  [$ELAPSED/${TOTAL_WAIT}s] Output file found! Size: $((SIZE / 1024)) KB"
  else
    echo "  [$ELAPSED/${TOTAL_WAIT}s] Waiting... (no output file yet)"
  fi
done

echo ""
echo "=== Verification ==="
if [ -f "$OUTPUT" ]; then
  OUTPUT_SIZE=$(stat --printf='%s' "$OUTPUT")
  INPUT_SIZE=$(stat --printf='%s' input_1min.mp4)
  OUTPUT_MB=$(awk "BEGIN { printf \"%.1f\", $OUTPUT_SIZE / 1024 / 1024 }")
  INPUT_MB=$(awk "BEGIN { printf \"%.1f\", $INPUT_SIZE / 1024 / 1024 }")
  echo "✅ Output file exists: $OUTPUT"
  echo "   Input:  ${INPUT_MB} MB"
  echo "   Output: ${OUTPUT_MB} MB"
  echo "   Savings: $(awk "BEGIN { printf \"%.1f\", (1 - $OUTPUT_SIZE / $INPUT_SIZE) * 100 }")%"
else
  echo "❌ Output file NOT found: $OUTPUT"
  echo "   The encode may have needed more time, or failed."
fi

# Cleanup
echo ""
echo "Stopping Electron..."
kill $ELECTRON_PID 2>/dev/null || true
wait $ELECTRON_PID 2>/dev/null || true
echo "Electron stopped."

echo ""
echo "=== Step 6 complete ==="

# --- Git commit ---
git add -A
git commit -m "Step 6: verification script for auto-click + encode"
echo "Git commit created."
