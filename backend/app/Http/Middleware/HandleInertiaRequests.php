<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Middleware;
use App\Models\Brand;
use App\Models\Catalogue;
use App\Models\CompanyInfo;
use App\Models\SocialMedia;
use App\Models\Testimonial;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'companyInfo'      => fn () => CompanyInfo::first(),
            'socialMediaLinks' => fn () => SocialMedia::where('is_active', true)->orderBy('order')->get(),
            'navBrands'        => fn () => Brand::where('is_active', true)->orderBy('order')->get(['id', 'name', 'slug']),
            'navCatalogues'    => fn () => Catalogue::where('is_active', true)->orderBy('order')->take(5)->get(['id', 'name']),
            'testimonials'     => fn () => Testimonial::active()->get(),
            'flash' => [
                'success'             => fn () => $request->session()->get('success'),
                'error'               => fn () => $request->session()->get('error'),
                'testimonial_success' => fn () => $request->session()->get('testimonial_success'),
            ],
        ]);
    }

    public function handle(Request $request, \Closure $next)
    {
        $response = parent::handle($request, $next);

        if ($request->header('X-Inertia') && $response instanceof JsonResponse) {
            $response->headers->set('X-Inertia', 'true');
            $response->headers->set('Vary', 'X-Inertia');
        }

        return $response;
    }
}
