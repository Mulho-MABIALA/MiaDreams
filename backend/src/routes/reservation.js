const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

const SERVICES = [
    'Coaching',
    'Personal Branding',
    'Fashion Program',
    'Confection',
    'Consulting',
    'Autre',
];

// GET /api/reservation/services
router.get('/services', (req, res) => {
    res.json(SERVICES);
});

// POST /api/reservation
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, service, preferred_date, preferred_time, message } = req.body;
        if (!name || !email || !service) {
            return res.status(422).json({ errors: { message: 'Champs obligatoires manquants.' } });
        }

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
