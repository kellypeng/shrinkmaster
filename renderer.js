// renderer.js - ShrinkMaster desktop flow
console.log('[RENDERER] renderer.js loaded');

// ========================
// DOM elements
// ========================
const addVideosBtn = document.getElementById('addVideosBtn');
const brandHomeBtn = document.getElementById('brandHomeBtn');
const advancedToggleBtn = document.getElementById('advancedToggleBtn');

const homeScreen = document.getElementById('homeScreen');
const singleScreen = document.getElementById('singleScreen');
const batchScreen = document.getElementById('batchScreen');
const singleResultScreen = document.getElementById('singleResultScreen');
const batchResultScreen = document.getElementById('batchResultScreen');

const uploadSurface = document.getElementById('uploadSurface');
const addMoreFilesBtn = document.getElementById('addMoreFilesBtn');
const cancelAllBtn = document.getElementById('cancelAllBtn');
const singleCancelBtn = document.getElementById('singleCancelBtn');

const singleProgressRing = document.getElementById('singleProgressRing');
const singlePercent = document.getElementById('singlePercent');
const singleFileName = document.getElementById('singleFileName');
const singleResultSavedLabel = document.getElementById('singleResultSavedLabel');
const singleResultOriginalSize = document.getElementById('singleResultOriginalSize');
const singleResultCompressedSize = document.getElementById('singleResultCompressedSize');
const singleResultSavedText = document.getElementById('singleResultSavedText');
const saveToFolderBtn = document.getElementById('saveToFolderBtn');
const singleCompressAnotherBtn = document.getElementById('singleCompressAnotherBtn');

const batchQueueList = document.getElementById('batchQueueList');
const batchQueueCount = document.getElementById('batchQueueCount');
const batchResultCount = document.getElementById('batchResultCount');
const batchResultSavedLabel = document.getElementById('batchResultSavedLabel');
const batchResultList = document.getElementById('batchResultList');
const batchResultMoreFiles = document.getElementById('batchResultMoreFiles');
const batchDownloadBtn = document.getElementById('batchDownloadBtn');

const panelOverlay = document.getElementById('panelOverlay');
const advancedPanel = document.getElementById('advancedPanel');
const advancedCloseBtn = document.getElementById('advancedCloseBtn');

const outputFolderEl = document.getElementById('outputFolder');
const browseOutputBtn = document.getElementById('browseOutputBtn');
const compressBtn = document.getElementById('compressBtn');
const statusEl = document.getElementById('status');
const logPanel = document.getElementById('logPanel');

const codecSelect = document.getElementById('codecSelect');
const encoderNotices = document.getElementById('encoderNotices');
const resolutionSelect = document.getElementById('resolutionSelect');
const crfSlider = document.getElementById('crfSlider');
const crfValueEl = document.getElementById('crfValue');
const presetSlider = document.getElementById('presetSlider');
const presetValueEl = document.getElementById('presetValue');

// ========================
// State
// ========================
const PRESET_NAMES = ['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'];
const MAX_LOG_LINES = 5000;
const RING_RADIUS = 100;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

let videoList = []; // {path, filename, status, progress, detail, inputSize, outputSize}
let isCompressing = false;
let cancelAllRequested = false;
let currentDurationUs = 0;
let currentVideoIndex = -1;
let appMode = 'home';

let hardwareInfo = null;

const FALLBACK_HARDWARE = {
  cpuModel: 'Unknown CPU',
  bestH265: { id: 'libx265', label: 'Universal CPU (libx265)', hw: false },
  bestAv1: { id: 'libsvtav1', label: 'SVT-AV1 (CPU)', hw: false },
};

singleProgressRing.style.strokeDasharray = String(RING_CIRCUMFERENCE);
singleProgressRing.style.strokeDashoffset = String(RING_CIRCUMFERENCE);

