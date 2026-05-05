const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');

// GET /api/home
router.get('/', async (req, res) => {
    try {
        const [services, testimonials] = await Promise.all([
            Service.find({ is_active: true }).sort('order'),
            Testimonial.find({ is_active: true }).sort('order'),
        ]);
        res.json({ services, testimonials });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
