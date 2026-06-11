const mongoose = require('mongoose');

const catalogueDownloadSchema = new mongoose.Schema({
    catalogue:     { type: mongoose.Schema.Types.ObjectId, ref: 'Catalogue', required: true },
    catalogue_name: String,
    email:         { type: String, required: true },
    downloaded_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CatalogueDownload', catalogueDownloadSchema);
