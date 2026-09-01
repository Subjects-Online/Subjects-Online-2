/* ===================================================
   SUBJECTS ONLINE — Dashboard Home JS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ── Guard: redirect to login if not signed in ────────────────────────────
    requireAuth('login.html');

    const userName = localStorage.getItem('subjectsOnlineName') || 'Student';
    const userDept = localStorage.getItem('subjectsOnlineDept') || 'Accounting';
    const avatarImg = localStorage.getItem('subjectsOnlineAvatarImage') || null;

    // Top hero info
    const displayDept = document.getElementById('display-dept');
    const heroAvatar = document.getElementById('hero-avatar');

    // Feature 1: Time-based Greeting
    const greetingText = document.getElementById('greeting-text');
    if (greetingText) {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) greetingText.textContent = "Good Morning";
        else if (hour >= 12 && hour < 17) greetingText.textContent = "Good Afternoon";
        else if (hour >= 17 && hour < 22) greetingText.textContent = "Good Evening";
        else greetingText.textContent = "Late Night Study";
    }

    if (displayDept) displayDept.textContent = userDept;
    if (heroAvatar) {
        if (avatarImg) {
            heroAvatar.style.backgroundImage = `url(${avatarImg})`;
            heroAvatar.textContent = '';
            heroAvatar.classList.remove('bg-gradient-to-tr');
        } else {
            heroAvatar.textContent = userName[0].toUpperCase();
        }
    }

    // GSAP Stroke Drawing animation for name
    const nameTextEl = document.getElementById('display-name-text');
    const cursorEl = document.querySelector('.hero-cursor');
    if (cursorEl) cursorEl.style.display = 'none';
    if (nameTextEl) {
        setTimeout(() => gsapDrawName(nameTextEl, userName), 400);
    }

    // Spawn floating particles
    spawnHeroParticles();

    // ── Rotating Motivational Quote ──────────────────────────────────────────
    const quotes = [
        "Consistency is the bridge between goals and achievement.",
        "Knowledge is the only asset that compounds over time.",
        "Every page you study is a step ahead of yesterday.",
        "Discipline is choosing what you want most over what you want now.",
        "The secret of getting ahead is getting started.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "You don't rise to the level of your goals — you fall to the level of your systems.",
        "One hour of focused study beats three hours of distraction."
    ];
    const quoteEl = document.getElementById('hero-quote');
    if (quoteEl) {
        let quoteIndex = Math.floor(Math.random() * quotes.length);
        quoteEl.textContent = `"${quotes[quoteIndex]}"`;

        setInterval(() => {
            quoteEl.style.opacity = '0';
            quoteEl.style.transform = 'translateY(6px)';
            setTimeout(() => {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                quoteEl.textContent = `"${quotes[quoteIndex]}"`;
                quoteEl.style.opacity = '0.45';
                quoteEl.style.transform = 'translateY(0)';
            }, 600);
        }, 6000);
    }

    initAnimations();
    initHologramAvatarSequence();
    loadStats(userDept);
    loadPlanner();
    showSalawatNotification();
    initDashboardDownloadBtn();
});

/**
 * Renders a fixed, standalone PWA Download Icon button on top-right of Dashboard page ONLY
 */
