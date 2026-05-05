const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// GET /api/search?q=...
router.get('/', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (q.length < 2) {
            return res.json({ posts: [], brands: [], products: [], query: q });
        }

        const regex = { $regex: q, $options: 'i' };

        const [posts, brands, products] = await Promise.all([
            Post.find({ is_published: true, $or: [{ title: regex }, { excerpt: regex }] }).limit(6),
            Brand.find({ is_active: true, $or: [{ name: regex }, { description: regex }] }).limit(4),
            Product.find({ is_active: true, $or: [{ name: regex }, { description: regex }] }).limit(6),
        ]);

        res.json({ posts, brands, products, query: q });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