// ========================
// Helpers
// ========================
function logMessage(text, className = 'log-info') {
  const line = document.createElement('div');
  line.className = className;
  line.textContent = text;
  logPanel.appendChild(line);
  while (logPanel.childElementCount > MAX_LOG_LINES) {
    logPanel.removeChild(logPanel.firstChild);
  }
  logPanel.scrollTop = logPanel.scrollHeight;
}

function basename(filePath) {
  return filePath.split('/').pop().split('\\').pop();
}

function dirname(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const idx = normalized.lastIndexOf('/');
  if (idx <= 0) return '.';
  return normalized.slice(0, idx);
}

function splitName(fileName) {
  const idx = fileName.lastIndexOf('.');
  if (idx <= 0) return { base: fileName, ext: '' };
  return { base: fileName.slice(0, idx), ext: fileName.slice(idx) };
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '--';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  const precision = value >= 100 ? 0 : (value >= 10 ? 1 : 2);
  return `${value.toFixed(precision)} ${units[idx]}`;
}

function bytesToGb(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2);
}

function getSavingMetrics(inputSize, outputSize) {
  const inBytes = Number.isFinite(inputSize) && inputSize > 0 ? inputSize : 0;
  const outBytes = Number.isFinite(outputSize) && outputSize >= 0 ? outputSize : 0;
  const saved = Math.max(0, inBytes - outBytes);
  const pct = inBytes > 0 ? Math.round((saved / inBytes) * 100) : 0;
  return { savedBytes: saved, pct };
}

function setMode(mode) {
  appMode = mode;
  homeScreen.classList.toggle('hidden', mode !== 'home');
  singleScreen.classList.toggle('hidden', mode !== 'single');
  batchScreen.classList.toggle('hidden', mode !== 'batch');
  singleResultScreen.classList.toggle('hidden', mode !== 'single_result');
  batchResultScreen.classList.toggle('hidden', mode !== 'batch_result');
}

function setSingleProgress(percent) {
  const safe = Math.max(0, Math.min(100, percent));
  singlePercent.textContent = `${Math.round(safe)}%`;
  const offset = RING_CIRCUMFERENCE * (1 - safe / 100);
  singleProgressRing.style.strokeDashoffset = String(offset);
}

function getHardwareInfo() {
  return hardwareInfo || FALLBACK_HARDWARE;
}

async function ensureHardwareInfo() {
  if (hardwareInfo) return;
  try {
    hardwareInfo = await window.electronAPI.checkEncoders();
  } catch (err) {
    console.error('[RENDERER] checkEncoders failed:', err.message);
    hardwareInfo = FALLBACK_HARDWARE;
  }
  updateEncoderNotice();
}

function updateEncoderNotice() {
  const hw = getHardwareInfo();
  const codecMode = codecSelect.value;

  let line2 = '';
  if (codecMode === 'h265') {
    const best = hw.bestH265;
    line2 = best.hw ? `[OK] HW Accelerated: ${best.label}` : `[INFO] ${best.label}`;
  } else {
    const best = hw.bestAv1;
    line2 = best.hw ? `[OK] HW Accelerated: ${best.label}` : `[INFO] ${best.label}`;
  }

  encoderNotices.innerHTML = `<div>Detected CPU: ${hw.cpuModel}</div><div>${line2}</div>`;
}

function openAdvancedPanel() {
  panelOverlay.classList.add('open');
  advancedPanel.classList.add('open');
  advancedPanel.setAttribute('aria-hidden', 'false');
}

function closeAdvancedPanel() {
  panelOverlay.classList.remove('open');
  advancedPanel.classList.remove('open');
  advancedPanel.setAttribute('aria-hidden', 'true');
}

function resetSingleScreen() {
  setSingleProgress(0);
  singleFileName.textContent = 'No file selected';
}

function renderSingleResult(item) {
  const inputSize = item.inputSize || 0;
  const outputSize = item.outputSize || 0;
  const metrics = getSavingMetrics(inputSize, outputSize);

  singleResultOriginalSize.textContent = formatBytes(inputSize);
  singleResultCompressedSize.textContent = formatBytes(outputSize);
  singleResultSavedText.textContent = `-${formatBytes(metrics.savedBytes)}`;
  singleResultSavedLabel.textContent = `Saved ${metrics.pct}% Space!`;
}

