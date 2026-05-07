const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── WAVE ────────────────────────────────────────────────────────────────────
// POST /api/payment/wave/init
router.post('/wave/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WAVE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: String(Math.round(order.total)),
                currency: 'XOF',
                success_url: `${FRONTEND}/commande/succes/${orderId}`,
                error_url:   `${FRONTEND}/commande/erreur/${orderId}`,
                client_reference: orderId,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erreur Wave API');

        await Order.findByIdAndUpdate(orderId, {
            payment_ref: data.id,
            payment_status: 'pending',
        });

        res.json({ checkout_url: data.wave_launch_url });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/payment/wave/webhook
router.post('/wave/webhook', async (req, res) => {
    try {
        const { client_reference, payment_status } = req.body;
        if (payment_status === 'succeeded') {
            await Order.findByIdAndUpdate(client_reference, {
                payment_status: 'paid',
                order_status: 'confirmed',
            });
        } else if (payment_status === 'failed') {
            await Order.findByIdAndUpdate(client_reference, { payment_status: 'failed' });
        }
        res.json({ received: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── ORANGE MONEY ────────────────────────────────────────────────────────────
// POST /api/payment/orange-money/init
router.post('/orange-money/init', async (req, res) => {
    const { orderId, phone } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        if (!process.env.ORANGE_MONEY_MERCHANT_KEY) {
            // Mode demo : marquer comme en attente avec instructions
            await Order.findByIdAndUpdate(orderId, {
                payment_ref: `OM-${Date.now()}`,
                payment_status: 'pending',
            });
            return res.json({
                status: 'instructions',
                message: `Envoyez ${order.total.toLocaleString()} FCFA au numéro marchand Orange Money, puis envoyez votre reçu à contact@miadreams.com avec la référence ${order.order_number}.`,
                order_number: order.order_number,
            });
        }

        // Orange Money API (Côte d'Ivoire / Sénégal)
        const response = await fetch('https://api.orange.com/orange-money-webpay/ci/v1/webpayment', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.ORANGE_MONEY_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchant_key: process.env.ORANGE_MONEY_MERCHANT_KEY,
                currency: 'OUV',
                order_id: order.order_number,
                amount: Math.round(order.total),
                return_url: `${FRONTEND}/commande/succes/${orderId}`,
                cancel_url:  `${FRONTEND}/commande/erreur/${orderId}`,
                notif_url:   `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/orange-money/webhook`,
                lang: 'fr',
                reference: orderId,
            }),
        });

        const data = await response.json();
        if (data.status !== '200') throw new Error(data.message || 'Erreur Orange Money');

        await Order.findByIdAndUpdate(orderId, {
            payment_ref: data.pay_token,
            payment_status: 'pending',
        });

        res.json({ checkout_url: data.payment_url });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/payment/orange-money/webhook
router.post('/orange-money/webhook', async (req, res) => {
    try {
        const { reference, status } = req.body;
        if (status === 'SUCCESS') {
            await Order.findByIdAndUpdate(reference, {
                payment_status: 'paid',
                order_status: 'confirmed',
            });
        }
        res.json({ received: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── FREE MONEY ──────────────────────────────────────────────────────────────
// POST /api/payment/free-money/init
router.post('/free-money/init', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        if (!process.env.FREE_MONEY_API_KEY) {
            await Order.findByIdAndUpdate(orderId, {
                payment_ref: `FM-${Date.now()}`,
                payment_status: 'pending',
            });
            return res.json({
                status: 'instructions',
                message: `Envoyez ${order.total.toLocaleString()} FCFA via Free Money, puis envoyez votre reçu à contact@miadreams.com avec la référence ${order.order_number}.`,
                order_number: order.order_number,
            });
        }

        // Free Money API (à configurer selon documentation officielle)
        res.json({
            status: 'instructions',
            message: `Composez *555# sur votre téléphone Free, sélectionnez "Paiement marchand" et entrez le code ${order.order_number} pour un montant de ${order.total.toLocaleString()} FCFA.`,
            order_number: order.order_number,
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/payment/free-money/webhook
router.post('/free-money/webhook', async (req, res) => {
    try {
        const { reference, status } = req.body;
        if (status === 'SUCCESS') {
            await Order.findByIdAndUpdate(reference, {
                payment_status: 'paid',
                order_status: 'confirmed',
            });
        }
        res.json({ received: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── CONFIRM MANUEL (admin) ───────────────────────────────────────────────────
// PATCH /api/payment/confirm/:orderId
router.patch('/confirm/:orderId', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, {
            payment_status: 'paid',
            order_status: 'confirmed',
        }, { new: true });
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
