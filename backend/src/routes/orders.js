const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { notifyNewOrder, notifyOrderConfirmation } = require('../utils/notify');
const authMiddleware = require('../middleware/auth');

/** Sanitise un string — enlève les caractères dangereux */
const sanitize = (str) => typeof str === 'string' ? str.trim().substring(0, 500) : str;

// POST /api/orders — créer une commande (public)
router.post('/', async (req, res) => {
    try {
        const { items, customer, subtotal, shipping_fee, total, payment_method, notes } = req.body;

        if (!items?.length) return res.status(400).json({ message: 'Panier vide' });
        if (!customer?.name || !customer?.email || !customer?.phone)
            return res.status(400).json({ message: 'Informations client incomplètes' });

        // Validation email client
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
            return res.status(400).json({ message: 'Adresse email invalide' });

        // Sanitisation des champs client
        const safeCustomer = {
            name:    sanitize(customer.name),
            email:   customer.email.toLowerCase().trim().substring(0, 200),
            phone:   sanitize(customer.phone),
            address: sanitize(customer.address),
            city:    sanitize(customer.city),
        };

        // Vérification du stock
        const stockErrors = [];
        for (const item of items) {
            if (!item.product_id) continue;
            const product = await Product.findById(item.product_id).select('name stock');
            if (product && product.stock < item.quantity) {
                stockErrors.push(`"${product.name}" : stock insuffisant (${product.stock} disponible${product.stock > 1 ? 's' : ''})`);
            }
        }
        if (stockErrors.length) return res.status(400).json({ message: stockErrors.join(', ') });

        const order = await Order.create({
            items,
            customer: safeCustomer,
            subtotal,
            shipping_fee: shipping_fee || 0,
            total,
            payment_method,
            notes: sanitize(notes),
        });

        // Décrémenter le stock (atomic)
        await Promise.all(
            items
                .filter(i => i.product_id)
                .map(i => Product.findByIdAndUpdate(
                    i.product_id,
                    { $inc: { stock: -i.quantity } },
                    { new: true }
                ))
        );

        notifyNewOrder(order).catch(e => console.error('Notify admin error:', e.message));
        notifyOrderConfirmation(order).catch(e => console.error('Notify client error:', e.message));
        res.status(201).json(order);
    } catch (e) { res.status(400).json({ message: e.message }); }
});

// GET /api/orders/track/:number — suivi public par numéro de commande
router.get('/track/:number', async (req, res) => {
    try {
        const number = req.params.number.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        const order = await Order.findOne({ order_number: number });
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        // Retourner uniquement les infos nécessaires pour le suivi (pas les données sensibles)
        res.json({
            order_number: order.order_number,
            order_status: order.order_status,
            payment_status: order.payment_status,
            total: order.total,
            createdAt: order.createdAt,
            items: order.items.map(i => ({ name: i.name, quantity: i.quantity })),
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders/public/:id — détail client (public, champs limités)
router.get('/public/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .select('order_number order_status payment_status items subtotal shipping_fee total customer createdAt payment_method notes');
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders/:id — détail complet (admin seulement)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });
        res.json(order);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders/email/:email — historique par email (public, pour les clients)
router.get('/email/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email).toLowerCase().trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ message: 'Email invalide' });
        const orders = await Order.find({ 'customer.email': email })
            .select('order_number order_status payment_status items subtotal shipping_fee total customer createdAt payment_method')
            .sort({ createdAt: -1 }).limit(20);
        res.json(orders);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
