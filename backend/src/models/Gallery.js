const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    image:      { type: String, required: true },
    caption:    String,
    collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    brand:      { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    order:      { type: Number, default: 0 },
    is_active:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
