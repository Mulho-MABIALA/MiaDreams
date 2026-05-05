const express = require('express');
const router = express.Router();
const Podcast = require('../models/Podcast');

// GET /api/podcasts
router.get('/', async (req, res) => {
    try {
        const podcasts = await Podcast.find({ is_published: true })
            .sort({ published_at: -1 });
        const latest = podcasts[0] || null;
        res.json({ podcasts, latestPodcast: latest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
