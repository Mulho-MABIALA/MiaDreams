/**
 * cinetpay.js — Client CinetPay, nouvelle API « 1.0 Aurore » (panel.cinetpay.net)
 * Côte d'Ivoire : Wave, Orange Money, MTN, Moov, carte bancaire.
 *
 * Flux « redirection » :
 *   1. le backend obtient un jeton (POST /v1/oauth/login avec api_key + api_password),
 *      initialise le paiement (POST /v1/payment, montant calculé côté serveur)
 *      et renvoie la payment_url ;
 *   2. le client paie sur CinetPay puis revient sur /paiement/retour?ref=… ;
 *   3. le backend relit le statut (GET /v1/payment/{merchant_transaction_id})
 *      avant de valider quoi que ce soit — jamais confiance au navigateur ni au
 *      contenu du webhook (la doc CinetPay l'impose).
 * La notification (notify_url) sert de filet de sécurité si le client ferme l'onglet.
 *
 * Le merchant_transaction_id (30 caractères max) encode ce qui est payé :
 *   1 lettre (O = commande, I = inscription) + ObjectId (24) + suffixe (5)
 * On n'a donc besoin d'aucune metadata pour retrouver la commande / l'inscription.
 *
 * Variables d'environnement :
 *   CINETPAY_API_KEY, CINETPAY_API_PASSWORD  (panel → Paramètres → API & sécurité)
 *   CINETPAY_API_URL     (optionnel, défaut https://api.cinetpay.net)
 *   CINETPAY_NOTIFY_URL  (optionnel, défaut https://mia-dreams.com/api/payment/cinetpay/notify)
 * ⚠️ L'IP du serveur qui appelle l'API doit être dans la liste blanche IP du panel.
 */

const API_URL = (process.env.CINETPAY_API_URL || process.env.CINETPAY_BASE_URL || 'https://api.cinetpay.net').replace(/\/+$/, '');

const TYPE_PREFIX = { order: 'O', inscription: 'I' };
const PREFIX_TYPE = { O: 'order', I: 'inscription' };
const MTID_RE = /^([OI])([a-f0-9]{24})[a-z0-9]{1,5}$/i;

function isCinetpayConfigured() {
    return !!(process.env.CINETPAY_API_KEY && process.env.CINETPAY_API_PASSWORD);
}

// ── Jeton d'accès (mis en cache jusqu'à expiration) ──────────────────────────
let _token = null;
let _tokenExpiresAt = 0;