function renderBatchResult() {
  const completed = videoList.filter((v) => v.status === 'done');
  const failed = videoList.filter((v) => v.status === 'failed');
  const total = videoList.length;
  const inputTotal = completed.reduce((sum, v) => sum + (v.inputSize || 0), 0);
  const outputTotal = completed.reduce((sum, v) => sum + (v.outputSize || 0), 0);
  const metrics = getSavingMetrics(inputTotal, outputTotal);

  batchResultCount.textContent = `Your ${total} file${total === 1 ? '' : 's'} are ready and optimized for sharing.`;
  batchResultSavedLabel.textContent = `Total Saved: ${formatBytes(metrics.savedBytes)} (${metrics.pct}%)`;

  batchResultList.innerHTML = '';
  const resultSource = completed.length > 0 ? completed : failed;
  const rows = resultSource.slice(0, 3);

  for (const file of rows) {
    const row = document.createElement('div');
    row.className = 'batch-result-row';

    const rowMetrics = getSavingMetrics(file.inputSize || 0, file.outputSize || 0);
    const pctText = file.status === 'failed' ? 'FAILED' : `-${rowMetrics.pct}%`;
    const pctColor = file.status === 'failed' ? '#dc2626' : '#16a34a';

    row.innerHTML = `
      <div class="batch-result-meta">
        <div class="batch-result-name" title="${file.filename}">${file.filename}</div>
        <div class="batch-result-detail">${formatBytes(file.inputSize || 0)} -> ${formatBytes(file.outputSize || 0)}</div>
      </div>
      <div class="batch-result-pct" style="color:${pctColor}">${pctText}</div>
    `;

    batchResultList.appendChild(row);
  }

  const moreCount = Math.max(0, resultSource.length - rows.length);
  batchResultMoreFiles.classList.toggle('hidden', moreCount === 0);
  if (moreCount > 0) {
    batchResultMoreFiles.textContent = `+ ${moreCount} more file${moreCount === 1 ? '' : 's'}`;
  }
}

function renderBatchQueue() {
  batchQueueList.innerHTML = '';
  const count = videoList.length;
  batchQueueCount.textContent = `${count} ${count === 1 ? 'File' : 'Files'}`;

  if (count === 0) {
    const empty = document.createElement('div');
    empty.className = 'queue-row';
    empty.innerHTML = `
      <div class="queue-top">
        <div class="queue-name">No files selected</div>
        <div class="queue-status">Idle</div>
      </div>
      <div class="queue-meta">Add files to begin batch compression.</div>
      <div class="queue-bar"><div class="queue-fill" style="width:0%"></div></div>
    `;
    batchQueueList.appendChild(empty);
    return;
  }

  for (const file of videoList) {
    const row = document.createElement('div');
    row.className = 'queue-row';

    const statusClass = file.status === 'processing'
      ? 'processing'
      : (file.status === 'done' ? 'done' : (file.status === 'failed' ? 'failed' : 'queued'));

    const statusText = file.status === 'processing'
      ? `${Math.round(file.progress)}%`
      : (file.status === 'done' ? 'Done' : (file.status === 'failed' ? 'Failed' : 'Queued'));

    row.innerHTML = `
      <div class="queue-top">
        <div class="queue-name" title="${file.filename}">${file.filename}</div>
        <div class="queue-status ${statusClass}">${statusText}</div>
      </div>
      <div class="queue-meta">${file.detail || 'Waiting in queue'}</div>
      <div class="queue-bar">
        <div class="queue-fill ${statusClass}" style="width:${Math.max(0, Math.min(100, file.progress || 0))}%"></div>
      </div>
    `;

    batchQueueList.appendChild(row);
  }
}

