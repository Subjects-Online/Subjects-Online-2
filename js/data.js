/* ===================================================
   SUBJECTS ONLINE — Shared Data
   =================================================== */

const MATERIALS = {
    accounting: [
        { id: 'a1', title: 'Financial Accounting', icon: '📊', color: '#dbeafe', accent: '#2563eb', desc: 'Basics of financial statements, ledgers and balance sheets.' },
        { id: 'a2', title: 'Cost Accounting', icon: '🧮', color: '#ede9fe', accent: '#7c3aed', desc: 'Cost classification, marginal costing and variance analysis.' },
        { id: 'a3', title: 'Auditing', icon: '🔍', color: '#dcfce7', accent: '#16a34a', desc: 'Internal & external auditing standards and procedures.' },
        { id: 'a4', title: 'Tax Accounting', icon: '📋', color: '#fef9c3', accent: '#ca8a04', desc: 'Egyptian tax law, VAT, income tax returns & filings.' },
        { id: 'a5', title: 'Accounting Information Systems', icon: '💻', color: '#fee2e2', accent: '#dc2626', desc: 'ERP systems, data entry workflows, and digital reporting.' },
        { id: 'a6', title: 'Management Accounting', icon: '📈', color: '#cffafe', accent: '#0891b2', desc: 'Budgeting, forecasting and managerial decision making.' },
    ],
    business: [
        { id: 'b1', title: 'Principles of Management', icon: '🏢', color: '#dbeafe', accent: '#2563eb', desc: 'Planning, organizing, leading and controlling organizations.' },
        { id: 'b2', title: 'Marketing Management', icon: '📣', color: '#fce7f3', accent: '#db2777', desc: 'Market segmentation, targeting and the 4Ps of marketing.' },
        { id: 'b3', title: 'Business Law', icon: '⚖️', color: '#ede9fe', accent: '#7c3aed', desc: 'Commercial contracts, company law and dispute resolution.' },
        { id: 'b4', title: 'Human Resources', icon: '👥', color: '#dcfce7', accent: '#16a34a', desc: 'Recruitment, performance management and labor relations.' },
        { id: 'b5', title: 'Operations Management', icon: '⚙️', color: '#fef9c3', accent: '#ca8a04', desc: 'Supply chain, quality control and lean production methods.' },
        { id: 'b6', title: 'Entrepreneurship', icon: '🚀', color: '#fee2e2', accent: '#dc2626', desc: 'Business planning, startups and innovation frameworks.' },
    ],
    economics: [
        { id: 'e1', title: 'Microeconomics', icon: '🏪', color: '#dbeafe', accent: '#2563eb', desc: 'Supply & demand, market equilibrium and consumer theory.' },
        { id: 'e2', title: 'Macroeconomics', icon: '🌍', color: '#dcfce7', accent: '#16a34a', desc: 'GDP, inflation, monetary and fiscal policy analysis.' },
        { id: 'e3', title: 'Development Economics', icon: '📊', color: '#fef9c3', accent: '#ca8a04', desc: 'Economic growth models and development policy tools.' },
        { id: 'e4', title: 'International Trade', icon: '🌐', color: '#ede9fe', accent: '#7c3aed', desc: 'Trade theories, WTO, tariffs and comparative advantage.' },
        { id: 'e5', title: 'Econometrics', icon: '📉', color: '#fee2e2', accent: '#dc2626', desc: 'Regression analysis, statistical modeling and forecasting.' },
        { id: 'e6', title: 'Public Finance', icon: '🏦', color: '#cffafe', accent: '#0891b2', desc: 'Government budget, public expenditure and taxation theory.' },
    ],
    statistics: [
        { id: 's1', title: 'Descriptive Statistics', icon: '📐', color: '#dbeafe', accent: '#2563eb', desc: 'Mean, median, mode, variance and data visualization.' },
        { id: 's2', title: 'Probability Theory', icon: '🎲', color: '#ede9fe', accent: '#7c3aed', desc: 'Random variables, distributions and probability rules.' },
        { id: 's3', title: 'Inferential Statistics', icon: '🔬', color: '#dcfce7', accent: '#16a34a', desc: 'Hypothesis testing, confidence intervals and p-values.' },
        { id: 's4', title: 'Sampling Methods', icon: '📦', color: '#fef9c3', accent: '#ca8a04', desc: 'Random, stratified and cluster sampling techniques.' },
        { id: 's5', title: 'Time Series Analysis', icon: '📈', color: '#fee2e2', accent: '#dc2626', desc: 'Trend analysis, seasonal decomposition and forecasting.' },
        { id: 's6', title: 'Statistical Software', icon: '💻', color: '#cffafe', accent: '#0891b2', desc: 'SPSS, R and Python for statistical computing.' },
    ],
    is: [
        { id: 'i1', title: 'Database Systems', icon: '🗄️', color: '#dbeafe', accent: '#2563eb', desc: 'SQL, ERD design, normalization and relational databases.' },
        { id: 'i2', title: 'Systems Analysis', icon: '🖥️', color: '#ede9fe', accent: '#7c3aed', desc: 'SDLC, UML diagrams and business requirements analysis.' },
        { id: 'i3', title: 'Networking Fundamentals', icon: '🌐', color: '#dcfce7', accent: '#16a34a', desc: 'TCP/IP, OSI model, routing protocols and network security.' },
        { id: 'i4', title: 'Programming (Python)', icon: '🐍', color: '#fef9c3', accent: '#ca8a04', desc: 'Data structures, OOP and automation using Python.' },
        { id: 'i5', title: 'IT Project Management', icon: '📋', color: '#fee2e2', accent: '#dc2626', desc: 'Agile, Scrum, Gantt charts and risk management.' },
        { id: 'i6', title: 'E-Commerce Systems', icon: '🛒', color: '#cffafe', accent: '#0891b2', desc: 'Online business models, payment gateways and UX.' },
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
    if (lower.includes('information') || lower.includes(' is')) return 'is';
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

function materialCardHTML(item, isFav, isPinned = false) {
    // Mock progress and chapter count based on ID
    const idSum = item.id.charCodeAt(0) + item.id.charCodeAt(1);
    const progress = (idSum % 10) * 10 + Math.floor(idSum % 5) * 5; // e.g. 45, 80, 20
    const chaptersCount = (idSum % 6) + 7; // e.g. 7 to 12

    return `
    <a href="subject.html?id=${item.id}" class="material-card group" style="text-decoration: none; position: relative; overflow: hidden; background: linear-gradient(135deg, ${item.color}60, #ffffff 80%); border: 1px solid ${item.accent}20; border-radius: 2rem; padding: 1.75rem; display: flex; flex-direction: column; min-height: 240px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        
        <!-- Background Blur Glow -->
        <div style="position: absolute; top: -20%; right: -10%; width: 180px; height: 180px; background: ${item.accent}; opacity: 0.12; filter: blur(40px); border-radius: 50%; pointer-events: none;"></div>
        
        <!-- HUGE Emoji Icon on the Right -->
        <div style="position: absolute; right: -15px; bottom: -20px; font-size: 8rem; line-height: 1; opacity: 0.15; transform: rotate(-15deg); filter: drop-shadow(0 20px 20px rgba(0,0,0,0.1)); pointer-events: none; transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);" class="group-hover:scale-110 group-hover:-translate-y-4 group-hover:-translate-x-2 group-hover:opacity-30 group-hover:rotate-0">
            ${item.icon}
        </div>

        <!-- Top Row: Chapters Tag & Actions -->
        <div style="position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: auto; width: 100%;">
            
            <!-- Small Clean Icon -->
            <div style="width: 44px; height: 44px; border-radius: 1rem; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid ${item.accent}30; box-shadow: 0 8px 20px ${item.accent}15; transition: transform 0.3s;" class="group-hover:scale-110">
                ${item.icon}
            </div>

            <!-- Right Actions & Progress -->
            <div style="display: flex; gap: 8px; align-items: center;">
                <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 6px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; color: ${item.accent}; border: 1px solid ${item.accent}20; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                    ${progress}% <span style="opacity:0.6; font-weight:500;">done</span>
                </div>
                
                <div style="display:flex; gap:6px;">
                    <!-- Pin Button -->
                    <button class="action-btn pin-btn ${isPinned ? 'active' : ''}" data-id="${item.id}" title="${isPinned ? 'Unpin' : 'Pin to Top'}"
                        style="width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); border: 1px solid ${item.accent}20; color: ${isPinned ? item.accent : '#94a3b8'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: all 0.2s;" onmouseover="this.style.background='${item.color}'; this.style.color='${item.accent}'" onmouseout="if(!this.classList.contains('active')) { this.style.background='rgba(255,255,255,0.8)'; this.style.color='#94a3b8'; }">
                        <svg class="w-4 h-4" fill="${isPinned ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                    </button>
                    
                    <!-- Fav Button -->
                    <button class="action-btn fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Save to Favorites"
                        style="width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); border: 1px solid ${item.accent}20; color: ${isFav ? '#F59E0B' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: all 0.2s;" onmouseover="this.style.background='rgba(251,191,36,0.1)'; this.style.color='#F59E0B'" onmouseout="if(!this.classList.contains('active')) { this.style.background='rgba(255,255,255,0.8)'; this.style.color='#94a3b8'; }">
                        <svg class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bottom Text Content -->
        <div style="position: relative; z-index: 10; margin-top: 3.5rem;">
            <div style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px; font-size:0.65rem; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; background:rgba(255,255,255,0.6); color:${item.accent}; border:1px solid ${item.accent}20; margin-bottom: 0.75rem; backdrop-filter: blur(4px);">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
                </svg>
                ${chaptersCount} Modules
            </div>

            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 0.5rem; transition: color 0.3s;" class="group-hover:text-blue-700">
                ${item.title}
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 85%;">
                ${item.desc}
            </p>
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
