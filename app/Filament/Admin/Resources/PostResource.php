<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\PostResource\Pages;
use App\Models\Post;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static ?string $navigationIcon  = 'heroicon-o-document-text';
    protected static ?string $label           = 'Article';
    protected static ?string $pluralLabel     = 'Articles';
    protected static ?string $navigationLabel = 'Articles de blog';
    protected static ?string $navigationGroup = 'Blog & Podcast';
    protected static ?int    $navigationSort  = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([

            Forms\Components\Section::make('Informations générales')
                ->columns(2)
                ->schema([
                    Forms\Components\TextInput::make('title')
                        ->label('Titre')
                        ->required()
                        ->maxLength(255)
                        ->live(debounce: 600)
                        ->afterStateUpdated(fn ($state, Forms\Set $set) =>
                            $set('slug', Str::slug($state))),

                    Forms\Components\TextInput::make('slug')
                        ->label('Slug URL')
                        ->required()
                        ->unique(Post::class, 'slug', ignoreRecord: true)
                        ->maxLength(255),

                    Forms\Components\Select::make('category')
                        ->label('Catégorie')
                        ->options([
                            'Mode'             => 'Mode',
                            'Personal Branding' => 'Personal Branding',
                            'Artisanat'        => 'Artisanat',
                            'Culture'          => 'Culture',
                            'Entrepreneuriat'  => 'Entrepreneuriat',
                            'Lifestyle'        => 'Lifestyle',
                        ])
                        ->required(),

                    Forms\Components\TextInput::make('author')
                        ->label('Auteur')
                        ->default('Kariata Savane')
                        ->required(),

                    Forms\Components\TextInput::make('reading_time')
                        ->label('Temps de lecture (min)')
                        ->numeric()
                        ->default(5),

                    Forms\Components\DateTimePicker::make('published_at')
                        ->label('Date de publication')
                        ->nullable(),
                ]),

            Forms\Components\Section::make('Contenu')
                ->schema([
                    Forms\Components\Textarea::make('excerpt')
                        ->label('Extrait / Chapô')
                        ->rows(3)
                        ->maxLength(500)
                        ->helperText('Résumé court affiché sur la liste du blog.')
                        ->columnSpanFull(),

                    Forms\Components\RichEditor::make('content')
                        ->label('Contenu complet')
                        ->toolbarButtons([
                            'bold', 'italic', 'underline',
                            'bulletList', 'orderedList',
                            'h2', 'h3',
                            'link', 'blockquote',
                            'undo', 'redo',
                        ])
                        ->columnSpanFull(),
                ]),

            Forms\Components\Section::make('Médias & Publication')
                ->columns(2)
                ->schema([
                    Forms\Components\FileUpload::make('image')
                        ->label('Image de couverture')
                        ->image()
                        ->disk('public')
                        ->directory('blog')
                        ->imagePreviewHeight('200')
                        ->columnSpanFull(),

                    Forms\Components\Toggle::make('is_featured')
                        ->label('Article à la une')
                        ->helperText('Affiché en grand sur la page blog.'),

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
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->disk('public')
                    ->width(60)->height(60)
                    ->defaultImageUrl(asset('img/logo_MIA.png')),

                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                Tables\Columns\BadgeColumn::make('category')
                    ->label('Catégorie')
                    ->colors([
                        'primary'   => 'Mode',
                        'success'   => 'Entrepreneuriat',
                        'warning'   => 'Personal Branding',
                        'danger'    => 'Artisanat',
                        'secondary' => 'Culture',
                    ]),

                Tables\Columns\TextColumn::make('author')
                    ->label('Auteur')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Une')
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_published')
                    ->label('Publié')
                    ->boolean(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Date')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label('Catégorie')
                    ->options([
                        'Mode'             => 'Mode',
                        'Personal Branding' => 'Personal Branding',
                        'Artisanat'        => 'Artisanat',
                        'Culture'          => 'Culture',
                        'Entrepreneuriat'  => 'Entrepreneuriat',
                        'Lifestyle'        => 'Lifestyle',
                    ]),
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Statut')
                    ->trueLabel('Publiés')
                    ->falseLabel('Brouillons'),
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
            'index'  => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit'   => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
