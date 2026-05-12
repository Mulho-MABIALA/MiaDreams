/**
 * Synchronise l'administrateur avec les variables d'environnement Render.
 * Crée l'admin s'il n'existe pas, ou met à jour le mot de passe à chaque démarrage.
 */
const Admin = require('./models/Admin');

async function seedAdmin() {
    try {
        const email    = process.env.ADMIN_EMAIL    || 'admin@miadreams.com';
        const password = process.env.ADMIN_PASSWORD || 'Admin@2024';
        const name     = process.env.ADMIN_NAME     || 'Admin MiaDreams';

        let admin = await Admin.findOne({ email });

        if (!admin) {
            admin = new Admin({ name, email, password });
            await admin.save();
            console.log(`✅ Admin créé : ${email}`);
        } else {
            // Toujours resynchroniser le mot de passe depuis les env vars
            admin.name     = name;
            admin.password = password; // le pre-save hook va le hacher
            await admin.save();
            console.log(`🔄 Admin mis à jour : ${email}`);
        }
    } catch (err) {
        console.error('Erreur seed admin :', err.message);
    }
}

module.exports = seedAdmin;
