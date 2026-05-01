@section('title','Galerie — MIA DREAMS & CO')
@section('meta_description','Galerie photos MIA DREAMS & CO — collections, créations et moments forts de la maison de mode africaine.')
@section('og_image', asset('img/index/home-image3.jpg'))
@include('layouts.header')
@php
// Helper : retourne l'URL correcte selon que le chemin est un asset statique ou un upload Filament
function galleryUrl(string $path): string {
    if (str_starts_with($path, 'img/') || str_starts_with($path, 'images/')) {
        return asset($path);
    }
    return asset('storage/' . $path);
}
@endphp

{{-- HERO --}}
<div class="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/index/home-image1.jpg') }}');filter:brightness(.2)"></div>
    <div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(13,13,13,.5) 0%,rgba(13,13,13,.98) 100%)"></div>
    <div class="relative z-10 text-center px-6">
        <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
              style="opacity:0;animation:fadeUp .8s .3s forwards">Nos créations</span>
        <h1 class="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
            style="font-size:clamp(2.4rem,6vw,5rem);opacity:0;animation:fadeUp .9s .5s forwards">
            NOTRE <span class="text-gold">GALERIE</span>
        </h1>
        <div class="w-12 h-px bg-gold mx-auto" style="opacity:0;animation:fadeUp .8s .7s forwards"></div>
    </div>
</div>

{{-- FILTRES --}}
@if($brands->count() || $collections->count())
<div class="bg-[#111] border-b border-gold/10 sticky top-[70px] z-40 py-4">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap items-center gap-3">
        <span class="font-lastica text-[8px] tracking-[3px] text-gold/50 uppercase mr-2">Filtrer :</span>

        <button onclick="filterGallery('all')" data-filter="all"
                class="gallery-filter active font-glacial text-[10px] tracking-[2px] uppercase border border-gold/30 px-4 py-1.5 text-gold transition-all duration-200 hover:bg-gold hover:text-[#0d0d0d]">
            Tout
        </button>

        @foreach($brands as $brand)
        <button onclick="filterGallery('brand-{{ $brand->id }}')" data-filter="brand-{{ $brand->id }}"
                class="gallery-filter font-glacial text-[10px] tracking-[2px] uppercase border border-white/10 px-4 py-1.5 text-white/50 transition-all duration-200 hover:bg-gold hover:text-[#0d0d0d] hover:border-gold">
            {{ $brand->name }}
        </button>
        @endforeach

        @foreach($collections as $col)
        <button onclick="filterGallery('col-{{ $col->id }}')" data-filter="col-{{ $col->id }}"
                class="gallery-filter font-glacial text-[10px] tracking-[2px] uppercase border border-white/10 px-4 py-1.5 text-white/50 transition-all duration-200 hover:bg-gold hover:text-[#0d0d0d] hover:border-gold">
            {{ $col->name }}
        </button>
        @endforeach
    </div>
</div>
@endif

{{-- GRILLE PHOTOS --}}
<section class="bg-[#0d0d0d] py-16 min-h-[60vh]">
    <div class="max-w-7xl mx-auto px-4 lg:px-8">

        @if($photos->count())

        <div id="gallery-grid" class="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            @foreach($photos as $photo)
            <div class="gallery-item reveal break-inside-avoid group relative overflow-hidden cursor-pointer"
                 data-brand="{{ $photo->brand_id ? 'brand-' . $photo->brand_id : '' }}"
                 data-col="{{ $photo->collection_id ? 'col-' . $photo->collection_id : '' }}"
                 onclick="openLightbox('{{ galleryUrl($photo->image) }}', '{{ addslashes($photo->caption ?? '') }}')"
                 style="transition-delay:{{ ($loop->index % 12) * 0.04 }}s">

                <img src="{{ galleryUrl($photo->image) }}"
                     class="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                     style="filter:brightness(.88)"
                     alt="{{ $photo->caption ?? 'MIA DREAMS' }}" loading="lazy">

                {{-- Overlay --}}
                <div class="absolute inset-0 bg-[#0d0d0d]/60 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                    <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                    @if($photo->caption)
                    <span class="font-glacial text-[10px] tracking-[2px] text-white/80 uppercase px-4 text-center">
                        {{ $photo->caption }}
                    </span>
                    @endif
                    @if($photo->collection)
                    <span class="font-lastica text-[8px] tracking-[2px] text-gold/70 uppercase">
                        {{ $photo->collection->name }}
                    </span>
                    @endif
                </div>
            </div>
            @endforeach
        </div>

        @else

        <div class="text-center py-32">
            <svg class="w-16 h-16 text-gold/15 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="font-glacial text-sm text-white/30 tracking-[3px] uppercase">Galerie à venir…</p>
        </div>

        @endif
    </div>
</section>

{{-- LIGHTBOX --}}
<div id="lightbox" class="fixed inset-0 z-[99999] bg-black/95 hidden items-center justify-center"
     onclick="closeLightbox()">
    <button onclick="closeLightbox()" class="absolute top-6 right-6 text-white/60 hover:text-gold transition-colors z-10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
    </button>
    <div class="relative max-w-5xl max-h-[90vh] mx-4" onclick="event.stopPropagation()">
        <img id="lb-img" src="" alt=""
             class="max-h-[85vh] max-w-full object-contain mx-auto">
        <p id="lb-caption" class="font-glacial text-sm text-white/60 text-center mt-4 tracking-[2px] uppercase"></p>
    </div>
</div>

{{-- CTA --}}
<div class="bg-gold py-10 text-center">
    <span class="block font-lastica text-[9px] tracking-[5px] text-[#0d0d0d] uppercase mb-3">Envie d'une pièce ?</span>
    <h3 class="font-glacial text-2xl font-light text-[#0d0d0d] uppercase tracking-[4px] mb-5">
        DÉCOUVREZ NOS <span style="text-decoration:underline;text-underline-offset:6px">COLLECTIONS</span>
    </h3>
    <a href="{{ route('miaDreams') }}"
       class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
              bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
        VOIR LES COLLECTIONS →
    </a>
</div>

@include('layouts.footer')

<script>
// Reveal scroll
const obs = new IntersectionObserver(e => e.forEach(x => {
    if(x.isIntersecting) x.target.classList.add('visible');
}), {threshold:.05});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Filtres
function filterGallery(filter) {
    document.querySelectorAll('.gallery-filter').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
        btn.classList.toggle('bg-gold', btn.dataset.filter === filter);
        btn.classList.toggle('text-[#0d0d0d]', btn.dataset.filter === filter);
        btn.classList.toggle('border-gold', btn.dataset.filter === filter);
        btn.classList.toggle('text-gold', btn.dataset.filter !== filter && btn.dataset.filter === 'all' ? false : btn.dataset.filter === filter);
        btn.classList.toggle('text-white/50', btn.dataset.filter !== filter);
    });

    document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all') {
            item.style.display = '';
        } else {
            const match = item.dataset.brand === filter || item.dataset.col === filter;
            item.style.display = match ? '' : 'none';
        }
    });
}

// Lightbox
function openLightbox(src, caption) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-caption').textContent = caption;
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.add('hidden');
    lb.classList.remove('flex');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
</script>
