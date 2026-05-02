<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Newsletter;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Cache;

class LatestNewslettersWidget extends Widget
{
    protected static string $view = 'filament.widgets.latest-newsletters';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 2;
    protected static ?string $pollingInterval = null;

    protected function getViewData(): array
    {
        return [
            'newsletters' => Cache::remember('admin_latest_newsletters', 60, fn () => Newsletter::query()
                ->latest()
                ->take(8)
                ->get(['email', 'created_at'])),
        ];
    }
}
