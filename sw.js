const CACHE = 'otthos-life-world-main-v626';
const CACHE_PREFIX = 'otthos-life-world-main-';
const CORE = [
  './',
  './index.html?v=626',
  './style.css?v=626',
  './assets/js/save-db.js?v=626',
  './firebase-config.js?v=626',
  './assets/js/multiplayer-rtdb.js?v=626',
  './app.js?v=626',
  './manifest.webmanifest?v=626',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // CacheStorage pode ser compartilhado com outros projetos no mesmo domínio.
  // Somente caches antigos deste aplicativo são removidos.
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate';
  const isCore = isNavigation || /\.(?:js|css|html|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');

  if (isCore) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(async () => {
        return (await caches.match(event.request)) || (await caches.match('./index.html?v=626')) || (await caches.match('./'));
      })
    );
    return;
  }

  // Imagens, modelos e athos.glb entram no cache somente após o primeiro uso.
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
