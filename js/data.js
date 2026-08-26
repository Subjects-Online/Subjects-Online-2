/* ===================================================
   SUBJECTS ONLINE — Shared Data
   =================================================== */

const MATERIALS = {
    accounting: [
        {
            id: 'a1', title: 'Corporate Accounting', icon: '📊', color: '#dbeafe', accent: '#2563eb', desc: 'Accounting for corporations, partnerships and companies.',
            content: {
                chapters: [
                    {
                        num: 1, title: "Introduction to Corporate Accounting", time: "2h 30m",
                        lectures: [
                            { id: 101, title: "Lec 1: Corporate Principles", type: "pdf", url: "materials/Pdfs/Acquisition__Disposition_of_Property_Plant_and_Equipment.pdf" },
                            { id: 102, title: "Lec 2: Partnership Accounting", type: "pdf", url: "materials/dummy.pdf" },
                            { id: 103, title: "Lec 3: Company Accounts", type: "pdf", url: "materials/dummy.pdf" },

                        ]
                    },
                    {
                        num: 2, title: "Recording Transactions", time: "3h 15m",
                        lectures: [
                            { id: 201, title: "Lec 3: Journal Entries", type: "video", url: "materials/dummy.mp4" },
                            { id: 202, title: "Lec 4: General Ledger", type: "pdf", url: "materials/dummy.pdf" }
                        ]
                    }
                ],
                quizzes: [
                    {
                        num: 1, title: "Quizzes - Part 1", time: "1h 30m",
                        lectures: [
                            { id: 1001, title: "Quiz 1: Corporate Equation", type: "pdf", url: "materials/dummy.pdf" },
                            { id: 1002, title: "Quiz 2: Journal Entries", type: "pdf", url: "materials/dummy.pdf" }
                        ]
                    }
                ],
                sections: [
                    {
                        num: 1, title: "Sections - Midterm", time: "2h",
                        lectures: [
                            { id: 2001, title: "Section 1: Ledger & Trial Balance", type: "pdf", url: "materials/dummy.pdf" },
                            { id: 2002, title: "Section 2: Adjusting Entries", type: "pdf", url: "materials/dummy.pdf" }
                        ]
                    }
                ],
                summaries: [
                    {
                        num: 1, title: "Summaries - Midterm", time: "45m",
                        lectures: [
                            { id: 3001, title: "Summary: Ledger & Trial Balance", type: "pdf", url: "materials/dummy.pdf" }
                        ]
                    }
                ],
                qa: [
                    {
                        num: 1, title: "Test Bank - Part 1", time: "1h 20m",
                        lectures: [
                            { id: 4001, title: "Q&A: Basics", type: "pdf", url: "materials/dummy.pdf" }
                        ]
                    }
                ],
                finalReview: [
                    // الداتا الخاصة بالمراجعة النهائية هتتضاف هنا
                ]
            }
        },
        { id: 'a2', title: 'Principles of Cost Accounting', icon: '🧮', color: '#ede9fe', accent: '#7c3aed', desc: 'Cost classification, marginal costing and variance analysis.' },
        { id: 'a3', title: 'Specialized Accounting Systems', icon: '🔍', color: '#dcfce7', accent: '#16a34a', desc: 'Accounting systems tailored for specific industries and entities.' },
        { id: 'a4', title: 'Quantitative Analysis for Business', icon: '📈', color: '#fef9c3', accent: '#ca8a04', desc: 'Mathematical and statistical modeling for business decision making.' },
        { id: 'a5', title: 'Principles of Financial Management', icon: '💰', color: '#fee2e2', accent: '#dc2626', desc: 'Capital budgeting, financial planning, and risk management.' },
        { id: 'a6', title: 'Money and Banking Economics', icon: '🏦', color: '#cffafe', accent: '#0891b2', desc: 'Financial markets, monetary policy, and banking institutions.' },
        { id: 'a7', title: 'Tax Systems', icon: '📋', color: '#fce7f3', accent: '#db2777', desc: 'Tax laws, corporate taxation, and revenue systems.' },
    ],
    business: [
        { id: 'b1', title: 'Quantitative Analysis for Business', icon: '📈', color: '#dbeafe', accent: '#2563eb', desc: 'Quantitative techniques and operations research for business.' },
        { id: 'b2', title: 'Principles of Financial Management', icon: '💰', color: '#fce7f3', accent: '#db2777', desc: 'Corporate finance, budgeting, and financial decision making.' },
        { id: 'b3', title: 'Public Institutions Management', icon: '🏛️', color: '#ede9fe', accent: '#7c3aed', desc: 'Administration and management of public sector organizations.' },
        { id: 'b4', title: 'Corporate Accounting', icon: '📊', color: '#dcfce7', accent: '#16a34a', desc: 'Accounting for corporations, partnerships and companies.' },
        { id: 'b5', title: 'Principles of Cost Accounting', icon: '🧮', color: '#fef9c3', accent: '#ca8a04', desc: 'Cost classification, marginal costing and variance analysis.' },
        { id: 'b6', title: 'Money and Banking Economics', icon: '🏦', color: '#fee2e2', accent: '#dc2626', desc: 'Financial markets, monetary policy, and banking institutions.' },
        { id: 'b7', title: 'Principles of Insurance', icon: '🛡️', color: '#cffafe', accent: '#0891b2', desc: 'Risk management, life and non-life insurance principles.' },
    ],
    economics: [
        { id: 'e1', title: 'Money and Banking Economics', icon: '🏦', color: '#dbeafe', accent: '#2563eb', desc: 'Financial markets, monetary policy, and banking institutions.' },
        { id: 'e2', title: 'History of Economic Thought', icon: '📜', color: '#dcfce7', accent: '#16a34a', desc: 'Evolution of economic ideas and major economic thinkers.' },
        { id: 'e3', title: 'Comparative Economic Systems', icon: '🌍', color: '#fef9c3', accent: '#ca8a04', desc: 'Analysis of different economic systems and structures.' },
        { id: 'e4', title: 'Industrial Economics', icon: '🏭', color: '#ede9fe', accent: '#7c3aed', desc: 'Market structure, firm behavior, and industrial organization.' },
        { id: 'e5', title: 'Statistics for Economists', icon: '📉', color: '#fee2e2', accent: '#dc2626', desc: 'Statistical methods and their application in economics.' },
        { id: 'e6', title: 'Principles of Cost Accounting', icon: '🧮', color: '#cffafe', accent: '#0891b2', desc: 'Cost classification, marginal costing and variance analysis.' },
        { id: 'e7', title: 'Financial Management', icon: '💰', color: '#fce7f3', accent: '#db2777', desc: 'Corporate finance, budgeting, and financial decision making.' },
    ],
    statistics: [
        { id: 's1', title: 'Applied Statistics (1)', icon: '📉', color: '#dbeafe', accent: '#2563eb', desc: 'Practical application of statistical methods and data analysis.' },
        { id: 's2', title: 'Statistics and Computer Lab', icon: '💻', color: '#ede9fe', accent: '#7c3aed', desc: 'Hands-on practice with statistical software and computational tools.' },
        { id: 's3', title: 'Quantitative Analysis Techniques', icon: '📐', color: '#dcfce7', accent: '#16a34a', desc: 'Mathematical modeling and quantitative problem solving.' },
        { id: 's4', title: 'Principles of Insurance', icon: '🛡️', color: '#fef9c3', accent: '#ca8a04', desc: 'Risk management, life and non-life insurance principles.' },
        { id: 's5', title: 'Principles of Cost Accounting', icon: '🧮', color: '#fee2e2', accent: '#dc2626', desc: 'Cost classification, marginal costing and variance analysis.' },
        { id: 's6', title: 'Finance and Investment', icon: '💰', color: '#cffafe', accent: '#0891b2', desc: 'Financial markets, investment strategies and portfolio management.' },
        { id: 's7', title: 'Money and Banking Economics', icon: '🏦', color: '#fce7f3', accent: '#db2777', desc: 'Financial markets, monetary policy, and banking institutions.' },
    ],
    political: [
        { id: 'p1', title: 'Political Systems and Political Life', icon: '🏛️', color: '#dbeafe', accent: '#2563eb', desc: 'Analysis of political structures, regimes, and political behavior.' },
        { id: 'p2', title: 'Public International Law', icon: '⚖️', color: '#ede9fe', accent: '#7c3aed', desc: 'Legal framework governing relations between sovereign states.' },
        { id: 'p3', title: 'Diplomatic History', icon: '📜', color: '#dcfce7', accent: '#16a34a', desc: 'Historical study of international relations and diplomacy.' },
        { id: 'p4', title: 'Money and Banking Economics', icon: '🏦', color: '#fef9c3', accent: '#ca8a04', desc: 'Financial markets, monetary policy, and banking institutions.' },
        { id: 'p5', title: 'Applied Statistics', icon: '📉', color: '#fee2e2', accent: '#dc2626', desc: 'Practical application of statistical methods to real-world data.' },
        { id: 'p6', title: 'Management of Governmental Organizations', icon: '🏢', color: '#cffafe', accent: '#0891b2', desc: 'Administration and management within the public sector.' },
        { id: 'p7', title: 'Comparative Economic Systems', icon: '🌍', color: '#fce7f3', accent: '#db2777', desc: 'Analysis of different economic systems and structures.' },
    ],
    customs: [
        { id: 'c1', title: 'Tax Systems', icon: '📋', color: '#dbeafe', accent: '#2563eb', desc: 'Tax laws, corporate taxation, and revenue systems.' },
        { id: 'c2', title: 'Ports and Customs Management', icon: '🚢', color: '#ede9fe', accent: '#7c3aed', desc: 'Administration of ports, customs procedures, and trade logistics.' },
        { id: 'c3', title: 'Money and Banking Economics', icon: '🏦', color: '#dcfce7', accent: '#16a34a', desc: 'Financial markets, monetary policy, and banking institutions.' },
        { id: 'c4', title: 'Finance and Investment', icon: '💰', color: '#fef9c3', accent: '#ca8a04', desc: 'Financial markets, investment strategies and portfolio management.' },
        { id: 'c5', title: 'Principles of Insurance', icon: '🛡️', color: '#fee2e2', accent: '#dc2626', desc: 'Risk management, life and non-life insurance principles.' },
        { id: 'c6', title: 'Principles of Cost Accounting', icon: '🧮', color: '#cffafe', accent: '#0891b2', desc: 'Cost classification, marginal costing and variance analysis.' },
        { id: 'c7', title: 'Management of Governmental Organizations', icon: '🏢', color: '#fce7f3', accent: '#db2777', desc: 'Administration and management within the public sector.' },
    ],
};

