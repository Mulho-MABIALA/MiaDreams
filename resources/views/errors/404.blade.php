<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page introuvable — MIA DREAMS & CO</title>
    <link rel="icon" href="{{ asset('img/icone-miadreams.png') }}" type="image/x-icon">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        @keyframes fadeUp {
            from { opacity:0; transform:translateY(20px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes float {
            0%,100% { transform:translateY(0); }
            50%      { transform:translateY(-14px); }
        }
    </style>
</head>
<body class="bg-[#0d0d0d] min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

    {{-- Fond décoratif --}}
    <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full"
             style="background:radial-gradient(circle,rgba(196,162,103,.06),transparent 70%)"></div>
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
             style="background:radial-gradient(circle,rgba(196,162,103,.04),transparent 70%)"></div>
    </div>

    {{-- Logo --}}
    <div style="opacity:0;animation:fadeUp .7s .1s forwards">
        <a href="{{ route('index') }}">
            <img src="{{ asset('img/logo_MIA.png') }}" alt="MIA DREAMS"
                 class="h-9 w-auto brightness-0 invert opacity-50 mx-auto mb-16 hover:opacity-80 transition-opacity duration-300">
        </a>
    </div>

    {{-- Grand 404 flottant --}}
    <div class="relative" style="opacity:0;animation:fadeUp .8s .2s forwards">
        <span class="font-glacial font-light select-none block leading-none"
              style="font-size:clamp(7rem,22vw,16rem);color:rgba(196,162,103,0.07);animation:float 7s ease-in-out infinite;letter-spacing:-4px">
            404
        </span>
        {{-- Texte centré par-dessus --}}
        <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="w-10 h-px bg-gold mb-5"></div>
            <span class="font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4">
                Erreur 404
            </span>
            <h1 class="font-glacial font-light text-white uppercase tracking-[4px]"
                style="font-size:clamp(1.4rem,3.5vw,2.4rem)">
                PAGE <span class="text-gold">INTROUVABLE</span>
            </h1>
        </div>
    </div>

    {{-- Description --}}
    <p class="font-glacial text-sm text-white/40 leading-relaxed max-w-sm mx-auto mt-6 mb-10"
       style="opacity:0;animation:fadeUp .8s .45s forwards">
        La page que vous cherchez a peut-être été déplacée, supprimée ou n'a jamais existé.
    </p>

    {{-- Boutons --}}
    <div class="flex flex-col sm:flex-row gap-4 justify-center"
         style="opacity:0;animation:fadeUp .8s .6s forwards">
        <a href="{{ route('index') }}"
           class="font-glacial text-[11px] tracking-[4px] uppercase bg-gold text-[#0d0d0d]
                  px-10 py-4 hover:bg-[#d4b97a] transition-all duration-300">
            ← RETOUR À L'ACCUEIL
        </a>
        <a href="{{ route('contact') }}"
           class="font-glacial text-[11px] tracking-[4px] uppercase text-gold
                  border border-gold/50 px-10 py-4
                  hover:bg-gold hover:text-[#0d0d0d] hover:border-gold
                  transition-all duration-300">
            NOUS CONTACTER
        </a>
    </div>

    {{-- Liens rapides --}}
    <div class="mt-14 pt-8 border-t border-white/[0.06] w-full max-w-lg"
         style="opacity:0;animation:fadeUp .8s .75s forwards">
        <span class="block font-lastica text-[8px] tracking-[4px] text-white/20 uppercase mb-5">Explorez</span>
        <div class="flex flex-wrap gap-x-7 gap-y-3 justify-center">
            @foreach([
                [route('miaDreams'), 'Mia Dreams'],
                [route('galerie'),   'Galerie'],
                [route('catalogues'),'Catalogues'],
                [route('impact'),    'Notre Impact'],
                [route('apropos'),   'À Propos'],
                [route('blog'),      'Blog'],
            ] as $link)
            <a href="{{ $link[0] }}"
               class="font-glacial text-[11px] tracking-[2px] uppercase text-white/25
                      hover:text-gold transition-colors duration-250">
                {{ $link[1] }}
            </a>
            @endforeach
        </div>
    </div>

</body>
</html>
