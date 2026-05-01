@section('title', $post->title . ' — Otentik Mia')
@section('meta_description', $post->excerpt)

@include('layouts.header')

<style>
body { overflow-x: hidden; background: #0d0d0d; }

/* ── HERO ARTICLE ─────────────────────────────────── */
.article-hero {
    position: relative;
    height: 60vh; min-height: 460px;
    display: flex; align-items: flex-end;
    overflow: hidden;
}
.article-hero-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    filter: brightness(0.35);
    transform: scale(1.04);
    transition: transform 8s ease;
}
.article-hero-bg.loaded { transform: scale(1); }
.article-hero-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.1) 60%);
}
.article-hero-content {
    position: relative; z-index: 2;
    padding: 0 0 60px;
    width: 100%;
}
.article-cat {
    font-family: 'Lastica', serif; font-size: 9px;
    letter-spacing: 4px; color: #C4A267;
    text-transform: uppercase; display: block; margin-bottom: 18px;
    text-decoration: none;
}
.article-cat:hover { color: #fff; }
.article-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    font-weight: 300; color: #fff;
    letter-spacing: 3px; text-transform: uppercase;
    margin: 0 0 20px; line-height: 1.15;
    max-width: 800px;
}
.article-meta {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.8rem; color: rgba(255,255,255,0.4);
    letter-spacing: 2px; display: flex; gap: 20px; flex-wrap: wrap;
    align-items: center;
}
.article-meta-sep { color: rgba(255,255,255,0.2); }

/* ── ARTICLE BODY ────────────────────────────────── */
.article-wrap { background: #0d0d0d; }
.article-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 60px;
    padding: 70px 0 80px;
}
@media (max-width: 1024px) {
    .article-grid { grid-template-columns: 1fr; }
    .article-sidebar { display: none; }
}

