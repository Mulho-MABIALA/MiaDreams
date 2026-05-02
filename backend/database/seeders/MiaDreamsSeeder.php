<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Collection;
use App\Models\CompanyInfo;
use App\Models\Product;
use App\Models\Section;
use App\Models\SocialMedia;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class MiaDreamsSeeder extends Seeder
{
    public function run(): void
    {
        // ── Company Info ──────────────────────────────────────────
        CompanyInfo::updateOrCreate(['id' => 1], [
            'name'        => 'MIA DREAMS & CO',
            'address'     => "3 rue Bégenger Ferraud\nau sein de CTIC DAKAR\nDakar, Sénégal",
            'phone'       => '+221 76 463 91 69',
            'email'       => 'contact@mia-dreams.com',
            'description' => 'Au-delà d\'une simple entreprise ou d\'une marque de vêtements, nous incarnons un univers contemporain de la mode africaine.',
        ]);

        // ── Social Media ──────────────────────────────────────────
        $socials = [
            ['platform' => 'Facebook',  'url' => 'https://www.facebook.com/Madeinafricacouture',              'icon' => 'img/footer/facebook.png',      'order' => 1],
            ['platform' => 'Instagram', 'url' => 'https://www.instagram.com/miadreams_brand/?hl=fr',          'icon' => 'img/footer/instagram.png',     'order' => 2],
            ['platform' => 'YouTube',   'url' => 'https://www.youtube.com/channel/UCwzzX2LzGR3K3Y37wiSDmLw', 'icon' => 'img/footer/youtube.png',       'order' => 3],
            ['platform' => 'LinkedIn',  'url' => 'https://www.linkedin.com/company/ma-petite-robe-en-wax/',   'icon' => 'img/footer/logo-linkedin.png', 'order' => 4],
        ];
        foreach ($socials as $s) {
            SocialMedia::updateOrCreate(
                ['platform' => $s['platform']],
                array_merge($s, ['is_active' => true])
            );
        }

        // ── Brands ────────────────────────────────────────────────
        $brandMia = Brand::updateOrCreate(['slug' => 'mia-dreams'], [
            'name'         => 'MIA DREAMS',
            'slug'         => 'mia-dreams',
            'header_title' => "APPORTER UNE TOUCHE D'AUTHENTICITÉ DANS VOTRE DRESSING !",
            'description'  => "MIA DREAMS est notre ligne de prêt-à-porter de luxe éthique, mêlant savoir-faire artisanal africain et élégance contemporaine.\n\nChaque pièce est imaginée et confectionnée au Sénégal, en valorisant les tissus africains authentiques (wax, bazin, kente, bogolan…) et les artisans locaux.\n\nNous croyons que la mode africaine mérite sa place dans la haute couture mondiale.",
            'is_active'    => true,
            'order'        => 1,
        ]);

        Brand::updateOrCreate(['slug' => 'mprew'], [
            'name'         => 'Ma Petite Robe En Wax',
            'slug'         => 'mprew',
            'header_title' => 'LA PREMIÈRE APPLICATION MOBILE DE CO-CRÉATION EN MODE AFRICAINE',
            'description'  => "Ma Petite Robe En Wax est la première application mobile de co-création entre la cliente et son artisan.\n\nElle permet de créer et de personnaliser sa robe en quelques clics grâce à un avatar 3D et une multitude d'options de tissu, manches et encolure.\n\nVous serez livré sous 3 semaines.",
            'is_active'    => true,
            'order'        => 2,
        ]);

        Brand::updateOrCreate(['slug' => 'personal-branding'], [
            'name'         => 'Personal Branding',
            'slug'         => 'personal-branding',
            'header_title' => 'DÉVELOPPEZ VOTRE IMAGE, AFFIRMEZ VOTRE LEADERSHIP',
            'description'  => "Notre offre Personal Branding propose une méthode et un accompagnement uniques au service de votre leadership.\n\nNous vous aidons à développer votre propre style dans une démarche bienveillante et ultra-professionnelle, pour constituer un dressing digne de la Haute Couture.",
            'is_active'    => true,
            'order'        => 3,
        ]);

        Brand::updateOrCreate(['slug' => 'fashion-program'], [
            'name'         => 'Fashion Program',
            'slug'         => 'fashion-program',
            'header_title' => 'FORMEZ-VOUS AUX MÉTIERS DE LA MODE AFRICAINE',
            'description'  => "Le Fashion Program est notre programme de formation dédié aux passionnés de mode qui souhaitent professionnaliser leur activité.\n\nNous proposons des formations en stylisme, en entrepreneuriat mode et en marketing de la mode africaine.",
            'is_active'    => true,
            'order'        => 4,
        ]);

        // ── Collections & Products (MIA DREAMS) ──────────────────
        $collectionBcbg = Collection::updateOrCreate(
            ['brand_id' => $brandMia->id, 'name' => 'BCBG'],
            ['brand_id' => $brandMia->id, 'name' => 'BCBG', 'order' => 1, 'is_active' => true]
        );

        $products = [
            ['name' => 'Cape Scarlett',    'image' => 'img/miadreams/img3.jpg', 'order' => 1],
            ['name' => 'Tunique Lou',      'image' => 'img/miadreams/img4.jpg', 'order' => 2],
            ['name' => 'Julia Dress',      'image' => 'img/miadreams/img5.jpg', 'order' => 3],
            ['name' => 'Blazer Kimono',    'image' => 'img/miadreams/img6.jpg', 'order' => 4],
            ['name' => 'Robe Ankara',      'image' => 'img/miadreams/img7.jpg', 'order' => 5],
            ['name' => 'Ensemble Bogolan', 'image' => 'img/miadreams/img8.jpg', 'order' => 6],
        ];
        foreach ($products as $p) {
            Product::updateOrCreate(
                ['collection_id' => $collectionBcbg->id, 'name' => $p['name']],
                array_merge($p, ['collection_id' => $collectionBcbg->id, 'is_active' => true])
            );
        }

        // ── Team Members ──────────────────────────────────────────
        TeamMember::updateOrCreate(['name' => 'Khady SY SAVANE'], [
            'name'      => 'Khady SY SAVANE',
            'role'      => 'Fondatrice & CEO',
            'bio'       => "Je me nomme Khady SY SAVANE, fondatrice de la startup MIA DREAMS & CO.\n\nMIA DREAMS & CO va au-delà de la simple entreprise : c'est un véritable univers qui gravite autour de la mode, du personal branding, de l'entrepreneuriat, de la décoration et de la gastronomie, influencé par une atmosphère africaine & contemporaine.\n\nIssue d'une famille de couturiers depuis 1966, j'ai grandi au cœur de la création textile. Ma mission : révéler la richesse de l'artisanat africain au monde entier.",
            'image'     => 'img/apropos/kariata.jpg',
            'order'     => 1,
            'is_active' => true,
        ]);

        // ── Impact Sections ───────────────────────────────────────
        $impactSections = [
            [
                'page'    => 'impact',
                'type'    => 'mission',
                'title'   => 'MISSION',
                'content' => 'Rendre accessible l\'artisanat africain d\'excellence à travers une mode éthique, contemporaine et inclusive.',
                'image'   => 'img/impact/symbole1.png',
                'order'   => 1,
            ],
            [
                'page'    => 'impact',
                'type'    => 'vision',
                'title'   => 'VISION',
                'content' => 'Devenir la référence mondiale de la mode africaine éthique et faire rayonner le savoir-faire artisanal du continent.',
                'image'   => 'img/impact/symbole2.png',
                'order'   => 2,
            ],
            [
                'page'    => 'impact',
                'type'    => 'value',
                'title'   => 'VALEURS',
                'content' => "Authenticité\nExcellence artisanale\nInnovation responsable\nInclusion & diversité\nAncrage africain",
                'image'   => 'img/impact/symbole3.png',
                'order'   => 3,
            ],
            [
                'page'    => 'impact',
                'type'    => 'engagement',
                'title'   => 'NOS ENGAGEMENTS',
                'content' => "Chez Mia Dreams and Co, notre engagement envers une mode éthique et responsable est au cœur de notre identité.\n\nNous croyons fermement que la mode peut être une force positive, contribuant non seulement à votre style, mais également au bien-être de la planète et de ses habitants.\n\nNous travaillons exclusivement avec des artisans locaux, valorisant les savoir-faire traditionnels et garantissant des conditions de travail dignes et équitables.",
                'image'   => null,
                'order'   => 4,
            ],
        ];

        foreach ($impactSections as $section) {
            Section::updateOrCreate(
                ['page' => $section['page'], 'type' => $section['type']],
                array_merge($section, ['is_active' => true])
            );
        }
    }
}
