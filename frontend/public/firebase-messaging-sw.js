// firebase-messaging-sw.js — Service Worker pour les notifications push

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey:            self.FIREBASE_API_KEY            || '__FIREBASE_API_KEY__',
    authDomain:        self.FIREBASE_AUTH_DOMAIN        || '__FIREBASE_AUTH_DOMAIN__',
    projectId:         self.FIREBASE_PROJECT_ID         || '__FIREBASE_PROJECT_ID__',
    storageBucket:     self.FIREBASE_STORAGE_BUCKET     || '__FIREBASE_STORAGE_BUCKET__',
    messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID|| '__FIREBASE_MESSAGING_SENDER_ID__',
    appId:             self.FIREBASE_APP_ID             || '__FIREBASE_APP_ID__',
});

// Gestion directe du push event — bypasse le routing foreground/background de Firebase
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

// Clic sur la notification → ouvre l'URL associée
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
