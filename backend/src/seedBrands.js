/**
 * Initialise les 4 marques principales de MIA DREAMS dans la BDD.
 * Utilise upsert (slug unique) → ne jamais écraser les données existantes.
 */
const Brand      = require('./models/Brand');
const Collection = require('./models/Collection');

const DEFAULT_BRANDS = [
    {
        name:         'Mia Dreams Brand',
        slug:         'mia-dreams',
        href:         '/miaDreams',
        header_title: 'MIA DREAMS BRAND',
        description:  "Mia Dreams Brand est notre ligne de vêtements — une collection qui marie l'artisanat africain traditionnel aux codes de la mode contemporaine. Chaque pièce raconte une histoire.",
        order:        1,
        is_active:    true,
    },
    {
        name:         'MPREW',
        slug:         'mprew',
        href:         '/mprew',
        header_title: 'MPREW APP',
        description:  "Ma Petite Robe En Wax — notre application mobile dédiée à la mode africaine. Découvrez, personnalisez et commandez vos tenues en tissu wax directement depuis votre smartphone.",
        order:        2,
        is_active:    true,
    },
    {
        name:         'Fashion Program',
        slug:         'fashion-program',
        href:         '/fashionProgram',
        header_title: 'FASHION PROGRAM',
        description:  "Notre programme de formation complet destiné aux créateurs, stylistes et entrepreneurs de la mode africaine. Du design à la commercialisation, maîtrisez tous les codes du secteur.",
        order:        3,
        is_active:    true,
    },
    {
        name:         'Personal Branding',
        slug:         'personal-branding',
        href:         '/personalBranding',
        header_title: 'PERSONAL BRANDING',
        description:  "Développez votre style, affirmez votre leadership. Une méthode et un accompagnement uniques au service de votre image personnelle et professionnelle.",
        order:        4,
        is_active:    true,
    },
];

// Collections par défaut pour Mia Dreams Brand
const MIA_DREAMS_COLLECTIONS = [
    {
        name:        'Élégance Africaine',
        description: 'Notre collection phare — silhouettes modernes sublimées par les tissus et motifs africains traditionnels.',
        order:       1,
        is_active:   true,
    },
    {
        name:        'Kente Moderne',
        description: 'Le tissu kente réinterprété avec des coupes contemporaines pour la femme africaine d'aujourd'hui.',
        order:       2,
        is_active:   true,
    },
];

// Collections pour Fashion Program
const FASHION_PROGRAM_COLLECTIONS = [
    {
        name:        'Design & Création',
        description: 'Techniques de design, patronage, coupe et confection de vêtements africains.',
        order:       1,
        is_active:   true,
    },
    {
        name:        'Marketing & Entrepreneuriat',
        description: 'Stratégies de vente, branding, business plan et lancement de votre maison de mode.',
        order:       2,
        is_active:   true,
    },
];

// Collections pour Personal Branding
const PERSONAL_BRANDING_COLLECTIONS = [
    {
        name:        'Audit & Identité Visuelle',
        description: 'Analyse de votre image actuelle, définition de vos codes couleurs, matières et coupes signature.',
        order:       1,
        is_active:   true,
    },
    {
        name:        'Garde-robe Capsule',
        description: 'Constitution d\'une garde-robe cohérente et polyvalente pour toutes les occasions.',
        order:       2,
        is_active:   true,
    },
];

async function seedBrands() {
    try {
        let created = 0;
        let skipped = 0;

        for (const brandData of DEFAULT_BRANDS) {
            const exists = await Brand.findOne({ slug: brandData.slug });
            if (exists) {
                // Mettre à jour le href si il manque ou est incorrect
                if (!exists.href || exists.href !== brandData.href) {
                    await Brand.updateOne({ slug: brandData.slug }, { $set: { href: brandData.href } });
                    console.log(`🔄 Marque mise à jour : ${brandData.name} (href corrigé → ${brandData.href})`);
                } else {
                    console.log(`ℹ️  Marque déjà présente : ${brandData.name}`);
                }
                skipped++;
                continue;
            }

            // Créer la marque (le pre-save hook générera le slug, on le force via set)
            const brand = new Brand(brandData);
            brand.slug = brandData.slug; // forcer le slug exact
            await brand.save();
            console.log(`✅ Marque créée : ${brandData.name} → ${brandData.href}`);
            created++;

            // Créer les collections associées
            const collectionsMap = {
                'mia-dreams':       MIA_DREAMS_COLLECTIONS,
                'fashion-program':  FASHION_PROGRAM_COLLECTIONS,
                'personal-branding': PERSONAL_BRANDING_COLLECTIONS,
            };

            const cols = collectionsMap[brandData.slug] || [];
            for (const colData of cols) {
                const colExists = await Collection.findOne({ name: colData.name, brand: brand._id });
                if (!colExists) {
                    await Collection.create({ ...colData, brand: brand._id });
                    console.log(`   📁 Collection créée : ${colData.name}`);
                }
            }
        }

        if (created > 0) {
            console.log(`\n🎉 Seed marques terminé : ${created} créée(s), ${skipped} déjà présente(s).`);
        } else {
            console.log(`ℹ️  Toutes les marques principales sont déjà en base.`);
        }
    } catch (err) {
        console.error('❌ Erreur seed marques :', err.message);
    }
}

module.exports = seedBrands;
