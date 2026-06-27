/* ===================================================
   SUBJECTS ONLINE — Premium Splash Screen Logic (Light Theme)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Generate floating particles ----
    const particlesContainer = document.getElementById('particles');
    const particleCount = 35; // increased particles

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Alternate between colors
        if (Math.random() > 0.6) {
            particle.classList.add('gold');
        }

        // Randomize position & timing
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 10;
        const size = 1.5 + Math.random() * 2.5;

        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);
    }

    // ---- Simulate Loading Wait time ----
    const splashScreen = document.getElementById('splash-screen');

    setTimeout(() => {
        splashScreen.classList.add('splash-exit');

        // After animation finishes, redirect based on login status
        splashScreen.addEventListener('animationend', () => {
            const isLoggedIn = localStorage.getItem('subjectsOnlineName') && localStorage.getItem('subjectsOnlineDept');
            if (isLoggedIn) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'welcome.html';
            }
        });
    }, 2500);

});
