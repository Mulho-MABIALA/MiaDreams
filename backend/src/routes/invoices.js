const express    = require('express');
const router     = express.Router();
const crypto     = require('crypto');
const TempInvoice = require('../models/TempInvoice');

/**
 * POST /api/invoices/upload
 * Body : { data: "data:application/pdf;base64,...", filename: "facture-XXX.pdf" }
 * Stocke le PDF en base et retourne un token de téléchargement.
 * Accessible uniquement depuis l'admin (appelé avec le token JWT dans l'en-tête)
 */
router.post('/upload', async (req, res) => {
    try {
        const { data: dataUri, filename } = req.body;
        if (!dataUri) return res.status(400).json({ message: 'Données PDF manquantes' });

        // Extraire le buffer depuis la data URI base64
        const base64Data = dataUri.replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const token = crypto.randomBytes(20).toString('hex');
        await TempInvoice.create({
            token,
            filename: filename || 'facture.pdf',
            data: buffer,
            contentType: 'application/pdf',
        });

        res.json({ token, url: `/api/invoices/${token}` });
    } catch (err) {
        console.error('Invoice upload error:', err.message);
        res.status(500).json({ message: 'Erreur lors de la génération du lien' });
    }
});

/**
 * GET /api/invoices/:token
 * Route publique — quiconque possède le lien peut télécharger le PDF.
 */
router.get('/:token', async (req, res) => {
    try {
        const inv = await TempInvoice.findOne({ token: req.params.token });
        if (!inv) return res.status(404).json({ message: 'Facture introuvable ou expirée' });

        res.set({
            'Content-Type':        'application/pdf',
            'Content-Disposition': `inline; filename="${inv.filename}"`,
            'Content-Length':      inv.data.length,
            'Cache-Control':       'private, max-age=3600',
        });
        res.send(inv.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
