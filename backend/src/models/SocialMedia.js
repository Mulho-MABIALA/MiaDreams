const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    platform:  { type: String, required: true },
    url:       { type: String, required: true },
    icon:      String,
    order:     { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
