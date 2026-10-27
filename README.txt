WARZONE ARENA — FIXED PWA PACKAGE

Files:
- index.html: updated game
- manifest.json: corrected PWA manifest
- sw.js: service worker used for same-origin shell caching
- icon-192.png / icon-512.png: install icons

IMPORTANT:
1. Keep the original `sounds` folder beside index.html, containing:
   sounds/victory.mp3
   sounds/defeat.mp3
   sounds/booyah.mp3
2. Upload all files to the same website directory.
3. Open through HTTPS (or localhost while testing), not by opening index.html as a file.
4. After upload, clear the site's old cache / unregister the old service worker once if the previous version is still loading.