const ESSAYS = [
    { id: 'es1', title: 'The Impact of Digital Transformation on Commerce Education', doctor: 'Dr. Mohamed Hassan', tag: 'Technology', tagColor: '#dbeafe', tagText: '#1d4ed8', desc: 'An in-depth analysis of how digital tools are reshaping the future of business and commerce education in Egypt and globally.', readTime: '8 min read', date: 'June 2025' },
    { id: 'es2', title: 'Behavioral Economics: Why Students Make Irrational Financial Decisions', doctor: 'Dr. Sara Khalil', tag: 'Economics', tagColor: '#dcfce7', tagText: '#15803d', desc: 'Exploring psychological biases that affect students and young adults in their everyday financial choices.', readTime: '6 min read', date: 'May 2025' },
    { id: 'es3', title: 'ESG Reporting: The New Frontier of Corporate Accountability', doctor: 'Dr. Ahmed Nour', tag: 'Accounting', tagColor: '#ede9fe', tagText: '#6d28d9', desc: 'How environmental, social and governance disclosures are reshaping audit practices and investor relations worldwide.', readTime: '10 min read', date: 'April 2025' },
    { id: 'es4', title: 'Big Data Analytics: Opportunities for Statistics Students', doctor: 'Dr. Laila Mansour', tag: 'Statistics', tagColor: '#fef9c3', tagText: '#a16207', desc: 'A guide to how statistics students can leverage modern big data tools to enter the highest-paying data science roles.', readTime: '7 min read', date: 'March 2025' },
];

