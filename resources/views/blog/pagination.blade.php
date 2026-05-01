@if ($paginator->hasPages())
<div class="blog-pagination">
    {{-- Previous --}}
    @if ($paginator->onFirstPage())
        <span style="opacity:.3;">← PRÉC</span>
    @else
        <a href="{{ $paginator->previousPageUrl() }}">← PRÉC</a>
    @endif

    {{-- Page numbers --}}
    @foreach ($elements as $element)
        @if (is_string($element))
            <span>{{ $element }}</span>
        @endif
        @if (is_array($element))
            @foreach ($element as $page => $url)
                @if ($page == $paginator->currentPage())
                    <span aria-current="page"><span>{{ $page }}</span></span>
                @else
                    <a href="{{ $url }}">{{ $page }}</a>
                @endif
            @endforeach
        @endif
    @endforeach

    {{-- Next --}}
    @if ($paginator->hasMorePages())
        <a href="{{ $paginator->nextPageUrl() }}">SUIV →</a>
    @else
        <span style="opacity:.3;">SUIV →</span>
    @endif
</div>
@endif
