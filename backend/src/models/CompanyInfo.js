const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
    name:     { type: String, default: 'MIA DREAMS & CO' },
    tagline:  String,
    email:    String,
    phone:    String,
    whatsapp: String,
    address:  String,
    logo:     String,
}, { timestamps: true });

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
