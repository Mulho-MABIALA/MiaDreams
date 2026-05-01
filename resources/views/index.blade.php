@section('title','MIA DREAMS & CO — Maison de Mode Africaine')
@section('meta_description','MIA DREAMS & CO — Maison de mode africaine éthique basée à Dakar. Découvrez nos collections, notre histoire et nos engagements.')
@section('og_image', asset('img/index/home-image1.jpg'))
@include('layouts.header')

<style>
@keyframes kbHero{0%{transform:scale(1.06)}100%{transform:scale(1)}}

/* ── Carousel ── */
.hero-carousel{position:relative;height:100vh;min-height:600px;overflow:hidden}
.hero-slide{position:absolute;inset:0;opacity:0;transition:opacity 1.2s ease}
.hero-slide.active{opacity:1}
.hero-slide img{width:100%;height:100%;object-fit:cover;animation:kbHero 12s ease forwards}
.hero-slide .overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(10,10,10,.72) 0%,rgba(10,10,10,.08) 65%)}
.hero-arrow{
    position:absolute;top:50%;transform:translateY(-50%);z-index:10;
    background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff;
    width:52px;height:52px;display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all .3s;padding:0;
}
.hero-arrow:hover{border-color:#C4A267;color:#C4A267;background:rgba(196,162,103,.1)}
.hero-arrow-prev{left:28px}
.hero-arrow-next{right:28px}
.hero-dots{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}
.hero-dot{width:24px;height:1px;background:rgba(255,255,255,.35);cursor:pointer;transition:all .3s}
.hero-dot.active{width:44px;background:#C4A267}
</style>

{{-- ══ HERO CAROUSEL ══ --}}
<div class="hero-carousel" id="heroCarousel">

    {{-- Slide 1 --}}
    <div class="hero-slide active">
        <img src="{{ asset('img/index/home-image1.jpg') }}" alt="MIA DREAMS" loading="eager">
        <div class="overlay"></div>
        <div class="absolute inset-0 flex items-center z-10">
            <div class="max-w-2xl px-8 lg:px-24">
                <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
                      style="opacity:0;animation:fadeUp .8s .4s forwards">Maison de mode africaine</span>
                <h1 class="font-glacial font-light text-white uppercase leading-tight mb-5"
                    style="font-size:clamp(2.8rem,7vw,5.5rem);opacity:0;animation:fadeUp .9s .6s forwards">
                    RÉVOLUTION<br><span class="text-gold">FASHION</span>
                </h1>
                <p class="font-glacial text-base text-white/65 tracking-[2px] leading-relaxed mb-8"
                   style="opacity:0;animation:fadeUp .9s .8s forwards">
                    L'artisanat est au cœur de notre métier.
                </p>
                <div style="opacity:0;animation:fadeUp .8s 1s forwards">
                    <a href="{{ route('miaDreams') }}"
                       class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                              border border-gold px-10 py-4 hover:bg-gold hover:text-[#0d0d0d]
                              transition-all duration-300" style="text-decoration:none">
                        DÉCOUVRIR
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- Slide 2 --}}
    <div class="hero-slide">
        <img src="{{ asset('img/index/home-image2.jpg') }}" alt="MIA DREAMS Collections" loading="lazy">
        <div class="overlay"></div>
        <div class="absolute inset-0 flex items-center z-10">
            <div class="max-w-2xl px-8 lg:px-24">
                <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5">Nos collections</span>
                <h2 class="font-glacial font-light text-white uppercase leading-tight mb-5"
                    style="font-size:clamp(2.8rem,7vw,5.5rem)">
                    MIA DREAMS<br><span class="text-gold">BRAND</span>
                </h2>
                <p class="font-glacial text-base text-white/65 tracking-[2px] leading-relaxed mb-8">
                    Notre ligne de vêtements — élégance africaine contemporaine.
                </p>
                <a href="{{ route('miaDreams') }}"
                   class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                          border border-gold px-10 py-4 hover:bg-gold hover:text-[#0d0d0d]
                          transition-all duration-300" style="text-decoration:none">EXPLORER</a>
            </div>
        </div>
    </div>

    {{-- Slide 3 --}}
    <div class="hero-slide">
        <img src="{{ asset('img/index/home-image5.jpg') }}" alt="Personal Branding" loading="lazy">
        <div class="overlay"></div>
        <div class="absolute inset-0 flex items-center z-10">
            <div class="max-w-2xl px-8 lg:px-24">
                <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5">Nouveau</span>
                <h2 class="font-glacial font-light text-white uppercase leading-tight mb-5"
                    style="font-size:clamp(2.8rem,7vw,5.5rem)">
                    PERSONAL<br><span class="text-gold">BRANDING</span>
                </h2>
                <p class="font-glacial text-base text-white/65 tracking-[2px] leading-relaxed mb-8">
                    Développez votre style, affirmez votre leadership.
                </p>
                <a href="{{ route('personalBranding') }}"
                   class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                          border border-gold px-10 py-4 hover:bg-gold hover:text-[#0d0d0d]
                          transition-all duration-300" style="text-decoration:none">DÉCOUVRIR L'OFFRE</a>
            </div>
        </div>
    </div>

    <button class="hero-arrow hero-arrow-prev" id="prevBtn" aria-label="Précédent">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="hero-arrow hero-arrow-next" id="nextBtn" aria-label="Suivant">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <div class="hero-dots">
        <div class="hero-dot active" data-slide="0"></div>
        <div class="hero-dot" data-slide="1"></div>
        <div class="hero-dot" data-slide="2"></div>
    </div>
</div>

{{-- ══ INTRO ══ --}}
<section class="bg-white py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="reveal">
                <div class="relative w-full" style="padding-bottom:56.25%">
                    <iframe class="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/sTfEIkU309s"
                            frameborder="0" allowfullscreen loading="lazy"></iframe>
                </div>
            </div>
            <div class="reveal" style="transition-delay:.15s">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre vision</span>
                <h2 class="font-glacial text-3xl font-light text-[#1a1a1a] uppercase tracking-[3px] leading-tight mb-3">
                    UN UNIVERS <span class="text-gold">AFRICAIN</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                <blockquote class="border-l-2 border-gold pl-5 py-2 mb-6 bg-[#faf8f5]">
                    <p class="font-glacial text-lg font-light text-[#1a1a1a] leading-snug italic px-2 py-1">
                        "Notre startup diffuse l'ensemble de la richesse culturelle du continent africain"
                    </p>
                </blockquote>
                <p class="font-glacial text-sm text-[#666] leading-loose mb-6">
                    Au-delà d'une simple entreprise ou d'une marque de vêtements, nous incarnons un univers
                    contemporain de la mode africaine. Notre savoir-faire dans l'industrie textile du continent
                    est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique.
                </p>
                <a href="{{ route('apropos') }}"
                   class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                          border border-gold/60 px-8 py-3 hover:bg-gold hover:text-[#0d0d0d]
                          hover:border-gold transition-all duration-300" style="text-decoration:none">
                    NOTRE HISTOIRE →
                </a>
            </div>
        </div>
    </div>
</section>

{{-- ══ TAGLINE ══ --}}
<div class="bg-gold py-8 text-center">
    <p class="font-glacial text-[#0d0d0d] text-sm tracking-[6px] uppercase">
        Plus qu'une entreprise, un univers authentique aux inspirations africaines et contemporaines.
    </p>
</div>

{{-- ══ NOS UNIVERS ══ --}}
<section class="bg-[#faf9f7] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-14 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Explorer</span>
            <h2 class="font-glacial text-4xl font-light text-[#1a1a1a] uppercase tracking-[3px]">
                NOS <span class="text-gold">UNIVERS</span>
            </h2>
            <div class="w-10 h-px bg-gold mx-auto mt-5"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @foreach([
                ['img/index/home-image2.jpg','Mia Dreams Brand','Notre ligne de vêtements','miaDreams'],
                ['img/index/home-image3.jpg','Ma Petite Robe En Wax','Notre application mobile','mprew'],
                ['img/index/home-image4.jpg','Fashion Program','Notre programme de formation','fashionProgram'],
            ] as $i => $univ)
            <div class="reveal group relative overflow-hidden h-[460px] cursor-pointer"
                 style="transition-delay:{{ $i * 0.1 }}s"
                 onclick="window.location='{{ route($univ[3]) }}'">
                <img src="{{ asset($univ[0]) }}"
                     class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     alt="{{ $univ[1] }}" loading="lazy">
                <div class="absolute inset-0"
                     style="background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%)"></div>
                <div class="absolute bottom-0 inset-x-0 p-7">
                    <span class="block font-lastica text-[8px] tracking-[3px] text-gold uppercase mb-2">Découvrez</span>
                    <h3 class="font-glacial text-xl font-light text-white uppercase tracking-[2px] mb-1">{{ $univ[1] }}</h3>
                    <p class="font-glacial text-sm text-white/70 m-0">{{ $univ[2] }}</p>
                    <div class="mt-4 w-0 group-hover:w-10 h-px bg-gold transition-all duration-500"></div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ══ NOS SERVICES ══ --}}
@php $services = isset($services) && $services->count() ? $services : \App\Models\Service::where('is_active',true)->orderBy('order')->get(); @endphp
@if($services->count())
<section class="bg-[#0d0d0d] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-14 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Ce que nous proposons</span>
            <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">
                NOS <span class="text-gold">SERVICES</span>
            </h2>
            <div class="w-10 h-px bg-gold mx-auto mt-5"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @foreach($services as $service)
            <div class="reveal group border border-gold/10 hover:border-gold/30 transition-colors duration-300"
                 style="transition-delay:{{ $loop->index * 0.1 }}s">
                <div class="relative overflow-hidden">
                    @if($service->image)
                        <img src="{{ asset('storage/' . $service->image) }}"
                             class="w-full h-[220px] object-cover transition-transform duration-700 group-hover:scale-105"
                             style="filter:brightness(.75)" alt="{{ $service->title }}" loading="lazy">
                    @else
                        <div class="w-full h-[220px] bg-[#1a1a1a] flex items-center justify-center">
                            <svg class="w-10 h-10 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                            </svg>
                        </div>
                    @endif
                </div>
                <div class="p-6">
                    <h3 class="font-glacial text-sm text-white uppercase tracking-[2px] mb-3">
                        {{ $service->title }}
                    </h3>
                    <p class="font-glacial text-xs text-white/45 leading-relaxed">
                        {{ Str::limit($service->description, 110) }}
                    </p>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- ══ PERSONAL BRANDING ══ --}}
