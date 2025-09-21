const CACHE_NAME = 'mira-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/ar.html',
    '/style.css',
    '/ar-data.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js',
    'https://kit.fontawesome.com/a076d05399.js',
    'https://aframe.io/releases/1.5.0/aframe.min.js',
    'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
    'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
        .catch(err => {
            console.error('Failed to cache files:', err);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
