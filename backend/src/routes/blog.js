const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/blog
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
        const { category, search, page = 1, limit = 9 } = req.query;
        const query = { is_published: { $ne: false } };

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .sort({ published_at: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const featured = await Post.findOne({ is_published: { $ne: false }, is_featured: true })
            .sort({ published_at: -1 });

        const categories = await Post.distinct('category', { is_published: { $ne: false } });

        res.json({
            featured,
            posts: {
                data: posts,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
            },
            categories: categories.filter(Boolean),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/blog/:slug
router.get('/:slug', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
        const post = await Post.findOne({ slug: req.params.slug, is_published: { $ne: false } });
        if (!post) return res.status(404).json({ message: 'Article introuvable' });

        const related = await Post.find({
            is_published: { $ne: false },
            _id: { $ne: post._id },
            category: post.category,
        }).limit(3).sort({ published_at: -1 });

        res.json({ post, related });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
