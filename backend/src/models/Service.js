const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: String,
    image:       String,
    order:       { type: Number, default: 0 },
    is_active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
