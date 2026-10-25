const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
    name:            { type: String, required: true },
    description:     String,
    // Marque à laquelle le catalogue est rattaché (affiché sur sa page). Vide = catalogue général.
    brand:           { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', default: null },
    cover_image:     String,
    pdf_path:        String,
    order:           { type: Number, default: 0 },
    is_active:       { type: Boolean, default: true },
    downloads_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Catalogue', catalogueSchema);
