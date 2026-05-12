const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'miadreams_secret_2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email et mot de passe requis' });

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin)
            return res.status(401).json({ message: 'Identifiants incorrects' });

        const valid = await admin.checkPassword(password);
        if (!valid)
            return res.status(401).json({ message: 'Identifiants incorrects' });

        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { email: admin.email, name: admin.name, role: 'admin' } });
    } catch (err) {
        console.error('Erreur login :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, JWT_SECRET);
        res.json({ user });
    } catch {
        res.status(401).json({ message: 'Token invalide' });
    }
});

// PUT /api/auth/profile  (authentifié) — mise à jour nom + email
router.put('/profile', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Non autorisé' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

        const { name, email } = req.body;
        if (name)  admin.name  = name.trim();
        if (email) admin.email = email.toLowerCase().trim();

        await admin.save();
        res.json({ message: 'Profil mis à jour', user: { name: admin.name, email: admin.email } });
    } catch (err) {
        console.error('Erreur profil :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// POST /api/auth/change-password  (authentifié)
router.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Non autorisé' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
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
