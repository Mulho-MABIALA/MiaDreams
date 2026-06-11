const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Brand = require('../models/Brand');
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Post = require('../models/Post');
const Podcast = require('../models/Podcast');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const Catalogue = require('../models/Catalogue');
const CompanyInfo = require('../models/CompanyInfo');
const SocialMedia = require('../models/SocialMedia');
const Section = require('../models/Section');
const Initiative = require('../models/Initiative');
const TeamMember = require('../models/TeamMember');
const Contact = require('../models/Contact');
const Reservation = require('../models/Reservation');
const Newsletter = require('../models/Newsletter');
const Order = require('../models/Order');
const CaisseTransaction = require('../models/CaisseTransaction');
const AdminUser = require('../models/Admin');
const { notifyStatusUpdate } = require('../utils/notify');
const CatalogueDownload = require('../models/CatalogueDownload');

// Middleware : réservé au super_admin uniquement
function superAdminOnly(req, res, next) {
    if (req.user?.role !== 'super_admin') {
        return res.status(403).json({ message: 'Accès réservé au super administrateur.' });
    }
    next();
}

// ── Cloudinary (stockage cloud permanent) ─────────────────────────────────────
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const CLOUDINARY_READY = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

// ── Multer : TOUJOURS disque (évite les crashs mémoire avec les gros PDFs) ──────
const UPLOADS = path.join(__dirname, '../../../uploads');
const os = require('os');

