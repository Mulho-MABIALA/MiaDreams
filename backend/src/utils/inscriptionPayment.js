/**
 * inscriptionPayment.js — Confirmation de paiement d'une inscription à une
 * formation payante. Logique partagée par tous les moyens de paiement :
 *   - CinetPay (principal) : routes /api/payment/cinetpay/verify + notify
 *   - Kkiapay (conservé)   : route /verify-payment + webhook Kkiapay
 *
 * Règle : on ne marque une inscription « payée » qu'avec un montant VÉRIFIÉ
 * auprès du prestataire (jamais ce qu'affirme le navigateur), égal au prix de
 * la formation. Idempotent : un double appel (retour client + webhook)
 * n'envoie qu'un seul reçu.
 */

const Inscription = require('../models/Inscription');
require('../models/Programme'); // enregistre le modèle pour populate()
const { getKkiapayClient } = require('./kkiapay');
const { sendInscriptionReceipt, pushAdminNotify } = require('./notify');

/**
 * @param {string} inscriptionId
 * @param {{ provider: string, reference: string, amount: number|null }} payment  montant vérifié, en FCFA
 *        (null si le prestataire ne le renvoie pas — CinetPay : montant fixé par notre serveur à l'init)
 * @returns {Promise<{ok: boolean, message?: string, inscription?, alreadyPaid?: boolean}>}
 */
async function finalizeInscriptionPayment(inscriptionId, { provider, reference, amount }) {
    if (!inscriptionId || !reference) {
        return { ok: false, message: 'Inscription ou référence de paiement manquante' };
    }

    const inscription = await Inscription.findById(inscriptionId).populate('programme');
    if (!inscription) return { ok: false, message: 'Inscription introuvable' };

    if (inscription.payment_status === 'paid') {
        return { ok: true, inscription, alreadyPaid: true };
    }

    const programme = inscription.programme;
    if (!programme || !programme.is_paid) {
        return { ok: false, message: 'Cette formation ne nécessite pas de paiement.' };
    }

    // Anti-fraude : le montant payé doit correspondre au prix (marge 1 FCFA).
    if (amount == null) amount = programme.price_amount || 0;
    else if (Math.abs(Math.round(amount) - Math.round(programme.price_amount || 0)) > 1) {
        console.warn(`⚠️  ${provider} (inscription) — montant payé (${amount}) ≠ prix formation (${programme.price_amount}) pour ${inscription._id}`);
        return { ok: false, message: 'Le montant payé ne correspond pas au prix de la formation.' };
    }

    // Mise à jour atomique : seul le premier appel passe (évite deux reçus si le
    // retour client et le webhook arrivent en même temps).
    const updated = await Inscription.findOneAndUpdate(
        { _id: inscription._id, payment_status: { $ne: 'paid' } },
        {
            payment_status: 'paid',
            payment_ref:    reference,
            payment_method: provider,
            amount_paid:    Math.round(amount),
            paid_at:        new Date(),
        },
        { new: true }
    ).populate('programme');

    if (!updated) {
        const current = await Inscription.findById(inscription._id).populate('programme');
        return { ok: true, inscription: current, alreadyPaid: true };
    }

    console.log(`✅ ${provider} — Paiement inscription confirmé : ${updated.nom} — ${programme.name}`);

    await Promise.allSettled([
        sendInscriptionReceipt(updated, programme),
        pushAdminNotify({
            title: '💳 Inscription payée',
            body:  `${updated.nom} — ${programme.name} — ${Math.round(amount).toLocaleString('fr-FR')} FCFA`,
            url:   '/admin/inscriptions',
        }),
    ]);

    return { ok: true, inscription: updated };
}

/** Marque une inscription en attente comme « échouée » (ne touche jamais une inscription payée). */
async function markInscriptionPaymentFailed(inscriptionId) {
    if (!inscriptionId) return;
    await Inscription.updateOne(
        { _id: inscriptionId, payment_status: 'pending' },
        { payment_status: 'failed' }
    );
}

/** Kkiapay : revérifie la transaction puis finalise. */
async function confirmInscriptionPayment(inscriptionId, transactionId) {
    if (!inscriptionId || !transactionId) {
        return { ok: false, message: 'inscriptionId et transactionId requis' };
    }

    let client;
    try {
        client = getKkiapayClient();
    } catch (e) {
        return { ok: false, message: 'Paiement en ligne non configuré. Contactez-nous par WhatsApp.' };
    }

    const verified = await client.verify(transactionId);
    if (verified.status !== 'SUCCESS') {
        await markInscriptionPaymentFailed(inscriptionId);
        return { ok: false, message: `Paiement non confirmé (statut : ${verified.status})` };
    }

    return finalizeInscriptionPayment(inscriptionId, {
        provider:  'kkiapay',
        reference: transactionId,
        amount:    verified.amount,
    });
}

module.exports = { finalizeInscriptionPayment, markInscriptionPaymentFailed, confirmInscriptionPayment };