// Shared helpers
function getDeptKey(deptText) {
    const lower = (deptText || '').toLowerCase();
    if (lower.includes('account')) return 'accounting';
    if (lower.includes('business') || lower.includes('admin')) return 'business';
    if (lower.includes('econom')) return 'economics';
    if (lower.includes('statistic')) return 'statistics';
    if (lower.includes('political') || lower.includes('science')) return 'political';
    if (lower.includes('customs') || lower.includes('financial')) return 'customs';
    return 'accounting';
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('soFavorites') || '[]');
}

function saveFavorites(favs) {
    localStorage.setItem('soFavorites', JSON.stringify(favs));
}

function toggleFav(id, btnEl) {
    let favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx === -1) {
        favs.push(id);
        btnEl.classList.add('active');
        gsap.fromTo(btnEl, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
    } else {
        favs.splice(idx, 1);
        btnEl.classList.remove('active');
    }
    saveFavorites(favs);
}

// Map each study section to its respective completion store
const SECTION_STORE_MAP = {
    chapters: 'soCompletedLectures',
    quizzes: 'soCompletedQuizzes',
    sections: 'soCompletedSections',
    summaries: 'soCompletedSummaries',
    qa: 'soCompletedQA',
    finalReview: 'soCompletedFinalReview'
};

