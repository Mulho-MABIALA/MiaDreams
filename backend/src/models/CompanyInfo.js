const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
    address: String,
    phone:   String,
    email:   String,
    logo:    String,
}, { timestamps: true });

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
