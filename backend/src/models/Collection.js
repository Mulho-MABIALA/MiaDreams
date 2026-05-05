const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: String,
    image:       String,
    brand:       { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
