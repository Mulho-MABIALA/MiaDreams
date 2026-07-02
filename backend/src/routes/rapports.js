const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const https = require('https');
const Rapport = require('../models/Rapport');
const RapportDownload = require('../models/RapportDownload');
const { isProfessionalEmail } = require('../utils/proEmail');

// GET /api/rapports — rapports actifs (public)
router.get('/', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache');
        const rapports = await Rapport.find({ is_active: { $ne: false } }).sort('order');
        res.json(rapports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/rapports/:id/download — téléchargement du PDF
router.get('/:id/download', async (req, res) => {
    try {
        const rapport = await Rapport.findById(req.params.id);
        if (!rapport || !rapport.pdf_path) {
            return res.status(404).json({ message: 'Rapport ou PDF introuvable' });
        }

        const fileName = `${rapport.name}.pdf`;
        const encodedName = encodeURIComponent(fileName);

        if (rapport.pdf_path.startsWith('http')) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodedName}`);
            res.setHeader('Content-Type', 'application/pdf');
            const request = https.get(rapport.pdf_path, (stream) => { stream.pipe(res); });
            request.on('error', () => res.status(500).json({ message: 'Erreur téléchargement' }));
            return;
        }

        const filePath = path.join(__dirname, '../../../uploads', rapport.pdf_path);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Fichier PDF introuvable' });
        res.download(filePath, fileName);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/rapports/:id/record — vérifie l'email PRO puis enregistre le téléchargement
router.post('/:id/record', async (req, res) => {
    try {
        const email = (req.body.email || '').trim();
        if (!email) return res.status(422).json({ message: 'Email requis' });

        // ── Le rapport n'est accessible qu'avec une adresse professionnelle ──
        if (!isProfessionalEmail(email)) {
            return res.status(422).json({
                message: 'Veuillez utiliser une adresse e-mail professionnelle. Les adresses personnelles (Gmail, Yahoo, Hotmail, Outlook…) ne sont pas acceptées.',
            });
        }

        const rapport = await Rapport.findById(req.params.id);
        if (!rapport) return res.status(404).json({ message: 'Rapport introuvable' });

        await Promise.all([
            RapportDownload.create({ rapport: rapport._id, rapport_name: rapport.name, email }),
            Rapport.findByIdAndUpdate(rapport._id, { $inc: { downloads_count: 1 } }),
        ]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
