// renderer.js - ShrinkMaster desktop flow
console.log('[RENDERER] renderer.js loaded');

// ========================
// i18n
// ========================
const I18N = {
  en: {
    'brand.badge': 'Desktop App',
    'header.selectFiles': 'Select Files',
    'header.advancedSettings': 'Advanced Settings',

    'home.tagline': 'Shrink Faster, Stay Crisp',
    'home.dropPrompt': 'Drag and drop files here',
    'home.dropSub': 'Select files to start shrinking instantly',
    'home.metaLocal': 'Local-only processing',
    'home.metaBatch': 'Single or batch compression',
    'home.metaReady': 'Ready in seconds',
    'home.dragOverlay': 'Drop to add videos',

    'single.ringLabel': 'Compressing...',
    'single.title': 'Optimizing your video...',
    'single.badge': 'Typical reduction: 70-90%',
    'single.desc': 'Hang tight — re-encoding your video with a modern codec to shrink the file while keeping it clear.',
    'single.noFile': 'No file selected',
    'single.cancel': 'Cancel Processing',

    'batch.queueTitle': 'Processing Queue',
    'batch.addMore': '+ Add More Files',
    'batch.cancelAll': 'Cancel All',
    'batch.fileOne': '{n} File',
    'batch.fileMany': '{n} Files',
    'batch.queueEmpty': 'No files selected',
    'batch.queueEmptySub': 'Add files to begin batch compression.',
    'batch.statusIdle': 'Idle',
    'batch.statusQueued': 'Queued',
    'batch.statusDone': 'Done',
    'batch.statusFailed': 'Failed',
    'batch.waitingInQueue': 'Waiting in queue',
    'batch.cancelled': 'Cancelled',
    'batch.invalidFile': 'Invalid file: {err}',
    'batch.compressionFailed': 'Compression failed',

    'feat.fastTitle': 'Ultra Fast',
    'feat.fastDesc': 'Leveraging GPU acceleration for maximum speed.',
    'feat.secureTitle': 'Secure',
    'feat.secureDesc': 'Files are processed on your device — nothing is uploaded.',
    'feat.hdTitle': 'HD Quality',
    'feat.hdDesc': 'Modern codecs (H.265 / AV1) keep quality high at a fraction of the size.',
    'footer.copyright': '(c) 2026 ShrinkMaster. 100% local processing.',

    'result.checkMark': 'OK',
    'result.title': 'Compression Complete!',
    'result.titleBatch': 'Compression Complete',
    'result.sub': 'Your file is ready and optimized for sharing.',
    'result.subBatch': 'Your {n} file{s} are ready and optimized for sharing.',
    'result.original': 'Original',
    'result.compressed': 'Compressed',
    'result.savedPill': 'Saved {pct}% Space!',
    'result.totalSaved': 'Total Saved: {bytes} ({pct}%)',
    'result.moreFiles': '+ {n} more file{s}',
    'result.saveAs': 'Save As...',
    'result.compressAnother': 'Compress Another File',
    'result.showInFinder': 'Show in Finder',
    'result.footer1': '100% Local',
    'result.footer2': 'No Upload',
    'result.footer3': 'Hardware Accelerated',
    'result.failed': 'FAILED',

    'adv.title': 'Advanced Settings',
    'adv.close': 'Close',
    'adv.language': 'Language',
    'adv.langAuto': 'Auto (System)',
    'adv.outputFolder': 'Output Folder',
    'adv.outputPlaceholder': 'Choose output folder',
    'adv.browse': 'Browse',
    'adv.codec': 'Codec',
    'adv.codecH265': 'H.265 (HEVC) — Fast and Compatible',
    'adv.codecAv1': 'AV1 — Smaller Files',
    'adv.resolution': 'Resolution',
    'adv.resOriginal': 'Original (no resize)',
    'adv.crf': 'Quality (CRF)',
    'adv.crfLow': '0 (lossless)',
    'adv.crfHigh': '51 (worst)',
    'adv.preset': 'Speed Preset',
    'adv.compressNow': 'Compress Now',
    'adv.log': 'Activity Log',

    'status.ready': 'Ready - select files to begin',
    'status.queueCleared': 'Queue cleared.',
    'status.cancelling': 'Cancelling...',
    'status.cancelled': 'Cancelled. {ok}/{total} complete before stop.',
    'status.someFailed': '{ok}/{total} compressed, {fail} failed ({secs}s)',
    'status.allDone': 'All {n} file(s) compressed in {secs}s',
    'status.allAlready': 'All files are already compressed.',
    'status.compressing': 'Compressing {name}...',
    'status.startingMany': 'Starting compression for {n} file(s).',
    'status.doneOne': 'Done: {name} -> {size} MB',
    'status.failedOne': 'Failed: {name} ({err})',
    'status.cancelledOne': 'Cancelled: {name}',
    'status.cancelStop': 'Cancellation requested - stopping queue.',
    'status.setOutput': 'Set an output folder in Advanced Settings first.',
    'status.openedFolder': 'Opened folder: {path}',
    'status.openFolderFail': 'Could not open folder: {err}',
    'status.savedTo': 'Saved: {path}',
    'status.saveCancelled': 'Save cancelled.',
    'status.saveFailed': 'Save failed: {err}',
    'status.outputFolderSet': 'Output folder: {path}',
    'status.noVideoFiles': 'No supported video files in that drop.',

    'enc.detectedCpu': 'Detected CPU: {model}',
    'enc.hwAccel': '[OK] HW Accelerated: {label}',
    'enc.cpuOnly': '[INFO] {label}',
  },
  'zh-CN': {
    'brand.badge': '桌面应用',
    'header.selectFiles': '选择文件',
    'header.advancedSettings': '高级设置',

    'home.tagline': '更快压缩，画质依旧',
    'home.dropPrompt': '把视频拖到这里',
    'home.dropSub': '选择文件，立即开始压缩',
    'home.metaLocal': '完全本地处理',
    'home.metaBatch': '支持单个或批量压缩',
    'home.metaReady': '几秒钟即可完成',
    'home.dragOverlay': '松开鼠标添加视频',

    'single.ringLabel': '压缩中…',
    'single.title': '正在优化你的视频…',
    'single.badge': '一般可缩小 70-90%',
    'single.desc': '请稍候，正在用现代编码器重新压缩，缩小文件的同时保持画质清晰。',
    'single.noFile': '未选择文件',
    'single.cancel': '取消压缩',

    'batch.queueTitle': '压缩队列',
    'batch.addMore': '+ 添加更多文件',
    'batch.cancelAll': '全部取消',
    'batch.fileOne': '{n} 个文件',
    'batch.fileMany': '{n} 个文件',
    'batch.queueEmpty': '尚未选择文件',
    'batch.queueEmptySub': '添加文件即可开始批量压缩。',
    'batch.statusIdle': '空闲',
    'batch.statusQueued': '排队中',
    'batch.statusDone': '已完成',
    'batch.statusFailed': '失败',
    'batch.waitingInQueue': '排队等待中',
    'batch.cancelled': '已取消',
    'batch.invalidFile': '无法读取文件：{err}',
    'batch.compressionFailed': '压缩失败',

    'feat.fastTitle': '极速压缩',
    'feat.fastDesc': '充分利用 GPU 硬件加速，速度更快。',
    'feat.secureTitle': '安全可靠',
    'feat.secureDesc': '文件全部在本机处理，绝不上传。',
    'feat.hdTitle': '高清画质',
    'feat.hdDesc': 'H.265 / AV1 等现代编码器在缩小体积的同时保持高画质。',
    'footer.copyright': '(c) 2026 ShrinkMaster · 100% 本地处理',

    'result.checkMark': '✓',
    'result.title': '压缩完成！',
    'result.titleBatch': '压缩完成',
    'result.sub': '文件已就绪，可直接分享。',
    'result.subBatch': '已处理完 {n} 个文件，可直接分享。',
    'result.original': '原始文件',
    'result.compressed': '压缩后',
    'result.savedPill': '节省了 {pct}% 空间！',
    'result.totalSaved': '共节省：{bytes}（{pct}%）',
    'result.moreFiles': '另外还有 {n} 个文件',
    'result.saveAs': '另存为…',
    'result.compressAnother': '压缩其他文件',
    'result.showInFinder': '在 Finder 中显示',
    'result.footer1': '100% 本地',
    'result.footer2': '不上传任何数据',
    'result.footer3': '硬件加速',
    'result.failed': '失败',

    'adv.title': '高级设置',
    'adv.close': '关闭',
    'adv.language': '界面语言',
    'adv.langAuto': '跟随系统',
    'adv.outputFolder': '输出目录',
    'adv.outputPlaceholder': '选择输出目录',
    'adv.browse': '浏览',
    'adv.codec': '编码器',
    'adv.codecH265': 'H.265 (HEVC) — 速度快、兼容性好',
    'adv.codecAv1': 'AV1 — 文件更小',
    'adv.resolution': '分辨率',
    'adv.resOriginal': '保持原始（不缩放）',
    'adv.crf': '画质 (CRF)',
    'adv.crfLow': '0（无损）',
    'adv.crfHigh': '51（最差）',
    'adv.preset': '速度预设',
    'adv.compressNow': '开始压缩',
    'adv.log': '运行日志',

    'status.ready': '就绪 — 请选择文件',
    'status.queueCleared': '队列已清空。',
    'status.cancelling': '正在取消…',
    'status.cancelled': '已取消。停止前完成 {ok}/{total}。',
    'status.someFailed': '已压缩 {ok}/{total}，失败 {fail} 个（耗时 {secs} 秒）',
    'status.allDone': '全部 {n} 个文件压缩完成（耗时 {secs} 秒）',
    'status.allAlready': '所有文件均已压缩。',
    'status.compressing': '正在压缩 {name}…',
    'status.startingMany': '开始压缩 {n} 个文件。',
    'status.doneOne': '完成：{name} → {size} MB',
    'status.failedOne': '失败：{name}（{err}）',
    'status.cancelledOne': '已取消：{name}',
    'status.cancelStop': '收到取消请求，正在停止队列。',
    'status.setOutput': '请先在「高级设置」中指定输出目录。',
    'status.openedFolder': '已打开目录：{path}',
    'status.openFolderFail': '无法打开目录：{err}',
    'status.savedTo': '已保存：{path}',
    'status.saveCancelled': '已取消保存。',
    'status.saveFailed': '保存失败：{err}',
    'status.outputFolderSet': '输出目录：{path}',
    'status.noVideoFiles': '拖入的文件不包含支持的视频格式。',

    'enc.detectedCpu': '检测到 CPU：{model}',
    'enc.hwAccel': '[已启用] 硬件加速：{label}',
    'enc.cpuOnly': '[提示] {label}',
  },
};

