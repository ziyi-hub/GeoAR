//mise en cache
const staticCacheName = "cache-v2";
const assets = [
    "./",
    "index.html",
]

//ajout fichiers en cache
self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(staticCacheName).then((cache)=>{
            cache.addAll(assets);
        })
    )
});

self.addEventListener('fetch', (event)=>{
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Cloner la requête.
                // Une requete est un flux et est à consommation unique
                // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
                let fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
                        let responseToCache = response.clone();

                        caches.open(staticCacheName)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
/*
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil((async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());
    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

 */