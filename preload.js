const { contextBridge, ipcRenderer, webUtils } = require('electron');

console.log('[PRELOAD] Preload script loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    // Resolve a dropped File object back to its absolute path
    getFilePath: (file) => {
        try {
            return webUtils.getPathForFile(file);
        } catch (err) {
            console.error('[PRELOAD] getFilePath error:', err.message);
            return null;
        }
    },
    // Stat a path (used to get file size for drag-dropped files)
    // NOTE: preload runs sandboxed — fs is not available here, so we go through IPC.
    statPath: (p) => ipcRenderer.invoke('stat-path', p),
    // File dialog
    openFileDialog: () => {
        console.log('[PRELOAD] openFileDialog() called');
        return ipcRenderer.invoke('open-file-dialog');
    },
    // Output folder dialog
    selectOutputFolder: () => {
        console.log('[PRELOAD] selectOutputFolder() called');
        return ipcRenderer.invoke('select-output-folder');
    },
    // Thumbnail generation
    generateThumbnail: (filePath) => {
        console.log('[PRELOAD] generateThumbnail() called for:', filePath);
        return ipcRenderer.invoke('generate-thumbnail', filePath);
    },
    // Compress (now with settings: resolution, crf, preset)
    compress: (inputPath, outputPath, settings) => {
        console.log('[PRELOAD] compress() called:', inputPath, '->', outputPath, 'settings:', JSON.stringify(settings));
        return ipcRenderer.invoke('compress', { inputPath, outputPath, settings });
    },
    cancelCompress: () => {
        console.log('[PRELOAD] cancelCompress() called');
        return ipcRenderer.invoke('cancel-compress');
    },
    revealInFolder: (targetPath) => {
        console.log('[PRELOAD] revealInFolder() called for:', targetPath);
        return ipcRenderer.invoke('reveal-in-folder', targetPath);
    },
    saveAs: (sourcePath, suggestedName) => {
        console.log('[PRELOAD] saveAs() called:', sourcePath);
        return ipcRenderer.invoke('save-as', { sourcePath, suggestedName });
    },
    getLocale: () => ipcRenderer.invoke('get-locale'),
    // Duration
    getDuration: (filePath) => {
        console.log('[PRELOAD] getDuration() called with:', filePath);
        return ipcRenderer.invoke('get-duration', filePath);
    },
    // Encoders
    checkEncoders: () => {
        console.log('[PRELOAD] checkEncoders() called');
        return ipcRenderer.invoke('check-encoders');
    },
    // Event listeners
    onFfmpegStdout: (callback) => {
        ipcRenderer.on('ffmpeg-stdout', (event, data) => callback(data));
    },
    onFfmpegStderr: (callback) => {
        ipcRenderer.on('ffmpeg-stderr', (event, data) => callback(data));
    },
    onFfmpegProgress: (callback) => {
        ipcRenderer.on('ffmpeg-progress', (event, data) => callback(data));
    },
    // Test mode
    onTestAddVideos: (callback) => {
        ipcRenderer.on('test-add-videos', (event, paths) => callback(paths));
    },
    onTestAutoCompress: (callback) => {
        ipcRenderer.on('test-auto-compress', (event, config) => callback(config));
    },
});

console.log('[PRELOAD] electronAPI exposed to renderer');