// Default section data shown when a subject has no custom content for that section
const DEFAULT_SECTION_DATA = {
    chapters: [
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
    ],
    quizzes: [
        {
            num: 1, title: "Quiz Set 1", time: "2h 15m",
            lectures: [
                { id: 1001, title: "Quiz 1: Overview", type: "pdf", url: "materials/dummy.pdf" },
                { id: 1002, title: "Quiz 2: First Principles", type: "pdf", url: "materials/dummy.pdf" }
            ]
        },
        {
            num: 2, title: "Quiz Set 2", time: "3h 40m",
            lectures: [
                { id: 1003, title: "Quiz 3: Deep Dive into Core", type: "video", url: "materials/dummy.mp4" },
                { id: 1004, title: "Quiz 4: Review Questions", type: "pdf", url: "materials/dummy.pdf" }
            ]
        }
    ],
    sections: [
        {
            num: 1, title: "Section Set 1", time: "2h 15m",
            lectures: [
                { id: 2001, title: "Section 1: Overview", type: "pdf", url: "materials/dummy.pdf" },
                { id: 2002, title: "Section 2: First Principles", type: "pdf", url: "materials/dummy.pdf" }
            ]
        },
        {
            num: 2, title: "Section Set 2", time: "3h 40m",
            lectures: [
                { id: 2003, title: "Section 3: Deep Dive into Core", type: "video", url: "materials/dummy.mp4" },
                { id: 2004, title: "Section 4: Review Questions", type: "pdf", url: "materials/dummy.pdf" }
            ]
        }
    ],
    summaries: [
        {
            num: 1, title: "Summaries - Part One", time: "30m",
            lectures: [
                { id: 3001, title: "Summary 1: Basics", type: "pdf", url: "materials/dummy.pdf" },
                { id: 3002, title: "Summary 2: Core Concepts", type: "pdf", url: "materials/dummy.pdf" }
            ]
        }
    ],
    qa: [
        {
            num: 1, title: "Q&A - Part One", time: "45m",
            lectures: [
                { id: 4001, title: "Q&A 1: Basics", type: "pdf", url: "materials/dummy.pdf" },
                { id: 4002, title: "Q&A 2: Core Concepts", type: "pdf", url: "materials/dummy.pdf" }
            ]
        }
    ],
    finalReview: []
};

// Fallback alias for backward compatibility
const DEFAULT_CHAPTERS = DEFAULT_SECTION_DATA.chapters;

