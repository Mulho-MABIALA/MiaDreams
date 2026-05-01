<?php

namespace App\Filament\Admin\Resources\TeamMemberResource\Pages;

use App\Filament\Admin\Resources\TeamMemberResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTeamMember extends EditRecord
{
    protected static string $resource = TeamMemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
