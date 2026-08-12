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
    const displayName = document.getElementById('display-name');
    const heroAvatar = document.getElementById('hero-avatar');

    // Feature 1: Time-based Greeting
    const greetingText = document.getElementById('greeting-text');
    if (greetingText) {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) greetingText.textContent = "Good Morning,";
        else if (hour >= 12 && hour < 17) greetingText.textContent = "Good Afternoon,";
        else if (hour >= 17 && hour < 22) greetingText.textContent = "Good Evening,";
        else greetingText.textContent = "Burning the midnight oil,";
    }

    if (displayDept) displayDept.textContent = userDept;
    if (displayName) displayName.textContent = userName;
    if (heroAvatar) {
        if (avatarImg) {
            heroAvatar.style.backgroundImage = `url(${avatarImg})`;
            heroAvatar.textContent = '';
            heroAvatar.classList.remove('bg-gradient-to-tr');
        } else {
            heroAvatar.textContent = userName[0].toUpperCase();
        }
    }

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
    loadStats(userDept);
    loadPlanner();
});

function loadStats(deptText) {
    const deptKey = getDeptKey(deptText);
    const materials = MATERIALS[deptKey] || MATERIALS['accounting'];

    // Zero out stats for new student
    const totalSubjects = materials.length;
    let openedSubjects = 0;
    const openedPDFs = 0;
    const openedVideos = 0;
    const favs = getFavorites();
    const favoritesCount = favs.length;

    // Collect all lectures across all subjects in this dept
    const completedLectures = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
    const completedSections = JSON.parse(localStorage.getItem('soCompletedSections') || '{}');
    const completedQuizzes = JSON.parse(localStorage.getItem('soCompletedQuizzes') || '{}');
    const completedSummaries = JSON.parse(localStorage.getItem('soCompletedSummaries') || '{}');
    const completedQA = JSON.parse(localStorage.getItem('soCompletedQA') || '{}');

    let totalVideos = 0, totalPDFs = 0, doneVideos = 0, donePDFs = 0;
    let totalLectures = 0, doneLectures = 0;

    materials.forEach(subj => {
        if (!subj.content) return;
        const contentSections = ['chapters', 'quizzes', 'sections', 'summaries', 'qa', 'finalReview'];
        contentSections.forEach(sec => {
            if (!subj.content[sec]) return;
            subj.content[sec].forEach(ch => {
                if (!ch.lectures) return;
                ch.lectures.forEach(lec => {
                    totalLectures++;
                    const isDone = !!(completedLectures[lec.id] || completedSections[lec.id] ||
                        completedQuizzes[lec.id] || completedSummaries[lec.id] || completedQA[lec.id]);
                    if (lec.type === 'video') {
                        totalVideos++;
                        if (isDone) doneVideos++;
                    } else {
                        totalPDFs++;
                        if (isDone) donePDFs++;
                    }
                    if (isDone) doneLectures++;
                });
            });
        });
    });

    // Determine opened subjects from localStorage
    const lastOpened = JSON.parse(localStorage.getItem('soLastOpened') || '{}');
    materials.forEach(m => {
        if (lastOpened[m.id]) openedSubjects++;
    });

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

    // Feature 10: Level Badge
    const levelBadge = document.getElementById('hero-level-badge');
    if (levelBadge) {
        let level = "Beginner";
        if (progressPct >= 20 && progressPct < 50) level = "Learner";
        else if (progressPct >= 50 && progressPct < 80) level = "Scholar 🌟";
        else if (progressPct >= 80) level = "Expert 🏆";
        levelBadge.textContent = level;
    }

    // Feature 18: Recommended For You
    const recList = document.getElementById('recommended-list');
    if (recList) {
        const recommendedItems = materials.filter(m => !favs.includes(m.id)).slice(0, 2);
        if (recommendedItems.length < 2) {
            recommendedItems.push(...materials.slice(0, 2 - recommendedItems.length));
        }

        recList.innerHTML = recommendedItems.map(item => `
            <a href="subject.html?id=${item.id}" class="bento-rec-item flex items-center justify-between overflow-hidden cursor-pointer p-4 group relative">
                <div class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-[20px] opacity-40 group-hover:opacity-70 transition-all" style="background-color: ${item.color}"></div>
                <div class="flex items-center gap-4 z-10 w-full">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] bg-white/60 dark:bg-black/30 border border-white/60 dark:border-white/20 shrink-0" style="color: ${item.color}">${item.icon}</div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-brand-textPrimary text-sm truncate group-hover:text-brand-accent transition-colors">${item.title}</h4>
                        <p class="text-xs text-brand-textSecondary mt-0.5 truncate">${item.desc}</p>
                    </div>
                    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                </div>
            </a>
        `).join('');
    }

    const openedSubjectsPct = totalSubjects ? Math.round((openedSubjects / totalSubjects) * 100) : 0;
    const openedPDFsPct = totalPDFs > 0 ? Math.round((donePDFs / totalPDFs) * 100) : 0;
    const openedVideosPct = totalVideos > 0 ? Math.round((doneVideos / totalVideos) * 100) : 0;
    const favoritesPct = Math.min(100, favoritesCount * 10);

    const statsHTML = `
        <div class="flex flex-col gap-5">
            <!-- Subjects -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>Subjects</span>
                    <span class="text-sm font-black text-brand-textPrimary">${openedSubjectsPct}%</span>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${openedSubjectsPct}%; background: linear-gradient(90deg, #3b82f6, #60a5fa); box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>
                </div>
            </div>
            <!-- PDFs -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-purple-500"></span>PDFs</span>
                    <span class="text-sm font-black text-brand-textPrimary">${openedPDFsPct}%</span>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${openedPDFsPct}%; background: linear-gradient(90deg, #8b5cf6, #a78bfa); box-shadow: 0 0 10px rgba(139,92,246,0.5);"></div>
                </div>
            </div>
            <!-- Videos -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-500"></span>Videos</span>
                    <span class="text-sm font-black text-brand-textPrimary">${openedVideosPct}%</span>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${openedVideosPct}%; background: linear-gradient(90deg, #f43f5e, #fb7185); box-shadow: 0 0 10px rgba(244,63,94,0.5);"></div>
                </div>
            </div>
            <!-- Favorites -->
            <div>
                <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold uppercase tracking-widest text-brand-textSecondary flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Favorites</span>
                    <span class="text-sm font-black text-brand-textPrimary">${favoritesPct}%</span>
                </div>
                <div class="bento-prog-bar-container">
                    <div class="bento-prog-bar-fill" style="width: ${favoritesPct}%; background: linear-gradient(90deg, #f59e0b, #fbbf24); box-shadow: 0 0 10px rgba(245,158,11,0.5);"></div>
                </div>
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