const SUPPORTED_LOCALES = ['en', 'zh-CN'];
let currentLocale = 'en';

function resolveLocale(tag) {
  if (!tag) return 'en';
  const normalized = String(tag).toLowerCase();
  if (normalized.startsWith('zh')) return 'zh-CN';
  return 'en';
}

function t(key, params) {
  const dict = I18N[currentLocale] || I18N.en;
  let str = dict[key];
  if (str === undefined) str = (I18N.en[key] !== undefined ? I18N.en[key] : key);
  if (params) {
    for (const k of Object.keys(params)) {
      str = str.split(`{${k}}`).join(String(params[k]));
    }
  }
  return str;
}

function applyTranslations() {
  document.documentElement.setAttribute('lang', currentLocale);
  document.body.setAttribute('data-drop-overlay', t('home.dragOverlay'));
  const nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  const phNodes = document.querySelectorAll('[data-i18n-placeholder]');
  phNodes.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.setAttribute('placeholder', t(key));
  });
  // Re-render dynamic UI that uses cached strings
  if (typeof updateEncoderNotice === 'function') updateEncoderNotice();
  if (typeof renderBatchQueue === 'function') renderBatchQueue();
}

function setLocale(loc) {
  currentLocale = SUPPORTED_LOCALES.includes(loc) ? loc : 'en';
  try { localStorage.setItem('shrinkmaster.locale', currentLocale); } catch (e) {}
  applyTranslations();
}

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

