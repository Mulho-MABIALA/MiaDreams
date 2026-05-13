import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { imgSrc } from '../../utils/imgSrc';

const GOLD = '#C9A84C';
const WA_NUMBER = '22507000000'; // ← remplace par ton numéro CI sans le +

const SORT_OPTIONS = [
    { value: 'default',    label: 'Défaut' },
    { value: 'price_asc',  label: 'Prix ↑' },
    { value: 'price_desc', label: 'Prix ↓' },
    { value: 'promo',      label: 'Promos' },
    { value: 'new',        label: 'Nouveautés' },
];

function ProductCard({ product }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const waMsg = encodeURIComponent(
        `Bonjour MIA DREAMS 👋\nJe suis intéressé(e) par : *${product.name}*\n${window.location.origin}/boutique/${product.slug}`
    );

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : null;

    return (
        <Link to={`/boutique/${product.slug}`} className="group block">
            {/* Image */}
            <div className="relative overflow-hidden mb-4" style={{ background: '#111' }}>
                <div className="aspect-[3/4] overflow-hidden">
                    {product.image
                        ? <img src={imgSrc(product.image)} alt={product.name}
                               className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-12 h-12 opacity-10" fill="none" stroke="white" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                          </div>
                    }
                </div>

                {discount && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-lastica tracking-[2px] font-bold"
                         style={{ background: GOLD, color: '#050505' }}>
                        -{discount}%
                    </div>
                )}

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="font-lastica text-[9px] tracking-[4px] text-white/80 uppercase border border-white/20 px-4 py-2">Épuisé</span>
                    </div>
                )}

                {/* Actions au survol */}
                <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex">
                    <button onClick={handleAdd} disabled={product.stock === 0}
                        className="flex-1 py-3.5 font-lastica text-[8px] tracking-[3px] uppercase disabled:hidden"
                        style={{ background: added ? '#2a6e35' : GOLD, color: '#050505', fontWeight: 600 }}>
                        {added ? '✓ Ajouté' : '+ Panier'}
                    </button>
                    <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                       target="_blank" rel="noopener noreferrer"
                       onClick={e => e.stopPropagation()}
                       className="w-12 flex items-center justify-center flex-shrink-0"
                       style={{ background: '#25D366' }}
                       title="Commander via WhatsApp">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </a>
                </div>
            </div>

            {/* Infos produit */}
            <div className="space-y-1.5">
                {product.category && (
                    <p className="font-lastica text-[7px] tracking-[3px] uppercase" style={{ color: GOLD }}>
                        {product.category}
                    </p>
                )}
                <h3 className="font-glacial text-sm text-white uppercase tracking-[1px] leading-snug group-hover:text-gold transition-colors duration-200">
                    {product.name}
                </h3>
                <div className="flex items-baseline gap-2.5">
                    <span className="font-glacial text-sm font-semibold" style={{ color: GOLD }}>
                        {product.price.toLocaleString('fr-FR')} FCFA
                    </span>
                    {product.compare_price > product.price && (
                        <span className="font-glacial text-xs text-white/40 line-through">
                            {product.compare_price.toLocaleString('fr-FR')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function BoutiqueIndex() {
    const [products,   setProducts]   = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get('categorie') || '';
    const [search, setSearch] = useState('');
    const [sort,   setSort]   = useState('default');

    useEffect(() => {
        axios.get('/api/shop/categories').then(r => setCategories(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (activeCategory) params.category = activeCategory;
        axios.get('/api/shop', { params })
            .then(r => setProducts(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const setCategory = (cat) => {
        setSearch('');
        setSort('default');
        if (cat) setSearchParams({ categorie: cat });
        else     setSearchParams({});
    };

    // Filtrage + tri côté client
    const displayed = useMemo(() => {
        let list = [...products];

        // Recherche
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q)
            );
        }

        // Tri
        switch (sort) {
            case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
            case 'price_desc': list.sort((a, b) => b.price - a.price); break;
            case 'promo':      list = list.filter(p => p.compare_price > p.price); break;
            case 'new':        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            default: break;
        }

        return list;
    }, [products, search, sort]);

    return (
        <Layout title="Boutique — MIA DREAMS">

            {/* Hero */}
            <div className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
                <img src="/img/index/home-image2.jpg" alt="Boutique"
                     className="absolute inset-0 w-full h-full object-cover object-top"
                     style={{ filter: 'brightness(.25)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,.2) 0%, rgba(5,5,5,.8) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="font-lastica text-[8px] tracking-[6px] uppercase block mb-3" style={{ color: GOLD }}>Collection</span>
                    <h1 className="font-glacial text-white uppercase tracking-[8px]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                        NOTRE <span style={{ color: GOLD }}>BOUTIQUE</span>
                    </h1>
                    <p className="font-glacial text-white/50 text-sm tracking-[2px] mt-4">
                        {products.length > 0 ? `${products.length} article${products.length > 1 ? 's' : ''}` : "Mode africaine d'exception"}
                    </p>
                </div>
            </div>

            <div className="bg-[#050505] min-h-screen py-16 px-6 lg:px-10">
                <div className="max-w-7xl mx-auto">

                    {/* ── Recherche + Tri ── */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        {/* Barre de recherche */}
                        <div className="relative flex-1">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                 style={{ color: 'rgba(255,255,255,0.25)' }}
                                 fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Rechercher un article…"
                                className="w-full pl-11 pr-10 py-3 bg-[#0c0c0c] border border-white/[0.07] text-white/70 font-glacial text-sm outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
                            />
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Options de tri */}
                        <div className="flex gap-1.5 flex-wrap">
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.value} onClick={() => setSort(opt.value)}
                                    className="font-lastica text-[7px] tracking-[2px] px-4 py-3 border transition-all uppercase whitespace-nowrap"
                                    style={sort === opt.value
                                        ? { background: GOLD, color: '#050505', borderColor: GOLD }
                                        : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', background: 'transparent' }}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtres catégories */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-10">
                            <button onClick={() => setCategory('')}
                                className="font-lastica text-[7px] tracking-[3px] px-5 py-2.5 border transition-all uppercase"
                                style={!activeCategory
                                    ? { background: GOLD, color: '#050505', borderColor: GOLD }
                                    : { borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', background: 'transparent' }}>
                                Tout ({products.length})
                            </button>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setCategory(cat)}
                                    className="font-lastica text-[7px] tracking-[3px] px-5 py-2.5 border transition-all uppercase"
                                    style={activeCategory === cat
                                        ? { background: GOLD, color: '#050505', borderColor: GOLD }
                                        : { borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', background: 'transparent' }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Résultat recherche */}
                    {(search || sort !== 'default') && !loading && (
                        <p className="font-glacial text-sm text-white/30 mb-6 tracking-[1px]">
                            {displayed.length} article{displayed.length !== 1 ? 's' : ''}
                            {search && <> pour <span style={{ color: GOLD }}>"{search}"</span></>}
                        </p>
                    )}

                    {/* États */}
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="w-8 h-px mx-auto mb-5 animate-pulse" style={{ background: GOLD }} />
                            <p className="font-glacial text-sm text-white/40 tracking-[3px]">Chargement…</p>
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="text-center py-32 border border-white/[0.06]" style={{ background: '#0c0c0c' }}>
                            <svg className="w-12 h-12 text-white/10 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <h2 className="font-glacial text-xl text-white/50 uppercase tracking-[4px] mb-3">
                                {search ? `Aucun résultat pour "${search}"` : activeCategory ? `Aucun article dans "${activeCategory}"` : 'Boutique bientôt disponible'}
                            </h2>
                            <p className="font-glacial text-sm text-white/30 mb-6">
                                {search ? 'Essayez un autre mot-clé.' : activeCategory ? 'Essayez une autre catégorie.' : 'Les produits seront ajoutés prochainement.'}
                            </p>
                            <div className="flex gap-3 justify-center flex-wrap">
                                {search && (
                                    <button onClick={() => setSearch('')}
                                        className="font-lastica text-[8px] tracking-[3px] px-6 py-3 uppercase border border-white/10 text-white/40 hover:border-white/20 transition-all">
                                        Effacer
                                    </button>
                                )}
                                {activeCategory && (
                                    <button onClick={() => setCategory('')}
                                        className="font-lastica text-[8px] tracking-[3px] px-6 py-3 uppercase"
                                        style={{ background: GOLD, color: '#050505' }}>
                                        Voir tout
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                            {displayed.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
