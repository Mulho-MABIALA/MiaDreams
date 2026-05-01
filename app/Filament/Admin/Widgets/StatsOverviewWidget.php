<?php

namespace App\Filament\Admin\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    // Pas de polling automatique (évite les rechargements Livewire constants)
    protected static ?string $pollingInterval = null;

    protected function getStats(): array
    {
        // Cache 5 minutes — une seule requête DB groupée
        $counts = Cache::remember('admin_stats', 300, function () {
            return DB::table(DB::raw('(
                SELECT "newsletters"  AS tbl, COUNT(*) AS cnt FROM newsletters
                UNION ALL SELECT "products",  COUNT(*) FROM products
                UNION ALL SELECT "collections", COUNT(*) FROM collections
                UNION ALL SELECT "catalogues", COUNT(*) FROM catalogues
                UNION ALL SELECT "brands",    COUNT(*) FROM brands
                UNION ALL SELECT "services",  COUNT(*) FROM services
                UNION ALL SELECT "team",      COUNT(*) FROM team_members
                UNION ALL SELECT "posts",     COUNT(*) FROM posts WHERE is_published = 1
            ) AS s'))
            ->pluck('cnt', 'tbl');
        });

        // Messages non lus (table peut ne pas exister)
        $unread = Cache::remember('admin_unread_msgs', 120, function () {
            try {
                return DB::table('contact_messages')->where('is_read', false)->count();
            } catch (\Exception $e) {
                return 0;
            }
        });

        return [
            Stat::make('Newsletter', $counts['newsletters'] ?? 0)
                ->description('Abonnés inscrits')
                ->descriptionIcon('heroicon-m-envelope')
                ->color('success')
                ->chart([3, 5, 4, 6, 8, 5, 7]),

            Stat::make('Messages', $unread)
                ->description('Non lus')
                ->descriptionIcon('heroicon-m-chat-bubble-left-ellipsis')
                ->color('warning'),

            Stat::make('Produits', $counts['products'] ?? 0)
                ->description(($counts['collections'] ?? 0) . ' collections')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Articles Blog', $counts['posts'] ?? 0)
                ->description('Publiés')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info'),

            Stat::make('Catalogues', $counts['catalogues'] ?? 0)
                ->description('PDFs disponibles')
                ->descriptionIcon('heroicon-m-folder-open')
                ->color('primary'),

            Stat::make('Équipe', $counts['team'] ?? 0)
                ->description('Membres actifs')
                ->descriptionIcon('heroicon-m-users')
                ->color('gray'),
        ];
    }
}