const languageSelect = document.getElementById('languageSelect');
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

  const best = codecMode === 'h265' ? hw.bestH265 : hw.bestAv1;
  const line2 = best.hw ? t('enc.hwAccel', { label: best.label }) : t('enc.cpuOnly', { label: best.label });

  encoderNotices.innerHTML = `<div>${t('enc.detectedCpu', { model: hw.cpuModel })}</div><div>${line2}</div>`;
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
  singleFileName.textContent = t('single.noFile');
}

function renderSingleResult(item) {
  const inputSize = item.inputSize || 0;
  const outputSize = item.outputSize || 0;
  const metrics = getSavingMetrics(inputSize, outputSize);

  singleResultOriginalSize.textContent = formatBytes(inputSize);
  singleResultCompressedSize.textContent = formatBytes(outputSize);
  singleResultSavedText.textContent = `-${formatBytes(metrics.savedBytes)}`;
  singleResultSavedLabel.textContent = t('result.savedPill', { pct: metrics.pct });
}

function renderBatchResult() {
  const completed = videoList.filter((v) => v.status === 'done');
  const failed = videoList.filter((v) => v.status === 'failed');
  const total = videoList.length;
  const inputTotal = completed.reduce((sum, v) => sum + (v.inputSize || 0), 0);
  const outputTotal = completed.reduce((sum, v) => sum + (v.outputSize || 0), 0);
  const metrics = getSavingMetrics(inputTotal, outputTotal);

  batchResultCount.textContent = t('result.subBatch', { n: total, s: total === 1 ? '' : 's' });
  batchResultSavedLabel.textContent = t('result.totalSaved', { bytes: formatBytes(metrics.savedBytes), pct: metrics.pct });

  batchResultList.innerHTML = '';
  const resultSource = completed.length > 0 ? completed : failed;
  const rows = resultSource.slice(0, 3);

  for (const file of rows) {
    const row = document.createElement('div');
    row.className = 'batch-result-row';

    const rowMetrics = getSavingMetrics(file.inputSize || 0, file.outputSize || 0);
    const pctText = file.status === 'failed' ? t('result.failed') : `-${rowMetrics.pct}%`;
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
    batchResultMoreFiles.textContent = t('result.moreFiles', { n: moreCount, s: moreCount === 1 ? '' : 's' });
  }
}

