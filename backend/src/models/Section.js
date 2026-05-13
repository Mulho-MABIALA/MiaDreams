const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title:     String,
    subtitle:  String,
    content:   String,
    image:     String,
    page:      { type: String, required: true, index: true }, // 'home' | 'apropos' | ...
    type:      { type: String, index: true },                 // 'hero_slide' | 'tagline' | 'intro' | 'univers' | 'histoire' | 'stat' | 'valeur' | ...
    cta_label: String,
    cta_href:  String,
    video_url: String,
    order:     { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