// Helper to get section chapters for any subject
function getSubjectSectionData(subject, sectionKey) {
    if (subject && subject.content && subject.content[sectionKey] && subject.content[sectionKey].length > 0) {
        return subject.content[sectionKey];
    }
    return DEFAULT_SECTION_DATA[sectionKey] || [];
}

function getSubjectProgress(item) {
    if (!item) return 0;

    let totalLectures = 0;
    let doneLectures = 0;
    const sid = item.id;

    if (item.content) {
        const sections = ['chapters', 'quizzes', 'sections', 'summaries', 'qa', 'finalReview'];
        sections.forEach(sec => {
            if (!item.content[sec]) return;
            const storeKey = SECTION_STORE_MAP[sec] || 'soCompletedLectures';
            const completedStore = JSON.parse(localStorage.getItem(storeKey) || '{}');

            item.content[sec].forEach(ch => {
                if (!ch.lectures) return;
                ch.lectures.forEach(lec => {
                    totalLectures++;
                    const key = sid + '_' + lec.id;
                    if (completedStore[key]) {
                        doneLectures++;
                    } else if (sec === 'summaries' && completedStore[sid + '_101'] && lec.id === 3001) {
                        doneLectures++;
                    } else if (sec === 'qa' && completedStore[sid + '_101'] && lec.id === 4001) {
                        doneLectures++;
                    }
                });
            });
        });
    } else {
        const completedStore = JSON.parse(localStorage.getItem('soCompletedLectures') || '{}');
        DEFAULT_CHAPTERS.forEach(ch => {
            if (!ch.lectures) return;
            ch.lectures.forEach(lec => {
                totalLectures++;
                if (completedStore[sid + '_' + lec.id]) {
                    doneLectures++;
                }
            });
        });
    }

    if (totalLectures === 0) return 0;
    return Math.round((doneLectures / totalLectures) * 100);
}

function getSubjectModulesCount(item) {
    if (!item) return 0;
    if (item.content) {
        const sections = ['chapters', 'quizzes', 'sections', 'summaries', 'qa', 'finalReview'];
        let total = 0;
        sections.forEach(sec => {
            if (item.content[sec]) total += item.content[sec].length;
        });
        return total > 0 ? total : DEFAULT_CHAPTERS.length;
    }
    return DEFAULT_CHAPTERS.length;
}

