const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

console.log('[MAIN] ============================');
console.log('[MAIN] Video Compressor starting...');
console.log('[MAIN] Process PID:', process.pid);
console.log('[MAIN] Electron version:', process.versions.electron);
console.log('[MAIN] Node version:', process.versions.node);
console.log('[MAIN] App path:', app.getAppPath());
console.log('[MAIN] ============================');

// Resolve paths dynamically based on whether the app is packaged (production) or unpacked (development)
const IS_PACKAGED = app.isPackaged;
const PROJECT_DIR = IS_PACKAGED ? process.resourcesPath : __dirname;
const FFMPEG_PATH = path.join(PROJECT_DIR, 'bin', 'ffmpeg');
const FFPROBE_PATH = path.join(PROJECT_DIR, 'bin', 'ffprobe');

console.log('[MAIN] Is packaged:', IS_PACKAGED);
console.log('[MAIN] Project dir:', PROJECT_DIR);
console.log('[MAIN] ffmpeg path:', FFMPEG_PATH);
console.log('[MAIN] ffmpeg exists:', fs.existsSync(FFMPEG_PATH));
console.log('[MAIN] ffprobe path:', FFPROBE_PATH);
console.log('[MAIN] ffprobe exists:', fs.existsSync(FFPROBE_PATH));

let mainWindow;
let currentFfmpegProc = null;
let cancelRequested = false;

function createWindow() {
  console.log('[MAIN] Creating browser window...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    console.log('[MAIN] Window closed');
    mainWindow = null;
  });

  console.log('[MAIN] Window created successfully');
}

app.whenReady().then(() => {
  console.log('[MAIN] App ready, creating window...');
  createWindow();

  // Test mode: auto-add videos from env var
  const testVideos = process.env.TEST_VIDEOS;
  const testAutoCompress = process.env.TEST_AUTO_COMPRESS;
  const testCodec = process.env.TEST_CODEC;
  const testResolution = process.env.TEST_RESOLUTION;

  if (testVideos) {
    const paths = testVideos.split(',').filter(p => p.trim());
    console.log('[MAIN][TEST] Auto-adding', paths.length, 'test videos');
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('test-add-videos', paths);
      if (testAutoCompress === '1') {
        setTimeout(() => {
          console.log('[MAIN][TEST] Triggering auto-compress');
          mainWindow.webContents.send('test-auto-compress', {
            codec: testCodec,
            resolution: testResolution
          });
        }, 3000);
      }
    });
  }
});

app.on('window-all-closed', () => {
  console.log('[MAIN] All windows closed, quitting...');
  app.quit();
});

// ========================
// IPC: Open file dialog
// ========================
ipcMain.handle('open-file-dialog', async () => {
  console.log('[MAIN][IPC] open-file-dialog called');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv', 'm4v', 'ts', 'mts'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  console.log('[MAIN][IPC] Dialog result:', JSON.stringify(result));
  if (result.canceled) return { canceled: true, filePaths: [] };
  const files = result.filePaths.map((filePath) => {
    try {
      const stat = fs.statSync(filePath);
      return { path: filePath, size: stat.size };
    } catch (err) {
      return { path: filePath, size: null };
    }
  });
  return { canceled: false, filePaths: result.filePaths, files };
});

// ========================
// IPC: Select output folder
// ========================
ipcMain.handle('select-output-folder', async () => {
  console.log('[MAIN][IPC] select-output-folder called');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
  });
  console.log('[MAIN][IPC] Folder dialog result:', JSON.stringify(result));
  if (result.canceled) return { canceled: true, folderPath: '' };
  return { canceled: false, folderPath: result.filePaths[0] };
});

// ========================
// IPC: Generate thumbnail
// ========================
ipcMain.handle('generate-thumbnail', async (event, filePath) => {
  console.log('[MAIN][IPC] generate-thumbnail called for:', filePath);
  const thumbDir = path.join(PROJECT_DIR, '.thumbnails');
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  const hash = crypto.createHash('md5').update(filePath).digest('hex');
  const thumbPath = path.join(thumbDir, `${hash}.jpg`);

  if (fs.existsSync(thumbPath)) {
    console.log('[MAIN][IPC] Thumbnail already exists:', thumbPath);
    return { success: true, thumbPath };
  }

  try {
    const { execFileSync } = require('child_process');
    execFileSync(
      FFMPEG_PATH,
      ['-y', '-i', filePath, '-ss', '2', '-vframes', '1', '-vf', 'scale=160:-1', thumbPath],
      { timeout: 15000, stdio: 'pipe' }
    );
    console.log('[MAIN][IPC] Thumbnail generated:', thumbPath);
    return { success: true, thumbPath };
  } catch (err) {
    console.error('[MAIN][IPC] Thumbnail error:', err.message);
    return { success: false, error: err.message };
  }
});

