/**
 * /api/push — Web Push natif (VAPID) — abonnements & envoi
 * Remplace routes/fcm.js (Firebase Cloud Messaging)
 */
const express        = require('express');
const router         = express.Router();
const Order          = require('../models/Order');
const Admin          = require('../models/Admin');
const authMiddleware = require('../middleware/auth');
const { getPublicKey, getInitStatus, sendMulticastPush } = require('../utils/webpush');

function validSubscription(s) {
    return !!s
        && typeof s.endpoint === 'string' && s.endpoint.startsWith('http')
        && s.keys && typeof s.keys.p256dh === 'string' && typeof s.keys.auth === 'string';
}

// GET /api/push/vapid-public-key — clé publique VAPID nécessaire au frontend pour s'abonner
router.get('/vapid-public-key', (req, res) => {
    const key = getPublicKey();
    if (!key) return res.status(503).json({ message: 'Web Push non configuré côté serveur' });
    res.json({ publicKey: key });
});

// POST /api/push/subscribe — associer un abonnement push à une commande (client)
router.post('/subscribe', async (req, res) => {
    try {
        const { orderId, subscription } = req.body;
        if (!orderId || !validSubscription(subscription)) {
            return res.status(400).json({ message: 'orderId et subscription valides requis' });
        }
        await Order.findByIdAndUpdate(orderId, { push_subscription: subscription });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/push/admin-subscribe — enregistrer l'abonnement push d'un admin (protégé JWT)
router.post('/admin-subscribe', authMiddleware, async (req, res) => {
    try {
        const { subscription } = req.body;
        if (!validSubscription(subscription)) {
            return res.status(400).json({ message: 'subscription invalide' });
        }
        const adminId = req.user?.id || req.user?._id;
        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

        // Évite les doublons (même endpoint) — remplace si déjà présent
        admin.push_subscriptions = (admin.push_subscriptions || [])
            .filter(s => s.endpoint !== subscription.endpoint);
        admin.push_subscriptions.push(subscription);
        await admin.save();

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/push/admin-unsubscribe — retirer un abonnement admin
router.post('/admin-unsubscribe', authMiddleware, async (req, res) => {
    try {
        const { endpoint } = req.body;
        if (!endpoint) return res.status(400).json({ message: 'endpoint requis' });
        const adminId = req.user?.id || req.user?._id;
        await Admin.findByIdAndUpdate(adminId, { $pull: { push_subscriptions: { endpoint } } });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// GET /api/push/status — diagnostic Web Push (temporaire)
router.get('/status', async (req, res) => {
    try {
        const status = getInitStatus();
        const admins = await Admin.find({ is_active: true }).select('name email push_subscriptions');
        res.json({
            ...status,
            admins: admins.map(a => ({
                name: a.name,
                email: a.email,
                subscriptionsCount: (a.push_subscriptions || []).length,
            })),
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/push/test — envoie un push test à tous les admins
router.post('/test', async (req, res) => {
    try {
        const admins = await Admin.find({ is_active: true, push_subscriptions: { $exists: true, $not: { $size: 0 } } })
            .select('push_subscriptions');
        const subs = admins.flatMap(a => a.push_subscriptions || []);
        if (!subs.length) return res.json({ ok: false, message: 'Aucun abonnement admin enregistré' });

        const goneEndpoints = await sendMulticastPush(subs, {
            title: '🔔 Test notification MIA DREAMS',
            body:  'Si vous voyez ceci, les notifications fonctionnent !',
            data:  { url: '/admin' },
        });

        if (goneEndpoints.length) {
            await Admin.updateMany({}, { $pull: { push_subscriptions: { endpoint: { $in: goneEndpoints } } } });
        }

        res.json({ ok: true, subscriptionsSent: subs.length, cleaned: goneEndpoints.length });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

module.exports = router;
