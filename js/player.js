/* =========================================================
   player.js — Logic for Custom Media Player
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get URL Parameters
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const url = params.get('url');
    const title = params.get('title');
    const nextUrl = params.get('nextUrl');
    const nextTitle = params.get('nextTitle');
    const nextType = params.get('nextType');
    const lecId = params.get('id');

    // UI Elements
    const titleEl = document.getElementById('player-title');
    const videoEl = document.getElementById('video-player');
    const pdfEl = document.getElementById('pdf-player');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    // 2. Set Title
    if (title) {
        titleEl.textContent = title;
        document.title = `${title} — Subjects Online`;
    } else {
        titleEl.textContent = "Material Player";
    }

    // 3. Setup Focus Mode
    const focusBtn = document.getElementById('focus-btn');
    if (focusBtn) {
        focusBtn.addEventListener('click', () => {
            document.body.classList.toggle('focus-mode');
            if (document.body.classList.contains('focus-mode')) {
                focusBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg> Exit Focus Mode`;
                focusBtn.classList.add('text-blue-400');
            } else {
                focusBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg> Focus Mode`;
                focusBtn.classList.remove('text-blue-400');
            }
        });

        // Also allow exiting Focus Mode with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) {
                focusBtn.click(); // Trigger the click to handle the UI swap correctly
            }
        });
    }

    // 4. Set Subject Color
    document.documentElement.style.setProperty('--subject-accent', '#3b82f6');

    // Global Player Reference for notes
    let globalPlayer = null;

    // 5. Initialize Player based on type
    if (!url || !type) {
        showError();
        return;
    }

    if (type === 'video') {
        // Initialize Video Player
        videoEl.classList.remove('hidden');

        // Determine which controls to show based on screen size
        const isMobile = window.innerWidth < 640;
        const playerControls = isMobile
            ? ['play-large', 'play', 'progress', 'current-time', 'settings', 'fullscreen']
            : [
                'play-large', 'restart', 'rewind', 'play', 'fast-forward',
                'progress', 'current-time', 'duration',
                'mute', 'volume', 'captions', 'settings',
                'pip', 'airplay', 'download', 'fullscreen'
            ];

        // Custom Controls & Settings for Plyr
        const player = new Plyr(videoEl, {
            controls: playerControls,
            settings: ['captions', 'quality', 'speed', 'loop'],
            quality: { default: 1080, options: [1080, 720, 480] },
            speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] },
            keyboard: { focused: true, global: true },
            tooltips: { controls: true, seek: true }
        });

        // Manually set sources with different sizes to trigger the Quality switcher UI
        // In a real app, these would be different URLs (e.g., vid-1080.mp4, vid-720.mp4)
        player.source = {
            type: 'video',
            title: title || 'Lecture Video',
            sources: [
                { src: url, type: 'video/mp4', size: 1080 },
                { src: url, type: 'video/mp4', size: 720 },
                { src: url, type: 'video/mp4', size: 480 }
            ]
        };

        const sidebar = document.getElementById('notes-sidebar');
        if (sidebar) {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('flex');
        }

        // Unique key for tracking this specific video's progress
        const storageKey = `so_vid_progress_${encodeURIComponent(url)}`;

        player.on('ready', () => {
            globalPlayer = player;
            hideLoading();
            loadNotes();

            // Resume from last saved time
            const savedTime = localStorage.getItem(storageKey);
            if (savedTime && !isNaN(savedTime)) {
                player.currentTime = parseFloat(savedTime);
                console.log(`Resumed from ${Math.floor(savedTime / 60)}m ${Math.floor(savedTime % 60)}s`);
            }
        });

        // Save progress every few seconds (using timeupdate event)
        player.on('timeupdate', () => {
            if (player.currentTime > 5 && !player.ended) {
                localStorage.setItem(storageKey, player.currentTime);
            }
        });

        let autoNextTimer = null;
        const nextTimerCircle = document.getElementById('next-timer-circle');

        // Auto Next Logic
        player.on('ended', () => {
            localStorage.removeItem(storageKey);

            // Mark lecture as fully completed
            if (lecId) {
                const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
                completedLectures[lecId] = true;
                localStorage.setItem('soCompletedLectures', JSON.stringify(completedLectures));
            }

            if (nextUrl) {
                const overlay = document.getElementById('auto-next-overlay');
                document.getElementById('next-lec-title').textContent = nextTitle || "Next Lecture";
                overlay.classList.remove('hidden');

                // Show notes if hidden, or focus mode disable
                document.body.classList.remove('focus-mode');

                let countdown = 5;
                document.getElementById('next-timer-text').textContent = countdown;
                if (nextTimerCircle) nextTimerCircle.style.strokeDashoffset = 0;

                autoNextTimer = setInterval(() => {
                    countdown--;

                    if (countdown >= 0) {
                        document.getElementById('next-timer-text').textContent = countdown;
                        if (nextTimerCircle) {
                            // Calculate stroke offset (283 is full circle circumference)
                            const offset = 283 - ((5 - countdown) / 5) * 283;
                            nextTimerCircle.style.strokeDashoffset = offset;
                        }
                    }

                    if (countdown <= 0) {
                        clearInterval(autoNextTimer);
                        window.location.href = `player.html?type=${nextType}&url=${encodeURIComponent(nextUrl)}&title=${encodeURIComponent(nextTitle)}`;
                    }
                }, 1000);

                document.getElementById('cancel-next-btn').onclick = () => {
                    clearInterval(autoNextTimer);
                    overlay.classList.add('hidden');
                };

                document.getElementById('play-next-btn').onclick = () => {
                    clearInterval(autoNextTimer);
                    window.location.href = `player.html?type=${nextType}&url=${encodeURIComponent(nextUrl)}&title=${encodeURIComponent(nextTitle)}`;
                };
            }
        });

        player.on('error', () => {
            showError();
        });

        // Fallback if ready event doesn't fire fast enough
        videoEl.addEventListener('canplay', hideLoading);
        videoEl.addEventListener('error', showError);

    } else if (type === 'pdf') {
        // Initialize PDF Viewer (Iframe)
        pdfEl.classList.remove('hidden');

        // Make PDF wrapper taller for better reading experience
        const wrapper = document.getElementById('player-wrapper');
        if (wrapper) {
            // Remove video-specific height constraints
            wrapper.classList.remove('h-[40vh]', 'min-h-[250px]', 'lg:max-h-[85vh]', 'lg:h-full');
            // Give it a much taller height for PDF reading
            wrapper.classList.add('h-[90vh]', 'min-h-[800px]', 'lg:h-[1200px]');
        }

        // Setup PDF Actions (Download & Library)
        const pdfActions = document.getElementById('pdf-actions');
        if (pdfActions) {
            pdfActions.classList.remove('hidden');
            pdfActions.classList.add('flex');
        }

        // Setup PDF Toolbar & Fullscreen
        const pdfToolbar = document.getElementById('pdf-toolbar');
        const pdfDocTitle = document.getElementById('pdf-doc-title');
        if (pdfToolbar) {
            pdfToolbar.classList.remove('hidden');
            if (pdfDocTitle) pdfDocTitle.textContent = title;

            const fsBtn = document.getElementById('pdf-fullscreen-btn');
            const fsIcon = document.getElementById('fs-icon');
            const fsText = document.getElementById('fs-text');

            if (fsBtn) {
                fsBtn.addEventListener('click', () => {
                    const elem = document.getElementById('player-wrapper');
                    if (!document.fullscreenElement) {
                        if (elem.requestFullscreen) elem.requestFullscreen();
                        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
                        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
                    } else {
                        if (document.exitFullscreen) document.exitFullscreen();
                        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                        else if (document.msExitFullscreen) document.msExitFullscreen();
                    }
                });

                document.addEventListener('fullscreenchange', () => {
                    if (document.fullscreenElement) {
                        fsText.textContent = 'Exit Fullscreen';
                        fsIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />`;
                    } else {
                        fsText.textContent = 'Fullscreen';
                        fsIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />`;
                    }
                });
            }
        }
        // Download Logic
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = title || 'Document.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        }

        // Offline Library Logic
        const libraryBtn = document.getElementById('add-library-btn');
        const libraryText = libraryBtn ? libraryBtn.querySelector('span') : null;

        // Check if already in library
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        const isInLibrary = library.some(item => item.url === url);

        if (isInLibrary && libraryText) {
            libraryText.textContent = 'Saved ✓';
            libraryBtn.classList.remove('text-blue-400', 'hover:text-blue-300', 'bg-blue-500/10', 'border-blue-500/20');
            libraryBtn.classList.add('text-emerald-400', 'bg-emerald-500/10', 'border-emerald-500/20');
        }

        if (libraryBtn && !isInLibrary) {
            libraryBtn.addEventListener('click', async () => {
                try {
                    const originalText = libraryText.textContent;
                    libraryText.textContent = 'Saving...';

                    const cache = await caches.open('offline-materials');
                    // Use add() which fetches and caches the resource
                    await cache.add(url);

                    // Add metadata to localStorage
                    library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
                    library.push({
                        id: Date.now().toString(),
                        title: title || 'Document',
                        type: 'pdf',
                        url: url,
                        dateAdded: new Date().toISOString()
                    });
                    localStorage.setItem('so_offline_library', JSON.stringify(library));

                    // Update UI
                    libraryText.textContent = 'Saved ✓';
                    libraryBtn.classList.remove('text-blue-400', 'hover:text-blue-300', 'bg-blue-500/10', 'border-blue-500/20');
                    libraryBtn.classList.add('text-emerald-400', 'bg-emerald-500/10', 'border-emerald-500/20');

                } catch (err) {
                    console.error('Failed to save to library:', err);
                    alert('Could not save file offline. It might be due to CORS restrictions on the server.');
                    if (libraryText) libraryText.textContent = originalText;
                }
            }, { once: true });
        }

        // Use Google Docs Viewer as a fallback/wrapper if needed, but modern browsers support local/remote PDFs directly in iframe.
        // For local testing with our dummy PDF, direct src works perfectly.
        // Append #view=FitH to force the PDF to fit the width of the viewer, making it easier to read
        pdfEl.src = url.includes('#') ? url : url + '#view=FitH&toolbar=0';

        // Hide loading after a short delay since iframe load events can be tricky with PDFs
        pdfEl.onload = hideLoading;

        // Fallback
        setTimeout(hideLoading, 1500);
    } else {
        showError();
    }

    // Utility Functions
    function hideLoading() {
        loadingState.classList.add('fade-out');
    }

    function showError() {
        loadingState.classList.add('fade-out');
        errorState.classList.remove('hidden');
    }

    // Notes System
    const notesKey = `so_notes_${encodeURIComponent(url)}`;
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteInput = document.getElementById('note-input');
    const notesList = document.getElementById('notes-list');
    const emptyMsg = document.getElementById('empty-notes-msg');

    if (addNoteBtn && noteInput) {
        addNoteBtn.addEventListener('click', () => {
            const text = noteInput.value.trim();
            if (!text || !globalPlayer) return;

            const time = globalPlayer.currentTime;
            const notes = JSON.parse(localStorage.getItem(notesKey) || '[]');
            notes.push({ time, text, id: Date.now() });

            // Sort notes by time
            notes.sort((a, b) => a.time - b.time);

            localStorage.setItem(notesKey, JSON.stringify(notes));
            noteInput.value = '';

            // Show a visual confirmation
            const originalText = addNoteBtn.innerHTML;
            addNoteBtn.innerHTML = 'Saved! ✓';
            setTimeout(() => addNoteBtn.innerHTML = originalText, 1500);

            renderNotes();
        });
    }

    function renderNotes() {
        if (!notesList) return;
        const notes = JSON.parse(localStorage.getItem(notesKey) || '[]');

        if (notes.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            document.querySelectorAll('.note-item').forEach(e => e.remove());
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        // Clear old
        document.querySelectorAll('.note-item').forEach(e => e.remove());

        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-item';

            const timeStr = formatDuration(note.time);

            div.innerHTML = `
                <span class="note-time-badge" onclick="seekTo(${note.time})">${timeStr}</span>
                <span class="note-delete" onclick="deleteNote(${note.id})">Delete</span>
                <p class="note-text mt-1">${note.text}</p>
            `;
            notesList.appendChild(div);
        });
    }

    window.seekTo = function (time) {
        if (globalPlayer) {
            globalPlayer.currentTime = time;
            globalPlayer.play();
        }
    };

    window.deleteNote = function (id) {
        let notes = JSON.parse(localStorage.getItem(notesKey) || '[]');
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem(notesKey, JSON.stringify(notes));
        renderNotes();
    };

    function formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
});
