#!/usr/bin/env bash
# Rebuild + re-upload the macOS .dmg to the existing GitHub release.
#
# Run this whenever ANY change touches something that lives inside the
# .app — icon, ffmpeg binary, main.js / preload.js / renderer.js / index.html,
# entitlements, or package.json fields like version / mac.* / extraResources.
#
# Web-only changes (docs/, README.md, integrations/) do NOT need this.
# Just `git push` for those.

set -euo pipefail
cd "$(dirname "$0")/.."

# Read version from package.json (no jq dependency)
VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

echo "=== ShrinkMaster release ${TAG} ==="

# 1. Make sure no instance is holding files open
echo "→ stopping any running ShrinkMaster / Electron instances..."
pkill -f "ShrinkMaster.app/Contents/MacOS\|node_modules/electron/dist/Electron.app" 2>/dev/null || true
sleep 1

# 2. Verify the release exists. If not, abort with a hint.
if ! gh release view "${TAG}" >/dev/null 2>&1; then
  cat <<EOM
ERROR: GitHub release ${TAG} doesn't exist yet.

If you just bumped the version in package.json, create the release first:

  git tag ${TAG} -m "ShrinkMaster ${TAG}"
  git push origin ${TAG}
  gh release create ${TAG} --title "ShrinkMaster ${TAG}" --notes "..."

Then re-run this script.
EOM
  exit 1
fi

# 3. Verify ffmpeg binaries are present (these are gitignored, fetched on demand)
if [[ ! -f bin/ffmpeg || ! -f bin/ffprobe ]]; then
  echo "ERROR: bin/ffmpeg or bin/ffprobe missing."
  echo "Run ./download_ffmpeg_macos.sh first to fetch them."
  exit 1
fi

# 4. Regenerate icon (fast, idempotent — ensures icon.icns matches icon.svg)
echo "→ rebuilding icon from build/icon.svg..."
./scripts/build-icon.sh

# 5. Clean and build the universal DMG
echo "→ cleaning dist/ and rebuilding..."
rm -rf dist
npm run dist:mac

# 6. Sanity check the build output
if [[ ! -f dist/ShrinkMaster-mac-universal.dmg ]]; then
  echo "ERROR: build did not produce dist/ShrinkMaster-mac-universal.dmg"
  echo "       Check the build log above for what went wrong."
  exit 1
fi

# 7. Generate version-named copies for backward compat (anyone who saved
#    the old URL pattern still gets a valid file)
echo "→ creating version-named copies..."
cp dist/ShrinkMaster-mac-universal.dmg "dist/ShrinkMaster-${VERSION}-universal.dmg"
cp dist/ShrinkMaster-mac-universal.zip "dist/ShrinkMaster-${VERSION}-universal-mac.zip"

# 8. Upload to release with --clobber so the new build replaces the old
echo "→ uploading assets to release ${TAG}..."
gh release upload "${TAG}" --clobber \
  dist/ShrinkMaster-mac-universal.dmg \
  dist/ShrinkMaster-mac-universal.zip \
  "dist/ShrinkMaster-${VERSION}-universal.dmg" \
  "dist/ShrinkMaster-${VERSION}-universal-mac.zip" \
  dist/latest-mac.yml

cat <<EOM

✓ Release ${TAG} updated.

  Download (stable URL, this is what the landing page uses):
    https://github.com/kellypeng/shrinkmaster/releases/latest/download/ShrinkMaster-mac-universal.dmg

  Release page:
    https://github.com/kellypeng/shrinkmaster/releases/tag/${TAG}

  Reminder: macOS / Finder may cache the OLD app icon for users who
  downloaded a previous version. If they see stale icons after re-installing,
  they can run:
    sudo rm -rfv /Library/Caches/com.apple.iconservices.store; killall Dock
EOM
