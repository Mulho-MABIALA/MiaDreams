<?php

namespace App\Filament\Admin\Resources\PodcastResource\Pages;

use App\Filament\Admin\Resources\PodcastResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePodcast extends CreateRecord
{
    protected static string $resource = PodcastResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
