# Video Compressor Architecture & Codecs

## File Paths: Development vs Production
In `main.js`, we must dynamically resolve the path to the static `ffmpeg` and `ffprobe` binaries based on whether we are testing locally or if the app has been built by `electron-builder`.

- **Development (`app.isPackaged === false`)**:
  - Code runs directly from the source directory.
  - Path resolves simply to `__dirname/bin/ffmpeg`.

- **Production (`app.isPackaged === true`)**:
  - `electron-builder` packages the Javascript application code into a protected archive called `app.asar`.
  - We cannot execute binaries located inside an `.asar` archive.
  - Therefore, we configured `package.json` (`"extraResources"`) to copy the `bin/` folder outside the archive at build time.
  - In production, Electron exposes this external folder location via `process.resourcesPath/bin/ffmpeg`.

## Dynamic Codec Detection
We support AV1 and H.265 (HEVC), which differ dramatically based on encoding hardware. The app dynamically scans the provided static ffmpeg executable at startup (via `ffmpeg -encoders`) so we can select the best available option for the user.

### HEVC (H.265) Support
1. **`libx265`**:
   - The default, standard, open-source CPU encoder.
   - Extremely high visual quality, but slow.
   - We map the UI sliders to standard ffmpeg arguments (`-crf 28`, `-preset medium`).
2. **`hevc_videotoolbox`**:
   - Apple's hardware-accelerated encoder (MacOS).
   - detected on Mac systems; significantly faster than CPU encoding, with marginally larger file sizes.
   - *Mapping Note*: VideoToolbox ignores the `-crf` and `-preset` flags. Instead, our app interprets the CRF UI slider (0-51) and dynamically maps it to a VideoToolbox quality setting (`-q:v 1-100`).

### AV1 Support
1. **`libaom-av1`**:
   - The original, reference open-source AV1 CPU encoder.
   - Produces the absolute smallest file sizes, but is **excruciatingly slow** (e.g., `< 0.5 fps`).
   - *Mapping Note*: AV1 doesn't accept string presets like "medium". We translate the UI preset slider (0 to 8) into the `-cpu-used` integer argument required by AV1.
2. **`libsvtav1`**:
   - The significantly faster, optimized AV1 CPU encoder maintained by the SVT group.
   - If detected, the app prioritizes this over `libaom` to make AV1 encoding usable for standard users.
   - *Mapping Note*: We translate the UI preset slider dynamically to the specific SVT-AV1 preset range of 4 through 12.
