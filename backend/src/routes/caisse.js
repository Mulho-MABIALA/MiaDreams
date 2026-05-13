const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/auth');
const CaisseTransaction = require('../models/CaisseTransaction');
const Order   = require('../models/Order');
const Product = require('../models/Product');

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

// ── POST /api/caisse/vente — vente directe POS ───────────────────────────────
// Crée simultanément une commande (Order) + une transaction caisse (entrée)
router.post('/vente', async (req, res) => {
    try {
        const {
            items,           // [{ product_id, name, price, quantity, size, color, image }]
            customer,        // { name, phone, address? }
            payment_method,  // 'especes' | 'wave' | 'orange_money'
            notes,
            remise,          // montant de remise en FCFA (optionnel)
        } = req.body;

        if (!items?.length) return res.status(400).json({ message: 'Panier vide' });

        // Vérifier et décrémenter le stock
        for (const item of items) {
            if (!item.product_id) continue;
            const product = await Product.findById(item.product_id).select('name stock');
            if (product && product.stock < item.quantity) {
                return res.status(400).json({
                    message: `"${item.name}" : stock insuffisant (${product.stock} dispo)`
                });
            }
        }

        const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const remiseMt  = Number(remise) || 0;
        const total     = Math.max(0, subtotal - remiseMt);

        // 1. Créer la commande
        const order = await Order.create({
            items,
            customer: {
                name:    customer?.name  || 'Client comptoir',
                email:   customer?.email || 'comptoir@miadreams.com',
                phone:   customer?.phone || '',
                address: customer?.address || 'Vente en boutique',
            },
            subtotal,
            shipping_fee: 0,
            total,
            payment_method,
            notes: notes || '',
            status: 'confirmed',   // vente directe = déjà confirmée
        });

        // 2. Décrémenter le stock
        await Promise.all(
            items
                .filter(i => i.product_id)
                .map(i => Product.findByIdAndUpdate(
                    i.product_id,
                    { $inc: { stock: -i.quantity } },
                    { new: true }
                ))
        );

        // 3. Créer la transaction caisse
        const description = items.map(i => `${i.quantity}× ${i.name}`).join(', ');
        const tx = await CaisseTransaction.create({
            type:          'entree',
            montant:       total,
            categorie:     'Vente boutique',
            description:   description + (remiseMt > 0 ? ` (remise ${remiseMt.toLocaleString('fr-FR')} FCFA)` : ''),
            date:          new Date(),
            mode_paiement: payment_method === 'especes' ? 'especes'
                         : payment_method === 'wave'    ? 'wave'
                         : payment_method === 'orange_money' ? 'orange_money' : 'especes',
            reference:     order.order_number,
            notes:         customer?.name ? `Client: ${customer.name}` : '',
        });

        res.status(201).json({ order, transaction: tx });
    } catch (e) { res.status(400).json({ message: e.message }); }
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
