import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function Search({ q = '', posts = [], brands = [], products = [] }) {
    const [query, setQuery] = useState(q);

    const total = posts.length + brands.length + products.length;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/recherche', { q: query }, { preserveState: true });
    };

    return (
        <Layout hideNewsletter>
            <Head title={q ? `Recherche : "${q}"` : 'Recherche'}>
                <meta name="description" content={`Résultats de recherche pour "${q}" sur MIA DREAMS & CO.`} />
            </Head>

            {/* HERO */}
            <div className="bg-[#0d0d0d] pt-[70px] pb-12 border-b border-gold/10">
                <div className="max-w-3xl mx-auto px-6 pt-10">
                    <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-4">
                        Recherche globale
                    </span>
                    <form onSubmit={handleSearch} className="flex items-center gap-3 border-b-2 border-gold/30 pb-3 focus-within:border-gold/60 transition-colors">
                        <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Articles, marques, produits…"
                            className="flex-1 bg-transparent text-white font-glacial text-xl tracking-[2px] outline-none placeholder:text-white/20"
                            autoFocus
                        />
                        <button type="submit"
                                className="font-lastica text-[9px] tracking-[4px] uppercase text-gold border border-gold/40 px-5 py-2 hover:bg-gold hover:text-[#0d0d0d] transition-all duration-200">
                            GO
                        </button>
                    </form>
                    {q && (
                        <p className="font-glacial text-sm text-white/30 mt-4 tracking-[1px]">
                            {total > 0
                                ? `${total} résultat${total > 1 ? 's' : ''} pour « ${q} »`
                                : `Aucun résultat pour « ${q} »`
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-[#0d0d0d] min-h-screen pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16">

                    {!q && (
                        <div className="text-center py-24">
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">
                                Saisissez un terme pour lancer la recherche
                            </p>
                        </div>
                    )}

                    {q && total === 0 && (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/30 tracking-[3px] uppercase mb-4">
                                Aucun résultat pour « {q} »
                            </p>
                            <p className="font-glacial text-xs text-white/20 mb-8">
                                Essayez un autre mot-clé ou explorez nos sections ci-dessous.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {['/blog', '/galerie', '/miaDreams', '/catalogues'].map(href => (
                                    <Link key={href} href={href}
                                          className="font-glacial text-[10px] tracking-[3px] uppercase text-gold border border-gold/30 px-5 py-2 hover:bg-gold hover:text-[#0d0d0d] transition-all duration-200">
                                        {href.replace('/', '').toUpperCase() || 'HOME'}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ARTICLES */}
                    {posts.length > 0 && (
                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-lastica text-[9px] tracking-[4px] text-gold uppercase">Articles de blog</span>
                                <div className="flex-1 h-px bg-gold/10" />
                                <span className="font-glacial text-xs text-white/25">{posts.length} résultat{posts.length > 1 ? 's' : ''}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map(post => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                                        <div className="overflow-hidden mb-3">
                                            <img src={post.cover_image ? `/storage/${post.cover_image}` : '/img/index/home-image7.webp'}
                                                 className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-105"
                                                 style={{ filter: 'brightness(.8)' }} alt={post.title} loading="lazy" />
                                        </div>
                                        {post.category && (
                                            <span className="font-lastica text-[8px] tracking-[3px] text-gold uppercase mb-1 block">{post.category}</span>
                                        )}
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] group-hover:text-gold transition-colors duration-200">
                                            {post.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* MARQUES */}
                    {brands.length > 0 && (
                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-lastica text-[9px] tracking-[4px] text-gold uppercase">Marques</span>
                                <div className="flex-1 h-px bg-gold/10" />
                                <span className="font-glacial text-xs text-white/25">{brands.length} résultat{brands.length > 1 ? 's' : ''}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {brands.map(brand => (
                                    <Link key={brand.id} href={`/marque/${brand.slug}`}
                                          className="group border border-gold/10 hover:border-gold/30 p-6 text-center transition-colors duration-300">
                                        {brand.logo ? (
                                            <img src={`/storage/${brand.logo}`}
                                                 className="h-12 object-contain mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity"
                                                 alt={brand.name} />
                                        ) : (
                                            <div className="w-12 h-12 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                                                <span className="font-lastica text-[10px] text-gold">{brand.name[0]}</span>
                                            </div>
                                        )}
                                        <p className="font-glacial text-[11px] tracking-[2px] text-white/70 uppercase group-hover:text-gold transition-colors">
                                            {brand.name}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* PRODUITS */}
                    {products.length > 0 && (
                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-lastica text-[9px] tracking-[4px] text-gold uppercase">Produits</span>
                                <div className="flex-1 h-px bg-gold/10" />
                                <span className="font-glacial text-xs text-white/25">{products.length} résultat{products.length > 1 ? 's' : ''}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                {products.map(product => (
                                    <div key={product.id} className="group border border-gold/10 hover:border-gold/25 transition-colors duration-300">
                                        {product.image ? (
                                            <img src={`/storage/${product.image}`}
                                                 className="w-full h-[140px] object-cover" style={{ filter: 'brightness(.85)' }}
                                                 alt={product.name} loading="lazy" />
                                        ) : (
                                            <div className="w-full h-[140px] bg-[#1a1a1a] flex items-center justify-center">
                                                <span className="text-white/10 text-2xl">✦</span>
                                            </div>
                                        )}
                                        <div className="p-3">
                                            <p className="font-glacial text-[10px] text-white/60 uppercase tracking-[1px] truncate group-hover:text-gold transition-colors">
                                                {product.name}
                                            </p>
                                            {product.price && (
                                                <p className="font-glacial text-[10px] text-gold mt-1">{product.price} FCFA</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </Layout>
    );
}
