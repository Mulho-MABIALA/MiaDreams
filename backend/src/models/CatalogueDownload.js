const mongoose = require('mongoose');

const catalogueDownloadSchema = new mongoose.Schema({
    catalogue:      { type: mongoose.Schema.Types.ObjectId, ref: 'Catalogue', required: true },
    catalogue_name: String,
    // Informations qualifiées
    nom:        { type: String, required: true },
    prenom:     { type: String, required: true },
    email:      { type: String, required: true },
    whatsapp:   { type: String },
    ville:      { type: String },
    pays:       { type: String },
    profession: { type: String },
    raisons:    { type: [String], default: [] }, // cases cochées
    downloaded_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CatalogueDownload', catalogueDownloadSchema);
