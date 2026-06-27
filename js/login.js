/* ===================================================
   SUBJECTS ONLINE — Login Page JS
   GSAP Animations, File Upload, and Validation
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initial GSAP Intro Animation
    initIntroAnimation();

    // 3. Setup Form Validation
    setupFormValidation();
});

/**
 * GSAP Intro Animation
 */
function initIntroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Header fades down
    tl.fromTo('.login-header', 
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, clearProps: 'transform' }, 
        0.2
    );

    // Card fades up
    tl.fromTo('.login-card', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, clearProps: 'transform' }, 
        0.5
    );
}


/**
 * Form Validation Logic
 */
function setupFormValidation() {
    const form = document.getElementById('login-form');
    const nameInput = document.getElementById('user-name');
    const nameErrorMsg = document.getElementById('name-error');
    const nameValidIcon = document.getElementById('name-valid-icon');
    
    const passInput = document.getElementById('user-password');
    const passErrorMsg = document.getElementById('password-error');
    const passValidIcon = document.getElementById('password-valid-icon');

    const deptInput = document.getElementById('user-department');
    const deptErrorMsg = document.getElementById('dept-error');

    // Real-time validation for Name
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length > 0) {
            nameValidIcon.classList.remove('opacity-0');
            nameValidIcon.classList.add('opacity-100');
            nameErrorMsg.classList.add('hidden');
            nameInput.classList.remove('border-red-400', 'focus:ring-red-500/50');
            nameInput.classList.add('border-blue-200', 'focus:ring-blue-500/50');
        } else {
            nameValidIcon.classList.remove('opacity-100');
            nameValidIcon.classList.add('opacity-0');
        }
    });

    // Real-time validation for Password
    passInput.addEventListener('input', () => {
        if (passInput.value.length > 0) {
            passValidIcon.classList.remove('opacity-0');
            passValidIcon.classList.add('opacity-100');
            passErrorMsg.classList.add('hidden');
            passInput.classList.remove('border-red-400', 'focus:ring-red-500/50');
            passInput.classList.add('border-blue-200', 'focus:ring-blue-500/50');
        } else {
            passValidIcon.classList.remove('opacity-100');
            passValidIcon.classList.add('opacity-0');
        }
    });

    // Real-time validation for Department
    deptInput.addEventListener('change', () => {
        if (deptInput.value) {
            deptErrorMsg.classList.add('hidden');
            deptInput.classList.remove('border-red-400', 'focus:ring-red-500/50');
            deptInput.classList.add('border-blue-200', 'focus:ring-blue-500/50');
        }
    });

    const googleBtn = document.getElementById('google-btn');

    // Google Sign-In handler
    googleBtn.addEventListener('click', () => {
        if (!deptInput.value) {
            deptErrorMsg.classList.remove('hidden');
            deptInput.classList.remove('border-blue-200', 'focus:ring-blue-500/50');
            deptInput.classList.add('border-red-400', 'focus:ring-red-500/50', 'ring-2', 'ring-red-500/50');
            
            gsap.fromTo(deptInput, 
                { x: -5 }, 
                { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: 'none', onComplete: () => gsap.set(deptInput, {x: 0}) }
            );
            return;
        }

        const selectedDeptText = deptInput.options[deptInput.selectedIndex].text;
        triggerCreativeLoader(selectedDeptText);
    });

    // Submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const password = passInput.value;
        let hasError = false;

        // Validate Name
        if (!name) {
            hasError = true;
            nameErrorMsg.classList.remove('hidden');
            nameInput.classList.remove('border-blue-200', 'focus:ring-blue-500/50');
            nameInput.classList.add('border-red-400', 'focus:ring-red-500/50', 'ring-2', 'ring-red-500/50');
            
            gsap.fromTo(nameInput, 
                { x: -5 }, 
                { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: 'none', onComplete: () => gsap.set(nameInput, {x: 0}) }
            );
        }

        // Validate Password
        if (!password) {
            hasError = true;
            passErrorMsg.classList.remove('hidden');
            passInput.classList.remove('border-blue-200', 'focus:ring-blue-500/50');
            passInput.classList.add('border-red-400', 'focus:ring-red-500/50', 'ring-2', 'ring-red-500/50');
            
            gsap.fromTo(passInput, 
                { x: -5 }, 
                { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: 'none', onComplete: () => gsap.set(passInput, {x: 0}) }
            );
        }

        // Validate Department
        if (!deptInput.value) {
            hasError = true;
            deptErrorMsg.classList.remove('hidden');
            deptInput.classList.remove('border-blue-200', 'focus:ring-blue-500/50');
            deptInput.classList.add('border-red-400', 'focus:ring-red-500/50', 'ring-2', 'ring-red-500/50');
            
            gsap.fromTo(deptInput, 
                { x: -5 }, 
                { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: 'none', onComplete: () => gsap.set(deptInput, {x: 0}) }
            );
        }

        if (hasError) return;

        // --- SUCCESS STATE ---
        const selectedDeptText = deptInput.options[deptInput.selectedIndex].text;
        triggerCreativeLoader(selectedDeptText);
    });
}

/**
 * Triggers the fullscreen creative loading animation
 */
function triggerCreativeLoader(departmentName) {
    const loader = document.getElementById('creative-loader');
    const loginCard = document.querySelector('.login-card');
    const loginHeader = document.querySelector('.login-header');
    
    // 1. Hide Form smoothly
    gsap.to([loginCard, loginHeader], { 
        y: -30, 
        opacity: 0, 
        duration: 0.6, 
        ease: 'power3.in' 
    });

    // 2. Show Loader
    loader.classList.remove('pointer-events-none');
    gsap.to(loader, { opacity: 1, duration: 1, delay: 0.4 });

    // 3. Animate Progress Bar
    gsap.to('#loader-progress', { width: '100%', duration: 4.5, ease: 'power1.inOut', delay: 0.8 });

    // 4. Cycle text
    const statusText = document.getElementById('loader-status-text');
    const phrases = [
        "Authenticating Securely...",
        `Loading ${departmentName} Data...`,
        "Preparing Your Modules...",
        "Almost Ready..."
    ];
    
    let tl = gsap.timeline({ delay: 1 });
    phrases.forEach((phrase) => {
        tl.to(statusText, { opacity: 0, y: -10, duration: 0.3 })
          .call(() => statusText.innerText = phrase)
          .fromTo(statusText, { y: 10, opacity: 0 }, { opacity: 1, y: 0, duration: 0.4 })
          .to({}, { duration: 0.6 }); // wait
    });

    // 5. When done, redirect
    tl.call(() => {
        gsap.to('#creative-loader', { opacity: 0, duration: 0.5, onComplete: () => {
            // Get name (if Google btn clicked and name is empty, provide a mock name)
            const nameInput = document.getElementById('user-name').value.trim();
            const userName = nameInput || 'Google User';

            // Save to localStorage to display on Dashboard
            localStorage.setItem('subjectsOnlineName', userName);
            localStorage.setItem('subjectsOnlineDept', departmentName);

            // Redirect
            window.location.href = 'dashboard.html';
        }});
    });
}
