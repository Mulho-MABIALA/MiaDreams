const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Catalogue = require('../models/Catalogue');

// GET /api/catalogues
router.get('/', async (req, res) => {
    try {
        const catalogues = await Catalogue.find({ is_active: true }).sort('order');
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

        // PDF stocké sur Cloudinary → redirection directe
        if (catalogue.pdf_path.startsWith('http')) {
            return res.redirect(catalogue.pdf_path);
        }

        // Fallback : fichier local sur disque
        const filePath = path.join(__dirname, '../../../uploads', catalogue.pdf_path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Fichier PDF introuvable sur le serveur' });
        }

        res.download(filePath, `${catalogue.name}.pdf`);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
