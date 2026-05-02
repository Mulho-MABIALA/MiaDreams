<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            Derniers abonnes
        </x-slot>

        @if ($newsletters->isEmpty())
            <div class="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                Aucun abonne pour le moment.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th class="px-3 py-2">Email</th>
                            <th class="px-3 py-2 text-right">Inscrit le</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($newsletters as $newsletter)
                            <tr class="border-b border-gray-100 last:border-0">
                                <td class="px-3 py-3 font-medium text-gray-900">
                                    {{ $newsletter->email }}
                                </td>
                                <td class="px-3 py-3 text-right text-gray-500">
                                    {{ optional($newsletter->created_at)->format('d/m/Y H:i') }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </x-filament::section>
</x-filament-widgets::widget>
