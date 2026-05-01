<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            <span style="font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:#8a8278">
                Actions Rapides
            </span>
        </x-slot>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">

            {{-- Ajouter un Article Blog --}}
            <a href="{{ route('filament.admin.resources.posts.create') }}"
               class="group flex flex-col items-center gap-3 p-5 rounded-xl border border-[#e8e2d9]
                      bg-white hover:border-[#C4A267] hover:shadow-sm transition-all duration-200">
                <div class="w-11 h-11 rounded-full bg-[#faf7f2] border border-[#e8e2d9]
                            flex items-center justify-center group-hover:bg-[#f5eedf] transition-colors duration-200">
                    <x-heroicon-o-pencil-square class="w-5 h-5" style="color:#C4A267"/>
                </div>
                <div class="text-center">
                    <p class="text-[11px] font-semibold tracking-wide text-[#1a1a1a] uppercase leading-tight">Nouvel Article</p>
                    <p class="text-[10px] text-[#b0a898] mt-0.5">Blog</p>
                </div>
            </a>

            {{-- Ajouter un Produit --}}
            <a href="{{ route('filament.admin.resources.products.create') }}"
               class="group flex flex-col items-center gap-3 p-5 rounded-xl border border-[#e8e2d9]
                      bg-white hover:border-[#C4A267] hover:shadow-sm transition-all duration-200">
                <div class="w-11 h-11 rounded-full bg-[#faf7f2] border border-[#e8e2d9]
                            flex items-center justify-center group-hover:bg-[#f5eedf] transition-colors duration-200">
                    <x-heroicon-o-shopping-bag class="w-5 h-5" style="color:#C4A267"/>
                </div>
                <div class="text-center">
                    <p class="text-[11px] font-semibold tracking-wide text-[#1a1a1a] uppercase leading-tight">Nouveau Produit</p>
                    <p class="text-[10px] text-[#b0a898] mt-0.5">Boutique</p>
                </div>
            </a>

            {{-- Ajouter un Catalogue --}}
            <a href="{{ route('filament.admin.resources.catalogues.create') }}"
               class="group flex flex-col items-center gap-3 p-5 rounded-xl border border-[#e8e2d9]
                      bg-white hover:border-[#C4A267] hover:shadow-sm transition-all duration-200">
                <div class="w-11 h-11 rounded-full bg-[#faf7f2] border border-[#e8e2d9]
                            flex items-center justify-center group-hover:bg-[#f5eedf] transition-colors duration-200">
                    <x-heroicon-o-document-text class="w-5 h-5" style="color:#C4A267"/>
                </div>
                <div class="text-center">
                    <p class="text-[11px] font-semibold tracking-wide text-[#1a1a1a] uppercase leading-tight">Nouveau Catalogue</p>
                    <p class="text-[10px] text-[#b0a898] mt-0.5">PDF</p>
                </div>
            </a>

            {{-- Ajouter un Service --}}
            <a href="{{ route('filament.admin.resources.services.create') }}"
               class="group flex flex-col items-center gap-3 p-5 rounded-xl border border-[#e8e2d9]
                      bg-white hover:border-[#C4A267] hover:shadow-sm transition-all duration-200">
                <div class="w-11 h-11 rounded-full bg-[#faf7f2] border border-[#e8e2d9]
                            flex items-center justify-center group-hover:bg-[#f5eedf] transition-colors duration-200">
                    <x-heroicon-o-sparkles class="w-5 h-5" style="color:#C4A267"/>
                </div>
                <div class="text-center">
                    <p class="text-[11px] font-semibold tracking-wide text-[#1a1a1a] uppercase leading-tight">Nouveau Service</p>
                    <p class="text-[10px] text-[#b0a898] mt-0.5">Personal Branding</p>
                </div>
            </a>

        </div>

        {{-- Liens rapides secondaires ──────── --}}
        <div class="mt-4 pt-4 border-t border-[#f0ece6] flex flex-wrap gap-2">
            <a href="{{ route('filament.admin.resources.contact-messages.index') }}"
               class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase
                      text-[#8a8278] border border-[#e8e2d9] rounded-lg px-3.5 py-2
                      hover:border-[#C4A267] hover:text-[#C4A267] bg-white transition-all duration-200">
                <x-heroicon-o-envelope class="w-3.5 h-3.5"/> Messages
            </a>
            <a href="{{ route('filament.admin.resources.newsletters.index') }}"
               class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase
                      text-[#8a8278] border border-[#e8e2d9] rounded-lg px-3.5 py-2
                      hover:border-[#C4A267] hover:text-[#C4A267] bg-white transition-all duration-200">
                <x-heroicon-o-users class="w-3.5 h-3.5"/> Newsletter
            </a>
            <a href="{{ route('filament.admin.resources.team-members.index') }}"
               class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase
                      text-[#8a8278] border border-[#e8e2d9] rounded-lg px-3.5 py-2
                      hover:border-[#C4A267] hover:text-[#C4A267] bg-white transition-all duration-200">
                <x-heroicon-o-user-group class="w-3.5 h-3.5"/> Équipe
            </a>
            <a href="{{ route('filament.admin.resources.company-infos.index') }}"
               class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase
                      text-[#8a8278] border border-[#e8e2d9] rounded-lg px-3.5 py-2
                      hover:border-[#C4A267] hover:text-[#C4A267] bg-white transition-all duration-200">
                <x-heroicon-o-building-office class="w-3.5 h-3.5"/> Entreprise
            </a>
            <a href="/" target="_blank"
               class="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase
                      text-[#8a8278] border border-[#e8e2d9] rounded-lg px-3.5 py-2
                      hover:border-[#C4A267] hover:text-[#C4A267] bg-white transition-all duration-200">
                <x-heroicon-o-arrow-top-right-on-square class="w-3.5 h-3.5"/> Voir le site
            </a>
        </div>

    </x-filament::section>
</x-filament-widgets::widget>
