/**
 * payment.js — Routes de paiement MIA DREAMS
 * ─────────────────────────────────────────────
 * Wave CI       : api.wave.com (checkout sessions + webhook HMAC)
 * Orange Money CI : api.orange.com (WebPay CI + webhook)
 * Confirmation manuelle : admin
 */

const express = require('express');
const crypto  = require('crypto');
const router  = express.Router();
const Order   = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { pushStatusUpdate, notifyStatusUpdate, pushAdminNotify } = require('../utils/notify');

// Notifie l'admin en cas d'échec/annulation de paiement, pour relancer le client
function alertAdminPaymentFailed(order, provider) {
    if (!order) return;
    pushAdminNotify({
        title: '⚠️ Paiement échoué',
        body:  `${order.order_number} — ${provider} — ${order.customer?.name || ''}`,
        url:   '/admin/commandes',
    }).catch(e => console.error(`Push admin (${provider} échec) error:`, e.message));
}

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND  = process.env.BACKEND_URL  || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
//  WAVE CI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/payment/wave/init
 * Crée une session de paiement Wave et retourne le lien de paiement.
 *
 * Doc Wave : https://wave.com/en/business/developer/
 * Clé API  : Tableau de bord Wave Business → Paramètres → API & Webhooks
 */
router.post('/wave/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        if (!process.env.WAVE_API_KEY) {
            return res.status(503).json({ message: 'Paiement Wave non configuré. Contactez-nous.' });
        }

        const payload = {
            amount:           String(Math.round(order.total)),
            currency:         'XOF',
            success_url:      `${FRONTEND}/commande/succes/${orderId}`,
            error_url:        `${FRONTEND}/commande/erreur/${orderId}`,
            client_reference: orderId,
        };

        const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WAVE_API_KEY}`,
                'Content-Type':  'application/json',
                'Idempotency-Key': orderId,   // évite les doubles débits
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Wave API error:', data);
            throw new Error(data.message || `Erreur Wave (${response.status})`);
        }

        // Sauvegarder la référence Wave
        await Order.findByIdAndUpdate(orderId, {
            payment_ref:    data.id,
            payment_status: 'pending',
        });

        res.json({ checkout_url: data.wave_launch_url });
    } catch (e) {
        console.error('Wave init error:', e.message);
        res.status(500).json({ message: e.message });
    }
});

/**
 * POST /api/payment/wave/webhook
 * Appelé par Wave après paiement. Vérifie la signature HMAC-SHA256.
 *
 * Configuration dans Wave Business :
 * → Paramètres → API & Webhooks → Webhook URL :
 *   https://mia-dreams.onrender.com/api/payment/wave/webhook
 * → Copier le "Webhook Secret" dans WAVE_WEBHOOK_SECRET
 */
router.post('/wave/webhook', async (req, res) => {
    // ── Vérification signature HMAC-SHA256 — OBLIGATOIRE ──
    const webhookKey = process.env.WAVE_WEBHOOK_SECRET;
    const waveSig    = req.headers['wave-signature'] || '';

    if (!webhookKey) {
        console.error('❌ WAVE_WEBHOOK_SECRET non configuré — webhook rejeté');
        return res.status(401).json({ message: 'Webhook non configuré' });
    }
    if (!waveSig) {
        console.warn('⚠️  Wave webhook : en-tête X-Wave-Signature manquant');
        return res.status(401).json({ message: 'Signature manquante' });
    }
    try {
        // Format Wave : "t=<timestamp>,v1=<signature>"
        const parts     = Object.fromEntries(waveSig.split(',').map(p => p.split('=')));
        const timestamp = parts.t;
        const signature = parts.v1;
        const rawBody   = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const expected  = crypto
            .createHmac('sha256', webhookKey)
            .update(`${timestamp}.${rawBody}`)
            .digest('hex');

        if (!timestamp || !signature || expected !== signature) {
            console.warn('⚠️  Wave webhook signature invalide');
            return res.status(401).json({ message: 'Signature invalide' });
        }
    } catch (e) {
        console.error('Erreur vérification signature Wave:', e.message);
        return res.status(401).json({ message: 'Erreur vérification signature' });
    }

    try {
        const { client_reference, payment_status } = req.body;

        if (payment_status === 'succeeded') {
            const order = await Order.findByIdAndUpdate(
                client_reference,
                { payment_status: 'paid', order_status: 'confirmed' },
                { new: true }
            );
            if (order) {
                console.log(`✅ Wave — Paiement confirmé : ${order.order_number}`);
                pushStatusUpdate(order).catch(e => console.error('Push client (Wave) error:', e.message));
                notifyStatusUpdate(order).catch(e => console.error('Email client (Wave) error:', e.message));
            }
        } else if (payment_status === 'failed' || payment_status === 'cancelled') {
            const order = await Order.findByIdAndUpdate(client_reference, { payment_status: 'failed' }, { new: true });
            console.log(`❌ Wave — Paiement ${payment_status} : ${client_reference}`);
            alertAdminPaymentFailed(order, 'Wave');
        }

        res.json({ received: true });
    } catch (e) {
        console.error('Erreur webhook Wave:', e.message);
        res.status(500).json({ message: e.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
//  ORANGE MONEY CI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/payment/orange-money/init
 * Initie un paiement Orange Money CI via l'API WebPay.
 *
 * Pour obtenir les credentials :
 * 1. Créer un compte développeur : https://developer.orange.com
 * 2. Créer une application et souscrire à "Orange Money CI WebPay"
 * 3. Récupérer le Bearer Token OAuth2 et le Merchant Key
 * → ORANGE_MONEY_TOKEN      : Bearer token (expire, à renouveler)
 * → ORANGE_MONEY_MERCHANT_KEY : Merchant key (fixe)
 */
router.post('/orange-money/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        // ── Mode manuel si clé absente ──
        if (!process.env.ORANGE_MONEY_MERCHANT_KEY || !process.env.ORANGE_MONEY_TOKEN) {
            await Order.findByIdAndUpdate(orderId, {
                payment_ref:    `OM-MANUEL-${Date.now()}`,
                payment_status: 'pending',
            });
            return res.json({
                status:       'instructions',
                message:      `Envoyez ${order.total.toLocaleString('fr-FR')} FCFA au marchand Orange Money, puis partagez votre reçu sur WhatsApp avec la référence ${order.order_number}.`,
                order_number: order.order_number,
            });
        }

        const payload = {
            merchant_key: process.env.ORANGE_MONEY_MERCHANT_KEY,
            currency:     'OUV',                  // OUV = unité Orange Money (XOF)
            order_id:     order.order_number,
            amount:       Math.round(order.total),
            return_url:   `${FRONTEND}/commande/succes/${orderId}`,
            cancel_url:   `${FRONTEND}/commande/erreur/${orderId}`,
            notif_url:    `${BACKEND}/api/payment/orange-money/webhook`,
            lang:         'fr',
            reference:    orderId,
        };

        const response = await fetch('https://api.orange.com/orange-money-webpay/ci/v1/webpayment', {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${process.env.ORANGE_MONEY_TOKEN}`,
                'Content-Type':  'application/json',
                'Accept':        'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || data.status !== '200') {
            console.error('Orange Money API error:', data);
            throw new Error(data.message || `Erreur Orange Money (${response.status})`);
        }

        await Order.findByIdAndUpdate(orderId, {
            payment_ref:    data.pay_token,
            payment_status: 'pending',
        });

        res.json({ checkout_url: data.payment_url });
    } catch (e) {
        console.error('Orange Money init error:', e.message);
        res.status(500).json({ message: e.message });
    }
});