function refreshModeAfterQueueChange() {
  if (videoList.length === 0 && !isCompressing) {
    setMode('home');
    return;
  }

  if (appMode === 'single_result' || appMode === 'batch_result') return;

  if (videoList.length === 1) {
    setMode('single');
  } else if (videoList.length > 1) {
    setMode('batch');
  }
}

function collectSettings() {
  const hw = getHardwareInfo();
  const codec = codecSelect.value === 'av1' ? hw.bestAv1.id : hw.bestH265.id;
  const presetIndex = parseInt(presetSlider.value, 10);

  return {
    codec,
    resolution: resolutionSelect.value,
    crf: parseInt(crfSlider.value, 10),
    presetIndex,
    preset: PRESET_NAMES[presetIndex],
  };
}

function buildOutputPath(filePath, codecMode) {
  const fileName = basename(filePath);
  const parts = splitName(fileName);
  const prefix = codecMode === 'av1' ? 'av1_' : 'h265_';
  const ext = codecMode === 'av1' ? '.mkv' : '.mp4';
  return `${outputFolderEl.value.trim()}/${prefix}${parts.base}${ext}`;
}

function ensureOutputFolderFromPaths(paths) {
  if (outputFolderEl.value.trim()) return;
  if (!paths || paths.length === 0) return;
  outputFolderEl.value = dirname(paths[0]);
}

function setAllQueued() {
  for (const item of videoList) {
    item.status = 'queued';
    item.progress = 0;
    item.detail = 'Waiting in queue';
  }
}

function nextPendingIndexes() {
  const idx = [];
  for (let i = 0; i < videoList.length; i++) {
    if (videoList[i].status !== 'done') idx.push(i);
  }
  return idx;
}

// ========================
// Flow: file selection
// ========================
async function addVideosFromDialog({ append = false } = {}) {
  if (isCompressing) return;

  const result = await window.electronAPI.openFileDialog();
  if (result.canceled || result.filePaths.length === 0) return;

  const startingList = append ? [...videoList] : [];
  const dedupe = new Set(startingList.map((v) => v.path));

  const incomingFiles = Array.isArray(result.files) && result.files.length > 0
    ? result.files
    : result.filePaths.map((filePath) => ({ path: filePath, size: null }));

  const selected = [];
  for (const file of incomingFiles) {
    if (dedupe.has(file.path)) continue;
    dedupe.add(file.path);
    selected.push(file);
  }

  if (selected.length === 0) return;

  videoList = startingList;
  for (const file of selected) {
    videoList.push({
      path: file.path,
      filename: basename(file.path),
      status: 'queued',
      progress: 0,
      detail: 'Waiting in queue',
    });
  }

  ensureOutputFolderFromPaths(selected.map((f) => f.path));
  renderBatchQueue();
  refreshModeAfterQueueChange();

  await startCompressionFlow({ forceAll: false });
}

async function clearQueue() {
  if (isCompressing) {
    cancelAllRequested = true;
    statusEl.textContent = 'Cancelling...';
    try {
      await window.electronAPI.cancelCompress();
    } catch (err) {
      console.error('[RENDERER] cancelCompress failed:', err.message);
    }
    return;
  }
  videoList = [];
  renderBatchQueue();
  resetSingleScreen();
  setMode('home');
  statusEl.textContent = 'Queue cleared.';
}

async function cancelCurrent() {
  if (!isCompressing) return;
  cancelAllRequested = true;
  statusEl.textContent = 'Cancelling...';
  try {
    await window.electronAPI.cancelCompress();
  } catch (err) {
    console.error('[RENDERER] cancelCompress failed:', err.message);
  }
}

