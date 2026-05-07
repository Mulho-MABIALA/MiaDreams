const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders — créer une commande
router.post('/', async (req, res) => {
    try {
        const { items, customer, subtotal, shipping_fee, total, payment_method, notes } = req.body;
        if (!items?.length) return res.status(400).json({ message: 'Panier vide' });
        if (!customer?.name || !customer?.email || !customer?.phone)
            return res.status(400).json({ message: 'Informations client incomplètes' });

        // Vérifier le stock disponible pour chaque article
        const stockErrors = [];
        for (const item of items) {
            if (!item.product_id) continue;
            const product = await Product.findById(item.product_id).select('name stock');
            if (product && product.stock < item.quantity) {
                stockErrors.push(`"${item.name}" : stock insuffisant (${product.stock} disponible${product.stock > 1 ? 's' : ''})`);
            }
        }
        if (stockErrors.length > 0) {
            return res.status(400).json({ message: stockErrors.join(', ') });
        }

        // Créer la commande
        const order = await Order.create({ items, customer, subtotal, shipping_fee: shipping_fee || 0, total, payment_method, notes });

        // Décrémenter le stock de chaque produit (atomic)
        await Promise.all(
            items
                .filter(i => i.product_id)
                .map(i => Product.findByIdAndUpdate(
                    i.product_id,
                    { $inc: { stock: -i.quantity } },
                    { new: true }
                ))
        );

        res.status(201).json(order);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// GET /api/orders/:id — détail d'une commande (par ID)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders/track/:number — suivi par numéro de commande
router.get('/track/:number', async (req, res) => {
    try {
        const order = await Order.findOne({ order_number: req.params.number.toUpperCase() });
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders/email/:email — historique par email
router.get('/email/:email', async (req, res) => {
    try {
        const orders = await Order.find({ 'customer.email': req.params.email })
            .sort({ createdAt: -1 }).limit(20);
        res.json(orders);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
