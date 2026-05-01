<?php

namespace App\Filament\Admin\Resources\GalleryResource\Pages;

use App\Filament\Admin\Resources\GalleryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListGalleries extends ListRecords
{
    protected static string $resource = GalleryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
