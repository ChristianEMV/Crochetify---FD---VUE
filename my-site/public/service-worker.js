const CACHE_NAME = 'pwa-cache-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/service-worker.js',
    '/pouchdb.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.0.0/pouchdb.min.js',
    '/images/fallback.png' ,// Imagen de fallback si es necesario
    'http://54.146.53.211:8007/categories'
];


// Instalar el Service Worker y guardar los recursos en caché
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Cacheando recursos...');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activar el Service Worker y limpiar caches antiguos
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => {
                        console.log('[Service Worker] Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    })
            )
        )
    );
});

// Manejar solicitudes de red y caché
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetch:', event.request.url);

    if (event.request.method === 'POST') {
        // Manejar solicitudes POST
        event.respondWith(
            fetch(event.request.clone())
                .catch(() => storeFailedRequest(event.request))
        );
    } else {
        // Manejar solicitudes GET
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse.ok) {
                            return caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                                console.log('[Service Worker] Recurso cacheado:', event.request.url);
                                return networkResponse;
                            });
                        }
                        throw new Error('Respuesta de red no válida');
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }

                        if (event.request.destination === 'image') {
                            return caches.match('/images/fallback.png');
                        }

                        return new Response('Contenido no disponible offline.', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({ 'Content-Type': 'text/plain' }),
                        });
                    });
            })
        );
    }
});

// Guardar solicitudes POST fallidas en IndexedDB
async function storeFailedRequest(request) {
    const requestClone = request.clone();
    const body = await requestClone.json();

    const db = await openDB('offline-requests', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('requests')) {
                db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
            }
        },
    });

    await db.put('requests', { url: request.url, body, method: 'POST' });

    return new Response(
        JSON.stringify({ message: 'Guardado localmente. Se sincronizará al estar online.' }),
        {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
        }
    );
}

// Sincronizar solicitudes POST fallidas cuando el dispositivo esté online
self.addEventListener('sync', async (event) => {
    if (event.tag === 'sync-post-requests') {
        const db = await openDB('offline-requests', 1);
        const requests = await db.getAll('requests');

        for (const req of requests) {
            try {
                const response = await fetch(req.url, {
                    method: req.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req.body),
                });

                if (response.ok) {
                    console.log('Solicitud sincronizada:', req);
                    await db.delete('requests', req.id);
                }
            } catch (error) {
                console.error('Error al sincronizar:', error);
            }
        }
    }
});

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Notificación push recibida.');
    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación',
        icon: '/images/image.png',
        badge: '/images/image.png',
    };
    event.waitUntil(self.registration.showNotification('Notificación Push', options));
});
