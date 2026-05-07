<div align="center">

<img src="docs/favicon.svg" width="84" height="84" alt="ShrinkMaster logo" />

# ShrinkMaster

**A free Mac app that shrinks your videos. Drag a video in, get a smaller one back.**

[**↓ Download for Mac**](https://github.com/kellypeng/shrinkmaster/releases/latest/download/ShrinkMaster-mac-universal.dmg) · [Visit website](https://shrinkmaster.kellypeng.com) · [Follow on X](https://twitter.com/kellyyuweipeng)

</div>

---

## What it does

ShrinkMaster takes a video on your Mac and re-encodes it so it takes up much less space — usually **70-90% less** — without making it look noticeably worse.

A typical example:

> A 1.4 GB phone video → **180 MB**, looking the same. About 12 seconds of work on an M-series Mac.

That's the whole product. One window, drag a video in, get a smaller version out.

## What problem it solves

You probably ran into one of these recently:

- 📧 **Email won't send the file.** Most email providers cap attachments at 25 MB.
- 💬 **Discord, Slack, WhatsApp reject it.** "File too large."
- 🐦 **Twitter / Bluesky / your blog** trims or refuses oversized clips.
- 📱 **Your phone's 4K videos** are eating your hard drive, but they look great so you don't want to just delete them.
- 📨 **Sharing a kid's recital with grandma** but the file is 2 GB and her email won't accept it.

There are online compressors that can do this, but you have to upload your video to a stranger's server, wait, then download it back. ShrinkMaster runs **entirely on your Mac** — your videos never leave your device. No upload, no account, no waiting in a queue behind other people.

## How to install

### Step 1 — Download

[**↓ Download ShrinkMaster for Mac**](https://github.com/kellypeng/shrinkmaster/releases/latest/download/ShrinkMaster-mac-universal.dmg)

The same file works on Intel Macs and Apple Silicon (M1 / M2 / M3 / M4). Requires macOS 11 (Big Sur) or later — that's basically any Mac from 2014 onward that's been kept up to date.

### Step 2 — Install

Open the file you downloaded (`ShrinkMaster-mac-universal.dmg`). A window will pop up with the ShrinkMaster icon and an Applications folder shortcut.

**Drag the ShrinkMaster icon onto the Applications folder.** That's the install.

You can now eject the DMG (drag it to the Trash, or right-click → Eject).

### Step 3 — Open it for the first time

This is the only weird step. Apple charges developers $99/year to "verify" their apps. ShrinkMaster doesn't pay that fee, so the first time you open it, macOS shows a scary warning:

> *"ShrinkMaster cannot be opened because the developer cannot be verified."*

It's safe — you just need to open it differently the first time:

1. Open your **Applications** folder (Finder → Applications, or press `⌘ + Shift + A`)
2. **Right-click** ShrinkMaster (or hold the `Control` key and click)
3. Choose **Open**
4. Click **Open** again in the dialog

After this one time, you can open ShrinkMaster normally — just double-click it like any other app.

> **If that still doesn't work:** open the Terminal app (Applications → Utilities → Terminal) and paste this, then press Enter:
> ```
> xattr -cr /Applications/ShrinkMaster.app
> ```

## How to use

**Drag a video into the ShrinkMaster window.** Compression starts immediately.

When it finishes, you'll see a "Compression Complete" screen showing how much space you saved (e.g. *"Saved 87% Space!"*). Click **Save As...** to save the smaller version wherever you want — Desktop, your Downloads folder, anywhere.

That's the whole flow. Drop a file. Save the result.

### Useful things to know

- **Batch mode**: drag multiple videos (or a whole folder) at once. ShrinkMaster compresses them one by one and shows progress for each.
- **Cancel anytime**: hit "Cancel Processing" if you change your mind. The half-finished file is cleaned up automatically.
- **Choose your codec**: open Advanced Settings to switch between **H.265** (default — fast, plays everywhere) and **AV1** (slower but produces even smaller files).
- **Switch language**: Advanced Settings → Language. ShrinkMaster works in English and 简体中文, and follows your Mac's system language by default.
- **Your original is safe**: ShrinkMaster never deletes or overwrites the original file. The compressed version is always saved separately.

## Common questions

**Is it really free?**
Yes. Free download, free to use, free forever. The code is on GitHub under an open-source license — anyone can read it, fork it, or run their own version.

**Will the compressed video look worse?**
No. The default settings produce videos that look identical to the source for most viewers. Modern codecs (H.265 and AV1) are designed exactly for this — keeping quality high while making files much smaller.

**Does ShrinkMaster send my videos anywhere?**
No. All compression happens on your Mac. The app makes zero network requests during compression. You can verify this in Activity Monitor (or just unplug your Wi-Fi mid-compression — it keeps working).

**Why is the download so big (~300 MB)?**
ShrinkMaster bundles its own copy of ffmpeg, the actual compression engine. Bundling it means you don't have to install anything else — just drag and run. The download includes both Intel and Apple Silicon versions of ffmpeg in one file, so it works natively on every Mac.

**What kinds of videos does it accept?**
MP4, MOV, MKV, AVI, WebM, FLV, WMV, M4V, TS, MTS — basically any video format. The output is MP4 (when using H.265) or MKV (when using AV1).

**What if I don't like the result?**
Your original file is never touched. Just delete the compressed version, change settings if you want, and try again.

**Will there be a Windows version?**
Maybe later. Mac is the only supported platform for now.

**How is this different from HandBrake?**
HandBrake is more powerful but its interface has hundreds of options, which is overwhelming if you just want to make a video smaller. ShrinkMaster is the simpler version — sane defaults, drag-and-drop, no settings panel by default. If you need fine control over every encoding parameter, HandBrake is better. If you just want a smaller video, ShrinkMaster is faster.

## Made by

[Kelly Peng](https://twitter.com/kellyyuweipeng) — independent developer.

I built ShrinkMaster because I have a lot of video files over 10 GB. They won't fit in email. Uploading them anywhere takes forever. And keeping them eats through expensive hard drives. So I built it for myself, and decided to make it free for everyone else with the same problem.

If ShrinkMaster is useful to you, the kindest thing you can do:

- ⭐ **[Star this project on GitHub](https://github.com/kellypeng/shrinkmaster)** — it helps other people find it
- 🐦 **[Follow me on X (@kellyyuweipeng)](https://twitter.com/kellyyuweipeng)** — I post when I ship new tools and write about indie building
- 🐛 **[Report a bug](https://github.com/kellypeng/shrinkmaster/issues)** — I read every issue

---

<details>
<summary><strong>For developers</strong> — run, build, and contribute</summary>

### Develop locally

```bash
npm install
./download_ffmpeg_macos.sh   # populates ./bin with universal2 ffmpeg + ffprobe
npm start
```

### Build a macOS release

For a full release (build + upload + tag handling), use:

```bash
./scripts/release.sh
```

That script kills running instances, regenerates the icon, builds the DMG, and uploads with `--clobber` to the existing GitHub Release matching `package.json` version. See [`CLAUDE.md`](CLAUDE.md) for the full deploy model (which changes need a rebuild and which are web-only).

For a manual build without uploading:

```bash
./scripts/build-icon.sh        # generates build/icon.icns from build/icon.svg
./download_ffmpeg_macos.sh     # universal2 ffmpeg + ffprobe (~260 MB total)
npm run dist:mac
# → dist/ShrinkMaster-mac-universal.dmg
# → dist/ShrinkMaster-mac-universal.zip
```

The current build is unsigned (ad-hoc only). For signed and notarized distribution later, set:

- `CSC_LINK` / `CSC_KEY_PASSWORD` (Developer ID Application certificate)
- `APPLE_ID` / `APPLE_APP_SPECIFIC_PASSWORD` (for notarization)
- Flip `mac.identity` back to omitted (or your team identity) and `mac.hardenedRuntime` to `true` in `package.json`

### Project layout

- `main.js` — Electron main process, spawns ffmpeg, IPC handlers
- `preload.js` — context-bridge between renderer and main (sandboxed)
- `renderer.js` — UI logic (queue, progress, drag-drop, cancel, i18n)
- `index.html` — markup and styles for the app UI
- `bin/` — bundled ffmpeg / ffprobe universal2 binaries (gitignored; fetched by the download script)
- `build/icon.svg` → `build/icon.icns` — app icon (regenerated by `scripts/build-icon.sh`, no homebrew deps)
- `build/entitlements.mac.plist` — hardened-runtime entitlements (ready for future signing)
- `docs/index.html` — landing page (deployed to shrinkmaster.kellypeng.com via GitHub Pages)
- `integrations/` — drop-in HTML snippets for embedding ShrinkMaster on other sites

See [ARCHITECTURE.md](ARCHITECTURE.md) for codec selection details and dev-vs-production path resolution.

### Codec encoder hierarchy

ShrinkMaster auto-detects the best available encoder at startup:

- **H.265**: `hevc_videotoolbox` (Apple Silicon) → `hevc_nvenc` → `hevc_qsv` → `hevc_amf` → `libx265` (CPU fallback)
- **AV1**: `av1_nvenc` → `av1_qsv` → `av1_amf` → `libsvtav1` (CPU fallback)

### License

[MIT](LICENSE). The bundled ffmpeg binaries shipped in macOS releases are under their own licenses (LGPL / GPL) — see the note at the bottom of [LICENSE](LICENSE).

</details>
