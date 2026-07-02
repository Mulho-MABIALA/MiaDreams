const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// GET /api/partners — partenaires actifs (public)
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache');
        const partners = await Partner.find({ is_active: { $ne: false } }).sort('order');
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
