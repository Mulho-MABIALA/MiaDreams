const express  = require('express');
const router   = express.Router();
const Contact  = require('../models/Contact');
const { formLimiter } = require('../middleware/rateLimiter');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Nettoie un string : trim + supprime les balises HTML */
const clean = (str, max = 500) =>
    typeof str === 'string'
        ? str.trim().replace(/<[^>]*>/g, '').substring(0, max)
        : '';

// POST /api/contact — formulaire de contact (rate limité)
router.post('/', formLimiter, async (req, res) => {
    try {
        const name    = clean(req.body.name,    100);
        const email   = clean(req.body.email,   254).toLowerCase();
        const phone   = clean(req.body.phone,    30);
        const subject = clean(req.body.subject, 200);
        const message = clean(req.body.message, 2000);

        if (!name || !email || !subject || !message)
            return res.status(422).json({ errors: { message: 'Tous les champs obligatoires doivent être remplis.' } });

        if (!EMAIL_REGEX.test(email))
            return res.status(422).json({ errors: { email: 'Adresse email invalide.' } });

        const contact = await Contact.create({ name, email, phone, subject, message });
        res.status(201).json({
            success: 'Votre message a bien été envoyé. Nous vous répondrons sous 24–48h.',
            contact,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
