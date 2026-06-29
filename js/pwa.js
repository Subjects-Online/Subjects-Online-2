// =============================================
// Subjects Online — PWA Registration
// =============================================

(function () {
  'use strict';

  // ========================
  // 0. PWA Smart Startup Redirect
  // ========================
  (function pwaStartupRedirect() {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (!isStandalone) return;

    const uid   = localStorage.getItem('subjectsOnlineUID');
    const page  = window.location.pathname.split('/').pop() || 'index.html';

    const protectedPages = [
      'dashboard.html','browse.html','profile.html','favorites.html',
      'player.html','quizzes.html','chapters.html','sections.html',
      'subject.html','essays.html'
    ];

    if (uid) {
      if (['login.html','index.html','welcome.html',''].includes(page)) {
        window.location.replace('dashboard.html');
      }
    } else {
      if (protectedPages.includes(page)) {
        window.location.replace('login.html');
      }
    }
  })();

  // ========================
  // 1. Detect base path (fixes GitHub Pages subdirectory)
  // ========================
  function getBasePath() {
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      if (s.src.includes('pwa.js')) {
        // e.g. https://user.github.io/repo-name/js/pwa.js → /repo-name/
        const url = new URL(s.src);
        const parts = url.pathname.split('/');
        parts.pop(); // remove pwa.js
        parts.pop(); // remove js/
        return parts.join('/') + '/';
      }
    }
    return '/';
  }

  // ========================
  // 2. Register Service Worker
  // ========================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const base = getBasePath();
      const swUrl = base + 'sw.js';
      navigator.serviceWorker
        .register(swUrl, { scope: base })
        .then((reg) => {
          console.log('[PWA] SW registered. Scope:', reg.scope);
          reg.addEventListener('updatefound', () => {
            const nw = reg.installing;
            nw.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateToast();
              }
            });
          });
        })
        .catch((err) => console.warn('[PWA] SW registration failed:', err));
    });
  }

  // ========================
  // 3. Install Prompt capture
  // ========================
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!isInstalled()) {
      setTimeout(showBubbleBtn, 1500);
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    removeBubbleBtn();
    localStorage.setItem('pwa-installed', 'true');
  });

  function isInstalled() {
    return (
      localStorage.getItem('pwa-installed') === 'true' ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  // ========================
  // 4. Floating Bubble Button
  // ========================
  function showBubbleBtn() {
    if (isInstalled()) return;
    if (document.getElementById('pwa-bubble')) return;

    // ── Styles ──────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pwa-float {
        0%,100% { transform: translateY(0px) scale(1); }
        50%      { transform: translateY(-8px) scale(1.03); }
      }
      @keyframes pwa-pulse-ring {
        0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201,168,76,0.55); }
        70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(201,168,76,0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201,168,76,0); }
      }
      @keyframes pwa-pop-in {
        0%   { opacity:0; transform: scale(0.4) translateY(30px); }
        70%  { transform: scale(1.1) translateY(-4px); }
        100% { opacity:1; transform: scale(1) translateY(0); }
      }
      @keyframes pwa-pop-out {
        0%   { opacity:1; transform: scale(1); }
        100% { opacity:0; transform: scale(0.4) translateY(20px); }
      }

      #pwa-bubble {
        position: fixed;
        /* sits just below the navbar (~70px) with a nice gap */
        top: 80px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        animation: pwa-pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
        cursor: pointer;
        user-select: none;
      }
      #pwa-bubble.hiding {
        animation: pwa-pop-out 0.4s ease forwards;
      }

      /* the circle button */
      #pwa-bubble-btn {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(145deg, #0d1b3e 0%, #1a2f6e 60%, #0d1b3e 100%);
        box-shadow:
          0 8px 32px rgba(13,27,62,0.45),
          0 0 0 2px rgba(201,168,76,0.6),
          inset 0 1px 1px rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        animation:
          pwa-float 3s ease-in-out infinite,
          pwa-pulse-ring 2.5s ease-out infinite;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
        position: relative;
        overflow: visible;
      }
      #pwa-bubble-btn::after {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        background: conic-gradient(
          from 0deg,
          #c9a84c 0%,
          transparent 40%,
          #c9a84c 70%,
          transparent 100%
        );
        opacity: 0.5;
        animation: pwa-float 3s ease-in-out infinite reverse;
        z-index: -1;
        filter: blur(2px);
      }
      #pwa-bubble-btn:hover {
        transform: scale(1.12) !important;
        box-shadow:
          0 12px 40px rgba(13,27,62,0.6),
          0 0 0 3px rgba(201,168,76,0.9),
          inset 0 1px 1px rgba(255,255,255,0.2);
        animation: pwa-pulse-ring 1s ease-out infinite !important;
      }
      #pwa-bubble-btn:active {
        transform: scale(0.95) !important;
      }
      #pwa-bubble-btn svg {
        width: 26px;
        height: 26px;
        color: #f0d080;
        filter: drop-shadow(0 0 6px rgba(201,168,76,0.8));
        flex-shrink: 0;
      }

      /* tooltip label */
      #pwa-bubble-label {
        background: linear-gradient(135deg, #0d1b3e, #1a2f6e);
        color: #f0d080;
        font-size: 11px;
        font-weight: 700;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 4px 10px;
        border-radius: 20px;
        border: 1px solid rgba(201,168,76,0.4);
        white-space: nowrap;
        box-shadow: 0 4px 16px rgba(13,27,62,0.3);
        letter-spacing: 0.02em;
      }

      /* dismiss X */
      #pwa-bubble-dismiss {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        background: rgba(13,27,62,0.7);
        color: rgba(255,255,255,0.5);
        font-size: 11px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, color 0.2s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      #pwa-bubble-dismiss:hover {
        background: rgba(239,68,68,0.8);
        color: white;
      }

      /* ── Tooltip on hover ── */
      #pwa-bubble-btn::before {
        content: 'تثبيت التطبيق';
        position: absolute;
        right: calc(100% + 12px);
        top: 50%;
        transform: translateY(-50%);
        background: linear-gradient(135deg, #0d1b3e, #1a2f6e);
        color: #f0d080;
        font-size: 12px;
        font-weight: 700;
        font-family: system-ui, sans-serif;
        padding: 6px 12px;
        border-radius: 10px;
        border: 1px solid rgba(201,168,76,0.4);
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s, transform 0.25s;
        transform: translateY(-50%) translateX(8px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      #pwa-bubble-btn:hover::before {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    `;
    document.head.appendChild(style);

    // ── Markup ──────────────────────────────
    const bubble = document.createElement('div');
    bubble.id = 'pwa-bubble';
    bubble.innerHTML = `
      <button id="pwa-bubble-btn" title="تثبيت التطبيق على جهازك">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2
               M7 10l5 5 5-5
               M12 15V3"/>
        </svg>
      </button>
      <div id="pwa-bubble-label">تنزيل التطبيق</div>
      <button id="pwa-bubble-dismiss" title="إغلاق">✕</button>
    `;
    document.body.appendChild(bubble);

    // ── Events ──────────────────────────────
    document.getElementById('pwa-bubble-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      deferredPrompt = null;
      removeBubbleBtn();
    });

    document.getElementById('pwa-bubble-dismiss').addEventListener('click', () => {
      removeBubbleBtn();
    });
  }

  function removeBubbleBtn() {
    const bubble = document.getElementById('pwa-bubble');
    if (!bubble) return;
    bubble.classList.add('hiding');
    setTimeout(() => bubble.remove(), 400);
  }

  // ========================
  // 5. Update Toast
  // ========================
  function showUpdateToast() {
    if (document.getElementById('pwa-update-toast')) return;
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';

    const s = document.createElement('style');
    s.textContent = `
      @keyframes pwa-toast-in {
        from { opacity:0; transform:translateX(-50%) translateY(-20px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
      #pwa-update-toast {
        position:fixed; top:80px; left:50%;
        transform:translateX(-50%);
        z-index:99999;
        background:linear-gradient(135deg,#0d1b3e,#1a2f6e);
        border:1px solid rgba(201,168,76,0.5);
        color:white; padding:10px 18px;
        border-radius:14px;
        display:flex; align-items:center; gap:10px;
        font-family:system-ui,sans-serif; font-size:13px;
        box-shadow:0 10px 40px rgba(0,0,0,0.4);
        animation:pwa-toast-in 0.4s ease;
        white-space:nowrap;
      }
      #pwa-update-toast button {
        background:linear-gradient(135deg,#c9a84c,#f0d080);
        color:#0d1b3e; border:none;
        padding:5px 12px; border-radius:8px;
        font-weight:700; cursor:pointer; font-size:12px;
      }
    `;
    document.head.appendChild(s);
    toast.innerHTML = `<span>🔄 يوجد تحديث جديد!</span>
      <button onclick="window.location.reload()">تحديث الآن</button>
      <button onclick="this.closest('#pwa-update-toast').remove()"
        style="background:transparent!important;color:rgba(255,255,255,0.5)!important;padding:0 4px!important;">✕</button>`;
    document.body.appendChild(toast);
  }

  // ========================
  // 6. Standalone class
  // ========================
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  ) {
    document.documentElement.classList.add('pwa-standalone');
  }

})();
