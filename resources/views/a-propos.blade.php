@section('title','À Propos — MIA DREAMS & CO')
@section('meta_description','L\'histoire de MIA DREAMS & CO. Maison de mode africaine éthique fondée par Kariata Savane à Dakar.')
@section('og_image', asset('img/index/home-image5.jpg'))
@include('layouts.header')

<style>
@keyframes kbHero{to{transform:scale(1)}}
</style>

{{-- HERO --}}
<div class="relative h-screen min-h-[580px] flex items-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/apropos/heri1.jpg') }}');
                filter:brightness(.28);transform:scale(1.06);animation:kbHero 12s ease forwards"></div>
    <div class="absolute inset-0"
         style="background:linear-gradient(to right,rgba(13,13,13,.85) 0%,rgba(13,13,13,.1) 100%)"></div>
    <div class="relative z-10 max-w-2xl px-6 lg:px-16">
        <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
              style="opacity:0;animation:fadeUp .8s .4s forwards">Notre histoire</span>
        <h1 class="font-glacial font-light text-white uppercase tracking-[4px] mb-5 leading-tight"
            style="font-size:clamp(2.8rem,7vw,5.5rem);opacity:0;animation:fadeUp .9s .6s forwards">
            UN HÉRITAGE<br><span class="text-gold">FAMILIAL</span>
        </h1>
        <p class="font-glacial text-base text-white/55 tracking-[2px] leading-relaxed mb-8"
           style="opacity:0;animation:fadeUp .9s .8s forwards">
            De père en fille depuis 1966 — une passion transmise de génération en génération.
        </p>
        <div class="flex items-center gap-4" style="opacity:0;animation:fadeUp .8s 1s forwards">
            <div class="w-10 h-px bg-gold/50"></div>
            <span class="font-lastica text-[8px] tracking-[4px] text-white/35 uppercase">Découvrir notre histoire</span>
        </div>
    </div>
</div>

{{-- STATS --}}
<div class="bg-gold py-10">
    <div class="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        @php $yearsActive = date('Y') - 2020; @endphp
        @foreach([['1966','Année de fondation'],['4','Marques & services'],[$yearsActive . '+','Années d\'activité'],['100%','Made In Africa']] as $s)
        <div class="text-center">
            <span class="block font-glacial font-light text-[#0d0d0d] text-4xl md:text-5xl tracking-wide leading-none mb-2">{{ $s[0] }}</span>
            <span class="block font-lastica text-[8px] tracking-[3px] text-[#0d0d0d]/55 uppercase">{{ $s[1] }}</span>
        </div>
        @endforeach
    </div>
</div>

{{-- HÉRITAGE --}}
<section class="bg-[#0d0d0d] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="reveal relative h-[520px]">
                <div class="absolute top-4 left-4 right-16 bottom-16 border border-gold/20 pointer-events-none z-10"></div>
                <img src="{{ asset('img/apropos/heri1.jpg') }}"
                     class="absolute top-0 left-0 w-3/4 h-[85%] object-cover"
                     style="filter:brightness(.88)" alt="Héritage" loading="lazy">
                <img src="{{ asset('img/apropos/heri2.jpeg') }}"
                     class="absolute bottom-0 right-0 w-1/2 h-[55%] object-cover border-4 border-[#0d0d0d]"
                     style="filter:brightness(.85)" alt="MIA DREAMS" loading="lazy">
            </div>
            <div class="reveal" style="transition-delay:.2s">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre ADN</span>
                <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">
                    UN HÉRITAGE<br><span class="text-gold">CULTUREL & FAMILIAL</span>
                </h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                <blockquote class="border-l-2 border-gold pl-5 py-3 bg-gold/[0.05] mb-6">
                    <p class="font-glacial text-xl font-light text-white leading-snug tracking-wide italic m-0">
                        "La mode est le reflet de notre identité —<br>
                        <span class="text-gold not-italic">elle se transmet comme une langue maternelle.</span>"
                    </p>
                    <cite class="block mt-3 font-lastica text-[8px] tracking-[3px] text-gold/60 not-italic uppercase">— Kariata Savane, Fondatrice</cite>
                </blockquote>
                <p class="font-glacial text-sm text-white/55 leading-loose mb-4">
                    MIA DREAMS & CO est née d'une passion transmise de génération en génération.
                    Ce qui a commencé comme un atelier de couture familial en 1966 est devenu une maison de mode
                    africaine contemporaine rayonnant depuis Dakar, Sénégal.
                </p>
                <p class="font-glacial text-sm text-white/55 leading-loose">
                    Nous incarnons l'excellence de l'artisanat africain en y intégrant les codes de la mode contemporaine.
                </p>
            </div>
        </div>
    </div>
</section>

