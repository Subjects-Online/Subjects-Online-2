/* profile.js - Handles the Profile Settings functionality */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const nameInput = document.getElementById('profile-name');
    const deptInput = document.getElementById('profile-dept');
    const form = document.getElementById('profile-form');
    const successMsg = document.getElementById('success-msg');
    const avatarDisplay = document.getElementById('profile-avatar-display');
    const themeBtns = document.querySelectorAll('#avatar-theme-selector button');
    const uploadInput = document.getElementById('avatar-upload');
    const removeBtn = document.getElementById('avatar-remove');
    const logoutBtn = document.getElementById('logout-btn');

    // 2. Load existing data
    const currentName = localStorage.getItem('subjectsOnlineName') || '';
    const currentDept = localStorage.getItem('subjectsOnlineDept') || 'Accounting';
    let currentTheme = localStorage.getItem('subjectsOnlineAvatarTheme') || 'blue';
    let currentImage = localStorage.getItem('subjectsOnlineAvatarImage') || null;

    nameInput.value = currentName;
    deptInput.value = currentDept;
    
    if (!currentImage && currentName) {
        avatarDisplay.textContent = currentName[0].toUpperCase();
    }

    // 3. Handle Theme Selection UI
    const themeClasses = {
        'blue': 'from-blue-600 to-blue-400 ring-blue-500',
        'emerald': 'from-emerald-500 to-teal-400 ring-emerald-500',
        'rose': 'from-rose-500 to-pink-500 ring-rose-500',
        'violet': 'from-violet-600 to-purple-500 ring-violet-500'
    };

    function updateAvatarDisplay(theme, imgSrc = null) {
        // Reset base classes for gradient
        avatarDisplay.className = `w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] border-4 border-white/50 overflow-hidden bg-cover bg-center`;
        
        if (imgSrc) {
            avatarDisplay.style.backgroundImage = `url(${imgSrc})`;
            avatarDisplay.textContent = '';
            avatarDisplay.classList.remove('bg-gradient-to-br', ...Object.values(themeClasses).flatMap(c => c.split(' ')));
            removeBtn.classList.remove('hidden');
        } else {
            avatarDisplay.style.backgroundImage = 'none';
            avatarDisplay.textContent = nameInput.value.trim() ? nameInput.value.trim()[0].toUpperCase() : 'S';
            avatarDisplay.classList.add('bg-gradient-to-br', ...themeClasses[theme].split(' '));
            removeBtn.classList.add('hidden');
        }
        
        // Update selection UI
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === theme) {
                btn.classList.remove('opacity-60');
                btn.classList.add('ring-2', 'ring-offset-2');
            } else {
                btn.classList.add('opacity-60');
                btn.classList.remove('ring-2', 'ring-offset-2');
            }
        });
    }

    // Initial setup
    updateAvatarDisplay(currentTheme, currentImage);

    // Click listeners for themes
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTheme = btn.dataset.theme;
            updateAvatarDisplay(currentTheme, currentImage);
        });
    });

    // Image Upload Logic
    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentImage = e.target.result;
                updateAvatarDisplay(currentTheme, currentImage);
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove Image Logic
    removeBtn.addEventListener('click', () => {
        currentImage = null;
        uploadInput.value = '';
        updateAvatarDisplay(currentTheme, currentImage);
    });

    // Real-time initial update
    nameInput.addEventListener('input', (e) => {
        if (currentImage) return; // Do not overwrite image with initial
        const val = e.target.value.trim();
        if (val) avatarDisplay.textContent = val[0].toUpperCase();
        else avatarDisplay.textContent = 'S';
    });

    // 4. Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newName = nameInput.value.trim();
        const newDept = deptInput.value;

        if (newName && newDept) {
            // Save to localStorage
            localStorage.setItem('subjectsOnlineName', newName);
            localStorage.setItem('subjectsOnlineDept', newDept);
            localStorage.setItem('subjectsOnlineAvatarTheme', currentTheme);
            if (currentImage) {
                localStorage.setItem('subjectsOnlineAvatarImage', currentImage);
            } else {
                localStorage.removeItem('subjectsOnlineAvatarImage');
            }

            // Show success and redirect
            successMsg.classList.remove('hidden');
            gsap.fromTo(successMsg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
        }
    });

    // 5. Logout Logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear all user-specific data from localStorage
            localStorage.removeItem('subjectsOnlineName');
            localStorage.removeItem('subjectsOnlineDept');
            localStorage.removeItem('subjectsOnlineAvatarTheme');
            localStorage.removeItem('subjectsOnlineAvatarImage');
            localStorage.removeItem('soPlannerTasks');
            // We can keep Dark Mode preference if we want, or clear it. We'll keep it.

            // Redirect to Welcome page
            window.location.href = 'index.html';
        });
    }

    // 6. Entrance Animation
    gsap.fromTo('.page-content > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
});
