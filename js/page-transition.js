// js/page-transition.js
// Injects a solid overlay during page loads to create a smooth SPA-like cross-fade, preventing white flashes.

(function() {
    // Determine the background color based on Dark Mode preference
    const isDark = localStorage.getItem('soDarkMode') === '1';
    const bgColor = isDark ? '#050505' : '#ffffff';

    // Create the overlay element immediately
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = bgColor;
    overlay.style.zIndex = '999999';
    overlay.style.opacity = '1';
    overlay.style.transition = 'opacity 0.4s ease-in-out';
    overlay.style.pointerEvents = 'none'; // allow clicks underneath if needed
    
    // Append it to html element as early as possible
    document.documentElement.appendChild(overlay);

    // Fade out the overlay when the page is fully loaded
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 450); // Matches the 0.4s CSS transition + slight buffer
        });
    });

    // Intercept navigation clicks to trigger a fade out before leaving the page
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        
        const href = link.getAttribute("href");
        
        // Ignore links that shouldn't transition (hashes, external, new tabs, js)
        if (!href || href.startsWith("#") || href.startsWith("javascript:") || link.getAttribute("target") === "_blank" ||
            (link.hostname && link.hostname !== window.location.hostname)) {
            return;
        }

        e.preventDefault();

        // Add overlay back to fade out
        document.documentElement.appendChild(overlay);
        window.getComputedStyle(overlay).opacity; // Force a CSS reflow
        overlay.style.opacity = '1';

        // Wait for fade to complete, then navigate
        setTimeout(() => {
            window.location.href = href;
        }, 400);
    });

    // Fix for Back/Forward cache (bfcache) - if user clicks 'back' button
    window.addEventListener("pageshow", (e) => {
        if (e.persisted && overlay.parentNode) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 450);
        }
    });

    // ==========================================
    // 1. LENIS SMOOTH SCROLL (Dynamic Load)
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const lenisScript = document.createElement('script');
        lenisScript.src = 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.19/bundled/lenis.min.js';
        lenisScript.onload = () => {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                smoothTouch: false,
            });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        };
        document.head.appendChild(lenisScript);
    });

    // ==========================================
    // 2. PREMIUM UI MICRO-SOUNDS (Web Audio API)
    // ==========================================
    let audioCtx = null;
    
    function playClickSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        // High pitched short tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // very soft
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    // Attach sound to all interactive elements globally
    document.addEventListener('mousedown', (e) => {
        const interactive = e.target.closest('a, button, input[type="submit"], input[type="checkbox"], select, .cursor-pointer, .home-card');
        if (interactive) {
            playClickSound();
        }
    });

    // ==========================================
    // 3. CINEMATIC FILM GRAIN (Canvas Animation)
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'film-grain-canvas';
        
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '99998',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 1.5s ease',
            mixBlendMode: 'overlay',
        });

        document.body.appendChild(canvas);

        // Fade in grain smoothly after 1 second
        setTimeout(() => { canvas.style.opacity = '0.055'; }, 1000);

        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        let animId;

        // Responsive resize
        window.addEventListener('resize', () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });

        // Performance-optimized grain: draw a small tile and tile it
        const TILE = 128;
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = TILE;
        tileCanvas.height = TILE;
        const tileCtx = tileCanvas.getContext('2d');

        function generateGrainTile() {
            const imageData = tileCtx.createImageData(TILE, TILE);
            const data = imageData.data;
            const len = data.length;
            for (let i = 0; i < len; i += 4) {
                // Random monochrome grain pixel
                const v = (Math.random() * 255) | 0;
                data[i]     = v;  // R
                data[i + 1] = v;  // G
                data[i + 2] = v;  // B
                // Alpha determines grain intensity: sparse and subtle
                data[i + 3] = (Math.random() < 0.35) ? ((Math.random() * 80 + 10) | 0) : 0;
            }
            tileCtx.putImageData(imageData, 0, 0);
        }

        let frame = 0;
        const GRAIN_SPEED = 2; // Refresh every N frames for a filmic "flicker"

        function drawGrain() {
            animId = requestAnimationFrame(drawGrain);
            frame++;
            if (frame % GRAIN_SPEED !== 0) return;

            generateGrainTile();

            // Tile the small canvas across the full screen with a random offset for movement
            const offX = (Math.random() * TILE) | 0;
            const offY = (Math.random() * TILE) | 0;
            const pattern = ctx.createPattern(tileCanvas, 'repeat');
            
            ctx.clearRect(0, 0, W, H);
            ctx.save();
            ctx.translate(-offX, -offY);
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, W + TILE, H + TILE);
            ctx.restore();
        }

        drawGrain();

        // Pause grain when tab is hidden (battery/performance saver)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                drawGrain();
            }
        });
    });

    // ==========================================
    // 4. SCROLL PROGRESS BAR
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress-bar';
        Object.assign(bar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            height: '3px',
            width: '0%',
            background: 'linear-gradient(90deg, #2563eb, #60a5fa, #a78bfa)',
            zIndex: '999997',
            pointerEvents: 'none',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)',
        });
        document.documentElement.appendChild(bar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = pct + '%';
        }, { passive: true });
    });

    // ==========================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        // Inject the CSS for reveal animations
        const css = `
            .so-reveal {
                opacity: 0;
                transform: translateY(32px);
                transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .so-reveal.so-visible {
                opacity: 1;
                transform: translateY(0);
            }
            .so-reveal-left {
                opacity: 0;
                transform: translateX(-40px);
                transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .so-reveal-left.so-visible {
                opacity: 1;
                transform: translateX(0);
            }
            .so-reveal-right {
                opacity: 0;
                transform: translateX(40px);
                transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .so-reveal-right.so-visible {
                opacity: 1;
                transform: translateX(0);
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Selectors to animate on scroll
        const revealSelectors = [
            { sel: '.home-card',        cls: 'so-reveal',       delay: true },
            { sel: '.stat-card',        cls: 'so-reveal',       delay: true },
            { sel: '.stats-section',    cls: 'so-reveal',       delay: false },
            { sel: '.planner-section',  cls: 'so-reveal',       delay: false },
            { sel: '.cta-block',        cls: 'so-reveal',       delay: false },
            { sel: '.feature-text',     cls: 'so-reveal-right', delay: false },
            { sel: '.feature-img-wrapper', cls: 'so-reveal-left', delay: false },
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('so-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealSelectors.forEach(({ sel, cls, delay }) => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.classList.add(cls);
                if (delay) el.style.transitionDelay = (i * 0.1) + 's';
                observer.observe(el);
            });
        });
    });

    // ==========================================
    // 6. STAGGERED TEXT REVEAL (Headings)
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const headingCss = `
            .so-word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
            .so-word {
                display: inline-block;
                opacity: 0;
                transform: translateY(110%);
                transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .so-word.so-word-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        const hStyle = document.createElement('style');
        hStyle.textContent = headingCss;
        document.head.appendChild(hStyle);

        // Target h1 and h2 headings that are NOT already split by the page's own JS
        const headings = document.querySelectorAll(
            'h1:not(.hero-title-animated), h2:not(.hero-title-animated)'
        );

        const wordObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.so-word').forEach((w, i) => {
                        setTimeout(() => w.classList.add('so-word-visible'), i * 80);
                    });
                    wordObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        headings.forEach(h => {
            // Skip empty or JS-filled headings
            if (!h.textContent.trim() || h.closest('[id$="-list"]') || h.closest('#stats-row')) return;
            // Skip headings that contain ids filled dynamically
            if (h.querySelector('#display-name, #display-dept')) return;

            // Walk only TEXT nodes — never touch HTML tags
            const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null);
            const textNodes = [];
            let node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue.trim()) textNodes.push(node);
            }

            textNodes.forEach(textNode => {
                const words = textNode.nodeValue.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach(part => {
                    if (/^\s+$/.test(part)) {
                        // Preserve whitespace as-is
                        frag.appendChild(document.createTextNode(part));
                    } else if (part) {
                        const wrap = document.createElement('span');
                        wrap.className = 'so-word-wrap';
                        const inner = document.createElement('span');
                        inner.className = 'so-word';
                        inner.textContent = part;
                        wrap.appendChild(inner);
                        frag.appendChild(wrap);
                    }
                });
                textNode.parentNode.replaceChild(frag, textNode);
            });

            wordObserver.observe(h);
        });
    });

    // ==========================================
    // 7. ELEGANT TOOLTIPS (data-tooltip attr)
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const tooltipCSS = `
            #so-tooltip {
                position: fixed;
                z-index: 999996;
                pointer-events: none;
                background: rgba(15, 23, 42, 0.92);
                color: #e2e8f0;
                font-size: 0.72rem;
                font-weight: 600;
                letter-spacing: 0.04em;
                padding: 5px 10px;
                border-radius: 8px;
                white-space: nowrap;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255,255,255,0.08);
                opacity: 0;
                transform: translateY(4px) scale(0.95);
                transition: opacity 0.18s ease, transform 0.18s ease;
            }
            #so-tooltip.so-tooltip-show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        `;
        const tStyle = document.createElement('style');
        tStyle.textContent = tooltipCSS;
        document.head.appendChild(tStyle);

        const tip = document.createElement('div');
        tip.id = 'so-tooltip';
        document.body.appendChild(tip);

        // Add tooltips to nav buttons
        const tooltipMap = {
            'snav-dark-btn':  'Toggle Dark Mode',
            'snav-notif-btn': 'Notifications',
        };

        // Wait for nav to be injected
        setTimeout(() => {
            Object.entries(tooltipMap).forEach(([id, label]) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.setAttribute('data-tooltip', label);
            });

            // Also auto-add tooltips from data-tooltip on any element
            document.addEventListener('mouseover', (e) => {
                const target = e.target.closest('[data-tooltip]');
                if (!target) return;
                const text = target.getAttribute('data-tooltip');
                if (!text) return;

                tip.textContent = text;
                tip.classList.add('so-tooltip-show');

                const rect = target.getBoundingClientRect();
                const tipW = tip.offsetWidth;
                let left = rect.left + rect.width / 2 - tipW / 2;
                left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
                tip.style.left = left + 'px';
                tip.style.top  = (rect.bottom + 8) + 'px';
            });

            document.addEventListener('mouseout', (e) => {
                if (!e.target.closest('[data-tooltip]')) return;
                tip.classList.remove('so-tooltip-show');
            });
        }, 600);
    });

    // ==========================================
    // 8. DARK MODE RIPPLE TRANSITION
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const rippleCSS = `
            #so-dm-ripple {
                position: fixed;
                border-radius: 50%;
                pointer-events: none;
                z-index: 999995;
                transform: scale(0);
                opacity: 0.15;
                transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                            opacity 0.7s ease;
            }
            #so-dm-ripple.expanding {
                transform: scale(1);
                opacity: 0;
            }
        `;
        const rStyle = document.createElement('style');
        rStyle.textContent = rippleCSS;
        document.head.appendChild(rStyle);

        const ripple = document.createElement('div');
        ripple.id = 'so-dm-ripple';
        document.body.appendChild(ripple);

        // Hook into dark mode toggle button
        setTimeout(() => {
            const darkBtn = document.getElementById('snav-dark-btn');
            if (!darkBtn) return;

            darkBtn.addEventListener('click', (e) => {
                // Read BEFORE toggle happens (shared-nav toggles on its own listener)
                const goingDark = !document.documentElement.classList.contains('dark-mode');
                const x = e.clientX;
                const y = e.clientY;
                const size = Math.hypot(window.innerWidth, window.innerHeight) * 2.4;

                // Reset: remove old class & inline styles first
                ripple.classList.remove('expanding');
                ripple.removeAttribute('style');

                ripple.style.background = goingDark
                    ? 'radial-gradient(circle, #0a0a0a 0%, transparent 65%)'
                    : 'radial-gradient(circle, #f0f4ff 0%, transparent 65%)';
                ripple.style.width  = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left   = (x - size / 2) + 'px';
                ripple.style.top    = (y - size / 2) + 'px';

                // Force reflow so the transition triggers from scale(0)
                void ripple.getBoundingClientRect();

                // Now add the class — CSS takes over (no inline opacity conflict)
                ripple.classList.add('expanding');

                setTimeout(() => ripple.classList.remove('expanding'), 800);
            });
        }, 600);
    });

    // ==========================================
    // 9. TOAST NOTIFICATION SYSTEM
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
        const toastCSS = `
            #so-toast-container {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 999994;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                pointer-events: none;
            }
            .so-toast {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                border-radius: 999px;
                font-size: 0.82rem;
                font-weight: 600;
                color: #fff;
                backdrop-filter: blur(16px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.15);
                white-space: nowrap;
                pointer-events: auto;
                opacity: 0;
                transform: translateY(16px) scale(0.95);
                transition: opacity 0.35s cubic-bezier(0.22,1,0.36,1),
                            transform 0.35s cubic-bezier(0.22,1,0.36,1);
            }
            .so-toast.so-toast-show {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            .so-toast.so-toast-hide {
                opacity: 0;
                transform: translateY(8px) scale(0.97);
            }
            .so-toast-success { background: rgba(5, 150, 105, 0.92); }
            .so-toast-info    { background: rgba(37, 99, 235, 0.92); }
            .so-toast-warning { background: rgba(217, 119, 6, 0.92); }
            .so-toast-error   { background: rgba(220, 38, 38, 0.92); }
        `;
        const tsStyle = document.createElement('style');
        tsStyle.textContent = toastCSS;
        document.head.appendChild(tsStyle);

        const container = document.createElement('div');
        container.id = 'so-toast-container';
        document.body.appendChild(container);

        const ICONS = {
            success: '✅',
            info:    'ℹ️',
            warning: '⚠️',
            error:   '❌',
        };

        // Global function — call from anywhere: window.showToast('message', 'success')
        window.showToast = function(message, type = 'success', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `so-toast so-toast-${type}`;
            toast.innerHTML = `<span>${ICONS[type] || '✅'}</span><span>${message}</span>`;
            container.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => toast.classList.add('so-toast-show'));
            });

            // Auto-dismiss
            setTimeout(() => {
                toast.classList.add('so-toast-hide');
                toast.classList.remove('so-toast-show');
                setTimeout(() => toast.remove(), 400);
            }, duration);
        };

        // Auto-hook: favorites buttons
        // Read isFav AFTER 50ms so the toggle has already flipped the class
        document.addEventListener('click', (e) => {
            const favBtn = e.target.closest('.fav-btn');
            if (!favBtn) return;
            setTimeout(() => {
                // After toggle: if button now has 'active' it means it WAS added
                const nowFaved = favBtn.classList.contains('active')
                              || favBtn.querySelector('svg')?.style.fill === 'currentColor'
                              || favBtn.dataset.faved === '1';
                window.showToast(
                    nowFaved ? 'Added to Favorites ⭐' : 'Removed from Favorites',
                    nowFaved ? 'success' : 'warning'
                );
            }, 150);
        });

        // Auto-hook: planner form
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'planner-form') {
                const input = document.getElementById('planner-input');
                if (input && input.value.trim()) {
                    setTimeout(() => window.showToast('Task added to your planner 📋', 'info'), 100);
                }
            }
        });

        // Auto-hook: profile save buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const txt = btn.textContent.trim().toLowerCase();
            if ((txt.includes('save') || txt.includes('update')) && !btn.closest('.fav-btn')) {
                setTimeout(() => window.showToast('Changes saved successfully ✨', 'success'), 200);
            }
        });
    }); // end DOMContentLoaded

})();

