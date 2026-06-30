/* =========================================================
   chapters.js — Timeline Renderer
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('id');

    // Find subject across all departments
    let subject = null;
    for (const dept in MATERIALS) {
        const found = MATERIALS[dept].find(m => m.id === subjectId);
        if (found) { subject = found; break; }
    }

    if (!subject) {
        document.body.innerHTML = '<h1 style="color:white;text-align:center;margin-top:20%;">Subject Not Found</h1>';
        return;
    }

    // Set Theme Colors
    document.documentElement.style.setProperty('--subject-accent', subject.accent);
    document.documentElement.style.setProperty('--subject-glow', subject.color);

    // Setup Hero
    document.getElementById('chap-subj-title').textContent = subject.title;

    // Set hero gradient background
    const heroBg = document.getElementById('chap-hero-bg');
    heroBg.style.background = `linear-gradient(135deg, ${subject.accent} 0%, ${subject.accent}E6 100%)`;

    // Mock Data for Chapters
    const chapters = [
        {
            num: 1,
            title: "Introduction & Basic Concepts",
            time: "2h 15m",
            lectures: [
                { id: 101, title: "Lec 1: Overview ", type: "pdf", url: "materials/Pdfs/dummy.pdf" },
                { id: 102, title: "Lec 2: First Principles", type: "pdf", url: "materials/Pdfs/Eco section 4 .pdf" },
                { id: 103, title: "Lec 3: Practical Examples", type: "pdf", url: "materials/dummy.pdf" }
            ]
        },
        {
            num: 2,
            title: "The Core Framework",
            time: "3h 40m",
            lectures: [
                { id: 201, title: "Lec 4: Deep Dive into Core", type: "video", url: "materials/dummy.mp4" },
                { id: 202, title: "Lec 5: Formulas & Models", type: "pdf", url: "materials/dummy.pdf" },
                { id: 203, title: "Lec 6: Applied Work", type: "video", url: "materials/dummy.mp4" },
                { id: 204, title: "Lec 7: Review Questions", type: "pdf", url: "materials/dummy.pdf" }
            ]
        },
        {
            num: 3,
            title: "Advanced Applications",
            time: "4h 20m",
            lectures: [
                { id: 301, title: "Lec 8: Edge Cases", type: "video", url: "materials/dummy.mp4" },
                { id: 302, title: "Lec 9: Complex Scenarios", type: "pdf", url: "materials/dummy.pdf" },
                { id: 303, title: "Lec 10: Case Studies", type: "video", url: "materials/dummy.mp4" },
                { id: 304, title: "Lec 11: Exam Focus", duration: "65m" }
            ]
        }
    ];

    const timelineContainer = document.getElementById('timeline-container');

    window.toggleChapter = function (element) {
        const card = element.closest('.chap-card');
        card.classList.toggle('expanded');
    };
    window.markLectureDone = function (event, element, lecId) {
        event.stopPropagation(); // Stop the click from closing the chapter

        // Toggle the UI state
        element.classList.add('done');

        // Save to localStorage
        const completed = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
        completed[lecId] = true;
        localStorage.setItem('soCompletedLectures', JSON.stringify(completed));
    };

    window.removeLectureDone = function (event, element, lecId) {
        event.preventDefault();
        event.stopPropagation();

        // Remove state
        const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
        delete completedLectures[lecId];
        localStorage.setItem('soCompletedLectures', JSON.stringify(completedLectures));

        // Remove done class
        const lecItem = element.closest('.lecture-item');
        if (lecItem) {
            lecItem.classList.remove('done');
        }
    };

    const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');

    const html = chapters.map((ch, chIndex) => {
        const lecturesHtml = ch.lectures.map((lec, lecIndex) => {
            const isPdf = lec.type === 'pdf';
            const isDone = completedLectures[lec.id] === true;

            // Find next lecture
            let nextLec = null;
            if (lecIndex + 1 < ch.lectures.length) {
                nextLec = ch.lectures[lecIndex + 1];
            } else if (chIndex + 1 < chapters.length && chapters[chIndex + 1].lectures.length > 0) {
                nextLec = chapters[chIndex + 1].lectures[0];
            }

            let nextParams = '';
            if (nextLec) {
                nextParams = `&nextType=${nextLec.type}&nextUrl=${encodeURIComponent(nextLec.url)}&nextTitle=${encodeURIComponent(nextLec.title)}`;
            }

            // Get saved progress if video
            let savedProgressHtml = '';
            let isWatching = false;
            let actionText = isPdf ? "Open" : "Play";

            if (!isPdf && !isDone) {
                const storageKey = `so_vid_progress_${encodeURIComponent(lec.url)}`;
                const savedTime = localStorage.getItem(storageKey);
                if (savedTime && !isNaN(savedTime) && parseFloat(savedTime) > 0) {
                    isWatching = true;
                    const currentMins = Math.floor(parseFloat(savedTime) / 60);
                    const currentSecs = Math.floor(parseFloat(savedTime) % 60);
                    const currentFormatted = `${currentMins}:${currentSecs.toString().padStart(2, '0')}`;

                    // If we have duration loaded, use it
                    if (lec.duration) {
                        const totalMins = Math.floor(lec.duration / 60);
                        const totalSecs = Math.floor(lec.duration % 60);
                        actionText = `${currentFormatted} / ${totalMins}:${totalSecs.toString().padStart(2, '0')}`;
                    } else {
                        // Will be updated dynamically in onloadedmetadata
                        actionText = `${currentFormatted} / ...`;
                    }
                }
            }

            // Action button icon
            const actionIcon = isPdf
                ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                   </svg>`
                : (isWatching
                    ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                       </svg>`);

            const accentStyle = isPdf ? 'style="background: #ef4444; box-shadow: 0 2px 8px rgba(239,68,68,0.3);"' : '';

            // Only PDFs mark as done on click directly. Videos mark as done when finished playing.
            const clickHandler = isPdf ? `onclick="markLectureDone(event, this, ${lec.id})"` : '';

            return `
            <a href="player.html?id=${lec.id}&type=${lec.type}&url=${encodeURIComponent(lec.url)}&title=${encodeURIComponent(lec.title)}${nextParams}" class="lecture-item ${isPdf ? 'is-pdf' : 'is-video'} ${isDone ? 'done' : ''}" ${clickHandler}>
                <div class="lec-info">
                    <div class="lec-icon" ${accentStyle}>
                        ${isPdf
                    ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>`}
                    </div>
                    <div>
                        <h4 class="lec-title">${lec.title}</h4>
                        <span class="lec-duration" id="dur-${lec.id}">
                            <svg class="animate-spin h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Loading...
                        </span>
                    </div>
                </div>
                
                <div class="lec-play-btn-wrapper">
                    <div class="lec-play-btn">
                        <!-- Front Face (Play/Open) -->
                        <div class="btn-face btn-front">
                            <span id="action-text-${lec.id}">${actionText}</span>
                            ${actionIcon}
                        </div>
                        <!-- Back Face (Done) -->
                        <div class="btn-face btn-back" id="done-btn-${lec.id}">
                            <span>Done</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span class="lec-undone-btn" onclick="removeLectureDone(event, this, ${lec.id})" title="Undo">✕</span>
                        </div>
                    </div>
                </div>
            </a>
            `;
        }).join('');

        return `
        <div class="chap-node">
            <div class="chap-dot"></div>
            
            <div class="chap-card" onclick="toggleChapter(this)">
                <span class="chap-num">${String(ch.num).padStart(2, '0')}</span>
                
                <div class="chap-main-content">
                    <div class="chap-header">
                        <div class="chap-header-left">
                            <span class="chap-ch-label">Chapter ${ch.num}</span>
                            <h2 class="chap-title-text">${ch.title}</h2>
                        </div>
                        <div class="chap-toggle-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    <div class="chap-meta">
                        <div class="chap-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            ${ch.lectures.length} Lectures
                        </div>
                        <div class="chap-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            ${ch.time}
                        </div>
                    </div>
                </div>

                <div class="chap-lectures-wrapper">
                    <div class="chap-lectures-inner">
                        <div class="chap-lectures-list">
                            ${lecturesHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    timelineContainer.innerHTML = html;

    // Optional: GSAP Animation for staggered entrance
    if (typeof gsap !== 'undefined') {
        gsap.from('.chap-node', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.2)'
        });
    }

    // Process metadata asynchronously
    if (window['pdfjs-dist/build/pdf']) {
        window.pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    chapters.forEach(ch => {
        const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');

        ch.lectures.forEach(lec => {
            if (lec.type === 'video') {
                const videoEl = document.createElement('video');
                videoEl.src = lec.url;
                videoEl.onloadedmetadata = () => {
                    lec.duration = videoEl.duration;
                    const durationSpan = document.getElementById(`dur-${lec.id}`);
                    if (durationSpan) {
                        durationSpan.textContent = formatDuration(videoEl.duration);
                    }

                    // Dynamically update the action text for progress now that we have duration
                    const isDone = completedLectures[lec.id] === true;
                    if (!isDone) {
                        const storageKey = `so_vid_progress_${encodeURIComponent(lec.url)}`;
                        const savedTime = localStorage.getItem(storageKey);
                        if (savedTime && !isNaN(savedTime) && parseFloat(savedTime) > 0) {
                            const actionSpan = document.getElementById(`action-text-${lec.id}`);
                            if (actionSpan) {
                                const mCurrent = Math.floor(parseFloat(savedTime) / 60);
                                const sCurrent = Math.floor(parseFloat(savedTime) % 60);
                                const mTotal = Math.floor(lec.duration / 60);
                                const sTotal = Math.floor(lec.duration % 60);
                                actionSpan.textContent = `${mCurrent}:${sCurrent.toString().padStart(2, '0')} / ${mTotal}:${sTotal.toString().padStart(2, '0')}`;
                            }
                        }
                    }
                };
            } else if (lec.type === 'pdf') {
                const durationSpan = document.getElementById(`dur-${lec.id}`);
                if (window.pdfjsLib && durationSpan) {
                    pdfjsLib.getDocument(lec.url).promise.then(pdf => {
                        durationSpan.innerHTML = pdf.numPages + ' Pages';
                    }).catch(err => {
                        durationSpan.innerHTML = "N/A";
                    });
                } else {
                    durationSpan.innerHTML = "PDF Lib Missing";
                }
            }
        });
    });

    function formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return "N/A";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    }
});
