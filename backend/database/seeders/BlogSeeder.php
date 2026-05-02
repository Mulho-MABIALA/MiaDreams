<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Podcast;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // ── ARTICLES ────────────────────────────────────────────
        $posts = [
            [
                'title'        => 'La mode africaine contemporaine : entre tradition et modernité',
                'category'     => 'Mode',
                'author'       => 'Kariata Savane',
                'excerpt'      => 'Comment la mode africaine réinvente ses codes en s\'inspirant de l\'artisanat local pour conquérir les podiums internationaux.',
                'content'      => '<p>La mode africaine contemporaine vit une renaissance extraordinaire. Des créateurs comme Kariata Savane chez MIA DREAMS & CO prouvent que l\'Afrique n\'a pas besoin de copier l\'Occident pour briller.</p><p>Les tissus wax, le bazin, le bogolan — autant de matières qui racontent une histoire, celle de peuples créatifs et résilients. Chez MIA DREAMS, chaque pièce est une lettre d\'amour à ce continent.</p><p>La tendance du "slow fashion" africain gagne du terrain : des collections limitées, des artisans valorisés, des chaînes de production courtes et équitables.</p>',
                'reading_time' => 5,
                'is_featured'  => true,
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'title'        => 'Personal Branding : construire son image en tant que femme entrepreneur africaine',
                'category'     => 'Personal Branding',
                'author'       => 'Kariata Savane',
                'excerpt'      => 'Votre image professionnelle est votre premier capital. Découvrez comment l\'affirmer avec authenticité et puissance.',
                'content'      => '<p>Être une femme entrepreneur en Afrique, c\'est naviguer dans un univers qui n\'a pas toujours été conçu pour vous. Pourtant, de plus en plus de femmes tracent leur propre chemin, avec audace et créativité.</p><p>Le personal branding ne consiste pas à se créer un personnage fictif. Il s\'agit d\'amplifier ce qui est déjà en vous : vos valeurs, votre vision, votre authenticité.</p><h2>Les 3 piliers d\'un personal branding fort</h2><ul><li><strong>La cohérence</strong> : votre image vestimentaire, digitale et comportementale doivent parler le même langage.</li><li><strong>L\'authenticité</strong> : personne ne peut vous concurrencer sur le terrain de votre propre histoire.</li><li><strong>La visibilité</strong> : être excellente ne suffit pas — il faut aussi se montrer.</li></ul>',
                'reading_time' => 7,
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => now()->subDays(8),
            ],
            [
                'title'        => 'L\'artisanat sénégalais : un trésor à préserver et à valoriser',
                'category'     => 'Artisanat',
                'author'       => 'Kariata Savane',
                'excerpt'      => 'Les tailleurs, tisserands et brodeurs du Sénégal sont les gardiens d\'un savoir-faire millénaire. Comment les accompagner dans la modernité ?',
                'content'      => '<p>Au cœur de Dakar, dans les ateliers de Colobane ou du marché Sandaga, des artisans transmettent un savoir-faire de génération en génération. Leurs mains racontent l\'histoire du Sénégal.</p><p>Chez MIA DREAMS & CO, nous travaillons directement avec ces artisans. Notre programme MPREW leur offre les outils numériques pour accéder à de nouveaux marchés sans sacrifier leur authenticité.</p>',
                'reading_time' => 6,
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => now()->subDays(15),
            ],
            [
                'title'        => 'Fashion Program : former la prochaine génération de créateurs africains',
                'category'     => 'Entrepreneuriat',
                'author'       => 'Kariata Savane',
                'excerpt'      => 'Notre programme intensif de 400h transforme des passionnés de mode en professionnels complets : technique, marketing digital et business.',
                'content'      => '<p>Le Fashion Program de MIA DREAMS & CO est né d\'un constat simple : les écoles de mode en Afrique forment rarement aux réalités du marché contemporain. Technique sans marketing digital, créativité sans vision business — le fossé entre la formation et l\'emploi reste immense.</p><p>Nous avons conçu un programme de 400h qui intègre la maîtrise technique du vêtement, le marketing digital, la gestion d\'entreprise et la culture entrepreneuriale africaine.</p>',
                'reading_time' => 8,
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => now()->subDays(22),
            ],
            [
                'title'        => 'Slow fashion vs fast fashion : le choix éthique de la mode africaine',
                'category'     => 'Mode',
                'author'       => 'Kariata Savane',
                'excerpt'      => 'Face à l\'industrie de la mode rapide et polluante, la mode africaine éthique offre une alternative responsable et culturellement riche.',
                'content'      => '<p>L\'industrie de la mode est la deuxième plus polluante au monde. Les modèles de fast fashion produisent des millions de pièces qui finissent dans des décharges, notamment en Afrique.</p><p>MIA DREAMS choisit délibérément l\'autre voie : des collections limitées, des matières locales, des artisans rémunérés équitablement. Chaque pièce est pensée pour durer, pas pour être jetée.</p>',
                'reading_time' => 5,
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => now()->subDays(30),
            ],
            [
                'title'        => 'Style africain : 5 façons de porter le wax au quotidien',
                'category'     => 'Lifestyle',
                'author'       => 'Kariata Savane',
                'excerpt'      => 'Le wax n\'est plus seulement pour les cérémonies. Voici comment intégrer ce tissu emblématique dans votre garde-robe du quotidien.',
                'content'      => '<p>Le wax, ce tissu aux motifs colorés et aux histoires infinies, mérite d\'être porté au-delà des mariages et baptêmes. Voici 5 façons de l\'intégrer dans votre style de tous les jours.</p><ol><li><strong>Le wax en blazer</strong> : un blazer en wax sur un jean blanc — élégance assurée.</li><li><strong>Les accessoires wax</strong> : sacs, turbans, boucles d\'oreilles — petites touches, grand impact.</li><li><strong>Le mix &amp; match</strong> : associer une pièce wax avec des matières neutres comme le lin ou le coton blanc.</li></ol>',
                'reading_time' => 4,
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => now()->subDays(40),
            ],
        ];

        foreach ($posts as $data) {
            $data['slug'] = Str::slug($data['title']);
            Post::updateOrCreate(['slug' => $data['slug']], $data);
        }

        // ── PODCASTS ─────────────────────────────────────────────
        $podcasts = [
            [
                'title'          => 'Kariata Savane : la mode africaine comme acte politique',
                'episode_number' => 5,
                'season'         => '1',
                'guest'          => null,
                'description'    => 'Dans cet épisode solo, Kariata revient sur son parcours, sa vision de la mode africaine éthique et pourquoi créer MIA DREAMS & CO était un acte militant autant qu\'entrepreneurial.',
                'duration'       => '52:18',
                'spotify_url'    => null,
                'apple_url'      => null,
                'youtube_url'    => null,
                'is_published'   => true,
                'published_at'   => now()->subDays(5),
            ],
            [
                'title'          => 'Personal Branding pour entrepreneurs africains avec Dr. Aïssatou Diop',
                'episode_number' => 4,
                'season'         => '1',
                'guest'          => 'Dr. Aïssatou Diop',
                'description'    => 'La consultante en image Dr. Aïssatou Diop nous explique comment les entrepreneurs africains peuvent construire une marque personnelle authentique et percutante sur les marchés internationaux.',
                'duration'       => '48:35',
                'spotify_url'    => null,
                'apple_url'      => null,
                'youtube_url'    => null,
                'is_published'   => true,
                'published_at'   => now()->subDays(19),
            ],
            [
                'title'          => 'L\'artisanat numérique : MPREW et la révolution 3D avec Moussa Kouyaté',
                'episode_number' => 3,
                'season'         => '1',
                'guest'          => 'Moussa Kouyaté',
                'description'    => 'Comment la technologie 3D peut transformer le secteur artisanal africain ? Moussa Kouyaté, co-fondateur de MPREW, partage sa vision d\'un artisanat connecté.',
                'duration'       => '41:12',
                'spotify_url'    => null,
                'apple_url'      => null,
                'youtube_url'    => null,
                'is_published'   => true,
                'published_at'   => now()->subDays(33),
            ],
            [
                'title'          => 'Financer son projet mode en Afrique avec Fatoumata Balde',
                'episode_number' => 2,
                'season'         => '1',
                'guest'          => 'Fatoumata Balde',
                'description'    => 'Lever des fonds pour une marque de mode en Afrique : défis, stratégies et opportunités. Fatoumata Balde, investisseuse, partage les clés pour convaincre.',
                'duration'       => '38:44',
                'spotify_url'    => null,
                'apple_url'      => null,
                'youtube_url'    => null,
                'is_published'   => true,
                'published_at'   => now()->subDays(47),
            ],
            [
                'title'          => 'Naissance d\'OtentikMia : raconter l\'Afrique autrement',
                'episode_number' => 1,
                'season'         => '1',
                'guest'          => null,
                'description'    => 'Premier épisode d\'Otentik Mia. Kariata Savane partage sa vision d\'un média culturel africain authentique, ses inspirations et ce qu\'elle souhaite offrir à sa communauté.',
                'duration'       => '35:20',
                'spotify_url'    => null,
                'apple_url'      => null,
                'youtube_url'    => null,
                'is_published'   => true,
                'published_at'   => now()->subDays(61),
            ],
        ];

        foreach ($podcasts as $data) {
            Podcast::updateOrCreate(
                ['episode_number' => $data['episode_number'], 'season' => $data['season']],
                $data
            );
        }
    }
}
