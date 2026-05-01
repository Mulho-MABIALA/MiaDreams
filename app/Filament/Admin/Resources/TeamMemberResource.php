<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\TeamMemberResource\Pages;
use App\Filament\Admin\Resources\TeamMemberResource\RelationManagers;
use App\Models\TeamMember;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TeamMemberResource extends Resource
{
    protected static ?string $model = TeamMember::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $label = 'Membre';
    protected static ?string $pluralLabel = 'Équipe';
    protected static ?string $navigationLabel = 'Équipe';
    protected static ?string $navigationGroup = 'Paramètres';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nom')
                    ->required(),
                Forms\Components\TextInput::make('role')
                    ->label('Rôle')
                    ->required(),
                Forms\Components\Textarea::make('bio')
                    ->label('Biographie')
                    ->required()
                    ->rows(5)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('image')
                    ->label('Photo')
                    ->image()
                    ->disk('public')
                    ->directory('team')
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
                Tables\Columns\TextColumn::make('role')->label('Rôle'),
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
            'index' => Pages\ListTeamMembers::route('/'),
            'create' => Pages\CreateTeamMember::route('/create'),
            'edit' => Pages\EditTeamMember::route('/{record}/edit'),
        ];
    }
}
