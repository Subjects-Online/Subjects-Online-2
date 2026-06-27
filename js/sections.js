/* =========================================================
   sections.js — Sections Page Logic
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

    // Set Theme Colors
    document.documentElement.style.setProperty('--subject-accent', subject.accent);
    document.documentElement.style.setProperty('--subject-glow', subject.color);

    // Setup Hero
    document.getElementById('section-subj-title').textContent = subject.title;

    // Set hero gradient background
    const heroBg = document.getElementById('section-hero-bg');
    heroBg.style.background = `linear-gradient(135deg, ${subject.accent} 0%, ${subject.accent}E6 100%)`;

    // Mock Data for Sections
    const sectionParts = [
        {
            id: 'part1',
            title: "Sections on Part One",
            desc: "First half of the curriculum",
            sections: [
                { id: 101, title: "Section 1: Basics", pdfUrl: "materials/dummy.pdf" },
                { id: 102, title: "Section 2: Core Concepts", pdfUrl: "materials/dummy.pdf" },
                { id: 103, title: "Section 3: Applications", pdfUrl: "materials/dummy.pdf" }
            ]
        },
        {
            id: 'part2',
            title: "Sections on Part Two",
            desc: "Second half of the curriculum",
            sections: [
                { id: 201, title: "Section 4: Advanced Topics", pdfUrl: "materials/dummy.pdf" },
                { id: 202, title: "Section 5: Final Review", pdfUrl: "materials/dummy.pdf" }
            ]
        }
    ];

    const container = document.getElementById('section-parts-container');
    const completedSections = JSON.parse(localStorage.getItem('soCompletedSections') || '{}');

    window.markSectionDone = function (event, sectionId) {
        event.stopPropagation();
        event.preventDefault();

        const card = document.getElementById(`section-card-${sectionId}`);
        const isDone = card.classList.contains('done');

        const completed = JSON.parse(localStorage.getItem('soCompletedSections') || '{}');

        if (isDone) {
            card.classList.remove('done');
            delete completed[sectionId];
        } else {
            card.classList.add('done');
            completed[sectionId] = true;
        }

        localStorage.setItem('soCompletedSections', JSON.stringify(completed));
    };

    const html = sectionParts.map(part => {
        const sectionsHtml = part.sections.map(section => {
            const isDone = completedSections[section.id] === true;

            return `
            <div class="section-card ${isDone ? 'done' : ''}" id="section-card-${section.id}">
                <div class="section-card-main">
                    <div class="section-info">
                        <div class="section-icon">📝</div>
                        <div>
                            <h3 class="section-title">${section.title}</h3>
                            <div class="section-meta">Includes PDF</div>
                        </div>
                    </div>
                    
                    <button class="section-done-btn" onclick="markSectionDone(event, ${section.id})" title="Mark as completed">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 check-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <div class="section-actions">
                    <a href="player.html?id=${section.id}_pdf&type=pdf&url=${encodeURIComponent(section.pdfUrl)}&title=${encodeURIComponent(section.title)}" class="section-action-btn pdf-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        View Section
                    </a>
                </div>
            </div>
            `;
        }).join('');

        return `
        <div class="section-part-section">
            <div class="section-part-header">
                <h2 class="section-part-title">${part.title}</h2>
                <p class="section-part-desc">${part.desc}</p>
            </div>
            <div class="section-list">
                ${sectionsHtml}
            </div>
        </div>
        `;
    }).join('');

    container.innerHTML = html;

    // Animation
    if (typeof gsap !== 'undefined') {
        gsap.from('.section-part-section', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }
});
