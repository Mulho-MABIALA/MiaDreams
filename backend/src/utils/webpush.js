/**
 * webpush.js — Web Push natif (VAPID)
 * Remplace utils/fcm.js (Firebase Cloud Messaging).
 *
 * Pas de compte Google Cloud/Firebase requis : on génère une paire de clés
 * VAPID une seule fois (voir README / .env.example) et on envoie directement
 * via le protocole Web Push standard. Les navigateurs (Chrome via le service
 * push de Google, Firefox via Mozilla, etc.) livrent la notification.
 *
 * Doc : https://github.com/web-push-libs/web-push
 */

const webpush = require('web-push');

const VAPID_PUBLIC_KEY  = process.env.VAPID_PUBLIC_KEY  || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT     = process.env.VAPID_SUBJECT || 'mailto:contact@mia-dreams.com';

let _ready = false;
let _initError = null;

function initWebPush() {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        _initError = 'VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY manquants dans .env '
            + '(générez-les avec: npx web-push generate-vapid-keys)';
        console.warn('⚠️ Web Push:', _initError);
        return;
    }
    try {
        webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
        _ready = true;
        console.log('✅ Web Push (VAPID) initialisé');
    } catch (e) {
        _initError = e.message;
        console.error('❌ Web Push init error:', e.message);
    }
}

// Initialisation immédiate au chargement du module
initWebPush();

/**
 * Envoie une notification push à un abonnement.
 * @param {{endpoint:string, keys:{p256dh:string, auth:string}}} subscription
 * @param {{title:string, body:string, data?:object}} payload
 * @returns {Promise<{ok:boolean, gone?:boolean}>}
 */
async function sendPush(subscription, { title, body, data = {} }) {
    if (!subscription || !subscription.endpoint) return { ok: false };
    if (!_ready) {
        console.warn('⚠️ Web Push non initialisé, push ignoré. Erreur:', _initError);
        return { ok: false };
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                notification: { title, body, icon: '/logo192.png', badge: '/logo192.png' },
                data: { url: data.url || '/', ...data },
            })
        );
        console.log('✅ Push envoyé');
        return { ok: true };
    } catch (e) {
        // 404/410 = abonnement expiré ou révoqué côté navigateur
        if (e.statusCode === 404 || e.statusCode === 410) {
            console.warn('⚠️ Abonnement push expiré/révoqué (endpoint invalide)');
            return { ok: false, gone: true };
        }
        console.error('❌ Erreur push:', e.message);
        return { ok: false };
    }
}

/**
 * Envoie à plusieurs abonnements en parallèle.
 * @returns {Promise<string[]>} liste des endpoints devenus invalides (à nettoyer en base)
 */
async function sendMulticastPush(subscriptions, payload) {
    if (!subscriptions || !subscriptions.length) return [];
    const results = await Promise.allSettled(
        subscriptions.map(sub => sendPush(sub, payload).then(r => ({ sub, ...r })))
    );
    return results
        .filter(r => r.status === 'fulfilled' && r.value.gone)
        .map(r => r.value.sub.endpoint);
}

function getInitStatus() {
    return {
        initialized: _ready,
        error: _initError,
        publicKeySet: !!VAPID_PUBLIC_KEY,
    };
}

function getPublicKey() {
    return VAPID_PUBLIC_KEY;
}

module.exports = { sendPush, sendMulticastPush, getInitStatus, getPublicKey };