// Images → uploads/ (permanentes)   PDFs → tmpdir (streamées vers Cloudinary puis supprimées)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = file.mimetype === 'application/pdf' ? os.tmpdir() : UPLOADS;
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype === 'application/pdf' ? '.pdf' : '.webp';
        cb(null, `mia-${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },  // 50 Mo — gros catalogues PDF
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Fichier non supporté (image ou PDF requis)'));
    },
});

// ── Traitement fichiers : Cloudinary ou disque local ──────────────────────────
async function processImages(req, res, next) {
    if (!req.files && !req.file) return next();
    try {
        const files = req.file ? [req.file] : Object.values(req.files || {}).flat();

        await Promise.all(files.map(async (file) => {

            if (file.mimetype.startsWith('image/')) {
                // ── Image : compresser en WebP ────────────────────────────
                if (CLOUDINARY_READY) {
                    // Lire depuis disque → compresser → uploader sur Cloudinary
                    const buffer = await sharp(file.path)
                        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 82 })
                        .toBuffer();

                    // Supprimer le fichier temporaire disque
                    try { fs.unlinkSync(file.path); } catch (_) {}

                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            { folder: 'miadreams', resource_type: 'image' },
                            (err, res) => err ? reject(err) : resolve(res)
                        ).end(buffer);
                    });

                    file.filename   = result.secure_url;
                    file.cloudinary = true;
                } else {
                    // Fallback disque local : compresser en place
                    const tmpPath = file.path + '.tmp';
                    fs.renameSync(file.path, tmpPath);
                    await sharp(tmpPath)
                        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 82 })
                        .toFile(file.path);
                    fs.unlinkSync(tmpPath);
                }

            } else if (file.mimetype === 'application/pdf') {
                // ── PDF : Cloudinary si dispo, sinon disque ───────────────
                if (CLOUDINARY_READY) {
                    let cloudinaryOk = false;
                    try {
                        const result = await new Promise((resolve, reject) => {
                            const timer = setTimeout(() => {
                                reject(new Error('Délai dépassé (>3 min). Compressez le PDF ou vérifiez votre connexion.'));
                            }, 3 * 60 * 1000);

                            const readStream = fs.createReadStream(file.path);
                            const uploadStream = cloudinary.uploader.upload_stream(
                                { folder: 'miadreams', resource_type: 'raw', timeout: 180000 },
                                (err, res) => {
                                    clearTimeout(timer);
                                    if (err) reject(err);
                                    else     resolve(res);
                                }
                            );
                            readStream.pipe(uploadStream);
                            readStream.on('error', (e) => { clearTimeout(timer); reject(e); });
                        });

                        try { fs.unlinkSync(file.path); } catch (_) {}
                        file.filename   = result.secure_url;
                        file.cloudinary = true;
                        cloudinaryOk    = true;
                        console.log(`📄 PDF uploadé sur Cloudinary : ${result.secure_url}`);
                    } catch (cloudErr) {
                        // Fichier trop lourd ou quota dépassé → fallback disque
                        console.warn(`⚠️  Cloudinary PDF refusé (${cloudErr.message}), fallback disque`);
                    }

                    if (!cloudinaryOk) {
                        // Fallback disque local
                        const destPath = path.join(UPLOADS, file.filename);
                        if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });
                        try {
                            fs.renameSync(file.path, destPath);
                        } catch (e) {
                            if (e.code === 'EXDEV') {
                                fs.copyFileSync(file.path, destPath);
                                try { fs.unlinkSync(file.path); } catch (_) {}
                            } else { throw e; }
                        }
                    }
                } else {
                    // Cloudinary non configuré → disque local directement
                    const destPath = path.join(UPLOADS, file.filename);
                    if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });
                    try {
                        fs.renameSync(file.path, destPath);
                    } catch (e) {
                        if (e.code === 'EXDEV') {
                            fs.copyFileSync(file.path, destPath);
                            try { fs.unlinkSync(file.path); } catch (_) {}
                        } else { throw e; }
                    }
                }
            }
        }));
        next();
    } catch (e) {
        // Nettoyer les fichiers temporaires en cas d'erreur
        const files = req.file ? [req.file] : Object.values(req.files || {}).flat();
        files.forEach(f => { try { if (f.path) fs.unlinkSync(f.path); } catch (_) {} });
        next(e);
    }
}

// Alias pour compatibilité avec le code existant
const compressImages = processImages;

// Cast les strings "true"/"false" en vrais booleans pour les champs boolean du schema
function castData(Model, raw) {
    const data = { ...raw };
    const schemaPaths = Model.schema.paths;
    Object.keys(data).forEach(key => {
        if (schemaPaths[key] && schemaPaths[key].instance === 'Boolean') {
            if (data[key] === 'true'  || data[key] === '1') data[key] = true;
            if (data[key] === 'false' || data[key] === '0') data[key] = false;
        }
    });
    return data;
}

// Helper CRUD factory
const crudRouter = (Model, fields = []) => {
    const r = express.Router();
    r.get('/',    async (req, res) => { try { res.json(await Model.find().sort('order createdAt')); } catch(e){ res.status(500).json({message:e.message}); }});
    r.get('/:id', async (req, res) => { try { const doc = await Model.findById(req.params.id); if(!doc) return res.status(404).json({message:'Introuvable'}); res.json(doc); } catch(e){ res.status(500).json({message:e.message}); }});
    const uploadFields = upload.fields(fields.map(f=>({name:f,maxCount:1})));
    r.post('/',   uploadFields, compressImages, async (req, res) => {
        try {
            const data = castData(Model, req.body);
            if(req.files) fields.forEach(f => { if(req.files[f]) data[f] = req.files[f][0].filename; });
            const doc = await Model.create(data);
            res.status(201).json(doc);
        } catch(e){ res.status(400).json({message:e.message}); }
    });
    r.put('/:id', uploadFields, compressImages, async (req, res) => {
        try {
            const data = castData(Model, req.body);
            if(req.files) fields.forEach(f => { if(req.files[f] && req.files[f][0].filename) data[f] = req.files[f][0].filename; });
            // Récupérer le doc existant pour préserver les champs image/PDF non modifiés
            const existing = await Model.findById(req.params.id);
            if(!existing) return res.status(404).json({message:'Introuvable'});
            fields.forEach(f => {
                // Si aucun nouveau fichier envoyé et pas de valeur dans req.body → garder l'existant
                if (data[f] === undefined && existing[f]) data[f] = existing[f];
            });
            const doc = await Model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
            res.json(doc);
        } catch(e){ res.status(400).json({message:e.message}); }
    });
    r.delete('/:id', async (req, res) => {
        try {
            await Model.findByIdAndDelete(req.params.id);
            res.json({ message: 'Supprimé' });
        } catch(e){ res.status(500).json({message:e.message}); }
    });
    return r;
};

router.use('/brands',       crudRouter(Brand, ['image']));

// ─── Comptage produits par collection (DOIT être AVANT router.use('/collections'))
router.get('/collections-stats', async (req, res) => {
    try {
        const stats = await Product.aggregate([
            { $group: { _id: '$collection', count: { $sum: 1 } } }
        ]);
        const map = {};
        stats.forEach(s => { if (s._id) map[s._id.toString()] = s.count; });
        res.json(map);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.use('/collections',  crudRouter(Collection, ['image']));
// ─── Routes produits personnalisées (support multi-images) ──────────────────────
const productUpload = upload.fields([
    { name: 'image',  maxCount: 1 },
    { name: 'images', maxCount: 8 },
]);

const parseProduct = (body) => {
    const data = castData(Product, body);
    if (data.sizes  && typeof data.sizes  === 'string') data.sizes  = data.sizes.split(',').map(s => s.trim()).filter(Boolean);
    if (data.colors && typeof data.colors === 'string') data.colors = data.colors.split(',').map(s => s.trim()).filter(Boolean);
    return data;
};

router.get('/products',     async (req, res) => { try { res.json(await Product.find().sort('order createdAt')); } catch(e){ res.status(500).json({message:e.message}); }});
router.get('/products/:id', async (req, res) => { try { const d = await Product.findById(req.params.id); if(!d) return res.status(404).json({message:'Introuvable'}); res.json(d); } catch(e){ res.status(500).json({message:e.message}); }});

router.post('/products', productUpload, processImages, async (req, res) => {
    try {
        const data = parseProduct(req.body);
        if (req.files?.image?.[0]?.filename)  data.image  = req.files.image[0].filename;
        if (req.files?.images) data.images = req.files.images.map(f => f.filename).filter(Boolean);
        const doc = await Product.create(data);
        res.status(201).json(doc);
    } catch(e){ res.status(400).json({message:e.message}); }
});

router.put('/products/:id', productUpload, processImages, async (req, res) => {
    try {
        const existing = await Product.findById(req.params.id);
        if (!existing) return res.status(404).json({message:'Introuvable'});
        const data = parseProduct(req.body);
        // Image principale
        if (req.files?.image?.[0]?.filename) data.image = req.files.image[0].filename;
        else if (!data.image) data.image = existing.image; // garder l'existante
        // Images supplémentaires : combiner existantes conservées + nouvelles uploadées
        const kept = req.body.existingImages
            ? (Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages])
            : [];
        const newImgs = req.files?.images ? req.files.images.map(f => f.filename).filter(Boolean) : [];
        data.images = [...kept, ...newImgs];
        const doc = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: false });
        res.json(doc);
    } catch(e){ res.status(400).json({message:e.message}); }
});

router.delete('/products/:id', async (req, res) => {
    try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Supprimé' }); }
    catch(e){ res.status(500).json({message:e.message}); }
});
// ── Cloudinary : signature pour upload direct depuis le navigateur ────────────
// Permet au frontend d'uploader les gros PDFs directement vers Cloudinary
// sans passer par le serveur Node.js (contourne les limites de taille)
router.get('/cloudinary-sign', (req, res) => {
    if (!CLOUDINARY_READY) {
        return res.status(503).json({ cloudinary: false, message: 'Cloudinary non configuré sur ce serveur' });
    }
    const timestamp  = Math.round(Date.now() / 1000);
    const paramsToSign = { folder: 'miadreams', resource_type: 'raw', timestamp };
    const signature  = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    res.json({
        cloudinary:  true,
        signature,
        timestamp,
        api_key:     process.env.CLOUDINARY_API_KEY,
        cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
        folder:      'miadreams',
    });
});

router.use('/services',     crudRouter(Service, ['image']));
router.use('/posts',        crudRouter(Post, ['cover_image']));
router.use('/podcasts',     crudRouter(Podcast, ['thumbnail']));
router.use('/testimonials', crudRouter(Testimonial, ['photo']));
router.use('/gallery',      crudRouter(Gallery, ['image']));
router.use('/catalogues',   crudRouter(Catalogue, ['cover_image', 'pdf_path']));
router.use('/social-media', crudRouter(SocialMedia));
router.use('/sections',     crudRouter(Section, ['image']));

// GET sections filtrées par page (usage admin)
router.get('/sections-page', async (req, res) => {
    try {
        const filter = {};
        if (req.query.page) filter.page = req.query.page;
        if (req.query.type) filter.type = req.query.type;
        const sections = await Section.find(filter).sort({ order: 1, createdAt: 1 });
        res.json(sections);
    } catch (e) { res.status(500).json({ message: e.message }); }
});
router.use('/initiatives',  crudRouter(Initiative, ['image']));
router.use('/team',         crudRouter(TeamMember, ['photo']));

// POST /api/admin/contacts/:id/reply — répondre par email à un message de contact
router.post('/contacts/:id/reply', async (req, res) => {
    try {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            return res.status(503).json({ message: 'SMTP non configuré.' });
        }
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Message introuvable.' });

        const { subject, body } = req.body;
        if (!subject || !body) return res.status(422).json({ message: 'Sujet et message requis.' });

        const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">
  <div style="background:linear-gradient(135deg,#1a0f07 0%,#2D1B0E 60%,#4A2C18 100%);padding:32px 36px;">
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:4px;color:rgba(201,168,76,.6);text-transform:uppercase;">MIA DREAMS & CO</p>
    <h1 style="margin:0;font-size:20px;font-weight:600;color:#C9A84C;letter-spacing:1px;">${subject}</h1>
  </div>
  <div style="padding:32px 36px;">
    <p style="margin:0 0 20px;font-size:14px;color:#6B4F3A;">Bonjour <strong>${contact.name}</strong>,</p>
    <div style="font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap;">${body.replace(/\n/g, '<br>')}</div>
  </div>
  <div style="padding:20px 36px;border-top:1px solid #F0E8D8;">
    <p style="margin:0 0 4px;font-size:12px;color:#9E8272;font-style:italic;">En réponse à votre message : "${contact.subject || contact.message?.slice(0,60)}…"</p>
  </div>
  <div style="padding:16px 36px;background:#FDF8F2;text-align:center;">
    <p style="margin:0;font-size:10px;color:#C8B8A0;">MIA DREAMS & CO · Maison de mode africaine d'excellence</p>
  </div>
</div></body></html>`;

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
        });
        await transporter.sendMail({
            from:    `"MIA DREAMS & CO" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to:      contact.email,
            subject,
            html,
        });

        // Marquer comme lu
        await Contact.findByIdAndUpdate(req.params.id, { is_read: true });

        res.json({ success: true });
    } catch (e) {
        console.error('Erreur reply contact :', e.message);
        res.status(500).json({ message: e.message });
    }
});

router.use('/contacts',     crudRouter(Contact));
router.use('/reservations', crudRouter(Reservation));
router.use('/newsletters',  crudRouter(Newsletter));

// ─── Envoi campagne newsletter ─────────────────────────────────────────────────
router.post('/newsletter/send-campaign', async (req, res) => {
    const nodemailer = require('nodemailer');
    try {
        const { subject, html_body, recipients } = req.body;
        if (!subject || !html_body) {
            return res.status(422).json({ message: 'Sujet et contenu requis.' });
        }
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            return res.status(503).json({ message: 'Email SMTP non configuré. Ajoutez MAIL_USER et MAIL_PASS dans les variables d\'environnement Render.' });
        }

        // Destinataires
        let emails = [];
        if (recipients === 'all' || !recipients) {
            const subs = await Newsletter.find({}).select('email');
            emails = subs.map(s => s.email);
        } else if (Array.isArray(recipients)) {
            emails = recipients;
        }
        if (emails.length === 0) {
            return res.status(422).json({ message: 'Aucun destinataire trouvé.' });
        }

        const transporter = nodemailer.createTransport({
            host:   process.env.MAIL_HOST || 'smtp.gmail.com',
            port:   Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
        });

        const from = `"MIA DREAMS & CO" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`;

        // Envoi par lots de 10 pour ne pas saturer le SMTP
        const BATCH = 10;
        let sent = 0, failed = 0;
        for (let i = 0; i < emails.length; i += BATCH) {
            const batch = emails.slice(i, i + BATCH);
            await Promise.allSettled(batch.map(to =>
                transporter.sendMail({ from, to, subject, html: html_body })
                    .then(() => sent++)
                    .catch(() => failed++)
            ));
            if (i + BATCH < emails.length) await new Promise(r => setTimeout(r, 500));
        }

        res.json({ success: true, sent, failed, total: emails.length });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// ─── Statistiques téléchargements catalogues ──────────────────────────────────
router.get('/catalogues-downloads', async (req, res) => {
    try {
        const downloads = await CatalogueDownload.find({})
            .sort({ downloaded_at: -1 })
            .limit(500);
        const catalogues = await Catalogue.find({}).select('name downloads_count cover_image');
        res.json({ downloads, catalogues });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── Orders (lecture + gestion statut) ────────────────────────────────────────
router.get('/orders', async (req, res) => {
    try {
        const { status, payment } = req.query;
        const filter = {};
        if (status) filter.order_status = status;
        if (payment) filter.payment_status = payment;
        const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
        res.json(orders);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Introuvable' });
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.patch('/orders/:id', async (req, res) => {
    try {
        const { order_status, payment_status, notes } = req.body;

        // Récupérer l'état AVANT mise à jour pour détecter le changement
        const before = await Order.findById(req.params.id);
        if (!before) return res.status(404).json({ message: 'Introuvable' });

        const update = {};
        if (order_status)       update.order_status  = order_status;
        if (payment_status)     update.payment_status = payment_status;
        if (notes !== undefined) update.notes         = notes;

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });

        // ── Entrée caisse automatique quand une commande passe à "paid" ──
        const vientDePayé = payment_status === 'paid' && before.payment_status !== 'paid';
        const vientDeRemboursé = payment_status === 'refunded' && before.payment_status === 'paid';

        if (vientDePayé) {
            const modeMap = { wave: 'wave', orange_money: 'orange_money', free_money: 'free_money', cash: 'especes' };
            await CaisseTransaction.create({
                type:          'entree',
                montant:       order.total,
                categorie:     'Vente boutique',
                description:   `Commande ${order.order_number} — ${order.customer?.name || ''}`,
                date:          new Date(),
                mode_paiement: modeMap[order.payment_method] || 'autre',
                reference:     order.order_number,
                notes:         `Ajouté automatiquement lors du paiement de la commande.`,
            });
            console.log(`💰 Entrée caisse créée pour ${order.order_number} : ${order.total} FCFA`);
        }

        // ── Sortie caisse automatique si remboursement ──
        if (vientDeRemboursé) {
            await CaisseTransaction.create({
                type:          'sortie',
                montant:       order.total,
                categorie:     'Remboursement',
                description:   `Remboursement commande ${order.order_number} — ${order.customer?.name || ''}`,
                date:          new Date(),
                mode_paiement: 'autre',
                reference:     order.order_number,
                notes:         `Remboursement automatique suite à annulation de commande.`,
            });
            console.log(`💸 Sortie caisse créée (remboursement) pour ${order.order_number}`);
        }

        // ── Email client si statut commande a changé ──
        const statusChanged = order_status && order_status !== before.order_status;
        if (statusChanged) {
            notifyStatusUpdate(order).catch(e => console.error('Status email error:', e.message));
        }

        res.json(order);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supprimé' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// Company info (singleton)
router.get('/company-info', async (req, res) => {
    try { res.json(await CompanyInfo.findOne() || {}); } catch(e){ res.status(500).json({message:e.message}); }
});
router.put('/company-info', upload.single('logo'), processImages, async (req, res) => {
    try {
        const data = { ...req.body };
        if(req.file) data.logo = req.file.filename; // URL Cloudinary ou nom de fichier local
        const existing = await CompanyInfo.findOne();
        const doc = existing
            ? await CompanyInfo.findByIdAndUpdate(existing._id, data, { new: true })
            : await CompanyInfo.create(data);
        res.json(doc);
    } catch(e){ res.status(400).json({message:e.message}); }
});

// ── GESTION UTILISATEURS (super_admin only) ───────────────────────────────────
router.get('/users', superAdminOnly, async (req, res) => {
    try {
        const users = await AdminUser.find().select('-password').sort({ createdAt: -1 });
        res.json({ users, modules: AdminUser.ALL_MODULES });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/users', superAdminOnly, async (req, res) => {
    try {
        const { name, email, password, role, permissions, is_active } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Nom, email et mot de passe requis.' });
        if (password.length < 8) return res.status(400).json({ message: 'Mot de passe minimum 8 caractères.' });
        const existing = await AdminUser.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        const user = await AdminUser.create({
            name, email,
            password,
            role: role || 'admin',
            permissions: role === 'super_admin' ? [] : (permissions || []),
            is_active: is_active !== false,
        });
        res.status(201).json({ user: { ...user.toObject(), password: undefined } });
    } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/users/:id', superAdminOnly, async (req, res) => {
    try {
        const { name, email, password, role, permissions, is_active } = req.body;
        const user = await AdminUser.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
        // On ne peut pas modifier le propre compte super_admin
        if (user._id.toString() === req.user.id && role && role !== user.role) {
            return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre rôle.' });
        }
        if (name)  user.name  = name;
        if (email) user.email = email.toLowerCase();
        if (password && password.length >= 8) user.password = password;
        if (role)  user.role  = role;
        if (permissions !== undefined) user.permissions = permissions;
        if (is_active !== undefined)   user.is_active   = is_active;
        await user.save();
        res.json({ user: { ...user.toObject(), password: undefined } });
    } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/users/:id', superAdminOnly, async (req, res) => {
    try {
        if (req.params.id === req.user.id) return res.status(400).json({ message: 'Impossible de supprimer votre propre compte.' });
        await AdminUser.findByIdAndDelete(req.params.id);
        res.json({ message: 'Utilisateur supprimé.' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PROGRAMMES ────────────────────────────────────────────────────────────────
const Programme  = require('../models/Programme');
const Inscription = require('../models/Inscription');

router.get('/programmes', async (req, res) => {
    try {
        const programmes = await Programme.find().sort({ order: 1, createdAt: 1 });
        res.json({ programmes });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/programmes', upload.single('image'), processImages, async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.body.modules) {
            try { data.modules = JSON.parse(req.body.modules); } catch (_) { data.modules = []; }
        }
        if (req.file) data.image = req.file.filename;
        const prog = await Programme.create(data);
        res.status(201).json(prog);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/programmes/:id', upload.single('image'), processImages, async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.body.modules) {
            try { data.modules = JSON.parse(req.body.modules); } catch (_) {}
        }
        if (req.file) data.image = req.file.filename;
        const prog = await Programme.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!prog) return res.status(404).json({ message: 'Programme introuvable' });
        res.json(prog);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/programmes/:id', async (req, res) => {
    try {
        await Programme.findByIdAndDelete(req.params.id);
        await Inscription.deleteMany({ programme: req.params.id });
        res.json({ message: 'Supprimé' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── INSCRIPTIONS ──────────────────────────────────────────────────────────────
router.get('/inscriptions', async (req, res) => {
    try {
        const { programme } = req.query;
        const filter = programme ? { programme } : {};
        const inscriptions = await Inscription.find(filter)
            .populate('programme', 'name slug')
            .sort({ createdAt: -1 });
        res.json({ inscriptions });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/inscriptions/:id', async (req, res) => {
    try {
        const { status, nom, email, telephone, message } = req.body;
        const update = {};
        if (status    !== undefined) update.status    = status;
        if (nom       !== undefined) update.nom       = nom;
        if (email     !== undefined) update.email     = email;
        if (telephone !== undefined) update.telephone = telephone;
        if (message   !== undefined) update.message   = message;
        const insc = await Inscription.findByIdAndUpdate(req.params.id, update, { new: true })
            .populate('programme', 'name slug');
        if (!insc) return res.status(404).json({ message: 'Inscription introuvable' });
        res.json(insc);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// POST /api/admin/inscriptions/:id/send-fiche — envoie la fiche par email
router.post('/inscriptions/:id/send-fiche', async (req, res) => {
    try {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            return res.status(503).json({ message: 'SMTP non configuré.' });
        }
        const insc = await Inscription.findById(req.params.id).populate('programme', 'name');
        if (!insc) return res.status(404).json({ message: 'Inscription introuvable.' });

        const { to } = req.body; // email destinataire (par défaut celui de l'inscrit)
        const dest = to || insc.email;

        const statusLabel = { 'en attente': '⏳ En attente', 'acceptée': '✅ Acceptée', 'refusée': '❌ Refusée' }[insc.status] || insc.status;
        const dateStr = new Date(insc.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">
  <div style="background:linear-gradient(135deg,#1a0f07 0%,#2D1B0E 60%,#4A2C18 100%);padding:36px;text-align:center;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:5px;color:rgba(201,168,76,.6);text-transform:uppercase;">MIA DREAMS & CO</p>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">Fiche d'inscription</h1>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,.4);">${insc.programme?.name || ''}</p>
  </div>
  <div style="padding:32px 36px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr style="border-bottom:1px solid #F0E8D8;">
        <td style="padding:10px 0;font-size:12px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;width:140px;">Nom complet</td>
        <td style="padding:10px 0;font-size:14px;font-weight:600;color:#1E110A;">${insc.nom}</td>
      </tr>
      <tr style="border-bottom:1px solid #F0E8D8;">
        <td style="padding:10px 0;font-size:12px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;">Email</td>
        <td style="padding:10px 0;font-size:14px;color:#1E110A;">${insc.email}</td>
      </tr>
      <tr style="border-bottom:1px solid #F0E8D8;">
        <td style="padding:10px 0;font-size:12px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;">Téléphone</td>
        <td style="padding:10px 0;font-size:14px;color:#1E110A;">${insc.telephone || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #F0E8D8;">
        <td style="padding:10px 0;font-size:12px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;">Programme</td>
        <td style="padding:10px 0;font-size:14px;color:#1E110A;">${insc.programme?.name || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #F0E8D8;">
        <td style="padding:10px 0;font-size:12px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;">Date</td>
        <td style="padding:10px 0;font-size:14px;color:#1E110A;">${dateStr}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-size:12px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;">Statut</td>
        <td style="padding:10px 0;font-size:14px;font-weight:600;color:#C9A84C;">${statusLabel}</td>
      </tr>
    </table>
    ${insc.message ? `
    <div style="background:#FDF8F2;border-left:3px solid #C9A84C;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;color:#9E8272;text-transform:uppercase;letter-spacing:1px;">Message de motivation</p>
      <p style="margin:0;font-size:14px;color:#3D2214;line-height:1.7;">${insc.message}</p>
    </div>` : ''}
    <a href="https://mia-dreams.com" style="display:block;text-align:center;background:linear-gradient(135deg,#C9A84C,#E0BC6A);color:#1E110A;font-weight:700;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:16px 24px;border-radius:8px;text-decoration:none;">
      VISITER MIA DREAMS →
    </a>
  </div>
  <div style="padding:20px 36px;border-top:1px solid #F0E8D8;text-align:center;">
    <p style="margin:0;font-size:10px;color:#C8B8A0;">MIA DREAMS & CO · Maison de mode africaine d'excellence</p>
  </div>
</div></body></html>`;

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
        });
        await transporter.sendMail({
            from:    `"MIA DREAMS & CO" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to:      dest,
            subject: `📋 Fiche d'inscription — ${insc.nom} · ${insc.programme?.name || 'MIA DREAMS'}`,
            html,
        });
        res.json({ success: true, sent_to: dest });
    } catch (e) {
        console.error('Erreur send-fiche :', e.message);
        res.status(500).json({ message: e.message });
    }
});

