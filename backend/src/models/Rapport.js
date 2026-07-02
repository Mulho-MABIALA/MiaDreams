const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
    name:            { type: String, required: true }, // Titre du rapport
    period:          String,                            // Période, ex. « 2024 » ou « 1er semestre 2024 »
    description:     String,
    cover_image:     String,
    pdf_path:        String,
    order:           { type: Number, default: 0 },
    is_active:       { type: Boolean, default: true },
    downloads_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Rapport', rapportSchema);
