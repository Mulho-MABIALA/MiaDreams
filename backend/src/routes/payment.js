/**
 * payment.js — Routes de paiement MIA DREAMS
 * ─────────────────────────────────────────────
 * CinetPay      : agrégateur principal CI (Wave, Orange Money, MTN, Moov, Carte) — redirection
 * Kkiapay       : conservé en secours (widget), non utilisé par le frontend
 * Wave CI       : api.wave.com (checkout sessions + webhook HMAC) — scaffolding inactif
 * Orange Money CI : api.orange.com (WebPay CI + webhook) — scaffolding inactif
 * Confirmation manuelle : admin
 */

const express = require('express');
const crypto  = require('crypto');
const router  = express.Router();
const Order   = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { pushStatusUpdate, notifyStatusUpdate, pushAdminNotify } = require('../utils/notify');
const { getKkiapayClient } = require('../utils/kkiapay');
const { confirmInscriptionPayment, finalizeInscriptionPayment, markInscriptionPaymentFailed } = require('../utils/inscriptionPayment');
const Inscription = require('../models/Inscription');
const {
    isCinetpayConfigured, buildMerchantTransactionId, parseMerchantTransactionId,
    initPayment, getPaymentStatus, resolveSiteUrl, returnUrls,
} = require('../utils/cinetpay');

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
//  KKIAPAY — agrégateur CI (Wave, Orange Money, MTN, Moov, Carte bancaire)
//  Le paiement est initié CÔTÉ FRONTEND via le widget kkiapay-react (pas d'appel
//  "init" ici) : le client paie dans le widget, reçoit un transactionId, que le
//  frontend envoie ensuite à /kkiapay/verify pour confirmation côté serveur.
//  Doc : https://docs.kkiapay.me
// ─────────────────────────────────────────────────────────────────────────────

// getKkiapayClient() est désormais dans utils/kkiapay.js (partagé avec les
// paiements d'inscriptions aux formations — voir utils/inscriptionPayment.js).

/**
 * POST /api/payment/kkiapay/verify
 * Appelé par le frontend juste après que le widget Kkiapay a renvoyé un
 * transactionId (événement "success"). On ne fait JAMAIS confiance à ce que le
 * navigateur affirme : on revérifie la transaction auprès de Kkiapay, et on
 * contrôle que le montant payé correspond bien au total de la commande, avant
 * de marquer la commande comme payée.
 *
 * Variables d'environnement à configurer (Dashboard Kkiapay → Clés API) :
 *   KKIAPAY_PUBLIC_KEY  → clé publique (utilisée aussi côté frontend, VITE_KKIAPAY_PUBLIC_KEY)
 *   KKIAPAY_PRIVATE_KEY → clé privée
 *   KKIAPAY_SECRET_KEY  → clé secrète
 */
