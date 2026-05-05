const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ is_active: true }).sort('order');
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/testimonials
router.post('/', async (req, res) => {
    try {
        const { name, role, company, rating, content } = req.body;
        if (!name || !content || !rating) {
            return res.status(422).json({ errors: { message: 'Nom, note et témoignage sont obligatoires.' } });
        }

        await Testimonial.create({ name, role, company, rating: parseInt(rating), content, is_active: false });
        res.status(201).json({ success: 'Merci ! Votre témoignage a été soumis. Il sera publié après validation.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