function initDashboardDownloadBtn() {
    // Hide if already running in standalone PWA app mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone || localStorage.getItem('pwa-installed') === 'true') return;
    if (document.getElementById('dashboard-pwa-download-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'dashboard-pwa-download-btn';
    btn.title = 'Download App / تثبيت التطبيق';
    btn.setAttribute('aria-label', 'Download App');
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    `;

    document.body.appendChild(btn);

    if (!document.getElementById('dashboard-pwa-download-style')) {
        const style = document.createElement('style');
        style.id = 'dashboard-pwa-download-style';
        style.textContent = `
            #dashboard-pwa-download-btn {
                position: absolute;
                top: 22px;
                right: 22px;
                z-index: 99;
                width: 44px;
                height: 44px;
                border-radius: 14px;
                background: linear-gradient(135deg, #0ea5e9, #2563eb);
                border: 1px solid rgba(255, 255, 255, 0.4);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(14, 165, 233, 0.38), inset 0 1px 1px rgba(255, 255, 255, 0.4);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background 0.3s ease;
                backdrop-filter: blur(10px);
                user-select: none;
            }
            #dashboard-pwa-download-btn:hover {
                transform: scale(1.1) translateY(-2px);
                box-shadow: 0 12px 30px rgba(14, 165, 233, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.6);
                background: linear-gradient(135deg, #38bdf8, #1d4ed8);
            }
            #dashboard-pwa-download-btn:active {
                transform: scale(0.95);
            }
            #dashboard-pwa-download-btn svg {
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                transition: transform 0.3s ease;
            }
            #dashboard-pwa-download-btn:hover svg {
                transform: translateY(2px);
            }
        `;
        document.head.appendChild(style);
    }

    btn.addEventListener('click', () => {
        if (typeof window.triggerPWAInstall === 'function') {
            window.triggerPWAInstall();
        }
    });
}

/**
 * Shows an ultra-luxury "صلى على النبي" toast notification on the Dashboard page
 */
function showSalawatNotification() {
    if (document.getElementById('salawat-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'salawat-toast';
    toast.className = 'salawat-notification-toast';

    toast.innerHTML = `
        <div class="salawat-toast-icon">🤍</div>
        <span class="salawat-toast-text">صَلِّ عَلَى نَبِيِّنَا مُحَمَّدٍ</span>
        <span class="salawat-toast-sparkle">✨</span>
        <button class="salawat-toast-close" onclick="this.parentElement.remove()" title="إغلاق">✕</button>
    `;

    document.body.appendChild(toast);

    if (!document.getElementById('salawat-toast-style')) {
        const style = document.createElement('style');
        style.id = 'salawat-toast-style';
        style.textContent = `
            .salawat-notification-toast {
                position: fixed;
                top: 88px;
                right: 24px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 18px;
                border-radius: 9999px;
                background: rgba(255, 255, 255, 0.92);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border: 1px solid rgba(16, 185, 129, 0.3);
                box-shadow: 0 10px 30px -5px rgba(16, 185, 129, 0.2), 0 4px 12px rgba(0,0,0,0.04);
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                direction: rtl;
                animation: salawatSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                user-select: none;
            }
            .dark .salawat-notification-toast {
                background: rgba(15, 23, 42, 0.92);
                border-color: rgba(16, 185, 129, 0.4);
                box-shadow: 0 10px 30px -5px rgba(16, 185, 129, 0.3), 0 4px 15px rgba(0,0,0,0.4);
            }
            @keyframes salawatSlideIn {
                0% { opacity: 0; transform: translateY(-15px) scale(0.92); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .salawat-toast-icon {
                font-size: 16px;
                animation: salawatPulse 2s ease-in-out infinite;
            }
            @keyframes salawatPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            .salawat-toast-text {
                font-size: 0.92rem;
                font-weight: 800;
                color: #047857;
                letter-spacing: -0.01em;
            }
            .dark .salawat-toast-text {
                color: #34d399;
            }
            .salawat-toast-sparkle {
                font-size: 14px;
            }
            .salawat-toast-close {
                border: none;
                background: transparent;
                color: #94a3b8;
                font-size: 12px;
                cursor: pointer;
                padding: 2px 4px;
                margin-right: 4px;
                border-radius: 50%;
                transition: color 0.2s, background 0.2s;
                line-height: 1;
            }
            .salawat-toast-close:hover {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (toast && toast.parentElement) {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 400);
        }
    }, 6000);
}