.article-content {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 1.02rem; line-height: 1.92;
    color: rgba(255,255,255,0.7);
}
.article-content h2 {
    font-size: 1.4rem; font-weight: 300; color: #fff;
    letter-spacing: 2px; text-transform: uppercase;
    margin: 40px 0 16px;
    padding-left: 16px;
    border-left: 2px solid #C4A267;
}
.article-content h3 {
    font-size: 1.1rem; font-weight: 300; color: #C4A267;
    letter-spacing: 2px; margin: 30px 0 12px;
}
.article-content p { margin-bottom: 22px; }
.article-content ul, .article-content ol {
    padding-left: 24px; margin-bottom: 22px;
}
.article-content li { margin-bottom: 8px; }
.article-content strong { color: #fff; font-weight: 400; }
.article-content blockquote {
    border-left: 2px solid #C4A267;
    padding: 16px 24px; margin: 30px 0;
    background: rgba(196,162,103,0.06);
    font-size: 1.1rem; font-style: italic; color: rgba(255,255,255,0.8);
}
.article-content a { color: #C4A267; text-decoration: underline; }

/* ── SIDEBAR ─────────────────────────────────────── */
.article-sidebar { position: relative; }
.sidebar-sticky {
    position: sticky; top: 90px;
}
.sidebar-block {
    background: #111; padding: 28px;
    margin-bottom: 24px;
}
.sidebar-label {
    font-family: 'Lastica', serif; font-size: 9px;
    letter-spacing: 3px; color: #C4A267;
    text-transform: uppercase; margin-bottom: 16px; display: block;
}
.sidebar-author-name {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 1rem; color: #fff; letter-spacing: 2px;
    text-transform: uppercase; margin: 0 0 8px;
}
.sidebar-author-bio {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.8rem; color: rgba(255,255,255,0.45);
    line-height: 1.7;
}
.sidebar-author-avatar {
    width: 60px; height: 60px; border-radius: 50%;
    object-fit: cover; margin-bottom: 14px;
    border: 1px solid rgba(196,162,103,0.3);
}
.share-btn {
    display: flex; align-items: center; gap: 10px;
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.75rem; letter-spacing: 2px;
    color: rgba(255,255,255,0.5); text-decoration: none;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07);
    transition: color 0.3s;
    text-transform: uppercase;
}
.share-btn:last-child { border-bottom: none; }
.share-btn:hover { color: #C4A267; }
.share-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

/* ── BACK / BREADCRUMB ───────────────────────────── */
.breadcrumb-bar {
    padding: 20px 0 0;
    display: flex; align-items: center; gap: 12px;
}
.back-link {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.75rem; letter-spacing: 3px;
    color: rgba(255,255,255,0.35); text-decoration: none;
    text-transform: uppercase; transition: color 0.3s;
    display: flex; align-items: center; gap: 8px;
}
.back-link:hover { color: #C4A267; }
.bc-sep { color: rgba(255,255,255,0.2); font-size: 0.7rem; }
.bc-current {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.75rem; letter-spacing: 2px;
    color: rgba(255,255,255,0.25); text-transform: uppercase;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 300px;
}

/* ── RELATED ARTICLES ────────────────────────────── */
.related-section {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 70px 0;
}
.section-label-sm {
    font-family: 'Lastica', serif; font-size: 9px;
    letter-spacing: 4px; color: #C4A267;
    text-transform: uppercase; display: block; margin-bottom: 12px;
}
.section-title-sm {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 1.6rem; font-weight: 300; color: #fff;
    letter-spacing: 3px; text-transform: uppercase; margin: 0 0 40px;
}
.section-title-sm span { color: #C4A267; }
.rel-card {
    display: block; text-decoration: none;
    background: #111; overflow: hidden;
    transition: transform 0.4s ease;
}
.rel-card:hover { transform: translateY(-5px); }
.rel-card:hover .rel-img { transform: scale(1.06); }
.rel-img-wrap { overflow: hidden; height: 180px; }
.rel-img {
    width: 100%; height: 100%; object-fit: cover;
    display: block; transition: transform 0.6s ease;
    filter: brightness(0.7);
}
.rel-body { padding: 20px; }
.rel-cat {
    font-family: 'Lastica', serif; font-size: 8px;
    letter-spacing: 3px; color: #C4A267;
    text-transform: uppercase; margin-bottom: 8px; display: block;
}
.rel-title {
    font-family: 'GlacialIndifference', sans-serif;
    font-size: 0.9rem; font-weight: 300; color: #fff;
    letter-spacing: 1px; text-transform: uppercase;
    line-height: 1.4; margin: 0;
}
</style>

{{-- ═══════════════════════════════════════════════════ --}}
{{-- HERO                                                --}}
{{-- ═══════════════════════════════════════════════════ --}}
<div class="article-hero">
    <div class="article-hero-bg" id="articleBg"
         style="background-image:url('{{ $post->image ? asset("storage/".$post->image) : asset("img/index/home-image1.jpg") }}')">
    </div>
    <div class="article-hero-gradient"></div>
    <div class="article-hero-content">
        <div class="container">
            <a href="{{ route('blog', ['category' => $post->category]) }}" class="article-cat">
                ← {{ $post->category }}
            </a>
            <h1 class="article-title">{{ $post->title }}</h1>
            <div class="article-meta">
                <span>Par {{ $post->author }}</span>
                <span class="article-meta-sep">·</span>
                <span>{{ $post->formatted_date }}</span>
                <span class="article-meta-sep">·</span>
                <span>{{ $post->reading_time_text }}</span>
            </div>
        </div>
    </div>
</div>

<div class="article-wrap">
    <div class="container">

        {{-- Breadcrumb --}}
        <div class="breadcrumb-bar">
            <a href="{{ route('blog') }}" class="back-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
                Blog
            </a>
            <span class="bc-sep">/</span>
            <span class="bc-current">{{ $post->title }}</span>
        </div>

        {{-- Article grid --}}
        <div class="article-grid">

            {{-- ─── CONTENU PRINCIPAL ──────────────────── --}}
            <main class="article-content">
                @if($post->excerpt)
                <blockquote>{{ $post->excerpt }}</blockquote>
                @endif
                {!! $post->content !!}
            </main>

            {{-- ─── SIDEBAR ─────────────────────────────── --}}
            <aside class="article-sidebar">
                <div class="sidebar-sticky">

                    {{-- Auteur --}}
                    <div class="sidebar-block">
                        <span class="sidebar-label">À propos de l'auteure</span>
                        <img src="{{ asset('img/logo_MIA.png') }}"
                             class="sidebar-author-avatar" alt="{{ $post->author }}">
                        <h4 class="sidebar-author-name">{{ $post->author }}</h4>
                        <p class="sidebar-author-bio">
                            Fondatrice de MIA DREAMS & CO, styliste et entrepreneuse sénégalaise.
                            Passionnée de mode africaine éthique et de personal branding.
                        </p>
                    </div>

                    {{-- Partager --}}
                    <div class="sidebar-block">
                        <span class="sidebar-label">Partager cet article</span>
                        <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(request()->url()) }}"
                           target="_blank" class="share-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ urlencode(request()->url()) }}"
                           target="_blank" class="share-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                        </a>
                        <a href="https://wa.me/?text={{ urlencode($post->title . ' — ' . request()->url()) }}"
                           target="_blank" class="share-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                        </a>
                    </div>

                    {{-- Retour blog --}}
                    <a href="{{ route('blog') }}"
                       style="display:block; border:1px solid rgba(196,162,103,0.4); color:#C4A267;
                              text-align:center; padding:14px;
                              font-family:'GlacialIndifference',sans-serif;
                              font-size:10px; letter-spacing:3px; text-decoration:none;
                              text-transform:uppercase; transition:all .3s;"
                       onmouseover="this.style.background='#C4A267';this.style.color='#0d0d0d'"
                       onmouseout="this.style.background='transparent';this.style.color='#C4A267'">
                        ← RETOUR AU BLOG
                    </a>
                </div>
            </aside>

        </div>
    </div>

    {{-- ═══════════════════════════════════════════════ --}}
    {{-- ARTICLES LIÉS                                   --}}
    {{-- ═══════════════════════════════════════════════ --}}
    @if($related->count())
    <section class="related-section">
        <div class="container">
            <span class="section-label-sm">Vous aimerez aussi</span>
            <h2 class="section-title-sm">ARTICLES <span>SIMILAIRES</span></h2>
            <div class="row g-4">
                @foreach($related as $rel)
                <div class="col-lg-4 col-md-6">
                    <a href="{{ route('blog.show', $rel->slug) }}" class="rel-card">
                        <div class="rel-img-wrap">
                            @if($rel->image)
                                <img src="{{ asset('storage/' . $rel->image) }}"
                                     class="rel-img" alt="{{ $rel->title }}" loading="lazy">
                            @else
                                <img src="{{ asset('img/index/home-image1.jpg') }}"
                                     class="rel-img" alt="{{ $rel->title }}" loading="lazy">
                            @endif
                        </div>
                        <div class="rel-body">
                            <span class="rel-cat">{{ $rel->category }}</span>
                            <h3 class="rel-title">{{ $rel->title }}</h3>
                        </div>
                    </a>
                </div>
                @endforeach
            </div>
        </div>
    </section>
    @endif

</div>{{-- .article-wrap --}}

@include('layouts.footer')

<script>
// Ken Burns on hero bg
document.getElementById('articleBg').classList.add('loaded');
</script>
