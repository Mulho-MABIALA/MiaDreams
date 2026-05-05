const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: String,
    image:       String,
    collection:  { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    order:       { type: Number, default: 0 },
    is_active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
