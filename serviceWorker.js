/**
 * Une variable pour enregistrer le nom du cache est créée, les fichiers de l'app shell sont listés dans un tableau.
 */
const staticCacheName = "cache-v2";
const assets = [
    "./",
    "index.html",
]

/**
 * Une fois que l'enregistrement a été réalisé, le fichier sw.js est automatiquement téléchargé, puis installé, et finalement activé.
 * L'API nous permet d'ajouter des intercepteurs d'événements ou event listeners pour les événements clef qui nous intéressent — le premier est l'événement install
 * Dans le listener install, nous pouvons initialiser le cache et y ajouter des fichiers pour une utilisation hors connexion. Notre app cache-v2 ci-dessus fait exactement ça
 */
self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(staticCacheName).then((cache)=>{
            cache.addAll(assets);
        })
    )
});

/**
 * Il permet d'intercepter des requêtes et d'y répondre de façon personnalisée. Voic un exemple d'utilisation simpliste
 * La réponse peut être ce que nous voulons: le fichier demandé, sa copie mise en cache ou un bout de code JavaScript qui fera quelque chose de particulier — les possibilités sont infinies
 */
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
                                cache.put(event.request, responseToCache).then(res => console.log(res));
                            });

                        return response;
                    }
                );
            })
    );
});

/**
 * Il permet de vider l'ancien cache dont nous n'avons désormais plus besoin
 */
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});