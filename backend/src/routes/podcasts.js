const express = require('express');
const router = express.Router();
const Podcast = require('../models/Podcast');

// GET /api/podcasts
router.get('/', async (req, res) => {
    try {
        const podcasts = await Podcast.find({})
            .sort({ episode_number: -1, createdAt: -1 });
        const latest = podcasts[0] || null;
        res.json({ podcasts, latestPodcast: latest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