router.post('/kkiapay/verify', async (req, res) => {
    const { orderId, transactionId } = req.body;
    try {
        if (!orderId || !transactionId) {
            return res.status(400).json({ message: 'orderId et transactionId requis' });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        let client;
        try {
            client = getKkiapayClient();
        } catch (e) {
            return res.status(503).json({ message: 'Paiement en ligne non configuré. Contactez-nous par WhatsApp.' });
        }

        const verified = await client.verify(transactionId);

        if (verified.status !== 'SUCCESS') {
            await Order.findByIdAndUpdate(orderId, { payment_status: 'failed' });
            console.log(`❌ Kkiapay — Paiement non confirmé (${verified.status}) : ${order.order_number}`);
            alertAdminPaymentFailed(order, 'Kkiapay');
            return res.status(400).json({ message: `Paiement non confirmé (statut : ${verified.status})` });
        }

        // Sécurité anti-fraude : le montant réellement payé doit correspondre au
        // total de la commande (marge de 1 FCFA pour les arrondis).
        if (Math.abs(Math.round(verified.amount) - Math.round(order.total)) > 1) {
            console.warn(`⚠️  Kkiapay — montant payé (${verified.amount}) ≠ total commande (${order.total}) pour ${order.order_number}`);
            return res.status(400).json({ message: 'Le montant payé ne correspond pas au total de la commande.' });
        }

        const updated = await Order.findByIdAndUpdate(
            orderId,
            {
                payment_status: 'paid',
                order_status:   'confirmed',
                payment_ref:    transactionId,
                payment_method: 'kkiapay',
            },
            { new: true }
        );

        console.log(`✅ Kkiapay — Paiement confirmé : ${updated.order_number}`);
        pushStatusUpdate(updated).catch(e => console.error('Push client (Kkiapay) error:', e.message));
        notifyStatusUpdate(updated).catch(e => console.error('Email client (Kkiapay) error:', e.message));

        res.json({ success: true, order: updated });
    } catch (e) {
        console.error('Kkiapay verify error:', e.message);
        res.status(500).json({ message: e.message });
    }
});

/**
 * POST /api/payment/kkiapay/webhook
 * Filet de sécurité : Kkiapay notifie aussi directement le serveur (utile si le
 * client ferme l'onglet avant que le frontend n'appelle /verify). On vérifie la
 * signature envoyée dans l'en-tête x-kkiapay-secret, PUIS on revérifie quand même
 * la transaction via l'API (jamais confiance au payload brut d'un webhook).
 *
 * À configurer dans le Dashboard Kkiapay → Clés API → onglet Webhook :
 *   URL de notification : https://mia-dreams.com/api/payment/kkiapay/webhook
 *   Secret hash          → à recopier dans KKIAPAY_WEBHOOK_SECRET
 */
router.post('/kkiapay/webhook', async (req, res) => {
    // Répondre 2xx immédiatement — Kkiapay réessaie 5 fois sinon
    res.json({ received: true });

    try {
        const expectedSecret = process.env.KKIAPAY_WEBHOOK_SECRET;
        const receivedSecret = req.headers['x-kkiapay-secret'];
        if (!expectedSecret || receivedSecret !== expectedSecret) {
            console.warn('⚠️  Kkiapay webhook : x-kkiapay-secret invalide ou absent');
            return;
        }

        const { transactionId, isPaymentSucces, data } = req.body;
        if (!transactionId) return;

        // `data` est la donnée passée au widget côté frontend (voir openKkiapayWidget) —
        // Kkiapay peut la renvoyer en objet ou en chaîne JSON selon le canal, on gère les deux.
        let parsedData = data;
        if (typeof data === 'string') {
            try { parsedData = JSON.parse(data); } catch { parsedData = { orderId: data }; } // ancien format brut
        }
        parsedData = parsedData || {};

        // Inscription à une formation payante — voir Programmes/Detail.jsx (data: { type:'inscription', id }).
        if (parsedData.type === 'inscription' && parsedData.id) {
            const result = await confirmInscriptionPayment(parsedData.id, transactionId);
            if (result.ok) {
                console.log(`✅ Kkiapay (webhook) — Paiement inscription confirmé : ${parsedData.id}`);
            } else if (!isPaymentSucces) {
                console.log(`❌ Kkiapay (webhook) — Paiement inscription échoué : ${parsedData.id} (${result.message})`);
            }
            return;
        }

        // Sinon : paiement d'une commande boutique (voir Commande.jsx : data: { orderId }).
        const orderId = parsedData.orderId || null;
        if (!orderId) {
            console.warn('Kkiapay webhook : ni orderId ni inscription introuvable dans data', req.body);
            return;
        }

        const client = getKkiapayClient();
        const verified = await client.verify(transactionId);

        if (verified.status === 'SUCCESS') {
            const order = await Order.findByIdAndUpdate(
                orderId,
                { payment_status: 'paid', order_status: 'confirmed', payment_ref: transactionId, payment_method: 'kkiapay' },
                { new: true }
            );
            if (order) {
                console.log(`✅ Kkiapay (webhook) — Paiement confirmé : ${order.order_number}`);
                pushStatusUpdate(order).catch(e => console.error('Push client (Kkiapay) error:', e.message));
                notifyStatusUpdate(order).catch(e => console.error('Email client (Kkiapay) error:', e.message));
            }
        } else if (!isPaymentSucces) {
            const order = await Order.findByIdAndUpdate(orderId, { payment_status: 'failed' }, { new: true });
            console.log(`❌ Kkiapay (webhook) — Paiement échoué : ${transactionId}`);
            alertAdminPaymentFailed(order, 'Kkiapay');
        }
    } catch (e) {
        console.error('Erreur webhook Kkiapay:', e.message);
    }
});

// ─────────────────────────────────────────────────────────────────────────────
//  CINETPAY — agrégateur principal CI (Wave, Orange Money, MTN, Moov, Carte)
//  Flux par redirection : init (serveur) → page CinetPay → /paiement/retour →
//  /cinetpay/verify (serveur). Notification (notify_url) en filet de sécurité.
//  Sert à la fois les commandes boutique et les inscriptions aux formations
//  payantes (voir routes/programmes.js) : le type et l'id sont encodés dans le
//  merchant_transaction_id fixé par NOTRE serveur à l'init.
//  Règle CinetPay : on ne se fie qu'au statut relu via GET /v1/payment/{id}.
// ─────────────────────────────────────────────────────────────────────────────

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const CINETPAY_PENDING = ['INITIATED', 'PENDING', 'WAITING', 'PROCESSING'];

/** Montant payé si CinetPay le renvoie dans le statut, sinon null. */
function amountFromStatus(tx) {
    const a = Number(tx?.amount);
    return Number.isFinite(a) && a > 0 ? Math.round(a) : null;
}

/** Confirme une commande payée via CinetPay (idempotent). */
async function confirmOrderFromCinetpay(orderId, mtid, tx) {
    const order = await Order.findById(orderId);
    if (!order) return { ok: false, message: 'Commande introuvable' };
    if (order.payment_status === 'paid') return { ok: true, order, alreadyPaid: true };

    // Le montant a été fixé par notre serveur à l'init ; on le recontrôle si CinetPay le renvoie.
    const paid = amountFromStatus(tx);
    if (paid !== null && Math.abs(paid - Math.round(order.total)) > 1) {
        console.warn(`⚠️  CinetPay — montant payé (${paid}) ≠ total commande (${order.total}) pour ${order.order_number}`);
        return { ok: false, message: 'Le montant payé ne correspond pas au total de la commande.' };
    }

    // Mise à jour conditionnelle : un seul des deux appels (retour client / notification) notifie.
    const updated = await Order.findOneAndUpdate(
        { _id: order._id, payment_status: { $ne: 'paid' } },
        { payment_status: 'paid', order_status: 'confirmed', payment_ref: mtid, payment_method: 'cinetpay' },
        { new: true }
    );
    if (!updated) return { ok: true, order: await Order.findById(order._id), alreadyPaid: true };

    console.log(`✅ CinetPay — Paiement confirmé : ${updated.order_number}`);
    pushStatusUpdate(updated).catch(e => console.error('Push client (CinetPay) error:', e.message));
    notifyStatusUpdate(updated).catch(e => console.error('Email client (CinetPay) error:', e.message));
    return { ok: true, order: updated };
}

/**
 * Relit le statut d'une transaction CinetPay et met à jour la commande / l'inscription.
 * @returns {{ ok, status, type, id, slug?, message? }}
 */
async function processCinetpayTransaction(mtid) {
    const ref = parseMerchantTransactionId(mtid);
    if (!ref) return { ok: false, message: 'Transaction inconnue.' };

    const tx = await getPaymentStatus(mtid);
    const status = String(tx.status || '').toUpperCase();
    const base = { type: ref.type, id: ref.id, status };

    if (ref.type === 'inscription') {
        const insc = await Inscription.findById(ref.id).populate('programme', 'slug');
        base.slug = insc?.programme?.slug;
    }

    if (status !== 'SUCCESS') {
        if (status === 'FAILED') {
            if (ref.type === 'inscription') {
                await markInscriptionPaymentFailed(ref.id);
            } else {
                const order = await Order.findOneAndUpdate(
                    { _id: ref.id, payment_status: 'pending' }, { payment_status: 'failed' }, { new: true }
                );
                alertAdminPaymentFailed(order, 'CinetPay');
            }
            return { ...base, ok: false, message: 'Le paiement a échoué ou a été annulé. Vous pouvez réessayer.' };
        }
        // INITIATED / PENDING : le mobile money peut encore aboutir (validation sur le téléphone).
        return { ...base, ok: false, message: 'Paiement pas encore confirmé. Si vous avez validé sur votre téléphone, la confirmation arrive dans un instant.' };
    }

    if (ref.type === 'inscription') {
        const r = await finalizeInscriptionPayment(ref.id, {
            provider:  'cinetpay',
            reference: mtid,
            amount:    amountFromStatus(tx),
        });
        return { ...base, ok: r.ok, message: r.message };
    }

    const r = await confirmOrderFromCinetpay(ref.id, mtid, tx);
    return { ...base, ok: r.ok, message: r.message };
}

/**
 * POST /api/payment/cinetpay/init  { orderId }
 * Crée le paiement CinetPay pour une commande boutique et renvoie l'URL de paiement.
 * Le montant vient TOUJOURS de la commande en base, jamais du navigateur.
 */
router.post('/cinetpay/init', paymentLimiter, async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!OBJECT_ID_RE.test(String(orderId || ''))) return res.status(400).json({ message: 'Commande invalide' });

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        if (order.payment_status === 'paid') return res.status(400).json({ message: 'Cette commande est déjà payée.' });
        if (!order.customer?.email) return res.status(400).json({ message: 'Un email est requis pour le paiement en ligne.' });

        if (!isCinetpayConfigured()) {
            return res.status(503).json({ message: 'Le paiement en ligne n\'est pas encore configuré. Contactez-nous par WhatsApp.' });
        }

        const mtid = buildMerchantTransactionId('order', String(order._id));
        const tx = await initPayment({
            merchantTransactionId: mtid,
            amountXof:   order.total,
            designation: `Commande ${order.order_number}`,
            customer:    order.customer,
            ...returnUrls(resolveSiteUrl(req), mtid),
        });

        await Order.findByIdAndUpdate(order._id, { payment_ref: mtid, payment_status: 'pending' });
        res.json({ payment_url: tx.payment_url, reference: mtid });
    } catch (e) {
        console.error('CinetPay init (commande) error:', e.message, e.cinetpay ? JSON.stringify(e.cinetpay) : '');
        // detail = message renvoyé par CinetPay (aucun secret) — utile pour le diagnostic.
        res.status(502).json({
            message: 'Impossible de démarrer le paiement. Réessayez dans un instant.',
            detail:  e.cinetpay?.description || e.cinetpay?.message || e.message,
            code:    e.cinetpay?.code,
        });
    }
});

