// // Service Worker para MediLink PWA
// const CACHE_NAME = "medilink-v1";
// const urlsToCache = [
//   "/",
//   "/login",
//   "/register",
//   "/offline",
//   "/favicon.ico",
//   "/android-chrome-192x192.png",
//   "/android-chrome-512x512.png",
// ];

// // Instalación del Service Worker
// self.addEventListener("install", (event) => {
//   console.log("[SW] Instalando Service Worker...");
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => {
//         console.log("[SW] Cacheando archivos importantes");
//         return cache.addAll(urlsToCache);
//       })
//       .then(() => self.skipWaiting())
//       .catch((error) => {
//         console.error("[SW] Error durante la instalación:", error);
//       })
//   );
// });

// // Activación y limpieza de cachés antiguos
// self.addEventListener("activate", (event) => {
//   console.log("[SW] Activando Service Worker...");
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             if (cacheName !== CACHE_NAME) {
//               console.log("[SW] Eliminando caché antiguo:", cacheName);
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//       .then(() => {
//         console.log("[SW] Service Worker activado");
//         return self.clients.claim();
//       })
//   );
// });

// // Estrategia de caché: Network First con fallback a caché
// self.addEventListener("fetch", (event) => {
//   // Solo manejar peticiones GET
//   if (event.request.method !== "GET") return;

//   // Ignorar peticiones a la API (siempre ir a la red)
//   if (
//     event.request.url.includes("/api/") ||
//     event.request.url.includes("medilink-backend")
//   ) {
//     return;
//   }

//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         // Si la respuesta es válida, clonarla y guardarla en caché
//         if (response && response.status === 200 && response.type === "basic") {
//           const responseToCache = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseToCache);
//           });
//         }
//         return response;
//       })
//       .catch(() => {
//         // Si falla la red, intentar obtener de caché
//         return caches.match(event.request).then((response) => {
//           if (response) {
//             return response;
//           }
//           // Si no está en caché y es una navegación, mostrar página offline
//           if (event.request.mode === "navigate") {
//             return caches.match("/offline");
//           }
//         });
//       })
//   );
// });

// // Manejo de notificaciones push
// self.addEventListener("push", (event) => {
//   console.log("[SW] Push recibido");

//   if (event.data) {
//     const data = event.data.json();
//     const options = {
//       body: data.body,
//       icon: data.icon || "/android-chrome-192x192.png",
//       badge: "/favicon-32x32.png",
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         primaryKey: data.id || "1",
//         url: data.url || "/",
//       },
//       actions: [
//         {
//           action: "open",
//           title: "Abrir",
//         },
//         {
//           action: "close",
//           title: "Cerrar",
//         },
//       ],
//       tag: data.tag || "medilink-notification",
//       requireInteraction: data.requireInteraction || false,
//     };

//     event.waitUntil(self.registration.showNotification(data.title, options));
//   }
// });

// // Manejo de clicks en notificaciones
// self.addEventListener("notificationclick", (event) => {
//   console.log("[SW] Click en notificación");
//   event.notification.close();

//   if (event.action === "close") {
//     return;
//   }

//   const urlToOpen = event.notification.data?.url || "/";

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         // Si ya hay una ventana abierta, enfocarla
//         for (const client of clientList) {
//           if (client.url.includes(urlToOpen) && "focus" in client) {
//             return client.focus();
//           }
//         }
//         // Si no, abrir una nueva ventana
//         if (clients.openWindow) {
//           return clients.openWindow(urlToOpen);
//         }
//       })
//   );
// });

// // Sincronización en segundo plano
// self.addEventListener("sync", (event) => {
//   console.log("[SW] Sync event:", event.tag);
//   if (event.tag === "sync-appointments") {
//     event.waitUntil(syncAppointments());
//   }
// });

// async function syncAppointments() {
//   console.log("[SW] Sincronizando citas...");
//   // Aquí puedes implementar la lógica de sincronización
//   // Por ejemplo, enviar citas pendientes cuando vuelva la conexión
// }
// Service Worker para MediLink PWA
const CACHE_NAME = "medilink-v1";
const urlsToCache = [
  "/",
  "/login",
  "/register",
  "/offline",
  "/favicon.ico",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando Service Worker...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Cacheando archivos importantes");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("[SW] Error durante la instalación:", error);
      })
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener("activate", (event) => {
  console.log("[SW] Activando Service Worker...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Eliminando caché antiguo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] Service Worker activado");
        return self.clients.claim();
      })
  );
});

// Función para verificar si la URL es cacheable
function isValidRequest(request) {
  const url = new URL(request.url);

  // Ignorar extensiones del navegador
  if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") {
    return false;
  }

  // Ignorar peticiones a la API
  if (url.pathname.includes("/api/") || url.href.includes("medilink-backend")) {
    return false;
  }

  // Solo cachear peticiones HTTP/HTTPS
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }

  return true;
}

// Estrategia de caché: Network First con fallback a caché
self.addEventListener("fetch", (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== "GET") return;

  // Verificar si la petición es válida para cachear
  if (!isValidRequest(event.request)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y guardarla en caché
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Verificar nuevamente antes de guardar en caché
            if (isValidRequest(event.request)) {
              cache.put(event.request, responseToCache).catch((error) => {
                console.log("[SW] No se pudo cachear:", event.request.url, error);
              });
            }
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar obtener de caché
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Si no está en caché y es una navegación, mostrar página offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline");
          }
        });
      })
  );
});

// Manejo de notificaciones push
self.addEventListener("push", (event) => {
  console.log("[SW] Push recibido");

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/android-chrome-192x192.png",
      badge: "/favicon-32x32.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || "1",
        url: data.url || "/",
      },
      actions: [
        {
          action: "open",
          title: "Abrir",
        },
        {
          action: "close",
          title: "Cerrar",
        },
      ],
      tag: data.tag || "medilink-notification",
      requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Manejo de clicks en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Click en notificación");
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        // Si no, abrir una nueva ventana
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Sincronización en segundo plano
self.addEventListener("sync", (event) => {
  console.log("[SW] Sync event:", event.tag);
  if (event.tag === "sync-appointments") {
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  console.log("[SW] Sincronizando citas...");
  // Aquí puedes implementar la lógica de sincronización
  // Por ejemplo, enviar citas pendientes cuando vuelva la conexión
}
