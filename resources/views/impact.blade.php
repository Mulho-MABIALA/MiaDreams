@section('title','Notre Impact — MIA DREAMS & CO')
@section('meta_description','L\'impact social et environnemental de MIA DREAMS & CO. Mode africaine responsable, atelier de confection, artisans valorisés.')
@section('og_image', asset('img/impact/impact.jpg'))
@include('layouts.header')


{{-- HERO --}}
<div class="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/impact/impact.jpg') }}');filter:brightness(.2)"></div>
    <div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(13,13,13,.6) 0%,rgba(13,13,13,.95) 100%)"></div>
    <div class="relative z-10 text-center px-6">
        <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
              style="opacity:0;animation:fadeUp .8s .3s forwards">Engagement & responsabilité</span>
        <h1 class="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
            style="font-size:clamp(2.4rem,6vw,5rem);opacity:0;animation:fadeUp .9s .5s forwards">
            NOTRE <span class="text-gold">IMPACT</span>
        </h1>
        <div class="w-12 h-px bg-gold mx-auto" style="opacity:0;animation:fadeUp .8s .7s forwards"></div>
    </div>
</div>

{{-- MISSION / VISION / VALEUR --}}
<section class="bg-[#0d0d0d] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-16 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Ce qui nous anime</span>
            <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">
                CULTURE <span class="text-gold">D'ENTREPRISE</span>
            </h2>
            <div class="w-10 h-px bg-gold mx-auto mt-5"></div>
        </div>

        @php $impactSections = $sections->whereIn('type', ['mission','vision','value'])->sortBy('order'); @endphp
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            @if($impactSections->count())
                @foreach($impactSections as $i => $section)
                <div class="reveal text-center border border-gold/10 p-10 hover:border-gold/30 transition-colors duration-300 group"
                     style="transition-delay:{{ $loop->index * 0.12 }}s">
                    <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        @if($section->image)
                            <img src="{{ asset('storage/' . $section->image) }}"
                                 class="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                 style="filter:brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)"
                                 alt="{{ $section->title }}">
                        @else
                            @php $icons = ['mission'=>'img/impact/symbole1.png','vision'=>'img/impact/symbole2.png','value'=>'img/impact/symbole3.png'] @endphp
                            <img src="{{ asset($icons[$section->type] ?? 'img/impact/symbole1.png') }}"
                                 class="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                 style="filter:brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)"
                                 alt="{{ $section->title }}">
                        @endif
                    </div>
                    <span class="block font-lastica text-[9px] tracking-[4px] text-gold uppercase mb-4">
                        {{ $section->title }}
                    </span>
                    @if($section->subtitle)
                        <p class="font-glacial text-xs text-gold/50 tracking-wide mb-2">{{ $section->subtitle }}</p>
                    @endif
                    <p class="font-glacial text-sm text-white/45 leading-relaxed m-0">{{ $section->content }}</p>
                </div>
                @endforeach
            @else
                @foreach([
                    ['img/impact/symbole1.png','MISSION','Rendre accessible l\'artisanat africain d\'excellence à travers des créations uniques et responsables.'],
                    ['img/impact/symbole2.png','VISION','Faire de l\'artisanat africain ce qui a de plus noble et de plus abouti — une référence mondiale.'],
                    ['img/impact/symbole3.png','VALEURS','Créativité & innovation · Professionnalisme · Mode responsable · Made In Africa'],
                ] as $i => $item)
                <div class="reveal text-center border border-gold/10 p-10 hover:border-gold/30 transition-colors duration-300 group"
                     style="transition-delay:{{ $i * 0.12 }}s">
                    <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        <img src="{{ asset($item[0]) }}" alt="{{ $item[1] }}"
                             class="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                             style="filter:brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)">
                    </div>
                    <span class="block font-lastica text-[9px] tracking-[4px] text-gold uppercase mb-4">{{ $item[1] }}</span>
                    <p class="font-glacial text-sm text-white/45 leading-relaxed m-0">{{ $item[2] }}</p>
                </div>
                @endforeach
            @endif
        </div>

        {{-- NOS ENGAGEMENTS --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="reveal">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre promesse</span>
                <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">
                    NOS <span class="text-gold">ENGAGEMENTS</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                <p class="font-glacial text-sm text-white/50 leading-loose mb-5">
                    Chez nous, la durabilité n'est pas un simple point de destination, mais un périple incessant.
                    Chaque jour, nous nous engageons dans ce voyage, guidés par notre conviction profonde.
                    Chaque pas que nous faisons, aussi minuscule soit-il, est un pas vers une économie et une
                    société qui célèbrent les artisans, honorent l'Afrique et préservent la nature.
                </p>
                <p class="font-glacial text-sm text-white/50 leading-loose">
                    Nous sommes pleinement conscients que notre parcours est semé d'embûches et de nouveaux
                    défis surgissent chaque jour. Cependant, nous restons résolus à honorer notre engagement
                    en tant qu'entreprise de mode responsable, focalisée sur la création et la fabrication de
                    produits qui transcendent le temps.
                </p>
            </div>
            <div class="reveal grid grid-cols-2 gap-4" style="transition-delay:.15s">
                @if(isset($initiatives) && $initiatives->count())
                    @foreach($initiatives as $j => $initiative)
                    <div class="bg-[#1a1a1a] border border-gold/10 p-5 hover:border-gold/30 transition-colors duration-300 group">
                        @if($initiative->image)
                            <img src="{{ asset('storage/' . $initiative->image) }}"
                                 class="w-10 h-10 object-cover mb-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                 alt="{{ $initiative->name }}">
                        @else
                            <div class="w-8 h-8 border border-gold/30 flex items-center justify-center mb-3">
                                <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                </svg>
                            </div>
                        @endif
                        <h4 class="font-glacial text-[11px] tracking-[2px] text-gold uppercase mb-2">{{ $initiative->name }}</h4>
                        <p class="font-glacial text-xs text-white/40 leading-relaxed m-0">{{ $initiative->description }}</p>
                        @if($initiative->youtube_id)
                        <a href="https://youtube.com/watch?v={{ $initiative->youtube_id }}" target="_blank"
                           class="inline-block mt-3 font-lastica text-[8px] tracking-[2px] text-gold/50 hover:text-gold uppercase transition-colors">
                            ▶ Voir la vidéo
                        </a>
                        @endif
                    </div>
                    @endforeach
                @else
                    @foreach([
                        ['Made In Africa','100% de nos créations sont fabriquées sur le continent africain.'],
                        ['Artisans','Nous valorisons et rémunérons équitablement chaque artisan partenaire.'],
                        ['Matières','Sélection rigoureuse de matières locales et eco-responsables.'],
                        ['Formation','Programme de formation pour transmettre le savoir-faire africain.'],
                    ] as $eng)
                    <div class="bg-[#1a1a1a] border border-gold/10 p-5 hover:border-gold/30 transition-colors duration-300">
                        <h4 class="font-glacial text-[11px] tracking-[2px] text-gold uppercase mb-2">{{ $eng[0] }}</h4>
                        <p class="font-glacial text-xs text-white/40 leading-relaxed m-0">{{ $eng[1] }}</p>
                    </div>
                    @endforeach
                @endif
            </div>
        </div>
    </div>
</section>

{{-- ATELIER --}}
<section class="bg-[#111] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-14 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Fait au Sénégal</span>
            <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">
                NOTRE <span class="text-gold">ATELIER</span>
            </h2>
            <div class="w-10 h-px bg-gold mx-auto mt-5"></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="reveal relative overflow-hidden group">
                <img src="{{ asset('img/impact/impact.jpg') }}"
                     class="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                     style="filter:brightness(.75)" alt="Atelier de confection" loading="lazy">
                <div class="absolute inset-0 border border-gold/10 pointer-events-none"></div>
            </div>
            <div class="reveal" style="transition-delay:.15s">
                <p class="font-glacial text-sm text-white/50 leading-loose mb-6">
                    Toutes nos créations sont produites en série limitée dans notre atelier de confection basé au
                    Sénégal, afin de maîtriser notre production et de créer de l'emploi local.
                </p>
                <p class="font-glacial text-sm text-white/50 leading-loose mb-8">
                    Notre atelier à taille humaine est parfaitement équipé avec des machines de qualité
                    pour offrir de belles finitions et garantir l'excellence de chaque pièce.
                </p>
                <div class="flex flex-wrap gap-3">
                    @foreach(['Série limitée','Fait main','Qualité premium','Local & éthique'] as $tag)
                    <span class="font-lastica text-[8px] tracking-[3px] uppercase text-gold border border-gold/30 px-4 py-2">{{ $tag }}</span>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>

{{-- MODE RESPONSABLE --}}
<section class="relative py-32 overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/impact/impact1.jpg') }}');filter:brightness(.18)"></div>
    <div class="absolute inset-0" style="background:rgba(13,13,13,.6)"></div>
    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center reveal">
        <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-5">Notre philosophie</span>
        <h2 class="font-glacial font-light text-white uppercase tracking-[4px] mb-8"
            style="font-size:clamp(2rem,5vw,4rem)">
            UNE MODE <span class="text-gold">RESPONSABLE</span>
        </h2>
        <p class="font-glacial text-base text-white/50 leading-loose max-w-2xl mx-auto mb-10">
            Nous croyons que la mode peut être un vecteur de changement positif. Chaque pièce que nous
            créons raconte une histoire — celle d'un artisan, d'un territoire, d'un héritage qui mérite
            d'être célébré et transmis aux générations futures.
        </p>
        <a href="{{ route('contact') }}"
           class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                  border border-gold px-10 py-4
                  hover:bg-gold hover:text-[#0d0d0d] transition-all duration-300" style="text-decoration:none">
            NOUS REJOINDRE
        </a>
    </div>
</section>

@include('layouts.footer')
<script>
const obs = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add('visible'); }), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
</script>
