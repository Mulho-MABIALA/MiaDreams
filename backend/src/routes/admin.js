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

// ── Cloudinary (stockage cloud permanent) ─────────────────────────────────────
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const CLOUDINARY_READY = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

// ── Multer : mémoire si Cloudinary dispo, disque sinon ────────────────────────
const UPLOADS = path.join(__dirname, '../../../uploads');

const storage = CLOUDINARY_READY
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => cb(null, UPLOADS),
        filename:    (req, file, cb) => {
            const ext = file.mimetype === 'application/pdf' ? '.pdf' : '.webp';
            cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
        },
    });

const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Fichier non supporté (image ou PDF requis)'));
    },
});

// ── Upload vers Cloudinary ou compression locale ───────────────────────────────
async function processImages(req, res, next) {
    if (!req.files && !req.file) return next();
    try {
        const files = req.file ? [req.file] : Object.values(req.files || {}).flat();

        await Promise.all(files.map(async (file) => {
            if (file.mimetype.startsWith('image/')) {
                // ── Traitement image ──────────────────────────────────────
                if (CLOUDINARY_READY) {
                    const buffer = await sharp(file.buffer)
                        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 82 })
                        .toBuffer();

                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            { folder: 'miadreams', resource_type: 'image' },
                            (err, res) => err ? reject(err) : resolve(res)
                        ).end(buffer);
                    });

                    file.filename  = result.secure_url;
                    file.cloudinary = true;
                } else {
                    // Fallback disque local + sharp
                    const tmpPath = file.path + '.tmp';
                    fs.renameSync(file.path, tmpPath);
                    await sharp(tmpPath)
                        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 82 })
                        .toFile(file.path);
                    fs.unlinkSync(tmpPath);
                }

            } else if (file.mimetype === 'application/pdf') {
                // ── Traitement PDF ────────────────────────────────────────
                if (CLOUDINARY_READY) {
                    // Upload PDF vers Cloudinary en tant que ressource "raw"
                    const result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            { folder: 'miadreams', resource_type: 'raw' },
                            (err, res) => err ? reject(err) : resolve(res)
                        ).end(file.buffer);
                    });

                    file.filename  = result.secure_url;
                    file.cloudinary = true;
                    console.log(`📄 PDF uploadé sur Cloudinary : ${result.secure_url}`);
                }
                // Fallback disque : multer a déjà sauvegardé le fichier avec la bonne extension .pdf
            }
        }));
        next();
    } catch (e) { next(e); }
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
            if(req.files) fields.forEach(f => { if(req.files[f]) data[f] = req.files[f][0].filename; });
            const doc = await Model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: false });
            if(!doc) return res.status(404).json({message:'Introuvable'});
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
router.use('/collections',  crudRouter(Collection, ['image']));
router.use('/products',     crudRouter(Product, ['image']));
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
router.use('/contacts',     crudRouter(Contact));
router.use('/reservations', crudRouter(Reservation));
router.use('/newsletters',  crudRouter(Newsletter));

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

module.exports = router;
