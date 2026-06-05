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
            // Aucun admin → créer comme super_admin
            const admin = new Admin({ name, email, password, role: 'super_admin' });
            await admin.save();
            console.log(`✅ Super admin créé : ${email}`);
        } else {
            // Migration : s'assurer que le 1er admin est bien super_admin
            await Admin.updateMany({ role: { $exists: false } }, { $set: { role: 'super_admin' } });
            await Admin.updateMany({ role: 'admin', permissions: { $exists: false } }, { $set: { permissions: [] } });
            // Le tout premier admin créé (le compte principal) devient super_admin
            const first = await Admin.findOne().sort({ createdAt: 1 });
            if (first && first.role !== 'super_admin') {
                await Admin.updateOne({ _id: first._id }, { $set: { role: 'super_admin' } });
                console.log(`✅ Migration : ${first.email} promu super_admin`);
            }
            console.log(`ℹ️  Admin déjà présent (${count} entrée(s)).`);
        }
    } catch (err) {
        console.error('Erreur seed admin :', err.message);
    }
}

module.exports = seedAdmin;
