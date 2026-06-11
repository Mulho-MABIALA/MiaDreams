const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const Catalogue = require('../models/Catalogue');
const CatalogueDownload = require('../models/CatalogueDownload');
const { sendEmail, getTransporter } = require('../utils/notify');

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

        // PDF stocké sur Cloudinary → proxy pour forcer le bon nom de fichier
        if (catalogue.pdf_path.startsWith('http')) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodedName}`);
            res.setHeader('Content-Type', 'application/pdf');
            const request = https.get(catalogue.pdf_path, (stream) => {
                stream.pipe(res);
            });
            request.on('error', () => res.status(500).json({ message: 'Erreur lors du téléchargement Cloudinary' }));
            return;
        }

        // Fallback : fichier local sur disque
        const filePath = path.join(__dirname, '../../../uploads', catalogue.pdf_path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Fichier PDF introuvable sur le serveur' });
        }

        res.download(filePath, fileName);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/catalogues/:id/send-email
router.post('/:id/send-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(422).json({ message: 'Email requis' });

        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue || !catalogue.pdf_path) {
            return res.status(404).json({ message: 'Catalogue ou PDF introuvable' });
        }

        // Récupère le contenu du PDF (Cloudinary ou local)
        let pdfBuffer;
        if (catalogue.pdf_path.startsWith('http')) {
            pdfBuffer = await new Promise((resolve, reject) => {
                const lib = catalogue.pdf_path.startsWith('https') ? https : http;
                lib.get(catalogue.pdf_path, (stream) => {
                    const chunks = [];
                    stream.on('data', c => chunks.push(c));
                    stream.on('end', () => resolve(Buffer.concat(chunks)));
                    stream.on('error', reject);
                }).on('error', reject);
            });
        } else {
            const filePath = path.join(__dirname, '../../../uploads', catalogue.pdf_path);
            if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Fichier PDF introuvable' });
            pdfBuffer = fs.readFileSync(filePath);
        }

        const fileName = `${catalogue.name}.pdf`;
        const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">
  <div style="background:linear-gradient(135deg,#1a0f07 0%,#2D1B0E 60%,#4A2C18 100%);padding:36px;text-align:center;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:5px;color:rgba(201,168,76,.6);text-transform:uppercase;">MIA DREAMS & CO</p>
    <h1 style="margin:0 0 6px;font-size:24px;font-weight:300;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Votre Catalogue</h1>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,.4);">${catalogue.name}</p>
  </div>
  <div style="padding:32px 36px;">
    <p style="margin:0 0 20px;font-size:14px;color:#6B4F3A;line-height:1.8;">
      Bonjour,<br><br>
      Merci pour votre intérêt. Vous trouverez en pièce jointe votre catalogue <strong>${catalogue.name}</strong>.<br><br>
      Nous espérons que vous apprécierez notre collection. N'hésitez pas à nous contacter pour toute question.
    </p>
    <a href="https://mia-dreams.com" style="display:block;text-align:center;background:linear-gradient(135deg,#C9A84C,#E0BC6A);color:#1E110A;font-weight:700;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:18px 24px;border-radius:8px;text-decoration:none;">
      VISITER NOTRE SITE →
    </a>
  </div>
  <div style="padding:20px 36px;border-top:1px solid #F0E8D8;text-align:center;">
    <p style="margin:0;font-size:10px;color:#C8B8A0;">MIA DREAMS & CO · Maison de mode africaine d'excellence</p>
  </div>
</div></body></html>`;

        // Envoie l'email avec le PDF en pièce jointe
        await sendEmail({
            to:          email,
            subject:     `📄 Votre catalogue ${catalogue.name} — MIA DREAMS`,
            html,
            attachments: [{ filename: fileName, content: pdfBuffer, contentType: 'application/pdf' }],
        });

        // Enregistre le téléchargement et incrémente le compteur
        await Promise.all([
            CatalogueDownload.create({ catalogue: catalogue._id, catalogue_name: catalogue.name, email }),
            Catalogue.findByIdAndUpdate(catalogue._id, { $inc: { downloads_count: 1 } }),
        ]);

        res.json({ success: true });
    } catch (err) {
        console.error('Erreur envoi catalogue par email :', err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
