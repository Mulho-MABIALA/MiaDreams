const express  = require('express');
const router   = express.Router();
const Newsletter = require('../models/Newsletter');
const { newsletterLimiter } = require('../middleware/rateLimiter');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// POST /api/newsletter — inscription (rate limitée)
router.post('/', newsletterLimiter, async (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase().trim();

        if (!email)
            return res.status(422).json({ errors: { email: 'Email requis.' } });
        if (!EMAIL_REGEX.test(email))
            return res.status(422).json({ errors: { email: 'Adresse email invalide.' } });
        if (email.length > 254)
            return res.status(422).json({ errors: { email: 'Email trop long.' } });

        const exists = await Newsletter.findOne({ email });
        if (exists)
            return res.status(422).json({ errors: { email: 'Cet email est déjà inscrit.' } });

        await Newsletter.create({ email });
        res.status(201).json({ success: 'Merci ! Vous êtes bien inscrit à notre newsletter.' });
    } catch (err) {
        if (err.code === 11000)
            return res.status(422).json({ errors: { email: 'Cet email est déjà inscrit.' } });
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