/**
 * POST /api/payment/cinetpay/verify  { reference }
 * Appelé par la page /paiement/retour. Relit le statut auprès de CinetPay.
 */
router.post('/cinetpay/verify', paymentLimiter, async (req, res) => {
    try {
        const { reference } = req.body;
        if (!isCinetpayConfigured()) {
            return res.status(503).json({ message: 'Le paiement en ligne n\'est pas configuré.' });
        }
        const result = await processCinetpayTransaction(reference);
        const payload = { ok: result.ok, status: result.status, type: result.type, id: result.id, slug: result.slug, message: result.message };
        if (result.ok) return res.json(payload);
        // En attente (mobile money pas encore validé) → 202, sinon 400
        return res.status(CINETPAY_PENDING.includes(result.status) ? 202 : 400).json(payload);
    } catch (e) {
        console.error('CinetPay verify error:', e.message, e.cinetpay ? JSON.stringify(e.cinetpay) : '');
        res.status(400).json({ ok: false, message: 'Impossible de vérifier ce paiement. Contactez-nous par WhatsApp avec votre référence.' });
    }
});

/**
 * POST /api/payment/cinetpay/notify
 * Notification CinetPay (statut final SUCCESS / FAILED). Le contenu n'est qu'un
 * signal : on relit toujours le statut via l'API avant d'agir.
 * URL envoyée à chaque paiement (notify_url) : https://mia-dreams.com/api/payment/cinetpay/notify
 */
router.post('/cinetpay/notify', async (req, res) => {
    // Répondre 200 tout de suite (CinetPay exige < 10 s, sinon il réessaie).
    res.sendStatus(200);

    try {
        const mtid = req.body?.merchant_transaction_id;
        if (!parseMerchantTransactionId(mtid)) {
            console.warn('CinetPay notify : merchant_transaction_id inconnu', mtid);
            return;
        }
        const result = await processCinetpayTransaction(mtid);
        console.log(`CinetPay notify ${mtid} → ${result.ok ? 'confirmé' : result.message}`);
    } catch (e) {
        console.error('Erreur notification CinetPay:', e.message);
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