router.delete('/inscriptions/:id', async (req, res) => {
    try {
        await Inscription.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supprimé' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/admin/inscriptions — inscription manuelle par l'admin
router.post('/inscriptions', async (req, res) => {
    try {
        const { programme, nom, email, telephone, message, status } = req.body;
        if (!programme || !nom || !email) {
            return res.status(400).json({ message: 'Programme, nom et email sont requis.' });
        }
        const Programme = require('../models/Programme');
        const prog = await Programme.findById(programme);
        if (!prog) return res.status(404).json({ message: 'Programme introuvable.' });

        const inscription = await Inscription.create({
            programme,
            nom,
            email,
            telephone: telephone || '',
            message:   message   || '',
            status:    status    || 'en attente',
        });
        await inscription.populate('programme', 'name slug');
        res.status(201).json({ inscription });
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// ── Newsletter admin ──────────────────────────────────────────────────────────
const NewsletterCampaign = require('../models/NewsletterCampaign');
const { sendEmail } = (() => {
    const nodemailer = require('nodemailer');
    function getTransporter() {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return null;
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
        });
    }
    async function sendEmail({ to, subject, html, attachments = [] }) {
        const t = getTransporter();
        if (!t) throw new Error('Email non configuré (MAIL_USER/MAIL_PASS manquants)');
        await t.sendMail({ from: `"MIA DREAMS & CO" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`, to, subject, html, attachments });
    }
    return { sendEmail };
})();

// GET /api/admin/newsletters — liste des abonnés
router.get('/newsletters', async (req, res) => {
    try {
        const list = await Newsletter.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/admin/newsletters/:id — supprimer un abonné
router.delete('/newsletters/:id', async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/admin/newsletter/send-campaign — envoyer une campagne
router.post('/newsletter/send-campaign', async (req, res) => {
    const { subject, html_body, recipients, attachments: rawAttachments } = req.body;
    if (!subject || !html_body || !Array.isArray(recipients) || recipients.length === 0)
        return res.status(422).json({ message: 'Sujet, contenu et destinataires requis.' });

    const attachments = Array.isArray(rawAttachments)
        ? rawAttachments.filter(a => a?.content).map(a => ({
            filename:    a.filename,
            content:     Buffer.from(a.content, 'base64'),
            contentType: a.contentType,
          }))
        : [];

    let sent = 0, failed = 0;
    for (const email of recipients) {
        try {
            await sendEmail({ to: email, subject, html: html_body, attachments });
            sent++;
        } catch {
            failed++;
        }
    }

    // Sauvegarder dans l'historique
    await NewsletterCampaign.create({
        subject,
        body_text: req.body.body_text || '',
        recipients,
        sent,
        failed,
        attachments: (rawAttachments || []).map(a => ({ filename: a.filename, contentType: a.contentType })),
    }).catch(() => {});

    res.json({ sent, failed, total: recipients.length });
});

// GET /api/admin/newsletter/campaigns — historique des campagnes
router.get('/newsletter/campaigns', async (req, res) => {
    try {
        const campaigns = await NewsletterCampaign.find().sort({ sentAt: -1 }).limit(100);
        res.json(campaigns);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/admin/newsletter/campaigns/:id — supprimer une campagne de l'historique
router.delete('/newsletter/campaigns/:id', async (req, res) => {
    try {
        await NewsletterCampaign.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
