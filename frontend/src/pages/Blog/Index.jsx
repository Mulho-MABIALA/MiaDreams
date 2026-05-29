import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { imgSrc as getImgSrc } from '../../utils/imgSrc';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const epLabel = (p) => `${p.season ? `S${p.season} ` : ''}EP.${String(p.episode_number ?? 0).padStart(2, '0')}`;

function PostCard({ post, featured = false }) {
    const imgSrc = getImgSrc(post.cover_image, '/img/index/home-image7.webp');
    if (featured) return (
        <Link to={`/blog/${post.slug}`} className="group relative overflow-hidden block h-[320px] sm:h-[420px] lg:h-[480px]">
            <img src={imgSrc} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(.5)' }} alt={post.title} loading="eager" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(8,8,8,.9) 0%,transparent 55%)' }} />
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 lg:p-12">
                <span className="inline-block font-lastica text-[8px] tracking-[3px] text-gold uppercase border border-gold/50 px-3 py-1 mb-3 sm:mb-5">{post.category || 'Article'} · À la une</span>
                <h2 className="display-title text-xl sm:text-2xl lg:text-3xl text-white leading-tight mb-3 sm:mb-4">{post.title}</h2>
                {post.excerpt && <p className="font-glacial text-sm text-white/60 leading-relaxed max-w-2xl mb-6">{post.excerpt.slice(0, 180)}</p>}
                <span className="btn btn-gold inline-flex">LIRE L'ARTICLE →</span>
            </div>
        </Link>
    );
    return (
        <Link to={`/blog/${post.slug}`} className="group block">
            <div className="overflow-hidden mb-4 relative">
                <img src={imgSrc} className="w-full h-[180px] sm:h-[220px] object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(.75)' }} alt={post.title} loading="lazy" />
                <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/50 transition-colors duration-400" />
            </div>
            {post.category && <span className="font-lastica text-[7px] tracking-[3px] text-gold uppercase mb-2 block">{post.category}</span>}
            <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] leading-tight mb-2.5 group-hover:text-gold transition-colors duration-250">{post.title}</h3>
            {post.excerpt && <p className="font-glacial text-xs text-white/35 leading-relaxed line-clamp-3">{post.excerpt}</p>}
            <div className="mt-4 w-0 group-hover:w-8 h-px bg-gold transition-all duration-400" />
        </Link>
    );
}

