const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    subject:    { type: String, required: true },
    body_text:  { type: String },
    recipients: [String],
    sent:       { type: Number, default: 0 },
    failed:     { type: Number, default: 0 },
    attachments: [{ filename: String, contentType: String }],
    sentAt:     { type: Date, default: Date.now },
}, { timestamps: false });

module.exports = mongoose.model('NewsletterCampaign', schema);
