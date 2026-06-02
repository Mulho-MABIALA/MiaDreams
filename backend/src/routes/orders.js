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
        const { items, customer, shipping_fee, payment_method, notes } = req.body;

        if (!items?.length) return res.status(400).json({ message: 'Panier vide' });
        if (!customer?.name || !customer?.email || !customer?.phone)
            return res.status(400).json({ message: 'Informations client incomplètes' });

        // Validation email client
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
            return res.status(400).json({ message: 'Adresse email invalide' });

        // Validation payment_method (whitelist explicite)
        const VALID_PAYMENT_METHODS = ['wave', 'orange_money', 'free_money', 'cinetpay', 'cash'];
        if (!VALID_PAYMENT_METHODS.includes(payment_method))
            return res.status(400).json({ message: 'Mode de paiement invalide' });

        // Sanitisation des champs client
        const safeCustomer = {
            name:    sanitize(customer.name),
            email:   customer.email.toLowerCase().trim().substring(0, 200),
            phone:   sanitize(customer.phone),
            address: sanitize(customer.address),
            city:    sanitize(customer.city),
        };

        // ── Recalcul des prix côté serveur (anti-manipulation) ────────────────
        let calculatedSubtotal = 0;
        const safeItems = [];

        for (const item of items) {
            if (!item.quantity || item.quantity < 1 || item.quantity > 100)
                return res.status(400).json({ message: 'Quantité invalide' });

            if (item.product_id) {
                // Article du catalogue → vérifier le prix réel en base
                const product = await Product.findById(item.product_id)
                    .select('name price stock is_active');

                if (!product || product.is_active === false)
                    return res.status(400).json({ message: `Produit introuvable : ${item.product_id}` });

                if (product.stock !== undefined && product.stock < item.quantity)
                    return res.status(400).json({ message: `"${product.name}" : stock insuffisant` });

                safeItems.push({
                    product_id: item.product_id,
                    name:       product.name,
                    image:      item.image || '',
                    price:      product.price,        // ← prix DB, pas client
                    quantity:   item.quantity,
                    size:       sanitize(item.size)  || '',
                    color:      sanitize(item.color) || '',
                });
                calculatedSubtotal += product.price * item.quantity;

            } else {
                // Article sans product_id (ex: POS admin) — prix fourni par le client
                if (!item.price || item.price <= 0)
                    return res.status(400).json({ message: 'Prix invalide' });
                safeItems.push({
                    name:     sanitize(item.name) || 'Article',
                    image:    item.image || '',
                    price:    Number(item.price),
                    quantity: item.quantity,
                    size:     sanitize(item.size)  || '',
                    color:    sanitize(item.color) || '',
                });
                calculatedSubtotal += Number(item.price) * item.quantity;
            }
        }

        // Frais de livraison : valider que c'est un nombre positif
        const safeShipping = Math.max(0, Math.min(50000, Number(shipping_fee) || 0));
        const calculatedTotal = calculatedSubtotal + safeShipping;

        // ── Décrémenter le stock de façon atomique (check + update en une opération) ──
        for (const item of safeItems) {
            if (!item.product_id) continue;
            const updated = await Product.findOneAndUpdate(
                { _id: item.product_id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
            if (!updated) {
                return res.status(400).json({ message: `"${item.name}" : stock insuffisant (mise à jour simultanée)` });
            }
        }

        const order = await Order.create({
            items:        safeItems,
            customer:     safeCustomer,
            subtotal:     calculatedSubtotal,
            shipping_fee: safeShipping,
            total:        calculatedTotal,
            payment_method,
            notes: sanitize(notes),
        });

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
            order_number:   order.order_number,
            order_status:   order.order_status,
            payment_status: order.payment_status,
            total:          order.total,
            createdAt:      order.createdAt,
            items: order.items.map(i => ({ name: i.name, quantity: i.quantity })),
        });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders/public/:id — détail client (vérification par order_number requise)
router.get('/public/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .select('order_number order_status payment_status items subtotal shipping_fee total customer createdAt payment_method notes');
        if (!order) return res.status(404).json({ message: 'Commande introuvable' });

        // Anti-IDOR : le demandeur doit prouver qu'il connaît le numéro de commande
        const { orderNumber } = req.query;
        if (!orderNumber || order.order_number !== orderNumber.toUpperCase().trim()) {
            return res.status(403).json({ message: 'Accès non autorisé — numéro de commande requis' });
        }

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

// GET /api/orders/email/:email — historique par email (champs PII réduits)
router.get('/email/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email).toLowerCase().trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ message: 'Email invalide' });

        const orders = await Order.find({ 'customer.email': email })
            // Ne pas exposer l'adresse complète ni le téléphone (PII sensible)
            .select('order_number order_status payment_status items subtotal shipping_fee total createdAt payment_method')
            .sort({ createdAt: -1 }).limit(20);
        res.json(orders);
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
