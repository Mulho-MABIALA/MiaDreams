const express = require('express');
const router = express.Router();
const Gallery    = require('../models/Gallery');
const Brand      = require('../models/Brand');
const Collection = require('../models/Collection');
const Product    = require('../models/Product');

// GET /api/gallery
router.get('/', async (req, res) => {
    try {
        const { brand } = req.query;

        // Filtres par brand
        res.set('Cache-Control', 'no-cache');
        const colQuery  = { is_active: { $ne: false }, image: { $exists: true, $ne: '' } };
        const galQuery  = { is_active: { $ne: false } };
        if (brand) { colQuery.brand = brand; galQuery.brand = brand; }

        const [galleryItems, brands, collections, products] = await Promise.all([
            // Galerie manuelle
            Gallery.find(galQuery).sort('order')
                .populate('brand', 'name slug')
                .populate('collection', 'name'),

            // Marques actives pour les filtres
            Brand.find({ is_active: { $ne: false } }).sort('order'),

            // Collections avec image
            Collection.find(colQuery).sort('order')
                .populate('brand', 'name slug _id'),

            // Produits actifs avec image
            Product.find({ is_active: { $ne: false }, image: { $exists: true, $ne: '' } }).sort('order')
                .populate({
                    path: 'collection',
                    populate: { path: 'brand', select: 'name slug _id' },
                }),
        ]);

        // ── Normalisation galerie manuelle ──────────────────────────────
        const normalGallery = galleryItems.map(item => ({
            _id:      item._id,
            image:    item.image,
            caption:  item.caption || item.title || '',
            subtitle: item.brand?.name || '',
            brand:    item.brand || null,
            source:   'gallery',
        }));

        // ── Normalisation collections ────────────────────────────────────
        const normalCollections = collections
            .filter(c => c.image)
            .map(c => ({
                _id:      'col-' + c._id,
                image:    c.image.startsWith('/') ? c.image.replace(/^\/uploads\//, '') : c.image,
                caption:  c.name,
                subtitle: c.brand?.name || '',
                brand:    c.brand || null,
                source:   'collection',
            }));

        // ── Normalisation produits ───────────────────────────────────────
        let normalProducts = products
            .filter(p => p.image)
            .map(p => ({
                _id:      'prod-' + p._id,
                image:    p.image,
                caption:  p.name,
                subtitle: p.collection?.name || p.category || '',
                brand:    p.collection?.brand || null,
                source:   'product',
            }));

        // Filtrage produits par brand (via collection.brand)
        if (brand) {
            normalProducts = normalProducts.filter(p =>
                p.brand && p.brand._id && p.brand._id.toString() === brand
            );
        }

        // ── Fusion : galerie manuelle d'abord, puis collections, puis produits ──
        const items = [...normalGallery, ...normalCollections, ...normalProducts];

        res.json({ items, brands });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
