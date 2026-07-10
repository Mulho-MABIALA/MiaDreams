const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const https = require('https');
const Catalogue = require('../models/Catalogue');
const CatalogueDownload = require('../models/CatalogueDownload');

// GET /api/catalogues
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache');
        const catalogues = await Catalogue.find({ is_active: { $ne: false } }).sort('order');
        res.json(catalogues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/catalogues/:id/download
router.get('/:id/download', async (req, res) => {
    try {
        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue || !catalogue.pdf_path) {
            return res.status(404).json({ message: 'Catalogue ou PDF introuvable' });
        }

        const fileName = `${catalogue.name}.pdf`;
        const encodedName = encodeURIComponent(fileName);

        if (catalogue.pdf_path.startsWith('http')) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodedName}`);
            res.setHeader('Content-Type', 'application/pdf');
            const request = https.get(catalogue.pdf_path, (stream) => { stream.pipe(res); });
            request.on('error', () => res.status(500).json({ message: 'Erreur téléchargement' }));
            return;
        }

        const filePath = path.join(__dirname, '../../../uploads', catalogue.pdf_path);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Fichier PDF introuvable' });
        res.download(filePath, fileName);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/catalogues/:id/record — enregistre le téléchargement avec le profil qualifié
router.post('/:id/record', async (req, res) => {
    try {
        const { nom, prenom, email, whatsapp, ville, pays, profession, raisons } = req.body;
        if (!nom || !prenom || !email) {
            return res.status(422).json({ message: 'Nom, prénom et email sont requis' });
        }

        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue) return res.status(404).json({ message: 'Catalogue introuvable' });

        await Promise.all([
            CatalogueDownload.create({
                catalogue: catalogue._id,
                catalogue_name: catalogue.name,
                nom, prenom, email, whatsapp, ville, pays, profession,
                raisons: Array.isArray(raisons) ? raisons : [],
            }),
            Catalogue.findByIdAndUpdate(catalogue._id, { $inc: { downloads_count: 1 } }),
        ]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
