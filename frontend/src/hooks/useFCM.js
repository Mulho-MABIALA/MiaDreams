import { useEffect, useState, useCallback } from 'react';
import { messaging, getToken, onMessage } from '../firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export function useFCM() {
    const [token, setToken]           = useState(null);
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    const requestPermission = useCallback(async () => {
        if (!messaging || !VAPID_KEY) {
            console.warn('FCM: messaging ou VAPID_KEY manquant', { messaging: !!messaging, VAPID_KEY: !!VAPID_KEY });
            return null;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result !== 'granted') return null;

            // Enregistrer le SW et attendre qu'il soit actif
            let swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

            // Attendre que le SW soit actif (pas juste installé)
            if (swReg.installing) {
                await new Promise(resolve => {
                    swReg.installing.addEventListener('statechange', function handler(e) {
                        if (e.target.state === 'activated') {
                            this.removeEventListener('statechange', handler);
                            resolve();
                        }
                    });
                });
                // Recharger la registration après activation
                swReg = await navigator.serviceWorker.getRegistration('/');
            }

            const fcmToken = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: swReg,
            });

            setToken(fcmToken);
            return fcmToken;
        } catch (e) {
            console.warn('FCM permission error:', e.message, e.code);
            return null;
        }
    }, []);

    // Écoute les messages reçus quand l'app est au premier plan
    useEffect(() => {
        if (!messaging) return;
        const unsubscribe = onMessage(messaging, (payload) => {
            const { title, body } = payload.notification || {};
            if (title && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { body, icon: '/logo192.png' });
            }
        });
        return unsubscribe;
    }, []);

    return { token, permission, requestPermission };
}
