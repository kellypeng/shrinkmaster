# Video Compressor – Worklog

## Gotchas & Errors

### 1. `bc` not installed (Step 3)
The static server doesn't have `bc` installed. Switched percentage calc to `awk "BEGIN { ... }"` which is universally available.

### 2. Source video already HEVC (Step 2-3)
`links_to_blur.mp4` is already h.265/HEVC at high bitrate (~7730 kb/s). Re-encoding with libx265 default CRF (28) still achieved **91.9% savings** (67 MB → 5.8 MB for 1 min clip) because the original was recorded at very high quality.

### 3. npm shebang issue (Step 1)
npm uses `#!/usr/bin/env node` but `node` is not in the default PATH. Must prefix commands with `PATH="/home/villedepommes/miniconda3/envs/node/bin:$PATH"`.

### 4. `out_time_ms` is actually microseconds (Step 7)
Despite the name, `out_time_ms` in ffmpeg's `-progress pipe:1` output is actually in **microseconds**, same as `out_time_us`. Use `out_time_us` to avoid confusion.

### 5. Progress line splitting (Step 8)
The `-progress pipe:1` output can arrive in chunks that split across key=value boundaries. A buffer is needed to accumulate partial lines and split on `\n` properly. The last (potentially incomplete) line is kept in the buffer for the next `data` event.

### 6. Step 8 git commit appeared empty (Step 7-8)
Steps 7 and 8 code changes were committed together under step 7's commit because both step scripts and all source files were added with `git add -A` during step 7. This is harmless — the code is all present.

### 7. Electron `--no-sandbox` needed for headless testing
On this system, Electron requires `--no-sandbox` flag. Without it, the process may silently fail or hang.

### 8. Thumbnail hash collision (Step 11)
Initial implementation used `Buffer.from(path).toString('base64url').substring(0, 40)` for thumbnail filenames. Paths like `.../clip_00.mp4` and `.../clip_01.mp4` share the same first 40 base64 chars because they only differ late in the string. Fixed by switching to `crypto.createHash('md5')`.

### 9. ELECTRON_ENABLE_LOGGING only shows console.log to stderr (Step 9-13)
`ELECTRON_ENABLE_LOGGING=1` causes `console.log` from the renderer to appear in stderr as `[PID:...:INFO:CONSOLE:N]` lines. Useful for automated testing since we can grep for log messages.

