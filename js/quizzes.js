/* =========================================================
   quizzes.js — Quizzes Page Logic
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
    document.getElementById('quiz-subj-title').textContent = subject.title;

    // Set hero gradient background
    const heroBg = document.getElementById('quiz-hero-bg');
    heroBg.style.background = `linear-gradient(135deg, ${subject.accent} 0%, ${subject.accent}E6 100%)`;

    // Mock Data for Quizzes
    const quizParts = [
        {
            id: 'part1',
            title: "Quizzes on Part One",
            desc: "Covering the first half of the curriculum",
            quizzes: [
                { id: 101, title: "Quiz 1: Basics", pdfUrl: "materials/dummy.pdf" },
                { id: 102, title: "Quiz 2: Core Concepts", pdfUrl: "materials/dummy.pdf" },
                { id: 103, title: "Quiz 3: Applications", pdfUrl: "materials/dummy.pdf" }
            ]
        },
        {
            id: 'part2',
            title: "Quizzes on Part Two",
            desc: "Covering the second half of the curriculum",
            quizzes: [
                { id: 201, title: "Quiz 4: Advanced Topics", pdfUrl: "materials/dummy.pdf" },
                { id: 202, title: "Quiz 5: Final Review", pdfUrl: "materials/dummy.pdf" }
            ]
        }
    ];

    const container = document.getElementById('quiz-parts-container');
    const completedQuizzes = JSON.parse(localStorage.getItem('soCompletedQuizzes') || '{}');

    window.markQuizDone = function (event, quizId) {
        event.stopPropagation();
        event.preventDefault();

        const card = document.getElementById(`quiz-card-${quizId}`);
        const isDone = card.classList.contains('done');

        const completed = JSON.parse(localStorage.getItem('soCompletedQuizzes') || '{}');

        if (isDone) {
            card.classList.remove('done');
            delete completed[quizId];
        } else {
            card.classList.add('done');
            completed[quizId] = true;
        }

        localStorage.setItem('soCompletedQuizzes', JSON.stringify(completed));
    };

    const html = quizParts.map(part => {
        const quizzesHtml = part.quizzes.map(quiz => {
            const isDone = completedQuizzes[quiz.id] === true;

            return `
            <div class="quiz-card ${isDone ? 'done' : ''}" id="quiz-card-${quiz.id}">
                <div class="quiz-card-main">
                    <div class="quiz-info">
                        <div class="quiz-icon">📝</div>
                        <div>
                            <h3 class="quiz-title">${quiz.title}</h3>
                            <div class="quiz-meta">Includes PDF</div>
                        </div>
                    </div>
                    
                    <button class="quiz-done-btn" onclick="markQuizDone(event, ${quiz.id})" title="Mark as completed">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 check-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <div class="quiz-actions">
                    <a href="player.html?id=${quiz.id}_pdf&type=pdf&url=${encodeURIComponent(quiz.pdfUrl)}&title=${encodeURIComponent(quiz.title + ' (Questions)')}" class="quiz-action-btn pdf-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        View Quiz
                    </a>
                </div>
            </div>
            `;
        }).join('');

        return `
        <div class="quiz-part-section">
            <div class="quiz-part-header">
                <h2 class="quiz-part-title">${part.title}</h2>
                <p class="quiz-part-desc">${part.desc}</p>
            </div>
            <div class="quiz-list">
                ${quizzesHtml}
            </div>
        </div>
        `;
    }).join('');

    container.innerHTML = html;

    // Animation
    if (typeof gsap !== 'undefined') {
        gsap.from('.quiz-part-section', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }
});