// ========================
// IPC: Get video duration via ffprobe
// ========================
ipcMain.handle('get-duration', async (event, filePath) => {
  console.log('[MAIN][IPC] get-duration called for:', filePath);
  try {
    const { execFileSync } = require('child_process');
    const output = execFileSync(
      FFPROBE_PATH,
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', filePath],
      { timeout: 30000 }
    ).toString().trim();
    const duration = parseFloat(output);
    console.log('[MAIN][IPC] Duration:', duration, 'seconds');
    return { success: true, duration };
  } catch (err) {
    console.error('[MAIN][IPC] ffprobe error:', err.message);
    return { success: false, error: err.message };
  }
});

const os = require('os');
const { exec } = require('child_process');

function testEncoder(encoder) {
  return new Promise((resolve) => {
    const { execFile } = require('child_process');
    const nullOut = process.platform === 'win32' ? 'NUL' : '/dev/null';
    execFile(
      FFMPEG_PATH,
      ['-v', 'error', '-f', 'lavfi', '-i', 'color=black:s=256x256:d=0.1', '-c:v', encoder, '-f', 'null', nullOut],
      (error) => { resolve(!error); }
    );
  });
}

function getCpuInfo() {
  const cpus = os.cpus();
  return cpus.length > 0 ? cpus[0].model : 'Unknown CPU';
}

ipcMain.handle('check-encoders', async () => {
  try {
    const { execFileSync } = require('child_process');
    const encodersOut = execFileSync(FFMPEG_PATH, ['-encoders']).toString();
    const platform = process.platform;
    const cpuModel = getCpuInfo();

    // HEVC HW Hierarchy
    const h265Candidates = [
      { id: 'hevc_videotoolbox', label: 'Apple VideoToolbox (M-Series)' },
      { id: 'hevc_nvenc', label: 'NVIDIA NVENC (GeForce RTX/GTX)' },
      { id: 'hevc_qsv', label: 'Intel Quick Sync (QSV)' },
      { id: 'hevc_amf', label: 'AMD AMF (Radeon/Ryzen)' }
    ];

    // AV1 HW Hierarchy
    const av1Candidates = [
      { id: 'av1_nvenc', label: 'NVIDIA NVENC (RTX 4000+)' },
      { id: 'av1_qsv', label: 'Intel Quick Sync (Arc/Core Ultra)' },
      { id: 'av1_amf', label: 'AMD AMF (RX 7000/Ryzen 7040+)' },
      { id: 'libsvtav1', checkId: 'libsvtav1', hw: false, label: 'SVT-AV1 (Fast CPU)' }
    ];

    let bestH265 = { id: 'libx265', label: 'Universal CPU (libx265)', hw: false };
    let bestAv1 = { id: 'libaom-av1', label: 'Universal CPU (libaom-av1) - VERY SLOW', hw: false };

    // Find best H265
    for (const c of h265Candidates) {
      if (encodersOut.includes(c.id)) {
        if (await testEncoder(c.id)) {
          bestH265 = { id: c.id, label: c.label, hw: true };
          break; // Stop at first working HW encoder!
        }
      }
    }

    // Find best AV1
    for (const c of av1Candidates) {
      const checkId = c.checkId || c.id;
      if (encodersOut.includes(checkId)) {
        if (c.hw === false) {
          bestAv1 = { id: checkId, label: c.label, hw: false };
          break; // Stop at Software SVT-AV1
        } else if (await testEncoder(c.id)) {
          bestAv1 = { id: c.id, label: c.label, hw: true };
          break; // Stop at working HW AV1
        }
      }
    }

    return { platform, cpuModel, bestH265, bestAv1 };

  } catch (err) {
    console.error('[MAIN] check-encoders error:', err.message);
    return {
      platform: process.platform, cpuModel: 'Unknown CPU',
      bestH265: { id: 'libx265', label: 'Universal CPU (libx265)', hw: false },
      bestAv1: { id: 'libaom-av1', label: 'Universal CPU', hw: false }
    };
  }
});

