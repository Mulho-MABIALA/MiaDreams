/**
 * /api/fcm — Enregistrement des tokens FCM
 */
const express        = require('express');
const router         = express.Router();
const Order          = require('../models/Order');
const Admin          = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

function validToken(t) {
    return typeof t === 'string' && t.length >= 100 && t.length <= 512;
}

// POST /api/fcm/token — associer un token FCM à une commande (client)
router.post('/token', async (req, res) => {
    try {
        const { orderId, token } = req.body;
        if (!orderId || !token) return res.status(400).json({ message: 'orderId et token requis' });
        if (!validToken(token)) return res.status(400).json({ message: 'Token FCM invalide' });

        await Order.findByIdAndUpdate(orderId, { fcm_token: token });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/fcm/admin-token — enregistrer le token FCM d'un admin (protégé JWT)
router.post('/admin-token', authMiddleware, async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'token requis' });
        if (!validToken(token)) return res.status(400).json({ message: 'Token FCM invalide' });

        const adminId = req.user?.id || req.user?._id;
        // Ajouter le token s'il n'existe pas déjà ($addToSet = pas de doublon)
        await Admin.findByIdAndUpdate(adminId, { $addToSet: { fcm_tokens: token } });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
