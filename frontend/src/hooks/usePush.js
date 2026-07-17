import { useState, useCallback } from 'react';
import axios from 'axios';

// Convertit la clé publique VAPID (base64url) en Uint8Array — requis par pushManager.subscribe
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

const SUPPORTED = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window;

/**
 * Hook Web Push natif (VAPID) — remplace useFCM (Firebase).
 * Renvoie { permission, requestPermission } où requestPermission() résout
 * avec l'objet PushSubscription (JSON prêt à poster au backend), ou null.
 */
export function usePush() {
    const [permission, setPermission] = useState(
        SUPPORTED ? Notification.permission : 'unsupported'
    );

    const requestPermission = useCallback(async () => {
        if (!SUPPORTED) {
            console.warn('Web Push: non supporté par ce navigateur');
            return null;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result !== 'granted') return null;

            // Récupère la clé publique VAPID depuis le backend
            const { data } = await axios.get('/api/push/vapid-public-key');
            if (!data?.publicKey) {
                console.warn('Web Push: clé VAPID publique indisponible côté serveur');
                return null;
            }

            // Enregistre le service worker et attend qu'il soit actif
            let swReg = await navigator.serviceWorker.register('/push-sw.js');
            if (swReg.installing) {
                await new Promise(resolve => {
                    swReg.installing.addEventListener('statechange', function handler(e) {
                        if (e.target.state === 'activated') {
                            this.removeEventListener('statechange', handler);
                            resolve();
                        }
                    });
                });
            }
            swReg = await navigator.serviceWorker.ready;

            // Réutilise un abonnement existant, sinon en crée un nouveau
            let subscription = await swReg.pushManager.getSubscription();
            if (!subscription) {
                subscription = await swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(data.publicKey),
                });
            }

            return subscription.toJSON();
        } catch (e) {
            console.error('Web Push permission error:', e.message, e);
            return null;
        }
    }, []);

    return { permission, requestPermission };
}
