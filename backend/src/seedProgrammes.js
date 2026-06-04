const Programme = require('./models/Programme');

module.exports = async function seedProgrammes() {
    try {
        const count = await Programme.countDocuments();
        if (count > 0) return; // déjà seeded

        await Programme.create([
            {
                name: 'Fashion Program',
                slug: 'fashion-program',
                description: "Notre Fashion Program est un programme de formation complet destiné aux créateurs, stylistes et entrepreneurs de la mode africaine. En quelques semaines, maîtrisez les codes du secteur.",
                format: 'présentiel',
                level: 'tous niveaux',
                is_open: true,
                is_active: true,
                order: 1,
                modules: [
                    { title: 'Design & Création', description: "Techniques de design, patronage, coupe et confection de vêtements africains." },
                    { title: 'Textile & Matières', description: "Découverte des tissus africains (wax, kente, bazin), leur histoire et leur utilisation." },
                    { title: "Gestion d'Atelier", description: "Organisation de la production, gestion des artisans et contrôle qualité." },
                    { title: 'Marketing & Vente', description: "Stratégies de vente, présence digitale et développement de clientèle." },
                    { title: 'Personal Branding', description: "Construction de votre identité de créateur et positionnement sur le marché." },
                    { title: 'Entrepreneuriat', description: "Business plan, financement, juridique et lancement de votre maison de mode." },
                ],
            },
            {
                name: 'Mia Startup',
                slug: 'mia-startup',
                description: "Mia Startup accompagne les entrepreneurs africains dans la création et le développement de leur entreprise. Un programme intensif pour passer de l'idée au marché.",
                format: 'hybride',
                level: 'tous niveaux',
                is_open: false,
                is_active: true,
                order: 2,
                modules: [],
            },
        ]);

        console.log('✅ Programmes seedés : Fashion Program + Mia Startup');
    } catch (e) {
        console.error('❌ Erreur seed programmes :', e.message);
    }
};
