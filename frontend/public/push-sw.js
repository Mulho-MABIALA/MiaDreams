// push-sw.js — Service Worker pour les notifications Web Push natives (VAPID)
// Remplace firebase-messaging-sw.js — aucune dépendance Firebase.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Réception d'un push envoyé par le backend (via la librairie web-push)
self.addEventListener('push', (event) => {
    let title = 'MIA DREAMS';
    let body  = '';
    let url   = '/admin';

    try {
        const payload = event.data ? event.data.json() : {};
        title = (payload.notification && payload.notification.title)
               || (payload.data && payload.data.title)
               || title;
        body  = (payload.notification && payload.notification.body)
               || (payload.data && payload.data.body)
               || body;
        url   = (payload.data && payload.data.url) || url;
    } catch (_) {}

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon:    '/logo192.png',
            badge:   '/logo192.png',
            vibrate: [200, 100, 200],
            data:    { url },
        })
    );
});

// Clic sur la notification → ouvre (ou focus) l'URL associée
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            const existing = list.find(c => c.url.includes(url));
            if (existing) return existing.focus();
            return clients.openWindow(url);
        })
    );
});
