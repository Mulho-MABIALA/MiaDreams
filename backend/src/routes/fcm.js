/**
 * /api/fcm — Enregistrement des tokens FCM
 */
const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// POST /api/fcm/token — associer un token FCM à une commande
router.post('/token', async (req, res) => {
    try {
        const { orderId, token } = req.body;
        if (!orderId || !token) return res.status(400).json({ message: 'orderId et token requis' });

        // Valider le format du token FCM (entre 100 et 512 caractères)
        if (typeof token !== 'string' || token.length < 100 || token.length > 512)
            return res.status(400).json({ message: 'Token FCM invalide' });

        await Order.findByIdAndUpdate(orderId, { fcm_token: token });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
