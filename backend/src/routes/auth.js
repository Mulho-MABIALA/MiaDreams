const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const Admin    = require('../models/Admin');
const authMiddleware = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

const JWT_SECRET = authMiddleware.JWT_SECRET;

// POST /api/auth/login — rate limitée (10 tentatives / 15 min)
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email et mot de passe requis' });

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            // Délai constant pour éviter les timing attacks
            await new Promise(r => setTimeout(r, 300));
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const valid = await admin.checkPassword(password);
        if (!valid) {
            await new Promise(r => setTimeout(r, 300));
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d', algorithm: 'HS256' }
        );

        res.json({ token, user: { email: admin.email, name: admin.name, role: 'admin' } });
    } catch (err) {
        console.error('Erreur login :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /api/auth/me — vérifie le token
router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// PUT /api/auth/profile — authentifié via middleware
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

        const { name, email } = req.body;
        if (name)  admin.name  = name.trim().substring(0, 100);
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            admin.email = email.toLowerCase().trim();
        }

        await admin.save();
        res.json({ message: 'Profil mis à jour', user: { name: admin.name, email: admin.email } });
    } catch (err) {
        console.error('Erreur profil :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// POST /api/auth/change-password — authentifié via middleware
router.post('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
        return res.status(400).json({ message: 'Champs requis manquants' });
    if (newPassword.length < 8)
        return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 8 caractères' });

    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

        const valid = await admin.checkPassword(currentPassword);
        if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

        admin.password = newPassword;
        await admin.save();
        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
