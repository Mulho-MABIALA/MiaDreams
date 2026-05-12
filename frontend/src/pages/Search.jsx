import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { imgSrc } from '../utils/imgSrc';

export default function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const q = searchParams.get('q') || '';
    const [data, setData] = useState({ posts: [], brands: [], products: [], query: '' });
    const [input, setInput] = useState(q);

    useEffect(() => {
        if (q.length >= 2) {
            axios.get('/api/search', { params: { q } }).then(res => setData(res.data)).catch(() => {});
        }
    }, [q]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim().length >= 2) navigate(`/recherche?q=${encodeURIComponent(input.trim())}`);
    };

    const { addItem } = useCart();
    const total = data.posts.length + data.brands.length + data.products.length;

    return (
        <Layout title={`Recherche${q ? ` — ${q}` : ''}`}>
            {/* HERO */}
            <div className="bg-[#0d0d0d] border-b border-gold/8 pt-16 pb-10">
                <div className="max-w-2xl mx-auto px-6">
                    <span className="eyebrow justify-center mb-4">Recherche</span>
                    <form onSubmit={handleSearch} className="flex items-center gap-4 border-b border-white/15 pb-4 focus-within:border-gold/40 transition-colors">
                        <svg className="w-5 h-5 text-gold/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <input type="text" value={input} onChange={e => setInput(e.target.value)}
                               placeholder="Rechercher…" autoFocus
                               className="flex-1 bg-transparent text-white font-glacial text-lg tracking-[1px] outline-none placeholder:text-white/15" />
                        <button type="submit" className="btn btn-gold py-[.55rem] px-5 text-[9px]">GO</button>
                    </form>
                    {q && (
                        <p className="font-glacial text-xs text-white/25 mt-3 tracking-[1px]">
                            {total > 0 ? `${total} résultat${total > 1 ? 's' : ''} pour « ${q} »` : `Aucun résultat pour « ${q} »`}
                        </p>
                    )}
                </div>
            </div>

            <section className="bg-[#080808] py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">

                    {/* ARTICLES */}
                    {data.posts.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center gap-5 mb-8">
                                <span className="font-lastica text-[8px] tracking-[4px] text-gold/60 uppercase">Articles</span>
                                <div className="flex-1 h-px bg-gold/8" />
                                <span className="font-lastica text-[7px] tracking-[3px] text-white/20">{data.posts.length}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.posts.map((post, i) => (
                                    <Link key={post._id} to={`/blog/${post.slug}`} className="group reveal border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 overflow-hidden transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                        {post.cover_image && <img src={imgSrc(post.cover_image)} className="w-full h-[180px] object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(.7)' }} alt={post.title} loading="lazy" />}
                                        <div className="p-5">
                                            {post.category && <span className="font-lastica text-[7px] tracking-[3px] text-gold uppercase block mb-2">{post.category}</span>}
                                            <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] leading-tight group-hover:text-gold transition-colors">{post.title}</h3>
                                            {post.excerpt && <p className="font-glacial text-xs text-white/30 mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MARQUES */}
                    {data.brands.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center gap-5 mb-8">
                                <span className="font-lastica text-[8px] tracking-[4px] text-gold/60 uppercase">Marques</span>
                                <div className="flex-1 h-px bg-gold/8" />
                                <span className="font-lastica text-[7px] tracking-[3px] text-white/20">{data.brands.length}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.brands.map((brand, i) => (
                                    <Link key={brand._id} to={`/marque/${brand.slug}`} className="group reveal flex items-center gap-5 border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-5 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                        {brand.image && <img src={imgSrc(brand.image)} className="w-16 h-16 object-cover flex-shrink-0" alt={brand.name} />}
                                        <div>
                                            <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] group-hover:text-gold transition-colors">{brand.name}</h3>
                                            {brand.description && <p className="font-glacial text-xs text-white/30 mt-1 line-clamp-2">{brand.description}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PRODUITS */}
                    {data.products.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center gap-5 mb-8">
                                <span className="font-lastica text-[8px] tracking-[4px] text-gold/60 uppercase">Produits boutique</span>
                                <div className="flex-1 h-px bg-gold/8" />
                                <span className="font-lastica text-[7px] tracking-[3px] text-white/20">{data.products.length}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {data.products.map((prod, i) => (
                                    <Link key={prod._id} to={`/boutique/${prod.slug}`}
                                        className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 overflow-hidden transition-colors block"
                                        style={{ transitionDelay: `${i * 0.08}s` }}>
                                        <div className="relative overflow-hidden">
                                            {prod.image
                                                ? <img src={imgSrc(prod.image)} className="w-full h-[180px] object-cover transition-transform duration-700 group-hover:scale-105" alt={prod.name} loading="lazy" />
                                                : <div className="w-full h-[180px] bg-[#161616]" />
                                            }
                                            {prod.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="font-lastica text-[7px] tracking-[2px] text-white/40">Épuisé</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-glacial text-xs text-white uppercase tracking-[2px] group-hover:text-gold transition-colors mb-2">{prod.name}</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-glacial text-sm" style={{ color: '#C9A84C' }}>
                                                    {(prod.price || 0).toLocaleString('fr-FR')} FCFA
                                                </span>
                                                {prod.compare_price > prod.price && (
                                                    <span className="font-glacial text-[10px] text-white/20 line-through">
                                                        {prod.compare_price.toLocaleString('fr-FR')}
                                                    </span>
                                                )}
                                            </div>
                                            {prod.stock > 0 && (
                                                <button
                                                    onClick={e => { e.preventDefault(); addItem(prod, 1); }}
                                                    className="mt-3 w-full py-1.5 font-lastica text-[7px] tracking-[2px] text-center border border-white/10 text-white/30 hover:border-gold/40 hover:text-gold transition-all">
                                                    + PANIER
                                                </button>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {q && total === 0 && (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">Aucun résultat pour « {q} »</p>
                            <p className="font-glacial text-xs text-white/15 mt-3">Essayez d'autres mots-clés</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
