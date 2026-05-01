@section('title','Mia Dreams — MIA DREAMS & CO')
@section('meta_description','Découvrez la marque Mia Dreams — mode africaine éthique, collections en série limitée depuis Dakar.')
@include("layouts.header")


{{-- ══ HERO ══ --}}
<div class="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
    @if($brand && $brand->image)
        <div class="absolute inset-0 bg-cover bg-center"
             style="background-image:url('{{ asset('storage/' . $brand->image) }}');filter:brightness(.35);animation:kb 14s ease forwards"></div>
    @else
        <div class="absolute inset-0 bg-cover bg-center"
             style="background-image:url('{{ asset('img/miadreams/img1.jpg') }}');filter:brightness(.35);animation:kb 14s ease forwards"></div>
    @endif
    <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%)"></div>
    <div class="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-14 w-full">
        <span class="block font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4"
              style="opacity:0;animation:fadeUp .8s .3s forwards">Collection</span>
        <h1 class="font-glacial font-light text-white uppercase tracking-[5px] leading-tight"
            style="font-size:clamp(2.4rem,6vw,5rem);opacity:0;animation:fadeUp .9s .5s forwards">
            {{ $brand ? strtoupper($brand->name) : 'MIA DREAMS' }}<br>
            <span class="text-gold">{{ $brand && $brand->header_title ? strtoupper($brand->header_title) : 'BRAND' }}</span>
        </h1>
    </div>
</div>

{{-- ══ UNIVERS ══ --}}
<section class="bg-[#0d0d0d] py-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div class="reveal grid grid-cols-2 gap-3">
                <img src="{{ asset('img/miadreams/img1.jpg') }}"
                     class="w-full h-64 object-cover" style="filter:brightness(.85)" alt="Mia Dreams" loading="lazy">
                <img src="{{ asset('img/miadreams/img2.jpg') }}"
                     class="w-full h-64 object-cover mt-6" style="filter:brightness(.85)" alt="Mia Dreams" loading="lazy">
            </div>
            <div class="reveal" style="transition-delay:.15s">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre univers</span>
                <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">
                    NOTRE <span class="text-gold">IDENTITÉ</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                @if($brand && $brand->description)
                    <div class="font-glacial text-sm text-white/55 leading-loose space-y-3">
                        @foreach(explode("\n", $brand->description) as $para)
                            @if(trim($para))
                                <p>{{ trim($para) }}</p>
                            @endif
                        @endforeach
                    </div>
                @else
                    <p class="font-glacial text-sm text-white/55 leading-loose mb-3">
                        Mia Dreams est une marque de mode et de style de vie aux influences Afro-vintage, créée pour
                        apporter une touche d'authenticité dans vos garde-robes.
                    </p>
                    <p class="font-glacial text-sm text-white/55 leading-loose mb-3">
                        Toutes nos créations sont éditées en petites séries pour satisfaire les adeptes d'exclusivité.
                        Nous proposons des pièces modernes, sophistiquées, élégantes et confortables.
                    </p>
                    <p class="font-glacial text-sm text-white/55 leading-loose">
                        Mia signifie Made In Africa — une volonté de promouvoir notre culture et les savoir-faire
                        des artisans. Toutes nos créations sont produites dans notre atelier au Sénégal.
                    </p>
                @endif

                @if($brand && $brand->youtube_id)
                <div class="mt-8">
                    <div class="relative w-full" style="padding-bottom:56.25%">
                        <iframe class="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/{{ $brand->youtube_id }}"
                                frameborder="0" allowfullscreen loading="lazy"></iframe>
                    </div>
                </div>
                @endif
            </div>
        </div>
    </div>
</section>

