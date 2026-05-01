@section('title','Contact — MIA DREAMS & CO')
@section('meta_description','Contactez MIA DREAMS & CO à Dakar, Sénégal.')
@include('layouts.header')

<style>
.form-line{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(196,162,103,0.25);color:#fff;padding:12px 0;font-family:'GlacialIndifference',sans-serif;font-size:.92rem;letter-spacing:1px;outline:none;transition:border-color .3s}
.form-line::placeholder{color:rgba(255,255,255,0.25)}
.form-line:focus{border-bottom-color:#C4A267}
.form-select-line{width:100%;background:#1a1a1a;border:none;border-bottom:1px solid rgba(196,162,103,0.25);color:rgba(255,255,255,0.6);padding:12px 0;font-family:'GlacialIndifference',sans-serif;font-size:.92rem;letter-spacing:1px;outline:none;-webkit-appearance:none;appearance:none;cursor:pointer;transition:border-color .3s}
.form-select-line:focus{border-bottom-color:#C4A267}
.form-select-line option{background:#1a1a1a;color:#fff}
</style>

{{-- HERO --}}
<div class="relative h-[45vh] min-h-[340px] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center"
         style="background-image:url('{{ asset('img/index/home-image1.jpg') }}');filter:brightness(.22)"></div>
    <div class="relative z-10 text-center px-4">
        <span class="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-4">Parlons-nous</span>
        <h1 class="font-glacial text-5xl md:text-6xl font-light text-white uppercase tracking-[8px] m-0">
            NOUS <span class="text-gold">CONTACTER</span>
        </h1>
        <div class="w-12 h-px bg-gold mx-auto mt-5"></div>
    </div>
</div>

{{-- MAIN --}}
<div class="bg-[#0d0d0d]">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {{-- Infos --}}
            <div class="lg:col-span-2 space-y-4">
                <div class="reveal">
                    <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Nos coordonnées</span>
                    <h2 class="font-glacial text-3xl font-light text-white uppercase tracking-[3px] mb-2">
                        ON EST <span class="text-gold">LÀ</span>
                    </h2>
                    <div class="w-10 h-px bg-gold mb-8"></div>
                </div>

                {{-- Cards --}}
                @foreach([
                    ['Adresse', isset($companyInfo) && $companyInfo && $companyInfo->address ? nl2br(e($companyInfo->address)) : '3 rue Bégenger Ferraud<br>CTIC DAKAR, Sénégal',
                     'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 9 a2.5 2.5 0 1 0 0-.001'],
                    ['Téléphone', isset($companyInfo) && $companyInfo && $companyInfo->phone ? e($companyInfo->phone) : '+221 76 463 91 69',
                     'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.44 2 2 0 0 1 3.57 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'],
                    ['Email', isset($companyInfo) && $companyInfo && $companyInfo->email ? e($companyInfo->email) : 'contact@mia-dreams.com',
                     'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6 12 13 2 6'],
                ] as $i => $card)
                <div class="reveal flex gap-4 items-start bg-[#1a1a1a] p-5 border border-gold/10 hover:border-gold/40 transition-colors duration-300"
                     style="transition-delay:{{ $i * 0.1 }}s">
                    <div class="w-10 h-10 flex-shrink-0 border border-gold/35 flex items-center justify-center mt-0.5">
                        <svg class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="{{ $card[2] }}"/>
                        </svg>
                    </div>
                    <div>
                        <span class="block font-lastica text-[8px] tracking-[3px] text-gold uppercase mb-2">{{ $card[0] }}</span>
                        <p class="font-glacial text-sm text-white/55 leading-relaxed m-0">{!! $card[1] !!}</p>
                    </div>
                </div>
                @endforeach

                {{-- Réseaux --}}
                <div class="reveal pt-2">
                    <span class="block font-lastica text-[8px] tracking-[3px] text-gold uppercase mb-3">Nos réseaux</span>
                    <div class="flex gap-2 flex-wrap">
                        @if(isset($socialMediaLinks) && $socialMediaLinks->count() > 0)
                            @foreach($socialMediaLinks as $s)
                            <a href="{{ $s->url }}" target="_blank"
                               class="flex items-center gap-2 border border-gold/20 px-3.5 py-2
                                      font-glacial text-[11px] tracking-[2px] uppercase text-white/50
                                      hover:border-gold hover:text-gold transition-all duration-300">
                                <img src="{{ asset($s->icon) }}" class="w-3.5 h-3.5 object-contain brightness-0 invert opacity-60" alt="{{ $s->platform }}">
                                {{ strtoupper($s->platform) }}
                            </a>
                            @endforeach
                        @endif
                    </div>
                </div>
            </div>

            {{-- Formulaire --}}
            <div class="lg:col-span-3 reveal">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Formulaire</span>
                <h2 class="font-glacial text-3xl font-light text-white uppercase tracking-[3px] mb-2">
                    ENVOYEZ-NOUS <span class="text-gold">UN MESSAGE</span>
                </h2>
                <div class="w-10 h-px bg-gold mb-8"></div>

                @if(session('success'))
                <div class="bg-gold/10 border border-gold/30 text-gold px-5 py-4 mb-6 font-glacial text-sm tracking-wide">
                    ✓ {{ session('success') }}
                </div>
                @endif

                <form action="{{ route('contact.store') }}" method="POST" class="bg-[#1a1a1a] p-8 border border-gold/10">
                    @csrf
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">

                        <div>
                            <label class="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-3">Nom complet *</label>
                            <input type="text" name="name" value="{{ old('name') }}"
                                   class="form-line" placeholder="Votre nom complet">
                            @error('name')<p class="text-red-400 text-xs mt-1.5 font-glacial">{{ $message }}</p>@enderror
                        </div>

                        <div>
                            <label class="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-3">Email *</label>
                            <input type="email" name="email" value="{{ old('email') }}"
                                   class="form-line" placeholder="votre@email.com">
                            @error('email')<p class="text-red-400 text-xs mt-1.5 font-glacial">{{ $message }}</p>@enderror
                        </div>

                        <div>
                            <label class="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-3">Téléphone</label>
                            <input type="text" name="phone" value="{{ old('phone') }}"
                                   class="form-line" placeholder="+221 XX XXX XX XX">
                        </div>

                        <div>
                            <label class="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-3">Sujet *</label>
                            <select name="subject" class="form-select-line">
                                <option value="">Choisir un sujet</option>
                                @foreach(['Mia Dreams','MPREW','Personal Branding','Fashion Program','Blog & Podcast','Autre'] as $opt)
                                <option value="{{ $opt }}" {{ old('subject') == $opt ? 'selected' : '' }}>{{ $opt }}</option>
                                @endforeach
                            </select>
                            @error('subject')<p class="text-red-400 text-xs mt-1.5 font-glacial">{{ $message }}</p>@enderror
                        </div>

                        <div class="md:col-span-2">
                            <label class="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-3">Message *</label>
                            <textarea name="message" rows="5"
                                      class="form-line resize-none w-full"
                                      placeholder="Décrivez votre demande…">{{ old('message') }}</textarea>
                            @error('message')<p class="text-red-400 text-xs mt-1.5 font-glacial">{{ $message }}</p>@enderror
                        </div>

                        <div class="md:col-span-2">
                            <button type="submit"
                                    class="w-full bg-gold text-[#0d0d0d] border border-gold
                                           font-glacial text-[11px] tracking-[5px] uppercase py-4
                                           hover:bg-transparent hover:text-gold
                                           transition-all duration-300 cursor-pointer">
                                ENVOYER LE MESSAGE →
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- FAQ --}}
    <div class="bg-[#111] border-t border-gold/10">
        <div class="max-w-7xl mx-auto px-6 lg:px-10 py-20">
            <div class="text-center mb-12 reveal">
                <span class="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Questions fréquentes</span>
                <h2 class="font-glacial text-3xl font-light text-white uppercase tracking-[3px]">FAQ</h2>
                <div class="w-10 h-px bg-gold mx-auto mt-4"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @foreach([
                    ['Quel est votre délai de réponse ?', 'Nous répondons généralement sous 24 à 48h ouvrées. Pour les urgences, contactez-nous par WhatsApp.'],
                    ['Proposez-vous des devis gratuits ?', 'Oui, tous nos devis pour le Personal Branding et le Fashion Program sont gratuits et sans engagement.'],
                    ['Livrez-vous hors du Sénégal ?', 'Nos créations peuvent être expédiées dans toute l\'Afrique de l\'Ouest à la commande.'],
                ] as $i => $faq)
                <div class="reveal border-l-2 border-gold/30 pl-5 hover:border-gold transition-colors duration-300"
                     style="transition-delay:{{ $i * 0.1 }}s">
                    <h4 class="font-glacial text-[15px] text-white tracking-wide mb-3 font-normal">{{ $faq[0] }}</h4>
                    <p class="font-glacial text-sm text-white/45 leading-relaxed m-0">{{ $faq[1] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</div>

@include('layouts.footer')
<script>
const obs = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add('visible'); }), {threshold:.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
</script>
