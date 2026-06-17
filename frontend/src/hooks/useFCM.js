import { useEffect, useState, useCallback } from 'react';
import { messaging, getToken, onMessage } from '../firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Hook pour gérer les notifications push Firebase.
 *
 * @returns {{ token: string|null, permission: string, requestPermission: function }}
 */
export function useFCM() {
    const [token, setToken]           = useState(null);
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    const requestPermission = useCallback(async () => {
        if (!messaging || !VAPID_KEY) return null;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result !== 'granted') return null;

            const fcmToken = await getToken(messaging, {
                vapidKey:           VAPID_KEY,
                serviceWorkerRegistration: await navigator.serviceWorker.register(
                    '/firebase-messaging-sw.js'
                ),
            });

            setToken(fcmToken);
            return fcmToken;
        } catch (e) {
            console.warn('FCM permission error:', e.message);
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
