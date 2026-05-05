const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const Collection = require('../models/Collection');
const Product = require('../models/Product');

// GET /api/brands
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find({ is_active: true }).sort('order');
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/brands/:slug — brand + collections + products
router.get('/:slug', async (req, res) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug, is_active: true });
        if (!brand) return res.status(404).json({ message: 'Marque introuvable' });

        const collections = await Collection.find({ brand: brand._id }).sort('order');
        const collectionIds = collections.map(c => c._id);
        const products = await Product.find({
            collection: { $in: collectionIds },
            is_active: true,
        }).sort('order');

        // Attacher les produits à chaque collection
        const collectionsWithProducts = collections.map(col => ({
            ...col.toObject(),
            products: products.filter(p => p.collection.toString() === col._id.toString()),
        }));

        res.json({ brand, collections: collectionsWithProducts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
