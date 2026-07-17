// firebase-messaging-sw.js — DÉPRÉCIÉ, remplacé par push-sw.js
// Ce service worker se désenregistre automatiquement pour les navigateurs qui
// l'auraient encore installé depuis une ancienne visite, afin d'éviter tout
// conflit avec le nouveau push-sw.js (Web Push natif / VAPID).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    event.waitUntil(
        self.registration.unregister().then(() => {
            return self.clients.matchAll({ type: 'window' });
        }).then((clients) => {
            clients.forEach((client) => client.navigate(client.url));
        })
    );
});
