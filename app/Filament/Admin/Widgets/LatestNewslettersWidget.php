<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Newsletter;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestNewslettersWidget extends BaseWidget
{
    protected static ?string $heading = 'Derniers abonnés';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 2;

    // Désactiver le polling (pas de rechargement automatique)
    protected static ?string $pollingInterval = null;

    public function table(Table $table): Table
    {
        return $table
            ->query(Newsletter::query()->latest()->limit(8))
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->icon('heroicon-m-envelope')
                    ->weight('medium'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Inscrit le')
                    ->dateTime('d/m/Y à H:i')
                    ->sortable()
                    ->color('gray'),
            ])
            ->paginated(false);
    }
}
