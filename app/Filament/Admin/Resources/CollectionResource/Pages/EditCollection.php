<?php

namespace App\Filament\Admin\Resources\CollectionResource\Pages;

use App\Filament\Admin\Resources\CollectionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCollection extends EditRecord
{
    protected static string $resource = CollectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
