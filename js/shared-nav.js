/* shared-nav.js — Injects the shared navbar and highlights the current page */
(function () {
    const links = [
        { href: 'dashboard.html', label: 'Home', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>` },
        { href: 'browse.html', label: 'Browse', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>` },
        { href: 'essays.html', label: 'Doctor Essays', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>` },
        { href: 'favorites.html', label: 'Favorites', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>` },
    ];

    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    const userName = localStorage.getItem('subjectsOnlineName') || 'Student';
    const initial = userName[0].toUpperCase();

    // Sanitize old Arabic values from local storage
    let storedDept = localStorage.getItem('subjectsOnlineDept');
    if (storedDept && storedDept.includes('(')) {
        storedDept = storedDept.replace(/\s*\(.*?\)\s*/g, '').trim();
        localStorage.setItem('subjectsOnlineDept', storedDept);
    }

    const avatarTheme = localStorage.getItem('subjectsOnlineAvatarTheme') || 'blue';
    const avatarImage = localStorage.getItem('subjectsOnlineAvatarImage') || null;

    const themeGradients = {
        'blue': 'linear-gradient(135deg,#bfdbfe,#dbeafe)',
        'emerald': 'linear-gradient(135deg,#6ee7b7,#d1fae5)',
        'rose': 'linear-gradient(135deg,#fda4af,#ffe4e6)',
        'violet': 'linear-gradient(135deg,#c4b5fd,#ede9fe)'
    };
    const themeTextColors = {
        'blue': '#1d4ed8', 'emerald': '#047857', 'rose': '#be123c', 'violet': '#6d28d9'
    };

    const bgGradient = avatarImage ? 'transparent' : (themeGradients[avatarTheme] || themeGradients['blue']);
    const textColor = themeTextColors[avatarTheme] || themeTextColors['blue'];

    // Construct avatar content
    const avatarContent = avatarImage
        ? `<img src="${avatarImage}" alt="User Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
        : initial;

    const navHTML = `
    <nav id="shared-nav" style="
        position: sticky; top: 0; z-index: 50;
        width: 100%;
        background: rgba(255,255,255,0.35);
        backdrop-filter: blur(35px) saturate(200%);
        -webkit-backdrop-filter: blur(35px) saturate(200%);
        border-bottom: 1px solid rgba(255,255,255,0.4);
        box-shadow: 0 1px 0 rgba(37,99,235,0.05), 0 4px 20px rgba(37,99,235,0.04);
    ">
        <div style="max-width:72rem; margin:0 auto; padding:0 1.5rem; height:64px; display:flex; align-items:center; justify-content:space-between; gap:1rem;">

            <!-- Logo -->
            <a href="dashboard.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;">
                <div style="
                    width:36px;height:36px;border-radius:50%;
                    background:linear-gradient(135deg,#1d4ed8,#60a5fa);
                    display:flex;align-items:center;justify-content:center;
                    color:#fff;font-family:'Playfair Display',serif;font-weight:700;font-size:1.1rem;
                    box-shadow:0 0 16px rgba(37,99,235,0.5);
                ">S</div>
                <span style="font-family:'Playfair Display',serif;font-weight:700;font-size:1.1rem;color:#172554;letter-spacing:-0.01em;" class="logo-text-primary">
                    Subjects <span style="color:#60a5fa;font-weight:300;" class="logo-text-secondary">Online</span>
                </span>
            </a>

            <div id="nav-pills" style="
                display:flex;align-items:center;gap:4px;
                background:rgba(255,255,255,0.2);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border:1px solid rgba(255,255,255,0.5);
                border-radius:999px;
                padding:5px;
            ">
                ${links.map(link => {
        const isActive = currentPage === link.href;
        return `
                    <a href="${link.href}" style="
                        display:flex;align-items:center;gap:6px;
                        padding:7px 16px;border-radius:999px;
                        font-size:0.82rem;font-weight:600;
                        text-decoration:none;
                        transition:all 0.25s;
                        ${isActive
                ? 'background:#2563eb;color:#ffffff;box-shadow:0 4px 14px rgba(37,99,235,0.35);'
                : 'color:#3b82f6;background:transparent;'}
                    "
                    onmouseover="if(this.dataset.active!=='1'){this.style.background='rgba(37,99,235,0.08)';this.style.color='#1d4ed8';}"
                    onmouseout="if(this.dataset.active!=='1'){this.style.background='transparent';this.style.color='#3b82f6';}"
                    data-active="${isActive ? '1' : '0'}"
                    >
                        ${link.icon}
                        <span class="nav-label">${link.label}</span>
                    </a>`;
    }).join('')}
            </div>

            <!-- Right Side: Actions + User chip -->
            <div style="display:flex;align-items:center;gap:15px;flex-shrink:0;position:relative;">
                
                <!-- Dark Mode Toggle -->
                <button id="snav-dark-btn" style="
                    background:none;border:none;cursor:pointer;
                    color:#3b82f6;padding:5px;border-radius:50%;
                    transition:all 0.2s;display:flex;align-items:center;justify-content:center;
                " onmouseover="this.style.background='rgba(37,99,235,0.1)'" onmouseout="this.style.background='transparent'">
                    <!-- Moon Icon -->
                    <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                    <!-- Sun Icon (hidden by default) -->
                    <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="display:none;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </button>

                <!-- Notifications -->
                <div style="position:relative;">
                    <button id="snav-notif-btn" style="
                        background:none;border:none;cursor:pointer;
                        color:#3b82f6;padding:5px;border-radius:50%;
                        transition:all 0.2s;display:flex;align-items:center;justify-content:center;position:relative;
                    " onmouseover="this.style.background='rgba(37,99,235,0.1)'" onmouseout="this.style.background='transparent'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                        <span style="position:absolute;top:2px;right:4px;width:8px;height:8px;background:#ef4444;border-radius:50%;border:2px solid #fff;"></span>
                    </button>

                    <!-- Notif Dropdown -->
                    <div id="snav-notif-dropdown" style="
                        display:none;position:absolute;top:120%;right:-10px;width:300px;
                        background:#ffffff;border:1px solid rgba(219,234,254,0.8);
                        border-radius:1rem;box-shadow:0 10px 40px rgba(37,99,235,0.15);
                        overflow:hidden;z-index:100;
                    ">
                        <div style="padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:0.9rem;color:#1e3a8a;">
                            Notifications
                        </div>
                        <div style="padding:12px 16px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                            <p style="font-size:0.8rem;color:#1e40af;font-weight:600;margin:0 0 4px 0;">New Material Added 📚</p>
                            <p style="font-size:0.75rem;color:#64748b;margin:0;">Chapter 4 PDF is now available in your Accounting module.</p>
                        </div>
                        <div style="padding:12px 16px;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                            <p style="font-size:0.8rem;color:#1e40af;font-weight:600;margin:0 0 4px 0;">Doctor Essay Published 📝</p>
                            <p style="font-size:0.75rem;color:#64748b;margin:0;">Dr. Ahmed Nour just published "ESG Reporting".</p>
                        </div>
                    </div>
                </div>

                <!-- User chip -->
                <a href="profile.html" style="display:flex;align-items:center;gap:10px;padding-left:10px;border-left:1px solid rgba(219,234,254,0.8);text-decoration:none;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="
                        width:36px;height:36px;border-radius:50%;
                        background:${bgGradient};
                        display:flex;align-items:center;justify-content:center;
                        color:${textColor};font-weight:700;font-size:0.9rem;
                        border:1.5px solid rgba(255,255,255,0.5);
                        flex-shrink:0;overflow:hidden;
                    ">${avatarContent}</div>
                    <span id="snav-username" style="
                        font-size:0.85rem;font-weight:600;color:#1e3a8a;
                        white-space:nowrap;
                        display:none;
                    ">${userName}</span>
                </a>
            </div>
        </div>
    </nav>
    `;

    const footerHTML = `
    <footer style="
        margin-top: 5rem;
        width: 100%;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border-top: 1px solid rgba(255, 255, 255, 0.8);
        padding: 5rem 2rem 2rem 2rem;
        position: relative;
        z-index: 10;
        box-shadow: 0 -20px 40px rgba(15, 23, 42, 0.02);
    " class="shared-footer-mega">
        
        <div style="max-width: 76rem; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem; margin-bottom: 4rem;">
                
                <!-- Column 1: Brand & About -->
                <div style="display:flex; flex-direction: column; gap: 1.5rem;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="
                            width:42px;height:42px;border-radius:12px;
                            background:linear-gradient(135deg,#1e3a8a,#3b82f6);
                            display:flex;align-items:center;justify-content:center;
                            color:#fff;font-family:'Playfair Display',serif;font-weight:800;font-size:1.3rem;
                            box-shadow:0 8px 20px rgba(37,99,235,0.3);
                        ">S</div>
                        <h3 style="font-family:'Playfair Display',serif;font-weight:700;font-size:1.3rem;color:#172554;margin:0;line-height:1.2;" class="mega-logo-text">
                            Subjects <span style="color:#3b82f6;font-weight:400;">Online</span>
                        </h3>
                    </div>
                    <p style="font-size:0.9rem;color:#64748b;line-height:1.7;margin:0;font-weight:300;" class="mega-desc">
                        A premium educational platform crafted specifically for commerce students. Elevate your learning experience with our modern tools and resources.
                    </p>
                    <div style="display:flex;gap:1rem;margin-top:0.5rem;" class="mega-socials">
                        <!-- Facebook -->
                        <a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(37,99,235,0.1);display:flex;align-items:center;justify-content:center;color:#2563eb;transition:all 0.3s;" onmouseover="this.style.background='#2563eb';this.style.color='#fff';" onmouseout="this.style.background='rgba(37,99,235,0.1)';this.style.color='#2563eb';">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/></svg>
                        </a>
                        <!-- Twitter/X -->
                        <a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(37,99,235,0.1);display:flex;align-items:center;justify-content:center;color:#2563eb;transition:all 0.3s;" onmouseover="this.style.background='#2563eb';this.style.color='#fff';" onmouseout="this.style.background='rgba(37,99,235,0.1)';this.style.color='#2563eb';">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.873 11.633Z"/></svg>
                        </a>
                        <!-- YouTube -->
                        <a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(37,99,235,0.1);display:flex;align-items:center;justify-content:center;color:#2563eb;transition:all 0.3s;" onmouseover="this.style.background='#2563eb';this.style.color='#fff';" onmouseout="this.style.background='rgba(37,99,235,0.1)';this.style.color='#2563eb';">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Column 2: Platform -->
                <div style="display:flex; flex-direction: column; gap: 1rem;">
                    <h4 style="font-size:1.05rem;font-weight:700;color:#1e3a8a;margin:0 0 0.5rem 0;" class="mega-col-title">Platform</h4>
                    <a href="dashboard.html" class="mega-link">Home Dashboard</a>
                    <a href="browse.html" class="mega-link">Library & Materials</a>
                    <a href="essays.html" class="mega-link">Doctor Essays</a>
                    <a href="favorites.html" class="mega-link">My Favorites</a>
                    <a href="#" class="mega-link">Study Planner</a>
                </div>

                <!-- Column 3: Resources -->
                <div style="display:flex; flex-direction: column; gap: 1rem;">
                    <h4 style="font-size:1.05rem;font-weight:700;color:#1e3a8a;margin:0 0 0.5rem 0;" class="mega-col-title">Resources</h4>
                    <a href="#" class="mega-link">Help Center & FAQ</a>
                    <a href="#" class="mega-link">Contact Support</a>
                    <a href="#" class="mega-link">Report a Bug</a>
                    <a href="#" class="mega-link">Community Forum</a>
                    <a href="#" class="mega-link">System Status</a>
                </div>

                <!-- Column 4: Legal -->
                <div style="display:flex; flex-direction: column; gap: 1rem;">
                    <h4 style="font-size:1.05rem;font-weight:700;color:#1e3a8a;margin:0 0 0.5rem 0;" class="mega-col-title">Legal & Privacy</h4>
                    <a href="#" class="mega-link">Terms of Service</a>
                    <a href="#" class="mega-link">Privacy Policy</a>
                    <a href="#" class="mega-link">Cookie Policy</a>
                    <a href="#" class="mega-link">Accessibility</a>
                </div>

            </div>

            <div style="width: 100%; height: 1px; background: rgba(59,130,246,0.15); margin: 2rem 0;"></div>

            <div style="display:flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <p style="font-size:0.85rem;color:#64748b;margin:0;font-weight:500;" class="mega-copy">
                    &copy; ${new Date().getFullYear()} Subjects Online. All rights reserved.
                </p>
                <div style="display:flex; gap: 1.5rem;">
                    <span style="font-size:0.8rem;color:#94a3b8;" class="mega-lang">Language: <strong>English</strong></span>
                    <span style="font-size:0.8rem;color:#94a3b8;" class="mega-lang">Designed with <span style="color:#ef4444;font-size:1rem;line-height:0;position:relative;top:2px;">&hearts;</span></span>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Inject at top of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Inject footer only on dashboard
    if (currentPage === 'dashboard.html' || currentPage === '' || currentPage === '/') {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Show name on md screens & inject Dark Mode CSS
    const style = document.createElement('style');
    style.textContent = `
        @media (min-width: 640px) {
            #snav-username { display: block !important; }
        }
        @media (max-width: 767px) {
            #nav-pills {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
            }
            #nav-pills a:not([href="dashboard.html"]) { display: none !important; }
            #nav-pills a[href="dashboard.html"] { 
                background: transparent !important; 
                color: #3b82f6 !important; 
                box-shadow: none !important; 
                padding: 5px !important;
            }
            #nav-pills a[href="dashboard.html"] svg {
                transform: scale(1.35) !important;
            }
            html.dark-mode #nav-pills a[href="dashboard.html"] { color: #94a3b8 !important; }
            .nav-label { display: none !important; }
        }
        @media (max-width: 500px) {
            #snav-notif-dropdown { right: -60px !important; width: 260px !important; }
        }
        @media (max-width: 400px) {
            .logo-text-secondary { display: none; }
            #shared-nav > div { padding: 0 1rem !important; gap: 0.5rem !important; }
        }

        /* Mega Footer Styles */
        .mega-link {
            font-size: 0.9rem;
            color: #475569;
            text-decoration: none;
            transition: all 0.2s;
            font-weight: 500;
            display: inline-block;
        }
        .mega-link:hover {
            color: #2563eb;
            transform: translateX(4px);
        }
        
        /* Dark mode overrides for Mega Footer */
        html.dark-mode .shared-footer-mega {
            background: rgba(10, 15, 25, 0.7) !important;
            border-top-color: rgba(255,255,255,0.08) !important;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.3) !important;
        }
        html.dark-mode .mega-logo-text { color: #f8fafc !important; }
        html.dark-mode .mega-desc { color: #94a3b8 !important; }
        html.dark-mode .mega-col-title { color: #e2e8f0 !important; }
        html.dark-mode .mega-link { color: #cbd5e1 !important; }
        html.dark-mode .mega-link:hover { color: #60a5fa !important; }
        html.dark-mode .mega-copy, html.dark-mode .mega-lang { color: #64748b !important; }
        html.dark-mode .mega-socials a { background: rgba(255,255,255,0.05) !important; color: #94a3b8 !important; }
        html.dark-mode .mega-socials a:hover { background: #3b82f6 !important; color: #fff !important; }

        /* ===== PREMIUM OLED DARK MODE STYLES ===== */
        html.dark-mode body {
            background: #050505 !important;
            color: #ededed !important;
        }
        html.dark-mode .bg-surface { background: #050505 !important; }
        html.dark-mode #shared-nav {
            background: rgba(5, 5, 5, 0.35) !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            box-shadow: 0 4px 30px rgba(0,0,0,0.5) !important;
        }
        html.dark-mode #nav-pills {
            background: rgba(255, 255, 255, 0.03) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
        }
        html.dark-mode #nav-pills a:not([data-active="1"]) { color: #888 !important; }
        html.dark-mode #nav-pills a:not([data-active="1"]):hover { color: #fff !important; background: rgba(255,255,255,0.05) !important; }
        html.dark-mode .text-blue-950, html.dark-mode .text-blue-900 { color: #ffffff !important; }
        html.dark-mode .text-blue-500, html.dark-mode .text-blue-400 { color: #a1a1aa !important; }
        
        /* Dark Mode Dashboard Cards */
        html.dark-mode .stat-number-card, html.dark-mode .stat-card, html.dark-mode .material-card, html.dark-mode .essay-card {
            background: rgba(20, 20, 20, 0.6) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5) !important;
        }
        html.dark-mode .stat-number-card::before, html.dark-mode .material-card::before {
            background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%) !important;
        }
        html.dark-mode .stat-number-card:hover, html.dark-mode .material-card:hover, html.dark-mode .essay-card:hover {
            border-color: rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8) !important;
        }
        html.dark-mode .not-opened-item { background: rgba(25, 25, 25, 0.8) !important; border-color: rgba(255, 255, 255, 0.05) !important; }
        html.dark-mode .not-opened-item:hover { background: rgba(40, 40, 40, 0.9) !important; border-color: rgba(255, 255, 255, 0.15) !important; }
        html.dark-mode .not-opened-item .start-badge { background: rgba(37,99,235,0.2) !important; border-color: rgba(37,99,235,0.4) !important; color: #60a5fa !important; }
        html.dark-mode .not-opened-item:hover .start-badge { background: #2563eb !important; color: #fff !important; }
        
        /* Planner & Inputs */
        html.dark-mode input#planner-input { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; color: #fff !important; }
        html.dark-mode input#planner-input::placeholder { color: #666 !important; }
        html.dark-mode #planner-list > div { background: rgba(255,255,255,0.03) !important; border-color: rgba(255,255,255,0.08) !important; }
        html.dark-mode #planner-list > div.bg-blue-50\\/50 { background: rgba(37,99,235,0.1) !important; border-color: rgba(37,99,235,0.3) !important; }
        
        /* Nav actions */
        html.dark-mode #snav-notif-btn, html.dark-mode #snav-dark-btn { color: #a1a1aa !important; }
        html.dark-mode #snav-notif-btn:hover, html.dark-mode #snav-dark-btn:hover { color: #fff !important; background: rgba(255,255,255,0.1) !important; }
        html.dark-mode #snav-notif-dropdown { background: #121212 !important; border-color: rgba(255,255,255,0.1) !important; }
        html.dark-mode #snav-notif-dropdown div { border-color: rgba(255,255,255,0.05) !important; }
        html.dark-mode #snav-notif-dropdown p:first-child { color: #ededed !important; }
        html.dark-mode #snav-notif-dropdown p:last-child { color: #a1a1aa !important; }
        
        /* Glow Orbs in Dark Mode */
        html.dark-mode .glow-orb.orb-1 { background: radial-gradient(circle, rgba(56,189,248,0.4), transparent 70%) !important; opacity:0.15 !important; mix-blend-mode: screen; }
        html.dark-mode .glow-orb.orb-2 { background: radial-gradient(circle, rgba(129,140,248,0.4), transparent 70%) !important; opacity:0.15 !important; mix-blend-mode: screen; }
    `;
    document.head.appendChild(style);

    // Notifications Logic
    const notifBtn = document.getElementById('snav-notif-btn');
    const notifDropdown = document.getElementById('snav-notif-dropdown');
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = notifDropdown.style.display === 'none';
        notifDropdown.style.display = isHidden ? 'block' : 'none';

        // Remove red dot when clicked
        const dot = notifBtn.querySelector('span');
        if (dot) dot.style.display = 'none';
    });
    document.addEventListener('click', () => notifDropdown.style.display = 'none');

    // Dark Mode Logic
    const darkBtn = document.getElementById('snav-dark-btn');
    const iconMoon = document.getElementById('icon-moon');
    const iconSun = document.getElementById('icon-sun');

    // Check initial state
    if (localStorage.getItem('soDarkMode') === '1') {
        document.documentElement.classList.add('dark-mode');
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
    }

    darkBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('soDarkMode', isDark ? '1' : '0');
        iconMoon.style.display = isDark ? 'none' : 'block';
        iconSun.style.display = isDark ? 'block' : 'none';
    });

})();
