import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { imgSrc } from '../../utils/imgSrc';

const GOLD = '#C9A84C';
const WA_NUMBER = '22507000000'; // ← remplace par ton numéro CI sans le +

const SORT_OPTIONS = [
    { value: 'default',    label: 'Par défaut' },
    { value: 'new',        label: 'Nouveautés' },
    { value: 'price_asc',  label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'promo',      label: 'Promotions' },
];

/* ── Carte produit ─────────────────────────────────────────── */
function ProductCard({ product, index }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    const waMsg = encodeURIComponent(
        `Bonjour MIA DREAMS 👋\nJe suis intéressé(e) par : *${product.name}*\n${window.location.origin}/boutique/${product.slug}`
    );

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : null;

    const isOutOfStock = product.stock === 0;

    return (
        <Link to={`/boutique/${product.slug}`} className="group block"
              style={{ animationDelay: `${index * 0.06}s` }}>

            {/* ── Image ── */}
            <div className="relative overflow-hidden mb-4 bg-[#111]">
                <div className="aspect-[3/4] overflow-hidden">
                    {product.image
                        ? <img src={imgSrc(product.image)} alt={product.name}
                               className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                               loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center bg-[#141414]">
                              <svg className="w-10 h-10 opacity-10" fill="none" stroke="white" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                          </div>
                    }
                </div>

                {/* Badge promo */}
                {discount && !isOutOfStock && (
                    <div className="absolute top-3 left-3 font-lastica text-[8px] tracking-[2px] px-2.5 py-1"
                         style={{ background: GOLD, color: '#050505' }}>
                        -{discount}%
                    </div>
                )}

                {/* Épuisé */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-[#080808]/75 flex items-center justify-center">
                        <span className="font-lastica text-[8px] tracking-[5px] text-white/60 uppercase">Épuisé</span>
                    </div>
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-[#080808]/0 group-hover:bg-[#080808]/20 transition-colors duration-400" />

                {/* Actions */}
                {!isOutOfStock && (
                    <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 flex h-11">
                        <button onClick={handleAdd}
                            className="flex-1 font-lastica text-[8px] tracking-[3px] uppercase transition-colors duration-200"
                            style={{ background: added ? '#2a6e35' : GOLD, color: '#050505' }}>
                            {added ? '✓ Ajouté' : '+ Panier'}
                        </button>
                        <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                           target="_blank" rel="noopener noreferrer"
                           onClick={e => e.stopPropagation()}
                           className="w-11 flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-90"
                           style={{ background: '#25D366' }}
                           title="Commander via WhatsApp">
                            <svg className="w-[18px] h-[18px]" fill="white" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </a>
                    </div>
                )}
            </div>

            {/* ── Infos ── */}
            <div>
                {product.category && (
                    <p className="font-lastica text-[7px] tracking-[3px] uppercase mb-1" style={{ color: `${GOLD}99` }}>
                        {product.category}
                    </p>
                )}
                <h3 className="font-glacial text-[13px] text-white/80 uppercase tracking-[1px] leading-snug mb-2 group-hover:text-gold transition-colors duration-200">
                    {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                    <span className="font-glacial text-[13px] font-semibold" style={{ color: GOLD }}>
                        {product.price.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span>
                    </span>
                    {product.compare_price > product.price && (
                        <span className="font-glacial text-[11px] text-white/25 line-through">
                            {product.compare_price.toLocaleString('fr-FR')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

/* ── Page principale ───────────────────────────────────────── */
export default function BoutiqueIndex() {
    const [products,   setProducts]   = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get('categorie') || '';
    const [search, setSearch] = useState('');
    const [sort,   setSort]   = useState('default');
    const [sortOpen, setSortOpen] = useState(false);

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
        setSearch(''); setSort('default');
        cat ? setSearchParams({ categorie: cat }) : setSearchParams({});
    };

    const displayed = useMemo(() => {
        let list = [...products];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q)
            );
        }
        switch (sort) {
            case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
            case 'price_desc': list.sort((a, b) => b.price - a.price); break;
            case 'promo':      list = list.filter(p => p.compare_price > p.price); break;
            case 'new':        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            default: break;
        }
        return list;
    }, [products, search, sort]);

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label;

    return (
        <Layout title="Boutique — MIA DREAMS">

            {/* ── Hero minimal ── */}
            <div className="relative flex items-end bg-[#080808]" style={{ height: '50vh', minHeight: 320 }}>
                <img src="/img/index/home-image2.jpg" alt="Boutique"
                     className="absolute inset-0 w-full h-full object-cover object-top"
                     style={{ filter: 'brightness(.18) saturate(.8)' }} />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top, #080808 0%, transparent 60%)' }} />
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-14">
                    <span className="font-lastica text-[7px] tracking-[7px] uppercase block mb-3"
                          style={{ color: `${GOLD}80` }}>Mode africaine d'excellence</span>
                    <h1 className="font-glacial text-white uppercase leading-none"
                        style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '.06em' }}>
                        NOTRE <span style={{ color: GOLD }}>BOUTIQUE</span>
                    </h1>
                </div>
            </div>

            {/* ── Barre outils ── */}
            <div className="bg-[#080808] sticky top-[72px] z-40 border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex items-center gap-6 h-16">

                        {/* Recherche */}
                        <div className="relative flex-1 max-w-xs">
                            <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                                 style={{ color: 'rgba(255,255,255,.22)' }}
                                 fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                   placeholder="Rechercher…"
                                   className="w-full pl-6 pr-7 py-0 h-full bg-transparent text-white/60 font-glacial text-xs tracking-[1px] outline-none placeholder:text-white/20 border-b border-transparent focus:border-white/15 transition-colors" />
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 text-sm transition-colors">✕</button>
                            )}
                        </div>

                        {/* Séparateur */}
                        <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />

                        {/* Catégories */}
                        {categories.length > 0 && (
                            <div className="hidden sm:flex items-center gap-1 overflow-x-auto">
                                {[{ label: 'Tout', value: '' }, ...categories.map(c => ({ label: c, value: c }))].map(c => (
                                    <button key={c.value} onClick={() => setCategory(c.value)}
                                        className="font-lastica text-[7px] tracking-[2.5px] uppercase whitespace-nowrap px-3.5 py-1.5 rounded-sm transition-all duration-200"
                                        style={activeCategory === c.value
                                            ? { background: GOLD, color: '#050505' }
                                            : { color: 'rgba(255,255,255,.38)', background: 'transparent' }}>
                                        {c.label}
                                        {c.value === '' && products.length > 0 && (
                                            <span className="ml-1.5 opacity-50">({products.length})</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Tri dropdown */}
                        <div className="relative flex-shrink-0">
                            <button onClick={() => setSortOpen(o => !o)}
                                className="flex items-center gap-2 font-lastica text-[7px] tracking-[2px] uppercase text-white/40 hover:text-white/70 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" d="M3 6h18M7 12h10M11 18h2"/>
                                </svg>
                                {currentSortLabel}
                                <svg className={`w-2.5 h-2.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                                     fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M6 9l6 6 6-6"/>
                                </svg>
                            </button>
                            {sortOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                                    <div className="absolute right-0 top-full mt-3 bg-[#0f0f0f] border border-white/[0.08] z-20 min-w-[180px] py-1"
                                         style={{ boxShadow: '0 20px 40px rgba(0,0,0,.5)' }}>
                                        {SORT_OPTIONS.map(opt => (
                                            <button key={opt.value}
                                                onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                                className="w-full text-left px-5 py-3 font-glacial text-xs tracking-[1px] transition-colors"
                                                style={sort === opt.value
                                                    ? { color: GOLD }
                                                    : { color: 'rgba(255,255,255,.45)' }}
                                                onMouseEnter={e => { if (sort !== opt.value) e.target.style.color = 'rgba(255,255,255,.75)'; }}
                                                onMouseLeave={e => { if (sort !== opt.value) e.target.style.color = 'rgba(255,255,255,.45)'; }}>
                                                {sort === opt.value && <span className="mr-2" style={{ color: GOLD }}>—</span>}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Compteur résultats */}
                        {!loading && (search || sort !== 'default') && (
                            <span className="font-lastica text-[7px] tracking-[2px] text-white/20 hidden sm:block">
                                {displayed.length} rés.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Catégories mobile ── */}
            {categories.length > 0 && (
                <div className="bg-[#080808] sm:hidden border-b border-white/[0.06] overflow-x-auto">
                    <div className="flex items-center gap-1 px-6 py-3 w-max">
                        {[{ label: 'Tout', value: '' }, ...categories.map(c => ({ label: c, value: c }))].map(c => (
                            <button key={c.value} onClick={() => setCategory(c.value)}
                                className="font-lastica text-[7px] tracking-[2px] uppercase whitespace-nowrap px-3.5 py-1.5 rounded-sm transition-all"
                                style={activeCategory === c.value
                                    ? { background: GOLD, color: '#050505' }
                                    : { color: 'rgba(255,255,255,.38)' }}>
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Contenu ── */}
            <div className="bg-[#080808] min-h-screen">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">

                    {loading ? (
                        /* Skeleton */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[3/4] bg-white/[0.04] mb-4" />
                                    <div className="h-2 bg-white/[0.04] rounded mb-2 w-1/3" />
                                    <div className="h-3 bg-white/[0.06] rounded mb-2 w-3/4" />
                                    <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                                </div>
                            ))}
                        </div>

                    ) : displayed.length === 0 ? (
                        /* Vide */
                        <div className="text-center py-36">
                            <div className="w-8 h-px mx-auto mb-8" style={{ background: `${GOLD}40` }} />
                            <p className="font-glacial text-2xl text-white/20 uppercase tracking-[6px] mb-4">
                                {search ? `"${search}"` : activeCategory || 'Boutique'}
                            </p>
                            <p className="font-glacial text-sm text-white/25 mb-8">
                                {search ? 'Aucun article correspondant.' : 'Aucun article disponible.'}
                            </p>
                            {(search || activeCategory) && (
                                <button onClick={() => { setSearch(''); setCategory(''); }}
                                    className="font-lastica text-[8px] tracking-[3px] uppercase border border-white/10 text-white/35 px-6 py-3 hover:border-white/20 transition-all">
                                    Voir tout
                                </button>
                            )}
                        </div>

                    ) : (
                        /* Grille */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                            {displayed.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
