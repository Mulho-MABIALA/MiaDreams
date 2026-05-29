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
    // ── Vérification signature HMAC-SHA256 ──
    const waveSig    = req.headers['wave-signature'] || '';
    const webhookKey = process.env.WAVE_WEBHOOK_SECRET;

    if (webhookKey && waveSig) {
        try {
            // Format Wave : "t=<timestamp>,v1=<signature>"
            const parts     = Object.fromEntries(waveSig.split(',').map(p => p.split('=')));
            const timestamp = parts.t;
            const signature = parts.v1;
            // req.rawBody capturé par express.json({ verify }) dans server.js
            const rawBody   = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
            const expected  = crypto
                .createHmac('sha256', webhookKey)
                .update(`${timestamp}.${rawBody}`)
                .digest('hex');

            if (expected !== signature) {
                console.warn('⚠️  Wave webhook signature invalide');
                return res.status(401).json({ message: 'Signature invalide' });
            }
        } catch (e) {
            console.error('Erreur vérification signature Wave:', e.message);
        }
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
            }
        } else if (payment_status === 'failed' || payment_status === 'cancelled') {
            await Order.findByIdAndUpdate(client_reference, { payment_status: 'failed' });
            console.log(`❌ Wave — Paiement ${payment_status} : ${client_reference}`);
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
        const { reference, status, txnid } = req.body;
        console.log('Orange Money webhook reçu:', { reference, status, txnid });

        if (status === 'SUCCESS') {
            const order = await Order.findByIdAndUpdate(
                reference,
                { payment_status: 'paid', order_status: 'confirmed', payment_ref: txnid || reference },
                { new: true }
            );
            if (order) {
                console.log(`✅ Orange Money — Paiement confirmé : ${order.order_number}`);
            }
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            await Order.findByIdAndUpdate(reference, { payment_status: 'failed' });
            console.log(`❌ Orange Money — Paiement ${status} : ${reference}`);
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
        const { reference, status } = req.body;
        if (status === 'SUCCESS') {
            await Order.findByIdAndUpdate(reference, {
                payment_status: 'paid',
                order_status:   'confirmed',
            });
        }
        res.json({ received: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
//  CINETPAY — agrégateur CI (Wave, Orange Money, MTN, Moov, Free Money, Carte)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/payment/cinetpay/init
 * Crée une session de paiement CinetPay et retourne le lien de la page de paiement.
 *
 * Variables d'environnement à ajouter dans Plesk :
 *   CINETPAY_API_KEY  → Dashboard CinetPay → Mon compte → Clés API
 *   CINETPAY_SITE_ID  → Dashboard CinetPay → Mon compte → Site ID
 *
 * Dashboard CinetPay : https://dashboard.cinetpay.com
 */
router.post('/cinetpay/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        if (!process.env.CINETPAY_API_KEY || !process.env.CINETPAY_SITE_ID) {
            return res.status(503).json({ message: 'Paiement en ligne non configuré. Contactez-nous par WhatsApp.' });
        }

        // CinetPay exige prénom et nom séparés
        const parts     = (order.customer.name || 'Client MIA').trim().split(' ');
        const firstName = parts[0]              || 'Client';
        const lastName  = parts.slice(1).join(' ') || 'MIA';

        const payload = {
            apikey:                process.env.CINETPAY_API_KEY,
            site_id:               process.env.CINETPAY_SITE_ID,
            transaction_id:        String(order._id),           // unique, max 50 chars
            amount:                Math.round(order.total),
            currency:              'XOF',
            description:           `Commande ${order.order_number} — MIA DREAMS`,
            notify_url:            `${BACKEND}/api/payment/cinetpay/webhook`,
            return_url:            `${FRONTEND}/commande/succes/${orderId}`,
            cancel_url:            `${FRONTEND}/commande/erreur/${orderId}`,
            customer_name:         lastName,
            customer_surname:      firstName,
            customer_email:        order.customer.email   || 'client@miadreams.com',
            customer_phone_number: order.customer.phone   || '',
            customer_address:      order.customer.address || 'Abidjan',
            customer_city:         order.customer.city    || 'Abidjan',
            customer_country:      'CI',
            customer_state:        'CI',
            customer_zip_code:     '00225',
            channels:              'ALL',   // Wave, OM, MTN, Moov, Free, Carte…
            metadata:              String(orderId),
        };

        const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.code !== '201') {
            console.error('CinetPay API error:', data);
            throw new Error(data.message || `Erreur CinetPay (code ${data.code})`);
        }

        // Sauvegarder la référence de transaction
        await Order.findByIdAndUpdate(orderId, {
            payment_ref:    String(order._id),
            payment_status: 'pending',
        });

        res.json({ payment_url: data.data.payment_url });
    } catch (e) {
        console.error('CinetPay init error:', e.message);
        res.status(500).json({ message: e.message });
    }
});

/**
 * POST /api/payment/cinetpay/webhook  (IPN — Instant Payment Notification)
 * CinetPay appelle cette URL après chaque transaction.
 *
 * ⚠️  À configurer dans le Dashboard CinetPay :
 *   → Mon compte → Paramètres → IPN URL :
 *     https://miadreams.jokkocloud.com/api/payment/cinetpay/webhook
 *
 * On vérifie TOUJOURS le statut via l'API avant de confirmer
 * (ne jamais faire confiance aux données brutes de l'IPN).
 */
router.post('/cinetpay/webhook', async (req, res) => {
    // Répondre 200 immédiatement — CinetPay attend une réponse rapide
    res.json({ received: true });

    try {
        const { cpm_trans_id } = req.body;
        if (!cpm_trans_id) return;

        // Vérification du statut réel via l'API CinetPay
        const verifyRes = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                apikey:         process.env.CINETPAY_API_KEY,
                site_id:        process.env.CINETPAY_SITE_ID,
                transaction_id: cpm_trans_id,
            }),
        });

        const verify  = await verifyRes.json();
        const status  = verify.data?.status;
        const orderId = verify.data?.metadata;

        if (!orderId) {
            console.warn('CinetPay IPN: metadata (orderId) absent', verify);
            return;
        }

        if (verify.code === '00' && status === 'ACCEPTED') {
            const order = await Order.findByIdAndUpdate(
                orderId,
                { payment_status: 'paid', order_status: 'confirmed' },
                { new: true }
            );
            if (order) console.log(`✅ CinetPay — Paiement confirmé : ${order.order_number}`);
        } else if (['REFUSED', 'CANCELLED'].includes(status)) {
            await Order.findByIdAndUpdate(orderId, { payment_status: 'failed' });
            console.log(`❌ CinetPay — Paiement ${status} : ${cpm_trans_id}`);
        }
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
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
