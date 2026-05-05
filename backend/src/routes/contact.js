const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(422).json({ errors: { message: 'Tous les champs obligatoires doivent être remplis.' } });
        }

        const contact = await Contact.create({ name, email, phone, subject, message });
        res.status(201).json({ success: 'Votre message a bien été envoyé. Nous vous répondrons sous 24–48h.', contact });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
