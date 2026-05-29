const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Initiative = require('../models/Initiative');

// GET /api/impact
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
        const [sections, initiatives] = await Promise.all([
            Section.find({ page: 'impact', is_active: { $ne: false } }).sort('order'),
            Initiative.find({ is_active: true }).sort('order'),
        ]);
        res.json({ sections, initiatives });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
