const mongoose = require('mongoose');

const initiativeSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: String,
    youtube_id:  String,
    image:       String,
    order:       { type: Number, default: 0 },
    is_active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Initiative', initiativeSchema);
