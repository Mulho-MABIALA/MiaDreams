<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\PodcastResource\Pages;
use App\Models\Podcast;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PodcastResource extends Resource
{
    protected static ?string $model = Podcast::class;

    protected static ?string $navigationIcon  = 'heroicon-o-microphone';
    protected static ?string $label           = 'Épisode';
    protected static ?string $pluralLabel     = 'Podcasts';
    protected static ?string $navigationLabel = 'Épisodes Podcast';
    protected static ?string $navigationGroup = 'Blog & Podcast';
    protected static ?int    $navigationSort  = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Section::make('Informations de l\'épisode')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('title')
                        ->label('Titre de l\'épisode')
                        ->required()
                        ->maxLength(255)
                        ->columnSpanFull(),

                    Forms\Components\TextInput::make('episode_number')
                        ->label('Numéro d\'épisode')
                        ->numeric()
                        ->required(),

                    Forms\Components\TextInput::make('season')
                        ->label('Saison')
                        ->placeholder('ex: 1')
                        ->nullable(),

                    Forms\Components\TextInput::make('guest')
                        ->label('Invité(e)')
                        ->placeholder('Nom de l\'invité')
                        ->nullable(),

                    Forms\Components\TextInput::make('duration')
                        ->label('Durée')
                        ->placeholder('ex: 45:30')
                        ->nullable(),

                    Forms\Components\Textarea::make('description')
                        ->label('Description')
                        ->rows(4)
                        ->columnSpanFull(),
                ]),

            Forms\Components\Section::make('Liens d\'écoute')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('spotify_url')
                        ->label('Lien Spotify')
                        ->url()
                        ->placeholder('https://open.spotify.com/episode/...')
                        ->nullable(),

                    Forms\Components\TextInput::make('apple_url')
                        ->label('Lien Apple Podcasts')
                        ->url()
                        ->placeholder('https://podcasts.apple.com/...')
                        ->nullable(),

                    Forms\Components\TextInput::make('youtube_url')
                        ->label('Lien YouTube')
                        ->url()
                        ->placeholder('https://youtube.com/watch?v=...')
                        ->nullable(),

                    Forms\Components\TextInput::make('audio_url')
                        ->label('Fichier audio direct (URL)')
                        ->url()
                        ->placeholder('https://...')
                        ->nullable(),
                ]),

            Forms\Components\Section::make('Médias & Publication')
                ->columns(2)
                ->schema([
                    Forms\Components\FileUpload::make('thumbnail')
                        ->label('Miniature / Cover')
                        ->image()
                        ->disk('public')
                        ->directory('podcasts')
                        ->imagePreviewHeight('200')
                        ->columnSpanFull(),

                    Forms\Components\DateTimePicker::make('published_at')
                        ->label('Date de publication')
                        ->nullable(),

                    Forms\Components\Toggle::make('is_published')
                        ->label('Publié')
                        ->helperText('Visible sur le site.'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail')
                    ->label('')
                    ->disk('public')
                    ->width(60)->height(60),

                Tables\Columns\TextColumn::make('episode_number')
                    ->label('EP.')
                    ->sortable()
                    ->formatStateUsing(fn ($state) => 'EP.' . str_pad($state, 2, '0', STR_PAD_LEFT)),

                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->searchable()
                    ->limit(50),

                Tables\Columns\TextColumn::make('guest')
                    ->label('Invité(e)')
                    ->default('—'),

                Tables\Columns\TextColumn::make('duration')
                    ->label('Durée')
                    ->default('—'),

                Tables\Columns\IconColumn::make('is_published')
                    ->label('Publié')
                    ->boolean(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Date')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('episode_number', 'desc')
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
            'index'  => Pages\ListPodcasts::route('/'),
            'create' => Pages\CreatePodcast::route('/create'),
            'edit'   => Pages\EditPodcast::route('/{record}/edit'),
        ];
    }
}
