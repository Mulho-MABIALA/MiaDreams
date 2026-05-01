{{-- ══════════════════════════════════════
   FOOTER — Tailwind CSS
══════════════════════════════════════ --}}

{{-- Newsletter --}}
<div class="bg-[#111] border-t border-gold/20">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div class="flex-1">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Restez connecté</span>
                <h4 class="font-glacial text-2xl font-light text-white tracking-[3px] uppercase mb-1">
                    NEWSLETTER <span class="text-gold">MIA DREAMS</span>
                </h4>
                <p class="font-glacial text-[13px] text-white/40 tracking-wide">Nouveautés, collections exclusives & coulisses</p>
            </div>
            <div class="w-full lg:w-auto lg:min-w-[400px]">
                @if(session('newsletter_success'))
                    <p class="font-glacial text-sm text-gold tracking-widest">✓ {{ session('newsletter_success') }}</p>
                @else
                    <form action="{{ route('newsletter.store') }}" method="POST">
                        @csrf
                        <div class="flex">
                            <input type="email" name="email" placeholder="VOTRE EMAIL" value="{{ old('email') }}" required
                                   class="flex-1 bg-transparent border border-white/15 border-r-0 text-white placeholder-white/25
                                          px-5 py-3.5 font-glacial text-sm tracking-wide outline-none
                                          focus:border-gold/50 transition-colors duration-300">
                            <button type="submit"
                                    class="bg-gold text-[#0d0d0d] border-none px-6 py-3.5
                                           font-glacial text-[9px] tracking-[3px] uppercase whitespace-nowrap
                                           hover:bg-gold-light transition-colors duration-300 cursor-pointer">
                                S'ABONNER
                            </button>
                        </div>
                        @error('email')
                            <p class="text-red-400 text-xs mt-2 font-glacial tracking-wide">{{ $message }}</p>
                        @enderror
                    </form>
                @endif
            </div>
        </div>
    </div>
</div>