<section class="bg-white py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="reveal overflow-hidden">
                <img src="{{ asset('img/index/home-image5.jpg') }}"
                     class="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                     alt="Personal Branding" loading="lazy">
            </div>
            <div class="reveal" style="transition-delay:.15s">
                <span class="block font-lastica text-[8px] tracking-[4px] text-gold uppercase mb-3">Nouveau</span>
                <h2 class="font-glacial text-4xl font-light text-[#1a1a1a] uppercase tracking-[3px] leading-tight mb-3">
                    OFFRE EN<br><span class="text-gold">PERSONAL BRANDING</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                <p class="font-glacial text-sm text-[#666] leading-loose mb-8">
                    Une méthode et un accompagnement uniques au service de votre leadership, qui vous font gagner du temps.
                    Nous allons vous aider à développer votre propre style, dans une démarche bienveillante.
                    Notre approche structurée et ultra-professionnelle vous permettra de constituer un dressing
                    digne de la Haute Couture.
                </p>
                <a href="{{ route('personalBranding') }}"
                   class="inline-block font-glacial text-[11px] tracking-[4px] uppercase bg-[#1a1a1a] text-gold
                          px-10 py-4 hover:bg-gold hover:text-[#1a1a1a]
                          transition-all duration-300" style="text-decoration:none">
                    DÉCOUVRIR NOTRE OFFRE
                </a>
            </div>
        </div>
    </div>
</section>

{{-- ══ ETHICAL FASHION ══ --}}
<section class="bg-[#faf9f7] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="reveal order-2 lg:order-1" style="transition-delay:.15s">
                <span class="block font-lastica text-[8px] tracking-[4px] text-gold uppercase mb-3">Engagement</span>
                <h2 class="font-glacial text-4xl font-light text-[#1a1a1a] uppercase tracking-[3px] leading-tight mb-3">
                    ETHICAL<br><span class="text-gold">FASHION</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                <p class="font-glacial text-sm text-[#666] leading-loose mb-8">
                    Chez Mia Dreams and Co, notre engagement envers une mode éthique et responsable est au cœur de
                    notre identité. Nous croyons fermement que la mode peut être une force positive, contribuant
                    non seulement à votre style, mais également au bien-être de la planète et de ses habitants.
                </p>
                <a href="{{ route('impact') }}"
                   class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                          border border-gold/60 px-8 py-3 hover:bg-gold hover:text-[#0d0d0d]
                          hover:border-gold transition-all duration-300" style="text-decoration:none">
                    NOS ENGAGEMENTS →
                </a>
            </div>
            <div class="reveal order-1 lg:order-2 overflow-hidden">
                <img src="{{ asset('img/index/home-image6.jpg') }}"
                     class="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                     alt="Ethical Fashion" loading="lazy">
            </div>
        </div>
    </div>
</section>

{{-- ══ BLOG ══ --}}
<section class="relative py-32 overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/index/home-image7.webp') }}');filter:brightness(.38)"></div>
    <div class="absolute inset-0" style="background:rgba(10,10,10,.42)"></div>
    <div class="relative z-10 max-w-2xl mx-auto px-6 text-center reveal">
        <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-5">Nos derniers articles</span>
        <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] mb-4">
            BLOG <span class="text-gold">&</span> PODCAST
        </h2>
        <p class="font-glacial text-sm text-white/75 leading-loose mb-8">
            Bienvenue dans l'univers d'OTENTIK MIA — mode, personal branding, entrepreneuriat &amp; culture africaine.
        </p>
        <a href="{{ route('blog') }}"
           class="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold
                  border border-gold px-10 py-4 hover:bg-gold hover:text-[#0d0d0d]
                  transition-all duration-300" style="text-decoration:none">
            DÉCOUVRIR
        </a>
    </div>
</section>

{{-- ══ MADE IN AFRICA ══ --}}
<div class="bg-white py-16 text-center border-t border-[#ede9e3]">
    <p class="font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Dakar, Sénégal</p>
    <h2 class="font-glacial font-light text-[#1a1a1a] uppercase tracking-[12px]"
        style="font-size:clamp(1.5rem,4vw,3rem)">Made In <span class="text-gold">Africa</span></h2>
</div>

@include('layouts.footer')

<script>
(function(){
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.hero-dot');
    let current = 0, timer;

    function goTo(n){
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }
    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }
    function startAuto(){ clearInterval(timer); timer = setInterval(next, 5500); }

    document.getElementById('nextBtn').addEventListener('click', () => { next(); startAuto(); });
    document.getElementById('prevBtn').addEventListener('click', () => { prev(); startAuto(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(parseInt(d.dataset.slide)); startAuto(); }));
    startAuto();
})();

const obs = new IntersectionObserver(e => e.forEach(x => {
    if(x.isIntersecting) x.target.classList.add('visible');
}), {threshold:.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
</script>