function loadStats(deptText) {
    const deptKey = getDeptKey(deptText);
    const materials = MATERIALS[deptKey] || MATERIALS['accounting'];

    // Zero out stats for new student
    let openedSubjects = 0;
    const favs = getFavorites();
    const favoritesCount = favs.length;

    // Collect all lectures across all subjects in this dept
    let totalVideos = 0, totalPDFs = 0, doneVideos = 0, donePDFs = 0;
    let totalLectures = 0, doneLectures = 0;
    let subjectPctsSum = 0;
    let openedSubjectsCount = 0;

    const lastOpened = JSON.parse(localStorage.getItem('soLastOpened') || '{}');
    const contentSections = ['chapters', 'quizzes', 'sections', 'summaries', 'qa', 'finalReview'];

    materials.forEach(subj => {
        let subjTotalLectures = 0;
        let subjDoneLectures = 0;

        contentSections.forEach(sec => {
            const secData = (typeof getSubjectSectionData !== 'undefined')
                ? getSubjectSectionData(subj, sec)
                : (subj.content ? subj.content[sec] : null);
            if (!secData || secData.length === 0) return;

            const storeKey = (typeof SECTION_STORE_MAP !== 'undefined' && SECTION_STORE_MAP[sec])
                ? SECTION_STORE_MAP[sec]
                : 'soCompletedLectures';
            const store = JSON.parse(localStorage.getItem(storeKey) || '{}');

            secData.forEach(ch => {
                if (!ch.lectures) return;
                ch.lectures.forEach(lec => {
                    totalLectures++;
                    subjTotalLectures++;
                    const key = subj.id + '_' + lec.id;
                    const isDone = !!(store[key] ||
                        (sec === 'summaries' && store[subj.id + '_101'] && lec.id === 3001) ||
                        (sec === 'qa' && store[subj.id + '_101'] && lec.id === 4001));
                    if (lec.type === 'video') {
                        totalVideos++;
                        if (isDone) doneVideos++;
                    } else {
                        totalPDFs++;
                        if (isDone) donePDFs++;
                    }
                    if (isDone) {
                        doneLectures++;
                        subjDoneLectures++;
                    }
                });
            });
        });

        const subjPct = subjTotalLectures > 0 ? (subjDoneLectures / subjTotalLectures) * 100 : 0;
        subjectPctsSum += subjPct;
        if (subjDoneLectures > 0 || lastOpened[subj.id]) openedSubjectsCount++;
    });

    const totalSubjects = materials.length;
    const avgSubjectsPct = totalSubjects > 0 ? Math.min(100, Math.round(subjectPctsSum / totalSubjects)) : 0;
    const openedPDFsPct = totalPDFs > 0 ? Math.min(100, Math.round((donePDFs / totalPDFs) * 100)) : 0;
    const openedVideosPct = totalVideos > 0 ? Math.min(100, Math.round((doneVideos / totalVideos) * 100)) : 0;

    // Feature 13: Background Orbs Coloring by Department
    const orb1 = document.getElementById('bg-orb-1');
    const orb2 = document.getElementById('bg-orb-2');
    const orb3 = document.getElementById('bg-orb-3');
    if (orb1 && orb2 && orb3) {
        if (deptKey === 'accounting') {
            orb1.className = orb1.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-blue-600/20');
            orb2.className = orb2.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-cyan-600/10');
            orb3.className = orb3.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-emerald-500/10');
        } else if (deptKey === 'business') {
            orb1.className = orb1.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-indigo-600/20');
            orb2.className = orb2.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-fuchsia-600/10');
            orb3.className = orb3.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-purple-500/10');
        } else if (deptKey === 'economics') {
            orb1.className = orb1.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-amber-600/20');
            orb2.className = orb2.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-rose-600/10');
            orb3.className = orb3.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-orange-500/10');
        } else if (deptKey === 'statistics') {
            orb1.className = orb1.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-teal-600/20');
            orb2.className = orb2.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-blue-600/10');
            orb3.className = orb3.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-indigo-500/10');
        } else if (deptKey === 'is') {
            orb1.className = orb1.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-violet-600/20');
            orb2.className = orb2.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-pink-600/10');
            orb3.className = orb3.className.replace(/bg-\w+-\d+\/\d+/g, 'bg-fuchsia-500/10');
        }
    }

    // Feature 6: Update Card Summaries
    const libCount = document.getElementById('card-lib-count');
    const essaysCount = document.getElementById('card-essays-count');
    const favCount = document.getElementById('card-fav-count');
    const libProgress = document.getElementById('card-lib-progress');

    // Library (offline saved items) count
    const myLibCount = document.getElementById('card-my-lib-count');
    if (myLibCount) {
        const offlineLib = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        myLibCount.textContent = offlineLib.length;
    }

    if (libCount) libCount.textContent = `${totalSubjects} Subjects`;
    if (essaysCount) essaysCount.textContent = `${typeof ESSAYS !== 'undefined' ? ESSAYS.length : 0} Essays`;
    if (favCount) favCount.textContent = `${favoritesCount} Saved`;

    // Feature 4: Overall Progress Ring — based on actual completed lectures
    let progressPct = totalLectures > 0 ? Math.round((doneLectures / totalLectures) * 100) : 0;

    if (libProgress) libProgress.style.width = `${progressPct}%`;

    const progressRing = document.getElementById('hero-progress-ring');
    if (progressRing) {
        const circumference = 339.29;
        const offset = circumference - (progressPct / 100) * circumference;
        setTimeout(() => {
            progressRing.style.strokeDashoffset = offset;
        }, 500);
    }

    const statsHTML = `
        <!-- DESKTOP: Horizontal Progress Bars -->
        <div class="analytics-desktop-bars">
            <!-- Subjects -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>Subjects</span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-400"><span class="text-blue-500 font-extrabold">${openedSubjectsCount}</span>/${totalSubjects}</span>
                        <span class="text-sm font-black text-brand-textPrimary">${avgSubjectsPct}%</span>
                    </div>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${avgSubjectsPct}%; background: linear-gradient(90deg, #3b82f6, #60a5fa); box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>
                </div>
            </div>
            <!-- PDFs -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-purple-500"></span>PDFs</span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-400"><span class="text-purple-500 font-extrabold">${donePDFs}</span>/${totalPDFs}</span>
                        <span class="text-sm font-black text-brand-textPrimary">${openedPDFsPct}%</span>
                    </div>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${openedPDFsPct}%; background: linear-gradient(90deg, #8b5cf6, #a78bfa); box-shadow: 0 0 10px rgba(139,92,246,0.5);"></div>
                </div>
            </div>
            <!-- Videos -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-500"></span>Videos</span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-400"><span class="text-rose-500 font-extrabold">${doneVideos}</span>/${totalVideos}</span>
                        <span class="text-sm font-black text-brand-textPrimary">${openedVideosPct}%</span>
                    </div>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${openedVideosPct}%; background: linear-gradient(90deg, #f43f5e, #fb7185); box-shadow: 0 0 10px rgba(244,63,94,0.5);"></div>
                </div>
            </div>
        </div>

        <!-- MOBILE & TABLET: 3 Vertical Side-by-Side Tinted Glass Pillars -->
        <div class="analytics-mobile-pillars">
            <!-- Subjects Column -->
            <div class="analytics-pillar-card pillar-blue">
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1 mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Subjects
                </span>
                <span class="text-lg font-black text-brand-textPrimary leading-none mb-1">${avgSubjectsPct}%</span>
                <div class="analytics-pillar-tube">
                    <div class="analytics-pillar-fill" style="height: ${Math.max(8, avgSubjectsPct)}%; background: linear-gradient(180deg, #60a5fa, #3b82f6); box-shadow: 0 0 10px rgba(59,130,246,0.7);"></div>
                </div>
                <span class="text-[11px] font-bold text-slate-400"><span class="text-blue-500 font-extrabold">${openedSubjectsCount}</span>/${totalSubjects}</span>
            </div>

            <!-- PDFs Column -->
            <div class="analytics-pillar-card pillar-purple">
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-purple-500 flex items-center gap-1 mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>PDFs
                </span>
                <span class="text-lg font-black text-brand-textPrimary leading-none mb-1">${openedPDFsPct}%</span>
                <div class="analytics-pillar-tube">
                    <div class="analytics-pillar-fill" style="height: ${Math.max(8, openedPDFsPct)}%; background: linear-gradient(180deg, #a78bfa, #8b5cf6); box-shadow: 0 0 10px rgba(139,92,246,0.7);"></div>
                </div>
                <span class="text-[11px] font-bold text-slate-400"><span class="text-purple-500 font-extrabold">${donePDFs}</span>/${totalPDFs}</span>
            </div>

            <!-- Videos Column -->
            <div class="analytics-pillar-card pillar-rose">
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1 mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Videos
                </span>
                <span class="text-lg font-black text-brand-textPrimary leading-none mb-1">${openedVideosPct}%</span>
                <div class="analytics-pillar-tube">
                    <div class="analytics-pillar-fill" style="height: ${Math.max(8, openedVideosPct)}%; background: linear-gradient(180deg, #fb7185, #f43f5e); box-shadow: 0 0 10px rgba(244,63,94,0.7);"></div>
                </div>
                <span class="text-[11px] font-bold text-slate-400"><span class="text-rose-500 font-extrabold">${doneVideos}</span>/${totalVideos}</span>
            </div>
        </div>
    `;

    const analyticsBars = document.getElementById('bento-analytics-bars');
    if (analyticsBars) analyticsBars.innerHTML = statsHTML;

    const totalScore = document.getElementById('bento-total-score');
    if (totalScore) totalScore.innerHTML = `${progressPct}<span class="text-xl opacity-50">%</span>`;
}

