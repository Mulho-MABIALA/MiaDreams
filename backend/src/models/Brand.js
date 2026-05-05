const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    slug:         { type: String, unique: true },
    header_title: String,
    description:  String,
    youtube_id:   String,
    image:        String,
    is_active:    { type: Boolean, default: true },
    order:        { type: Number, default: 0 },
}, { timestamps: true });

brandSchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Brand', brandSchema);
