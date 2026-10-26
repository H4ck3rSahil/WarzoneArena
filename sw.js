self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('warzone-arena').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
