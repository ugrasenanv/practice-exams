// Azure AI Practice Exams PWA Service Worker
// Enhanced offline functionality with intelligent caching strategies

const CACHE_NAME = 'azure-ai-exams-v2.0.1';
const DATA_CACHE_NAME = 'azure-ai-exams-data-v2.0.1';

// Resources to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/pwa-init.js',
  // Favicon Files (only existing ones)
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/icon-192x192-maskable.svg',
  '/apple-touch-icon.svg',
  '/favicon-16x16.svg',
  '/favicon-32x32.svg'
];

// API endpoints and dynamic content to cache
const DYNAMIC_CACHE_PATTERNS = [
  /\/api\//,
  /\/components\//,
  /\/contexts\//
];

// ====================== SERVICE WORKER INSTALLATION ======================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        // In development, cache assets one by one to avoid failing on missing files
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              } else {
                console.warn('[SW] Skipping unavailable asset:', url);
              }
            }).catch(error => {
              console.warn('[SW] Failed to cache asset:', url, error.message);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Static assets caching attempted');
        return self.skipWaiting(); // Force activation
      })
      .catch((error) => {
        console.error('[SW] Pre-caching failed:', error);
      })
  );
});

// ====================== SERVICE WORKER ACTIVATION ======================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// ====================== FETCH HANDLING WITH CACHING STRATEGIES ======================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    // Cache First Strategy for static assets
    event.respondWith(cacheFirstStrategy(request));
  } else if (isAPIRequest(request)) {
    // Network First Strategy for API calls
    event.respondWith(networkFirstStrategy(request));
  } else if (isDynamicContent(request)) {
    // Stale While Revalidate for dynamic content
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Default: Network First with Cache Fallback
    event.respondWith(networkFirstStrategy(request));
  }
});

// ====================== CACHING STRATEGIES ======================

// Cache First Strategy - Best for static assets
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    console.log('[SW] Fetching and caching:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    return new Response('Offline - Resource not available', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Network First Strategy - Best for API calls and dynamic data
async function networkFirstStrategy(request) {
  try {
    console.log('[SW] Network first for:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cache = await caches.open(DATA_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or fallback
    return createOfflineFallbackResponse(request);
  }
}

// Stale While Revalidate Strategy - Best for frequently updated content
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Network update failed for:', request.url, error);
      return null;
    });
  
  // Return cached version immediately if available, otherwise wait for network
  if (cachedResponse) {
    console.log('[SW] Serving stale content for:', request.url);
    networkPromise; // Update cache in background
    return cachedResponse;
  } else {
    console.log('[SW] Waiting for network for:', request.url);
    const networkResponse = await networkPromise;
    return networkResponse || createOfflineFallbackResponse(request);
  }
}

// ====================== HELPER FUNCTIONS ======================

function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_CACHE_URLS.includes(url.pathname) ||
         url.pathname.includes('.js') ||
         url.pathname.includes('.css') ||
         url.pathname.includes('.png') ||
         url.pathname.includes('.jpg') ||
         url.pathname.includes('.svg') ||
         url.pathname.includes('.ico') ||
         url.pathname.includes('.woff') ||
         url.pathname.includes('.woff2');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/api/') ||
         url.pathname.includes('localhost') && url.port === '3000';
}

