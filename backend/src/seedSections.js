/**
 * Pré-remplit la collection Section avec tout le contenu codé en dur côté client.
 * Idempotent : chaque groupe n'est inséré que si aucun document de ce (page, type)
 * n'existe déjà en base.
 */
const Section = require('./models/Section');

// ─── HOME ─────────────────────────────────────────────────────────────────────

const HOME_HERO_SLIDES = [
    {
        page: 'home', type: 'hero_slide', order: 1, is_active: true,
        subtitle:  'Maison de mode africaine',
        title:     'RÉVOLUTION',
        content:   "L'artisanat est au cœur de notre métier.",
        cta_label: 'DÉCOUVRIR',
        cta_href:  '/miaDreams',
        image:     '/img/index/home-image1.jpg',
    },
    {
        page: 'home', type: 'hero_slide', order: 2, is_active: true,
        subtitle:  'Nos collections',
        title:     'MIA DREAMS',
        content:   'Notre ligne de vêtements — élégance africaine contemporaine.',
        cta_label: 'EXPLORER',
        cta_href:  '/miaDreams',
        image:     '/img/index/home-image2.jpg',
    },
    {
        page: 'home', type: 'hero_slide', order: 3, is_active: true,
        subtitle:  'Nouveau',
        title:     'PERSONAL BRANDING',
        content:   'Développez votre style, affirmez votre leadership.',
        cta_label: "DÉCOUVRIR L'OFFRE",
        cta_href:  '/personalBranding',
        image:     '/img/index/home-image5.jpg',
    },
];

const HOME_INTRO = [
    {
        page: 'home', type: 'intro', order: 1, is_active: true,
        title:     "Notre startup diffuse l'ensemble de la richesse culturelle du continent africain",
        content:   "Au-delà d'une simple entreprise ou d'une marque de vêtements, nous incarnons un univers contemporain de la mode africaine. Notre savoir-faire dans l'industrie textile du continent est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique. Plaçant l'humain au cœur de notre métier, nous faisons de chaque création une expression de notre engagement envers l'excellence et l'authenticité.",
        cta_label: 'VIEW WORK →',
        cta_href:  '/apropos',
    },
];

const HOME_TAGLINE = [
    {
        page: 'home', type: 'tagline', order: 1, is_active: true,
        content: "Plus qu'une entreprise, un univers authentique aux inspirations africaines et contemporaines.",
    },
];

const HOME_UNIVERS = [
    {
        page: 'home', type: 'univers', order: 1, is_active: true,
        subtitle: '01',
        title:    'Mia Dreams Brand',
        content:  'Notre ligne de vêtements',
        cta_href: '/miaDreams',
        image:    '/img/index/home-image2.jpg',
    },
    {
        page: 'home', type: 'univers', order: 2, is_active: true,
        subtitle: '02',
        title:    'Ma Petite Robe En Wax',
        content:  'Notre application mobile',
        cta_href: '/mprew',
        image:    '/img/index/home-image3.jpg',
    },
    {
        page: 'home', type: 'univers', order: 3, is_active: true,
        subtitle: '03',
        title:    'Fashion Program',
        content:  'Notre programme de formation',
        cta_href: '/fashionProgram',
        image:    '/img/index/home-image4.jpg',
    },
];

const HOME_PERSONAL_BRANDING = [
    {
        page: 'home', type: 'personal_branding', order: 1, is_active: true,
        subtitle:  'Nouveau',
        title:     'OFFRE EN PERSONAL BRANDING',
        content:   "Une méthode et un accompagnement uniques au service de votre leadership, qui vous font gagner du temps. Nous allons vous aider à développer votre propre style, dans une démarche bienveillante.",
        cta_label: 'DÉCOUVRIR NOTRE OFFRE',
        cta_href:  '/personalBranding',
        image:     '/img/index/home-image5.jpg',
    },
];

