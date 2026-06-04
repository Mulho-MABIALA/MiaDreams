const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema({
    programme: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
    nom:       { type: String, required: true },
    email:     { type: String, required: true },
    telephone: String,
    message:   String,
    status:    { type: String, enum: ['en attente', 'acceptée', 'refusée'], default: 'en attente' },
}, { timestamps: true });

module.exports = mongoose.model('Inscription', inscriptionSchema);
