<?php

namespace App\Filament\Admin\Resources\InitiativeResource\Pages;

use App\Filament\Admin\Resources\InitiativeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInitiative extends EditRecord
{
    protected static string $resource = InitiativeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
