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

// GET /api/fcm/status — diagnostic Firebase (temporaire)
router.get('/status', async (req, res) => {
    const fs   = require('fs');
    const path = require('path');

    const envPath    = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    // Tous les chemins à tester
    const candidatePaths = [
        envPath,
        path.join(__dirname, '../../../firebase-adminsdk.json'),   // httpdocs/
        path.join(__dirname, '../../firebase-adminsdk.json'),       // backend/
        '/var/www/vhosts/mia-dreams.com/httpdocs/backend/firebase-adminsdk.json',
        '/var/www/vhosts/mia-dreams.com/httpdocs/firebase-adminsdk.json',
        '/httpdocs/backend/firebase-adminsdk.json',
        '/httpdocs/firebase-adminsdk.json',
    ].filter(Boolean);

    const pathResults = candidatePaths.map(p => ({ path: p, exists: fs.existsSync(p) }));
    const foundPath   = pathResults.find(r => r.exists);

    const info = {
        FIREBASE_SERVICE_ACCOUNT_PATH: envPath || null,
        FIREBASE_SERVICE_ACCOUNT: inlineJson ? '(présent, ' + inlineJson.length + ' chars)' : null,
        pathsTested: pathResults,
        foundAt: foundPath ? foundPath.path : null,
        firebaseInitialized: false,
        error: null,
    };

    try {
        const { getInitStatus } = require('../utils/fcm');
        const status = getInitStatus();
        info.firebaseInitialized = status.initialized;
        info.firebaseAppsCount   = status.appsCount;
        info.firebaseInitError   = status.error;
    } catch(e) {
        info.error = e.message;
    }

    const admins = await Admin.find({ is_active: true }).select('name email fcm_tokens');
    info.admins = admins.map(a => ({
        name: a.name,
        email: a.email,
        fcmTokensCount: (a.fcm_tokens || []).length,
    }));

    res.json(info);
});

module.exports = router;