function renderBatchQueue() {
  batchQueueList.innerHTML = '';
  const count = videoList.length;
  batchQueueCount.textContent = t(count === 1 ? 'batch.fileOne' : 'batch.fileMany', { n: count });

  if (count === 0) {
    const empty = document.createElement('div');
    empty.className = 'queue-row';
    empty.innerHTML = `
      <div class="queue-top">
        <div class="queue-name">${t('batch.queueEmpty')}</div>
        <div class="queue-status">${t('batch.statusIdle')}</div>
      </div>
      <div class="queue-meta">${t('batch.queueEmptySub')}</div>
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
      : (file.status === 'done' ? t('batch.statusDone') : (file.status === 'failed' ? t('batch.statusFailed') : t('batch.statusQueued')));

    row.innerHTML = `
      <div class="queue-top">
        <div class="queue-name" title="${file.filename}">${file.filename}</div>
        <div class="queue-status ${statusClass}">${statusText}</div>
      </div>
      <div class="queue-meta">${file.detail || t('batch.waitingInQueue')}</div>
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
    item.detail = t('batch.waitingInQueue');
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
      detail: t('batch.waitingInQueue'),
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
    statusEl.textContent = t('status.cancelling');
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
  statusEl.textContent = t('status.queueCleared');
}

async function cancelCurrent() {
  if (!isCompressing) return;
  cancelAllRequested = true;
  statusEl.textContent = t('status.cancelling');
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
    statusEl.textContent = t('status.setOutput');
    return;
  }

  if (forceAll) setAllQueued();

  const pending = nextPendingIndexes();
  if (pending.length === 0) {
    statusEl.textContent = t('status.allAlready');
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

  logMessage(t('status.startingMany', { n: pending.length }), 'log-info');

  for (const idx of pending) {
    const item = videoList[idx];
    currentVideoIndex = idx;
    currentDurationUs = 0;

    item.status = 'processing';
    item.progress = 0;
    item.detail = t('single.title');
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
      item.detail = t('batch.invalidFile', { err: durResult.error || 'unreadable' });
      failCount += 1;
      renderBatchQueue();
      continue;
    }

    currentDurationUs = Math.max(1, Math.floor(durResult.duration * 1000000));
    item.detail = `${durResult.duration.toFixed(1)}s`;

    const start = Date.now();
    const outputPath = buildOutputPath(item.path, codecSelect.value);

    statusEl.textContent = t('status.compressing', { name: item.filename });

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
        logMessage(t('status.doneOne', { name: item.filename, size: sizeMb }), 'log-info');
      } else if (result.cancelled) {
        item.status = 'queued';
        item.progress = 0;
        item.detail = t('batch.cancelled');
        logMessage(t('status.cancelledOne', { name: item.filename }), 'log-info');
      } else {
        item.status = 'failed';
        item.outputSize = 0;
        item.detail = result.error || t('batch.compressionFailed');
        failCount += 1;
        logMessage(t('status.failedOne', { name: item.filename, err: item.detail }), 'log-error');
      }
    } catch (err) {
      item.status = 'failed';
      item.outputSize = 0;
      item.detail = err.message;
      failCount += 1;
      logMessage(t('status.failedOne', { name: item.filename, err: err.message }), 'log-error');
    }

    renderBatchQueue();

    if (cancelAllRequested) {
      logMessage(t('status.cancelStop'), 'log-info');
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
    statusEl.textContent = t('status.cancelled', { ok: successCount, total });
  } else if (failCount > 0) {
    statusEl.textContent = t('status.someFailed', { ok: successCount, total, fail: failCount, secs: totalElapsed.toFixed(1) });
  } else {
    statusEl.textContent = t('status.allDone', { n: total, secs: totalElapsed.toFixed(1) });
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
    logMessage(t('status.outputFolderSet', { path: result.folderPath }), 'log-info');
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
  statusEl.textContent = t('status.ready');
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
    const stat = await window.electronAPI.statPath(p);
    if (stat && stat.isFile) files.push({ path: p, size: stat.size });
  }

  if (files.length === 0) {
    statusEl.textContent = t('status.noVideoFiles');
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
      detail: t('batch.waitingInQueue'),
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
  // If we have a finished single result, prompt Save As and copy the file there.
  if (item && item.status === 'done') {
    const target = buildOutputPath(item.path, codecSelect.value);
    const res = await window.electronAPI.saveAs(target, basename(target));
    if (res && res.success) {
      statusEl.textContent = t('status.savedTo', { path: res.savedPath });
      return;
    }
    if (res && res.canceled) {
      statusEl.textContent = t('status.saveCancelled');
      return;
    }
    statusEl.textContent = t('status.saveFailed', { err: (res && res.error) || 'unknown' });
    return;
  }
  // No finished result — fall back to revealing the configured output folder.
  const folder = outputFolderEl.value.trim();
  if (!folder) {
    statusEl.textContent = t('status.setOutput');
    openAdvancedPanel();
    return;
  }
  const res = await window.electronAPI.revealInFolder(folder);
  statusEl.textContent = res && res.success
    ? t('status.openedFolder', { path: folder })
    : t('status.openFolderFail', { err: (res && res.error) || 'unknown' });
});

