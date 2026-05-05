const express = require('express');
const router = express.Router();
const CompanyInfo = require('../models/CompanyInfo');
const SocialMedia = require('../models/SocialMedia');
const Brand = require('../models/Brand');
const Catalogue = require('../models/Catalogue');

// GET /api/settings — données globales (navbar, footer)
router.get('/', async (req, res) => {
    try {
        const [companyInfo, socialMediaLinks, navBrands, navCatalogues] = await Promise.all([
            CompanyInfo.findOne(),
            SocialMedia.find({ is_active: true }).sort('order'),
            Brand.find({ is_active: true }).sort('order'),
            Catalogue.find({ is_active: true }).sort('order').limit(5),
        ]);

        res.json({ companyInfo, socialMediaLinks, navBrands, navCatalogues });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
