const CACHE_NAME = "warzone-arena-v3"; // v2 -> v3: purana cache apne aap delete ho jayega
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
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("warzone-arena-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page / index.html: pehle network se latest lo (taaki game ke updates turant dikhein),
  // internet na ho to cache se kholo.
  const isPage = request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  if (isPage) {
    event.respondWith(
      fetch(request, { cache: "no-cache" }).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request).then(cached => cached || caches.match(new URL("./index.html", self.location.href).href)))
    );
    return;
  }

  // Baaki files (models, sounds, images): pehle cache, nahi mile to network (badi files baar-baar download nahi hongi).
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => request.mode === "navigate" ? caches.match(new URL("./index.html", self.location.href).href) : Response.error())));
});
