<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\ReservationResource\Pages;
use App\Models\Reservation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReservationResource extends Resource
{
    protected static ?string $model = Reservation::class;
    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationLabel = 'Réservations';
    protected static ?string $modelLabel = 'Réservation';
    protected static ?string $pluralModelLabel = 'Réservations';
    protected static ?string $navigationGroup = 'Clients';
    protected static ?int $navigationSort = 2;

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_read', false)->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Informations client')->schema([
                Forms\Components\TextInput::make('name')->label('Nom')->required(),
                Forms\Components\TextInput::make('email')->label('Email')->email()->required(),
                Forms\Components\TextInput::make('phone')->label('Téléphone'),
            ])->columns(3),

            Forms\Components\Section::make('Demande')->schema([
                Forms\Components\Select::make('service')
                    ->label('Service')
                    ->options(Reservation::services())
                    ->required(),

                Forms\Components\DatePicker::make('preferred_date')
                    ->label('Date souhaitée'),

                Forms\Components\Select::make('preferred_time')
                    ->label('Créneau horaire')
                    ->options([
                        '09:00' => '09h00', '10:00' => '10h00', '11:00' => '11h00',
                        '14:00' => '14h00', '15:00' => '15h00', '16:00' => '16h00',
                        '17:00' => '17h00',
                    ]),

                Forms\Components\Textarea::make('message')->label('Message')->rows(3)->columnSpanFull(),
            ])->columns(3),

            Forms\Components\Section::make('Statut')->schema([
                Forms\Components\Select::make('status')
                    ->label('Statut')
                    ->options(['pending' => 'En attente', 'confirmed' => 'Confirmée', 'cancelled' => 'Annulée'])
                    ->required(),

                Forms\Components\Toggle::make('is_read')->label('Marquée comme lue'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Client')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->label('Email')->searchable(),
                Tables\Columns\TextColumn::make('phone')->label('Téléphone'),
                Tables\Columns\TextColumn::make('service')
                    ->label('Service')
                    ->formatStateUsing(fn($state) => Reservation::services()[$state] ?? $state),
                Tables\Columns\TextColumn::make('preferred_date')
                    ->label('Date souhaitée')->date('d/m/Y')->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Statut')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'confirmed',
                        'danger'  => 'cancelled',
                    ])
                    ->formatStateUsing(fn($state) => match($state) {
                        'pending'   => 'En attente',
                        'confirmed' => 'Confirmée',
                        'cancelled' => 'Annulée',
                        default     => $state,
                    }),
                Tables\Columns\IconColumn::make('is_read')->label('Lu')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Reçue le')->date('d/m/Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Statut')
                    ->options(['pending' => 'En attente', 'confirmed' => 'Confirmée', 'cancelled' => 'Annulée']),
                Tables\Filters\TernaryFilter::make('is_read')->label('Lu'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListReservations::route('/'),
            'edit'   => Pages\EditReservation::route('/{record}/edit'),
        ];
    }
}
