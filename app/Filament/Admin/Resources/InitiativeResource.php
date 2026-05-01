<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\InitiativeResource\Pages;
use App\Filament\Admin\Resources\InitiativeResource\RelationManagers;
use App\Models\Initiative;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InitiativeResource extends Resource
{
    protected static ?string $model = Initiative::class;

    protected static ?string $navigationIcon = 'heroicon-o-light-bulb';
    protected static ?string $label = 'Initiative';
    protected static ?string $pluralLabel = 'Initiatives';
    protected static ?string $navigationLabel = 'Initiatives';
    protected static ?string $navigationGroup = 'Contenu';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nom')
                    ->required(),
                Forms\Components\Textarea::make('description')
                    ->label('Description')
                    ->required()
                    ->rows(4)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('youtube_id')
                    ->label('ID YouTube')
                    ->nullable(),
                Forms\Components\FileUpload::make('image')
                    ->label('Image')
                    ->image()
                    ->disk('public')
                    ->directory('initiatives')
                    ->nullable(),
                Forms\Components\TextInput::make('order')
                    ->label('Ordre')
                    ->numeric()
                    ->default(0),
                Forms\Components\Toggle::make('is_active')
                    ->label('Actif')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nom')->searchable(),
                Tables\Columns\TextColumn::make('order')->label('Ordre')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->label('Actif')->boolean(),
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
            'index' => Pages\ListInitiatives::route('/'),
            'create' => Pages\CreateInitiative::route('/create'),
            'edit' => Pages\EditInitiative::route('/{record}/edit'),
        ];
    }
}
