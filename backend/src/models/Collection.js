const mongoose = require('mongoose');
const slugify = require('slugify');

const collectionSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    slug:        { type: String },
    description: String,
    image:       String,
    brand:       { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    is_active:   { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
}, { timestamps: true });

collectionSchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
    }
    next();
});

module.exports = mongoose.model('Collection', collectionSchema);