{{-- ══ COLLECTIONS DYNAMIQUES ══ --}}
@if($collections->count())

    {{-- Séparateur --}}
    <div class="bg-gold py-6 text-center">
        <span class="font-glacial text-[#0d0d0d] text-xs tracking-[8px] uppercase">
            Nos Collections · {{ date('Y') }}
        </span>
    </div>

    @foreach($collections as $i => $collection)
    <section class="{{ $i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0d0d0d]' }} py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-10">

            {{-- Titre de collection --}}
            <div class="text-center mb-12 reveal">
                @if($collection->image)
                    <img src="{{ asset('storage/' . $collection->image) }}"
                         class="w-full max-h-[340px] object-cover mb-8" style="filter:brightness(.85)"
                         alt="{{ $collection->name }}" loading="lazy">
                @endif
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Collection</span>
                <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[4px]">
                    {{ strtoupper($collection->name) }}
                </h2>
                <div class="w-10 h-px bg-gold mx-auto mt-4"></div>
            </div>

            @if($collection->products->count())
            {{-- Grille produits --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-{{ min($collection->products->count(), 3) }} gap-6">
                @foreach($collection->products as $j => $product)
                <div class="reveal group" style="transition-delay:{{ $j * 0.1 }}s">
                    <div class="relative overflow-hidden mb-4">
                        @if($product->image)
                            <img src="{{ asset('storage/' . $product->image) }}"
                                 class="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                                 style="filter:brightness(.88)"
                                 alt="{{ $product->name }}" loading="lazy">
                        @else
                            <div class="w-full h-[420px] bg-[#1a1a1a] flex items-center justify-center">
                                <svg class="w-12 h-12 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        @endif
                        <div class="absolute bottom-0 inset-x-0 h-16"
                             style="background:linear-gradient(to top,rgba(0,0,0,.7),transparent)"></div>
                    </div>
                    <h4 class="font-glacial text-base text-white uppercase tracking-[2px] text-center">
                        {{ $product->name }}
                    </h4>
                    @if($product->description)
                    <p class="font-glacial text-xs text-white/40 text-center mt-1 leading-relaxed">
                        {{ Str::limit($product->description, 80) }}
                    </p>
                    @endif
                </div>
                @endforeach
            </div>
            @else
            {{-- Collection sans produits --}}
            <div class="text-center py-10">
                <p class="font-glacial text-sm text-white/30 tracking-[3px] uppercase">
                    Produits à venir…
                </p>
            </div>
            @endif

        </div>
    </section>
    @endforeach

@else
{{-- Fallback si aucune collection en DB --}}
<section class="bg-[#111] py-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-12 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Collection</span>
            <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[4px]">BCBG</h2>
            <div class="w-10 h-px bg-gold mx-auto mt-4"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @foreach([['img/miadreams/img3.jpg','Cape Scarlett'],['img/miadreams/img4.jpg','Tunique Lou'],['img/miadreams/img5.jpg','Julia Dress']] as $j => $p)
            <div class="reveal group" style="transition-delay:{{ $j * 0.1 }}s">
                <div class="overflow-hidden mb-4">
                    <img src="{{ asset($p[0]) }}"
                         class="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                         style="filter:brightness(.88)" alt="{{ $p[1] }}" loading="lazy">
                </div>
                <h4 class="font-glacial text-base text-white uppercase tracking-[2px] text-center">{{ $p[1] }}</h4>
            </div>
            @endforeach
        </div>
    </div>
</section>
<section class="bg-[#0d0d0d] py-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-12 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Nouvelle gamme</span>
            <h2 class="font-glacial text-3xl font-light text-white uppercase tracking-[4px]">100% COTON · TISSUS TEINTS À LA MAIN</h2>
            <div class="w-10 h-px bg-gold mx-auto mt-4"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            @foreach(['img/miadreams/img6.jpg','img/miadreams/img7.jpg','img/miadreams/img8.jpg'] as $k => $src)
            <div class="reveal overflow-hidden" style="transition-delay:{{ $k * 0.1 }}s">
                <img src="{{ asset($src) }}"
                     class="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
                     style="filter:brightness(.85)" alt="Nouvelle gamme" loading="lazy">
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- ══ CTA ══ --}}
<div class="bg-gold py-14 text-center">
    <span class="block font-lastica text-[9px] tracking-[5px] text-[#0d0d0d] uppercase mb-3">Commander</span>
    <h3 class="font-glacial text-3xl font-light text-[#0d0d0d] uppercase tracking-[4px] mb-6">
        UNE PIÈCE VOUS A <span style="text-decoration:underline;text-underline-offset:6px">SÉDUIT</span> ?
    </h3>
    <a href="{{ route('contact') }}"
       class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
              bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300" style="text-decoration:none">
        NOUS CONTACTER →
    </a>
</div>

@include("layouts.footer")
<script>
const obs = new IntersectionObserver(e => e.forEach(x => {
    if(x.isIntersecting) x.target.classList.add('visible');
}), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
</script>
