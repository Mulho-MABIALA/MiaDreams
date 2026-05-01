<!DOCTYPE html>
<html lang="fr" prefix="og: https://ogp.me/ns#" data-theme="light">
<head>
    {{-- Applique le thème sauvegardé avant tout rendu pour éviter le flash --}}
    <script>(function(){var t=localStorage.getItem('mia-theme')||'light';document.documentElement.setAttribute('data-theme',t);})()</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    {{-- SEO de base --}}
    <title>@yield('title','MIA DREAMS & CO')</title>
    <meta name="description" content="@yield('meta_description','Maison de mode africaine éthique — MIA DREAMS & CO, Dakar.')">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- Open Graph (Facebook, WhatsApp, LinkedIn) --}}
    <meta property="og:type"        content="@yield('og_type','website')">
    <meta property="og:site_name"   content="MIA DREAMS & CO">
    <meta property="og:locale"      content="fr_FR">
    <meta property="og:url"         content="{{ url()->current() }}">
    <meta property="og:title"       content="@yield('title','MIA DREAMS & CO')">
    <meta property="og:description" content="@yield('meta_description','Maison de mode africaine éthique — MIA DREAMS & CO, Dakar.')">
    <meta property="og:image"       content="@yield('og_image', asset('img/og-default.jpg'))">
    <meta property="og:image:width"  content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt"    content="@yield('title','MIA DREAMS & CO')">

    {{-- Twitter Card --}}
    <meta name="twitter:card"        content="summary_large_image">
    <meta name="twitter:title"       content="@yield('title','MIA DREAMS & CO')">
    <meta name="twitter:description" content="@yield('meta_description','Maison de mode africaine éthique — MIA DREAMS & CO, Dakar.')">
    <meta name="twitter:image"       content="@yield('og_image', asset('img/og-default.jpg'))">

    <link rel="icon" href="{{ asset('img/icone-miadreams.png') }}" type="image/x-icon">

    {{-- Typographie Cormorant Garamond (serif élégant pour titres) --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet">

    {{-- Bootstrap CSS (pour les pages nosMarques existantes) --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

    {{-- CSS pages spécifiques (ancien système) --}}
    <link rel="stylesheet" href="{{ asset('css/header-footer.css') }}">
    <link rel="stylesheet" href="{{ asset('css/miadreams.css')}}">
    <link rel="stylesheet" href="{{ asset('css/mprew.css')}}">
    <link rel="stylesheet" href="{{ asset('css/personal-branding.css') }}">
    <link rel="stylesheet" href="{{ asset('css/fashionprogram.css')}}">
    <link rel="stylesheet" href="{{ asset('css/a-propos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/impact.css')}}">

    {{-- Design system client MIA DREAMS --}}
    <link rel="stylesheet" href="{{ asset('css/mia-design.css') }}?v={{ filemtime(public_path('css/mia-design.css')) }}">

    {{-- Vite — Tailwind compilé + JS ── --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>

{{-- PRELOADER --}}
<div id="pl">
    <img src="{{ asset('img/logo_MIA.png') }}" alt="MIA DREAMS">
    <div id="pl-bar"><span></span></div>
    <p id="pl-txt">Chargement…</p>
</div>

{{-- NAVBAR --}}
<nav class="fixed top-0 inset-x-0 z-[9999] h-[70px] bg-[#0d0d0d] border-b border-[rgba(196,162,103,0.12)] flex items-center">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 w-full flex items-center justify-between">

        {{-- Logo --}}
        <a href="{{ route('index') }}" class="flex-shrink-0">
            <img src="{{ asset('img/logo_MIA.png') }}" alt="MIA DREAMS"
                 class="h-9 w-auto brightness-0 invert opacity-90">
        </a>

        {{-- Desktop nav --}}
        <ul class="hidden lg:flex items-center gap-1">

            <li>
                <a href="{{ route('index') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60
                          hover:text-gold transition-colors duration-250 px-4 py-2 block">
                    HOME
                </a>
            </li>

            {{-- NOS MARQUES --}}
            <li class="nav-dropdown">
                <button class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60
                               hover:text-gold transition-colors duration-250 px-4 py-2 flex items-center gap-1.5">
                    NOS MARQUES
                    <svg class="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                <div class="nav-dropdown-menu">
                    @if(isset($navBrands) && $navBrands->count())
                        @foreach($navBrands as $navBrand)
                            <a href="{{ route('brand.show', $navBrand->slug) }}">{{ $navBrand->name }}</a>
                        @endforeach
                    @else
                        <a href="{{ route('miaDreams') }}">Mia Dreams</a>
                        <a href="{{ route('mprew') }}">MPREW</a>
                        <a href="{{ route('fashionProgram') }}">Fashion Program</a>
                        <a href="{{ route('personalBranding') }}">Personal Branding</a>
                    @endif
                </div>
            </li>

            {{-- CATALOGUES --}}
            <li>
                <a href="{{ route('catalogues') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60
                          hover:text-gold transition-colors duration-250 px-4 py-2 block">
                    CATALOGUES
                </a>
            </li>

            {{-- GALERIE --}}
            <li>
                <a href="{{ route('galerie') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60
                          hover:text-gold transition-colors duration-250 px-4 py-2 block">
                    GALERIE
                </a>
            </li>

            {{-- JOURNAL --}}
            <li class="nav-dropdown">
                <button class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60
                               hover:text-gold transition-colors duration-250 px-4 py-2 flex items-center gap-1.5">
                    JOURNAL
                    <svg class="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
                <div class="nav-dropdown-menu">
                    <a href="{{ route('apropos') }}">À Propos</a>
                    <a href="{{ route('blog') }}">Blog & Podcast</a>
                </div>
            </li>

            <li>
                <a href="{{ route('impact') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60
                          hover:text-gold transition-colors duration-250 px-4 py-2 block">
                    IMPACT
                </a>
            </li>

            <li class="ml-4">
                <a href="{{ route('contact') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-gold
                          border border-gold/50 px-5 py-2
                          hover:bg-gold hover:text-[#0d0d0d] hover:border-gold
                          transition-all duration-300 block">
                    CONTACT
                </a>
            </li>
        </ul>

        {{-- Hamburger --}}
        <button id="hamburger" class="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] z-50"
                aria-label="Menu">
            <span id="h1" class="block w-6 h-px bg-white/70 transition-all duration-300 origin-center"></span>
            <span id="h2" class="block w-6 h-px bg-white/70 transition-all duration-300"></span>
            <span id="h3" class="block w-6 h-px bg-white/70 transition-all duration-300 origin-center"></span>
        </button>
    </div>

    {{-- Mobile menu --}}
    <div id="mobile-menu" class="absolute top-full inset-x-0 lg:hidden">
        <ul class="py-4 px-6 flex flex-col gap-1">
            <li><a href="{{ route('index') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60 hover:text-gold py-3 block border-b border-white/[0.05] transition-colors duration-200">
                HOME</a></li>

            <li class="py-2 border-b border-white/[0.05]">
                <span class="font-glacial text-[11px] tracking-[3px] uppercase text-gold/50 block mb-2">NOS MARQUES</span>
                <div class="flex flex-col gap-1 pl-3">
                    @if(isset($navBrands) && $navBrands->count())
                        @foreach($navBrands as $navBrand)
                            <a href="{{ route('brand.show', $navBrand->slug) }}"
                               class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">
                                {{ $navBrand->name }}
                            </a>
                        @endforeach
                    @else
                        <a href="{{ route('miaDreams') }}" class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">Mia Dreams</a>
                        <a href="{{ route('mprew') }}" class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">MPREW</a>
                        <a href="{{ route('fashionProgram') }}" class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">Fashion Program</a>
                        <a href="{{ route('personalBranding') }}" class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">Personal Branding</a>
                    @endif
                </div>
            </li>

            <li><a href="{{ route('catalogues') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60 hover:text-gold py-3 block border-b border-white/[0.05] transition-colors duration-200">
                CATALOGUES</a></li>

            <li><a href="{{ route('galerie') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60 hover:text-gold py-3 block border-b border-white/[0.05] transition-colors duration-200">
                GALERIE</a></li>

            <li class="py-2 border-b border-white/[0.05]">
                <span class="font-glacial text-[11px] tracking-[3px] uppercase text-gold/50 block mb-2">JOURNAL</span>
                <div class="flex flex-col gap-1 pl-3">
                    <a href="{{ route('apropos') }}" class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">À Propos</a>
                    <a href="{{ route('blog') }}" class="font-glacial text-[11px] tracking-[2px] uppercase text-white/50 hover:text-gold py-1.5 transition-colors duration-200">Blog & Podcast</a>
                </div>
            </li>

            <li><a href="{{ route('impact') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-white/60 hover:text-gold py-3 block border-b border-white/[0.05] transition-colors duration-200">
                IMPACT</a></li>

            <li class="pt-4">
                <a href="{{ route('contact') }}"
                   class="font-glacial text-[11px] tracking-[3px] uppercase text-gold border border-gold/50
                          px-5 py-3 block text-center hover:bg-gold hover:text-[#0d0d0d] transition-all duration-300">
                    CONTACT
                </a>
            </li>
        </ul>
    </div>
</nav>

<script>
// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const h1 = document.getElementById('h1');
const h2 = document.getElementById('h2');
const h3 = document.getElementById('h3');
let open = false;
hamburger.addEventListener('click', () => {
    open = !open;
    mobileMenu.classList.toggle('open', open);
    if (open) {
        h1.style.cssText = 'transform:translateY(6px) rotate(45deg)';
        h2.style.cssText = 'opacity:0';
        h3.style.cssText = 'transform:translateY(-6px) rotate(-45deg)';
    } else {
        h1.style.cssText = '';
        h2.style.cssText = '';
        h3.style.cssText = '';
    }
});
</script>
