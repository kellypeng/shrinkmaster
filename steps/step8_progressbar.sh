#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

OUTPUT="output_h265.mp4"
ENCODE_TIME=37  # from step 6 verification
AUTO_CLICK_DELAY=30
BUFFER=15

# Clean up previous output
rm -f "$OUTPUT"

TOTAL_WAIT=$((AUTO_CLICK_DELAY + ENCODE_TIME + BUFFER))

echo "=== Step 8: Verify progress bar with full encode ==="
echo "Total wait: ${TOTAL_WAIT}s"
echo ""

echo "Launching Electron..."
npx electron . --no-sandbox &
ELECTRON_PID=$!
echo "Electron PID: $ELECTRON_PID"

echo "Waiting ${TOTAL_WAIT}s for auto-click + encode + progress bar..."
START=$(date +%s)

for i in $(seq 5 5 $TOTAL_WAIT); do
  sleep 5
  ELAPSED=$(($(date +%s) - START))
  if [ -f "$OUTPUT" ]; then
    SIZE=$(stat --printf='%s' "$OUTPUT")
    echo "  [$ELAPSED/${TOTAL_WAIT}s] Output: $((SIZE / 1024)) KB"
  else
    echo "  [$ELAPSED/${TOTAL_WAIT}s] Waiting..."
  fi
done

echo ""
echo "=== Verification ==="
if [ -f "$OUTPUT" ]; then
  OUTPUT_SIZE=$(stat --printf='%s' "$OUTPUT")
  echo "✅ Output file exists: $OUTPUT ($((OUTPUT_SIZE / 1024 / 1024)) MB)"
else
  echo "❌ Output file NOT found"
fi

# Cleanup
echo ""
echo "Stopping Electron..."
kill $ELECTRON_PID 2>/dev/null || true
wait $ELECTRON_PID 2>/dev/null || true
echo "Done."

echo ""
echo "=== Step 8 complete ==="

# --- Git commit ---
git add -A
git commit -m "Step 8: progress bar with ffmpeg -progress pipe:1"
echo "Git commit created."
