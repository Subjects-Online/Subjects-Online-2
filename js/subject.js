/* =========================================================
   subject.js — Spotlight Tab Edition
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const params    = new URLSearchParams(window.location.search);
    const subjectId = params.get('id') || 'a1';

    // ── Find subject ─────────────────────────────────────
    let subject = null, deptLabel = '';
    for (const [key, items] of Object.entries(MATERIALS)) {
        const found = items.find(i => i.id === subjectId);
        if (found) {
            subject   = found;
            deptLabel = key.charAt(0).toUpperCase() + key.slice(1);
            break;
        }
    }
    if (!subject) { document.getElementById('subj-title').textContent = 'Subject not found'; return; }

    // ── Set CSS variable for tab active color ─────────────
    document.documentElement.style.setProperty('--subject-accent', subject.accent);
    document.documentElement.style.setProperty('--subject-glow', subject.color);

    // ── Track visits & Last Opened ────────────────────────
    const visits = JSON.parse(localStorage.getItem('soVisits') || '{}');
    visits[subjectId] = (visits[subjectId] || 0) + 1;
    localStorage.setItem('soVisits', JSON.stringify(visits));

    const lastOpened = JSON.parse(localStorage.getItem('soLastOpened') || '{}');
    lastOpened[subjectId] = Date.now();
    localStorage.setItem('soLastOpened', JSON.stringify(lastOpened));

    // ── Populate hero ─────────────────────────────────────
    document.title = `${subject.title} — Subjects Online`;
    document.getElementById('subj-title').textContent   = subject.title;
    document.getElementById('subj-desc').textContent    = subject.desc;
    document.getElementById('subj-icon').textContent    = subject.icon;
    document.getElementById('subj-dept').textContent    = deptLabel;
    document.getElementById('subj-hero-bg').style.background =
        `linear-gradient(135deg, ${subject.accent} 0%, ${subject.accent}cc 50%, ${darkenHex(subject.accent, 25)} 100%)`;
    document.getElementById('subj-icon-bg').style.background =
        `linear-gradient(135deg, ${subject.color}80, ${subject.color}40)`;

    // ── Section Data ─────────────────────────────────────
    const STUDY = [
        { id:'cc', img:'images/sections/course-content.png', icon:'📖', iconBg:'#dbeafe', accent:'#3b82f6', glow:'rgba(59,130,246,0.35)',
          title:'Course Content',
          tag:'Full Explanations',   tagColor:'#1d4ed8', tagBg:'#dbeafe',
          desc:'شرح الماتريال بالكامل بالتفصيل — مش تلخيص. كل موضوع في كل محاضرة مشروح بأسلوب واضح وسهل تفهمه.' },

        { id:'qz', img:'images/sections/quizzes.png', icon:'📝', iconBg:'#fce7f3', accent:'#db2777', glow:'rgba(219,39,119,0.3)',
          title:'Quizzes',
          tag:'Step-by-Step Solutions', tagColor:'#9d174d', tagBg:'#fce7f3',
          desc:'كل كويز بينزل هنحله بالتفصيل خطوة بخطوة — ومش بس الإجابة، هنشرح ليه الإجابة دي صح.' },

        { id:'sc', img:'images/sections/sections.png', icon:'👨‍🏫', iconBg:'#ede9fe', accent:'#8b5cf6', glow:'rgba(139,92,246,0.3)',
          title:'Sections',
          tag:'Full Section Solutions', tagColor:'#6d28d9', tagBg:'#ede9fe',
          desc:'حل السكاشن مع شرح كل سؤال — مش بس الحل، هنشرح منطق السؤال وإزاي وصلنا للإجابة.' },

        { id:'sk', img:'images/sections/summaries.png', icon:'🔑', iconBg:'#dcfce7', accent:'#10b981', glow:'rgba(16,185,129,0.3)',
          title:'Summaries & Keywords',
          tag:'Keywords & Summaries', tagColor:'#065f46', tagBg:'#dcfce7',
          desc:'بعد كل شابتر ومحاضرة: Keywords الأهم + ملخص شامل. عشان لما تفتح الويب سايت تلاقي شرح وتلخيص لكل محاضرة.' },

        { id:'qa', img:'images/sections/qa.png', icon:'❓', iconBg:'#fef3c7', accent:'#f59e0b', glow:'rgba(245,158,11,0.3)',
          title:'Questions & Answers',
          tag:'Test Bank + Extra Q', tagColor:'#92400e', tagBg:'#fef3c7',
          desc:'أسئلة التيست بنك محلولة بالكامل — زيادة عليها أسئلة إضافية للتدريب بتزود فهمك للمادة.' },

        { id:'fr', img:'images/sections/final-review.png', icon:'🎯', iconBg:'#fee2e2', accent:'#ef4444', glow:'rgba(239,68,68,0.3)',
          title:'Final Review',
          tag:'End-of-Term Revision', tagColor:'#991b1b', tagBg:'#fee2e2',
          desc:'مراجعة نهائية شاملة لمنهج الترم كامل — جداول مقارنة، نقاط مهمة، ومحتوى مضغوط جاهز للامتحان.' },
    ];

    // ── Render Tab Nav ────────────────────────────────────
    const tabNav = document.getElementById('tab-nav');
    tabNav.innerHTML = STUDY.map((s, i) => `
        <button class="tab-pill ${i === 0 ? 'active' : ''}"
                data-tab="${s.id}" role="tab"
                aria-selected="${i === 0}"
                style="${i === 0 ? `--subject-accent:${s.accent};--subject-glow:${s.glow};` : ''}">
            <span class="tab-pill-icon">${s.icon}</span>
            ${s.title}
        </button>
    `).join('<div class="tab-sep" aria-hidden="true"></div>');

    // ── Render Spotlight Panels ───────────────────────────
    const spWrap = document.getElementById('spotlight-wrap');
    spWrap.innerHTML = STUDY.map((s, i) => `
        <div class="spotlight-panel ${i === 0 ? 'sp-active' : ''}" id="sp-${s.id}" role="tabpanel">
            <!-- Left slab -->
            <div class="sp-left">
                <div class="sp-left-bg" style="background: linear-gradient(135deg, ${s.accent}, ${s.iconBg});"></div>
                <img src="${s.img}" alt="${s.title}" class="sp-left-img">
            </div>
            <!-- Right content -->
            <div class="sp-right">
                <!-- Decoration blob -->
                <div class="sp-corner-deco" style="background:${s.accent};"></div>

                <div class="sp-tag" style="color:${s.tagColor};border-color:${s.iconBg};background:${s.iconBg}80;">
                    ${s.tag}
                </div>

                <h2 class="sp-title">${s.title}</h2>
                <p class="sp-desc">${s.desc}</p>

                <div class="sp-cta-row">
                    <a href="${(s.id === 'cc' || s.id === 'qz' || s.id === 'sc') ? (s.id === 'cc' ? `chapters.html?id=${subjectId}` : (s.id === 'qz' ? `quizzes.html?id=${subjectId}` : `sections.html?id=${subjectId}`)) : '#'}" class="sp-cta-btn" style="background: linear-gradient(135deg, ${s.accent}, ${darkenHex(s.accent,15)});">
                        Open Section
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                    ${(s.id === 'cc' || s.id === 'qz' || s.id === 'sc') ? '' : `
                    <span class="sp-coming-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Coming soon
                    </span>`}
                </div>
            </div>
        </div>
    `).join('');


    // ── Tab Switching ─────────────────────────────────────
    let currentTab = STUDY[0].id;

    tabNav.addEventListener('click', e => {
        const btn = e.target.closest('.tab-pill');
        if (!btn) return;
        const tabId = btn.dataset.tab;
        if (tabId === currentTab) return;

        // Update buttons
        tabNav.querySelectorAll('.tab-pill').forEach(b => {
            b.classList.remove('active');
            b.removeAttribute('style');
        });
        btn.classList.add('active');

        // Get section for active color
        const sec = STUDY.find(s => s.id === tabId);
        document.documentElement.style.setProperty('--subject-accent', sec.accent);

        // Animate out current panel then switch
        const prev = document.getElementById(`sp-${currentTab}`);
        gsap.to(prev, { opacity: 0, x: -16, duration: 0.18, ease: 'power2.in', onComplete: () => {
            prev.classList.remove('sp-active');
            prev.style.opacity = '';
            prev.style.transform = '';

            // Show new panel and animate in
            const next = document.getElementById(`sp-${tabId}`);
            next.classList.add('sp-active');
            gsap.fromTo(next, 
                { opacity: 0, x: 16 },
                { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out' }
            );

            currentTab = tabId;
        }});
    });

    // ── Entrance Animations ───────────────────────────────
    gsap.fromTo('.subj-hero-inner',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.05 }
    );

    gsap.fromTo('.tab-pill',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo('.spotlight-wrap',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.4 }
    );
});

// ── Helper: darken a hex color by % ──────────────────────
function darkenHex(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(2.55 * percent));
    const b = Math.max(0, (num & 0xff) - Math.round(2.55 * percent));
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
