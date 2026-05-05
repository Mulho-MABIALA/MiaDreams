const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    description:  String,
    cover_image:  String,
    pdf_path:     String,
    order:        { type: Number, default: 0 },
    is_active:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Catalogue', catalogueSchema);
