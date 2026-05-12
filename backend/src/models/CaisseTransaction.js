const mongoose = require('mongoose');

const caisseSchema = new mongoose.Schema({
    type:          { type: String, enum: ['entree', 'sortie'], required: true },
    montant:       { type: Number, required: true, min: 0 },
    categorie:     { type: String, required: true },
    description:   { type: String, default: '' },
    date:          { type: Date, default: Date.now },
    mode_paiement: { type: String, enum: ['especes', 'wave', 'orange_money', 'free_money', 'virement', 'cheque', 'autre'], default: 'especes' },
    reference:     { type: String, default: '' },
    notes:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CaisseTransaction', caisseSchema);
