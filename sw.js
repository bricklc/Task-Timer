// Service Worker for Task Timer App
const VERSION = '1.0.1';
const CACHE_NAME = 'task-timer-cache-v' + VERSION;
const OFFLINE_PAGE = 'offline.html';

// Use relative paths to work in any subdirectory
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './sounds/win.mp3',
  './offline.html',
  './manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log(`Task Timer Service Worker v${VERSION} installing...`);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`Cache opened: ${CACHE_NAME}`);
        return cache.addAll(urlsToCache).then(() => {
          console.log('All resources cached successfully');
          return self.skipWaiting(); // Activate immediately
        }).catch(error => {
          console.error('Failed to cache all resources:', error);
          // Continue even if some resources fail to cache
          return self.skipWaiting();
        });
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip non-HTTP/HTTPS requests (like chrome-extension:// URLs)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response, but handle potential errors
            caches.open(CACHE_NAME)
              .then(cache => {
                try {
                  cache.put(event.request, responseToCache);
                } catch (error) {
                  console.warn('Failed to cache response for:', event.request.url, error);
                }
              });

            return response;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
          // Return the offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_PAGE);
          }
        });
      })
  );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  // Clean up old caches
  const cacheCleanup = caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });

  // Ensure the service worker takes control immediately
  event.waitUntil(
    Promise.all([
      cacheCleanup,
      self.clients.claim() // Take control of all clients
    ])
  );
});
