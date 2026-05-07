const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/shop — liste des produits actifs
router.get('/', async (req, res) => {
    try {
        const { category, featured, q, limit = 50 } = req.query;
        const filter = { is_active: true };
        if (category) filter.category = category;
        if (featured === '1') filter.is_featured = true;
        if (q) filter.name = { $regex: q, $options: 'i' };
        const products = await Product.find(filter)
            .sort({ is_featured: -1, order: 1, createdAt: -1 })
            .limit(Number(limit));
        res.json(products);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/shop/categories
router.get('/categories', async (req, res) => {
    try {
        const cats = await Product.distinct('category', { is_active: true });
        res.json(cats.filter(Boolean));
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/shop/:slug
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, is_active: true });
        if (!product) return res.status(404).json({ message: 'Produit introuvable' });
        res.json(product);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