// ========================
// Compression loop
// ========================
async function startCompressionFlow({ forceAll = false } = {}) {
  if (isCompressing) return;
  if (videoList.length === 0) return;

  await ensureHardwareInfo();

  if (!outputFolderEl.value.trim()) {
    ensureOutputFolderFromPaths([videoList[0].path]);
  }
  if (!outputFolderEl.value.trim()) {
    statusEl.textContent = 'Please set an output folder in Advanced Settings.';
    return;
  }

  if (forceAll) setAllQueued();

  const pending = nextPendingIndexes();
  if (pending.length === 0) {
    statusEl.textContent = 'All files are already compressed.';
    return;
  }

  isCompressing = true;
  cancelAllRequested = false;
  currentVideoIndex = -1;
  addVideosBtn.disabled = true;
  addMoreFilesBtn.disabled = true;
  compressBtn.disabled = true;

  if (videoList.length === 1) {
    setMode('single');
    singleFileName.textContent = videoList[0].filename;
    setSingleProgress(0);
  } else {
    setMode('batch');
  }

  const settings = collectSettings();
  let successCount = 0;
  let failCount = 0;
  let totalElapsed = 0;

  logMessage(`Starting compression for ${pending.length} file(s).`, 'log-info');

  for (const idx of pending) {
    const item = videoList[idx];
    currentVideoIndex = idx;
    currentDurationUs = 0;

    item.status = 'processing';
    item.progress = 0;
    item.detail = 'Analyzing media...';
    if (videoList.length === 1) {
      singleFileName.textContent = item.filename;
      setSingleProgress(0);
    }
    renderBatchQueue();

    let durResult;
    try {
      durResult = await window.electronAPI.getDuration(item.path);
    } catch (err) {
      durResult = { success: false, error: err.message };
    }

    if (!durResult.success) {
      item.status = 'failed';
      item.progress = 0;
      item.detail = `Invalid file: ${durResult.error || 'unreadable'}`;
      failCount += 1;
      renderBatchQueue();
      continue;
    }

    currentDurationUs = Math.max(1, Math.floor(durResult.duration * 1000000));
    item.detail = `Duration: ${durResult.duration.toFixed(1)}s`;

    const start = Date.now();
    const outputPath = buildOutputPath(item.path, codecSelect.value);

    statusEl.textContent = `Compressing ${item.filename}...`;

    try {
      const result = await window.electronAPI.compress(item.path, outputPath, settings);
      const elapsedSeconds = (Date.now() - start) / 1000;
      totalElapsed += elapsedSeconds;

      if (Number.isFinite(result.inputSize)) item.inputSize = result.inputSize;

      if (result.success) {
        item.status = 'done';
        item.progress = 100;
        item.outputSize = Number.isFinite(result.outputSize) ? result.outputSize : 0;
        const sizeMb = (item.outputSize / 1024 / 1024).toFixed(1);
        item.detail = `${elapsedSeconds.toFixed(1)}s, ${sizeMb} MB`;
        successCount += 1;
        logMessage(`Done: ${item.filename} -> ${sizeMb} MB`, 'log-info');
      } else if (result.cancelled) {
        item.status = 'queued';
        item.progress = 0;
        item.detail = 'Cancelled';
        logMessage(`Cancelled: ${item.filename}`, 'log-info');
      } else {
        item.status = 'failed';
        item.outputSize = 0;
        item.detail = result.error || 'Compression failed';
        failCount += 1;
        logMessage(`Failed: ${item.filename} (${item.detail})`, 'log-error');
      }
    } catch (err) {
      item.status = 'failed';
      item.outputSize = 0;
      item.detail = err.message;
      failCount += 1;
      logMessage(`Failed: ${item.filename} (${err.message})`, 'log-error');
    }

    renderBatchQueue();

    if (cancelAllRequested) {
      logMessage('Cancellation requested — stopping queue.', 'log-info');
      break;
    }
  }

  currentVideoIndex = -1;
  isCompressing = false;
  const wasCancelled = cancelAllRequested;
  cancelAllRequested = false;
  addVideosBtn.disabled = false;
  addMoreFilesBtn.disabled = false;
  compressBtn.disabled = false;

  const total = successCount + failCount;
  if (wasCancelled) {
    statusEl.textContent = `Cancelled. ${successCount}/${total} complete before stop.`;
  } else if (failCount > 0) {
    statusEl.textContent = `${successCount}/${total} compressed, ${failCount} failed (${totalElapsed.toFixed(1)}s)`;
  } else {
    statusEl.textContent = `All ${total} file(s) compressed in ${totalElapsed.toFixed(1)}s`;
  }

  if (wasCancelled) {
    if (videoList.length === 1) {
      setSingleProgress(0);
      setMode('single');
    } else {
      setMode('batch');
    }
    return;
  }

  if (videoList.length === 1) {
    setSingleProgress(videoList[0].status === 'done' ? 100 : videoList[0].progress);
    if (successCount === 1 && failCount === 0) {
      renderSingleResult(videoList[0]);
      setMode('single_result');
    } else {
      setMode('single');
    }
  } else {
    renderBatchResult();
    setMode('batch_result');
  }
}

