const mongoose = require('mongoose');
const crypto   = require('crypto');

const tempInvoiceSchema = new mongoose.Schema({
    token:       { type: String, required: true, unique: true, default: () => crypto.randomBytes(20).toString('hex') },
    filename:    { type: String, default: 'facture.pdf' },
    data:        { type: Buffer, required: true },
    contentType: { type: String, default: 'application/pdf' },
    expiresAt:   { type: Date,   default: () => new Date(Date.now() + 72 * 60 * 60 * 1000) }, // 72h
}, { timestamps: true });

// MongoDB supprime automatiquement le document après expiresAt
tempInvoiceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TempInvoice', tempInvoiceSchema);
