<?php

namespace App\Filament\Admin\Resources\CompanyInfoResource\Pages;

use App\Filament\Admin\Resources\CompanyInfoResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCompanyInfos extends ListRecords
{
    protected static string $resource = CompanyInfoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
