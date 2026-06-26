// PWA Update Handling
function showUpdateBanner(registration) {
  const banner = document.createElement('div');
  banner.id = 'pwa-update-banner';
  banner.innerHTML = `
    <p>A new version is available. Refresh to update.</p>
    <button id="pwa-reload-button">Reload</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwa-reload-button').addEventListener('click', () => {
    const worker = registration.waiting;
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' });
      worker.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  });
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use relative path for GitHub Pages compatibility
    const swPath = './sw.js';
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('SW registered: ', registration);
        console.log('SW scope: ', registration.scope);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available and will be used when all tabs for this page are closed. Showing update prompt.');
                showUpdateBanner(registration);
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
        console.error('Error details:', registrationError);
      });
  });
}

// PWA Install Prompt Handler
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Check if PWA prompts are disabled
  const pwaPromptsDisabled = localStorage.getItem('personal-practice-exams-disable-pwa-prompt') === 'true';
  if (pwaPromptsDisabled) {
    console.log('PWA install prompts are disabled');
    return;
  }
  
  // Only show install prompt if user hasn't dismissed it before and has used the app
  const hasUsedApp = localStorage.getItem('personal-practice-exams-sessions-count');
  const hasDismissedInstall = localStorage.getItem('personal-practice-exams-dismissed-install');
  const dismissTime = localStorage.getItem('personal-practice-exams-dismiss-time');
  
  // Don't show again for 7 days after dismissal
  if (hasDismissedInstall && dismissTime) {
    const daysSinceDismiss = (Date.now() - parseInt(dismissTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismiss < 7) {
      return;
    }
  }
  
  // Only show after user has taken at least 3 exams to ensure engagement
  if (!hasDismissedInstall && hasUsedApp && parseInt(hasUsedApp) >= 3) {
    // Delay showing the prompt to avoid interrupting user flow
    setTimeout(() => {
      // Don't show if user is in the middle of an exam
      const isInExam = window.location.pathname.includes('quiz') || 
                       document.querySelector('[class*="exam"]') ||
                       document.querySelector('[class*="question"]');
      
      if (isInExam) {
        return;
      }
      
      const installBanner = document.createElement('div');
      installBanner.id = 'pwa-install-banner';
      installBanner.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 15px; border-radius: 12px; z-index: 999; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.2); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; backdrop-filter: blur(10px); animation: slideUp 0.3s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 18px;">📱</span>
            <button id="close-btn" style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
          </div>
          <p style="margin: 0 0 6px; font-weight: 600; font-size: 13px;">Install SAFe Practice Exams</p>
          <p style="margin: 0 0 12px; font-size: 11px; opacity: 0.85; line-height: 1.3;">Quick access, offline practice, and better performance</p>
          <div style="display: flex; gap: 8px; justify-content: center;">
            <button id="install-btn" style="background: white; color: #667eea; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; flex: 1; max-width: 80px;">Install</button>
            <button id="dismiss-btn" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; flex: 1; max-width: 80px;">Later</button>
          </div>
        </div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      
      document.head.appendChild(style);
      
      document.getElementById('install-btn').addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          deferredPrompt = null;
          if (document.getElementById('pwa-install-banner')) {
            document.body.removeChild(installBanner);
          }
        });
      });
      
      const dismissHandler = () => {
        localStorage.setItem('personal-practice-exams-dismissed-install', 'true');
        localStorage.setItem('personal-practice-exams-dismiss-time', Date.now().toString());
        if (document.getElementById('pwa-install-banner')) {
          document.body.removeChild(installBanner);
        }
      };
      
      document.getElementById('dismiss-btn').addEventListener('click', dismissHandler);
      document.getElementById('close-btn').addEventListener('click', dismissHandler);
      
      // Auto-dismiss after 15 seconds if no interaction
      setTimeout(() => {
        if (document.getElementById('pwa-install-banner')) {
          document.body.removeChild(installBanner);
        }
      }, 15000);
    }, 8000); // Wait 8 seconds before showing to let user settle
  }
});

// PWA Status Detection
window.addEventListener('load', () => {
  // Detect if running as PWA
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Running as PWA');
    document.body.classList.add('pwa-mode');
  }
  
  // Detect iOS Safari PWA
  if (window.navigator.standalone === true) {
    console.log('Running as iOS PWA');
    document.body.classList.add('ios-pwa-mode');
  }
});
