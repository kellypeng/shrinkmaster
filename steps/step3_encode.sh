#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

FFMPEG="./bin/ffmpeg"
INPUT="input_1min.mp4"
OUTPUT="h265_input_1min.mp4"

echo "=== Step 3: H.265 re-encode + timing ==="
echo "Input: $INPUT"

# Time the encode
echo "Starting h.265 encode..."
START_TIME=$(date +%s)

$FFMPEG -y -i "$INPUT" -c:a copy -c:v libx265 -vtag hvc1 "$OUTPUT"

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

echo ""
echo "=== Timing ==="
echo "Encode took: ${MINUTES}m ${SECONDS}s (${ELAPSED}s total)"

# --- Step 3a: file size comparison ---
echo ""
echo "=== Step 3a: File size comparison ==="
INPUT_SIZE=$(stat --printf='%s' "$INPUT")
OUTPUT_SIZE=$(stat --printf='%s' "$OUTPUT")
INPUT_MB=$((INPUT_SIZE / 1024 / 1024))
OUTPUT_MB=$((OUTPUT_SIZE / 1024 / 1024))
SAVINGS_PCT=$(awk "BEGIN { printf \"%.1f\", (1 - $OUTPUT_SIZE / $INPUT_SIZE) * 100 }")

echo "Input:   ${INPUT_MB} MB ($INPUT_SIZE bytes)"
echo "Output:  ${OUTPUT_MB} MB ($OUTPUT_SIZE bytes)"
echo "Savings: ${SAVINGS_PCT}%"

if [ "$OUTPUT_SIZE" -lt "$INPUT_SIZE" ]; then
  echo "✅ Output is smaller than input!"
else
  echo "⚠️  Output is NOT smaller — this may happen if the source is already highly compressed."
fi

# Save timing for later steps
echo "$ELAPSED" > .encode_time
echo "Saved encode time (${ELAPSED}s) to .encode_time"

echo ""
echo "=== Step 3 complete ==="

# --- Git commit ---
git add -A
git commit -m "Step 3: h265 encode + size comparison (${ELAPSED}s, ${SAVINGS_PCT}% savings)"
echo "Git commit created."
