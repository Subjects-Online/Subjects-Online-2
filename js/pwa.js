// =============================================
// Subjects Online — PWA Registration
// =============================================

(function () {
  'use strict';

  // ========================
  // 1. Register Service Worker
  // ========================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);

          // تحديث تلقائي لو في نسخة جديدة
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                showUpdateToast();
              }
            });
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // ========================
  // 2. Install Prompt (A2HS)
  // ========================
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt captured');

    // اعرض زرار التثبيت لو مش مثبّت
    if (!isAppInstalled()) {
      setTimeout(() => showInstallBanner(), 3000);
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully!');
    deferredPrompt = null;
    hideInstallBanner();
    localStorage.setItem('pwa-installed', 'true');
  });

  function isAppInstalled() {
    return (
      localStorage.getItem('pwa-installed') === 'true' ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  // ========================
  // 3. Install Banner UI
  // ========================
  function showInstallBanner() {
    if (isAppInstalled()) return;
    if (document.getElementById('pwa-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div id="pwa-banner-inner">
        <img src="/images/icon-192.png" alt="Subjects Online" id="pwa-banner-icon">
        <div id="pwa-banner-text">
          <strong>Subjects Online</strong>
          <span>ثبّت التطبيق على شاشتك الرئيسية!</span>
        </div>
        <button id="pwa-install-btn">تثبيت</button>
        <button id="pwa-dismiss-btn">✕</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #pwa-install-banner {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(120px);
        z-index: 99999;
        width: calc(100% - 32px);
        max-width: 480px;
        background: linear-gradient(135deg, #0d1b3e 0%, #1a2f6e 100%);
        border: 1px solid rgba(201, 168, 76, 0.4);
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.1);
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        backdrop-filter: blur(20px);
      }
      #pwa-install-banner.show {
        transform: translateX(-50%) translateY(0);
      }
      #pwa-banner-inner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
      }
      #pwa-banner-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        flex-shrink: 0;
        object-fit: cover;
      }
      #pwa-banner-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      #pwa-banner-text strong {
        color: #ffffff;
        font-size: 14px;
        font-weight: 700;
        font-family: system-ui, sans-serif;
      }
      #pwa-banner-text span {
        color: rgba(255,255,255,0.7);
        font-size: 12px;
        font-family: system-ui, sans-serif;
      }
      #pwa-install-btn {
        background: linear-gradient(135deg, #c9a84c, #f0d080);
        color: #0d1b3e;
        border: none;
        padding: 8px 16px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        font-family: system-ui, sans-serif;
        white-space: nowrap;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #pwa-install-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(201, 168, 76, 0.4);
      }
      #pwa-dismiss-btn {
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.5);
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        flex-shrink: 0;
        transition: color 0.2s;
      }
      #pwa-dismiss-btn:hover {
        color: rgba(255,255,255,0.9);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Show with animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.classList.add('show');
      });
    });

    // Buttons
    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      deferredPrompt = null;
      hideInstallBanner();
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      hideInstallBanner();
      localStorage.setItem('pwa-dismissed', Date.now().toString());
    });
  }

  function hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);
    }
  }

  // ========================
  // 4. Update Toast
  // ========================
  function showUpdateToast() {
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.innerHTML = `
      <span>🔄 يوجد تحديث جديد!</span>
      <button onclick="window.location.reload()">تحديث الآن</button>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #pwa-update-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: #0d1b3e;
        border: 1px solid #c9a84c;
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        animation: slideDown 0.4s ease;
      }
      #pwa-update-toast button {
        background: #c9a84c;
        color: #0d1b3e;
        border: none;
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        font-size: 13px;
      }
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-60px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);
  }

  // ========================
  // 5. Standalone Mode Detection
  // ========================
  if (isAppInstalled()) {
    document.documentElement.classList.add('pwa-standalone');
  }

})();
