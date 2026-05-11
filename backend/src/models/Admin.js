const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, default: 'admin' },
}, { timestamps: true });

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