function initAnimations() {
    // Register ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ── 1. HERO entrance (no scroll trigger — plays on load) ──────────────────
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTl
        .fromTo('.hero-container',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4 }, 0)
        .fromTo('.hero-avatar',
            { scale: 0.75, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.6)' }, 0.2)
        .fromTo('.hero-title > *',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 0.4)
        .fromTo('.scroll-indicator',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 1.2 }, 1);

    // ── 2. WHAT'S INSIDE section — scroll-triggered ──────────────────────────────
    if (typeof ScrollTrigger !== 'undefined') {

        // Words stagger up one by one
        gsap.fromTo('.wi-word',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: { trigger: '#wi-section', start: 'top 75%' },
                delay: 0.1
            }
        );

        // Divider reveals and grows
        gsap.fromTo('#wi-divider',
            { opacity: 0 },
            {
                opacity: 1, duration: 0.5,
                scrollTrigger: { trigger: '#wi-section', start: 'top 70%' },
                delay: 0.4,
                onComplete: () => {
                    const line = document.querySelector('.wi-divider-line');
                    if (line) gsap.fromTo(line, { width: '0' }, { width: '300px', duration: 1, ease: 'power3.out' });
                }
            }
        );

        // ── 3. CARDS — each card animates in on scroll ──────────────────────
        gsap.fromTo('.section-cards > a, .section-cards > div',
            { y: 60, opacity: 0, scale: 0.96 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: {
                    trigger: '.section-cards',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // ── 3.5 TRACK YOUR GROWTH section — scroll-triggered ─────────────────
        gsap.fromTo('#tyg-section .wi-word',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: { trigger: '#tyg-section', start: 'top 75%' },
                delay: 0.1
            }
        );

        gsap.fromTo('#tyg-divider',
            { opacity: 0 },
            {
                opacity: 1, duration: 0.5,
                scrollTrigger: { trigger: '#tyg-section', start: 'top 70%' },
                delay: 0.4,
                onComplete: () => {
                    const line = document.querySelector('#tyg-divider .wi-divider-line-alt');
                    if (line) gsap.fromTo(line, { width: '0' }, { width: '300px', duration: 1, ease: 'power3.out' });
                }
            }
        );

        // ── 4. BENTO BOX CARDS ───────────────────────────────────────────────
        gsap.fromTo('.bento-card',
            { y: 60, opacity: 0, scale: 0.98 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: '.bento-grid',
                    start: 'top 85%'
                }
            }
        );

        // ── 6. HERO PARALLAX on scroll ───────────────────────────────────────
        gsap.to('.hero-avatar', {
            y: 100,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-container',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        gsap.to('.hero-title', {
            y: 130,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-container',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

    } else {
        // Fallback: show everything immediately if GSAP isn't ready
        gsap.set(['.wi-word', '#wi-divider', '#tyg-divider',
            '.section-cards > a', '.bento-card'],
            { opacity: 1, y: 0, scale: 1 }
        );
    }
}


/* ===== STUDY PLANNER LOGIC ===== */
/* ── GSAP Stroke Drawing Name Animation ───────────────────── */
function gsapDrawName(el, text) {
    if (!el) return;
    el.innerHTML = ''; // Clear container

    // Mobile fallback: render direct gradient text to avoid SVG bounding-box truncation/invisibility on phones
    if (window.innerWidth <= 640) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        textSpan.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)';
        textSpan.style.webkitBackgroundClip = 'text';
        textSpan.style.webkitTextFillColor = 'transparent';
        textSpan.style.fontWeight = '800';
        textSpan.style.display = 'inline-block';
        el.appendChild(textSpan);

        const laserLine = document.getElementById('hero-laser-line');
        if (laserLine) laserLine.classList.add('laser-active');
        return;
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "gsap-name-svg");

    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML = `
        <linearGradient id="nameFillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop id="nStop1" offset="0%" stop-color="#8B5CF6" />
            <stop id="nStop2" offset="50%" stop-color="#EC4899" />
            <stop id="nStop3" offset="100%" stop-color="#F59E0B" />
        </linearGradient>
        <linearGradient id="nameStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#A78BFA" />
            <stop offset="50%" stop-color="#F472B6" />
            <stop offset="100%" stop-color="#FCD34D" />
        </linearGradient>
    `;
    svg.appendChild(defs);

    const textEl = document.createElementNS(svgNS, "text");
    textEl.setAttribute("x", "5");
    textEl.setAttribute("y", "55");
    textEl.setAttribute("font-family", "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif");
    textEl.setAttribute("font-size", "52");
    textEl.setAttribute("font-weight", "800");
    textEl.setAttribute("letter-spacing", "0.02em");
    textEl.setAttribute("fill", "transparent");
    textEl.setAttribute("stroke", "url(#nameStrokeGrad)");
    textEl.setAttribute("stroke-width", "2");
    textEl.setAttribute("stroke-linecap", "round");
    textEl.setAttribute("stroke-linejoin", "round");

    const letters = text.split('');
    const tspanElements = [];

    letters.forEach((ch) => {
        const tspan = document.createElementNS(svgNS, "tspan");
        tspan.setAttribute("class", "gsap-stroke-letter");
        tspan.textContent = ch === ' ' ? '\u00A0' : ch;
        textEl.appendChild(tspan);
        tspanElements.push(tspan);
    });

    svg.appendChild(textEl);
    el.appendChild(svg);

    // Exact bounding box measurement for flawless SVG viewBox scaling
    requestAnimationFrame(() => {
        try {
            const bbox = textEl.getBBox();
            if (bbox && bbox.width > 0) {
                svg.setAttribute("viewBox", `${bbox.x - 8} ${bbox.y - 8} ${bbox.width + 16} ${bbox.height + 16}`);
            } else {
                svg.setAttribute("viewBox", `0 0 ${text.length * 36 + 20} 75`);
            }
        } catch (e) {
            svg.setAttribute("viewBox", `0 0 ${text.length * 36 + 20} 75`);
        }
    });

    // Set stroke dash offset on each letter element
    tspanElements.forEach(tspan => {
        const length = 400;
        tspan.style.strokeDasharray = length;
        tspan.style.strokeDashoffset = length;
    });

    // GSAP Timeline animation (Slow, cinematic stroke drawing)
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ delay: 0.2 });

        // Step 1: Draw stroke outline of each letter slowly
        tl.to(tspanElements, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            stagger: 0.35
        });

        // Step 2: Smoothly fill text with glowing cyan/indigo luxury gradient
        tl.to(tspanElements, {
            fill: "url(#nameFillGrad)",
            stroke: "rgba(168, 85, 247, 0.4)",
            strokeWidth: 0.8,
            duration: 1.3,
            ease: "power2.out",
            stagger: 0.12
        }, "-=0.7");

        // Step 3: Rich aura glow effect around the name & trigger continuous color morph
        tl.to(svg, {
            duration: 1.2,
            ease: "power1.out",
            onComplete: () => {
                const laserLine = document.getElementById('hero-laser-line');
                if (laserLine) laserLine.classList.add('laser-active');
                startContinuousColorShift();
            }
        });
    }
}

