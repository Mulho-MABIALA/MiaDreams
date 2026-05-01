@section('title','Catalogues — MIA DREAMS & CO')
@section('meta_description','Téléchargez les catalogues et brochures de MIA DREAMS & CO — collections, personal branding et plus.')
@section('og_image', asset('img/index/home-image1.jpg'))
@include('layouts.header')

{{-- HERO --}}
<div class="relative h-[38vh] min-h-[280px] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/index/home-image1.jpg') }}');filter:brightness(.22)"></div>
    <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(13,13,13,1) 0%,transparent 60%)"></div>
    <div class="relative z-10 text-center px-4">
        <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-4"
              style="opacity:0;animation:fadeUp .8s .2s forwards">Ressources</span>
        <h1 class="font-glacial font-light text-white uppercase tracking-[6px]"
            style="font-size:clamp(2rem,5vw,3.5rem);opacity:0;animation:fadeUp .9s .4s forwards">
            NOS <span class="text-gold">CATALOGUES</span>
        </h1>
    </div>
</div>

{{-- CONTENU --}}
<section class="bg-[#0d0d0d] py-20 min-h-[50vh]">
    <div class="max-w-6xl mx-auto px-6 lg:px-10">

        @if($catalogues->count())

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                @foreach($catalogues as $i => $catalogue)
                <div class="reveal group" style="transition-delay:{{ $i * 0.1 }}s">

                    {{-- Couverture --}}
                    <div class="relative overflow-hidden mb-5 aspect-[3/4]">
                        @if($catalogue->cover_image)
                            <img src="{{ asset('storage/' . $catalogue->cover_image) }}"
                                 class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                 style="filter:brightness(.88)"
                                 alt="{{ $catalogue->name }}" loading="lazy">
                        @else
                            <div class="w-full h-full bg-[#1a1a1a] border border-gold/10 flex flex-col items-center justify-center gap-3">
                                <svg class="w-12 h-12 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span class="font-lastica text-[8px] tracking-[4px] text-gold/25 uppercase">PDF</span>
                            </div>
                        @endif

                        {{-- Overlay au hover --}}
                        <div class="absolute inset-0 bg-[#0d0d0d]/70 opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300 flex items-center justify-center">
                            <a href="{{ route('catalogue.download', $catalogue->id) }}"
                               class="font-glacial text-[10px] tracking-[3px] uppercase text-[#0d0d0d]
                                      bg-gold px-6 py-3 hover:bg-gold-light transition-colors duration-200">
                                ↓ TÉLÉCHARGER
                            </a>
                        </div>
                    </div>

                    {{-- Infos --}}
                    <h3 class="font-glacial text-base text-white uppercase tracking-[2px] mb-1">
                        {{ $catalogue->name }}
                    </h3>
                    @if($catalogue->description)
                        <p class="font-glacial text-xs text-white/40 leading-relaxed mb-4">
                            {{ $catalogue->description }}
                        </p>
                    @endif

                    <a href="{{ route('catalogue.download', $catalogue->id) }}"
                       class="inline-flex items-center gap-2 font-glacial text-[10px] tracking-[3px] uppercase
                              text-gold border border-gold/40 px-5 py-2.5
                              hover:bg-gold hover:text-[#0d0d0d] hover:border-gold
                              transition-all duration-300">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Télécharger PDF
                    </a>

                </div>
                @endforeach
            </div>

        @else

            {{-- Aucun catalogue --}}
            <div class="text-center py-24">
                <svg class="w-16 h-16 text-gold/15 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="font-glacial text-sm text-white/30 tracking-[3px] uppercase">
                    Catalogues à venir…
                </p>
            </div>

        @endif

    </div>
</section>

{{-- CTA --}}
<div class="bg-gold py-12 text-center">
    <span class="block font-lastica text-[9px] tracking-[5px] text-[#0d0d0d] uppercase mb-3">Une question ?</span>
    <h3 class="font-glacial text-2xl font-light text-[#0d0d0d] uppercase tracking-[4px] mb-5">
        BESOIN D'UN <span style="text-decoration:underline;text-underline-offset:6px">DEVIS PERSONNALISÉ</span> ?
    </h3>
    <a href="{{ route('contact') }}"
       class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
              bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
        NOUS CONTACTER →
    </a>
</div>

@include('layouts.footer')

<script>
const obs = new IntersectionObserver(e => e.forEach(x => {
    if(x.isIntersecting) x.target.classList.add('visible');
}), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
</script>
