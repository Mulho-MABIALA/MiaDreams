<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\CollectionResource\Pages;
use App\Filament\Admin\Resources\CollectionResource\RelationManagers;
use App\Models\Brand;
use App\Models\Collection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CollectionResource extends Resource
{
    protected static ?string $model = Collection::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';
    protected static ?string $label = 'Collection';
    protected static ?string $pluralLabel = 'Collections';
    protected static ?string $navigationLabel = 'Collections';
    protected static ?string $navigationGroup = 'Contenu';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nom')
                    ->required(),
                Forms\Components\Select::make('brand_id')
                    ->label('Marque')
                    ->options(Brand::pluck('name', 'id'))
                    ->required()
                    ->searchable(),
                Forms\Components\Textarea::make('description')
                    ->label('Description')
                    ->nullable()
                    ->rows(3)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image')
                    ->label('Image de la collection')
                    ->image()
                    ->disk('public')
                    ->directory('collections')
                    ->nullable()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('order')
                    ->label('Ordre')
                    ->numeric()
                    ->default(0),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nom')->searchable(),
                Tables\Columns\TextColumn::make('brand.name')->label('Marque'),
                Tables\Columns\TextColumn::make('order')->label('Ordre')->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCollections::route('/'),
            'create' => Pages\CreateCollection::route('/create'),
            'edit' => Pages\EditCollection::route('/{record}/edit'),
        ];
    }
}
