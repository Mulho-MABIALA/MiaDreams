const express = require('express');
const router = express.Router();
const Programme = require('../models/Programme');
const Inscription = require('../models/Inscription');
const { pushAdminNotify, sendInscriptionConfirmation } = require('../utils/notify');
const { confirmInscriptionPayment } = require('../utils/inscriptionPayment');
const { resolveSiteUrl, isCinetpayConfigured, initPayment, buildMerchantTransactionId, returnUrls } = require('../utils/cinetpay');
const { paymentLimiter } = require('../middleware/rateLimiter');

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const EMAIL_RE     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Une place n'est « prise » que par une inscription gratuite ou payée.
// Les inscriptions en attente de paiement / échouées ne bloquent pas de place.
// ($nin inclut aussi les anciennes inscriptions sans champ payment_status.)
const OCCUPIES_PLACE = { payment_status: { $nin: ['pending', 'failed'] } };

const countTakenPlaces = (programmeId, excludeId) => Inscription.countDocuments({
    programme: programmeId,
    ...OCCUPIES_PLACE,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
});

const needsPayment = (programme) => !!programme.is_paid && programme.price_amount > 0;

// GET /api/programmes — liste des programmes actifs
router.get('/', async (req, res) => {
    try {
        const programmes = await Programme.find({ is_active: true }).sort({ order: 1, createdAt: 1 });
        res.json({ programmes });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// GET /api/programmes/:slug
router.get('/:slug', async (req, res) => {
    try {
        const programme = await Programme.findOne({ slug: req.params.slug, is_active: true });
        if (!programme) return res.status(404).json({ message: 'Programme introuvable' });
        const inscriptions_count = await countTakenPlaces(programme._id);
        res.json({ programme, inscriptions_count });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/programmes/:slug/inscriptions — soumettre une inscription
router.post('/:slug/inscriptions', async (req, res) => {
    try {
        const programme = await Programme.findOne({ slug: req.params.slug, is_active: true });
        if (!programme) return res.status(404).json({ message: 'Programme introuvable' });
        if (!programme.is_open) return res.status(400).json({ message: 'Les inscriptions sont fermées pour ce programme.' });

        const { nom, telephone, message } = req.body;
        const email = String(req.body.email || '').trim().toLowerCase();
        if (!nom || !email) return res.status(400).json({ message: 'Nom et email requis.' });
        if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Adresse email invalide.' });

        const paid = needsPayment(programme);

        if (paid) {
            // Déjà payé avec cet email → pas de double inscription / double paiement.
            const alreadyPaid = await Inscription.exists({ programme: programme._id, email, payment_status: 'paid' });
            if (alreadyPaid) return res.status(400).json({ message: 'Vous êtes déjà inscrit(e) à cette formation avec cet email.' });

            // Une tentative précédente non payée existe → on la réutilise (pas de doublon).
            const previous = await Inscription.findOne({
                programme: programme._id, email, payment_status: { $in: ['pending', 'failed'] },
            }).sort({ createdAt: -1 });

            if (previous) {
                if (programme.max_places > 0 && await countTakenPlaces(programme._id) >= programme.max_places) {
                    return res.status(400).json({ message: 'Toutes les places sont prises pour ce programme.' });
                }
                previous.nom = nom;
                previous.telephone = telephone;
                previous.message = message;
                previous.payment_status = 'pending';
                await previous.save();
                return res.status(200).json({
                    message: 'Inscription enregistrée, paiement requis.',
                    inscription: previous, needs_payment: true, amount: programme.price_amount,
                });
            }
        }

        if (programme.max_places > 0 && await countTakenPlaces(programme._id) >= programme.max_places) {
            return res.status(400).json({ message: 'Toutes les places sont prises pour ce programme.' });
        }

        const inscription = await Inscription.create({
            programme: programme._id, nom, email, telephone, message,
            payment_status: paid ? 'pending' : 'not_required',
        });

        pushAdminNotify({
            title: paid ? '🎓 Nouvelle inscription (paiement en attente)' : '🎓 Nouvelle inscription programme',
            body:  `${nom} — ${programme.name || 'Programme'}`,
            url:   '/admin/inscriptions',
        }).catch(e => console.error('Push admin inscription error:', e.message));

        if (!paid) {
            sendInscriptionConfirmation(inscription, programme).catch(e => console.error('Email confirmation inscription error:', e.message));
        }

        res.status(201).json({
            message: 'Inscription enregistrée avec succès.',
            inscription,
            needs_payment: paid,
            amount: paid ? programme.price_amount : 0,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

/**
 * POST /api/programmes/:slug/inscriptions/:id/pay
 * Formation payante : crée le paiement CinetPay et renvoie l'URL de paiement.
 * Le montant vient du prix de la formation en base, jamais du navigateur.
 * Retour client : /paiement/retour (voir routes/payment.js → /cinetpay/verify).
 */
router.post('/:slug/inscriptions/:id/pay', paymentLimiter, async (req, res) => {
    try {
        if (!OBJECT_ID_RE.test(req.params.id)) return res.status(400).json({ message: 'Inscription invalide' });

        const programme = await Programme.findOne({ slug: req.params.slug, is_active: true });
        if (!programme) return res.status(404).json({ message: 'Programme introuvable' });
        if (!needsPayment(programme)) return res.status(400).json({ message: 'Cette formation ne nécessite pas de paiement.' });

        const inscription = await Inscription.findOne({ _id: req.params.id, programme: programme._id });
        if (!inscription) return res.status(404).json({ message: 'Inscription introuvable' });
        if (inscription.payment_status === 'paid') return res.status(400).json({ message: 'Cette inscription est déjà payée.' });

        if (programme.max_places > 0 && await countTakenPlaces(programme._id, inscription._id) >= programme.max_places) {
            return res.status(400).json({ message: 'Toutes les places sont prises pour ce programme.' });
        }

        if (!isCinetpayConfigured()) {
            return res.status(503).json({ message: 'Le paiement en ligne n\'est pas encore configuré. Contactez-nous par WhatsApp.' });
        }

        const mtid = buildMerchantTransactionId('inscription', String(inscription._id));
        const tx = await initPayment({
            merchantTransactionId: mtid,
            amountXof:   programme.price_amount,
            designation: `Formation ${programme.name}`,
            customer:    { name: inscription.nom, email: inscription.email, phone: inscription.telephone },
            ...returnUrls(resolveSiteUrl(req), mtid),
        });

        await Inscription.updateOne({ _id: inscription._id }, { payment_status: 'pending', payment_ref: mtid });
        res.json({ payment_url: tx.payment_url, reference: mtid });
    } catch (e) {
        console.error('CinetPay init (inscription) error:', e.message, e.cinetpay ? JSON.stringify(e.cinetpay) : '');
        res.status(502).json({ message: 'Impossible de démarrer le paiement. Réessayez dans un instant.' });
    }
});

/**
 * POST /api/programmes/:slug/inscriptions/:id/verify-payment
 * (Kkiapay — conservé en secours, non utilisé par le frontend actuel.)
 */
router.post('/:slug/inscriptions/:id/verify-payment', async (req, res) => {
    try {
        const { transactionId } = req.body;
        const result = await confirmInscriptionPayment(req.params.id, transactionId);
        if (!result.ok) return res.status(400).json({ message: result.message });
        res.json({ success: true, inscription: result.inscription });
    } catch (e) {
        console.error('Erreur vérification paiement inscription:', e.message);
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