/* ── Continuous GSAP Color Shift (Fluid Cyan -> Ocean Blue -> Deep Indigo) ── */
function startContinuousColorShift() {
    if (typeof gsap === 'undefined') return;

    const colorPairs = [
        { s1: "#8B5CF6", s2: "#EC4899", s3: "#F59E0B" }, // Violet -> Pink -> Amber
        { s1: "#A855F7", s2: "#D946EF", s3: "#F43F5E" }, // Purple -> Fuchsia -> Rose
        { s1: "#7C3AED", s2: "#DB2777", s3: "#EA580C" }, // Deep Violet -> Deep Pink -> Orange
        { s1: "#C026D3", s2: "#E11D48", s3: "#D97706" }, // Fuchsia -> Rose -> Amber
        { s1: "#8B5CF6", s2: "#EC4899", s3: "#F59E0B" }  // Loop back
    ];

    let step = 0;
    function cycle() {
        step = (step + 1) % colorPairs.length;
        const target = colorPairs[step];

        gsap.to("#nStop1", { stopColor: target.s1, duration: 3.5, ease: "sine.inOut" });
        gsap.to("#nStop2", { stopColor: target.s2, duration: 4.0, ease: "sine.inOut" });
        gsap.to("#nStop3", { stopColor: target.s3, duration: 3.8, ease: "sine.inOut", onComplete: cycle });
    }

    cycle();
}