async function getAccessToken(force = false) {
    if (!force && _token && Date.now() < _tokenExpiresAt) return _token;
    if (!isCinetpayConfigured()) throw new Error('CinetPay non configuré (CINETPAY_API_KEY / CINETPAY_API_PASSWORD manquants)');

    const response = await fetch(`${API_URL}/v1/oauth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({
            api_key:      process.env.CINETPAY_API_KEY,
            api_password: process.env.CINETPAY_API_PASSWORD,
        }),
    });
    let data = {};
    try { data = await response.json(); } catch { /* réponse vide */ }

    if (!response.ok || !data.access_token) {
        const err = new Error(data.message || `Authentification CinetPay refusée (${response.status})`);
        err.cinetpay = data;
        throw err;
    }
    _token = data.access_token;
    // Marge de 60 s pour ne jamais envoyer un jeton qui expire en route.
    _tokenExpiresAt = Date.now() + Math.max(60, (Number(data.expires_in) || 3600) - 60) * 1000;
    return _token;
}

async function cinetpayRequest(method, path, body, retried = false) {
    const token = await getAccessToken();
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            Authorization:  `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept:         'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    // Jeton révoqué / expiré plus tôt que prévu → on en redemande un, une seule fois.
    if (response.status === 401 && !retried) {
        _token = null;
        return cinetpayRequest(method, path, body, true);
    }

    let data = {};
    try { data = await response.json(); } catch { /* réponse vide */ }

    if (!response.ok) {
        const err = new Error(data.message || `Erreur CinetPay (${response.status})`);
        err.cinetpay = data;
        throw err;
    }
    return data;
}

// ── Identifiant de transaction marchand ──────────────────────────────────────
/** Ex. buildMerchantTransactionId('order', '65f…') → 'O65f…k3x9z' (30 caractères). */
function buildMerchantTransactionId(type, id) {
    const prefix = TYPE_PREFIX[type];
    if (!prefix) throw new Error(`Type de paiement inconnu : ${type}`);
    // Suffixe unique par tentative (un client peut réessayer le paiement).
    return `${prefix}${id}${Date.now().toString(36).slice(-5)}`;
}

/** Retrouve { type, id } depuis un merchant_transaction_id, ou null s'il n'est pas à nous. */
function parseMerchantTransactionId(mtid) {
    const m = MTID_RE.exec(String(mtid || ''));
    return m ? { type: PREFIX_TYPE[m[1].toUpperCase()], id: m[2].toLowerCase() } : null;
}

// ── Paiement ─────────────────────────────────────────────────────────────────
/** Découpe un nom complet en prénom / nom (CinetPay exige 2 caractères minimum pour chacun). */
function splitName(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    const pad = (s) => (s && s.length >= 2 ? s : 'Client').slice(0, 255);
    if (parts.length <= 1) return { first: pad(parts[0]), last: pad(parts[0]) };
    return { first: pad(parts.slice(0, -1).join(' ')), last: pad(parts[parts.length - 1]) };
}

/** Numéro au format international (+225…) ou undefined si inutilisable. */
function normalizePhone(phone) {
    const digits = String(phone || '').replace(/[^\d+]/g, '');
    if (!digits) return undefined;
    if (digits.startsWith('+')) return digits;
    if (digits.startsWith('00')) return `+${digits.slice(2)}`;
    if (digits.length === 10) return `+225${digits}`; // numéro ivoirien local
    return undefined;
}

/**
 * Initialise un paiement web. Renvoie la réponse CinetPay (payment_url, transaction_id, notify_token…).
 * amountXof : montant en FCFA (entier).
 */
async function initPayment({ merchantTransactionId, amountXof, designation, customer, successUrl, failedUrl }) {
    const { first, last } = splitName(customer.name);
    const phone = normalizePhone(customer.phone);
    const data = await cinetpayRequest('POST', '/v1/payment', {
        currency:                'XOF',
        merchant_transaction_id: merchantTransactionId,
        amount:                  Math.round(amountXof),
        lang:                    'fr',
        designation:             String(designation || 'Paiement MIA DREAMS').slice(0, 100),
        client_email:            customer.email,
        client_first_name:       first,
        client_last_name:        last,
        ...(phone ? { client_phone_number: phone } : {}),
        success_url:             successUrl,
        failed_url:              failedUrl,
        notify_url:              process.env.CINETPAY_NOTIFY_URL || 'https://mia-dreams.com/api/payment/cinetpay/notify',
    });
    if (!data.payment_url) {
        const err = new Error(data.details?.message || data.message || 'URL de paiement CinetPay manquante');
        err.cinetpay = data;
        throw err;
    }
    return data;
}

/**
 * Statut canonique d'un paiement (source de vérité).
 * status : SUCCESS | FAILED | INITIATED | PENDING | WAITING…
 */
async function getPaymentStatus(merchantTransactionId) {
    if (!parseMerchantTransactionId(merchantTransactionId)) throw new Error('Référence de paiement invalide');
    return cinetpayRequest('GET', `/v1/payment/${encodeURIComponent(merchantTransactionId)}`);
}

/**
 * URL publique du site pour les redirections (retour / échec).
 * On prend l'Origin de la requête du navigateur si elle fait partie des domaines
 * autorisés (le site et l'API sont servis par la même app), sinon FRONTEND_URL.
 * Évite une redirection vers localhost si FRONTEND_URL est mal réglé en prod.
 */
function resolveSiteUrl(req) {
    const allowed = [
        process.env.FRONTEND_URL,
        'https://mia-dreams.com',
        'https://www.mia-dreams.com',
        'http://localhost:5173',
    ].filter(Boolean).map(u => u.replace(/\/+$/, ''));
    const origin = (req.get('origin') || '').replace(/\/+$/, '');
    if (origin && allowed.includes(origin)) return origin;
    return allowed[0] || 'https://mia-dreams.com';
}

/** URLs de retour CinetPay (120 caractères max chacune). */
function returnUrls(site, merchantTransactionId) {
    const base = `${site}/paiement/retour?ref=${encodeURIComponent(merchantTransactionId)}`;
    return { successUrl: base, failedUrl: `${base}&echec=1` };
}

module.exports = {
    isCinetpayConfigured,
    buildMerchantTransactionId,
    parseMerchantTransactionId,
    initPayment,
    getPaymentStatus,
    resolveSiteUrl,
    returnUrls,
};
