const express = require('express');
const router = express.Router();
const Programme = require('../models/Programme');
const Inscription = require('../models/Inscription');

// GET /api/programmes — liste des programmes actifs
router.get('/', async (req, res) => {
    try {
        const programmes = await Programme.find({ is_active: true }).sort({ order: 1, createdAt: 1 });
        res.json({ programmes });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// GET /api/programmes/:slug
router.get('/:slug', async (req, res) => {
    try {
        const programme = await Programme.findOne({ slug: req.params.slug, is_active: true });
        if (!programme) return res.status(404).json({ message: 'Programme introuvable' });
        const inscriptions_count = await Inscription.countDocuments({ programme: programme._id });
        res.json({ programme, inscriptions_count });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/programmes/:slug/inscriptions — soumettre une inscription
router.post('/:slug/inscriptions', async (req, res) => {
    try {
        const programme = await Programme.findOne({ slug: req.params.slug, is_active: true });
        if (!programme) return res.status(404).json({ message: 'Programme introuvable' });
        if (!programme.is_open) return res.status(400).json({ message: 'Les inscriptions sont fermées pour ce programme.' });

        const { nom, email, telephone, message } = req.body;
        if (!nom || !email) return res.status(400).json({ message: 'Nom et email requis.' });

        if (programme.max_places > 0) {
            const count = await Inscription.countDocuments({ programme: programme._id });
            if (count >= programme.max_places) {
                return res.status(400).json({ message: 'Toutes les places sont prises pour ce programme.' });
            }
        }

        const inscription = await Inscription.create({ programme: programme._id, nom, email, telephone, message });
        res.status(201).json({ message: 'Inscription enregistrée avec succès.', inscription });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