/* ── Laser Split Ring Avatar Reveal ────────────────────── */
function initHologramAvatarSequence() {
    if (typeof gsap === 'undefined') return;

    const arcLeft = document.getElementById('ring-arc-left');
    const arcRight = document.getElementById('ring-arc-right');
    const originDot = document.getElementById('ring-origin-dot');
    const snapDot = document.getElementById('ring-snap-dot');
    const avatarWrap = document.getElementById('hero-avatar-wrap');

    if (!arcLeft || !arcRight) return;

    const arcLength = 298; // SVG arc length for r=94

    // Prepare initial hidden states
    arcLeft.style.strokeDasharray = arcLength;
    arcLeft.style.strokeDashoffset = arcLength;
    arcRight.style.strokeDasharray = arcLength;
    arcRight.style.strokeDashoffset = arcLength;

    const ringTl = gsap.timeline({ delay: 0.3 });

    // Step 1: Origin top dot pulse
    ringTl.fromTo(originDot,
        { scale: 0, opacity: 0 },
        { scale: 1.5, opacity: 1, duration: 0.4, ease: "back.out(2)" }
    );

    // Step 2: Both arcs split & open downwards from top dot down to bottom
    ringTl.to([arcLeft, arcRight], {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: "power2.inOut"
    }, "+=0.1");

    // Step 3: Snap shut at bottom dot with bright flash & clean avatar reveal
    ringTl.to(snapDot, {
        opacity: 1,
        scale: 2.2,
        duration: 0.15,
        ease: "power4.out",
        onComplete: () => {
            gsap.to(snapDot, { scale: 1, opacity: 0.8, duration: 0.4 });
            // Clean & Elegant Avatar Reveal
            if (avatarWrap) {
                gsap.fromTo(avatarWrap,
                    { opacity: 0, scale: 0.85 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.7,
                        ease: "back.out(1.5)"
                    }
                );
            }
        }
    });
}

