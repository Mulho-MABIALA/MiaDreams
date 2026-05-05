const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// POST /api/newsletter
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(422).json({ errors: { email: 'Email requis.' } });

        const exists = await Newsletter.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(422).json({ errors: { email: 'Cet email est déjà inscrit.' } });
        }

        await Newsletter.create({ email });
        res.status(201).json({ success: 'Merci ! Vous êtes bien inscrit à notre newsletter.' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(422).json({ errors: { email: 'Cet email est déjà inscrit.' } });
        }
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
