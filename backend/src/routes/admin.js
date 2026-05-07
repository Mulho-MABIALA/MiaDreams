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

// Upload + compression sharp
const UPLOADS = path.join(__dirname, '../../../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Toujours stocker en .webp après compression
        cb(null, unique + '.webp');
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

// Middleware de compression : appelé après multer pour chaque image uploadée
async function compressImages(req, res, next) {
    if (!req.files && !req.file) return next();
    try {
        const files = req.file ? [req.file] : Object.values(req.files || {}).flat();
        await Promise.all(files.map(async (file) => {
            if (!file.mimetype.startsWith('image/')) return;
            const tmpPath = file.path + '.tmp';
            fs.renameSync(file.path, tmpPath);
            await sharp(tmpPath)
                .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 82 })
                .toFile(file.path);
            fs.unlinkSync(tmpPath);
        }));
        next();
    } catch (e) { next(e); }
}

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
        const update = {};
        if (order_status) update.order_status = order_status;
        if (payment_status) update.payment_status = payment_status;
        if (notes !== undefined) update.notes = notes;
        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!order) return res.status(404).json({ message: 'Introuvable' });
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
router.put('/company-info', upload.single('logo'), compressImages, async (req, res) => {
    try {
        const data = { ...req.body };
        if(req.file) data.logo = req.file.filename;
        const existing = await CompanyInfo.findOne();
        const doc = existing
            ? await CompanyInfo.findByIdAndUpdate(existing._id, data, { new: true })
            : await CompanyInfo.create(data);
        res.json(doc);
    } catch(e){ res.status(400).json({message:e.message}); }
});

module.exports = router;
