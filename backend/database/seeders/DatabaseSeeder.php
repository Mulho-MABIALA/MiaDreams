<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Catalogue;
use App\Models\Collection;
use App\Models\CompanyInfo;
use App\Models\Initiative;
use App\Models\Product;
use App\Models\Section;
use App\Models\Service;
use App\Models\SocialMedia;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'ibombogakossosylvestre@gmail.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');
        $adminName = env('ADMIN_NAME', 'Admin MiaDreams');

        // Admin user
        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'email_verified_at' => now(),
            ]
        );

        // Company Info
        CompanyInfo::firstOrCreate(
            ['email' => 'ibombogakossosylvestre@gmail.com'],
            [
                'address' => '3 rue Bégenger Ferraud; au sein de CTIC DAKAR',
                'phone' => '+221 76 463 91 69',
                'email' => 'ibombogakossosylvestre@gmail.com',
                'logo' => null,
            ]
        );

        // Social Media
        $socialMedia = [
            [
                'platform' => 'facebook',
                'url' => 'https://www.facebook.com/Madeinafricacouture',
                'icon' => 'img/footer/facebook.png',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'platform' => 'instagram',
                'url' => 'https://www.instagram.com/miadreams_brand/?hl=fr',
                'icon' => 'img/footer/instagram.png',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'platform' => 'youtube',
                'url' => 'https://www.youtube.com/channel/UCwzzX2LzGR3K3Y37wiSDmLw',
                'icon' => 'img/footer/youtube.png',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'platform' => 'linkedin',
                'url' => 'https://www.linkedin.com/company/ma-petite-robe-en-wax/',
                'icon' => 'img/footer/logo-linkedin.png',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($socialMedia as $sm) {
            SocialMedia::firstOrCreate(['platform' => $sm['platform']], $sm);
        }

        // Team Members
        TeamMember::firstOrCreate(
            ['name' => 'Khady SY SAVANE'],
            [
                'name' => 'Khady SY SAVANE',
                'role' => 'Fondatrice & Directrice',
                'bio' => "Dès son plus jeune âge, Khady SY SAVANE a côtoyé la culture du beau, de l'élégance et d'un art de vivre mêlant ses doubles origines, française et ivoirienne. Née d'un père couturier, styliste, modéliste diplômé de l'académie internationale de coupe LADEVEZE ROUSSEL & J.DARROUX en 1966, porter de beaux vêtements était avant tout une marque de respect.\n\nEntreprendre dans le secteur de la mode, c'est fait comme une évidence, un héritage familial et culturel, qui s'est transformé en passion. Son parcours atypique dans la vente, la police, et 10 années dans l'hôtellerie et la restauration haut de gamme ont développé sa persévérance, son goût du luxe, de l'étiquette, du savoir-vivre et de la gastronomie.\n\nCumulant plus d'une décennie d'expérience entrepreneuriale dans l'industrie de la mode, de retour au Sénégal, elle a créé sa startup en 2020, spécialisée dans la confection de produits artisanaux et le digital.",
                'image' => 'img/apropos/heri3.jpg',
                'order' => 1,
                'is_active' => true,
            ]
        );

        TeamMember::firstOrCreate(
            ['name' => 'Orlane Selena Bouanga'],
            [
                'name' => 'Orlane Selena Bouanga',
                'role' => 'Gestionnaire de Projets',
                'bio' => "Je détiens une licence en droit des affaires délivrée par l'Institut Supérieur de Management (ISM), où je poursuis actuellement mes études en Management de Projet.\n\nJe me suis lancée dans le projet \"ma petite robe en wax\" par amour pour la découverte de la couture et l'aspect innovant du projet. Ce projet et la personne qui le portait m'ont plu et depuis lors, me voilà dans l'aventure.\n\nAu sein de notre Fashion Program, j'ai assumé le rôle de gestionnaire de projets. L'entreprenariat est un véritable engagement pour moi et une source d'épanouissement.",
                'image' => 'img/apropos/heri4.jpg',
                'order' => 2,
                'is_active' => true,
            ]
        );

        // Brands
        $brands = [
            [
                'name' => 'Mia Dreams',
                'slug' => 'mia-dreams',
                'header_title' => 'APPORTER UNE TOUCHE D\'AUTHENTICITE DANS VOTRE DRESSING !',
                'description' => "Mia Dreams est une marque de mode et de style de vie aux influence Afro-vintage, créé en 2011 pour apporter une touche d'authenticité dans vos garde-robes. Toutes nos créations sont éditées en petites séries pour satisfaire les adeptes d'exclusivité. Nous proposons des pièces modernes, sophistiquées, élégantes et confortables.\n\nMia signifie Made In AFrica, une volonté pour nous de promouvoir notre culture et les savoir-faire des artisans. A cet effet, nous produisons toutes nos créations dans notre atelier au Sénégal depuis 2013.",
                'youtube_id' => null,
                'image' => null,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'MPREW',
                'slug' => 'mprew',
                'header_title' => 'MA PETITE ROBE EN WAX',
                'description' => "Ma Petite Robe en Wax (MPREW) est une application mobile innovante, première plateforme de cocréation entre la cliente et l'artisan. Cette application permet de concevoir des robes sur-mesure et de les personnaliser avec aisance.",
                'youtube_id' => null,
                'image' => null,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Personal Branding',
                'slug' => 'personal-branding',
                'header_title' => 'FORMULE PERSONAL BRANDING',
                'description' => "La formule Personal Branding est un accompagnement sur mesure pour les femmes entrepreneurs et professionnelles qui souhaitent affirmer leur image et leur identité visuelle à travers le vêtement.",
                'youtube_id' => null,
                'image' => null,
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Fashion Program',
                'slug' => 'fashion-program',
                'header_title' => 'FASHION PROGRAM - FORMATION ARTISANS',
                'description' => "Notre Fashion Program est un programme de formation dédié aux artisans tailleurs. Ce programme, axé sur le renforcement de compétences en coupe, couture et modélisme, intègre harmonieusement les aspects numériques et artisanaux, créant ainsi une synergie unique entre tradition et technologie.",
                'youtube_id' => null,
                'image' => null,
                'is_active' => true,
                'order' => 4,
            ],
        ];

        foreach ($brands as $brandData) {
            Brand::firstOrCreate(['slug' => $brandData['slug']], $brandData);
        }

        // Collections for Mia Dreams brand
        $miaDreamsBrand = Brand::where('slug', 'mia-dreams')->first();
        if ($miaDreamsBrand) {
            $collection = Collection::firstOrCreate(
                ['name' => 'BCBG', 'brand_id' => $miaDreamsBrand->id],
                [
                    'name' => 'BCBG',
                    'description' => 'Collection BCBG - Bon Chic Bon Genre',
                    'brand_id' => $miaDreamsBrand->id,
                    'order' => 1,
                ]
            );

            // Products for BCBG collection
            $products = [
                ['name' => 'Cape Scarlett', 'image' => 'img/miadreams/img3.jpg', 'order' => 1],
                ['name' => 'Tunique Lou', 'image' => 'img/miadreams/img4.jpg', 'order' => 2],
                ['name' => 'Julia Dress', 'image' => 'img/miadreams/img5.jpg', 'order' => 3],
            ];

            foreach ($products as $productData) {
                Product::firstOrCreate(
                    ['name' => $productData['name'], 'collection_id' => $collection->id],
                    array_merge($productData, ['collection_id' => $collection->id, 'is_active' => true])
                );
            }

            Collection::firstOrCreate(
                ['name' => 'Nouvelle Gamme 100% Coton', 'brand_id' => $miaDreamsBrand->id],
                [
                    'name' => 'Nouvelle Gamme 100% Coton',
                    'description' => 'Nouvelle gamme 100% coton, et tissus teints à la main',
                    'brand_id' => $miaDreamsBrand->id,
                    'order' => 2,
                ]
            );
        }

        // Sections for impact page
        $sections = [
            [
                'title' => 'MISSION',
                'subtitle' => null,
                'content' => 'Rendre accessible l\'artisanat africain d\'excellence',
                'image' => 'img/impact/symbole1.png',
                'page' => 'impact',
                'type' => 'mission',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'VISION',
                'subtitle' => null,
                'content' => 'Faire de l\'artisanat africain ce qui a de plus noble et de plus abouti',
                'image' => 'img/impact/symbole2.png',
                'page' => 'impact',
                'type' => 'vision',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'VALEUR',
                'subtitle' => null,
                'content' => "Créativité et innovation\nProfessionnalisme\nMode responsable\nMade In AFrica",
                'image' => 'img/impact/symbole3.png',
                'page' => 'impact',
                'type' => 'value',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'NOS ENGAGEMENTS',
                'subtitle' => null,
                'content' => "Chez nous, la durabilité n'est pas un simple point de destination, mais un périple incessant. Chaque jour, nous nous engageons dans ce voyage, guidés par notre conviction profonde. Chaque pas que nous faisons, aussi minuscule soit-il, est un pas vers une économie et une société qui célèbrent les artisans, honorent l'Afrique et préservent la nature.\n\nNous sommes pleinement conscients que notre parcours est semé d'embûches et de nouveaux défis surgissent chaque jour. Cependant, nous restons résolus à honorer notre engagement en tant qu'entreprise de mode responsable, focalisée sur la création et la fabrication de produits qui transcendent le temps tout en conservant leur qualité et leur pertinence.",
                'image' => null,
                'page' => 'impact',
                'type' => 'engagement',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($sections as $section) {
            Section::firstOrCreate(
                ['page' => $section['page'], 'type' => $section['type']],
                $section
            );
        }
    }
}
