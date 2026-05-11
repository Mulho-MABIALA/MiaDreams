/**
 * Crée l'administrateur initial si aucun n'existe dans la base de données.
 * Appelé automatiquement au démarrage du serveur.
 */
const Admin = require('./models/Admin');

async function seedAdmin() {
    try {
        const count = await Admin.countDocuments();
        if (count > 0) return; // Déjà initialisé

        const name     = process.env.ADMIN_NAME     || 'Admin MiaDreams';
        const email    = process.env.ADMIN_EMAIL    || 'admin@miadreams.com';
        const password = process.env.ADMIN_PASSWORD || 'Admin@2024';

        await Admin.create({ name, email, password });
        console.log(`✅ Admin créé : ${email}`);
    } catch (err) {
        console.error('Erreur seed admin :', err.message);
    }
}

module.exports = seedAdmin;
