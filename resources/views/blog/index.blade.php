@section('title', 'Blog & Podcast — Otentik Mia')
@section('meta_description', 'Articles de mode africaine, personal branding, artisanat et entrepreneuriat. Épisodes du podcast Otentik Mia.')

@include('layouts.header')

<style>
body { overflow-x: hidden; background: #0d0d0d; }

/* ── HERO ───────────────────────────────────────────── */
.blog-hero {
    position: relative;
    height: 55vh; min-height: 420px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
}
.blog-hero-bg {
    position: absolute; inset: 0;
    background: url('{{ asset("img/index/home-image7.webp") }}') center/cover no-repeat;
    filter: brightness(0.3);
    transform: scale(1.05);
}
.blog-hero-content { position: relative; z-index: 2; text-align: center; }
.blog-hero-tag {
    font-family: 'Lastica', serif;
    font-size: 10px; letter-spacing: 6px;
    color: #C4A267; text-transform: uppercase;
    display: block; margin-bottom: 18px;
}
.blog-hero-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: clamp(2.8rem, 7vw, 5rem);
    font-weight: 300; letter-spacing: 6px;
    color: #fff; text-transform: uppercase; margin: 0;
    line-height: 1.1;
}
.blog-hero-title span { color: #C4A267; }
.blog-hero-sub {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.9rem; letter-spacing: 4px;
    color: rgba(255,255,255,0.55); margin-top: 18px;
    text-transform: uppercase;
}
.blog-gold-line {
    width: 50px; height: 1px; background: #C4A267;
    margin: 22px auto;
}

/* ── LAYOUT GÉNÉRAL ─────────────────────────────────── */
.blog-wrap { background: #0d0d0d; }

/* ── CATEGORY FILTER ────────────────────────────────── */
.cat-filter {
    display: flex; gap: 10px; flex-wrap: wrap;
    justify-content: center;
    padding: 40px 20px 0;
}
.cat-pill {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 10px; letter-spacing: 3px;
    text-transform: uppercase; text-decoration: none;
    padding: 9px 22px;
    border: 1px solid rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.55);
    transition: all 0.3s;
}
.cat-pill:hover, .cat-pill.active {
    border-color: #C4A267; color: #C4A267;
}

/* ── FEATURED POST ──────────────────────────────────── */
.featured-section { padding: 60px 0 40px; }
.featured-card {
    position: relative; overflow: hidden;
    display: block; text-decoration: none;
    background: #111;
}
.featured-card:hover .featured-img { transform: scale(1.04); }
.featured-img {
    width: 100%; height: 520px;
    object-fit: cover; display: block;
    transition: transform 0.8s ease;
    filter: brightness(0.55);
}
.featured-badge {
    position: absolute; top: 28px; left: 28px;
    background: #C4A267; color: #0d0d0d;
    font-family: 'Lastica', serif;
    font-size: 9px; letter-spacing: 3px;
    padding: 6px 16px; text-transform: uppercase;
}
.featured-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 40px;
    background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%);
}
.featured-cat {
    font-family: 'Lastica', serif; font-size: 9px;
    letter-spacing: 4px; color: #C4A267;
    text-transform: uppercase; display: block; margin-bottom: 12px;
}
.featured-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 300; color: #fff;
    letter-spacing: 2px; margin: 0 0 14px;
    text-transform: uppercase;
}
.featured-meta {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.78rem; color: rgba(255,255,255,0.5);
    letter-spacing: 2px;
}
.featured-excerpt {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.9rem; color: rgba(255,255,255,0.72);
    line-height: 1.7; margin: 14px 0 20px;
    max-width: 600px;
}
.read-link {
    display: inline-block;
    border: 1px solid #C4A267; color: #C4A267;
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 10px; letter-spacing: 3px;
    padding: 10px 28px; text-decoration: none;
    text-transform: uppercase; transition: all 0.3s;
}
.read-link:hover { background: #C4A267; color: #0d0d0d; }

/* ── SECTION TITRES ─────────────────────────────────── */
.section-label {
    font-family: 'Lastica', serif; font-size: 10px;
    letter-spacing: 5px; color: #C4A267;
    text-transform: uppercase; display: block; margin-bottom: 12px;
}
.section-title-wh {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 300; color: #fff;
    letter-spacing: 3px; text-transform: uppercase; margin: 0;
}
.section-title-wh span { color: #C4A267; }
.gold-bar { width: 40px; height: 1px; background: #C4A267; margin: 18px 0; }

/* ── ARTICLE GRID ───────────────────────────────────── */
.articles-section { padding: 60px 0; }
.post-card {
    background: #111; display: flex; flex-direction: column;
    text-decoration: none; overflow: hidden;
    transition: transform 0.4s ease;
    height: 100%;
}
.post-card:hover { transform: translateY(-6px); }
.post-card:hover .post-img { transform: scale(1.06); }
.post-img-wrap { overflow: hidden; height: 220px; }
.post-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.6s ease;
    filter: brightness(0.75);
}
.post-img-placeholder {
    width: 100%; height: 220px;
    background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
    display: flex; align-items: center; justify-content: center;
}
.post-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.post-cat {
    font-family: 'Lastica', serif; font-size: 8px;
    letter-spacing: 3px; color: #C4A267;
    text-transform: uppercase; margin-bottom: 10px;
}
.post-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 1rem; font-weight: 300; color: #fff;
    letter-spacing: 1px; line-height: 1.4;
    margin: 0 0 12px; text-transform: uppercase;
}
.post-excerpt {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.82rem; color: rgba(255,255,255,0.5);
    line-height: 1.7; flex: 1;
}
.post-footer {
    padding: 14px 24px;
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; justify-content: space-between; align-items: center;
}
.post-meta {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.73rem; color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
}
.post-arrow {
    color: #C4A267; font-size: 0.85rem;
    transition: transform 0.3s;
}
.post-card:hover .post-arrow { transform: translateX(5px); }

/* ── PAGINATION ─────────────────────────────────────── */
.blog-pagination { display: flex; justify-content: center; gap: 8px; padding: 20px 0 40px; }
.blog-pagination a,
.blog-pagination span {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 11px; letter-spacing: 2px;
    padding: 10px 18px;
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.5); text-decoration: none;
    transition: all 0.3s;
}
.blog-pagination a:hover { border-color: #C4A267; color: #C4A267; }
.blog-pagination .active span,
.blog-pagination span[aria-current="page"] {
    border-color: #C4A267; color: #C4A267;
}

/* ── PODCAST SECTION ────────────────────────────────── */
.podcast-section { padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.07); }