// ========================
// IPC: Handle compress request
// Steps 14-15: accepts resolution, crf, preset settings
// ========================
ipcMain.handle('compress', async (event, { inputPath, outputPath, settings }) => {
  const { resolution, crf, preset } = settings || {};
  console.log('[MAIN][IPC] Received compress request');
  console.log('[MAIN][IPC]   inputPath:', inputPath);
  console.log('[MAIN][IPC]   outputPath:', outputPath);
  console.log('[MAIN][IPC]   settings:', JSON.stringify(settings));

  if (!fs.existsSync(inputPath)) {
    const err = `Input file not found: ${inputPath}`;
    console.error('[MAIN][IPC] ERROR:', err);
    return { success: false, error: err };
  }

  const inputSize = fs.statSync(inputPath).size;
  console.log('[MAIN][IPC] Input file size:', inputSize, 'bytes');

  // Build ffmpeg args with resolution, crf, preset, and codec
  const codec = settings.codec || 'libx265';

  const args = [
    '-y',
    '-i', inputPath,
    '-c:a', 'copy',
    '-c:v', codec,
  ];

  if (codec.includes('hevc') || codec === 'libx265') {
    args.push('-vtag', 'hvc1');
  }

  // Step 15: Encode settings
  if (codec === 'libaom-av1') {
    args.push('-crf', String(crf !== undefined ? crf : 28));
    const presetIdx = settings.presetIndex !== undefined ? settings.presetIndex : 5;
    const cpuUsed = Math.max(0, 8 - presetIdx);
    args.push('-b:v', '0', '-cpu-used', String(cpuUsed));
  } else if (codec === 'libsvtav1') {
    args.push('-crf', String(crf !== undefined ? crf : 28));
    const presetIdx = settings.presetIndex !== undefined ? settings.presetIndex : 5;
    const svtPreset = Math.max(0, 12 - presetIdx);
    args.push('-preset', String(svtPreset));
  } else if (codec === 'hevc_videotoolbox') {
    const quality = crf !== undefined ? Math.max(1, Math.min(100, 100 - (crf * 2))) : 50;
    args.push('-q:v', String(quality));
  } else if (codec.includes('nvenc')) {
    args.push('-cq', String(crf !== undefined ? crf : 28), '-b:v', '0');
    if (preset) args.push('-preset', preset);
  } else if (codec.includes('qsv')) {
    args.push('-global_quality', String(crf !== undefined ? crf : 28));
    if (preset) args.push('-preset', preset);
  } else if (codec.includes('amf')) {
    const qp = String(crf !== undefined ? crf : 28);
    args.push('-rc', 'cqp', '-qp_i', qp, '-qp_p', qp);
  } else {
    // libx265
    args.push('-crf', String(crf !== undefined ? crf : 28));
    if (preset) args.push('-preset', preset);
  }

  // Step 14: Resolution (scale filter)
  if (resolution) {
    args.push('-vf', `scale=${resolution}`);
  }

  args.push('-progress', 'pipe:1');
  args.push(outputPath);

  console.log('[MAIN][IPC] ffmpeg args:', args.join(' '));

  return new Promise((resolve) => {
    const startTime = Date.now();
    const proc = spawn(FFMPEG_PATH, args);
    currentFfmpegProc = proc;
    cancelRequested = false;

    console.log('[MAIN][FFMPEG] Process spawned, PID:', proc.pid);

    let progressBuffer = '';

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      progressBuffer += text;
      const lines = progressBuffer.split('\n');
      progressBuffer = lines.pop() || '';

      const progressData = {};
      for (const line of lines) {
        const eqIdx = line.indexOf('=');
        if (eqIdx !== -1) {
          const key = line.substring(0, eqIdx).trim();
          const val = line.substring(eqIdx + 1).trim();
          progressData[key] = val;
        }
      }

      if (progressData.out_time_us || progressData.progress) {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('ffmpeg-progress', progressData);
        }
      }

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ffmpeg-stdout', text);
      }
    });

    proc.stderr.on('data', (data) => {
      const text = data.toString();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ffmpeg-stderr', text);
      }
    });

    proc.on('error', (err) => {
      console.error('[MAIN][FFMPEG] Process error:', err.message);
      resolve({ success: false, error: err.message });
    });

    proc.on('close', (code) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[MAIN][FFMPEG] Process exited with code ${code} after ${elapsed}s (cancelled=${cancelRequested})`);
      if (currentFfmpegProc === proc) currentFfmpegProc = null;

      if (cancelRequested) {
        try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch (e) {}
        cancelRequested = false;
        resolve({ success: false, cancelled: true, error: 'Cancelled' });
        return;
      }

      if (code === 0) {
        const outputSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
        console.log('[MAIN][FFMPEG] Output file size:', outputSize, 'bytes');
        resolve({ success: true, elapsed: parseFloat(elapsed), outputSize, inputSize });
      } else {
        resolve({ success: false, error: `ffmpeg exited with code ${code}` });
      }
    });
  });
});

// ========================
// IPC: Cancel current ffmpeg job
// ========================
ipcMain.handle('cancel-compress', async () => {
  if (!currentFfmpegProc) return { success: false, error: 'No active job' };
  console.log('[MAIN][IPC] cancel-compress — killing PID', currentFfmpegProc.pid);
  cancelRequested = true;
  try {
    currentFfmpegProc.kill('SIGTERM');
    setTimeout(() => {
      if (currentFfmpegProc && !currentFfmpegProc.killed) {
        try { currentFfmpegProc.kill('SIGKILL'); } catch (e) {}
      }
    }, 1500);
  } catch (err) {
    console.error('[MAIN][IPC] cancel error:', err.message);
    return { success: false, error: err.message };
  }
  return { success: true };
});

// ========================
// IPC: Reveal a file/folder in Finder
// ========================
const { shell } = require('electron');
ipcMain.handle('reveal-in-folder', async (event, targetPath) => {
  console.log('[MAIN][IPC] reveal-in-folder:', targetPath);
  try {
    if (!targetPath) return { success: false, error: 'empty path' };
    if (fs.existsSync(targetPath)) {
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        await shell.openPath(targetPath);
      } else {
        shell.showItemInFolder(targetPath);
      }
      return { success: true };
    }
    return { success: false, error: 'path does not exist' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

console.log('[MAIN] IPC handlers registered');
