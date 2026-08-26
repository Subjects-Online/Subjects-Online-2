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

    // Force Amber Theme Colors for this page
    document.documentElement.style.setProperty('--subject-accent', '#f59e0b');
    document.documentElement.style.setProperty('--subject-glow', '#fcd34d');

    // Setup Hero
    document.getElementById('chap-subj-title').textContent = subject.title;

    // The background is now purely handled in qa.html with the app-bg-container class.

    const defaultChapters = [
        {
            num: 1, title: "Q&A - Part One", time: "45m",
            lectures: [
                { id: 4001, title: "Q&A 1: Basics", type: "pdf", url: "materials/dummy.pdf" },
                { id: 4002, title: "Q&A 2: Core Concepts", type: "pdf", url: "materials/dummy.pdf" }
            ]
        }
    ];

    // Load chapters for the specific subject, or fallback to default
    const chapters = (typeof getSubjectSectionData === 'function')
        ? getSubjectSectionData(subject, 'qa')
        : ((subject.content && subject.content.qa && subject.content.qa.length > 0) ? subject.content.qa : defaultChapters);

    const timelineContainer = document.getElementById('timeline-container');

    window.toggleChapter = function (element) {
        const card = element.closest('.chap-card');
        card.classList.toggle('expanded');
    };
    window.markLectureDone = function (event, element, lecId) {
        event.stopPropagation();
        element.classList.add('done');
        const key = subjectId + '_' + lecId;
        const completed = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');
        completed[key] = Date.now();
        localStorage.setItem('soCompletedQA', JSON.stringify(completed));
    };

    window.removeLectureDone = function (event, element, lecId) {
        event.preventDefault();
        event.stopPropagation();
        const key = subjectId + '_' + lecId;
        const completedLectures = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');
        delete completedLectures[key];
        localStorage.setItem('soCompletedQA', JSON.stringify(completedLectures));
        const lecItem = element.closest('.lecture-item');
        if (lecItem) {
            lecItem.classList.remove('done');
        }
    };

    window.toggleCircleDone = function (event, btn, lecId) {
        event.preventDefault();
        event.stopPropagation();
        const lecItem = btn.closest('.lecture-item');
        const isDone = btn.classList.contains('is-done');
        const key = subjectId + '_' + lecId;
        const completed = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');
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
        localStorage.setItem('soCompletedQA', JSON.stringify(completed));
        updateSidebarProgress();
    };

    // ── Sidebar Progress Update ───────────────────────────
    function updateSidebarProgress() {
        const completed = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');

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

    const completedLectures = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');

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

            const offlineLib = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
            const inLib = isPdf && offlineLib.some(item => 
                (item.subjectId === subjectId && String(item.lecId) === String(lec.id)) ||
                (item.title === lec.title && item.url === lec.url) ||
                (item.id === `${subjectId}_${lec.id}`)
            );

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
                        ${isPdf ? `
                        <div class="lec-actions-row">
                            <a href="${lec.url}" download target="_blank" class="lec-open-btn lec-download-btn" onclick="event.stopPropagation()">
                                Download
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                            </a>
                            <button type="button" class="lec-open-btn lec-lib-btn ${inLib ? 'in-library' : ''}" onclick="togglePdfLibrary(event, this, '${encodeURIComponent(lec.title)}', '${encodeURIComponent(lec.url)}', '${subjectId}', '${lec.id}')" title="${inLib ? 'Remove from Library' : 'Add to Library'}">
                                <span class="lib-btn-content">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 lib-icon-plus" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 lib-icon-minus" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                                    </svg>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 lib-icon-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                        ` : `
                        <a href="player.html?id=${lec.id}&subjectId=${subjectId}&type=${lec.type}&url=${encodeURIComponent(lec.url)}&title=${encodeURIComponent(lec.title)}&sec=qa${nextParams}" class="lec-open-btn" onclick="event.stopPropagation()">
                            Open
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </a>
                        `}
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
            <span class="chap-num font-heading font-black italic absolute -top-4 right-2 text-amber-100 opacity-40 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none select-none text-[5rem] leading-none" style="text-shadow: 0 10px 30px rgba(245,158,11,0.1);">${String(ch.num).padStart(2, '0')}</span>
            
            <div class="chap-main-content relative z-10">
                <div class="chap-header flex items-start justify-between">
                    <div class="chap-header-left flex flex-col gap-1.5">
                        <span class="chap-ch-label text-[0.65rem] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-50/50 w-fit px-2.5 py-1 rounded-md border border-amber-100/50">Part ${ch.num}</span>
                        <h2 class="chap-title-text font-heading text-[1.75rem] font-bold text-slate-800 leading-[1.15] tracking-tight group-hover:text-amber-700 transition-colors">${ch.title}</h2>
                    </div>
                    <div class="chap-toggle-icon w-10 h-10 rounded-full bg-white/60 border border-white/80 shadow-[0_4px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)] transition-all duration-300 transform group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                
                <div class="chap-meta">
                    <div class="chap-meta-item shadow-sm border border-amber-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        ${ch.lectures.length} Lectures
                    </div>
                    <div class="chap-meta-item shadow-sm border border-amber-50/50">
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
            let pdfTotal = 0, pdfDone = 0;
            let vidTotal = 0, vidDone = 0;
            const completed = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');
            
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
        const completedLectures = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');

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