batchDownloadBtn.addEventListener('click', async () => {
  const folder = outputFolderEl.value.trim();
  if (!folder) {
    statusEl.textContent = t('status.setOutput');
    openAdvancedPanel();
    return;
  }
  const res = await window.electronAPI.revealInFolder(folder);
  statusEl.textContent = res && res.success
    ? t('status.openedFolder', { path: folder })
    : t('status.openFolderFail', { err: (res && res.error) || 'unknown' });
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
// i18n bootstrap
// ========================
async function initializeLocale() {
  let saved = null;
  try { saved = localStorage.getItem('shrinkmaster.locale'); } catch (e) {}

  // Set the language picker. "auto" means follow system; explicit value overrides.
  if (saved && SUPPORTED_LOCALES.includes(saved)) {
    currentLocale = saved;
    if (languageSelect) languageSelect.value = saved;
  } else {
    let sysLocale = 'en-US';
    try { sysLocale = await window.electronAPI.getLocale(); } catch (e) {}
    currentLocale = resolveLocale(sysLocale);
    if (languageSelect) languageSelect.value = 'auto';
  }
  applyTranslations();
}

if (languageSelect) {
  languageSelect.addEventListener('change', async () => {
    const choice = languageSelect.value;
    if (choice === 'auto') {
      try { localStorage.removeItem('shrinkmaster.locale'); } catch (e) {}
      let sysLocale = 'en-US';
      try { sysLocale = await window.electronAPI.getLocale(); } catch (e) {}
      currentLocale = resolveLocale(sysLocale);
      applyTranslations();
    } else {
      setLocale(choice);
    }
  });
}

// ========================
// Initialize
// ========================
async function initializeApp() {
  await initializeLocale();
  setMode('home');
  renderBatchQueue();
  resetSingleScreen();
  await ensureHardwareInfo();
  console.log('[RENDERER] initialized, locale=', currentLocale);
}

initializeApp();
