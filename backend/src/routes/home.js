const express = require('express');
const router = express.Router();
const Service     = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Section     = require('../models/Section');
const Product     = require('../models/Product');

// GET /api/home — données de base (services + témoignages)
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
        const [services, testimonials] = await Promise.all([
            Service.find({ is_active: true }).sort('order'),
            Testimonial.find({ is_active: true }).sort('order'),
        ]);
        res.json({ services, testimonials });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/home/full — toutes les sections en un seul appel (perf)
router.get('/full', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache');   // contenu modifié par admin → toujours frais
        const sectionFilter = { page: 'home', is_active: { $ne: false } };

        const [
            services, testimonials,
            heroSlides, univers, introArr, taglineArr,
            personalBrandingArr, ethicalFashionArr, blogBannerArr,
            featured,
        ] = await Promise.all([
            Service.find({ is_active: true }).sort('order'),
            Testimonial.find({ is_active: true }).sort('order'),
            Section.find({ ...sectionFilter, type: 'hero_slide' }).sort({ order: 1 }),
            Section.find({ ...sectionFilter, type: 'univers' }).sort({ order: 1 }),
            Section.find({ ...sectionFilter, type: 'intro' }).limit(1),
            Section.find({ ...sectionFilter, type: 'tagline' }).limit(1),
            Section.find({ ...sectionFilter, type: 'personal_branding' }).limit(1),
            Section.find({ ...sectionFilter, type: 'ethical_fashion' }).limit(1),
            Section.find({ ...sectionFilter, type: 'blog_banner' }).limit(1),
            Product.findOne({ is_active: { $ne: false }, is_featured: true }).sort({ order: 1 }),
        ]);

        res.json({
            services,
            testimonials,
            heroSlides,
            univers,
            intro:           introArr[0]         || null,
            tagline:         taglineArr[0]        || null,
            personalBranding: personalBrandingArr[0] || null,
            ethicalFashion:  ethicalFashionArr[0] || null,
            blogBanner:      blogBannerArr[0]     || null,
            featured,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
