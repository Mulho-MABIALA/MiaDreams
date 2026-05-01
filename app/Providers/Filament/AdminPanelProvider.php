<?php

namespace App\Providers\Filament;

use App\Filament\Admin\Resources\BrandResource;
use App\Filament\Admin\Resources\GalleryResource;
use App\Filament\Admin\Resources\CatalogueResource;
use App\Filament\Admin\Resources\CollectionResource;
use App\Filament\Admin\Resources\CompanyInfoResource;
use App\Filament\Admin\Resources\ContactMessageResource;
use App\Filament\Admin\Resources\InitiativeResource;
use App\Filament\Admin\Resources\NewsletterResource;
use App\Filament\Admin\Resources\PodcastResource;
use App\Filament\Admin\Resources\PostResource;
use App\Filament\Admin\Resources\ProductResource;
use App\Filament\Admin\Resources\ReservationResource;
use App\Filament\Admin\Resources\SectionResource;
use App\Filament\Admin\Resources\ServiceResource;
use App\Filament\Admin\Resources\SocialMediaResource;
use App\Filament\Admin\Resources\TeamMemberResource;
use App\Filament\Admin\Resources\TestimonialResource;
use App\Filament\Admin\Widgets\LatestNewslettersWidget;
use App\Filament\Admin\Widgets\QuickActionsWidget;
use App\Filament\Admin\Widgets\StatsOverviewWidget;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('admin')
            ->path('admin')
            ->login()
            ->profile()

            // ── Branding ──
            ->brandName('MIA DREAMS')
            ->brandLogo(asset('img/logo_MIA.png'))
            ->brandLogoHeight('2rem')
            ->favicon(asset('img/icone-miadreams.png'))

            // ── Couleur Gold MIA DREAMS ──
            ->colors([
                'primary' => [
                    50  => '250, 247, 242',
                    100 => '245, 237, 224',
                    200 => '232, 213, 181',
                    300 => '217, 188, 138',
                    400 => '204, 169, 112',
                    500 => '196, 162, 103',
                    600 => '176, 141, 80',
                    700 => '143, 112, 64',
                    800 => '109, 85, 48',
                    900 => '76, 58, 32',
                    950 => '46, 34, 16',
                ],
                'gray' => Color::Stone,
            ])

            // ── Apparence (sans font Google = pas de requête externe) ──
            ->darkMode(false)
            ->sidebarCollapsibleOnDesktop()

            // ── CSS + JS custom ──
            ->renderHook(
                'panels::head.end',
                function () {
                    // Login page : CSS autonome, sans interférence de admin.css
                    if (request()->routeIs('filament.admin.auth.login')) {
                        return <<<'HTML'
<style id="mia-login-css">
/* ── MIA DREAMS · Login page · standalone CSS ── */
:root {
    --gold:       #C4A267;
    --gold-dark:  #b8944f;
    --gold-ring:  rgba(196,162,103,.20);
    --bg:         #f5f5f7;
    --surface:    #ffffff;
    --border:     #d2d2d7;
    --txt:        #1d1d1f;
    --txt-2:      #6e6e73;
    --txt-3:      #aeaeb2;
    --danger:     #ff3b30;
    --r:          12px;
    --r-sm:       8px;
}

/* Layout */
html, body { margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif; }
body { background:var(--bg) !important; color:var(--txt) !important; font-size:15px; line-height:1.5; -webkit-font-smoothing:antialiased; }

.fi-simple-layout {
    background: var(--bg) !important;
    min-height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
}

.fi-simple-main-ctn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    padding: 24px 16px !important;
    box-sizing: border-box !important;
}

/* The card */
.fi-simple-main {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    border-radius: 18px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,.10), 0 1px 4px rgba(0,0,0,.06) !important;
    padding: 44px 40px !important;
    width: 100% !important;
    max-width: 420px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
}

/* Livewire div — block, full width */
.fi-simple-page {
    display: block !important;
    width: 100% !important;
}

/* Kill every modal on the login page */
.fi-simple-page form[wire\\:submit\\.prevent="callMountedAction"],
.fi-modal,
[aria-modal="true"],
[x-show="isOpen"],
.fi-modal-close-overlay {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

/* Inner section — grid */
.fi-simple-page > section {
    display: grid !important;
    gap: 20px !important;
    width: 100% !important;
}

/* Header / branding */
.fi-simple-header {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 10px !important;
    margin-bottom: 8px !important;
}
.fi-simple-header img, .fi-logo { height: 40px !important; width: auto !important; }
.fi-simple-header-heading {
    font-size: 22px !important; font-weight: 700 !important;
    color: var(--txt) !important; margin: 0 !important; letter-spacing: -.3px !important;
}

/* Form */
.fi-form { display: grid !important; gap: 16px !important; width: 100% !important; }
.fi-fo-component-ctn { display: grid !important; gap: 14px !important; width: 100% !important; }
.fi-fo-field-wrp { display: block !important; width: 100% !important; }
.fi-fo-field-wrp > .grid { display: grid !important; gap: 6px !important; }

/* Labels */
label, .fi-fo-field-wrp-label label, .fi-label {
    display: block !important;
    font-size: 13px !important; font-weight: 500 !important;
    color: var(--txt-2) !important; letter-spacing: .01em !important;
}

/* Input wrapper */
.fi-input-wrp {
    display: flex !important;
    align-items: center !important;
    background: var(--surface) !important;
    border: 1.5px solid var(--border) !important;
    border-radius: var(--r-sm) !important;
    overflow: hidden !important;
    transition: border-color .15s, box-shadow .15s !important;
    box-shadow: none !important;
    ring: none !important;
}
.fi-input-wrp:focus-within {
    border-color: var(--gold) !important;
    box-shadow: 0 0 0 3px var(--gold-ring) !important;
}

/* Inputs */
input[type="email"],
input[type="password"],
input[type="text"],
.fi-input {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    padding: 10px 14px !important;
    font-size: 14px !important;
    color: var(--txt) !important;
    width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    flex: 1 !important;
    font-family: inherit !important;
    -webkit-appearance: none !important;
    box-shadow: none !important;
}
input::placeholder { color: var(--txt-3) !important; }

/* Checkbox row */
.fi-checkbox-input, input[type="checkbox"] {
    width: 16px !important; height: 16px !important;
    border-radius: 4px !important; accent-color: var(--gold) !important;
    cursor: pointer !important; flex-shrink: 0 !important;
    border: 1.5px solid var(--border) !important;
    background: var(--surface) !important;
}
.fi-fo-field-wrp-label { display: flex !important; align-items: center !important; gap: 8px !important; }
.fi-fo-field-wrp-label span { font-size: 13px !important; color: var(--txt-2) !important; }

/* Password reveal button */
.fi-ac-icon-btn-action {
    background: transparent !important; border: none !important;
    color: var(--txt-3) !important; cursor: pointer !important;
    padding: 0 10px !important; display: flex !important; align-items: center !important;
    flex-shrink: 0 !important;
}
.fi-ac-icon-btn-action:hover { color: var(--txt-2) !important; }
.fi-icon-btn-icon { width: 18px !important; height: 18px !important; }

/* Form actions */
.fi-form-actions { margin-top: 4px !important; }
.fi-ac { display: grid !important; width: 100% !important; }

/* Submit button */
.fi-btn {
    display: flex !important; align-items: center !important; justify-content: center !important;
    gap: 8px !important; width: 100% !important; padding: 12px 20px !important;
    font-size: 14px !important; font-weight: 600 !important;
    border-radius: var(--r-sm) !important; border: none !important;
    cursor: pointer !important; text-decoration: none !important;
    transition: background .18s, transform .12s !important;
    font-family: inherit !important; box-sizing: border-box !important;
}
.fi-btn-color-primary {
    background: var(--gold) !important; color: #fff !important;
    box-shadow: 0 1px 3px rgba(196,162,103,.35) !important;
}
.fi-btn-color-primary:hover {
    background: var(--gold-dark) !important;
    box-shadow: 0 3px 10px rgba(196,162,103,.4) !important;
    transform: translateY(-1px) !important;
}
.fi-btn-color-primary:active { transform: translateY(0) !important; }
.fi-btn-label { font-size: 14px !important; font-weight: 600 !important; }
.fi-btn-icon { width: 16px !important; height: 16px !important; }

/* Loading spinner (hidden by default) */
[x-cloak] { display: none !important; }

/* Error messages */
.fi-fo-field-wrp-error-message {
    font-size: 12px !important; color: var(--danger) !important;
    margin-top: 4px !important; display: flex !important; align-items: center !important; gap: 4px !important;
}

/* Focus ring */
*:focus-visible { outline: 2px solid var(--gold) !important; outline-offset: 2px !important; }

@media (max-width: 480px) {
    .fi-simple-main { padding: 32px 24px !important; }
}
</style>
HTML;
                    }

                    // Toutes les autres pages : admin.css complet
                    return '<link rel="stylesheet" href="' . asset('css/admin.css') . '?v=16">';
                }
            )

            // ── Resources enregistrées explicitement (évite le scan filesystem) ──
            ->resources([
                BrandResource::class,
                CatalogueResource::class,
                CollectionResource::class,
                GalleryResource::class,
                CompanyInfoResource::class,
                ContactMessageResource::class,
                InitiativeResource::class,
                NewsletterResource::class,
                PodcastResource::class,
                PostResource::class,
                ProductResource::class,
                SectionResource::class,
                ServiceResource::class,
                SocialMediaResource::class,
                TeamMemberResource::class,
                ReservationResource::class,
                TestimonialResource::class,
            ])
            ->pages([
                Pages\Dashboard::class,
            ])

            // ── Widgets enregistrés explicitement ──
            ->widgets([
                StatsOverviewWidget::class,
                LatestNewslettersWidget::class,
                QuickActionsWidget::class,
            ])

            // ── Middleware ──
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
