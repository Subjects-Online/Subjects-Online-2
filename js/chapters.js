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

    // Force Sky Blue Theme Colors for this page
    document.documentElement.style.setProperty('--subject-accent', '#0ea5e9'); // Sky Blue 500
    document.documentElement.style.setProperty('--subject-glow', '#7dd3fc');   // Sky Blue 300

    // Setup Hero
    document.getElementById('chap-subj-title').textContent = subject.title;

    // The background is now purely handled in chapters.html with the app-bg-container class.

    const defaultChapters = [
        {
            num: 1, title: "Introduction & Basic Concepts", time: "2h 15m",
            lectures: [
                { id: 101, title: "Lec 1: Overview", type: "pdf", url: "materials/dummy.pdf" },
                { id: 102, title: "Lec 2: First Principles", type: "pdf", url: "materials/dummy.pdf" }
            ]
        },
        {
            num: 2, title: "The Core Framework", time: "3h 40m",
            lectures: [
                { id: 201, title: "Lec 3: Deep Dive into Core", type: "video", url: "materials/dummy.mp4" },
                { id: 202, title: "Lec 4: Review Questions", type: "pdf", url: "materials/dummy.pdf" }
            ]
        }
    ];

    // Load chapters for the specific subject, or fallback to default
    const chapters = (subject.content && subject.content.chapters) ? subject.content.chapters : defaultChapters;

    const timelineContainer = document.getElementById('timeline-container');

    window.toggleChapter = function (element) {
        const card = element.closest('.chap-card');
        card.classList.toggle('expanded');
    };
    window.markLectureDone = function (event, element, lecId) {
        event.stopPropagation();
        element.classList.add('done');
        const key = subjectId + '_' + lecId;
        const completed = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
        completed[key] = Date.now();
        localStorage.setItem('soCompletedLectures', JSON.stringify(completed));
    };

    window.removeLectureDone = function (event, element, lecId) {
        event.preventDefault();
        event.stopPropagation();
        const key = subjectId + '_' + lecId;
        const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
        delete completedLectures[key];
        localStorage.setItem('soCompletedLectures', JSON.stringify(completedLectures));
        const lecItem = element.closest('.lecture-item');
        if (lecItem) lecItem.classList.remove('done');
    };

    window.toggleCircleDone = function (event, btn, lecId) {
        event.preventDefault();
        event.stopPropagation();
        const lecItem = btn.closest('.lecture-item');
        const isDone = btn.classList.contains('is-done');
        const key = subjectId + '_' + lecId;
        const completed = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
        if (isDone) {
            btn.classList.remove('is-done');
            lecItem.classList.remove('done');
            delete completed[key];
        } else {
            btn.classList.add('is-done');
            lecItem.classList.add('done');
            completed[key] = Date.now();
            btn.classList.add('burst');
            setTimeout(() => btn.classList.remove('burst'), 600);
        }
        localStorage.setItem('soCompletedLectures', JSON.stringify(completed));
        updateSidebarProgress();
    };

    // ── Sidebar Progress Update ───────────────────────────
    function updateSidebarProgress() {
        const completed = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');

        let total = 0;
        let done  = 0;
        chapters.forEach(ch => {
            ch.lectures.forEach(lec => {
                total++;
                if (completed[subjectId + '_' + lec.id]) done++;
            });
        });

        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        // Update text
        const progressText = document.getElementById('progress-text-circle');
        const progressCount = document.getElementById('progress-count');
        const progressBar  = document.getElementById('circular-progress-bar');

        if (progressText)  progressText.textContent  = `${pct}%`;
        if (progressCount) progressCount.textContent = `${done} of ${total} lectures completed`;
        if (progressBar) {
            const circumference = 264; // 2 * π * 42
            const offset = circumference - (pct / 100) * circumference;
            progressBar.style.strokeDashoffset = offset;
        }
    }

    const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');

    const html = chapters.map((ch, chIndex) => {
        const lecturesHtml = ch.lectures.map((lec, lecIndex) => {
            const isPdf = lec.type === 'pdf';
            const isDone = !!completedLectures[subjectId + '_' + lec.id];

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
            <div class="lecture-item ${isPdf ? 'is-pdf' : 'is-video'} ${isDone ? 'done' : ''}" ${clickHandler}>
                <div class="lec-info">
                    <div class="lec-icon" ${accentStyle}>
                        ${isPdf
                    ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>`}
                    </div>
                    <div class="lec-text-col">
                        <h4 class="lec-title">${lec.title}</h4>
                        <span class="lec-duration" id="dur-${lec.id}">
                            <svg class="animate-spin h-3 w-3 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Loading...
                        </span>
                        <a href="player.html?id=${lec.id}&subjectId=${subjectId}&type=${lec.type}&url=${encodeURIComponent(lec.url)}&title=${encodeURIComponent(lec.title)}${nextParams}" class="lec-open-btn" onclick="event.stopPropagation()">
                            Open
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </a>
                    </div>
                </div>

                <button class="lec-circle-btn ${isDone ? 'is-done' : ''}" onclick="toggleCircleDone(event, this, ${lec.id})" title="Mark as done">
                    <svg class="circle-check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            `;
        }).join('');


        return `
        <div class="chap-card group relative" onclick="toggleChapter(this)">
            <span class="chap-num font-heading font-black italic absolute -top-4 right-2 text-blue-100 opacity-40 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none select-none text-[5rem] leading-none" style="text-shadow: 0 10px 30px rgba(14,165,233,0.1);">${String(ch.num).padStart(2, '0')}</span>
            
            <div class="chap-main-content relative z-10">
                <div class="chap-header flex items-start justify-between">
                    <div class="chap-header-left flex flex-col gap-1.5">
                        <span class="chap-ch-label text-[0.65rem] font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-50/50 w-fit px-2.5 py-1 rounded-md border border-blue-100/50">Chapter ${ch.num}</span>
                        <h2 class="chap-title-text font-heading text-[1.75rem] font-bold text-slate-800 leading-[1.15] tracking-tight group-hover:text-blue-700 transition-colors">${ch.title}</h2>
                    </div>
                    <div class="chap-toggle-icon w-10 h-10 rounded-full bg-white/60 border border-white/80 shadow-[0_4px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] transition-all duration-300 transform group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                
                <div class="chap-meta">
                    <div class="chap-meta-item shadow-sm border border-blue-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        ${ch.lectures.length} Lectures
                    </div>
                    <div class="chap-meta-item shadow-sm border border-blue-50/50">
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
        `;
    }).join('');

    timelineContainer.innerHTML = html;

    // Show correct progress on initial load
    updateSidebarProgress();

    // Optional: GSAP Animation for staggered entrance
    if (typeof gsap !== 'undefined') {
        gsap.from('.chap-card', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.2)'
        });
    }

    // Progress Tooltip Logic
    const progressWrapper = document.getElementById('progress-ring-wrapper');
    const progressTooltip = document.getElementById('progress-tooltip');
    
    if (progressWrapper && progressTooltip) {
        progressWrapper.addEventListener('mouseenter', () => {
            // Calculate totals
            let pdfTotal = 0, pdfDone = 0;
            let vidTotal = 0, vidDone = 0;
            const completed = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
            
            chapters.forEach(ch => {
                ch.lectures.forEach(lec => {
                    if (lec.type === 'pdf') {
                        pdfTotal++;
                        if (completed[subjectId + '_' + lec.id]) pdfDone++;
                    } else {
                        vidTotal++;
                        if (completed[subjectId + '_' + lec.id]) vidDone++;
                    }
                });
            });

            const pdfTooltipSpan = document.getElementById('tooltip-pdfs');
            const vidTooltipSpan = document.getElementById('tooltip-videos');
            
            if(pdfTooltipSpan) pdfTooltipSpan.textContent = `${pdfDone} / ${pdfTotal}`;
            if(vidTooltipSpan) vidTooltipSpan.textContent = `${vidDone} / ${vidTotal}`;

            progressTooltip.style.opacity = '1';
            progressTooltip.style.transform = 'translateX(-50%) scale(1)';
        });

        progressWrapper.addEventListener('mouseleave', () => {
            progressTooltip.style.opacity = '0';
            progressTooltip.style.transform = 'translateX(-50%) scale(0.92)';
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
                    const isDone = !!completedLectures[subjectId + '_' + lec.id];
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
