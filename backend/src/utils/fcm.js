/**
 * fcm.js — Firebase Cloud Messaging (Admin SDK)
 */

const fs   = require('fs');
const path = require('path');

let _admin = null;
let _initError = null;

function initFirebase() {
    try {
        const admin = require('firebase-admin');
        if (admin.apps.length) { _admin = admin; return; }

        const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
            || path.join(__dirname, '../../firebase-adminsdk.json');

        let credential;
        if (fs.existsSync(filePath)) {
            const sa = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            credential = admin.credential.cert(sa);
            console.log('✅ Firebase Admin: service account chargé depuis', filePath);
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
            console.log('✅ Firebase Admin: service account chargé depuis env');
        } else {
            _initError = 'Aucun service account trouvé (ni fichier ni env var)';
            console.warn('⚠️ Firebase Admin:', _initError);
            return;
        }

        admin.initializeApp({ credential });
        _admin = admin;
        console.log('✅ Firebase Admin initialisé');
    } catch (e) {
        _initError = e.message;
        console.error('❌ Firebase Admin init error:', e.message);
    }
}

// Initialisation immédiate au chargement du module
initFirebase();

async function sendPush(token, { title, body, data = {} }) {
    if (!token || token === '__test__') return;
    if (!_admin) {
        console.warn('⚠️ Firebase non initialisé, push ignoré. Erreur:', _initError);
        return;
    }

    try {
        await _admin.messaging().send({
            token,
            data: {
                title,
                body,
                ...Object.fromEntries(
                    Object.entries(data).map(([k, v]) => [k, String(v)])
                ),
            },
            webpush: {
                notification: { title, body, icon: '/logo192.png', badge: '/logo192.png' },
                fcmOptions: { link: data.url || '/' },
            },
        });
        console.log('✅ Push FCM envoyé');
    } catch (e) {
        if (e.code === 'messaging/registration-token-not-registered') {
            console.warn('⚠️ Token FCM révoqué');
        } else {
            console.error('❌ Erreur push FCM:', e.message);
        }
    }
}

async function sendMulticastPush(tokens, payload) {
    if (!tokens?.length) return;
    await Promise.allSettled(tokens.map(t => sendPush(t, payload)));
}

function getInitStatus() {
    return {
        initialized: !!_admin,
        error: _initError,
        appsCount: (() => { try { return require('firebase-admin').apps.length; } catch(e) { return -1; } })(),
    };
}

module.exports = { sendPush, sendMulticastPush, getInitStatus };