function materialCardHTML(item, isFav, isPinned = false) {
    const progress = getSubjectProgress(item);
    const modulesFromContent = getSubjectModulesCount(item);
    const chaptersCount = modulesFromContent;

    return `
    <a href="subject.html?id=${item.id}" class="material-card group" style="text-decoration: none; position: relative; display: flex; flex-direction: column; overflow: hidden; background: #ffffff; border-radius: 24px; padding: 28px; box-shadow: 0 10px 40px -10px ${item.accent}15; border: 1px solid rgba(0,0,0,0.03); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); isolation: isolate; outline: none; margin-bottom: 24px;">

        <!-- Background glowing orbs -->
        <div style="position: absolute; top: -20%; right: -20%; width: 250px; height: 250px; background: radial-gradient(circle, ${item.accent}40 0%, transparent 70%); z-index: -1; transition: all 0.6s ease; opacity: 0.6; filter: blur(20px);" class="glow-orb"></div>
        <div style="position: absolute; bottom: -10%; left: -10%; width: 150px; height: 150px; background: radial-gradient(circle, ${item.color} 0%, transparent 70%); z-index: -1; filter: blur(20px);"></div>


        <!-- Action Buttons (floating top-right) -->
        <div style="position: absolute; top: 20px; right: 20px; display: flex; gap: 8px; z-index: 10;">
            <button class="action-btn pin-btn ${isPinned ? 'active' : ''}" data-id="${item.id}" title="${isPinned ? 'Unpin' : 'Pin to Top'}"
                style="width: 34px; height: 34px; border-radius: 12px; background: ${isPinned ? item.color : 'rgba(255,255,255,0.7)'}; backdrop-filter: blur(8px); border: 1px solid ${isPinned ? item.accent + '30' : 'rgba(255,255,255,0.9)'}; color: ${isPinned ? item.accent : '#94a3b8'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <svg class="w-4 h-4" fill="${isPinned ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
            </button>
            <button class="action-btn fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Save to Favorites"
                style="position: relative; width: 34px; height: 34px; border-radius: 12px; background: ${isFav ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.7)'}; backdrop-filter: blur(8px); border: 1px solid ${isFav ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.9)'}; color: ${isFav ? '#F59E0B' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <svg class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
            </button>
        </div>

        <!-- Premium Icon -->
        <div class="card-icon-container" style="position: relative; width: 64px; height: 64px; margin-bottom: 24px; align-self: center;">
            <!-- Ambient glow aura -->
            <div class="icon-glow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90px; height: 90px; background: radial-gradient(circle, ${item.accent}35 0%, ${item.accent}10 50%, transparent 70%); filter: blur(10px); pointer-events: none; transition: all 0.5s ease;"></div>
            <!-- Gradient border ring -->
            <div style="position: absolute; inset: -2px; border-radius: 22px; background: linear-gradient(135deg, ${item.accent}70, ${item.color}, ${item.accent}35); transition: all 0.4s;"></div>
            <!-- Glossy inner face -->
            <div class="card-icon" style="position: relative; width: 100%; height: 100%; border-radius: 20px; background: linear-gradient(145deg, rgba(255,255,255,0.97), ${item.color}bb); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: inset 0 2px 6px rgba(255,255,255,1), inset 0 -1px 3px ${item.accent}08, 0 4px 16px rgba(0,0,0,0.05); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <span style="filter: drop-shadow(0 3px 6px ${item.accent}40); transition: filter 0.3s;">${item.icon}</span>
            </div>
        </div>

        <!-- Content -->
        <h3 class="card-title" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1.25; margin-bottom: 12px; letter-spacing: -0.01em; transition: color 0.3s;">${item.title}</h3>
        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 32px; flex: 1;">${item.desc}</p>

        <!-- Bottom Footer (Stats & Progress) -->
        <div style="margin-top: auto;">

            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 12px;">
                <span style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Progress</span>
                <span style="font-size: 1rem; font-weight: 800; color: ${item.accent}; line-height: 1;">${progress}%</span>
            </div>

            <!-- Sleek Progress Bar -->
            <div style="width: 100%; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; position: relative; border: 1px solid rgba(0,0,0,0.02);">
                <div style="position: absolute; top: 0; left: 0; height: 100%; width: ${progress}%; background: linear-gradient(90deg, ${item.accent}cc, ${item.accent}); border-radius: 10px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);"></div>
            </div>
        </div>
    </a>`;
}

function essayCardHTML(e, isFav) {
    return `
    <div class="essay-card group">
        <div class="card-accent" style="background: linear-gradient(90deg, ${e.tagText}, ${e.tagColor});"></div>
        <div class="card-glow" style="background: radial-gradient(circle, ${e.tagColor} 0%, transparent 70%);"></div>

        <div class="card-inner">
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${e.id}" title="Save to Favorites">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </button>

            <div class="tag" style="background: ${e.tagColor}30; color: ${e.tagText}; border-color: ${e.tagColor};">${e.tag}</div>

            <h3 class="card-title pr-8">${e.title}</h3>
            <p class="card-desc mb-6">${e.desc}</p>

            <div class="essay-meta">
                <div>
                    <p class="meta-author">${e.doctor}</p>
                    <p class="meta-date">${e.date}</p>
                </div>
                <span class="meta-badge" style="color: ${e.tagText}; background: ${e.tagColor}40; border-color: ${e.tagColor};">${e.readTime}</span>
            </div>
        </div>
    </div>`;
}

function bindActionButtons(container) {
    container.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFav(btn.dataset.id, btn);
        });
    });

    container.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            togglePin(btn.dataset.id, btn);
        });
    });
}

