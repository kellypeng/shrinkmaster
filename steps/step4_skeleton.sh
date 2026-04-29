#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"

echo "=== Step 4: Electron Skeleton ==="
echo "Launching Electron app..."
echo "(Press Ctrl+C to stop)"

npx electron .
