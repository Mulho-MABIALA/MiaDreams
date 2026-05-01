<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\SectionResource\Pages;
use App\Filament\Admin\Resources\SectionResource\RelationManagers;
use App\Models\Section;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SectionResource extends Resource
{
    protected static ?string $model = Section::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $label = 'Section';
    protected static ?string $pluralLabel = 'Sections';
    protected static ?string $navigationLabel = 'Sections';
    protected static ?string $navigationGroup = 'Contenu';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->label('Titre')
                    ->required(),
                Forms\Components\TextInput::make('subtitle')
                    ->label('Sous-titre')
                    ->nullable(),
                Forms\Components\Select::make('page')
                    ->label('Page')
                    ->options([
                        'index' => 'Accueil',
                        'impact' => 'Impact',
                        'apropos' => 'À Propos',
                        'miaDreams' => 'Mia Dreams',
                        'mprew' => 'MPREW',
                        'personalBranding' => 'Personal Branding',
                        'fashionProgram' => 'Fashion Program',
                    ])
                    ->required(),
                Forms\Components\Select::make('type')
                    ->label('Type')
                    ->options([
                        'mission' => 'Mission',
                        'vision' => 'Vision',
                        'value' => 'Valeur',
                        'intro' => 'Introduction',
                        'engagement' => 'Engagement',
                        'hero' => 'Hero',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('content')
                    ->label('Contenu')
                    ->nullable()
                    ->rows(5)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image')
                    ->label('Image')
                    ->image()
                    ->disk('public')
                    ->directory('sections')
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
                Tables\Columns\TextColumn::make('title')->label('Titre')->searchable(),
                Tables\Columns\TextColumn::make('page')->label('Page'),
                Tables\Columns\TextColumn::make('type')->label('Type'),
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
            'index' => Pages\ListSections::route('/'),
            'create' => Pages\CreateSection::route('/create'),
            'edit' => Pages\EditSection::route('/{record}/edit'),
        ];
    }
}
