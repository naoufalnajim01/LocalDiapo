<?php
require_once 'auth.php';
requireLogin();
?>
<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="LocalDiapo - Professional media player for images, videos and PDFs">
    <title>LocalDiapo - Professional Media Player</title>

    <!-- Fonts - Trebuchet MS for professional look -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    
    <!-- Stylesheet -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="player-container" id="playerContainer">
        <!-- Header -->
        <header class="player-header">
            <div class="header-left">
                <img src="assets/logo.png" alt="LocalDiapo Logo" style="height: 40px;">
                <h1 class="player-title">LocalDiapo</h1>
            </div>
            
            <div class="header-right">
                <!-- Wake Lock Indicator -->
                <div id="wakeLockIndicator" class="wake-lock-indicator" title="Screen awake">
                    <i class="fas fa-lock"></i>
                    <span>Active</span>
                </div>
                
                <!-- Theme Toggle -->
                <button id="themeToggle" class="theme-toggle" title="Toggle Theme" aria-label="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
                
                <!-- Logout Button -->
                <button id="logoutBtn" class="logout-btn" title="Logout" aria-label="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="player-main">
            <!-- Player Core (Left Side) -->
            <section class="player-core">
                <!-- Media Display -->
                <div id="mediaDisplay" class="media-display">
                    <img id="imageDisplay" class="media-display__item" alt="Media Image"/>
                    <video id="videoDisplay" class="media-display__item"></video>
                    <object id="pdfDisplay" data="" type="application/pdf" class="media-display__item">
                        <p>PDF not supported. <a id="pdfFallbackLink" href="#">Download PDF</a></p>
                    </object>
                    
                    <!-- Media Overlay -->
                    <div class="media-overlay" id="mediaOverlay">
                        <span id="currentMediaTitle">No media loaded</span>
                    </div>
                    
                    <!-- Loading Spinner -->
                    <div class="loading-spinner" id="loadingSpinner"></div>
                </div>

                <!-- Progress Controls (for videos) -->
                <div class="progress-controls" id="progressControls">
                    <input type="range" id="progressBar" class="progress-bar" value="0" max="100" step="0.1" aria-label="Progress">
                    <div class="time-display">
                        <span id="currentTime">00:00</span> / <span id="durationTime">00:00</span>
                    </div>
                </div>

                <!-- Playback Controls -->
                <div class="controls-core">
                    <button id="prevButton" class="control-button" title="Previous" aria-label="Previous">
                        <i class="fas fa-backward-step"></i>
                    </button>
                    
                    <button id="playPauseButton" class="control-button play" title="Play/Pause" aria-label="Play/Pause">
                        <i class="fas fa-play"></i>
                    </button>
                    
                    <button id="nextButton" class="control-button" title="Next" aria-label="Next">
                        <i class="fas fa-forward-step"></i>
                    </button>
                    
                    <button id="repeatButton" class="control-button" title="Repeat (Off)" aria-label="Repeat mode">
                        <i class="fas fa-repeat"></i>
                    </button>
                    
                    <div class="volume-control">
                        <button id="volumeButton" class="control-button" title="Volume" aria-label="Volume">
                            <i class="fas fa-volume-high"></i>
                        </button>
                        <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.01" value="1" aria-label="Volume slider">
                    </div>
                    
                    <button id="fullscreenButton" class="control-button" title="Fullscreen" aria-label="Fullscreen">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </section>

            <!-- Sidebar (Right Side) -->
            <aside class="sidebar">
                <!-- Tabs -->
                <div class="sidebar-tabs" role="tablist">
                    <button class="tab-button active" data-tab="playlist" role="tab" aria-selected="true" aria-controls="playlistPane">
                        <i class="fas fa-list"></i> Playlist
                    </button>
                    <button class="tab-button" data-tab="library" role="tab" aria-selected="false" aria-controls="libraryPane">
                        <i class="fas fa-photo-film"></i> Library
                    </button>
                    <button class="tab-button" data-tab="upload" role="tab" aria-selected="false" aria-controls="uploadPane">
                        <i class="fas fa-cloud-upload-alt"></i> Upload
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="sidebar-content">
                    <!-- Playlist Tab -->
                    <div class="tab-pane active" id="playlistPane" role="tabpanel">
                        <ul id="playlist" class="playlist-list">
                            <li class="empty-playlist-message">Playlist is empty.</li>
                        </ul>
                        
                        <div class="playlist-controls">
                            <button id="clearPlaylistBtn" class="btn btn-secondary" title="Clear Playlist">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                            <button id="shufflePlaylistBtn" class="btn btn-secondary" title="Shuffle">
                                <i class="fas fa-shuffle"></i> Shuffle
                            </button>
                        </div>
                    </div>

                    <!-- Library Tab -->
                    <div class="tab-pane" id="libraryPane" role="tabpanel">
                        <div class="search-bar">
                            <input type="text" id="mediaSearch" placeholder="Search media..." aria-label="Search media" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        
                        <ul id="mediaList" class="media-list">
                            <li class="loading-placeholder">Loading...</li>
                        </ul>
                        
                        <button id="addToPlaylistBtn" class="btn btn-primary add-button" disabled style="margin-top: 10px; width: 100%;">
                            <i class="fas fa-plus"></i> Add to Playlist
                        </button>
                    </div>

                    <!-- Upload Tab -->
                    <div class="tab-pane" id="uploadPane" role="tabpanel">
                        <div style="font-weight: bold; margin-bottom: 10px;">Add Media</div>
                        
                        <div class="upload-form-area">
                            <label for="uploadFileInput" class="upload-drop-zone" id="uploadDropZone">
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <span id="dropZoneText">Drag & Drop files here</span>
                                <input type="file" name="mediaFiles[]" id="uploadFileInput" class="upload-input-hidden" multiple accept=".jpg,.jpeg,.png,.mp4,.webm,.pdf" style="display:none;">
                            </label>
                            
                            <div id="uploadPreviewArea" style="max-height: 100px; overflow-auto; font-size: 0.8em; margin: 10px 0;"></div>
                            
                            <button type="button" id="uploadButton" class="btn btn-primary upload-button" disabled style="width: 100%;">
                                <i class="fas fa-upload"></i> Upload Files
                            </button>
                            
                            <div id="uploadProgressContainer" class="upload-progress-container" style="display: none; margin-top: 10px;">
                                <progress id="uploadProgressBar" class="upload-progress-bar" value="0" max="100" style="width: 100%;"></progress>
                                <span id="uploadProgressPercent">0%</span>
                            </div>
                            
                            <div id="uploadStatusArea" class="upload-status-area" style="margin-top: 10px; font-size: 0.85em;"></div>
                        </div>
                    </div>
                </div>
            </aside>
        </main>

        <!-- Footer -->
        <footer class="app-footer">
            <span class="footer-copyright">
                © <span id="currentYear"></span> LocalDiapo - Conçu avec <i class="fas fa-heart heart-icon"></i> par <strong>Naoufal NAJIM</strong>
            </span>
            <a href="https://github.com/naoufalnajim01" target="_blank" rel="noopener noreferrer" class="github-link" title="GitHub">
                <i class="fab fa-github"></i>
            </a>
        </footer>
    </div>

    <!-- Popup/Modal -->
    <div id="popup-overlay" class="popup-overlay" role="dialog" aria-modal="true">
        <div class="popup-box">
            <h3 id="popup-title">Title</h3>
            <p id="popup-message">Message</p>
            <div class="popup-actions">
                <button id="popup-confirm-btn" class="popup-btn confirm">Confirm</button>
                <button id="popup-cancel-btn" class="popup-btn cancel">Cancel</button>
                <button id="popup-ok-btn" class="popup-btn ok">OK</button>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script src="script.js"></script>
</body>
</html>