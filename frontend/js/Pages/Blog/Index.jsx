import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../Components/Layout';

// ─── Helpers podcast ───────────────────────────────────────────────────────────
const epLabel = (p) => {
    const s = p.season ? `S${p.season} ` : '';
    return `${s}EP.${String(p.episode_number ?? 0).padStart(2, '0')}`;
};
const fmtDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── Carte article ─────────────────────────────────────────────────────────────
function PostCard({ post, featured = false }) {
    const imgSrc = post.cover_image ? `/storage/${post.cover_image}` : '/img/index/home-image7.webp';

    if (featured) {
        return (
            <Link href={`/blog/${post.slug}`}
                  className="group relative overflow-hidden block h-[480px]">
                <img src={imgSrc}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     style={{ filter: 'brightness(.5)' }} alt={post.title} loading="eager" />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top,rgba(8,8,8,.9) 0%,transparent 55%)' }} />
                <div className="absolute bottom-0 inset-x-0 p-8 lg:p-12">
                    <span className="inline-block font-lastica text-[8px] tracking-[3px] text-gold uppercase border border-gold/50 px-3 py-1 mb-5">
                        {post.category || 'Article'} · À la une
                    </span>
                    <h2 className="display-title text-2xl lg:text-3xl text-white leading-tight mb-4">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="font-glacial text-sm text-white/60 leading-relaxed max-w-2xl mb-6">
                            {post.excerpt.slice(0, 180)}
                        </p>
                    )}
                    <span className="btn btn-gold inline-flex">
                        LIRE L'ARTICLE →
                    </span>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <div className="overflow-hidden mb-4 relative">
                <img src={imgSrc}
                     className="w-full h-[220px] object-cover transition-transform duration-700 group-hover:scale-105"
                     style={{ filter: 'brightness(.75)' }} alt={post.title} loading="lazy" />
                <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-400" />
            </div>
            {post.category && (
                <span className="font-lastica text-[7px] tracking-[3px] text-gold uppercase mb-2 block">{post.category}</span>
            )}
            <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] leading-tight mb-2.5
                           group-hover:text-gold transition-colors duration-250">
                {post.title}
            </h3>
            {post.excerpt && (
                <p className="font-glacial text-xs text-white/35 leading-relaxed line-clamp-3">
                    {post.excerpt}
                </p>
            )}
            <div className="mt-4 w-0 group-hover:w-8 h-px bg-gold transition-all duration-400" />
        </Link>
    );
}

