/* ===================================================
   SUBJECTS ONLINE — Shared Data
   =================================================== */

const MATERIALS = {
    accounting: [
        { id:'a1', title:'Financial Accounting',   icon:'📊', color:'#dbeafe', accent:'#2563eb', desc:'Basics of financial statements, ledgers and balance sheets.' },
        { id:'a2', title:'Cost Accounting',         icon:'🧮', color:'#ede9fe', accent:'#7c3aed', desc:'Cost classification, marginal costing and variance analysis.' },
        { id:'a3', title:'Auditing',                icon:'🔍', color:'#dcfce7', accent:'#16a34a', desc:'Internal & external auditing standards and procedures.' },
        { id:'a4', title:'Tax Accounting',          icon:'📋', color:'#fef9c3', accent:'#ca8a04', desc:'Egyptian tax law, VAT, income tax returns & filings.' },
        { id:'a5', title:'Accounting Information Systems', icon:'💻', color:'#fee2e2', accent:'#dc2626', desc:'ERP systems, data entry workflows, and digital reporting.' },
        { id:'a6', title:'Management Accounting',   icon:'📈', color:'#cffafe', accent:'#0891b2', desc:'Budgeting, forecasting and managerial decision making.' },
    ],
    business: [
        { id:'b1', title:'Principles of Management', icon:'🏢', color:'#dbeafe', accent:'#2563eb', desc:'Planning, organizing, leading and controlling organizations.' },
        { id:'b2', title:'Marketing Management',     icon:'📣', color:'#fce7f3', accent:'#db2777', desc:'Market segmentation, targeting and the 4Ps of marketing.' },
        { id:'b3', title:'Business Law',             icon:'⚖️', color:'#ede9fe', accent:'#7c3aed', desc:'Commercial contracts, company law and dispute resolution.' },
        { id:'b4', title:'Human Resources',          icon:'👥', color:'#dcfce7', accent:'#16a34a', desc:'Recruitment, performance management and labor relations.' },
        { id:'b5', title:'Operations Management',   icon:'⚙️', color:'#fef9c3', accent:'#ca8a04', desc:'Supply chain, quality control and lean production methods.' },
        { id:'b6', title:'Entrepreneurship',        icon:'🚀', color:'#fee2e2', accent:'#dc2626', desc:'Business planning, startups and innovation frameworks.' },
    ],
    economics: [
        { id:'e1', title:'Microeconomics',          icon:'🏪', color:'#dbeafe', accent:'#2563eb', desc:'Supply & demand, market equilibrium and consumer theory.' },
        { id:'e2', title:'Macroeconomics',          icon:'🌍', color:'#dcfce7', accent:'#16a34a', desc:'GDP, inflation, monetary and fiscal policy analysis.' },
        { id:'e3', title:'Development Economics',   icon:'📊', color:'#fef9c3', accent:'#ca8a04', desc:'Economic growth models and development policy tools.' },
        { id:'e4', title:'International Trade',     icon:'🌐', color:'#ede9fe', accent:'#7c3aed', desc:'Trade theories, WTO, tariffs and comparative advantage.' },
        { id:'e5', title:'Econometrics',            icon:'📉', color:'#fee2e2', accent:'#dc2626', desc:'Regression analysis, statistical modeling and forecasting.' },
        { id:'e6', title:'Public Finance',          icon:'🏦', color:'#cffafe', accent:'#0891b2', desc:'Government budget, public expenditure and taxation theory.' },
    ],
    statistics: [
        { id:'s1', title:'Descriptive Statistics',  icon:'📐', color:'#dbeafe', accent:'#2563eb', desc:'Mean, median, mode, variance and data visualization.' },
        { id:'s2', title:'Probability Theory',      icon:'🎲', color:'#ede9fe', accent:'#7c3aed', desc:'Random variables, distributions and probability rules.' },
        { id:'s3', title:'Inferential Statistics',  icon:'🔬', color:'#dcfce7', accent:'#16a34a', desc:'Hypothesis testing, confidence intervals and p-values.' },
        { id:'s4', title:'Sampling Methods',        icon:'📦', color:'#fef9c3', accent:'#ca8a04', desc:'Random, stratified and cluster sampling techniques.' },
        { id:'s5', title:'Time Series Analysis',    icon:'📈', color:'#fee2e2', accent:'#dc2626', desc:'Trend analysis, seasonal decomposition and forecasting.' },
        { id:'s6', title:'Statistical Software',    icon:'💻', color:'#cffafe', accent:'#0891b2', desc:'SPSS, R and Python for statistical computing.' },
    ],
    is: [
        { id:'i1', title:'Database Systems',        icon:'🗄️', color:'#dbeafe', accent:'#2563eb', desc:'SQL, ERD design, normalization and relational databases.' },
        { id:'i2', title:'Systems Analysis',        icon:'🖥️', color:'#ede9fe', accent:'#7c3aed', desc:'SDLC, UML diagrams and business requirements analysis.' },
        { id:'i3', title:'Networking Fundamentals', icon:'🌐', color:'#dcfce7', accent:'#16a34a', desc:'TCP/IP, OSI model, routing protocols and network security.' },
        { id:'i4', title:'Programming (Python)',    icon:'🐍', color:'#fef9c3', accent:'#ca8a04', desc:'Data structures, OOP and automation using Python.' },
        { id:'i5', title:'IT Project Management',  icon:'📋', color:'#fee2e2', accent:'#dc2626', desc:'Agile, Scrum, Gantt charts and risk management.' },
        { id:'i6', title:'E-Commerce Systems',     icon:'🛒', color:'#cffafe', accent:'#0891b2', desc:'Online business models, payment gateways and UX.' },
    ],
};