const HOME_ETHICAL_FASHION = [
    {
        page: 'home', type: 'ethical_fashion', order: 1, is_active: true,
        subtitle:  'Engagement',
        title:     'ETHICAL FASHION',
        content:   "Chez Mia Dreams and Co, notre engagement envers une mode éthique et responsable est au cœur de notre identité. Nous croyons fermement que la mode peut être une force positive pour les communautés africaines.",
        cta_label: 'NOS ENGAGEMENTS →',
        cta_href:  '/impact',
        image:     '/img/index/home-image6.jpg',
    },
];

const HOME_BLOG_BANNER = [
    {
        page: 'home', type: 'blog_banner', order: 1, is_active: true,
        subtitle:  'Nos derniers articles',
        title:     'BLOG & PODCAST',
        content:   "Bienvenue dans l'univers d'OTENTIK MIA — mode, personal branding, entrepreneuriat & culture africaine.",
        cta_label: 'DÉCOUVRIR',
        cta_href:  '/blog',
        image:     '/img/index/home-image7.webp',
    },
];

// ─── À PROPOS ─────────────────────────────────────────────────────────────────

const APROPOS_HISTOIRE = [
    {
        page: 'apropos', type: 'histoire', order: 1, is_active: true,
        subtitle: 'Depuis 2018',
        title:    'NOTRE HISTOIRE',
        content:  "MIA DREAMS & CO est une startup sénégalaise qui diffuse l'ensemble de la richesse culturelle du continent africain à travers la mode, le style et l'entrepreneuriat.\n\nFondée à Dakar, notre maison de mode incarne un univers contemporain africain. Notre savoir-faire dans l'industrie textile est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique.",
    },
];

const APROPOS_STATS = [
    { page: 'apropos', type: 'stat', order: 1, is_active: true, subtitle: '5+', title: "Années d'expérience" },
    { page: 'apropos', type: 'stat', order: 2, is_active: true, subtitle: '4',  title: 'Marques & offres' },
    { page: 'apropos', type: 'stat', order: 3, is_active: true, subtitle: '100+', title: 'Clients satisfaits' },
];

const APROPOS_VALEURS = [
    {
        page: 'apropos', type: 'valeur', order: 1, is_active: true,
        subtitle: '01', title: 'Authenticité',
        content:  "Chaque création reflète l'âme de l'Afrique, ses traditions et sa modernité.",
    },
    {
        page: 'apropos', type: 'valeur', order: 2, is_active: true,
        subtitle: '02', title: 'Excellence',
        content:  'Nous visons la perfection dans chaque détail, chaque tissu, chaque couture.',
    },
    {
        page: 'apropos', type: 'valeur', order: 3, is_active: true,
        subtitle: '03', title: 'Innovation',
        content:  "Allier savoir-faire artisanal et vision contemporaine pour créer l'unique.",
    },
    {
        page: 'apropos', type: 'valeur', order: 4, is_active: true,
        subtitle: '04', title: 'Durabilité',
        content:  "Une mode responsable qui respecte les artisans, les matières et l'environnement.",
    },
    {
        page: 'apropos', type: 'valeur', order: 5, is_active: true,
        subtitle: '05', title: 'Communauté',
        content:  "Créer du lien, valoriser les talents locaux et soutenir l'entrepreneuriat africain.",
    },
    {
        page: 'apropos', type: 'valeur', order: 6, is_active: true,
        subtitle: '06', title: 'Empowerment',
        content:  "Permettre à chacun d'exprimer son identité et d'affirmer sa singularité.",
    },
];

// ─── IMPACT ───────────────────────────────────────────────────────────────────

const IMPACT_MVV = [
    {
        page: 'impact', type: 'impact_mvv', order: 1, is_active: true,
        subtitle: 'Mission',
        content:  "Diffuser la richesse culturelle africaine à travers une mode éthique, innovante et accessible.",
    },
    {
        page: 'impact', type: 'impact_mvv', order: 2, is_active: true,
        subtitle: 'Vision',
        content:  "Devenir la référence mondiale de la mode africaine contemporaine d'excellence.",
    },
    {
        page: 'impact', type: 'impact_mvv', order: 3, is_active: true,
        subtitle: 'Valeurs',
        content:  "Authenticité, excellence, durabilité, communauté — au cœur de chaque décision.",
    },
];

