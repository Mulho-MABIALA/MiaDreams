const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const Brand = require('../models/Brand');
const Collection = require('../models/Collection');

// GET /api/gallery
router.get('/', async (req, res) => {
    try {
        const { brand, collection } = req.query;
        const query = { is_active: true };
        if (brand) query.brand = brand;
        if (collection) query.collection = collection;

        const [items, brands, collections] = await Promise.all([
            Gallery.find(query).sort('order')
                .populate('brand', 'name slug')
                .populate('collection', 'name'),
            Brand.find({ is_active: true }).sort('order'),
            Collection.find().sort('order'),
        ]);

        res.json({ items, brands, collections });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
