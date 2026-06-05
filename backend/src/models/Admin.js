const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modules disponibles dans le dashboard
const ALL_MODULES = [
    'pages', 'marques', 'collections', 'blog', 'galerie',
    'catalogues', 'temoignages', 'equipe', 'initiatives',
    'programmes', 'inscriptions', 'produits', 'commandes',
    'reservations', 'contacts', 'newsletter', 'pos', 'caisse', 'parametres',
];

const adminSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String, required: true },
    role:        { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
    permissions: { type: [String], default: [] }, // modules accessibles
    is_active:   { type: Boolean, default: true },
}, { timestamps: true });

adminSchema.statics.ALL_MODULES = ALL_MODULES;

// Hash le mot de passe avant de sauvegarder
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Vérifie le mot de passe
adminSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
