<?php

namespace App\Filament\Admin\Resources\ContactMessageResource\Pages;

use App\Filament\Admin\Resources\ContactMessageResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewContactMessage extends ViewRecord
{
    protected static string $resource = ContactMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Mark as read when viewed
        $this->record->update(['is_read' => true]);
        return $data;
    }
}