// ─── Carte podcast épisode ─────────────────────────────────────────────────────
function PodcastCard({ podcast, index }) {
    const thumb = podcast.thumbnail ? `/storage/${podcast.thumbnail}` : null;

    const PlatformBtn = ({ href, color, icon, label }) => {
        if (!href) return null;
        return (
            <a href={href} target="_blank" rel="noopener"
               className="inline-flex items-center gap-1.5 font-lastica text-[7px] tracking-[2px] uppercase
                          px-3 py-1.5 border transition-all duration-200 hover:text-[#080808]"
               style={{ borderColor: color + '40', color, ['--hover-bg']: color }}
               onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#080808'; }}
               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = color; }}>
                {icon}
                {label}
            </a>
        );
    };

    return (
        <div className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/25 transition-all duration-400"
             style={{ transitionDelay: `${index * 0.08}s` }}>

            {/* Thumbnail */}
            <div className="relative overflow-hidden">
                {thumb ? (
                    <img src={thumb}
                         className="w-full h-[180px] object-cover transition-transform duration-700 group-hover:scale-105"
                         style={{ filter: 'brightness(.8)' }}
                         alt={podcast.title} loading="lazy" />
                ) : (
                    <div className="w-full h-[180px] bg-[#161616] flex flex-col items-center justify-center gap-3">
                        {/* Waveform décoratif */}
                        <div className="flex items-end gap-0.5 h-10">
                            {[4,7,10,6,12,8,5,9,7,11,6,8,10,5,7].map((h, i) => (
                                <div key={i} className="w-1 bg-gold/20 rounded-full"
                                     style={{ height: `${h * 3}px` }} />
                            ))}
                        </div>
                        <span className="font-lastica text-[7px] tracking-[3px] text-gold/25 uppercase">Podcast</span>
                    </div>
                )}

                {/* Badge épisode */}
                <div className="absolute top-3 left-3">
                    <span className="font-lastica text-[7px] tracking-[2px] text-white uppercase
                                     bg-[#080808]/85 px-2.5 py-1.5 backdrop-blur-sm">
                        {epLabel(podcast)}
                    </span>
                </div>

                {/* Durée */}
                {podcast.duration && (
                    <div className="absolute bottom-3 right-3">
                        <span className="font-glacial text-[10px] text-white/60 bg-[#080808]/70 px-2 py-1 backdrop-blur-sm">
                            {podcast.duration}
                        </span>
                    </div>
                )}

                {/* Overlay lecture au hover */}
                <div className="absolute inset-0 bg-[#080808]/0 group-hover:bg-[#080808]/50
                                flex items-center justify-center transition-all duration-400">
                    <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center
                                    opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                                    transition-all duration-400 bg-[#080808]/60">
                        <svg className="w-4 h-4 text-gold ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] leading-snug
                                       group-hover:text-gold transition-colors duration-300 line-clamp-2">
                            {podcast.title}
                        </h3>
                    </div>
                </div>

                {/* Invité */}
                {podcast.guest && (
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-px bg-gold/30" />
                        <span className="font-lastica text-[7px] tracking-[2px] text-gold/60 uppercase">
                            avec {podcast.guest}
                        </span>
                    </div>
                )}

                {/* Description */}
                {podcast.description && (
                    <p className="font-glacial text-xs text-white/35 leading-relaxed line-clamp-2 mb-4">
                        {podcast.description}
                    </p>
                )}

                {/* Date */}
                {podcast.published_at && (
                    <p className="font-lastica text-[7px] tracking-[2px] text-white/20 uppercase mb-4">
                        {fmtDate(podcast.published_at)}
                    </p>
                )}

                {/* Plateformes */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                    <PlatformBtn href={podcast.spotify_url} color="#1DB954"
                        icon={<svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>}
                        label="Spotify" />
                    <PlatformBtn href={podcast.youtube_url} color="#FF0000"
                        icon={<svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>}
                        label="YouTube" />
                    <PlatformBtn href={podcast.apple_url} color="#a855f7"
                        icon={<svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>}
                        label="Apple" />
                    {podcast.audio_url && (
                        <a href={podcast.audio_url} target="_blank" rel="noopener"
                           className="inline-flex items-center gap-1.5 font-lastica text-[7px] tracking-[2px]
                                      uppercase px-3 py-1.5 border border-white/10 text-white/30
                                      hover:border-gold/40 hover:text-gold transition-all duration-200">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 18.657V5.343M8.464 8.464a5 5 0 000 7.072"/>
                            </svg>
                            Audio
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Page Blog ─────────────────────────────────────────────────────────────────
export default function BlogIndex({ featured, posts, podcasts, latestPodcast, categories, category, search: initialSearch = '' }) {
    const [searchInput, setSearchInput] = useState(initialSearch);

    const filterCategory = (cat) => {
        router.get('/blog', cat ? { category: cat } : {}, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/blog', searchInput.trim() ? { search: searchInput.trim() } : {}, { preserveState: false });
    };

    return (
        <Layout>
            <Head title="Blog & Podcast">
                <meta name="description" content="Blog et podcast MIA DREAMS & CO — mode africaine, personal branding, entrepreneuriat et culture." />
            </Head>

            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <div className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/index/home-image7.webp')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.5) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Otentik Mia</span>
                    <h1 className="display-title text-white mt-4 mb-5"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        BLOG <span className="text-gold">& PODCAST</span>
                    </h1>
                    <div className="gold-line-center"
                         style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            {/* ── BARRE DE RECHERCHE ────────────────────────────────────────── */}
            <div className="bg-[#080808] pt-10 pb-6 border-b border-gold/8">
                <div className="max-w-xl mx-auto px-6">
                    <form onSubmit={handleSearch}
                          className="flex items-center gap-3 border-b border-white/10 pb-3 focus-within:border-gold/40 transition-colors">
                        <svg className="w-4 h-4 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                        </svg>
                        <input type="text" value={searchInput}
                               onChange={e => setSearchInput(e.target.value)}
                               placeholder="Rechercher un article ou épisode…"
                               className="flex-1 bg-transparent text-white font-glacial text-sm tracking-[1px]
                                          outline-none placeholder:text-white/18" />
                        {searchInput && (
                            <button type="button"
                                    onClick={() => { setSearchInput(''); router.get('/blog', {}, { preserveState: false }); }}
                                    className="text-white/20 hover:text-gold transition-colors text-base leading-none">✕</button>
                        )}
                        <button type="submit" className="btn btn-gold py-[.55rem] px-4 text-[9px]">GO</button>
                    </form>
                    {initialSearch && (
                        <p className="font-glacial text-xs text-white/25 mt-3 tracking-[1px]">
                            {posts?.data?.length > 0
                                ? `${posts.data.length} résultat${posts.data.length > 1 ? 's' : ''} pour « ${initialSearch} »`
                                : `Aucun résultat pour « ${initialSearch} »`}
                        </p>
                    )}
                </div>
            </div>

            {/* ── ARTICLE FEATURED ─────────────────────────────────────────── */}
            {!initialSearch && featured && (
                <section className="bg-[#080808] pt-16 pb-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <PostCard post={featured} featured />
                    </div>
                </section>
            )}

            {/* ── FILTRES CATÉGORIES ────────────────────────────────────────── */}
            {!initialSearch && categories && categories.length > 0 && (
                <div className="bg-[#080808] border-y border-gold/8 sticky top-[72px] z-40 py-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap gap-2.5 items-center">
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold/35 uppercase mr-1">Catégories</span>
                        <div className="w-px h-3 bg-gold/15" />
                        {[{ label: 'Tout', value: null }, ...categories.map(c => ({ label: c, value: c }))].map(({ label, value }) => (
                            <button key={label} onClick={() => filterCategory(value)}
                                    className={`font-glacial text-[10px] tracking-[2px] uppercase border px-4 py-1.5
                                                transition-all duration-200 ${
                                        (!category && !value) || category === value
                                            ? 'bg-gold text-[#080808] border-gold'
                                            : 'border-white/10 text-white/40 hover:border-gold/40 hover:text-gold'
                                    }`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── GRILLE ARTICLES ───────────────────────────────────────────── */}
            <section className="bg-[#080808] py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {posts && posts.data && posts.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                                {posts.data.map((post, i) => (
                                    <div key={post.id} className="reveal" style={{ transitionDelay: `${(i % 6) * 0.08}s` }}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {posts.links && posts.links.length > 3 && (
                                <div className="flex justify-center gap-2 mt-14">
                                    {posts.links.map((link, i) => (
                                        <button key={i} disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={`font-glacial text-[11px] tracking-[2px] px-4 py-2 border
                                                            transition-all duration-200 disabled:opacity-30 ${
                                                    link.active
                                                        ? 'bg-gold text-[#080808] border-gold'
                                                        : 'border-white/12 text-white/40 hover:border-gold hover:text-gold'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">
                                {initialSearch ? 'Aucun résultat' : 'Aucun article pour le moment'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── PODCASTS ──────────────────────────────────────────────────── */}
            {podcasts && podcasts.length > 0 && (
                <section className="bg-[#0a0a0a] py-24 lg:py-28 border-t border-gold/8">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">

                        {/* En-tête section */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 reveal">
                            <div>
                                <span className="eyebrow">Otentik Mia</span>
                                <h2 className="display-title text-3xl lg:text-4xl text-white mt-3">
                                    NOS <span className="text-gold">PODCASTS</span>
                                </h2>
                            </div>
                            <p className="font-glacial text-xs text-white/25 max-w-xs leading-relaxed mt-4 lg:mt-0">
                                Mode africaine · Personal branding · Entrepreneuriat · Culture
                            </p>
                        </div>

                        {/* Dernier épisode — mise en avant */}
                        {latestPodcast && (
                            <div className="reveal mb-10">
                                <div className="border border-gold/15 grid grid-cols-1 lg:grid-cols-2 overflow-hidden
                                                hover:border-gold/30 transition-colors duration-400 group">
                                    {/* Thumbnail */}
                                    <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
                                        {latestPodcast.thumbnail ? (
                                            <img src={`/storage/${latestPodcast.thumbnail}`}
                                                 className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                 style={{ filter: 'brightness(.75)' }}
                                                 alt={latestPodcast.title} loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full min-h-[280px] bg-[#141414] flex flex-col items-center justify-center gap-4">
                                                <div className="flex items-end gap-1 h-12">
                                                    {[5,9,14,8,16,11,6,13,9,15,7,10,14,6,9].map((h, i) => (
                                                        <div key={i} className="w-1.5 bg-gold/25 rounded-full"
                                                             style={{ height: `${h * 3}px` }} />
                                                    ))}
                                                </div>
                                                <span className="font-lastica text-[7px] tracking-[4px] text-gold/30 uppercase">Dernier épisode</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="font-lastica text-[8px] tracking-[2px] text-white uppercase
                                                             bg-gold px-3 py-1.5">
                                                {epLabel(latestPodcast)} · Dernier épisode
                                            </span>
                                        </div>
                                    </div>

                                    {/* Infos */}
                                    <div className="p-8 lg:p-10 flex flex-col justify-center bg-[#0f0f0f]">
                                        {latestPodcast.guest && (
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="w-6 h-px bg-gold/40" />
                                                <span className="font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase">
                                                    Avec {latestPodcast.guest}
                                                </span>
                                            </div>
                                        )}
                                        <h3 className="display-title text-xl lg:text-2xl text-white leading-tight mb-4
                                                       group-hover:text-gold transition-colors duration-300">
                                            {latestPodcast.title}
                                        </h3>
                                        {latestPodcast.description && (
                                            <p className="font-glacial text-sm text-white/40 leading-loose mb-6 line-clamp-3">
                                                {latestPodcast.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mb-7 text-white/25">
                                            {latestPodcast.duration && (
                                                <span className="font-glacial text-xs flex items-center gap-1.5">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                                    </svg>
                                                    {latestPodcast.duration}
                                                </span>
                                            )}
                                            {latestPodcast.published_at && (
                                                <span className="font-glacial text-xs">{fmtDate(latestPodcast.published_at)}</span>
                                            )}
                                        </div>
                                        {/* Boutons plateformes */}
                                        <div className="flex flex-wrap gap-2.5">
                                            {latestPodcast.spotify_url && (
                                                <a href={latestPodcast.spotify_url} target="_blank" rel="noopener"
                                                   className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase
                                                              px-4 py-2.5 border border-[#1DB954]/40 text-[#1DB954]
                                                              hover:bg-[#1DB954] hover:text-[#080808] hover:border-[#1DB954] transition-all duration-250">
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                                                    Spotify
                                                </a>
                                            )}
                                            {latestPodcast.youtube_url && (
                                                <a href={latestPodcast.youtube_url} target="_blank" rel="noopener"
                                                   className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase
                                                              px-4 py-2.5 border border-[#FF0000]/40 text-[#FF0000]
                                                              hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all duration-250">
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                                                    YouTube
                                                </a>
                                            )}
                                            {latestPodcast.apple_url && (
                                                <a href={latestPodcast.apple_url} target="_blank" rel="noopener"
                                                   className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase
                                                              px-4 py-2.5 border border-[#a855f7]/40 text-[#a855f7]
                                                              hover:bg-[#a855f7] hover:text-white hover:border-[#a855f7] transition-all duration-250">
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
                                                    Apple
                                                </a>
                                            )}
                                            {latestPodcast.audio_url && (
                                                <a href={latestPodcast.audio_url} target="_blank" rel="noopener"
                                                   className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase
                                                              px-4 py-2.5 border border-white/15 text-white/40
                                                              hover:border-gold/40 hover:text-gold transition-all duration-250">
                                                    ▶ Audio
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grille autres épisodes */}
                        {podcasts.length > 1 && (
                            <>
                                <div className="flex items-center gap-5 mb-10 reveal">
                                    <span className="font-lastica text-[7px] tracking-[4px] text-white/25 uppercase">Tous les épisodes</span>
                                    <div className="flex-1 h-px bg-gold/8" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    {podcasts.slice(1).map((p, i) => (
                                        <PodcastCard key={p.id} podcast={p} index={i} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}
        </Layout>
    );
}
