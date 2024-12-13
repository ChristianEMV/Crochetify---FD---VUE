const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
    '/',
    '/login',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/service-worker.js',
    '/pouchdb.js',
  
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.0.0/pouchdb.min.js',
    'http://localhost:5173/?'
];

self.addEventListener('fetch', (event) => {
  console.log(event.request);
  event.respondWith(
      caches.match(event.request)
          .then((cachedResponse) => {
              // Si el recurso está en caché, devolverlo
              if (cachedResponse) {
                  console.log('Recurso de caché:', cachedResponse);
                  return cachedResponse;
              }
              // Si no está en caché, hacer la solicitud de red
              return fetch(event.request).then((networkResponse) => {
                  if (!networkResponse.ok) {
                      throw new Error('Red no disponible');
                  }
                  return networkResponse;
              });
          })
          .catch((error) => {
              console.error('Error al obtener el recurso:', error);
              // Si ocurre un error con la red (cuando no hay conexión), devolver un recurso predeterminado (opcional)
              return caches.match('/offline.html');  // Si tienes una página offline personalizada
          })
  );
});


// Activar el service worker y limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.filter(cacheName => {
        return cacheName !== CACHE_NAME
      }).map(cacheName => caches.delete(cacheName))
    ))
  );
});

// Fetch event: Intentar servir los archivos desde la caché
self.addEventListener('fetch', (event) => {
  console.log(event.request);
  event.respondWith(
      caches.match(event.request)
          .then((cachedResponse) => {
              // Si el recurso está en caché, devolverlo
              if (cachedResponse) {
                  return cachedResponse;
                  console.log(cachedResponse);
              }
              // Si no está en caché, hacer la solicitud de red
              return fetch(event.request);
          })
          .catch(() => {
              // Si ocurre un error con la red (cuando no hay conexión), devolver un recurso predeterminado (opcional)
              return caches.match('/offline.html');  // Si tienes una página offline personalizada
          })
  );
});

self.addEventListener('push', (event) => {
  const options = {
      body: event.data.text(),
      icon: '/images/image.png',  // Cambia esto según tu icono de notificación
      badge: '/images/image.png' // Cambia esto según tu ícono de badge
  };
  event.waitUntil(
      self.registration.showNotification('Notificación Push', options)
  );
});