/**
 * POST /api/payment/orange-money/webhook
 * Notif de paiement Orange Money (envoyée sur notif_url).
 *
 * Dans votre portail Orange Developer, configurez :
 * Webhook URL : https://mia-dreams.onrender.com/api/payment/orange-money/webhook
 */
router.post('/orange-money/webhook', async (req, res) => {
    try {
        const { reference, status, txnid, merchant_key } = req.body;

        // Vérification : le merchant_key doit correspondre à notre clé
        const expectedKey = process.env.ORANGE_MONEY_MERCHANT_KEY;
        if (expectedKey && merchant_key !== expectedKey) {
            console.warn('⚠️  Orange Money webhook : merchant_key invalide');
            return res.status(401).json({ message: 'Non autorisé' });
        }
        console.log('Orange Money webhook reçu:', { reference, status, txnid });

        if (status === 'SUCCESS') {
            const order = await Order.findByIdAndUpdate(
                reference,
                { payment_status: 'paid', order_status: 'confirmed', payment_ref: txnid || reference },
                { new: true }
            );
            if (order) {
                console.log(`✅ Orange Money — Paiement confirmé : ${order.order_number}`);
                pushStatusUpdate(order).catch(e => console.error('Push client (Orange Money) error:', e.message));
                notifyStatusUpdate(order).catch(e => console.error('Email client (Orange Money) error:', e.message));
            }
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            const order = await Order.findByIdAndUpdate(reference, { payment_status: 'failed' }, { new: true });
            console.log(`❌ Orange Money — Paiement ${status} : ${reference}`);
            alertAdminPaymentFailed(order, 'Orange Money');
        }

        res.json({ received: true });
    } catch (e) {
        console.error('Erreur webhook Orange Money:', e.message);
        res.status(500).json({ message: e.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
//  FREE MONEY (instructions manuelles — pas d'API officielle)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/free-money/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        await Order.findByIdAndUpdate(orderId, {
            payment_ref:    `FM-${Date.now()}`,
            payment_status: 'pending',
        });

        return res.json({
            status:       'instructions',
            message:      `Composez *555# sur votre mobile Free, choisissez "Paiement marchand" et entrez le code ${order.order_number} pour ${order.total.toLocaleString('fr-FR')} FCFA. Envoyez ensuite votre reçu sur WhatsApp.`,
            order_number: order.order_number,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.post('/free-money/webhook', async (req, res) => {
    try {
        // Vérification par token secret dans l'URL (?secret=...)
        const expectedSecret = process.env.FREE_MONEY_WEBHOOK_SECRET;
        if (!expectedSecret || req.query.secret !== expectedSecret) {
            console.warn('⚠️  Free Money webhook : secret invalide');
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const { reference, status } = req.body;
        if (status === 'SUCCESS') {
            const order = await Order.findByIdAndUpdate(reference, {
                payment_status: 'paid',
                order_status:   'confirmed',
            }, { new: true });
            if (order) {
                pushStatusUpdate(order).catch(e => console.error('Push client (Free Money) error:', e.message));
                notifyStatusUpdate(order).catch(e => console.error('Email client (Free Money) error:', e.message));
            }
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            const order = await Order.findByIdAndUpdate(reference, { payment_status: 'failed' }, { new: true });
            alertAdminPaymentFailed(order, 'Free Money');
        }
        res.json({ received: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
//  CINETPAY — agrégateur CI (Wave, Orange Money, MTN, Moov, Free Money, Carte)
//  API v1 "Aurore" — nouvelle plateforme CinetPay (multi-tenant, un compte par pays)
//  Doc : panel.cinetpay.net → API & sécurité → Documentation API
// ─────────────────────────────────────────────────────────────────────────────

// Sandbox par défaut (https://api.cinetpay.net) — à remplacer par l'URL de prod
// une fois le compte validé via "Mise en production" dans le dashboard CinetPay.
const CINETPAY_BASE_URL = process.env.CINETPAY_BASE_URL || 'https://api.cinetpay.net';

// Cache du jeton JWT en mémoire (évite de se ré-authentifier à chaque appel)
let _cinetpayToken = null;
let _cinetpayTokenExpiry = 0;

async function getCinetPayToken() {
    if (_cinetpayToken && Date.now() < _cinetpayTokenExpiry) return _cinetpayToken;

    const apiKey      = process.env.CINETPAY_API_KEY;
    const apiPassword = process.env.CINETPAY_API_PASSWORD;
    if (!apiKey || !apiPassword) throw new Error('CINETPAY_API_KEY / CINETPAY_API_PASSWORD manquants');

    const response = await fetch(`${CINETPAY_BASE_URL}/v1/oauth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ api_key: apiKey, api_password: apiPassword }),
    });
    const data = await response.json();
    if (!response.ok || !data.access_token) {
        console.error('CinetPay oauth/login error:', data);
        throw new Error(data.message || 'Authentification CinetPay échouée');
    }

    _cinetpayToken = data.access_token;
    // Rafraîchit ~60s avant expiration (fallback 23h si expires_in absent)
    _cinetpayTokenExpiry = Date.now() + ((data.expires_in || 82800) - 60) * 1000;
    return _cinetpayToken;
}

/**
 * POST /api/payment/cinetpay/init
 * Crée une transaction CinetPay et retourne le lien de paiement.
 *
 * Variables d'environnement à ajouter dans Plesk :
 *   CINETPAY_API_KEY      → Dashboard CinetPay → API & sécurité → API Key
 *   CINETPAY_API_PASSWORD → Dashboard CinetPay → API & sécurité → Mot de passe API
 *   CINETPAY_BASE_URL     → https://api.cinetpay.net (sandbox), à changer pour l'URL
 *                            de prod une fois le compte passé en production
 *
 * Dashboard CinetPay : https://panel.cinetpay.net
 */
router.post('/cinetpay/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        if (!process.env.CINETPAY_API_KEY || !process.env.CINETPAY_API_PASSWORD) {
            return res.status(503).json({ message: 'Paiement en ligne non configuré. Contactez-nous par WhatsApp.' });
        }

        const token = await getCinetPayToken();

        // CinetPay exige prénom et nom séparés
        const parts     = (order.customer.name || 'Client MIA').trim().split(' ');
        const firstName = parts[0]              || 'Client';
        const lastName  = parts.slice(1).join(' ') || 'MIA';

        const payload = {
            currency:                'XOF',
            merchant_transaction_id: String(order._id),   // unique, max 30 caractères
            amount:                  Math.round(order.total),
            lang:                    'fr',
            designation:             `Commande ${order.order_number} — MIA DREAMS`,
            client_email:            order.customer.email || 'client@miadreams.com',
            client_first_name:       firstName,
            client_last_name:        lastName,
            client_phone_number:     order.customer.phone || '',
            success_url:             `${FRONTEND}/commande/succes/${orderId}`,
            failed_url:              `${FRONTEND}/commande/erreur/${orderId}`,
            notify_url:              `${BACKEND}/api/payment/cinetpay/webhook`,
            direct_pay:              false,
        };

        const response = await fetch(`${CINETPAY_BASE_URL}/v1/payment`, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.status !== 'OK' || !data.payment_url) {
            console.error('CinetPay API error:', data);
            throw new Error(data.message || `Erreur CinetPay (code ${data.code})`);
        }

        // Sauvegarder la référence de transaction
        await Order.findByIdAndUpdate(orderId, {
            payment_ref:    data.transaction_id || String(order._id),
            payment_status: 'pending',
        });

        res.json({ payment_url: data.payment_url });
    } catch (e) {
        console.error('CinetPay init error:', e.message);
        res.status(500).json({ message: e.message });
    }
});

/**
 * POST /api/payment/cinetpay/webhook  (IPN — Instant Payment Notification)
 * CinetPay appelle cette URL après chaque transaction.
 *
 * ⚠️  À configurer dans le Dashboard CinetPay → API & sécurité → Documentation API
 *   → section "Notification de transaction" → IPN URL :
 *     https://mia-dreams.com/api/payment/cinetpay/webhook
 *
 * On vérifie TOUJOURS le statut via l'API (GET /v1/payment/{id}) avant de confirmer
 * — CinetPay le demande explicitement : ne jamais faire confiance au payload brut de l'IPN,
 * un webhook étant par définition appelable par n'importe qui.
 *
 * ⚠️  Le nom exact du champ envoyé par CinetPay dans le corps de l'IPN n'a pas encore
 * été confirmé par un vrai appel — le console.log ci-dessous permet de le vérifier au
 * premier paiement test réel et d'ajuster si besoin.
 */
router.post('/cinetpay/webhook', async (req, res) => {
    // Répondre 200 immédiatement — CinetPay attend une réponse rapide
    res.json({ received: true });
    console.log('CinetPay IPN payload reçu:', req.body);

    try {
        const merchantTransactionId = req.body.merchant_transaction_id || req.body.cpm_trans_id;
        if (!merchantTransactionId) return;

        const token = await getCinetPayToken();
        const verifyRes = await fetch(
            `${CINETPAY_BASE_URL}/v1/payment/${encodeURIComponent(merchantTransactionId)}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const verify = await verifyRes.json();
        const status = verify.status;

        // merchant_transaction_id = notre order._id (voir /cinetpay/init)
        const orderId = verify.merchant_transaction_id;
        if (!orderId) {
            console.warn('CinetPay IPN: merchant_transaction_id absent', verify);
            return;
        }

        if (status === 'SUCCESS') {
            const order = await Order.findByIdAndUpdate(
                orderId,
                { payment_status: 'paid', order_status: 'confirmed', payment_ref: verify.transaction_id || orderId },
                { new: true }
            );
            if (order) {
                console.log(`✅ CinetPay — Paiement confirmé : ${order.order_number}`);
                pushStatusUpdate(order).catch(e => console.error('Push client (CinetPay) error:', e.message));
                notifyStatusUpdate(order).catch(e => console.error('Email client (CinetPay) error:', e.message));
            }
        } else if (status === 'FAILED') {
            const order = await Order.findByIdAndUpdate(orderId, { payment_status: 'failed' }, { new: true });
            console.log(`❌ CinetPay — Paiement échoué : ${merchantTransactionId}`);
            alertAdminPaymentFailed(order, 'CinetPay');
        }
        // INITIATED / PENDING → rien à faire, on attend une notification ultérieure
    } catch (e) {
        console.error('Erreur IPN CinetPay:', e.message);
    }
});

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIRMATION MANUELLE (admin authentifié uniquement)
// ─────────────────────────────────────────────────────────────────────────────

router.patch('/confirm/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { payment_status: 'paid', order_status: 'confirmed' },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        pushStatusUpdate(order).catch(e => console.error('Push client (confirm manuel) error:', e.message));
        notifyStatusUpdate(order).catch(e => console.error('Email client (confirm manuel) error:', e.message));
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