{{-- Footer body --}}
<footer class="bg-[#0a0a0a]">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.07]">

            {{-- Colonne 1 : Logo + description + réseaux --}}
            <div>
                @if(isset($companyInfo) && $companyInfo && $companyInfo->logo)
                    <img src="{{ asset($companyInfo->logo) }}" alt="MIA DREAMS"
                         class="h-12 w-auto mb-5 brightness-0 invert opacity-80">
                @else
                    <img src="{{ asset('img/logo_MIA.png') }}" alt="MIA DREAMS"
                         class="h-12 w-auto mb-5 brightness-0 invert opacity-80">
                @endif
                <p class="font-glacial text-[13px] text-white/45 leading-relaxed mb-6 max-w-[220px]">
                    Maison de mode africaine éthique basée à Dakar, Sénégal.
                </p>
                @php
                $socialIcons = [
                    'facebook'  => ['bg'=>'#1877F2','hover'=>'#0d65d9','svg'=>'<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>'],
                    'instagram' => ['bg'=>'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)','hover'=>'#c13584','svg'=>'<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>'],
                    'youtube'   => ['bg'=>'#FF0000','hover'=>'#cc0000','svg'=>'<path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>'],
                    'linkedin'  => ['bg'=>'#0A66C2','hover'=>'#004182','svg'=>'<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'],
                    'tiktok'    => ['bg'=>'#000000','hover'=>'#333','svg'=>'<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'],
                    'pinterest' => ['bg'=>'#E60023','hover'=>'#ad081b','svg'=>'<path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>'],
                ];
                @endphp

                <div class="flex flex-wrap gap-2.5">
                    @if(isset($socialMediaLinks) && $socialMediaLinks->count() > 0)
                        @foreach($socialMediaLinks as $s)
                        @php $key = strtolower($s->platform); $icon = $socialIcons[$key] ?? null; @endphp
                        <a href="{{ $s->url }}" target="_blank" rel="noopener"
                           @if($icon) style="background:{{ $icon['bg'] }}" @endif
                           class="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                           title="{{ $s->platform }}">
                            @if($icon)
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    {!! $icon['svg'] !!}
                                </svg>
                            @else
                                <img src="{{ asset($s->icon) }}" alt="{{ $s->platform }}" class="w-4 h-4 object-contain brightness-0 invert">
                            @endif
                        </a>
                        @endforeach
                    @else
                        @foreach([
                            ['#','facebook'],
                            ['#','instagram'],
                            ['#','youtube'],
                            ['#','linkedin'],
                        ] as $s)
                        @php $icon = $socialIcons[$s[1]] ?? null; @endphp
                        <a href="{{ $s[0] }}"
                           @if($icon) style="background:{{ $icon['bg'] }}" @endif
                           class="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                           title="{{ ucfirst($s[1]) }}">
                            @if($icon)
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    {!! $icon['svg'] !!}
                                </svg>
                            @endif
                        </a>
                        @endforeach
                    @endif
                </div>
            </div>

            {{-- Colonne 2 : Navigation --}}
            <div>
                <span class="block font-lastica text-[9px] tracking-[4px] text-gold uppercase mb-5">Navigation</span>
                <ul class="space-y-3">
                    @if(isset($navBrands) && $navBrands->count())
                        @foreach($navBrands as $navBrand)
                        <li>
                            <a href="{{ route('brand.show', $navBrand->slug) }}"
                               class="font-glacial text-[13px] text-white/50 tracking-wide
                                      hover:text-gold transition-colors duration-250 inline-block">
                                {{ $navBrand->name }}
                            </a>
                        </li>
                        @endforeach
                    @else
                        @foreach([['miaDreams','Mia Dreams'],['mprew','MPREW'],['personalBranding','Personal Branding'],['fashionProgram','Fashion Program']] as $l)
                        <li>
                            <a href="{{ route($l[0]) }}"
                               class="font-glacial text-[13px] text-white/50 tracking-wide
                                      hover:text-gold transition-colors duration-250 inline-block">
                                {{ $l[1] }}
                            </a>
                        </li>
                        @endforeach
                    @endif
                    <li><a href="{{ route('galerie') }}" class="font-glacial text-[13px] text-white/50 tracking-wide hover:text-gold transition-colors duration-250 inline-block">Galerie</a></li>
                    <li><a href="{{ route('catalogues') }}" class="font-glacial text-[13px] text-white/50 tracking-wide hover:text-gold transition-colors duration-250 inline-block">Catalogues</a></li>
                    <li><a href="{{ route('apropos') }}" class="font-glacial text-[13px] text-white/50 tracking-wide hover:text-gold transition-colors duration-250 inline-block">À Propos</a></li>
                    <li><a href="{{ route('impact') }}" class="font-glacial text-[13px] text-white/50 tracking-wide hover:text-gold transition-colors duration-250 inline-block">Notre Impact</a></li>
                    <li><a href="{{ route('blog') }}" class="font-glacial text-[13px] text-white/50 tracking-wide hover:text-gold transition-colors duration-250 inline-block">Blog & Podcast</a></li>
                </ul>
            </div>

            {{-- Colonne 3 : Catalogues --}}
            <div>
                <span class="block font-lastica text-[9px] tracking-[4px] text-gold uppercase mb-5">Catalogues</span>
                <ul class="space-y-3">
                    @if(isset($navCatalogues) && $navCatalogues->count())
                        @foreach($navCatalogues->take(5) as $cat)
                        <li>
                            <a href="{{ route('catalogue.download', $cat->id) }}"
                               class="font-glacial text-[13px] text-white/50 tracking-wide
                                      hover:text-gold transition-colors duration-250 inline-flex items-center gap-1.5">
                                <svg class="w-3 h-3 text-gold/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                {{ $cat->name }}
                            </a>
                        </li>
                        @endforeach
                    @endif
                    <li>
                        <a href="{{ route('catalogues') }}"
                           class="font-glacial text-[12px] text-gold/70 tracking-wide
                                  hover:text-gold transition-colors duration-250 inline-block mt-1">
                            Voir tous →
                        </a>
                    </li>
                </ul>
            </div>

            {{-- Colonne 4 : Nous trouver --}}
            <div>
                <span class="block font-lastica text-[9px] tracking-[4px] text-gold uppercase mb-6">Nous Trouver</span>

                <div class="space-y-5">
                    {{-- Adresse --}}
                    <div class="flex gap-4 items-start">
                        <div class="w-9 h-9 flex-shrink-0 bg-gold/10 border border-gold/30 flex items-center justify-center">
                            <svg class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <div>
                            <span class="block font-lastica text-[8px] tracking-[2px] text-gold/60 uppercase mb-1">Adresse</span>
                            <span class="font-glacial text-[13px] text-white/70 leading-relaxed">
                                @if(isset($companyInfo) && $companyInfo && $companyInfo->address)
                                    {!! nl2br(e($companyInfo->address)) !!}
                                @else
                                    3 rue Bégenger Ferraud<br>CTIC DAKAR, Sénégal
                                @endif
                            </span>
                        </div>
                    </div>

                    {{-- Téléphone --}}
                    <div class="flex gap-4 items-center">
                        <div class="w-9 h-9 flex-shrink-0 bg-gold/10 border border-gold/30 flex items-center justify-center">
                            <svg class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                        </div>
                        <div>
                            <span class="block font-lastica text-[8px] tracking-[2px] text-gold/60 uppercase mb-1">Téléphone</span>
                            <a href="tel:{{ isset($companyInfo) && $companyInfo && $companyInfo->phone ? $companyInfo->phone : '+221764639169' }}"
                               class="font-glacial text-[13px] text-white/70 hover:text-gold transition-colors duration-250">
                                {{ isset($companyInfo) && $companyInfo && $companyInfo->phone ? $companyInfo->phone : '+221 76 463 91 69' }}
                            </a>
                        </div>
                    </div>

                    {{-- Email --}}
                    <div class="flex gap-4 items-center">
                        <div class="w-9 h-9 flex-shrink-0 bg-gold/10 border border-gold/30 flex items-center justify-center">
                            <svg class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div>
                            <span class="block font-lastica text-[8px] tracking-[2px] text-gold/60 uppercase mb-1">Email</span>
                            <a href="mailto:{{ isset($companyInfo) && $companyInfo && $companyInfo->email ? $companyInfo->email : 'contact@mia-dreams.com' }}"
                               class="font-glacial text-[13px] text-white/70 hover:text-gold transition-colors duration-250">
                                {{ isset($companyInfo) && $companyInfo && $companyInfo->email ? $companyInfo->email : 'contact@mia-dreams.com' }}
                            </a>
                        </div>
                    </div>
                </div>

                <a href="{{ route('contact') }}"
                   class="inline-block mt-6 bg-gold text-[#0d0d0d] font-glacial text-[10px] tracking-[3px] uppercase px-7 py-3
                          hover:bg-gold-light transition-colors duration-300">
                    NOUS ÉCRIRE →
                </a>
            </div>

        </div>

        {{-- Copyright --}}
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
            <p class="font-glacial text-[11px] text-white/30 tracking-wide">
                © {{ date('Y') }} <strong class="font-normal text-white/50">MIA DREAMS & CO</strong> — Tous droits réservés
            </p>
            <p class="font-glacial text-[11px] text-gold/70 tracking-[2px]">Made In Africa 🌍</p>
        </div>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

{{-- ── Bouton de bascule thème clair / sombre ── --}}
<button id="theme-toggle"
        aria-label="Changer le thème"
        data-label="Mode sombre"
        title="Mode sombre">
    {{-- Icône lune (mode sombre) --}}
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
    </svg>
    {{-- Icône soleil (mode clair) --}}
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
</button>

{{-- Script thème --}}
<script src="{{ asset('js/theme.js') }}"></script>

</body>
</html>