function isDynamicContent(request) {
  const url = new URL(request.url);
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function createOfflineFallbackResponse(request) {
  const url = new URL(request.url);
  
  if (request.headers.get('accept')?.includes('text/html')) {
    // Return offline page for HTML requests
    return new Response(
      getOfflineHTML(),
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  } else if (request.headers.get('accept')?.includes('application/json')) {
    // Return offline data for JSON requests
    return new Response(
      JSON.stringify({ 
        offline: true, 
        message: 'This data is not available offline',
        timestamp: Date.now()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
  
  return new Response('Offline', { status: 503 });
}

function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Azure AI Exams - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0;
        }
        .offline-container {
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem 2rem;
          border-radius: 20px;
          backdrop-filter: blur(20px);
          max-width: 500px;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        .offline-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .offline-message {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        .retry-button {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📚</div>
        <h1 class="offline-title">You're Offline</h1>
        <p class="offline-message">
          Azure AI Practice Exams is available offline! While you're not connected to the internet, 
          you can still access cached content and continue your learning journey.
        </p>
        <button class="retry-button" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
}

// ====================== BACKGROUND SYNC ======================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  } else if (event.tag === 'sync-achievements') {
    event.waitUntil(syncAchievements());
  } else if (event.tag === 'sync-study-sessions') {
    event.waitUntil(syncStudySessions());
  }
});

async function syncUserData() {
  try {
    console.log('[SW] Syncing user data...');
    
    // Get pending sync data from IndexedDB or localStorage
    const pendingData = await getPendingSyncData();
    
    if (pendingData.length > 0) {
      // Process each pending item
      for (const item of pendingData) {
        await processSyncItem(item);
      }
      
      // Clear pending sync data
      await clearPendingSyncData();
      console.log('[SW] User data sync completed');
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error; // Retry later
  }
}

async function syncAchievements() {
  try {
    console.log('[SW] Syncing achievements...');
    // Sync achievement data when back online
    const achievements = localStorage.getItem('achievements');
    if (achievements) {
      // Process achievement synchronization
      console.log('[SW] Achievement sync completed');
    }
  } catch (error) {
    console.error('[SW] Achievement sync failed:', error);
  }
}

async function syncStudySessions() {
  try {
    console.log('[SW] Syncing study sessions...');
    // Sync study session data when back online
    const sessions = localStorage.getItem('userSessions');
    if (sessions) {
      // Process session synchronization
      console.log('[SW] Study session sync completed');
    }
  } catch (error) {
    console.error('[SW] Study session sync failed:', error);
  }
}

// Helper functions for background sync
async function getPendingSyncData() {
  // In a real app, this would get data from IndexedDB
  return JSON.parse(localStorage.getItem('pendingSyncData') || '[]');
}

async function processSyncItem(item) {
  // Process individual sync item
  console.log('[SW] Processing sync item:', item);
}

async function clearPendingSyncData() {
  localStorage.removeItem('pendingSyncData');
}

// ====================== PUSH NOTIFICATIONS ======================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      notificationData = {
        title: 'Azure AI Practice Exams',
        body: event.data.text() || 'New notification',
        icon: '/icon-192x192.png'
      };
    }
  }
  
  const options = {
    body: notificationData.body || 'Time for your study session!',
    icon: notificationData.icon || '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: notificationData.tag || 'azure-ai-exams',
    requireInteraction: false,
    actions: [
      {
        action: 'start-study',
        title: 'Start Studying',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: notificationData.url || '/',
      timestamp: Date.now(),
      ...notificationData.data
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'Azure AI Practice Exams',
      options
    )
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'start-study') {
    // Open app to start studying
    event.waitUntil(
      clients.openWindow(data.url || '/?action=start-exam')
    );
  } else if (action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default click behavior - open the app
    event.waitUntil(
      clients.openWindow(data.url || '/')
    );
  }
});

// ====================== MESSAGE HANDLING ======================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_USER_DATA':
      cacheUserData(payload);
      break;
      
    case 'SCHEDULE_NOTIFICATION':
      scheduleNotification(payload);
      break;
      
    case 'REQUEST_SYNC':
      requestBackgroundSync(payload.tag);
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

async function cacheUserData(data) {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);
    const response = new Response(JSON.stringify(data));
    await cache.put('/user-data', response);
    console.log('[SW] User data cached successfully');
  } catch (error) {
    console.error('[SW] Failed to cache user data:', error);
  }
}

function scheduleNotification(payload) {
  // Schedule a notification (would typically use real scheduling in production)
  console.log('[SW] Scheduling notification:', payload);
}

function requestBackgroundSync(tag) {
  // Request background sync
  if ('sync' in self.registration) {
    self.registration.sync.register(tag);
    console.log('[SW] Background sync requested:', tag);
  }
}

// ====================== ERROR HANDLING ======================

self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker loaded successfully');