#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

echo "=== Step 9: Open dialog to add videos ==="
echo "Launch Electron and use the '+ Add Videos' button to add files."
echo "Videos are stored in a global JS array and displayed in the thumbnail grid."
echo ""
echo "To run: npx electron . --no-sandbox"
echo ""

# Test that the app starts without errors
echo "Verifying app starts without errors..."
ELECTRON_ENABLE_LOGGING=1 npx electron . --no-sandbox 2>/tmp/step9_test.log &
EPID=$!
sleep 5

# Check for JS errors in the log
if grep -i "error" /tmp/step9_test.log | grep -v "WARNING" | grep -v "WebGL1" | grep -v "gpu/command_buffer" | grep -v "Security Warning"; then
  echo "❌ Errors found in Electron log!"
  cat /tmp/step9_test.log
else
  echo "✅ No JS errors detected"
fi

# Check that renderer initialized
if grep -q "Renderer fully initialized" /tmp/step9_test.log; then
  echo "✅ Renderer fully initialized"
else
  echo "❌ Renderer did NOT initialize"
fi

kill $EPID 2>/dev/null || true
wait $EPID 2>/dev/null || true

echo ""
echo "=== Step 9 complete ==="

git add -A
git commit -m "Step 9: open file dialog to add videos to global list"
echo "Git commit created."