{{-- TIMELINE --}}
<section class="bg-[#111] py-24">
    <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre parcours</span>
            <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">LA <span class="text-gold">CHRONOLOGIE</span></h2>
            <div class="w-10 h-px bg-gold mx-auto mt-5"></div>
        </div>
        <div class="relative">
            <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/20 -translate-x-1/2"></div>
            @foreach([
                ['1966','L\'atelier familial','Le grand-père de Kariata ouvre son premier atelier de couture à Dakar. Un savoir-faire d\'exception naît.'],
                ['2015','La passion héritée','Kariata Savane reprend le flambeau familial et fusionne tradition et vision contemporaine.'],
                ['2018','Ma Petite Robe En Wax','Lancement de MPREW, première marque d\'artisanat africain avec technologie 3D.'],
                ['2020','MIA DREAMS & CO','Création officielle de la maison MIA DREAMS & CO — un écosystème complet de mode africaine éthique.'],
                ['2022','Fashion Program','Lancement du programme de formation dédié aux artisans et passionnés de mode africaine.'],
                ['2024','Personal Branding','Ouverture du pôle Personal Branding — accompagnement image pour entrepreneurs africains.'],
            ] as $i => $step)
            <div class="reveal flex gap-0 md:gap-10 mb-12 items-start
                        {{ $i % 2 === 0 ? 'flex-row' : 'flex-row md:flex-row-reverse' }}"
                 style="transition-delay:{{ $i * 0.08 }}s">
                <div class="flex-1 {{ $i % 2 === 0 ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10' }} pl-10 md:pl-0">
                    <span class="block font-lastica text-[10px] tracking-[3px] text-gold uppercase mb-2">{{ $step[0] }}</span>
                    <h3 class="font-glacial text-base text-white uppercase tracking-[2px] mb-2">{{ $step[1] }}</h3>
                    <p class="font-glacial text-sm text-white/45 leading-relaxed m-0">{{ $step[2] }}</p>
                </div>
                <div class="hidden md:flex flex-col items-center flex-shrink-0">
                    <div class="w-3.5 h-3.5 rounded-full bg-gold border-4 border-[#111] mt-1 z-10 relative"></div>
                </div>
                <div class="hidden md:block flex-1"></div>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- TEAM --}}
@if($teamMembers->count())
<section class="bg-[#0d0d0d] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-14 reveal">
            <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Les visages</span>
            <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">NOTRE <span class="text-gold">ÉQUIPE</span></h2>
            <div class="w-10 h-px bg-gold mx-auto mt-5"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-{{ min($teamMembers->count(), 3) }} gap-6">
            @foreach($teamMembers as $i => $member)
            <div class="reveal group relative overflow-hidden" style="transition-delay:{{ $i * 0.12 }}s">
                @if($member->image)
                    <img src="{{ asset($member->image) }}"
                         class="w-full h-[480px] object-cover object-top block transition-transform duration-700 group-hover:scale-105"
                         style="filter:brightness(.82)" alt="{{ $member->name }}" loading="lazy">
                @else
                    <div class="w-full h-[480px] bg-[#1a1a1a] flex items-center justify-center">
                        <svg class="w-16 h-16 text-gold/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                @endif
                <div class="absolute bottom-0 inset-x-0 p-7"
                     style="background:linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 100%)">
                    <span class="block font-lastica text-[8px] tracking-[4px] text-gold uppercase mb-2">{{ $member->role ?? 'Fondatrice' }}</span>
                    <h3 class="font-glacial text-xl font-light text-white uppercase tracking-[2px] mb-2">{{ $member->name }}</h3>
                    <p class="font-glacial text-[13px] text-white/55 leading-relaxed m-0 max-h-0 overflow-hidden group-hover:max-h-28 transition-all duration-500">
                        {{ Str::limit($member->bio, 180) }}
                    </p>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- VALEURS --}}
<section class="bg-[#111] py-24">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div class="lg:col-span-2 reveal">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Ce qui nous guide</span>
                <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">NOS <span class="text-gold">VALEURS</span></h2>
                <div class="w-10 h-px bg-gold my-5"></div>
                <p class="font-glacial text-sm text-white/50 leading-loose">
                    Chaque décision, chaque création, chaque collaboration est guidée par ces principes fondateurs.
                </p>
            </div>
            <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                @foreach([
                    ['01','Authenticité','Nos créations puisent leur force dans l\'héritage culturel africain.'],
                    ['02','Éthique','Mode responsable, artisans valorisés, matières locales. L\'excellence sans compromis.'],
                    ['03','Innovation','Du wax au numérique 3D — nous intégrons la technologie pour faire rayonner le savoir-faire africain.'],
                    ['04','Transmission','Former, éduquer, inspirer. Le Fashion Program transmet les outils pour réussir.'],
                ] as $i => $v)
                <div class="reveal border-l-2 border-gold/30 pl-5 hover:border-gold transition-colors duration-300"
                     style="transition-delay:{{ $i * 0.1 }}s">
                    <span class="block font-lastica text-[9px] tracking-[3px] text-gold/35 mb-2">{{ $v[0] }}</span>
                    <h3 class="font-glacial text-base text-white uppercase tracking-[2px] mb-2">{{ $v[1] }}</h3>
                    <p class="font-glacial text-sm text-white/45 leading-relaxed m-0">{{ $v[2] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</section>

{{-- CTA --}}
<div class="relative overflow-hidden py-24 text-center">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/apropos/heri2.jpeg') }}');filter:brightness(.18)"></div>
    <div class="relative z-10 reveal">
        <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-4">Rejoignez l'univers</span>
        <h2 class="font-glacial text-4xl font-light text-white uppercase tracking-[3px] mb-8">
            ÉCRIVONS <span class="text-gold">L'HISTOIRE ENSEMBLE</span>
        </h2>
        <div class="flex gap-4 justify-center flex-wrap">
            <a href="{{ route('contact') }}"
               class="font-glacial text-[11px] tracking-[4px] uppercase text-gold border border-gold px-10 py-4
                      hover:bg-gold hover:text-[#0d0d0d] transition-all duration-300" style="text-decoration:none">
                NOUS CONTACTER
            </a>
            <a href="{{ route('miaDreams') }}"
               class="font-glacial text-[11px] tracking-[4px] uppercase bg-gold text-[#0d0d0d] px-10 py-4
                      hover:bg-transparent hover:text-gold border border-gold transition-all duration-300" style="text-decoration:none">
                DÉCOUVRIR NOS COLLECTIONS
            </a>
        </div>
    </div>
</div>

@include('layouts.footer')
<script>
const obs = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add('visible'); }), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
</script>
