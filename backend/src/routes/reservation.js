const express      = require('express');
const router       = express.Router();
const Reservation  = require('../models/Reservation');
const { formLimiter } = require('../middleware/rateLimiter');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (str, max = 500) =>
    typeof str === 'string' ? str.trim().replace(/<[^>]*>/g, '').substring(0, max) : '';

const SERVICES = [
    'Coaching', 'Personal Branding', 'Fashion Program',
    'Confection', 'Consulting', 'Autre',
];

// GET /api/reservation/services
router.get('/services', (req, res) => res.json(SERVICES));

// POST /api/reservation — rate limitée
router.post('/', formLimiter, async (req, res) => {
    try {
        const name           = clean(req.body.name, 100);
        const email          = clean(req.body.email, 254).toLowerCase();
        const phone          = clean(req.body.phone, 30);
        const service        = clean(req.body.service, 100);
        const preferred_time = clean(req.body.preferred_time, 50);
        const message        = clean(req.body.message, 1000);
        const preferred_date = req.body.preferred_date;

        if (!name || !email || !service)
            return res.status(422).json({ errors: { message: 'Champs obligatoires manquants.' } });
        if (!EMAIL_REGEX.test(email))
            return res.status(422).json({ errors: { email: 'Adresse email invalide.' } });
        if (!SERVICES.includes(service))
            return res.status(422).json({ errors: { service: 'Service non reconnu.' } });

        const reservation = await Reservation.create({
            name, email, phone, service,
            preferred_date: preferred_date ? new Date(preferred_date) : undefined,
            preferred_time,
            message,
        });

        res.status(201).json({
            success: 'Votre demande a bien été enregistrée. Nous vous contacterons pour confirmer.',
            reservation,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
