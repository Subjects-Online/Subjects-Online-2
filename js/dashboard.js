/* ===================================================
   SUBJECTS ONLINE — Dashboard Home JS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('subjectsOnlineName') || 'Student';
    const userDept = localStorage.getItem('subjectsOnlineDept') || 'Accounting';
    const avatarImg = localStorage.getItem('subjectsOnlineAvatarImage') || null;

    // Top hero info
    const displayDept = document.getElementById('display-dept');
    const displayName = document.getElementById('display-name');
    const heroAvatar = document.getElementById('hero-avatar');
    
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
    const openedSubjects = 0;
    const openedPDFs = 0;
    const openedVideos = 0;
    const favoritesCount = getFavorites().length;

    const statsHTML = `
        <div class="stat-number-card group flex flex-col justify-between">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-all"></div>
            <span class="text-blue-500 font-semibold text-sm mb-2 z-10 relative">Subjects Opened</span>
            <div class="flex items-baseline gap-2 z-10 relative">
                <span class="stat-big-num">${openedSubjects}</span>
                <span class="text-blue-300 font-medium text-lg">/ ${totalSubjects}</span>
            </div>
        </div>
        <div class="stat-number-card group flex flex-col justify-between">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl group-hover:bg-emerald-400/20 transition-all"></div>
            <span class="text-emerald-500 font-semibold text-sm mb-2 z-10 relative">PDFs Read</span>
            <div class="flex items-baseline gap-2 z-10 relative">
                <span class="stat-big-num" style="background: linear-gradient(135deg, #059669, #34d399); -webkit-background-clip: text; background-clip: text;">0</span>
                <span class="text-emerald-300 font-medium text-lg">/ 0</span>
            </div>
        </div>
        <div class="stat-number-card group flex flex-col justify-between">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-rose-400/10 rounded-full blur-xl group-hover:bg-rose-400/20 transition-all"></div>
            <span class="text-rose-500 font-semibold text-sm mb-2 z-10 relative">Videos Watched</span>
            <div class="flex items-baseline gap-2 z-10 relative">
                <span class="stat-big-num" style="background: linear-gradient(135deg, #e11d48, #fb7185); -webkit-background-clip: text; background-clip: text;">0</span>
                <span class="text-rose-300 font-medium text-lg">/ 0</span>
            </div>
        </div>
        <div class="stat-number-card group flex flex-col justify-between">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-400/20 transition-all"></div>
            <span class="text-amber-500 font-semibold text-sm mb-2 z-10 relative">Saved Favorites</span>
            <span class="stat-big-num z-10 relative" style="background: linear-gradient(135deg, #d97706, #fbbf24); -webkit-background-clip: text; background-clip: text;">${favoritesCount}</span>
        </div>
    `;
    document.getElementById('stats-row').innerHTML = statsHTML;

    // 2. Needs Attention - Show subjects not opened for >= 5 days
    let appStartDate = localStorage.getItem('soAppStartDate');
    if (!appStartDate) {
        appStartDate = Date.now();
        localStorage.setItem('soAppStartDate', appStartDate);
    }
    const lastOpened = JSON.parse(localStorage.getItem('soLastOpened') || '{}');
    const now = Date.now();
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

    const neglectedSubjects = materials.filter(m => {
        const lastTime = lastOpened[m.id] || parseInt(appStartDate);
        return (now - lastTime) >= FIVE_DAYS_MS;
    });

    if (neglectedSubjects.length === 0) {
        document.getElementById('not-opened-list').innerHTML = `
            <div class="flex flex-col items-center justify-center text-center py-6 opacity-80 h-full">
                <span class="text-3xl mb-3">✨</span>
                <h4 class="font-bold text-blue-900 mb-1">All Caught Up!</h4>
                <p class="text-[11px] text-blue-400 font-medium">You haven't neglected any subjects recently.</p>
            </div>
        `;
    } else {
        document.getElementById('not-opened-list').innerHTML = neglectedSubjects.slice(0, 3).map(m => `
            <a href="subject.html?id=${m.id}" class="not-opened-item group text-decoration-none">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm bg-white" style="border: 1px solid ${m.color}">
                    ${m.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="truncate font-bold text-blue-950 text-sm group-hover:text-blue-600 transition-colors">${m.title}</p>
                    <p class="text-[10px] text-rose-500 font-medium">Needs Attention (>5 days)</p>
                </div>
                <span class="start-badge" style="color: #e11d48; background: #ffe4e6; border: none;">Review</span>
            </a>
        `).join('');
    }

    // 3. Most Visited - Empty State since 0 opened
    const mostVisitedEmpty = `
        <div class="flex flex-col items-center justify-center text-center h-full py-6">
            <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 shadow-[inset_0_0_10px_rgba(37,99,235,0.1)]">
                <span class="text-2xl opacity-50">🚀</span>
            </div>
            <h4 class="font-bold text-blue-900 mb-1">No Activity Yet</h4>
            <p class="text-xs text-blue-400 max-w-[200px] leading-relaxed">Start browsing your materials. Your most visited subjects will appear here.</p>
            <a href="browse.html" class="mt-4 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-full transition-colors border border-blue-100">
                Browse Now
            </a>
        </div>
    `;
    document.getElementById('most-visited-list').innerHTML = mostVisitedEmpty;
}

function initAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Hero elements
    tl.fromTo('.dept-badge',    { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' }, 0.1);
    tl.fromTo('.hello-title',   { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 0.2);
    tl.fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.4);

    // Staggered section cards
    tl.fromTo('.section-cards .home-card',
        { y: 60, opacity: 0, scale: 0.93 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.13, ease: 'back.out(1.2)' },
        0.5
    );

    // Stats section & Planner section
    tl.fromTo('.stats-section, .planner-section',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.8
    );
    tl.fromTo('.stat-number-card, .stat-card',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1)' },
        1.0
    );
    
    // Animate progress bars fill (staggered)
    setTimeout(() => {
        const bars = document.querySelectorAll('.visit-bar-fill');
        bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = width; }, 50);
        });
    }, 1500);
}

/* ===== STUDY PLANNER LOGIC ===== */
function loadPlanner() {
    const plannerForm = document.getElementById('planner-form');
    const plannerInput = document.getElementById('planner-input');
    const plannerList = document.getElementById('planner-list');
    
    let tasks = JSON.parse(localStorage.getItem('soPlannerTasks') || '[]');

    function renderTasks() {
        if (tasks.length === 0) {
            plannerList.innerHTML = `<p class="text-center text-blue-400 text-sm py-4 italic">No tasks for today. Take a break! ☕</p>`;
            return;
        }

        plannerList.innerHTML = tasks.map((task, index) => `
            <div class="flex items-center gap-3 p-3 rounded-xl border ${task.completed ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-blue-100 shadow-sm'} transition-all group">
                <input type="checkbox" class="w-5 h-5 rounded border-blue-300 text-violet-600 focus:ring-violet-500 cursor-pointer" 
                       ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span class="flex-1 text-sm ${task.completed ? 'line-through text-blue-400' : 'text-blue-900 font-medium'} transition-all cursor-pointer" onclick="toggleTask(${index})">
                    ${task.text}
                </span>
                <button onclick="deleteTask(${index})" class="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('soPlannerTasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        localStorage.setItem('soPlannerTasks', JSON.stringify(tasks));
        renderTasks();
    };

    renderTasks();
}
