// ============================================================================
// LocalDiapo - Professional Media Player
// Core Logic (v3.1)
// ============================================================================

const STORAGE_KEYS = {
    PLAYLIST: 'localDiapo_playlist_v3',
    THEME: 'localDiapo_theme',
    VOLUME: 'localDiapo_volume',
    REPEAT_MODE: 'localDiapo_repeat_mode'
};

const IMAGE_DISPLAY_DURATION = 5000;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'mp4', 'webm', 'pdf'];

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const playerContainer = document.getElementById('playerContainer');
    const mediaListElement = document.getElementById('mediaList');
    const playlistElement = document.getElementById('playlist');
    const imageDisplay = document.getElementById('imageDisplay');
    const videoDisplay = document.getElementById('videoDisplay');
    const pdfDisplay = document.getElementById('pdfDisplay');
    const pdfFallbackLink = document.getElementById('pdfFallbackLink');
    const currentMediaTitle = document.getElementById('currentMediaTitle');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const wakeLockIndicator = document.getElementById('wakeLockIndicator');

    // Controls
    const playPauseButton = document.getElementById('playPauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const repeatButton = document.getElementById('repeatButton');
    const volumeButton = document.getElementById('volumeButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const progressBar = document.getElementById('progressBar');
    const currentTimeElement = document.getElementById('currentTime');
    const durationTimeElement = document.getElementById('durationTime');
    const progressControls = document.getElementById('progressControls');

    // Sidebar & Upload
    const sidebarTabs = document.querySelectorAll('.sidebar-tabs .tab-button');
    const tabPanes = document.querySelectorAll('.sidebar-content .tab-pane');
    const mediaSearch = document.getElementById('mediaSearch');
    const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
    const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
    const shufflePlaylistBtn = document.getElementById('shufflePlaylistBtn');

    const uploadFileInput = document.getElementById('uploadFileInput');
    const uploadDropZone = document.getElementById('uploadDropZone');
    const dropZoneText = document.getElementById('dropZoneText');
    const uploadPreviewArea = document.getElementById('uploadPreviewArea');
    const uploadButton = document.getElementById('uploadButton');
    const uploadStatusArea = document.getElementById('uploadStatusArea');
    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    const uploadProgressBar = document.getElementById('uploadProgressBar');
    const uploadProgressPercent = document.getElementById('uploadProgressPercent');

    // Popup
    const popupOverlay = document.getElementById('popup-overlay');
    const popupBox = popupOverlay?.querySelector('.popup-box');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const confirmBtn = document.getElementById('popup-confirm-btn');
    const cancelBtn = document.getElementById('popup-cancel-btn');
    const okBtn = document.getElementById('popup-ok-btn');

    // Theme & Auth
    const themeToggle = document.getElementById('themeToggle');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- State ---
    let availableMedia = [];
    let playlist = [];
    let currentMediaIndex = -1;
    let isPlaying = false;
    let repeatMode = 'none';
    let currentVolume = 1;
    let isMuted = false;
    let imageTimeoutId = null;
    let selectedBrowserItems = [];
    let screenWakeLock = null;
    let fileToDelete = null;
    let currentTheme = 'light';

    // --- Initialization ---
    init();

    function init() {
        console.log('[INFO] Initializing LocalDiapo...');

        loadTheme();
        loadVolume();
        loadRepeatMode();

        setupSidebarTabs();
        setupUploadListeners();
        setupPopupListeners();
        setupDeleteListener();
        setupKeyboardShortcuts();
        setupThemeToggle();
        setupGlobalDragDrop();

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = 'logout.php';
            });
        }

        fetchMediaList();
        updateUI();
        updateFooterYear();
    }

    // --- Theme ---
    function setupThemeToggle() {
        if (!themeToggle) return;
        themeToggle.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        saveTheme(currentTheme);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function loadTheme() {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        currentTheme = saved;
        applyTheme(saved);
    }

    function saveTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    // --- Keyboard Shortcuts ---
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            switch (e.key.toLowerCase()) {
                case ' ': case 'k': e.preventDefault(); togglePlayPause(); break;
                case 'arrowright': e.preventDefault(); playNext(); break;
                case 'arrowleft': e.preventDefault(); playPrevious(); break;
                case 'f': e.preventDefault(); toggleFullscreen(); break;
                case 'm': e.preventDefault(); toggleMute(); break;
                case 'r': e.preventDefault(); cycleRepeatMode(); break;
                case 'arrowup': e.preventDefault(); adjustVolume(0.1); break;
                case 'arrowdown': e.preventDefault(); adjustVolume(-0.1); break;
            }
        });
    }

    function adjustVolume(delta) {
        currentVolume = Math.max(0, Math.min(1, currentVolume + delta));
        isMuted = false;
        updateVolume();
        saveVolume();
    }

    function cycleRepeatMode() {
        if (repeatButton) repeatButton.click();
    }

    // --- Global Drag & Drop ---
    function setupGlobalDragDrop() {
        const container = playerContainer;
        const mediaDisplay = document.getElementById('mediaDisplay');

        // Prevent default drag behaviors on the whole document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
            document.body.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Show visual feedback when dragging files over the app
        container.addEventListener('dragenter', (e) => {
            if (e.dataTransfer.types.includes('Files')) {
                container.classList.add('dragging-file');
            }
        });

        container.addEventListener('dragleave', (e) => {
            if (!container.contains(e.relatedTarget)) {
                container.classList.remove('dragging-file');
            }
        });

        // Drop on media display = direct play (upload first if needed)
        if (mediaDisplay) {
            mediaDisplay.addEventListener('drop', async (e) => {
                e.preventDefault();
                container.classList.remove('dragging-file');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    // Upload files first, then play
                    await uploadFilesAndPlay(files);
                }
            });
        }

        // Drop on playlist = add to playlist
        if (playlistElement) {
            playlistElement.addEventListener('dragenter', () => {
                playlistElement.classList.add('drag-over');
            });

            playlistElement.addEventListener('dragleave', (e) => {
                if (!playlistElement.contains(e.relatedTarget)) {
                    playlistElement.classList.remove('drag-over');
                }
            });

            playlistElement.addEventListener('drop', async (e) => {
                e.preventDefault();
                playlistElement.classList.remove('drag-over');
                container.classList.remove('dragging-file');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    await uploadFilesAndAddToPlaylist(files);
                }
            });
        }
    }

    // Upload files and immediately play them
    async function uploadFilesAndPlay(files) {
        showLoading(true);
        const uploaded = await uploadFilesToServer(files);
        showLoading(false);

        if (uploaded.length > 0) {
            // Refresh media list
            await fetchMediaList();

            // Find and play the first uploaded file
            const firstFile = uploaded[0];
            const mediaItem = availableMedia.find(m => m.filename === firstFile);

            if (mediaItem) {
                // Add to playlist and play
                if (!playlist.some(p => p.path === mediaItem.path)) {
                    playlist.push({ ...mediaItem });
                    renderPlaylist();
                    savePlaylistToLocalStorage();
                }
                const idx = playlist.findIndex(p => p.path === mediaItem.path);
                if (idx !== -1) playMediaAtIndex(idx);
            }
        }
    }

    // Upload files and add to playlist
    async function uploadFilesAndAddToPlaylist(files) {
        showPopup('Upload', 'Uploading files...', 'info');
        const uploaded = await uploadFilesToServer(files);

        if (uploaded.length > 0) {
            await fetchMediaList();

            let added = 0;
            uploaded.forEach(fname => {
                const item = availableMedia.find(m => m.filename === fname);
                if (item && !playlist.some(p => p.path === item.path)) {
                    playlist.push({ ...item });
                    added++;
                }
            });

            if (added > 0) {
                renderPlaylist();
                savePlaylistToLocalStorage();
                showPopup('Success', `${added} file(s) added to playlist.`, 'success');
            }
        }
    }

    // Core upload function (returns array of uploaded filenames)
    async function uploadFilesToServer(files) {
        const fd = new FormData();
        Array.from(files).forEach(f => fd.append('mediaFiles[]', f));

        try {
            const res = await fetch('upload_handler.php', {
                method: 'POST',
                body: fd
            });
            const data = await res.json();

            if (data.status === 'success' || data.status === 'warning') {
                // Extract successful filenames from messages
                const uploadedFiles = [];
                data.messages.forEach(msg => {
                    const match = msg.match(/Success: (.+) uploaded/);
                    if (match) uploadedFiles.push(match[1]);
                });
                return uploadedFiles;
            }
            return [];
        } catch (e) {
            console.error('[ERROR] Upload failed:', e);
            showPopup('Error', 'Upload failed. Please try again.', 'error');
            return [];
        }
    }

    // --- Popup ---
    function showPopup(title, message, type = 'info') {
        if (!popupOverlay) {
            alert(`${title}\n${message}`);
            return;
        }

        popupTitle.textContent = title;
        popupMessage.textContent = message;
        if (popupBox) popupBox.className = 'popup-box'; // Reset classes

        confirmBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        okBtn.style.display = 'none';

        if (type === 'confirm') {
            confirmBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
        } else {
            okBtn.style.display = 'inline-block';
            if (popupBox) {
                if (type === 'success') popupBox.classList.add('success');
                if (type === 'error') popupBox.classList.add('error');
            }
        }

        popupOverlay.classList.add('visible');
    }

    function hidePopup() {
        if (popupOverlay) popupOverlay.classList.remove('visible');
        fileToDelete = null;
    }

    function setupPopupListeners() {
        if (okBtn) okBtn.addEventListener('click', hidePopup);
        if (cancelBtn) cancelBtn.addEventListener('click', hidePopup);
        if (confirmBtn) confirmBtn.addEventListener('click', handleConfirmAction);
        if (popupOverlay) {
            popupOverlay.addEventListener('click', (e) => {
                if (e.target === popupOverlay) hidePopup();
            });
        }
    }

    function handleConfirmAction() {
        if (fileToDelete === '---CLEAR_PLAYLIST---') {
            clearPlaylist();
        } else if (fileToDelete) {
            deleteFileFromServer(fileToDelete);
        }
        hidePopup();
    }

    // --- Wake Lock ---
    async function requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                screenWakeLock = await navigator.wakeLock.request('screen');
                screenWakeLock.addEventListener('release', () => {
                    screenWakeLock = null;
                    updateWakeLockIndicator();
                });
                updateWakeLockIndicator();
            } catch (err) {
                console.error('[WARN] Wake Lock rejected/error:', err);
                screenWakeLock = null;
                updateWakeLockIndicator();
            }
        }
    }

    async function releaseWakeLock() {
        if (screenWakeLock !== null && !screenWakeLock.released) {
            try {
                await screenWakeLock.release();
            } catch (err) {
                console.error('[WARN] Wake Lock release error:', err);
            } finally {
                screenWakeLock = null;
                updateWakeLockIndicator();
            }
        }
    }

    function updateWakeLockIndicator() {
        if (wakeLockIndicator) {
            wakeLockIndicator.classList.toggle('active', screenWakeLock !== null && !screenWakeLock.released);
        }
    }

    document.addEventListener('visibilitychange', async () => {
        if (screenWakeLock !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });

    // --- Sidebar ---
    function setupSidebarTabs() {
        if (!sidebarTabs) return;
        sidebarTabs.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');

                sidebarTabs.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                tabPanes.forEach(p => {
                    p.classList.remove('active');
                    if (p.id === `${targetId}Pane`) p.classList.add('active');
                });
            });
        });
    }

    // --- Media Library ---
    async function fetchMediaList() {
        if (!mediaListElement) return;
        mediaListElement.innerHTML = '<li class="loading-placeholder">Loading media...</li>';

        try {
            const response = await fetch('list_videos.php');
            if (response.status === 401) {
                // Redirect to login if unauthorized
                window.location.href = 'login.php';
                return;
            }
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            availableMedia = data.media || [];
            console.log(`[INFO] Loaded ${availableMedia.length} files.`);
            renderMediaBrowser();
            loadPlaylistFromLocalStorage();
            updateUI();
        } catch (error) {
            console.error('[ERROR] Media load failed:', error);
            mediaListElement.innerHTML = `<li class="loading-placeholder error">Error: ${error.message}</li>`;
        }
    }

    function renderMediaBrowser(filter = '') {
        if (!mediaListElement) return;
        mediaListElement.innerHTML = '';
        selectedBrowserItems = [];
        updateAddToPlaylistButton();

        const term = filter.toLowerCase().trim();
        const filtered = availableMedia.filter(i => i.filename.toLowerCase().includes(term));

        if (filtered.length === 0) {
            mediaListElement.innerHTML = '<li class="loading-placeholder">No matches found.</li>';
            return;
        }

        filtered.forEach(item => {
            const li = document.createElement('li');
            li.className = 'media-item';
            li.dataset.path = item.path;

            let icon = 'fa-file';
            if (item.type === 'image') icon = 'fa-file-image';
            if (item.type === 'video') icon = 'fa-file-video';
            if (item.type === 'pdf') icon = 'fa-file-pdf';

            li.innerHTML = `
                <i class="fas ${icon}"></i>
                <span class="media-filename">${item.filename}</span>
                <button class="delete-media-btn" data-filename="${item.filename}" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            li.addEventListener('click', (e) => {
                if (e.target.closest('.delete-media-btn')) return;
                li.classList.toggle('selected');
                if (li.classList.contains('selected')) selectedBrowserItems.push(item.path);
                else selectedBrowserItems = selectedBrowserItems.filter(p => p !== item.path);
                updateAddToPlaylistButton();
            });
            mediaListElement.appendChild(li);
        });
    }

    function updateAddToPlaylistButton() {
        if (addToPlaylistBtn) addToPlaylistBtn.disabled = selectedBrowserItems.length === 0;
    }

    if (mediaSearch) {
        mediaSearch.addEventListener('input', (e) => renderMediaBrowser(e.target.value));
    }

    if (addToPlaylistBtn) {
        addToPlaylistBtn.addEventListener('click', () => {
            let added = 0;
            selectedBrowserItems.forEach(path => {
                const item = availableMedia.find(i => i.path === path);
                if (item && !playlist.some(p => p.path === item.path)) {
                    playlist.push({ ...item });
                    added++;
                }
            });

            if (added > 0) {
                renderPlaylist();
                savePlaylistToLocalStorage();
                if (currentMediaIndex === -1) playMediaAtIndex(playlist.length - added);
                showPopup('Success', `${added} items added to playlist.`, 'success');
            } else {
                showPopup('Info', 'Selected items already in playlist.', 'info');
            }

            // Clear selection
            document.querySelectorAll('.media-item.selected').forEach(e => e.classList.remove('selected'));
            selectedBrowserItems = [];
            updateAddToPlaylistButton();
        });
    }

    // --- Playlist ---
    function renderPlaylist() {
        if (!playlistElement) return;
        playlistElement.innerHTML = '';

        if (playlist.length === 0) {
            playlistElement.innerHTML = '<li class="empty-playlist-message">Playlist is empty.</li>';
            updatePlayerControlsState();
            return;
        }

        playlist.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.dataset.index = idx;
            if (idx === currentMediaIndex) li.classList.add('active');

            let icon = 'fa-file';
            if (item.type === 'image') icon = 'fa-file-image';
            if (item.type === 'video') icon = 'fa-file-video';
            if (item.type === 'pdf') icon = 'fa-file-pdf';

            li.innerHTML = `
                <i class="fas ${icon}"></i>
                <span class="playlist-filename">${item.filename}</span>
                <button class="remove-item" title="Remove"><i class="fas fa-times"></i></button>
            `;

            li.addEventListener('click', (e) => {
                if (e.target.closest('.remove-item')) return;
                playMediaAtIndex(idx);
            });
            li.querySelector('.remove-item').addEventListener('click', () => removeItemFromPlaylist(idx));
            playlistElement.appendChild(li);
        });
        updatePlayerControlsState();
    }

    function removeItemFromPlaylist(idx) {
        if (idx < 0 || idx >= playlist.length) return;
        playlist.splice(idx, 1);

        if (playlist.length === 0) {
            currentMediaIndex = -1;
            stopPlayback();
            clearDisplay();
        } else if (idx === currentMediaIndex) {
            currentMediaIndex = idx % playlist.length;
            playMediaAtIndex(currentMediaIndex);
        } else if (idx < currentMediaIndex) {
            currentMediaIndex--;
        }

        renderPlaylist();
        savePlaylistToLocalStorage();
    }

    if (clearPlaylistBtn) {
        clearPlaylistBtn.addEventListener('click', () => {
            if (playlist.length > 0) {
                fileToDelete = '---CLEAR_PLAYLIST---';
                showPopup('Clear Playlist', 'Are you sure?', 'confirm');
            }
        });
    }

    function clearPlaylist() {
        playlist = [];
        currentMediaIndex = -1;
        stopPlayback();
        clearDisplay();
        renderPlaylist();
        savePlaylistToLocalStorage();
    }

    if (shufflePlaylistBtn) {
        shufflePlaylistBtn.addEventListener('click', () => {
            if (playlist.length < 2) return;
            // Shuffle
            for (let i = playlist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
            }
            currentMediaIndex = -1; // Reset selection to avoid confusion
            stopPlayback();
            renderPlaylist();
            savePlaylistToLocalStorage();
            showPopup('Shuffled', 'Playlist has been shuffled.', 'success');
        });
    }

    // --- Playback ---
    function playMediaAtIndex(idx) {
        if (idx < 0 || idx >= playlist.length) {
            if (repeatMode === 'all' && playlist.length > 0) idx = 0;
            else {
                stopPlayback();
                currentMediaIndex = -1;
                renderPlaylist();
                return;
            }
        }

        clearTimeout(imageTimeoutId);
        currentMediaIndex = idx;
        const item = playlist[idx];
        if (!item) return;

        console.log(`[INFO] Playing: ${item.filename}`);
        clearDisplay();
        showLoading(true);
        if (currentMediaTitle) currentMediaTitle.textContent = item.filename;

        if (item.type === 'image') {
            imageDisplay.src = item.path;
            imageDisplay.onload = () => showLoading(false);
            imageDisplay.onerror = handleMediaError;
            imageDisplay.classList.add('active');
            hideVideoControls();
            imageTimeoutId = setTimeout(playNext, IMAGE_DISPLAY_DURATION);
            isPlaying = true;
            requestWakeLock();
        } else if (item.type === 'video') {
            videoDisplay.src = item.path;
            videoDisplay.onloadeddata = () => {
                showLoading(false);
                videoDisplay.play();
                updateVolume();
                showVideoControls();
            };
            videoDisplay.onerror = handleMediaError;
            videoDisplay.classList.add('active');
        } else if (item.type === 'pdf') {
            pdfDisplay.data = item.path;
            pdfFallbackLink.href = item.path;
            setTimeout(() => showLoading(false), 1000); // PDF load detect hack
            pdfDisplay.classList.add('active');
            hideVideoControls();
            isPlaying = false;
            releaseWakeLock();
        }
        renderPlaylist();
        updatePlayPauseButton();
    }

    function handleMediaError() {
        showLoading(false);
        console.error('[ERROR] Media failed to load');
        showPopup('Error', 'Failed to load media file.', 'error');
    }

    function showLoading(show) {
        if (loadingSpinner) loadingSpinner.classList.toggle('active', show);
    }

    function clearDisplay() {
        if (imageDisplay) imageDisplay.classList.remove('active');
        if (videoDisplay) {
            videoDisplay.classList.remove('active');
            videoDisplay.pause();
            videoDisplay.src = '';
        }
        if (pdfDisplay) pdfDisplay.classList.remove('active');
        showLoading(false);
        if (currentMediaTitle) currentMediaTitle.textContent = 'No media selected';
    }

    function stopPlayback() {
        clearTimeout(imageTimeoutId);
        if (!videoDisplay.paused) videoDisplay.pause();
        isPlaying = false;
        updatePlayPauseButton();
        if (screenWakeLock) releaseWakeLock();
    }

    function playNext() {
        if (playlist.length === 0) return;
        let nextIdx = currentMediaIndex + 1;

        if (repeatMode === 'one' && currentMediaIndex !== -1) {
            // Logic handled in 'ended' event mostly, but for manual Next:
            // If manual next during repeat-one, usually we force next item anyway? 
            // Or repeat the same? Let's force next item logic for manual button.
            // But playNext is called by timer too.
            // Let's stick to standard logic: next button goes to next item usually.
            // But wait, if timer calls this...
            // Let's assume playNext goes to next index unless overridden.
        }

        playMediaAtIndex(nextIdx); // Function handles wrap-around if repeat-all
    }

    function playPrevious() {
        if (playlist.length === 0) return;
        playMediaAtIndex(currentMediaIndex - 1);
    }

    function togglePlayPause() {
        if (currentMediaIndex === -1 && playlist.length > 0) {
            playMediaAtIndex(0);
            return;
        }
        if (playlist[currentMediaIndex]?.type === 'video') {
            videoDisplay.paused ? videoDisplay.play() : videoDisplay.pause();
        } else if (playlist[currentMediaIndex]?.type === 'image') {
            isPlaying ? stopPlayback() : playNext(); // Simplified logic
        }
    }

    // --- Controls ---
    if (playPauseButton) playPauseButton.addEventListener('click', togglePlayPause);
    if (nextButton) nextButton.addEventListener('click', playNext);
    if (prevButton) prevButton.addEventListener('click', playPrevious);

    if (repeatButton) {
        repeatButton.addEventListener('click', () => {
            const modes = ['none', 'all', 'one'];
            const idx = modes.indexOf(repeatMode);
            repeatMode = modes[(idx + 1) % modes.length];

            repeatButton.classList.toggle('active', repeatMode !== 'none');
            saveRepeatMode();

            // Update icon
            let inner = '<i class="fas fa-repeat"></i>';
            if (repeatMode === 'one') inner += '<span>1</span>';
            repeatButton.innerHTML = inner;
            console.log(`[INFO] Repeat mode: ${repeatMode}`);
        });
    }

    if (volumeButton) volumeButton.addEventListener('click', toggleMute);
    if (volumeSlider) volumeSlider.addEventListener('input', (e) => {
        currentVolume = parseFloat(e.target.value);
        isMuted = currentVolume === 0;
        updateVolume();
        saveVolume();
    });

    if (fullscreenButton) fullscreenButton.addEventListener('click', toggleFullscreen);

    // --- Video Events ---
    videoDisplay.addEventListener('play', () => { isPlaying = true; updatePlayPauseButton(); });
    videoDisplay.addEventListener('pause', () => { isPlaying = false; updatePlayPauseButton(); });
    videoDisplay.addEventListener('ended', () => {
        if (repeatMode === 'one') {
            videoDisplay.currentTime = 0;
            videoDisplay.play();
        } else {
            playNext();
        }
    });
    videoDisplay.addEventListener('timeupdate', updateProgressBar);
    videoDisplay.addEventListener('loadedmetadata', () => {
        showVideoControls();
        updateProgressBar();
    });

    if (progressBar) {
        progressBar.addEventListener('input', (e) => {
            if (videoDisplay.duration) {
                videoDisplay.currentTime = (e.target.value / 100) * videoDisplay.duration;
            }
        });
    }

    // --- Upload ---
    function setupUploadListeners() {
        if (!uploadButton) return;
        uploadFileInput.addEventListener('change', handleFilesSelected);
        uploadButton.addEventListener('click', handleUpload);

        // Fix syntax error here: removed extra quote
        ['dragenter', 'dragover'].forEach(evt => {
            uploadDropZone.addEventListener(evt, (e) => {
                e.preventDefault();
                uploadDropZone.classList.add('drag-over');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            uploadDropZone.addEventListener(evt, (e) => {
                e.preventDefault();
                uploadDropZone.classList.remove('drag-over');
            });
        });
        uploadDropZone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length) {
                uploadFileInput.files = e.dataTransfer.files;
                handleFilesSelected({ target: uploadFileInput });
            }
        });
    }

    function handleFilesSelected(e) {
        const files = e.target.files;
        uploadPreviewArea.innerHTML = '';
        uploadButton.disabled = !files.length;
        dropZoneText.innerText = files.length ? `${files.length} file(s)` : 'Drag files here';

        Array.from(files).forEach(f => {
            const d = document.createElement('div');
            d.innerText = `${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`;
            uploadPreviewArea.appendChild(d);
        });
    }

    function handleUpload() {
        const files = uploadFileInput.files;
        if (!files.length) return;

        uploadButton.disabled = true;
        uploadStatusArea.innerHTML = 'Uploading...';

        const fd = new FormData();
        Array.from(files).forEach(f => fd.append('mediaFiles[]', f));

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'upload_handler.php', true);

        // Add CSRF token check if available in meta tag later? 
        // For now, standard session based auth handles simple security.

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                if (uploadProgressBar) uploadProgressBar.value = pct;
                if (uploadProgressPercent) uploadProgressPercent.innerText = `${pct}%`;
            }
        };

        xhr.onload = () => {
            uploadButton.disabled = false;
            try {
                const res = JSON.parse(xhr.responseText);
                uploadStatusArea.innerHTML = res.messages.join('<br>');
                if (res.status === 'success') fetchMediaList();
            } catch (e) {
                uploadStatusArea.innerText = 'Upload Error: ' + xhr.status;
            }
        };

        xhr.onerror = () => {
            uploadButton.disabled = false;
            uploadStatusArea.innerText = 'Network Error';
        };

        xhr.send(fd);
    }

    // --- Delete ---
    function setupDeleteListener() {
        if (!mediaListElement) return;
        mediaListElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-media-btn');
            if (btn) {
                fileToDelete = btn.dataset.filename;
                showPopup('Confirm Delete', `Delete "${fileToDelete}"?`, 'confirm');
            }
        });
    }

    async function deleteFileFromServer(fname) {
        try {
            const res = await fetch('delete.php', {
                method: 'DELETE',
                body: JSON.stringify({ filename: fname }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.status === 'success') {
                showPopup('Deleted', `"${fname}" has been deleted.`, 'success');
                fetchMediaList();
                // Remove from playlist if present
                const removedIdx = playlist.findIndex(p => p.filename === fname);
                if (removedIdx > -1) removeItemFromPlaylist(removedIdx);
            } else {
                throw new Error(data.message);
            }
        } catch (e) {
            showPopup('Error', e.message, 'error');
        }
    }

    // --- Storage Utils ---
    function savePlaylistToLocalStorage() {
        localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(playlist.map(i => i.path)));
    }
    function loadPlaylistFromLocalStorage() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYLIST));
            if (Array.isArray(saved)) {
                playlist = saved.map(p => availableMedia.find(m => m.path === p)).filter(x => x);
                renderPlaylist();
            }
        } catch (e) { }
    }

    function saveVolume() { localStorage.setItem(STORAGE_KEYS.VOLUME, JSON.stringify({ v: currentVolume, m: isMuted })); }
    function loadVolume() {
        try {
            const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOLUME));
            if (s) { currentVolume = s.v; isMuted = s.m; updateVolume(); }
        } catch (e) { }
    }

    function saveRepeatMode() { localStorage.setItem(STORAGE_KEYS.REPEAT_MODE, repeatMode); }
    function loadRepeatMode() {
        repeatMode = localStorage.getItem(STORAGE_KEYS.REPEAT_MODE) || 'none';
        if (repeatButton) {
            repeatButton.classList.toggle('active', repeatMode !== 'none');
            let inner = '<i class="fas fa-repeat"></i>';
            if (repeatMode === 'one') inner += '<span>1</span>';
            repeatButton.innerHTML = inner;
        }
    }

    function updateVolume() {
        videoDisplay.volume = isMuted ? 0 : currentVolume;
        if (volumeSlider) volumeSlider.value = isMuted ? 0 : currentVolume;
        if (volumeButton) {
            const i = volumeButton.querySelector('i');
            i.className = isMuted || currentVolume === 0 ? 'fas fa-volume-xmark' :
                currentVolume < 0.5 ? 'fas fa-volume-low' : 'fas fa-volume-high';
        }
    }

    function toggleMute() {
        isMuted = !isMuted;
        if (!isMuted && currentVolume === 0) {
            currentVolume = 0.5;
        }
        updateVolume();
        saveVolume();
    }

    function updateProgressBar() {
        if (!videoDisplay || !progressBar) return;
        if (isNaN(videoDisplay.duration) || videoDisplay.duration === 0) return;

        const pct = (videoDisplay.currentTime / videoDisplay.duration) * 100;
        progressBar.value = pct;

        if (currentTimeElement) {
            currentTimeElement.textContent = formatTime(videoDisplay.currentTime);
        }
        if (durationTimeElement) {
            durationTimeElement.textContent = formatTime(videoDisplay.duration);
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updatePlayerControlsState() {
        const has = playlist.length > 0;
        if (playPauseButton) playPauseButton.disabled = !has;
        if (fullscreenButton) fullscreenButton.disabled = currentMediaIndex === -1;
    }

    function updatePlayPauseButton() {
        if (playPauseButton) {
            const i = playPauseButton.querySelector('i');
            i.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    function showVideoControls() { if (progressControls) progressControls.classList.add('visible'); }
    function hideVideoControls() { if (progressControls) progressControls.classList.remove('visible'); }

    function updateUI() {
        renderPlaylist();
        updatePlayerControlsState();
        updateWakeLockIndicator();
    }

    function updateFooterYear() {
        const y = document.getElementById('currentYear');
        if (y) y.innerText = new Date().getFullYear();
    }

    // --- Fullscreen ---
    function toggleFullscreen() {
        const el = playerContainer;
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(e => console.error(e));
        } else {
            document.exitFullscreen();
        }
    }

});