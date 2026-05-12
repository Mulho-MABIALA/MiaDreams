const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/auth');
const CaisseTransaction = require('../models/CaisseTransaction');

// Toutes les routes sont protégées
router.use(authMiddleware);

// ── GET /api/caisse — liste + filtres ─────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { type, debut, fin, categorie, limit = 200 } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (categorie) filter.categorie = categorie;
        if (debut || fin) {
            filter.date = {};
            if (debut) filter.date.$gte = new Date(debut);
            if (fin)   filter.date.$lte = new Date(new Date(fin).setHours(23, 59, 59, 999));
        }
        const transactions = await CaisseTransaction.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .limit(Number(limit));
        res.json(transactions);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET /api/caisse/stats — résumé financier ──────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        const { debut, fin } = req.query;

        // Période courante (mois en cours par défaut)
        const now = new Date();
        const debutPeriode = debut ? new Date(debut) : new Date(now.getFullYear(), now.getMonth(), 1);
        const finPeriode   = fin   ? new Date(new Date(fin).setHours(23,59,59,999))
                                   : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const [allTime, periode] = await Promise.all([
            CaisseTransaction.aggregate([
                { $group: {
                    _id: '$type',
                    total: { $sum: '$montant' },
                    count: { $sum: 1 },
                }},
            ]),
            CaisseTransaction.aggregate([
                { $match: { date: { $gte: debutPeriode, $lte: finPeriode } } },
                { $group: {
                    _id: '$type',
                    total: { $sum: '$montant' },
                    count: { $sum: 1 },
                }},
            ]),
        ]);

        const parse = (data) => {
            const entree = data.find(d => d._id === 'entree') || { total: 0, count: 0 };
            const sortie = data.find(d => d._id === 'sortie') || { total: 0, count: 0 };
            return {
                entrees: entree.total,
                sorties: sortie.total,
                solde:   entree.total - sortie.total,
                nb_entrees: entree.count,
                nb_sorties: sortie.count,
            };
        };

        // Top catégories du mois
        const topCategories = await CaisseTransaction.aggregate([
            { $match: { date: { $gte: debutPeriode, $lte: finPeriode } } },
            { $group: { _id: { type: '$type', categorie: '$categorie' }, total: { $sum: '$montant' } } },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]);

        res.json({
            allTime: parse(allTime),
            periode: parse(periode),
            topCategories,
            debutPeriode,
            finPeriode,
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── POST /api/caisse — créer une transaction ──────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const tx = await CaisseTransaction.create(req.body);
        res.status(201).json(tx);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// ── PUT /api/caisse/:id — modifier ────────────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const tx = await CaisseTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tx) return res.status(404).json({ message: 'Transaction introuvable' });
        res.json(tx);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// ── DELETE /api/caisse/:id — supprimer ───────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        await CaisseTransaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supprimé' });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
