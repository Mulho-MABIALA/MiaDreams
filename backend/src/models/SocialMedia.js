const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    platform:  { type: String, required: true },
    url:       { type: String, default: '' },   // pas required — on peut ajouter avant de mettre l'URL
    icon:      String,
    order:     { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
