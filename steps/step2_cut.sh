#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

FFMPEG="./bin/ffmpeg"
FFPROBE="./bin/ffprobe"
INPUT="links_to_blur.mp4"
OUTPUT="input_1min.mp4"

echo "=== Step 2: Cut video to 1 minute ==="

# Get original duration
ORIG_DURATION=$($FFPROBE -v error -show_entries format=duration -of csv=p=0 "$INPUT")
echo "Original duration: ${ORIG_DURATION}s"

# Cut to 60 seconds (stream copy, no re-encode)
echo "Cutting to 60 seconds..."
$FFMPEG -y -i "$INPUT" -t 60 -c copy "$OUTPUT"

# Verify
NEW_DURATION=$($FFPROBE -v error -show_entries format=duration -of csv=p=0 "$OUTPUT")
echo "New duration: ${NEW_DURATION}s"

ORIG_SIZE=$(stat --printf='%s' "$INPUT")
NEW_SIZE=$(stat --printf='%s' "$OUTPUT")
echo "Original size: $((ORIG_SIZE / 1024 / 1024)) MB"
echo "Cut size:      $((NEW_SIZE / 1024 / 1024)) MB"

echo ""
echo "=== Step 2 complete ==="

# --- Git commit ---
git add -A
git commit -m "Step 2: cut video to 1 minute"
echo "Git commit created."