/* Latest episode — hero card */
.podcast-hero {
    background: #111; padding: 0; overflow: hidden;
}
.podcast-hero-inner {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 360px;
}
@media (max-width: 768px) {
    .podcast-hero-inner { grid-template-columns: 1fr; }
}
.podcast-hero-img {
    position: relative; overflow: hidden;
}
.podcast-hero-img img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    filter: brightness(0.7);
}
.podcast-hero-img-placeholder {
    width: 100%; height: 100%; min-height: 280px;
    background: linear-gradient(135deg, #1a1a1a 0%, #C4A267 200%);
    display: flex; align-items: center; justify-content: center;
}
.podcast-hero-ep-badge {
    position: absolute; top: 20px; left: 20px;
    background: #C4A267; color: #0d0d0d;
    font-family: 'Lastica', serif;
    font-size: 9px; letter-spacing: 3px; padding: 6px 14px;
}
.podcast-hero-body {
    padding: 48px 44px;
    display: flex; flex-direction: column; justify-content: center;
}
.podcast-label {
    font-family: 'Lastica', serif; font-size: 9px;
    letter-spacing: 4px; color: #C4A267;
    text-transform: uppercase; margin-bottom: 16px;
}
.podcast-ep-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: clamp(1.2rem, 2vw, 1.7rem); font-weight: 300;
    color: #fff; letter-spacing: 2px;
    text-transform: uppercase; margin: 0 0 16px;
    line-height: 1.3;
}
.podcast-ep-desc {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.87rem; color: rgba(255,255,255,0.55);
    line-height: 1.75; margin-bottom: 28px;
}
.podcast-guest-chip {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(196,162,103,0.35);
    padding: 6px 16px; margin-bottom: 24px;
}
.podcast-guest-chip span {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.8rem; color: rgba(255,255,255,0.6); letter-spacing: 1px;
}
.podcast-guest-chip strong {
    color: #C4A267; font-weight: 400; font-size: 0.82rem;
}
.podcast-listen-links { display: flex; gap: 10px; flex-wrap: wrap; }
.listen-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 9px; letter-spacing: 2.5px;
    text-transform: uppercase; text-decoration: none;
    padding: 10px 20px; transition: all 0.3s;
    border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7);
}
.listen-btn:hover { border-color: #C4A267; color: #C4A267; }
.listen-btn.primary { background: #C4A267; color: #0d0d0d; border-color: #C4A267; }
.listen-btn.primary:hover { background: transparent; color: #C4A267; }
.listen-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

/* Episode list */
.ep-list { margin-top: 50px; }
.ep-item {
    display: flex; align-items: center; gap: 20px;
    padding: 22px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    text-decoration: none;
    transition: all 0.3s;
}
.ep-item:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
.ep-item:hover { padding-left: 8px; }
.ep-num {
    font-family: 'Lastica', serif; font-size: 11px;
    letter-spacing: 2px; color: #C4A267;
    min-width: 40px; text-align: right;
}
.ep-thumb {
    width: 68px; height: 68px; object-fit: cover;
    flex-shrink: 0; filter: brightness(0.8);
}
.ep-thumb-placeholder {
    width: 68px; height: 68px; flex-shrink: 0;
    background: #1a1a1a; display: flex; align-items: center; justify-content: center;
}
.ep-info { flex: 1; min-width: 0; }
.ep-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.92rem; color: #fff;
    letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ep-meta {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.75rem; color: rgba(255,255,255,0.35);
    letter-spacing: 1px;
}
.ep-duration {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.78rem; color: rgba(255,255,255,0.35);
    letter-spacing: 1px; flex-shrink: 0;
}
.ep-play-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    border: 1px solid rgba(196,162,103,0.4);
    display: flex; align-items: center; justify-content: center;
    color: #C4A267; transition: all 0.3s;
}
.ep-item:hover .ep-play-icon { background: #C4A267; color: #0d0d0d; }

/* ── NEWSLETTER STRIP ───────────────────────────────── */
.nl-strip {
    background: #111;
    padding: 70px 20px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.07);
}
.nl-strip-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 300; color: #fff;
    letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px;
}
.nl-strip-title span { color: #C4A267; }
.nl-strip-sub {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.88rem; color: rgba(255,255,255,0.45);
    letter-spacing: 2px; margin-bottom: 30px;
}
.nl-form { display: flex; gap: 0; max-width: 480px; margin: 0 auto; }
.nl-input {
    flex: 1; background: transparent;
    border: 1px solid rgba(255,255,255,0.2); border-right: none;
    color: #fff; padding: 14px 20px;
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.85rem; letter-spacing: 1px;
    outline: none;
}
.nl-input::placeholder { color: rgba(255,255,255,0.3); }
.nl-input:focus { border-color: rgba(196,162,103,0.5); }
.nl-submit {
    background: #C4A267; color: #0d0d0d;
    border: 1px solid #C4A267; padding: 14px 26px;
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 10px; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s; white-space: nowrap;
}
.nl-submit:hover { background: transparent; color: #C4A267; }

/* ── EMPTY STATE ────────────────────────────────────── */
.empty-state {
    text-align: center; padding: 80px 20px;
    font-family: 'GlacialIndifference', sans-serif;
    color: rgba(255,255,255,0.3); font-size: 0.95rem; letter-spacing: 2px;
}

/* ── ANIMATIONS ─────────────────────────────────────── */
.reveal { opacity: 0; transform: translateY(35px); transition: all 0.75s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
</style>

{{-- ═══════════════════════════════════════════════════ --}}
{{-- HERO                                                --}}
{{-- ═══════════════════════════════════════════════════ --}}
<div class="blog-hero">
    <div class="blog-hero-bg"></div>
    <div class="blog-hero-content">
        <span class="blog-hero-tag">Otentik Mia</span>
        <h1 class="blog-hero-title">BLOG &amp; <span>PODCAST</span></h1>
        <div class="blog-gold-line"></div>
        <p class="blog-hero-sub">Mode · Culture · Entrepreneuriat · Lifestyle</p>
    </div>
</div>

<div class="blog-wrap">

    {{-- ═══════════════════════════════════════════════ --}}
    {{-- FILTRES CATÉGORIES                              --}}
    {{-- ═══════════════════════════════════════════════ --}}
    <nav class="cat-filter" aria-label="Filtrer par catégorie">
        <a href="{{ route('blog') }}"
           class="cat-pill {{ !$category ? 'active' : '' }}">Tous</a>
        @foreach($categories as $cat)
            <a href="{{ route('blog', ['category' => $cat]) }}"
               class="cat-pill {{ $category === $cat ? 'active' : '' }}">{{ $cat }}</a>
        @endforeach
    </nav>

    {{-- ═══════════════════════════════════════════════ --}}
    {{-- ARTICLE À LA UNE                                --}}
    {{-- ═══════════════════════════════════════════════ --}}
    @if($featured && !$category)
    <section class="featured-section">
        <div class="container-fluid px-4 px-lg-5">
            <div class="row mb-4 reveal">
                <div class="col">
                    <span class="section-label">À la une</span>
                </div>
            </div>
            <a href="{{ route('blog.show', $featured->slug) }}" class="featured-card reveal">
                @if($featured->image)
                    <img src="{{ asset('storage/' . $featured->image) }}"
                         class="featured-img" alt="{{ $featured->title }}" loading="lazy">
                @else
                    <img src="{{ asset('img/index/home-image1.jpg') }}"
                         class="featured-img" alt="{{ $featured->title }}" loading="lazy">
                @endif
                <div class="featured-badge">À LA UNE</div>
                <div class="featured-content">
                    <span class="featured-cat">{{ $featured->category }}</span>
                    <h2 class="featured-title">{{ $featured->title }}</h2>
                    <p class="featured-excerpt">{{ $featured->excerpt }}</p>
                    <p class="featured-meta">
                        Par {{ $featured->author }}
                        &nbsp;·&nbsp; {{ $featured->formatted_date }}
                        &nbsp;·&nbsp; {{ $featured->reading_time_text }}
                    </p>
                    <div class="mt-4">
                        <span class="read-link">LIRE L'ARTICLE →</span>
                    </div>
                </div>
            </a>
        </div>
    </section>
    @endif

    {{-- ═══════════════════════════════════════════════ --}}
    {{-- GRILLE ARTICLES                                 --}}
    {{-- ═══════════════════════════════════════════════ --}}
    <section class="articles-section">
        <div class="container-fluid px-4 px-lg-5">
            <div class="row mb-5 reveal">
                <div class="col">
                    <span class="section-label">Articles</span>
                    <h2 class="section-title-wh">
                        DERNIÈRES <span>PUBLICATIONS</span>
                    </h2>
                    <div class="gold-bar"></div>
                </div>
            </div>

            @if($posts->count())
                <div class="row g-4">
                    @foreach($posts as $post)
                    <div class="col-lg-4 col-md-6 reveal" style="transition-delay: {{ $loop->index * 0.08 }}s">
                        <a href="{{ route('blog.show', $post->slug) }}" class="post-card">
                            <div class="post-img-wrap">
                                @if($post->image)
                                    <img src="{{ asset('storage/' . $post->image) }}"
                                         class="post-img" alt="{{ $post->title }}" loading="lazy">
                                @else
                                    <div class="post-img-placeholder">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                             stroke="rgba(196,162,103,0.4)" stroke-width="1.5">
                                            <path d="M4 4h16v12H4z"/><path d="M8 20h8"/>
                                        </svg>
                                    </div>
                                @endif
                            </div>
                            <div class="post-body">
                                <span class="post-cat">{{ $post->category }}</span>
                                <h3 class="post-title">{{ $post->title }}</h3>
                                <p class="post-excerpt">{{ Str::limit($post->excerpt, 110) }}</p>
                            </div>
                            <div class="post-footer">
                                <span class="post-meta">
                                    {{ $post->formatted_date }} · {{ $post->reading_time_text }}
                                </span>
                                <span class="post-arrow">→</span>
                            </div>
                        </a>
                    </div>
                    @endforeach
                </div>

                {{-- Pagination --}}
                @if($posts->hasPages())
                <div class="blog-pagination mt-5">
                    {{ $posts->appends(request()->query())->links('blog.pagination') }}
                </div>
                @endif

            @else
                <div class="empty-state reveal">
                    <p>Aucun article dans cette catégorie pour le moment.</p>
                    <a href="{{ route('blog') }}" style="color:#C4A267; letter-spacing:2px; font-size:0.8rem;">
                        ← VOIR TOUS LES ARTICLES
                    </a>
                </div>
            @endif
        </div>
    </section>

    {{-- ═══════════════════════════════════════════════ --}}
    {{-- SECTION PODCAST                                 --}}
    {{-- ═══════════════════════════════════════════════ --}}
    <section class="podcast-section">
        <div class="container-fluid px-4 px-lg-5">

            {{-- Titre section --}}
            <div class="row mb-5 reveal">
                <div class="col-lg-6">
                    <span class="section-label">🎙 Otentik Mia Podcast</span>
                    <h2 class="section-title-wh">
                        NOS <span>ÉPISODES</span>
                    </h2>
                    <div class="gold-bar"></div>
                    <p style="font-family:'GlacialIndifference',sans-serif; font-size:0.9rem;
                               color:rgba(255,255,255,0.45); line-height:1.8; letter-spacing:1px;">
                        Mode africaine, entrepreneuriat féminin, artisanat et culture —
                        des conversations authentiques avec les acteurs qui façonnent le continent.
                    </p>
                </div>
            </div>

            @if($latestPodcast)
            {{-- DERNIER ÉPISODE — HÉRO --}}
            <div class="podcast-hero reveal mb-5">
                <div class="podcast-hero-inner">
                    <div class="podcast-hero-img">
                        @if($latestPodcast->thumbnail)
                            <img src="{{ asset('storage/' . $latestPodcast->thumbnail) }}"
                                 alt="{{ $latestPodcast->title }}">
                        @else
                            <div class="podcast-hero-img-placeholder">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
                                     stroke="rgba(255,255,255,0.3)" stroke-width="1">
                                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    <line x1="12" y1="19" x2="12" y2="22"/>
                                    <line x1="8" y1="22" x2="16" y2="22"/>
                                </svg>
                            </div>
                        @endif
                        <span class="podcast-hero-ep-badge">{{ $latestPodcast->episode_label }}</span>
                    </div>
                    <div class="podcast-hero-body">
                        <p class="podcast-label">Dernier épisode</p>
                        <h3 class="podcast-ep-title">{{ $latestPodcast->title }}</h3>
                        @if($latestPodcast->guest)
                        <div class="podcast-guest-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="#C4A267" stroke-width="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span>Invité(e) : <strong>{{ $latestPodcast->guest }}</strong></span>
                        </div>
                        @endif
                        <p class="podcast-ep-desc">{{ Str::limit($latestPodcast->description, 200) }}</p>
                        <div class="podcast-listen-links">
                            @if($latestPodcast->spotify_url)
                            <a href="{{ $latestPodcast->spotify_url }}" target="_blank" class="listen-btn primary">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                                SPOTIFY
                            </a>
                            @endif
                            @if($latestPodcast->youtube_url)
                            <a href="{{ $latestPodcast->youtube_url }}" target="_blank" class="listen-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                YOUTUBE
                            </a>
                            @endif
                            @if($latestPodcast->apple_url)
                            <a href="{{ $latestPodcast->apple_url }}" target="_blank" class="listen-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm3.765 16.894c-.156.27-.44.415-.726.415-.141 0-.286-.038-.416-.117-1.227-.743-2.779-.949-4.602-.521-.208.048-.42-.009-.578-.153-.158-.143-.225-.355-.178-.562.102-.44.532-.716.97-.614 2.099-.492 3.938-.245 5.412.717.351.213.46.67.118 1.015v-.18zm1.044-2.447c-.187.34-.543.526-.906.526-.168 0-.336-.043-.489-.134-1.47-.877-3.726-1.14-5.477-.614-.21.06-.432.014-.599-.12-.167-.134-.257-.347-.238-.567.041-.42.42-.735.84-.694 2.106-.578 4.669-.266 6.394.797.407.242.54.762.293 1.181l.182-.375zm.09-2.51c-.209.376-.608.579-1.012.579-.188 0-.378-.046-.553-.143-1.77-.998-4.536-1.289-6.555-.734-.21.054-.431.004-.595-.135-.165-.139-.247-.355-.223-.572.048-.437.444-.755.879-.707 2.312-.606 5.408-.28 7.44.93.451.254.601.831.349 1.282l.27-.5z"/></svg>
                                APPLE PODCASTS
                            </a>
                            @endif
                            @if(!$latestPodcast->spotify_url && !$latestPodcast->youtube_url && !$latestPodcast->apple_url)
                            <span class="listen-btn" style="cursor:default; opacity:.5;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" stroke-width="1.5">
                                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                                </svg>
                                BIENTÔT DISPONIBLE
                            </span>
                            @endif
                        </div>
                        @if($latestPodcast->duration)
                        <p style="margin-top:18px; font-family:'GlacialIndifference',sans-serif;
                                   font-size:0.75rem; color:rgba(255,255,255,0.3); letter-spacing:2px;">
                            ⏱ {{ $latestPodcast->duration }}
                            @if($latestPodcast->formatted_date)
                                &nbsp;·&nbsp; {{ $latestPodcast->formatted_date }}
                            @endif
                        </p>
                        @endif
                    </div>
                </div>
            </div>
            @endif

            {{-- LISTE ÉPISODES --}}
            @if($podcasts->count() > 1)
            <div class="ep-list reveal">
                <div class="row mb-3">
                    <div class="col">
                        <span class="section-label" style="margin-bottom:0;">Tous les épisodes</span>
                    </div>
                </div>
                @foreach($podcasts->skip(1) as $ep)
                <div class="ep-item">
                    <span class="ep-num">{{ $ep->episode_label }}</span>
                    @if($ep->thumbnail)
                        <img src="{{ asset('storage/' . $ep->thumbnail) }}"
                             class="ep-thumb" alt="{{ $ep->title }}" loading="lazy">
                    @else
                        <div class="ep-thumb-placeholder">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                 stroke="rgba(196,162,103,0.5)" stroke-width="1.5">
                                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            </svg>
                        </div>
                    @endif
                    <div class="ep-info">
                        <h4 class="ep-title">{{ $ep->title }}</h4>
                        <p class="ep-meta">
                            @if($ep->guest) Avec {{ $ep->guest }} · @endif
                            {{ $ep->formatted_date }}
                        </p>
                    </div>
                    <span class="ep-duration">{{ $ep->duration ?? '—' }}</span>
                    <div class="ep-play-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                    </div>
                </div>
                @endforeach
            </div>
            @endif

        </div>
    </section>

    {{-- ═══════════════════════════════════════════════ --}}
    {{-- NEWSLETTER STRIP                                --}}
    {{-- ═══════════════════════════════════════════════ --}}
    <div class="nl-strip reveal">
        <span class="section-label">Ne rien manquer</span>
        <h2 class="nl-strip-title">LA NEWSLETTER <span>OTENTIK MIA</span></h2>
        <p class="nl-strip-sub">Articles, épisodes et coulisses — directement dans votre boîte mail</p>
        @if(session('newsletter_success'))
            <p style="color:#C4A267; font-family:'GlacialIndifference',sans-serif; letter-spacing:2px; font-size:0.85rem;">
                ✓ Merci ! Vous êtes maintenant abonné(e).
            </p>
        @else
        <form action="{{ route('newsletter.store') }}" method="POST" class="nl-form">
            @csrf
            <input type="email" name="email" placeholder="VOTRE EMAIL" class="nl-input" required>
            <button type="submit" class="nl-submit">S'ABONNER</button>
        </form>
        @if($errors->has('email'))
            <p style="color:#e55; margin-top:10px; font-family:'GlacialIndifference',sans-serif; font-size:0.8rem;">
                {{ $errors->first('email') }}
            </p>
        @endif
        @endif
    </div>

</div>{{-- .blog-wrap --}}

@include('layouts.footer')

<script>
// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(el => obs.observe(el));
</script>