const IMPACT_STATS = [
    { page: 'impact', type: 'impact_stat', order: 1, is_active: true, subtitle: '500+', title: 'Pièces créées' },
    { page: 'impact', type: 'impact_stat', order: 2, is_active: true, subtitle: '100+', title: 'Artisans soutenus' },
    { page: 'impact', type: 'impact_stat', order: 3, is_active: true, subtitle: '4',    title: 'Programmes actifs' },
    { page: 'impact', type: 'impact_stat', order: 4, is_active: true, subtitle: '5+',   title: "Années d'impact" },
];

const IMPACT_ENGAGEMENTS = [
    {
        page: 'impact', type: 'impact_engagement', order: 1, is_active: true,
        subtitle: '01', title: 'Mode Éthique',
        content:  "Nous sélectionnons des matières premières durables, favorisons des processus de production respectueux de l'environnement.",
    },
    {
        page: 'impact', type: 'impact_engagement', order: 2, is_active: true,
        subtitle: '02', title: 'Valorisation Artisanale',
        content:  "Nous collaborons avec des artisans locaux, préservant les techniques traditionnelles tout en créant de l'emploi.",
    },
    {
        page: 'impact', type: 'impact_engagement', order: 3, is_active: true,
        subtitle: '03', title: 'Fashion Program',
        content:  "Notre programme de formation accompagne la nouvelle génération de créateurs africains vers l'excellence.",
    },
    {
        page: 'impact', type: 'impact_engagement', order: 4, is_active: true,
        subtitle: '04', title: 'Personal Branding',
        content:  "Nous aidons les entrepreneurs africains à développer leur identité visuelle et à affirmer leur leadership.",
    },
];

// ─── Groupes à insérer ────────────────────────────────────────────────────────

const GROUPS = [
    // Home
    { page: 'home',    type: 'hero_slide',        data: HOME_HERO_SLIDES },
    { page: 'home',    type: 'intro',              data: HOME_INTRO },
    { page: 'home',    type: 'tagline',            data: HOME_TAGLINE },
    { page: 'home',    type: 'univers',            data: HOME_UNIVERS },
    { page: 'home',    type: 'personal_branding',  data: HOME_PERSONAL_BRANDING },
    { page: 'home',    type: 'ethical_fashion',    data: HOME_ETHICAL_FASHION },
    { page: 'home',    type: 'blog_banner',        data: HOME_BLOG_BANNER },
    // À Propos
    { page: 'apropos', type: 'histoire',           data: APROPOS_HISTOIRE },
    { page: 'apropos', type: 'stat',               data: APROPOS_STATS },
    { page: 'apropos', type: 'valeur',             data: APROPOS_VALEURS },
    // Impact
    { page: 'impact',  type: 'impact_mvv',         data: IMPACT_MVV },
    { page: 'impact',  type: 'impact_stat',        data: IMPACT_STATS },
    { page: 'impact',  type: 'impact_engagement',  data: IMPACT_ENGAGEMENTS },
];

async function seedSections() {
    let inserted = 0;
    let skipped  = 0;

    for (const { page, type, data } of GROUPS) {
        try {
            const count = await Section.countDocuments({ page, type });
            if (count === 0) {
                await Section.insertMany(data);
                console.log(`✅ [seed] ${data.length} doc(s) insérés → page="${page}" type="${type}"`);
                inserted += data.length;
            } else {
                console.log(`ℹ️  [seed] Déjà présents (${count}) → page="${page}" type="${type}" — ignoré`);
                skipped++;
            }
        } catch (err) {
            console.error(`❌ [seed] Erreur page="${page}" type="${type}" :`, err.message);
        }
    }

    console.log(`\n📦 Seed terminé : ${inserted} document(s) insérés, ${skipped} groupe(s) ignorés.`);
}

module.exports = seedSections;
