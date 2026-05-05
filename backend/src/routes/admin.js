const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

// Upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../../uploads')),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Helper CRUD factory
const crudRouter = (Model, fields = []) => {
    const r = express.Router();
    r.get('/',    async (req, res) => { try { res.json(await Model.find().sort('order createdAt')); } catch(e){ res.status(500).json({message:e.message}); }});
    r.get('/:id', async (req, res) => { try { const doc = await Model.findById(req.params.id); if(!doc) return res.status(404).json({message:'Introuvable'}); res.json(doc); } catch(e){ res.status(500).json({message:e.message}); }});
    r.post('/',   upload.fields(fields.map(f=>({name:f,maxCount:1}))), async (req, res) => {
        try {
            const data = { ...req.body };
            if(req.files) fields.forEach(f => { if(req.files[f]) data[f] = req.files[f][0].filename; });
            const doc = await Model.create(data);
            res.status(201).json(doc);
        } catch(e){ res.status(400).json({message:e.message}); }
    });
    r.put('/:id', upload.fields(fields.map(f=>({name:f,maxCount:1}))), async (req, res) => {
        try {
            const data = { ...req.body };
            if(req.files) fields.forEach(f => { if(req.files[f]) data[f] = req.files[f][0].filename; });
            const doc = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
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
router.use('/initiatives',  crudRouter(Initiative, ['image']));
router.use('/team',         crudRouter(TeamMember, ['photo']));
router.use('/contacts',     crudRouter(Contact));
router.use('/reservations', crudRouter(Reservation));
router.use('/newsletters',  crudRouter(Newsletter));

// Company info (singleton)
router.get('/company-info', async (req, res) => {
    try { res.json(await CompanyInfo.findOne() || {}); } catch(e){ res.status(500).json({message:e.message}); }
});
router.put('/company-info', upload.single('logo'), async (req, res) => {
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
