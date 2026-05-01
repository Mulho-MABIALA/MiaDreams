@section('title', ($brand->name ?? 'Marque') . ' — MIA DREAMS & CO')
@section('meta_description', 'Découvrez ' . ($brand->name ?? 'notre marque') . ' — mode africaine éthique, collections en série limitée depuis Dakar.')
@include("layouts.header")


{{-- ══ HERO ══ --}}
<div class="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
    @if($brand->image)
        <div class="absolute inset-0 bg-cover bg-center"
             style="background-image:url('{{ asset('storage/' . $brand->image) }}');filter:brightness(.35);animation:kb 14s ease forwards"></div>
    @else
        <div class="absolute inset-0 bg-[#0d0d0d]"></div>
    @endif
    <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%)"></div>
    <div class="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-14 w-full">
        <span class="block font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4"
              style="opacity:0;animation:fadeUp .8s .3s forwards">Marque</span>
        <h1 class="font-glacial font-light text-white uppercase tracking-[5px] leading-tight"
            style="font-size:clamp(2.4rem,6vw,5rem);opacity:0;animation:fadeUp .9s .5s forwards">
            {{ strtoupper($brand->name) }}<br>
            @if($brand->header_title)
                <span class="text-gold">{{ strtoupper($brand->header_title) }}</span>
            @endif
        </h1>
    </div>
</div>

{{-- ══ IDENTITÉ ══ --}}
<section class="bg-[#0d0d0d] py-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {{-- Images ou placeholder --}}
            <div class="reveal">
                @if($brand->image)
                    <img src="{{ asset('storage/' . $brand->image) }}"
                         class="w-full h-[420px] object-cover" style="filter:brightness(.85)"
                         alt="{{ $brand->name }}" loading="lazy">
                @else
                    <div class="w-full h-[420px] bg-[#1a1a1a] flex items-center justify-center border border-gold/10">
                        <span class="font-lastica text-gold/20 text-xs tracking-[6px] uppercase">{{ $brand->name }}</span>
                    </div>
                @endif
            </div>

            {{-- Texte --}}
            <div class="reveal" style="transition-delay:.15s">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre univers</span>
                <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">
                    NOTRE <span class="text-gold">IDENTITÉ</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>

                @if($brand->description)
                    <div class="font-glacial text-sm text-white/55 leading-loose space-y-3">
                        @foreach(explode("\n", $brand->description) as $para)
                            @if(trim($para))
                                <p>{{ trim($para) }}</p>
                            @endif
                        @endforeach
                    </div>
                @else
                    <p class="font-glacial text-sm text-white/55 leading-loose">
                        Découvrez l'univers {{ $brand->name }}, une marque de MIA DREAMS & CO.
                    </p>
                @endif

                @if($brand->youtube_id)
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

{{-- ══ COLLECTIONS ══ --}}
@if($collections->count())

    <div class="bg-gold py-6 text-center">
        <span class="font-glacial text-[#0d0d0d] text-xs tracking-[8px] uppercase">
            Nos Collections · {{ date('Y') }}
        </span>
    </div>

    @foreach($collections as $i => $collection)
    <section class="{{ $i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0d0d0d]' }} py-20">
        <div class="max-w-7xl mx-auto px-6 lg:px-10">

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
                @if($collection->description)
                    <p class="font-glacial text-sm text-white/40 mt-4 max-w-xl mx-auto leading-relaxed">
                        {{ $collection->description }}
                    </p>
                @endif
            </div>

            @if($collection->products->count())
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
                            <div class="w-full h-[420px] bg-[#1a1a1a] flex items-center justify-center border border-gold/10">
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
                    @if($product->price)
                    <p class="font-glacial text-sm text-gold text-center mt-2 tracking-[2px]">
                        {{ number_format($product->price, 0, ',', ' ') }} XOF
                    </p>
                    @endif
                </div>
                @endforeach
            </div>
            @else
            <div class="text-center py-10">
                <p class="font-glacial text-sm text-white/30 tracking-[3px] uppercase">Produits à venir…</p>
            </div>
            @endif

        </div>
    </section>
    @endforeach

@else
{{-- Aucune collection --}}
<section class="bg-[#111] py-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-4">Collections</span>
        <h2 class="font-glacial text-3xl font-light text-white uppercase tracking-[4px] mb-4">À VENIR</h2>
        <div class="w-10 h-px bg-gold mx-auto mb-6"></div>
        <p class="font-glacial text-sm text-white/30 tracking-[2px]">Les collections seront bientôt disponibles.</p>
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
