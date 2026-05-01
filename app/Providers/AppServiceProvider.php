<?php

namespace App\Providers;

use App\Models\Brand;
use App\Models\Catalogue;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // Partage la liste des marques actives avec TOUTES les vues
        // → le menu et le footer se mettent à jour automatiquement
        View::composer('*', function ($view) {
            if (!$view->offsetExists('navBrands')) {
                try {
                    $view->with('navBrands', Brand::where('is_active', true)
                        ->orderBy('order')
                        ->get(['id', 'name', 'slug']));
                } catch (\Exception $e) {
                    $view->with('navBrands', collect());
                }
            }
            if (!$view->offsetExists('navCatalogues')) {
                try {
                    $view->with('navCatalogues', Catalogue::where('is_active', true)
                        ->orderBy('order')
                        ->get(['id', 'name', 'pdf_path']));
                } catch (\Exception $e) {
                    $view->with('navCatalogues', collect());
                }
            }
        });
    }
}