// ========================
// Live ffmpeg progress
// ========================
window.electronAPI.onFfmpegProgress((data) => {
  if (!isCompressing) return;
  if (currentVideoIndex < 0 || currentVideoIndex >= videoList.length) return;

  const item = videoList[currentVideoIndex];
  const outTimeUs = parseInt(data.out_time_us, 10);
  if (!Number.isNaN(outTimeUs) && currentDurationUs > 0) {
    const pct = Math.min(100, (outTimeUs / currentDurationUs) * 100);
    item.progress = pct;

    const timeText = `${formatTime(outTimeUs / 1000000)} / ${formatTime(currentDurationUs / 1000000)}`;
    const speedText = data.speed ? `speed ${data.speed}` : '';
    const fpsText = data.fps ? `fps ${data.fps}` : '';
    item.detail = [timeText, speedText, fpsText].filter(Boolean).join(' | ');

    if (videoList.length === 1) setSingleProgress(pct);
    renderBatchQueue();
  }

  if (data.progress === 'end') {
    item.progress = 100;
    if (videoList.length === 1) setSingleProgress(100);
    renderBatchQueue();
  }
});

window.electronAPI.onFfmpegStdout((data) => {
  const lines = data.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.includes('=')) logMessage(line, 'log-stdout');
  }
});

window.electronAPI.onFfmpegStderr((data) => {
  if (data.trim()) logMessage(data.trim(), 'log-stderr');
});

// ========================
// Controls
// ========================
crfSlider.addEventListener('input', () => {
  crfValueEl.textContent = crfSlider.value;
});

presetSlider.addEventListener('input', () => {
  presetValueEl.textContent = PRESET_NAMES[parseInt(presetSlider.value, 10)];
});

codecSelect.addEventListener('change', updateEncoderNotice);

browseOutputBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectOutputFolder();
  if (!result.canceled && result.folderPath) {
    outputFolderEl.value = result.folderPath;
    logMessage(`Output folder: ${result.folderPath}`, 'log-info');
  }
});

advancedToggleBtn.addEventListener('click', openAdvancedPanel);
advancedCloseBtn.addEventListener('click', closeAdvancedPanel);
panelOverlay.addEventListener('click', closeAdvancedPanel);

addVideosBtn.addEventListener('click', () => {
  const append = appMode === 'batch';
  addVideosFromDialog({ append });
});

brandHomeBtn.addEventListener('click', () => {
  if (isCompressing) return;
  setMode('home');
  statusEl.textContent = 'Ready to compress.';
});

uploadSurface.addEventListener('click', () => addVideosFromDialog({ append: false }));
addMoreFilesBtn.addEventListener('click', () => addVideosFromDialog({ append: true }));

// ========================
// Drag-and-drop (whole window)
// ========================
const VIDEO_EXT_RE = /\.(mp4|mkv|avi|mov|webm|flv|wmv|m4v|ts|mts)$/i;

function setDragState(active) {
  document.body.classList.toggle('drag-over', active);
}

window.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (isCompressing) { e.dataTransfer.dropEffect = 'none'; return; }
  e.dataTransfer.dropEffect = 'copy';
  setDragState(true);
});

window.addEventListener('dragleave', (e) => {
  if (e.target === document.documentElement || e.relatedTarget === null) {
    setDragState(false);
  }
});

