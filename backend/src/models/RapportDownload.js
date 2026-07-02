const mongoose = require('mongoose');

const rapportDownloadSchema = new mongoose.Schema({
    rapport:       { type: mongoose.Schema.Types.ObjectId, ref: 'Rapport', required: true },
    rapport_name:  String,
    email:         { type: String, required: true },
    downloaded_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RapportDownload', rapportDownloadSchema);
