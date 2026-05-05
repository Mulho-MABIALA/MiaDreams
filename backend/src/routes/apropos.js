const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// GET /api/apropos
router.get('/', async (req, res) => {
    try {
        const teamMembers = await TeamMember.find({ is_active: true }).sort('order');
        res.json({ teamMembers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
