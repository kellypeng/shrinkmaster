# ShrinkMaster

Local-only desktop app for shrinking videos. H.265 and AV1 via bundled ffmpeg, with hardware encoders (VideoToolbox / NVENC / QSV / AMF) auto-detected.

## Install for development

```bash
npm install
./download_ffmpeg_macos.sh   # only needed once, populates ./bin
npm start
```

## Build macOS release

```bash
npm run dist:mac
# → dist/ShrinkMaster-<version>.dmg and .zip (x64 + arm64)
```

Before shipping:

1. Run `./download_ffmpeg_macos.sh` so `bin/ffmpeg` and `bin/ffprobe` are real static binaries (not Homebrew symlinks).
2. For App Store / notarized distribution, set `CSC_LINK` / `CSC_KEY_PASSWORD` env vars and `APPLE_ID` / `APPLE_APP_SPECIFIC_PASSWORD` for notarization.
3. Drop an `icon.icns` into `build/` before running `dist:mac`.

## Layout

- `main.js` — Electron main process, spawns ffmpeg, IPC handlers
- `preload.js` — safe bridge between renderer and Node
- `renderer.js` — UI logic (queue, progress, drag-drop, cancel)
- `index.html` — UI markup + styles
- `bin/` — bundled ffmpeg / ffprobe (gitignored; fetched by the script above)
- `build/entitlements.mac.plist` — hardened-runtime entitlements

See [ARCHITECTURE.md](ARCHITECTURE.md) for codec selection and dev-vs-production path resolution.
