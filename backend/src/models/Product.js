const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:          { type: String, required: true },
    slug:          { type: String, unique: true, sparse: true },
    description:   String,
    price:         { type: Number, required: true, default: 0 },
    compare_price: Number,
    category:      { type: String, default: 'Prêt-à-porter' },
    image:         String,
    images:        [String],
    sizes:         [String],
    colors:        [String],
    stock:         { type: Number, default: 0 },
    collection:    { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    is_active:     { type: Boolean, default: true },
    is_featured:   { type: Boolean, default: false },
    order:         { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