const ESSAYS = [
    { id:'es1', title:'The Impact of Digital Transformation on Commerce Education', doctor:'Dr. Mohamed Hassan', tag:'Technology', tagColor:'#dbeafe', tagText:'#1d4ed8', desc:'An in-depth analysis of how digital tools are reshaping the future of business and commerce education in Egypt and globally.', readTime:'8 min read', date:'June 2025' },
    { id:'es2', title:'Behavioral Economics: Why Students Make Irrational Financial Decisions', doctor:'Dr. Sara Khalil', tag:'Economics', tagColor:'#dcfce7', tagText:'#15803d', desc:'Exploring psychological biases that affect students and young adults in their everyday financial choices.', readTime:'6 min read', date:'May 2025' },
    { id:'es3', title:'ESG Reporting: The New Frontier of Corporate Accountability', doctor:'Dr. Ahmed Nour', tag:'Accounting', tagColor:'#ede9fe', tagText:'#6d28d9', desc:'How environmental, social and governance disclosures are reshaping audit practices and investor relations worldwide.', readTime:'10 min read', date:'April 2025' },
    { id:'es4', title:'Big Data Analytics: Opportunities for Statistics Students', doctor:'Dr. Laila Mansour', tag:'Statistics', tagColor:'#fef9c3', tagText:'#a16207', desc:'A guide to how statistics students can leverage modern big data tools to enter the highest-paying data science roles.', readTime:'7 min read', date:'March 2025' },
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

function materialCardHTML(item, isFav) {
    return `
    <a href="subject.html?id=${item.id}" class="material-card group" style="text-decoration: none;">
        <div class="card-accent" style="background: linear-gradient(90deg, ${item.accent}, ${item.color});"></div>
        <div class="card-glow" style="background: radial-gradient(circle, ${item.color} 0%, transparent 70%);"></div>
        
        <div class="card-inner">
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Save to Favorites">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </button>
            
            <div class="card-icon-wrap" style="background: rgba(255,255,255,0.4); border-color: ${item.color};">
                <span class="emoji-icon">${item.icon}</span>
            </div>
            
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.desc}</p>
            
            <div class="card-cta" style="color: ${item.accent}; background: ${item.color}30; border-color: ${item.color};">
                <span>View Material</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 icon-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
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

function bindFavButtons(container) {
    container.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFav(btn.dataset.id, btn);
        });
    });
}