function loadPlanner() {
    const plannerForm = document.getElementById('planner-form');
    const plannerInput = document.getElementById('planner-input');
    const plannerList = document.getElementById('planner-list');

    let tasks = JSON.parse(localStorage.getItem('soPlannerTasks') || '[]');

    function renderTasks() {
        if (tasks.length === 0) {
            plannerList.innerHTML = `<p class="text-center text-brand-textSecondary text-sm py-8 font-light tracking-wide border border-glass-borderHighlight rounded-xl bg-glass-100 border-dashed">No objectives defined. A clear mind.</p>`;
            return;
        }

        plannerList.innerHTML = tasks.map((task, index) => `
            <div class="bento-task-item flex items-center gap-4 p-4 ${task.completed ? 'opacity-50' : ''} group">
                <label class="relative flex items-center justify-center cursor-pointer shrink-0">
                    <input type="checkbox" class="peer sr-only" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                    <div class="w-6 h-6 rounded-full border-2 ${task.completed ? 'border-purple-500 bg-purple-500' : 'border-brand-textSecondary hover:border-purple-500'} peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all flex items-center justify-center">
                        <svg class="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 transform scale-50 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                </label>

                <span class="flex-1 text-sm ${task.completed ? 'line-through text-brand-textSecondary' : 'text-brand-textPrimary font-semibold'} transition-all duration-300 cursor-pointer select-none truncate" onclick="toggleTask(${index})">
                    ${task.text}
                </span>

                <button onclick="deleteTask(${index})" class="w-8 h-8 rounded-full flex items-center justify-center text-red-400/50 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        `).join('');
    }

    plannerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = plannerInput.value.trim();
        if (!text) return;

        tasks.push({ text, completed: false });
        localStorage.setItem('soPlannerTasks', JSON.stringify(tasks));
        plannerInput.value = '';
        renderTasks();
    });

    window.toggleTask = function (index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('soPlannerTasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.deleteTask = function (index) {
        tasks.splice(index, 1);
        localStorage.setItem('soPlannerTasks', JSON.stringify(tasks));
        renderTasks();
    };

    renderTasks();
}

