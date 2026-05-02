<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\GalleryResource\Pages;
use App\Models\Brand;
use App\Models\Collection;
use App\Models\Gallery;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class GalleryResource extends Resource
{
    protected static ?string $model = Gallery::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Galerie';
    protected static ?string $navigationGroup = 'Contenu';
    protected static ?string $modelLabel = 'Photo';
    protected static ?string $pluralModelLabel = 'Galerie';
    protected static ?int $navigationSort = 6;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Image')->schema([
                Forms\Components\FileUpload::make('image')
                    ->label('Photo')
                    ->image()
                    ->disk('public')
                    ->directory('gallery')
                    ->imageEditor()
                    ->required()
                    ->columnSpanFull(),

                Forms\Components\TextInput::make('caption')
                    ->label('Légende (optionnel)')
                    ->maxLength(200),

                Forms\Components\Select::make('collection_id')
                    ->label('Collection associée')
                    ->options(Collection::orderBy('name')->pluck('name', 'id'))
                    ->searchable()
                    ->nullable(),

                Forms\Components\Select::make('brand_id')
                    ->label('Marque associée')
                    ->options(Brand::orderBy('name')->pluck('name', 'id'))
                    ->searchable()
                    ->nullable(),

                Forms\Components\TextInput::make('order')
                    ->label('Ordre')
                    ->numeric()
                    ->default(0),

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
                Tables\Columns\ImageColumn::make('image')
                    ->label('Photo')
                    ->height(70)
                    ->width(70)
                    ->extraImgAttributes(['style' => 'object-fit:cover;border-radius:4px'])
                    ->getStateUsing(fn ($record) => str_starts_with($record->image, 'img/')
                        ? asset($record->image)
                        : asset('storage/' . $record->image)),

                Tables\Columns\TextColumn::make('caption')
                    ->label('Légende')
                    ->limit(40)
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('collection.name')
                    ->label('Collection')
                    ->placeholder('—')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('brand.name')
                    ->label('Marque')
                    ->placeholder('—')
                    ->badge()
                    ->color('warning'),

                Tables\Columns\TextColumn::make('order')
                    ->label('Ordre')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Actif')
                    ->boolean(),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->filters([
                Tables\Filters\SelectFilter::make('collection_id')
                    ->label('Collection')
                    ->options(Collection::orderBy('name')->pluck('name', 'id')),

                Tables\Filters\SelectFilter::make('brand_id')
                    ->label('Marque')
                    ->options(Brand::orderBy('name')->pluck('name', 'id')),

                Tables\Filters\TernaryFilter::make('is_active')->label('Actif'),
            ])
            ->headerActions([
                Tables\Actions\Action::make('import_from_collections')
                    ->label('Importer depuis les collections')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('info')
                    ->requiresConfirmation()
                    ->modalHeading('Importer les photos des collections')
                    ->modalDescription('Cette action va importer toutes les photos des produits des collections qui ne sont pas encore dans la galerie.')
                    ->modalSubmitActionLabel('Importer')
                    ->action(function () {
                        $products = Product::whereNotNull('image')
                            ->where('is_active', true)
                            ->get();

                        $existing = Gallery::pluck('image')->toArray();
                        $imported = 0;

                        foreach ($products as $product) {
                            if (!in_array($product->image, $existing)) {
                                Gallery::create([
                                    'image'         => $product->image,
                                    'caption'       => $product->name,
                                    'collection_id' => $product->collection_id,
                                    'brand_id'      => $product->collection?->brand_id,
                                    'order'         => $product->order,
                                    'is_active'     => true,
                                ]);
                                $imported++;
                            }
                        }

                        Notification::make()
                            ->title($imported > 0
                                ? "{$imported} photo(s) importée(s) avec succès."
                                : 'Aucune nouvelle photo à importer.')
                            ->success()
                            ->send();
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListGalleries::route('/'),
            'create' => Pages\CreateGallery::route('/create'),
            'edit'   => Pages\EditGallery::route('/{record}/edit'),
        ];
    }
}