function getPinned() {
    return JSON.parse(localStorage.getItem('soPinned') || '[]');
}

function savePinned(pinned) {
    localStorage.setItem('soPinned', JSON.stringify(pinned));
}

function togglePin(id, btnEl) {
    let pinned = getPinned();
    const idx = pinned.indexOf(id);

    // Find the item color data to restyle the button
    let itemAccent = '#0EA5E9', itemColor = '#F0F9FF';
    for (const group of Object.values(MATERIALS)) {
        const found = group.find(g => g.id === id);
        if (found) {
            itemAccent = found.accent;
            itemColor = found.color;
            break;
        }
    }

    if (idx === -1) {
        pinned.push(id);
        btnEl.classList.add('active');
        btnEl.title = "Unpin";
        btnEl.style.color = itemAccent;
        btnEl.style.background = itemColor;
        btnEl.style.borderColor = itemAccent + '40';
        if (typeof gsap !== 'undefined') gsap.fromTo(btnEl, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
    } else {
        pinned.splice(idx, 1);
        btnEl.classList.remove('active');
        btnEl.title = "Pin to Top";
        btnEl.style.color = '';
        btnEl.style.background = '';
        btnEl.style.borderColor = '';
    }
    savePinned(pinned);

    // Dispatch event so browse.js can re-sort immediately
    window.dispatchEvent(new CustomEvent('so-pin-changed'));
}

// ── Global Helper: Toggle PDF in Offline Library ─────────────
window.togglePdfLibrary = async function (event, btn, rawTitle, rawUrl, subjectId, lecId) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const title = decodeURIComponent(rawTitle || 'Document');
    const url = decodeURIComponent(rawUrl || '');
    const sid = subjectId || '';
    const lid = lecId ? String(lecId) : '';

    try {
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');

        // Find existing by subject+lec ID OR by unique title/url match
        const existingIndex = library.findIndex(item => 
            (sid && lid && item.subjectId === sid && String(item.lecId) === lid) ||
            (item.title === title && item.url === url) ||
            (item.id === `${sid}_${lid}`)
        );

        const isCurrentlyInLib = existingIndex !== -1;

        if (!isCurrentlyInLib) {
            // ── ADD TO LIBRARY ─────────────────────────────
            library.push({
                id: `${sid}_${lid}_${Date.now()}`,
                subjectId: sid,
                lecId: lid,
                title: title,
                type: 'pdf',
                url: url,
                dateAdded: new Date().toISOString(),
                isRead: false
            });
            localStorage.setItem('so_offline_library', JSON.stringify(library));

            // Cache offline if supported
            if ('caches' in window && url) {
                try {
                    const cache = await caches.open('offline-materials');
                    await cache.add(url);
                } catch (e) {
                    console.log('Offline cache skipped:', e);
                }
            }

            // 1. Show Green Checkmark for exactly 1 second (1000ms)
            if (btn) {
                btn.classList.remove('in-library');
                btn.classList.add('saved-success');
                btn.title = "Added to Library";

                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(btn, { scale: 0.9 }, { scale: 1.15, duration: 0.25, ease: 'back.out(2)' });
                }

                setTimeout(() => {
                    // 2. Transform into Minus (-) state
                    btn.classList.remove('saved-success');
                    btn.classList.add('in-library');
                    btn.title = "Remove from Library";
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(btn, { scale: 1.1 }, { scale: 1, duration: 0.25, ease: 'power2.out' });
                    }
                }, 1000);
            }

        } else {
            // ── REMOVE FROM LIBRARY ────────────────────────
            library.splice(existingIndex, 1);
            localStorage.setItem('so_offline_library', JSON.stringify(library));

            // Transform back to Plus (+) state
            if (btn) {
                btn.classList.remove('saved-success', 'in-library');
                btn.title = "Add to Library";

                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
                }
            }
        }

    } catch (err) {
        console.error('Error toggling library:', err);
    }
};

window.addPdfToLibrary = window.togglePdfLibrary;