/* ── Typing Animation ─────────────────────────────── */
function typeWriter(el, cursorEl, text, speed, onDone) {
    el.textContent = '';
    let i = 0;
    const delay = 600; // wait a bit before starting (hero entrance)
    setTimeout(() => {
        const interval = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                if (typeof onDone === 'function') onDone();
            }
        }, speed);
    }, delay);
}

/* ── Floating Particles ───────────────────────────── */
function spawnHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const colors = ['#0EA5E9', '#6366f1', '#a855f7', '#06b6d4', '#38bdf8'];
    const count = 18;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';

        const size = Math.random() * 5 + 2;       // 2–7 px
        const angle = Math.random() * 360;          // any direction
        const dist = 120 + Math.random() * 100;    // distance from center
        const tx = Math.cos(angle * Math.PI / 180) * dist;
        const ty = Math.sin(angle * Math.PI / 180) * dist;
        const dur = 3 + Math.random() * 4;        // 3–7s
        const delay = Math.random() * dur;           // staggered start
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Start position: near center (200x200 container, center = 200,200)
        const startX = 185 + Math.random() * 30;
        const startY = 185 + Math.random() * 30;

        Object.assign(p.style, {
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            left: `${startX}px`,
            top: `${startY}px`,
            '--tx': `${tx}px`,
            '--ty': `${ty}px`,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
        });

        container.appendChild(p);
    }
}
