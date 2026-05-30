const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// GET /api/sections?page=home&type=hero_slide
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache'); // contenu admin → toujours frais
        const filter = { is_active: { $ne: false } };
        if (req.query.page) filter.page = req.query.page;
        if (req.query.type) filter.type  = req.query.type;
        const sections = await Section.find(filter).sort({ order: 1, createdAt: 1 });
        res.json(sections);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
