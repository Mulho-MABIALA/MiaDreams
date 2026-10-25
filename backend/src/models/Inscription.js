const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
    nom:       { type: String, required: true },
    email:     { type: String, required: true },
    telephone: String,
    message:   String,
    status:    { type: String, enum: ['en attente', 'acceptée', 'refusée'], default: 'en attente' },

    // ── Paiement (formations payantes uniquement — CinetPay) ─────────────────
    // 'not_required' : formation gratuite, aucun paiement attendu
    // 'pending'      : formation payante, inscription créée, paiement pas encore confirmé
    // 'paid'         : paiement vérifié côté serveur, reçu envoyé
    // 'failed'       : paiement annulé/échoué
    payment_status: { type: String, enum: ['not_required', 'pending', 'paid', 'failed'], default: 'not_required' },
    payment_ref:    String,   // merchant_transaction_id CinetPay
    payment_method: String,   // ex: 'cinetpay'
    amount_paid:    Number,   // montant payé (vérifié auprès du prestataire)
    paid_at:        Date,
}, { timestamps: true });

module.exports = mongoose.model('Inscription', inscriptionSchema);
