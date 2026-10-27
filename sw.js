const CACHE_NAME = "warzone-arena-v1";
const BASE_URL = new URL("./", self.location.href);
const SHELL = [
  new URL("./", self.location.href).href,
  new URL("./index.html", self.location.href).href,
  new URL("./manifest.json", self.location.href).href,
  new URL("./icon-192.png", self.location.href).href,
  new URL("./icon-512.png", self.location.href).href
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(new URL("./index.html", self.location.href).href))));
});
