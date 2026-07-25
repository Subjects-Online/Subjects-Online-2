/* ===================================================
   SUBJECTS ONLINE — Premium Splash Screen Logic
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Simulate Loading Wait time (Matching CSS animation) ----
    const splashScreen = document.getElementById('splash-screen');

    // The loading progress CSS animation takes ~2.8s total (0.8s delay + 2s duration)
    setTimeout(() => {
        splashScreen.classList.add('splash-exit');

        // After exit animation finishes, redirect based on login status
        splashScreen.addEventListener('animationend', (e) => {
            // Ensure we're listening to the splashFadeOut animation on the main container
            if (e.animationName === 'splashFadeOut') {
                const isLoggedIn = localStorage.getItem('subjectsOnlineName') && localStorage.getItem('subjectsOnlineDept');
                if (isLoggedIn) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'welcome.html';
                }
            }
        });
    }, 3000);

});
