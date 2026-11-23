const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
    name:     { type: String, default: 'MIA DREAMS & CO' },
    tagline:  String,
    email:    String,
    phone:    String,
    whatsapp: String,
    address:  String,
    logo:     String,
    // Textes affichés aux clients dans la boutique (fiche produit + page boutique)
    shop_delivery: String,   // ex : "Livraison à domicile à Abidjan et environs"
    shop_payment:  String,   // ex : "Paiement sécurisé — Wave · Orange Money · MTN · Carte"
}, { timestamps: true });

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
