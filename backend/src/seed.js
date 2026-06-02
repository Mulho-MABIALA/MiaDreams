/**
 * Crée l'administrateur uniquement s'il n'en existe aucun en base.
 * Ne jamais écraser un admin déjà existant (évite de perdre les credentials).
 */
const Admin = require('./models/Admin');

async function seedAdmin() {
    try {
        const email    = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const name     = process.env.ADMIN_NAME || 'Admin MiaDreams';

        // Refuser de créer un admin avec des credentials par défaut connus
        if (!email || !password) {
            console.warn('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD non configurés — seed admin ignoré. Configurez ces variables d\'environnement.');
            return;
        }

        // Chercher par email ET vérifier s'il existe déjà n'importe quel admin
        const count = await Admin.countDocuments({});

        if (count === 0) {
            // Aucun admin → créer
            const admin = new Admin({ name, email, password });
            await admin.save();
            console.log(`✅ Admin créé : ${email}`);
        } else {
            console.log(`ℹ️  Admin déjà présent (${count} entrée(s)) — aucune modification.`);
        }
    } catch (err) {
        console.error('Erreur seed admin :', err.message);
    }
}

module.exports = seedAdmin;
