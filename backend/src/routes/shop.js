const express = require('express');
const router = express.Router();
const Product    = require('../models/Product');
const Collection = require('../models/Collection');

// GET /api/shop — liste des produits actifs
router.get('/', async (req, res) => {
    try {
        const { category, collection, featured, q, limit = 200 } = req.query;
        const filter = { is_active: true };
        if (category)   filter.category   = category;
        if (collection) filter.collection = collection;
        if (featured === '1') filter.is_featured = true;
        if (q) filter.name = { $regex: q, $options: 'i' };
        const products = await Product.find(filter)
            .populate('collection', 'name slug _id')
            .sort({ is_featured: -1, order: 1, createdAt: -1 })
            .limit(Number(limit));
        res.json(products);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/shop/collections — collections qui ont au moins un produit actif
router.get('/collections', async (req, res) => {
    try {
        const ids = await Product.distinct('collection', {
            is_active: true,
            collection: { $exists: true, $ne: null },
        });
        const collections = await Collection.find({ _id: { $in: ids } })
            .select('name slug _id')
            .sort('name');
        res.json(collections);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/shop/categories
router.get('/categories', async (req, res) => {
    try {
        const cats = await Product.distinct('category', { is_active: true });
        res.json(cats.filter(Boolean));
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/shop/:slug — produit + articles similaires
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, is_active: true })
            .populate('collection', 'name slug _id');
        if (!product) return res.status(404).json({ message: 'Produit introuvable' });

        const similar = await Product.find({
            is_active: true,
            category:  product.category,
            _id:       { $ne: product._id },
        })
        .sort({ is_featured: -1, order: 1 })
        .limit(4)
        .select('name slug image price compare_price category');

        res.json({ product, similar });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
