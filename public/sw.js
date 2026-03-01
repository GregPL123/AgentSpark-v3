const CACHE_NAME = 'agentspark-v2-cache-v1'
const STATIC_ASSETS = ['/', '/manifest.webmanifest']

// Helper dla logowania tylko w dew mode (lub można zostawić wyciszone)
const isDev = false

self.addEventListener('install', (e) => {
    if (isDev) console.log('[SW] Zainstalowano nowy Service Worker.')

    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Przy install dodajemy same absolute minimum resources
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

self.addEventListener('activate', (e) => {
    if (isDev) console.log('[SW] Service Worker aktywowany.')

    // Czyszczenie starego cache'u przy upgrade'ach SW
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        if (isDev) console.log('[SW] Czyszczenie starego cache:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
    return self.clients.claim()
})

self.addEventListener('fetch', (e) => {
    const { request } = e

    // Pomijamy requesty do innych domen (np Google Analytics, fonts jeśli nie chcemy cache'owac) 
    // Na razie zrobimy prostą regułę: cache-first dla statyków naszej domeny.
    const isCachableAsset =
        request.url.includes('/_next/static/') ||
        request.destination === 'image' ||
        request.destination === 'font'

    // Endpointy API (Generacja AI / Strumienie) -> Network First + Timeout (unikamy starego cache'u i nie wieszamy aplikacji)
    if (request.url.includes('/api/ai/')) {
        e.respondWith(
            fetch(request).catch(() => {
                // Zwracamy sztuczny error HTTP 503 zwiastujący rozłączenie by frontend mógł wyświetlić toast "Jesteś offline"
                return new Response(
                    JSON.stringify({ error: 'Jesteś offline. Sprawdź połączenie z siecią.' }),
                    { status: 503, headers: { 'Content-Type': 'application/json' } }
                )
            })
        )
        return
    }

    // Statyczne assety -> Cache First
    if (isCachableAsset && request.method === 'GET') {
        e.respondWith(
            caches.match(request).then((res) => {
                if (res) return res

                return fetch(request).then((netRes) => {
                    // Klonowanie odpowiedzi (body może być czytane tylko raz)
                    const clone = netRes.clone()
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    return netRes
                }).catch((err) => {
                    // Ignorujemy błędy dla pobierania assetów w offline
                    if (isDev) console.error('[SW] Nie udało się pobrać assetu:', request.url)
                })
            })
        )
        return
    }

    // API i reszta zapytań -> Network First (Zawsze aktualna strona główna, offline-fallback jeśli sieć leży)
    e.respondWith(
        fetch(request).catch(async () => {
            const cached = await caches.match(request)
            if (cached) return cached
            // Jeśli to nawigacja (klasyczny HTML) a brak w cache -> wrzucamy na główny shell `/`
            if (request.mode === 'navigate') {
                return caches.match('/')
            }
        })
    )
})
