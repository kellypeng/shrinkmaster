#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

echo "=== Step 7: ffmpeg progress reporting research ==="
echo ""
echo "Key findings:"
echo "  1. Use '-progress pipe:1' flag to get structured key=value progress on stdout"
echo "  2. Each progress block contains:"
echo "     - out_time_us: current encoded time in microseconds"
echo "     - out_time_ms: same in milliseconds (but actually microseconds!)"
echo "     - out_time: human readable HH:MM:SS.microseconds"
echo "     - speed: encoding speed (e.g., 1.6x)"
echo "     - fps: frames per second"
echo "     - progress: 'continue' during encode, 'end' when done"
echo "  3. Use ffprobe to get total duration upfront:"
echo "     ffprobe -v error -show_entries format=duration -of csv=p=0 <file>"
echo "  4. Progress percentage = out_time_us / (total_duration * 1000000) * 100"
echo ""
echo "Example output from '-progress pipe:1':"
./bin/ffmpeg -y -i input_1min.mp4 -c:a copy -c:v libx265 -vtag hvc1 -progress pipe:1 -t 2 /tmp/step7_test.mp4 2>/dev/null | head -30
rm -f /tmp/step7_test.mp4

echo ""
echo "=== Step 7 complete ==="

# --- Git commit ---
git add -A
git commit -m "Step 7: ffmpeg progress reporting research + implementation"
echo "Git commit created."
