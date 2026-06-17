/**
 * fcm.js — Firebase Cloud Messaging (Admin SDK)
 * Envoie des notifications push aux appareils enregistrés.
 */

let _app = null;

function getAdmin() {
    if (_app) return _app;

    try {
        const admin = require('firebase-admin');
        if (admin.apps.length) { _app = admin; return admin; }

        let credential;

        // Priorité 1 : fichier JSON sur le serveur (contourne la limite 255 chars de Plesk)
        const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
        if (filePath) {
            const fs = require('fs');
            const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            credential = admin.credential.cert(serviceAccount);
        }
        // Priorité 2 : JSON inline dans la variable d'env (dev local)
        else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
        }
        else {
            return null;
        }

        admin.initializeApp({ credential });
        _app = admin;
        return admin;
    } catch (e) {
        console.error('❌ Firebase Admin init error:', e.message);
        return null;
    }
}

/**
 * Envoie une notification push à un token FCM.
 * @param {string} token  - FCM device token
 * @param {object} payload - { title, body, data? }
 */
async function sendPush(token, { title, body, data = {} }) {
    if (!token) return;
    const admin = getAdmin();
    if (!admin) return;

    try {
        await admin.messaging().send({
            token,
            notification: { title, body },
            data: Object.fromEntries(
                Object.entries(data).map(([k, v]) => [k, String(v)])
            ),
            webpush: {
                notification: {
                    title,
                    body,
                    icon: '/logo192.png',
                    badge: '/logo192.png',
                    vibrate: [200, 100, 200],
                },
                fcmOptions: {
                    link: data.url || '/',
                },
            },
        });
        console.log('✅ Push FCM envoyé');
    } catch (e) {
        // Token invalide / révoqué — pas bloquant
        if (e.code === 'messaging/registration-token-not-registered') {
            console.warn('⚠️  Token FCM invalide (révoqué)');
        } else {
            console.error('❌ Erreur push FCM:', e.message);
        }
    }
}

/**
 * Envoie une notification à plusieurs tokens (multicast).
 * @param {string[]} tokens
 * @param {object}   payload - { title, body, data? }
 */
async function sendMulticastPush(tokens, payload) {
    if (!tokens?.length) return;
    await Promise.allSettled(tokens.map(t => sendPush(t, payload)));
}

module.exports = { sendPush, sendMulticastPush };
