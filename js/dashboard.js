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

    // Feature 4: Overall Progress Ring
    // Calculate a mock progress based on opened subjects and favorites for demo
    let progressPct = Math.min(100, Math.round(((openedSubjects * 10) + (favoritesCount * 5)) / (totalSubjects * 10 + 20) * 100));
    if (progressPct === 0) progressPct = 5;

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
            <a href="subject.html?id=${item.id}" class="group relative bg-glass-100 rounded-2xl p-4 border border-glass-borderHighlight hover:border-indigo-500/40 transition-all flex flex-col justify-between overflow-hidden cursor-pointer h-[120px]">
                <div class="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-[20px] opacity-40 group-hover:opacity-70 transition-all" style="background-color: ${item.color}"></div>
                <div class="flex items-start gap-3 z-10">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner bg-brand-bg/50 border border-brand-cardBorder" style="color: ${item.color}">${item.icon}</div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-white text-sm truncate">${item.title}</h4>
                        <p class="text-xs text-brand-textSecondary mt-0.5 truncate">${item.desc}</p>
                    </div>
                </div>
                <div class="flex items-center text-[10px] uppercase tracking-wider font-bold text-orange-400 gap-1 z-10">
                    <span>Start Learning</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
            </a>
        `).join('');
    }

    const openedSubjectsPct = totalSubjects ? Math.round((openedSubjects / totalSubjects) * 100) : 0;
    const openedPDFsPct = 0; // Placeholder for now
    const openedVideosPct = 0; // Placeholder for now
    const favoritesPct = Math.min(100, favoritesCount * 10); // Arbitrary percentage for demo

    const statsHTML = `
        <div class="w-full">
            <!-- Header -->
            <div class="flex justify-between items-end mb-8">
                <div>
                    <h3 class="text-2xl font-bold text-brand-textPrimary font-heading">Overall Progress</h3>
                    <p class="text-xs sm:text-sm text-brand-textSecondary mt-1 opacity-70">Your learning analytics visualized</p>
                </div>
                <div class="text-right">
                    <div class="text-4xl font-bold text-brand-accent">${progressPct}<span class="text-xl opacity-50">%</span></div>
                    <div class="text-[10px] font-medium text-brand-textSecondary uppercase tracking-wider mt-1">Total Score</div>
                </div>
            </div>

            <!-- Bar Chart -->
            <div class="flex items-end justify-between sm:justify-around h-56 mt-8 gap-2 w-full">
                
                <!-- Bar 1: Subjects -->
                <div class="flex flex-col items-center group w-16 h-full cursor-pointer">
                    <div class="text-sm font-bold text-brand-textPrimary mb-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 duration-300">${openedSubjectsPct}%</div>
                    <div class="w-10 bg-brand-iconBg border border-brand-cardBorder rounded-t-2xl h-full flex items-end relative overflow-hidden transition-all duration-300">
                        <div class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-2xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" style="height: ${openedSubjectsPct}%"></div>
                    </div>
                    <div class="mt-4 text-xs font-semibold text-brand-textSecondary group-hover:text-brand-accent transition-colors text-center">Subjects</div>
                </div>

                <!-- Bar 2: PDFs -->
                <div class="flex flex-col items-center group w-16 h-full cursor-pointer">
                    <div class="text-sm font-bold text-brand-textPrimary mb-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 duration-300">${openedPDFsPct}%</div>
                    <div class="w-10 bg-brand-iconBg border border-brand-cardBorder rounded-t-2xl h-full flex items-end relative overflow-hidden transition-all duration-300">
                        <div class="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-2xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(147,51,234,0.4)]" style="height: ${openedPDFsPct}%"></div>
                    </div>
                    <div class="mt-4 text-xs font-semibold text-brand-textSecondary group-hover:text-purple-400 transition-colors text-center">PDFs</div>
                </div>

                <!-- Bar 3: Videos -->
                <div class="flex flex-col items-center group w-16 h-full cursor-pointer">
                    <div class="text-sm font-bold text-brand-textPrimary mb-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 duration-300">${openedVideosPct}%</div>
                    <div class="w-10 bg-brand-iconBg border border-brand-cardBorder rounded-t-2xl h-full flex items-end relative overflow-hidden transition-all duration-300">
                        <div class="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-2xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(225,29,72,0.4)]" style="height: ${openedVideosPct}%"></div>
                    </div>
                    <div class="mt-4 text-xs font-semibold text-brand-textSecondary group-hover:text-rose-400 transition-colors text-center">Videos</div>
                </div>

                <!-- Bar 4: Favorites -->
                <div class="flex flex-col items-center group w-16 h-full cursor-pointer">
                    <div class="text-sm font-bold text-brand-textPrimary mb-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 duration-300">${favoritesPct}%</div>
                    <div class="w-10 bg-brand-iconBg border border-brand-cardBorder rounded-t-2xl h-full flex items-end relative overflow-hidden transition-all duration-300">
                        <div class="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-2xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.4)]" style="height: ${favoritesPct}%"></div>
                    </div>
                    <div class="mt-4 text-xs font-semibold text-brand-textSecondary group-hover:text-amber-400 transition-colors text-center">Favorites</div>
                </div>

            </div>
            
            <div class="w-full h-[1px] bg-brand-cardBorder mt-2"></div>
        </div>
    `;
    document.getElementById('stats-row').innerHTML = statsHTML;

    // 2. Needs Attention - Show subjects not opened for >= 5 days
    let appStartDate = localStorage.getItem('soAppStartDate');
    if (!appStartDate) {
        appStartDate = Date.now();
        localStorage.setItem('soAppStartDate', appStartDate);
    }
    const now = Date.now();
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

    const neglectedSubjects = materials.filter(m => {
        const lastTime = lastOpened[m.id] || parseInt(appStartDate);
        return (now - lastTime) >= FIVE_DAYS_MS;
    });

    if (neglectedSubjects.length === 0) {
        document.getElementById('not-opened-list').innerHTML = `
            <div class="flex flex-col items-center justify-center text-center py-6 opacity-60 h-full">
                <span class="text-3xl mb-3">✨</span>
                <h4 class="font-medium text-brand-textPrimary mb-1 text-sm">Impeccable Record</h4>
                <p class="text-[10px] text-brand-textSecondary font-light">All subjects are up to date.</p>
            </div>
        `;
    } else {
        document.getElementById('not-opened-list').innerHTML = neglectedSubjects.slice(0, 3).map(m => `
            <a href="subject.html?id=${m.id}" class="group flex items-center gap-4 bg-brand-iconBg rounded-xl p-3 border border-brand-cardBorder hover:border-brand-accent/20 transition-all cursor-pointer">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-brand-iconBg border border-brand-cardBorder" style="color: ${m.color}">
                    ${m.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="truncate font-medium text-brand-textPrimary text-sm group-hover:text-brand-accent transition-colors">${m.title}</p>
                    <p class="text-[9px] text-brand-accent/80 font-medium tracking-[0.2em] uppercase mt-0.5">Needs Review</p>
                </div>
                <svg class="w-5 h-5 text-brand-textSecondary opacity-50 group-hover:opacity-100 group-hover:text-brand-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </a>
        `).join('');
    }

    // 3. Most Visited - Empty State since 0 opened
    const mostVisitedEmpty = `
        <div class="flex flex-col items-center justify-center text-center h-full py-6">
            <div class="w-16 h-16 rounded-full bg-brand-iconBg border border-brand-cardBorder flex items-center justify-center mb-4">
                <span class="text-2xl opacity-60">🔮</span>
            </div>
            <h4 class="font-medium text-brand-textPrimary mb-1 text-sm">Awaiting Activity</h4>
            <p class="text-[10px] text-brand-textSecondary max-w-[200px] leading-relaxed font-light">Your most visited subjects will manifest here.</p>
        </div>
    `;
    document.getElementById('stats-col').innerHTML = `
        <div class="bg-brand-iconBg rounded-2xl p-6 border border-brand-cardBorder h-full">
            <h3 class="font-heading text-sm text-brand-textPrimary font-medium mb-4 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span class="uppercase tracking-[0.2em] text-[10px]">Needs Attention</span>
            </h3>
            <div id="not-opened-list" class="flex flex-col gap-3">
                ${document.getElementById('not-opened-list').innerHTML}
            </div>
        </div>
        <div class="bg-brand-iconBg rounded-2xl p-6 border border-brand-cardBorder mt-4 h-full">
            <h3 class="font-heading text-sm text-brand-textPrimary font-medium mb-4 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span class="uppercase tracking-[0.2em] text-[10px]">Top Activity</span>
            </h3>
            <div id="most-visited-list" class="flex flex-col gap-4">
                ${mostVisitedEmpty}
            </div>
        </div>
    `;
}

function initAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Luxury Hero Animations
    tl.fromTo(".hero-container", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 
        0
    );

    tl.fromTo(".hero-avatar", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out" }, 
        0.3
    );

    tl.fromTo(".hero-title > *", 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }, 
        0.5
    );

    tl.fromTo(".scroll-indicator",
        { opacity: 0, y: 10 },
        { opacity: 0.4, y: 0, duration: 1.5, ease: "power2.out" },
        1
    );

    // 2. Luxury Cards Stagger
    tl.fromTo(".section-cards > a, .section-cards > div > a",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power2.out" },
        0.8
    );

    // Stats section & Planner section
    tl.fromTo('.stats-section',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        1.2
    );

    // New Sections
    tl.fromTo('.new-sections',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        1.4
    );

    // Feature 19: Parallax Effect on Hero using GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to('.hero-avatar', {
            y: 80,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-container",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to('.hero-title', {
            y: 120,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-container",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to('.dept-badge', {
            y: 60,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-container",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
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
            <div class="flex items-center gap-4 p-4 rounded-2xl border ${task.completed ? 'bg-brand-iconBg/40 border-transparent opacity-60' : 'bg-brand-iconBg border-brand-cardBorder shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-brand-accent/30'} transition-all duration-300 group transform hover:-translate-y-0.5">
                
                <label class="relative flex items-center justify-center cursor-pointer">
                    <input type="checkbox" class="peer sr-only" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                    <div class="w-6 h-6 rounded-full border-2 ${task.completed ? 'border-brand-accent bg-brand-accent' : 'border-brand-cardBorder hover:border-brand-accent/50 bg-brand-bg'} peer-checked:bg-brand-accent peer-checked:border-brand-accent transition-all flex items-center justify-center">
                        <svg class="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 transform scale-50 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                </label>

                <span class="flex-1 text-sm ${task.completed ? 'line-through text-brand-textSecondary' : 'text-brand-textPrimary font-medium'} transition-all duration-300 cursor-pointer select-none" onclick="toggleTask(${index})">
                    ${task.text}
                </span>
                
                <button onclick="deleteTask(${index})" class="w-8 h-8 rounded-xl flex items-center justify-center text-rose-400/50 hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
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

