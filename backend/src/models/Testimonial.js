const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    role:       String,
    company:    String,
    content:    { type: String, required: true },
    rating:     { type: Number, min: 1, max: 5, default: 5 },
    photo:      String,
    is_active:  { type: Boolean, default: false },
    order:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
