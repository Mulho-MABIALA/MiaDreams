/**
 * Pré-remplit la collection Section avec les slides Hero par défaut
 * uniquement s'il n'en existe aucun en base (idempotent).
 */
const Section = require('./models/Section');

const DEFAULT_HERO_SLIDES = [
    {
        page:      'home',
        type:      'hero_slide',
        subtitle:  'Maison de mode africaine',
        title:     'RÉVOLUTION',
        content:   "L'artisanat est au cœur de notre métier.",
        cta_label: 'DÉCOUVRIR',
        cta_href:  '/miaDreams',
        image:     '/img/index/home-image1.jpg',
        order:     1,
        is_active: true,
    },
    {
        page:      'home',
        type:      'hero_slide',
        subtitle:  'Nos collections',
        title:     'MIA DREAMS',
        content:   'Notre ligne de vêtements — élégance africaine contemporaine.',
        cta_label: 'EXPLORER',
        cta_href:  '/miaDreams',
        image:     '/img/index/home-image2.jpg',
        order:     2,
        is_active: true,
    },
    {
        page:      'home',
        type:      'hero_slide',
        subtitle:  'Nouveau',
        title:     'PERSONAL BRANDING',
        content:   'Développez votre style, affirmez votre leadership.',
        cta_label: "DÉCOUVRIR L'OFFRE",
        cta_href:  '/personalBranding',
        image:     '/img/index/home-image5.jpg',
        order:     3,
        is_active: true,
    },
];

async function seedSections() {
    try {
        const count = await Section.countDocuments({ page: 'home', type: 'hero_slide' });

        if (count === 0) {
            await Section.insertMany(DEFAULT_HERO_SLIDES);
            console.log(`✅ ${DEFAULT_HERO_SLIDES.length} slides Hero insérés en base.`);
        } else {
            console.log(`ℹ️  Slides Hero déjà présents (${count}) — aucune modification.`);
        }
    } catch (err) {
        console.error('Erreur seedSections :', err.message);
    }
}

module.exports = seedSections;
