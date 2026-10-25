/**
 * kkiapay.js — Client Kkiapay partagé (commandes boutique + inscriptions formations)
 *
 * Un seul client Kkiapay pour tout le backend, pour ne pas dupliquer la
 * configuration (clés API, mode sandbox) entre payment.js et les routes
 * de paiement des inscriptions.
 */

// Chargement paresseux du SDK : si le paquet n'est pas installé sur le serveur,
// seul le paiement Kkiapay échoue (message propre), le reste du site continue de tourner.

let _kkiapayClient = null;

function getKkiapayClient() {
    if (_kkiapayClient) return _kkiapayClient;

    const { KKIAPAY_PUBLIC_KEY, KKIAPAY_PRIVATE_KEY, KKIAPAY_SECRET_KEY } = process.env;
    if (!KKIAPAY_PUBLIC_KEY || !KKIAPAY_PRIVATE_KEY || !KKIAPAY_SECRET_KEY) {
        throw new Error('Kkiapay non configuré (clés manquantes)');
    }

    let kkiapay;
    try {
        ({ kkiapay } = require('@kkiapay-org/nodejs-sdk'));
    } catch (e) {
        throw new Error('SDK Kkiapay non installé (@kkiapay-org/nodejs-sdk)');
    }

    _kkiapayClient = kkiapay({
        publickey:  KKIAPAY_PUBLIC_KEY,
        privatekey: KKIAPAY_PRIVATE_KEY,
        secretkey:  KKIAPAY_SECRET_KEY,
        sandbox:    process.env.NODE_ENV !== 'production',
    });
    return _kkiapayClient;
}

module.exports = { getKkiapayClient };