export default function BlogIndex() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [data, setData] = useState({ featured: null, posts: { data: [], total: 0, pages: 1 }, categories: [] });
    const [podcasts, setPodcasts] = useState([]);
    const [latestPodcast, setLatestPodcast] = useState(null);
    const [page, setPage] = useState(1);

    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const params = { page, _t: Date.now() };
        if (category) params.category = category;
        if (search) params.search = search;
        axios.get('/api/blog', { params }).then(res => setData(res.data)).catch(() => {});
    }, [category, search, page]);

    useEffect(() => {
        axios.get('/api/podcasts', { params: { _t: Date.now() } }).then(res => { setPodcasts(res.data.podcasts); setLatestPodcast(res.data.latestPodcast); }).catch(() => {});
    }, []);

    const filterCategory = (cat) => {
        setPage(1);
        const p = cat ? { category: cat } : {};
        setSearchParams(p);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchParams(searchInput.trim() ? { search: searchInput.trim() } : {});
    };

    return (
        <Layout title="Blog & Podcast">
            {/* HERO */}
            <div className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image7.webp')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.5) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Otentik Mia</span>
                    <h1 className="display-title text-white mt-4 mb-5" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        BLOG <span className="text-gold">& PODCAST</span>
                    </h1>
                    <div className="gold-line-center" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            {/* RECHERCHE */}
            <div className="bg-[#080808] pt-10 pb-6 border-b border-gold/8">
                <div className="max-w-xl mx-auto px-6">
                    <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-white/10 pb-3 focus-within:border-gold/40 transition-colors">
                        <svg className="w-4 h-4 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Rechercher un article ou épisode…"
                               className="flex-1 bg-transparent text-white font-glacial text-sm tracking-[1px] outline-none placeholder:text-white/18" />
                        {searchInput && (
                            <button type="button" onClick={() => { setSearchInput(''); setSearchParams({}); }} className="text-white/20 hover:text-gold transition-colors text-base leading-none">✕</button>
                        )}
                        <button type="submit" className="btn btn-gold py-[.55rem] px-4 text-[9px]">GO</button>
                    </form>
                    {search && (
                        <p className="font-glacial text-xs text-white/25 mt-3 tracking-[1px]">
                            {data.posts?.data?.length > 0 ? `${data.posts.data.length} résultat(s) pour « ${search} »` : `Aucun résultat pour « ${search} »`}
                        </p>
                    )}
                </div>
            </div>

            {/* FEATURED */}
            {!search && data.featured && (
                <section className="bg-[#080808] pt-16 pb-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <PostCard post={data.featured} featured />
                    </div>
                </section>
            )}

            {/* FILTRES */}
            {!search && data.categories.length > 0 && (
                <div className="bg-[#080808] border-y border-gold/8 sticky top-[72px] z-40 py-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap gap-2.5 items-center">
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold/35 uppercase mr-1">Catégories</span>
                        <div className="w-px h-3 bg-gold/15" />
                        {[{ label: 'Tout', value: '' }, ...data.categories.map(c => ({ label: c, value: c }))].map(({ label, value }) => (
                            <button key={label} onClick={() => filterCategory(value)}
                                    className={`font-glacial text-[10px] tracking-[2px] uppercase border px-4 py-1.5 transition-all duration-200 ${
                                        category === value ? 'bg-gold text-[#080808] border-gold' : 'border-white/10 text-white/40 hover:border-gold/40 hover:text-gold'
                                    }`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ARTICLES */}
            <section className="bg-[#080808] py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {data.posts.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                                {data.posts.data.map((post, i) => (
                                    <div key={post._id} className="reveal" style={{ transitionDelay: `${(i % 6) * 0.08}s` }}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>
                            {data.posts.pages > 1 && (
                                <div className="flex justify-center gap-2 mt-14">
                                    {Array.from({ length: data.posts.pages }).map((_, i) => (
                                        <button key={i} onClick={() => setPage(i + 1)}
                                                className={`font-glacial text-[11px] tracking-[2px] px-4 py-2 border transition-all duration-200 ${
                                                    page === i + 1 ? 'bg-gold text-[#080808] border-gold' : 'border-white/12 text-white/40 hover:border-gold hover:text-gold'
                                                }`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">{search ? 'Aucun résultat' : 'Aucun article pour le moment'}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* PODCASTS */}
            {podcasts.length > 0 && (
                <section className="bg-[#0a0a0a] py-24 lg:py-28 border-t border-gold/8">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 reveal">
                            <div>
                                <span className="eyebrow">Otentik Mia</span>
                                <h2 className="display-title text-3xl lg:text-4xl text-white mt-3">NOS <span className="text-gold">PODCASTS</span></h2>
                            </div>
                            <p className="font-glacial text-xs text-white/25 max-w-xs leading-relaxed mt-4 lg:mt-0">Mode africaine · Personal branding · Entrepreneuriat · Culture</p>
                        </div>
                        {latestPodcast && (
                            <div className="reveal mb-10">
                                <div className="border border-gold/15 grid grid-cols-1 lg:grid-cols-2 overflow-hidden hover:border-gold/30 transition-colors group">
                                    <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
                                        {latestPodcast.thumbnail
                                            ? <img src={getImgSrc(latestPodcast.thumbnail)} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(.75)' }} alt={latestPodcast.title} />
                                            : <div className="w-full h-full min-h-[280px] bg-[#141414] flex items-center justify-center"><span className="font-lastica text-[7px] tracking-[4px] text-gold/30 uppercase">Dernier épisode</span></div>
                                        }
                                        <div className="absolute top-4 left-4">
                                            <span className="font-lastica text-[8px] tracking-[2px] text-white uppercase bg-gold px-3 py-1.5">{epLabel(latestPodcast)} · Dernier épisode</span>
                                        </div>
                                    </div>
                                    <div className="p-8 lg:p-10 flex flex-col justify-center bg-[#0f0f0f]">
                                        {latestPodcast.guest && (
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="w-6 h-px bg-gold/40" />
                                                <span className="font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase">Avec {latestPodcast.guest}</span>
                                            </div>
                                        )}
                                        <h3 className="display-title text-xl lg:text-2xl text-white leading-tight mb-4 group-hover:text-gold transition-colors">{latestPodcast.title}</h3>
                                        {latestPodcast.description && <p className="font-glacial text-sm text-white/40 leading-loose mb-6 line-clamp-3">{latestPodcast.description}</p>}
                                        <div className="flex flex-wrap gap-2.5">
                                            {latestPodcast.spotify_url && <a href={latestPodcast.spotify_url} target="_blank" rel="noopener" className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase px-4 py-2.5 border border-[#1DB954]/40 text-[#1DB954] hover:bg-[#1DB954] hover:text-[#080808] transition-all duration-250">Spotify</a>}
                                            {latestPodcast.youtube_url && <a href={latestPodcast.youtube_url} target="_blank" rel="noopener" className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase px-4 py-2.5 border border-[#FF0000]/40 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-250">YouTube</a>}
                                            {latestPodcast.apple_url && <a href={latestPodcast.apple_url} target="_blank" rel="noopener" className="flex items-center gap-2 font-lastica text-[8px] tracking-[2px] uppercase px-4 py-2.5 border border-[#a855f7]/40 text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all duration-250">Apple</a>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {podcasts.length > 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {podcasts.slice(1).map((p, i) => (
                                    <div key={p._id} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/25 transition-all duration-400" style={{ transitionDelay: `${i * 0.08}s` }}>
                                        <div className="p-5">
                                            <span className="font-lastica text-[7px] tracking-[2px] text-white uppercase bg-[#080808]/85 px-2.5 py-1.5 block w-fit mb-3">{epLabel(p)}</span>
                                            <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] leading-snug group-hover:text-gold transition-colors mb-2 line-clamp-2">{p.title}</h3>
                                            {p.guest && <p className="font-lastica text-[7px] tracking-[2px] text-gold/60 uppercase mb-3">avec {p.guest}</p>}
                                            {p.description && <p className="font-glacial text-xs text-white/35 line-clamp-2 mb-4">{p.description}</p>}
                                            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                                                {p.spotify_url && <a href={p.spotify_url} target="_blank" rel="noopener" className="font-lastica text-[7px] tracking-[2px] uppercase px-3 py-1.5 border border-[#1DB954]/40 text-[#1DB954] hover:bg-[#1DB954] hover:text-[#080808] transition-all duration-200">Spotify</a>}
                                                {p.youtube_url && <a href={p.youtube_url} target="_blank" rel="noopener" className="font-lastica text-[7px] tracking-[2px] uppercase px-3 py-1.5 border border-[#FF0000]/40 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-200">YouTube</a>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </Layout>
    );
}
