const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
    title:        { type: String, required: true },
    slug:         { type: String, unique: true },
    category:     String,
    author:       String,
    excerpt:      String,
    content:      String,
    cover_image:  String,
    reading_time: Number,
    is_featured:  { type: Boolean, default: false },
    is_published: { type: Boolean, default: true },
    published_at: Date,
}, { timestamps: true });

postSchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);
