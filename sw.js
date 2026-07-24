const CACHE = 'otthos-life-world-main-v629';
const CACHE_PREFIX = 'otthos-life-world-main-';
const CORE = [
  './',
  './index.html?v=629',
  './style.css?v=629',
  './assets/js/save-db.js?v=629',
  './firebase-config.js?v=629',
  './assets/js/game-account.js?v=629',
  './assets/js/multiplayer-rtdb.js?v=629',
  './app.js?v=629',
  './manifest.webmanifest?v=629',
  './assets/textures/asphalt-v628.png',
  './assets/textures/brick-v628.png',
  './assets/textures/bus-seat-v628.png',
  './assets/textures/gold-ore-v628.png',
  './assets/textures/grass-v628.png',
  './assets/textures/interior-floor-v628.png',
  './assets/textures/police-wall-v628.png',
  './assets/textures/roof-v628.png',
  './assets/textures/school-wall-v628.png',
  './assets/textures/stone-v628.png',
  './assets/textures/wood-v628.png',
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
        return (await caches.match(event.request)) || (await caches.match('./index.html?v=629')) || (await caches.match('./'));
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
