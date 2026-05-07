const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'miadreams_secret_2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName     = process.env.ADMIN_NAME || 'Admin';

    if (!email || !password)
        return res.status(400).json({ message: 'Email et mot de passe requis' });

    if (email !== adminEmail)
        return res.status(401).json({ message: 'Identifiants incorrects' });

    const valid = password === adminPassword;
    if (!valid)
        return res.status(401).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign(
        { email: adminEmail, name: adminName, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, user: { email: adminEmail, name: adminName, role: 'admin' } });
});

// GET /api/auth/me  (vérifie le token)
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

module.exports = router;
