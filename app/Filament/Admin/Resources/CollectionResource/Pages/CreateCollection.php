<?php

namespace App\Filament\Admin\Resources\CollectionResource\Pages;

use App\Filament\Admin\Resources\CollectionResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateCollection extends CreateRecord
{
    protected static string $resource = CollectionResource::class;
}
