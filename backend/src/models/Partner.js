const mongoose = require('mongoose');

// « Ils nous font confiance » — logos + noms des partenaires / clients
const partnerSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    logo:      String,
    website:   String, // lien optionnel (le logo devient cliquable)
    order:     { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
