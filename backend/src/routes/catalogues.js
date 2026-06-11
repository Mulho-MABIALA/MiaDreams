const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const https = require('https');
const nodemailer = require('nodemailer');
const Catalogue = require('../models/Catalogue');
const CatalogueDownload = require('../models/CatalogueDownload');

const SITE_URL = process.env.FRONTEND_URL || 'https://mia-dreams.com';

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
            const request = https.get(catalogue.pdf_path, (stream) => {
                stream.pipe(res);
            });
            request.on('error', () => res.status(500).json({ message: 'Erreur lors du téléchargement Cloudinary' }));
            return;
        }

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

        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            return res.status(503).json({ message: 'SMTP non configuré' });
        }

        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue || !catalogue.pdf_path) {
            return res.status(404).json({ message: 'Catalogue introuvable' });
        }

        // Sauvegarde immédiate — indépendant de l'email
        await Promise.all([
            CatalogueDownload.create({ catalogue: catalogue._id, catalogue_name: catalogue.name, email }),
            Catalogue.findByIdAndUpdate(catalogue._id, { $inc: { downloads_count: 1 } }),
        ]);

        // Lien direct de téléchargement (plus fiable qu'une pièce jointe)
        const downloadUrl = `${SITE_URL}/api/catalogues/${catalogue._id}/download`;

        const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a0f07 0%,#2D1B0E 60%,#4A2C18 100%);padding:40px 36px;text-align:center;">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:5px;color:rgba(201,168,76,.6);text-transform:uppercase;">MIA DREAMS & CO</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:300;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Votre Catalogue</h1>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,.45);">${catalogue.name}</p>
  </div>

  <!-- Body -->
  <div style="padding:36px 36px 28px;">
    <p style="margin:0 0 8px;font-size:15px;color:#3D2214;line-height:1.7;">Bonjour,</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6B4F3A;line-height:1.8;">
      Merci pour votre intérêt pour <strong style="color:#3D2214;">${catalogue.name}</strong>.<br>
      Votre catalogue est prêt — cliquez sur le bouton ci-dessous pour le télécharger.
    </p>

    <!-- CTA principal -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${downloadUrl}"
         style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#E0BC6A);color:#1E110A;font-weight:700;font-size:13px;letter-spacing:3px;text-transform:uppercase;padding:18px 36px;border-radius:8px;text-decoration:none;">
        ⬇&nbsp; TÉLÉCHARGER LE CATALOGUE
      </a>
    </div>

    <p style="margin:0 0 28px;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;">
      Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
      <a href="${downloadUrl}" style="color:#C9A84C;word-break:break-all;">${downloadUrl}</a>
    </p>

    <div style="border-top:1px solid #F0E8D8;padding-top:20px;">
      <p style="margin:0;font-size:13px;color:#6B4F3A;line-height:1.7;">
        Nous espérons que vous apprécierez notre collection.<br>
        N'hésitez pas à nous contacter pour toute question.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:20px 36px;background:#FDF8F2;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#B8A090;">Des questions ? Écrivez-nous sur WhatsApp</p>
    <p style="margin:0;font-size:10px;color:#C8B8A0;">MIA DREAMS & CO · Maison de mode africaine d'excellence</p>
  </div>
</div>
</body>
</html>`;

        // Transporter créé à la volée — même méthode que la campagne newsletter (qui fonctionne)
        const transporter = nodemailer.createTransport({
            host:   process.env.MAIL_HOST || 'smtp.gmail.com',
            port:   Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from:    `"MIA DREAMS & CO" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to:      email,
            subject: `📄 Votre catalogue ${catalogue.name} — MIA DREAMS`,
            html,
        });

        console.log(`✅ Catalogue envoyé par email à ${email}`);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Erreur send-email catalogue :', err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
