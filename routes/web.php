<?php

use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\DownloadController;
use App\Models\Brand;
use App\Models\Catalogue;
use App\Models\Initiative;
use App\Models\Section;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes — Frontend SPA (Inertia.js)
| Le middleware HandleInertiaRequests est appliqué ici uniquement,
| afin de ne pas interférer avec Filament (/admin).
|--------------------------------------------------------------------------
*/

Route::middleware(\App\Http\Middleware\HandleInertiaRequests::class)->group(function () {

    // HOME
    Route::get('/', function () {
        $homeSections = Section::where('page', 'home')->where('is_active', true)->orderBy('order')->get()->keyBy('type');
        $services     = Service::where('is_active', true)->orderBy('order')->get();
        return Inertia::render('Home', compact('homeSections', 'services'));
    });

    Route::get('/index', function () {
        $homeSections = Section::where('page', 'home')->where('is_active', true)->orderBy('order')->get()->keyBy('type');
        $services     = Service::where('is_active', true)->orderBy('order')->get();
        return Inertia::render('Home', compact('homeSections', 'services'));
    })->name('index');


    // ── NOS MARQUES ──────────────────────────────────────────────────────────

    Route::get('/miaDreams', function () {
        $brand = Brand::where('slug', 'mia-dreams')->where('is_active', true)->first();
        $collections = $brand
            ? $brand->collections()->orderBy('order')->with(['products' => fn($q) => $q->where('is_active', true)->orderBy('order')])->get()
            : collect();
        return Inertia::render('Brands/MiaDreams', compact('brand', 'collections'));
    })->name('miaDreams');

    Route::get('/mprew', function () {
        $brand = Brand::where('slug', 'mprew')->where('is_active', true)->first();
        return Inertia::render('Brands/Mprew', compact('brand'));
    })->name('mprew');

    Route::get('/personalBranding', function () {
        $brand = Brand::where('slug', 'personal-branding')->where('is_active', true)->first();
        return Inertia::render('Brands/PersonalBranding', compact('brand'));
    })->name('personalBranding');

    Route::get('/fashionProgram', function () {
        $brand = Brand::where('slug', 'fashion-program')->where('is_active', true)->first();
        return Inertia::render('Brands/FashionProgram', compact('brand'));
    })->name('fashionProgram');

    // Page dynamique pour toute marque créée en admin
    Route::get('/marque/{slug}', function ($slug) {
        $brand = Brand::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $collections = $brand->collections()->orderBy('order')->with(['products' => fn($q) => $q->where('is_active', true)->orderBy('order')])->get();
        return Inertia::render('Brands/Brand', compact('brand', 'collections'));
    })->name('brand.show');


    // ── À PROPOS ─────────────────────────────────────────────────────────────

    Route::get('/apropos', function () {
        $teamMembers = TeamMember::where('is_active', true)->orderBy('order')->get();
        return Inertia::render('APropos', compact('teamMembers'));
    })->name('apropos');


    // ── IMPACT ───────────────────────────────────────────────────────────────

    Route::get('/impact', function () {
        $sections    = Section::where('page', 'impact')->where('is_active', true)->orderBy('order')->get();
        $initiatives = Initiative::where('is_active', true)->orderBy('order')->get();
        return Inertia::render('Impact', compact('sections', 'initiatives'));
    })->name('impact');


    // ── CONTACT ──────────────────────────────────────────────────────────────

    Route::get('/contact', [App\Http\Controllers\ContactController::class, 'index'])->name('contact');
    Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');


    // ── NEWSLETTER ───────────────────────────────────────────────────────────

    Route::controller(NewsletterController::class)->group(function () {
        Route::get('newsletter', 'index')->name('newsletter.list');
        Route::get('newsletter/create', 'create')->name('newsletter.create');
        Route::post('newsletter/store', 'store')->name('newsletter.store');
        Route::get('newsletter/edit/{id}', 'edit')->name('newsletter.edit');
        Route::post('newsletter/update/{carte}', 'update')->name('newsletter.update');
        Route::get('newsletter/destroy/{id}', 'destroy')->name('newsletter.destroy');
    });


    // ── DOWNLOAD ─────────────────────────────────────────────────────────────

    Route::controller(DownloadController::class)->group(function () {
        Route::get('/download/{document}', 'download')->name('download');
    });


    // ── CATALOGUES ───────────────────────────────────────────────────────────

    Route::get('/catalogues', function () {
        $catalogues = Catalogue::where('is_active', true)->orderBy('order')->get();
        return Inertia::render('Catalogues', compact('catalogues'));
    })->name('catalogues');

    Route::get('/catalogue/telecharger/{id}', function ($id) {
        $catalogue = Catalogue::findOrFail($id);
        if (!$catalogue->pdf_path || !Storage::disk('public')->exists($catalogue->pdf_path)) {
            return redirect()->back()->with('error', 'Fichier introuvable.');
        }
        return Storage::disk('public')->download($catalogue->pdf_path, $catalogue->name . '.pdf');
    })->name('catalogue.download');


    // ── GALERIE ──────────────────────────────────────────────────────────────

    Route::get('/galerie', function () {
        $photos      = \App\Models\Gallery::where('is_active', true)->orderBy('order')->with(['collection', 'brand'])->get();
        $brands      = Brand::whereHas('galleries', fn($q) => $q->where('is_active', true))->get(['id', 'name']);
        $collections = \App\Models\Collection::whereHas('galleries', fn($q) => $q->where('is_active', true))->get(['id', 'name']);
        return Inertia::render('Gallery', compact('photos', 'brands', 'collections'));
    })->name('galerie');


    // ── BLOG ─────────────────────────────────────────────────────────────────

    Route::get('/blog', [App\Http\Controllers\BlogController::class, 'index'])->name('blog');
    Route::get('/blog/{slug}', [App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');


    // ── RECHERCHE GLOBALE ─────────────────────────────────────────────────

    Route::get('/recherche', [App\Http\Controllers\SearchController::class, 'index'])->name('search');


    // ── RESERVATION ───────────────────────────────────────────────────────

    Route::get('/reservation', [App\Http\Controllers\ReservationController::class, 'index'])->name('reservation');
    Route::post('/reservation', [App\Http\Controllers\ReservationController::class, 'store'])->name('reservation.store');


    // ── TÉMOIGNAGES (soumission publique) ────────────────────────────────
    Route::post('/temoignage', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'name'    => 'required|string|max:100',
            'role'    => 'nullable|string|max:100',
            'company' => 'nullable|string|max:100',
            'rating'  => 'required|integer|min:1|max:5',
            'content' => 'required|string|min:20|max:1000',
        ], [
            'name.required'    => 'Votre nom est requis.',
            'content.required' => 'Votre témoignage est requis.',
            'content.min'      => 'Votre témoignage doit contenir au moins 20 caractères.',
            'rating.required'  => 'Veuillez sélectionner une note.',
        ]);

        \App\Models\Testimonial::create([
            'name'      => $request->name,
            'role'      => $request->role,
            'company'   => $request->company,
            'rating'    => $request->rating,
            'content'   => $request->content,
            'is_active' => false,   // modération admin requise
            'order'     => 999,
        ]);

        return back()->with('testimonial_success', true);
    })->name('testimonial.store');

    // ── NEWSLETTER ABONNEMENT ─────────────────────────────────────────────

    Route::post('/newsletter/subscribe', function (\Illuminate\Http\Request $request) {
        $request->validate(['email' => 'required|email|max:255']);
        \App\Models\Newsletter::firstOrCreate(['email' => $request->email]);
        return back()->with('success', 'Merci pour votre inscription !');
    })->name('newsletter.subscribe');

}); // fin du groupe Inertia (frontend uniquement)
