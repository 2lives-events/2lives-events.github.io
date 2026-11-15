/* 2 Lives Tournois : la page reste disponible sans réseau (dernière version téléchargée).
   Page : réseau d'abord, copie gardée en secours. Polices : copie d'abord. */
var CACHE = '2lt-b31250a102';
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./', 'manifest.webmanifest', 'icon-192.png']).catch(function () {}); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  if (u.origin === location.origin) {
    e.respondWith(fetch(r).then(function (res) { if (res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r.mode === 'navigate' ? './' : r, cp); }); } return res; })
      .catch(function () { return caches.match(r.mode === 'navigate' ? './' : r).then(function (m) { return m || caches.match('./'); }); }));
    return;
  }
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.match(r).then(function (m) { return m || fetch(r).then(function (res) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); return res; }); }));
  }
});