window.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragState(false);
  if (isCompressing) return;

  const dropped = Array.from(e.dataTransfer.files || []);
  if (dropped.length === 0) return;

  const files = [];
  for (const f of dropped) {
    const p = window.electronAPI.getFilePath(f);
    if (!p) continue;
    if (!VIDEO_EXT_RE.test(p)) continue;
    const stat = window.electronAPI.statPath(p);
    if (stat && stat.isFile) files.push({ path: p, size: stat.size });
  }

  if (files.length === 0) {
    statusEl.textContent = 'No supported video files in that drop.';
    return;
  }

  const append = appMode === 'batch' || appMode === 'single';
  const startingList = append ? [...videoList] : [];
  const dedupe = new Set(startingList.map((v) => v.path));

  const selected = [];
  for (const f of files) {
    if (dedupe.has(f.path)) continue;
    dedupe.add(f.path);
    selected.push(f);
  }
  if (selected.length === 0) return;

  videoList = startingList;
  for (const file of selected) {
    videoList.push({
      path: file.path,
      filename: basename(file.path),
      status: 'queued',
      progress: 0,
      detail: 'Waiting in queue',
    });
  }

  ensureOutputFolderFromPaths(selected.map((f) => f.path));
  renderBatchQueue();
  refreshModeAfterQueueChange();
  await startCompressionFlow({ forceAll: false });
});
cancelAllBtn.addEventListener('click', clearQueue);
if (singleCancelBtn) singleCancelBtn.addEventListener('click', cancelCurrent);

singleCompressAnotherBtn.addEventListener('click', async () => {
  if (isCompressing) return;
  videoList = [];
  setMode('home');
  await addVideosFromDialog({ append: false });
});

saveToFolderBtn.addEventListener('click', async () => {
  const item = videoList[0];
  if (item && item.status === 'done') {
    const target = buildOutputPath(item.path, codecSelect.value);
    const res = await window.electronAPI.revealInFolder(target);
    if (res && res.success) {
      statusEl.textContent = `Revealed ${basename(target)} in Finder.`;
      return;
    }
  }
  const folder = outputFolderEl.value.trim();
  if (!folder) {
    statusEl.textContent = 'Set an output folder in Advanced Settings first.';
    openAdvancedPanel();
    return;
  }
  const res = await window.electronAPI.revealInFolder(folder);
  statusEl.textContent = res && res.success
    ? `Opened folder: ${folder}`
    : `Could not open folder: ${(res && res.error) || 'unknown'}`;
});

batchDownloadBtn.addEventListener('click', async () => {
  const folder = outputFolderEl.value.trim();
  if (!folder) {
    statusEl.textContent = 'Set an output folder in Advanced Settings first.';
    openAdvancedPanel();
    return;
  }
  const res = await window.electronAPI.revealInFolder(folder);
  statusEl.textContent = res && res.success
    ? `Opened folder: ${folder}`
    : `Could not open folder: ${(res && res.error) || 'unknown'}`;
});

compressBtn.addEventListener('click', () => {
  startCompressionFlow({ forceAll: true });
});

// ========================
// Test hooks
// ========================
window.electronAPI.onTestAddVideos(async (paths) => {
  videoList = [];
  for (const p of paths) {
    videoList.push({ path: p, filename: basename(p), status: 'queued', progress: 0, detail: 'Waiting in queue' });
  }

  ensureOutputFolderFromPaths(paths);
  renderBatchQueue();
  refreshModeAfterQueueChange();

  if (videoList.length > 0) {
    await startCompressionFlow({ forceAll: false });
  }
});

window.electronAPI.onTestAutoCompress(() => {
  startCompressionFlow({ forceAll: true });
});

// ========================
// Initialize
// ========================
async function initializeApp() {
  setMode('home');
  renderBatchQueue();
  resetSingleScreen();
  await ensureHardwareInfo();
  console.log('[RENDERER] initialized');
}

initializeApp();
