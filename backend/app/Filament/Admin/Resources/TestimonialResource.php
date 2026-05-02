<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;
    protected static ?string $navigationIcon = 'heroicon-o-star';
    protected static ?string $navigationLabel = 'Témoignages';
    protected static ?string $modelLabel = 'Témoignage';
    protected static ?string $pluralModelLabel = 'Témoignages';
    protected static ?string $navigationGroup = 'Contenu';
    protected static ?int $navigationSort = 5;

    // Badge : nombre de témoignages en attente de validation
    public static function getNavigationBadge(): ?string
    {
        $count = Testimonial::where('is_active', false)->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make()->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nom')
                    ->required()->maxLength(255),

                Forms\Components\TextInput::make('role')
                    ->label('Poste / Rôle')
                    ->maxLength(255),

                Forms\Components\TextInput::make('company')
                    ->label('Entreprise')
                    ->maxLength(255),

                Forms\Components\Select::make('rating')
                    ->label('Note')
                    ->options([5 => '⭐⭐⭐⭐⭐', 4 => '⭐⭐⭐⭐', 3 => '⭐⭐⭐', 2 => '⭐⭐', 1 => '⭐'])
                    ->default(5)->required(),

                Forms\Components\Textarea::make('content')
                    ->label('Témoignage')
                    ->required()->rows(4)->columnSpanFull(),

                Forms\Components\FileUpload::make('photo')
                    ->label('Photo')
                    ->image()->disk('public')->directory('testimonials'),

                Forms\Components\TextInput::make('order')
                    ->label('Ordre d\'affichage')
                    ->numeric()->default(0),

                Forms\Components\Toggle::make('is_active')
                    ->label('Visible sur le site')
                    ->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->label('Photo')->circular()->disk('public'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')->searchable()->sortable(),

                Tables\Columns\TextColumn::make('role')
                    ->label('Rôle')->searchable(),

                Tables\Columns\TextColumn::make('company')
                    ->label('Entreprise'),

                Tables\Columns\TextColumn::make('rating')
                    ->label('Note')
                    ->formatStateUsing(fn($state) => str_repeat('⭐', $state)),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Actif')->boolean(),

                Tables\Columns\TextColumn::make('order')
                    ->label('Ordre')->sortable(),
            ])
            ->defaultSort('order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Actif'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->reorderable('order');
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit'   => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
