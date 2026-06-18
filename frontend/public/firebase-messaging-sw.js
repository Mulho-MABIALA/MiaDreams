// firebase-messaging-sw.js — Service Worker pour les notifications push en arrière-plan

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Ces valeurs sont remplacées au build par les variables d'environnement
// Elles doivent correspondre exactement aux VITE_FIREBASE_* de ton .env
firebase.initializeApp({
    apiKey:            self.FIREBASE_API_KEY            || '__FIREBASE_API_KEY__',
    authDomain:        self.FIREBASE_AUTH_DOMAIN        || '__FIREBASE_AUTH_DOMAIN__',
    projectId:         self.FIREBASE_PROJECT_ID         || '__FIREBASE_PROJECT_ID__',
    storageBucket:     self.FIREBASE_STORAGE_BUCKET     || '__FIREBASE_STORAGE_BUCKET__',
    messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID|| '__FIREBASE_MESSAGING_SENDER_ID__',
    appId:             self.FIREBASE_APP_ID             || '__FIREBASE_APP_ID__',
});

const messaging = firebase.messaging();

// Notification reçue en arrière-plan
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || 'MIA DREAMS';
    const body  = payload.notification?.body  || payload.data?.body  || '';
    const data = payload.data || {};

    self.registration.showNotification(title, {
        body:    body || '',
        icon:    '/logo192.png',
        badge:   '/logo192.png',
        vibrate: [200, 100, 200],
        data:    { url: data.url || '/' },
    });
});

// Clic sur la notification → ouvre l'URL associée
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            const existing = list.find(c => c.url.includes(url));
            if (existing) return existing.focus();
            return clients.openWindow(url);
        })
    );
});
