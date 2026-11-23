import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { imgSrc } from '../../utils/imgSrc';
import { useLanguage } from '../../context/LanguageContext';
import { useShopInfo, whatsappLink } from '../../hooks/useShopInfo';
import PaymentLogos from '../../components/PaymentLogos';

const GOLD = '#C9A84C';
const PAGE_SIZE = 12;
const NEW_DAYS = 30;

const SORT_OPTIONS = [
    { value: 'default',    label: 'Pertinence' },
    { value: 'new',        label: 'Nouveautés' },
    { value: 'price_asc',  label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
];

const formatPrice = (n) => `${Number(n || 0).toLocaleString('fr-FR')} FCFA`;
const isPromo = (p) => p.compare_price && p.compare_price > p.price;
const isNew = (p) => p.createdAt && (Date.now() - new Date(p.createdAt).getTime()) < NEW_DAYS * 864e5;
const brandOf = (p) => p.collection?.brand || null;

/* ── Icônes ── */
const WaIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);
const Ico = ({ d, className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);
const ICO_TRUCK  = 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z';
const ICO_SEARCH = 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35';
const ICO_FILTER = 'M4 6h16M7 12h10M10 18h4';

/* ── Carte produit ── */
function ProductCard({ product }) {
    const { t } = useLanguage();
    const { addItem } = useCart();
    const { waNumber } = useShopInfo();
    const [added, setAdded] = useState(false);

    const soldOut = product.stock === 0;
    const needsOptions = (product.sizes?.length || 0) > 0 || (product.colors?.length || 0) > 0;
    const discount = isPromo(product) ? Math.round((1 - product.price / product.compare_price) * 100) : null;
    const hoverImg = product.images?.find(img => img && img !== product.image);
    const brand = brandOf(product);
    const wa = whatsappLink(waNumber,
        `Bonjour MIA DREAMS 👋\nJe suis intéressé(e) par : *${product.name}*\n${window.location.origin}/boutique/${product.slug}`);

    const handleAdd = () => {
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <article className="group flex flex-col">
            <Link to={`/boutique/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-[#111]">
                {product.image ? (
                    <>
                        <img src={imgSrc(product.image)} alt={product.name} loading="lazy"
                             className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 group-hover:scale-[1.03] ${hoverImg ? 'group-hover:opacity-0' : ''}`} />
                        {hoverImg && (
                            <img src={imgSrc(hoverImg)} alt="" loading="lazy" aria-hidden="true"
                                 className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                        <Ico d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-10 h-10" />
                    </div>
                )}

                <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
                    {discount && !soldOut && (
                        <span className="font-glacial font-semibold text-[11px] tracking-[1.5px] px-2 py-1" style={{ background: GOLD, color: '#050505' }}>-{discount}%</span>
                    )}
                    {isNew(product) && !soldOut && (
                        <span className="font-glacial font-semibold text-[11px] tracking-[1.5px] px-2 py-1 bg-white text-[#050505]">NOUVEAU</span>
                    )}
                </div>

                {soldOut && (
                    <div className="absolute inset-0 bg-[#080808]/70 flex items-center justify-center">
                        <span className="font-glacial font-semibold text-[12px] tracking-[1.5px] text-white/85 uppercase border border-white/20 px-3 py-1.5">Épuisé</span>
                    </div>
                )}
            </Link>

            <div className="pt-3 flex flex-col flex-1">
                <p className="font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase mb-1 truncate" style={{ color: GOLD }}>
                    {[brand?.name, product.category].filter(Boolean).join(' · ')}
                </p>
                <Link to={`/boutique/${product.slug}`}
                      className="font-glacial text-sm text-white uppercase tracking-[1px] leading-snug line-clamp-2 hover:text-gold transition-colors">
                    {product.name}
                </Link>
                <div className="flex items-baseline gap-2 mt-1.5 mb-3">
                    <span className="font-glacial text-sm font-semibold" style={{ color: GOLD }}>{formatPrice(product.price)}</span>
                    {isPromo(product) && (
                        <span className="font-glacial text-xs text-white/60 line-through">{Number(product.compare_price).toLocaleString('fr-FR')}</span>
                    )}
                </div>

                <div className="mt-auto flex gap-1.5">
                    {soldOut ? (
                        <Link to={`/boutique/${product.slug}`}
                              className="flex-1 h-10 flex items-center justify-center font-glacial font-semibold text-[11px] tracking-[1.5px] uppercase border border-white/10 text-white/60">
                            Voir l'article
                        </Link>
                    ) : needsOptions ? (
                        <Link to={`/boutique/${product.slug}`}
                              className="flex-1 h-10 flex items-center justify-center font-glacial font-semibold text-[11px] tracking-[1.5px] uppercase border transition-colors hover:bg-[#C9A84C] hover:text-[#050505]"
                              style={{ borderColor: `${GOLD}80`, color: GOLD }}>
                            Choisir
                        </Link>
                    ) : (
                        <button type="button" onClick={handleAdd}
                                className="flex-1 h-10 font-glacial font-semibold text-[11px] tracking-[1.5px] uppercase transition-colors"
                                style={{ background: added ? '#2a6e35' : GOLD, color: added ? '#fff' : '#050505' }}>
                            {added ? '✓ Ajouté' : (
                                <>
                                    <span className="sm:hidden">Ajouter</span>
                                    <span className="hidden sm:inline">{t('boutique_add_cart')}</span>
                                </>
                            )}
                        </button>
                    )}
                    {wa && (
                        <a href={wa} target="_blank" rel="noopener noreferrer" aria-label={`Commander ${product.name} via WhatsApp`}
                           className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-white transition hover:brightness-110"
                           style={{ background: '#25D366' }}>
                            <WaIcon />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ── Bloc de filtre ── */
function FilterGroup({ title, children }) {
    return (
        <div className="py-5 border-b border-white/[0.06]">
            <p className="font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase text-white/70 mb-3">{title}</p>
            {children}
        </div>
    );
}

function OptionList({ options, value, onChange, allLabel }) {
    return (
        <ul className="space-y-0.5">
            {[{ value: '', label: allLabel, count: null }, ...options].map(o => {
                const active = value === o.value;
                return (
                    <li key={o.value || '__all'}>
                        <button type="button" onClick={() => onChange(o.value)}
                                className="w-full flex items-center justify-between py-1.5 font-glacial text-sm text-left transition-colors"
                                style={{ color: active ? GOLD : 'rgba(255,255,255,.85)' }}>
                            <span className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full" style={{ background: active ? GOLD : 'transparent' }} />
                                {o.label}
                            </span>
                            {o.count != null && <span className="text-[11px] text-white/50">{o.count}</span>}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

function Check({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer font-glacial text-sm text-white/85">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
                   className="w-3.5 h-3.5 accent-[#C9A84C]" />
            {label}
        </label>
    );
}

function Filters({ categories, brands, f, set }) {
    const priceInp = 'w-full bg-transparent border border-white/10 px-2.5 py-2 font-glacial text-sm text-white/90 outline-none focus:border-[#C9A84C]/60 placeholder:text-white/45';
    return (
        <div>
            {categories.length > 1 && (
                <FilterGroup title="Catégories">
                    <OptionList options={categories} value={f.category} onChange={v => set.category(v)} allLabel="Toutes" />
                </FilterGroup>
            )}
            {brands.length > 0 && (
                <FilterGroup title="Marques">
                    <OptionList options={brands} value={f.brand} onChange={v => set.brand(v)} allLabel="Toutes" />
                </FilterGroup>
            )}
            <FilterGroup title="Prix (FCFA)">
                <div className="flex items-center gap-2">
                    <input type="number" min="0" inputMode="numeric" placeholder="Min" aria-label="Prix minimum"
                           value={f.minPrice} onChange={e => set.minPrice(e.target.value)} className={priceInp} />
                    <span className="text-white/25">—</span>
                    <input type="number" min="0" inputMode="numeric" placeholder="Max" aria-label="Prix maximum"
                           value={f.maxPrice} onChange={e => set.maxPrice(e.target.value)} className={priceInp} />
                </div>
            </FilterGroup>
            <FilterGroup title="Disponibilité">
                <Check checked={f.inStock} onChange={set.inStock} label="En stock uniquement" />
                <Check checked={f.promo} onChange={set.promo} label="En promotion" />
            </FilterGroup>
        </div>
    );
}

/* ── Page ── */
export default function BoutiqueIndex() {
    const { t } = useLanguage();
    const { delivery, payment, whatsapp, waNumber } = useShopInfo();
    const [products, setProducts] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Marque et catégorie dans l'URL (liens partageables, ex. /boutique?marque=… depuis une page marque)
    const brand    = searchParams.get('marque') || '';
    const category = searchParams.get('categorie') || '';
    const [search,   setSearch]   = useState('');
    const [sort,     setSort]     = useState('default');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStock,  setInStock]  = useState(false);
    const [promo,    setPromo]    = useState(false);
    const [visible,  setVisible]  = useState(PAGE_SIZE);
    const [drawer,   setDrawer]   = useState(false);

    useEffect(() => {
        axios.get('/api/shop')
            .then(r => setProducts(Array.isArray(r.data) ? r.data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        value ? next.set(key, value) : next.delete(key);
        setSearchParams(next, { replace: true });
    };

    const set = {
        category: v => setParam('categorie', v),
        brand:    v => setParam('marque', v),
        minPrice: setMinPrice, maxPrice: setMaxPrice, inStock: setInStock, promo: setPromo,
    };
    const f = { category, brand, minPrice, maxPrice, inStock, promo };

    // Listes de filtres avec nombre d'articles
    const categories = useMemo(() => {
        const m = new Map();
        products.forEach(p => { const c = p.category || 'Autres'; m.set(c, (m.get(c) || 0) + 1); });
        return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'fr')).map(([c, n]) => ({ value: c, label: c, count: n }));
    }, [products]);

    const brands = useMemo(() => {
        const m = new Map();
        products.forEach(p => {
            const b = brandOf(p);
            if (!b?._id) return;
            const cur = m.get(String(b._id)) || { value: String(b._id), label: b.name, count: 0 };
            cur.count += 1;
            m.set(String(b._id), cur);
        });
        return [...m.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr'));
    }, [products]);

    const results = useMemo(() => {
        const q = search.trim().toLowerCase();
        const min = minPrice === '' ? null : Number(minPrice);
        const max = maxPrice === '' ? null : Number(maxPrice);
        const list = products.filter(p => {
            if (category && (p.category || 'Autres') !== category) return false;
            if (brand && String(brandOf(p)?._id || '') !== brand) return false;
            if (q && !(`${p.name} ${p.category || ''} ${brandOf(p)?.name || ''}`.toLowerCase().includes(q))) return false;
            if (min != null && p.price < min) return false;
            if (max != null && p.price > max) return false;
            if (inStock && p.stock === 0) return false;
            if (promo && !isPromo(p)) return false;
            return true;
        });
        switch (sort) {
            case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
            case 'price_desc': list.sort((a, b) => b.price - a.price); break;
            case 'new':        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            default: break; // ordre du serveur : mis en avant d'abord
        }
        return list;
    }, [products, category, brand, search, minPrice, maxPrice, inStock, promo, sort]);

    // Revenir à la première page quand les filtres changent
    useEffect(() => { setVisible(PAGE_SIZE); }, [category, brand, search, minPrice, maxPrice, inStock, promo, sort]);

    // Tiroir mobile : bloque le défilement de la page + fermeture avec Échap
    useEffect(() => {
        if (!drawer) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') setDrawer(false); };
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
    }, [drawer]);

    const chips = [
        category && { key: 'cat', label: category, clear: () => set.category('') },
        brand && { key: 'brand', label: brands.find(b => b.value === brand)?.label || 'Marque', clear: () => set.brand('') },
        search.trim() && { key: 'q', label: `« ${search.trim()} »`, clear: () => setSearch('') },
        minPrice !== '' && { key: 'min', label: `Dès ${Number(minPrice).toLocaleString('fr-FR')} F`, clear: () => setMinPrice('') },
        maxPrice !== '' && { key: 'max', label: `Jusqu'à ${Number(maxPrice).toLocaleString('fr-FR')} F`, clear: () => setMaxPrice('') },
        inStock && { key: 'stock', label: 'En stock', clear: () => setInStock(false) },
        promo && { key: 'promo', label: 'En promotion', clear: () => setPromo(false) },
    ].filter(Boolean);

    const resetAll = () => {
        setSearch(''); setMinPrice(''); setMaxPrice(''); setInStock(false); setPromo(false); setSort('default');
        setSearchParams({}, { replace: true });
    };

    const shown = results.slice(0, visible);

    return (
        <Layout title="Boutique — MIA DREAMS">
            <div className="bg-[#080808] min-h-screen">

                {/* ════ EN-TÊTE ════ */}
                <header className="border-b border-white/[0.06]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-7 sm:pt-10">
                        <nav aria-label="Fil d'Ariane" className="font-glacial text-[11px] tracking-[1px] text-white/60 mb-4">
                            <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
                            <span className="mx-2 text-white/20">/</span>
                            <span className="text-white/85">Boutique</span>
                        </nav>
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h1 className="font-glacial text-3xl sm:text-4xl text-white uppercase tracking-[4px]">Boutique</h1>
                                <p className="font-glacial text-sm text-white/65 mt-2">Mode africaine d'excellence — pièces uniques</p>
                            </div>
                            {!loading && (
                                <p className="font-glacial text-[13px] text-white/60">{products.length} article{products.length > 1 ? 's' : ''}</p>
                            )}
                        </div>
                    </div>
                </header>

                {/* ════ BANDEAU INFOS (réglable dans Admin → Paramètres) ════ */}
                <div className="border-b border-white/[0.06] bg-[#0b0b0b]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3.5 flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-x-10 gap-y-2.5">
                        <p className="flex items-center gap-2.5 font-glacial text-[13px] text-white/80">
                            <span style={{ color: GOLD }}><Ico d={ICO_TRUCK} /></span>{delivery}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-glacial text-[13px] text-white/80">
                            <PaymentLogos height={26} />
                            <span>{payment}</span>
                        </div>
                        {whatsapp && (
                            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-2.5 font-glacial text-[13px] text-white/80 hover:text-white transition-colors">
                                <span className="text-[#25D366]"><WaIcon /></span>Une question ? WhatsApp {whatsapp}
                            </a>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
                    <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-10">

                        {/* ════ FILTRES (bureau) ════ */}
                        <aside className="hidden lg:block lg:sticky lg:top-24 self-start" aria-label="Filtres">
                            <div className="flex items-center justify-between pb-2">
                                <p className="font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase text-white/80">Filtres</p>
                                {chips.length > 0 && (
                                    <button type="button" onClick={resetAll} className="font-glacial text-[11px] text-white/60 hover:text-gold underline underline-offset-2">
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                            <Filters categories={categories} brands={brands} f={f} set={set} />
                        </aside>

                        <section aria-label="Produits">
                            {/* ════ BARRE D'OUTILS ════ */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[180px]">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Ico d={ICO_SEARCH} className="w-3.5 h-3.5" /></span>
                                    <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                                           placeholder={t('boutique_search')} aria-label="Rechercher un produit"
                                           className="w-full bg-[#0f0f0f] border border-white/10 pl-9 pr-3 h-10 font-glacial text-[13px] text-white outline-none focus:border-[#C9A84C]/60 placeholder:text-white/50" />
                                </div>
                                <button type="button" onClick={() => setDrawer(true)}
                                        className="lg:hidden h-10 px-4 flex items-center gap-2 border border-white/10 font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase text-white/90">
                                    <Ico d={ICO_FILTER} className="w-3.5 h-3.5" /> Filtres
                                    {chips.length > 0 && <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: GOLD, color: '#050505' }}>{chips.length}</span>}
                                </button>
                                <label className="flex items-center gap-2 h-10 flex-1 sm:flex-none">
                                    <span className="font-glacial text-[13px] text-white/60 hidden sm:inline">Trier par</span>
                                    <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Trier les produits"
                                            className="h-10 w-full sm:w-auto bg-[#0f0f0f] border border-white/10 px-3 font-glacial text-[13px] text-white outline-none focus:border-[#C9A84C]/60">
                                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </label>
                            </div>

                            {/* Résultats + filtres actifs */}
                            <div className="flex flex-wrap items-center gap-2 mb-6 min-h-[28px]">
                                {!loading && (
                                    <p className="font-glacial text-[13px] text-white/65 mr-1">
                                        {results.length} résultat{results.length > 1 ? 's' : ''}
                                    </p>
                                )}
                                {chips.map(c => (
                                    <button key={c.key} type="button" onClick={c.clear}
                                            className="flex items-center gap-1.5 h-7 px-2.5 border font-glacial text-[11px] transition-colors hover:bg-white/5"
                                            style={{ borderColor: `${GOLD}55`, color: GOLD }}>
                                        {c.label} <span aria-hidden="true">✕</span>
                                    </button>
                                ))}
                                {chips.length > 1 && (
                                    <button type="button" onClick={resetAll} className="font-glacial text-[11px] text-white/60 hover:text-white underline underline-offset-2 ml-1">
                                        Tout effacer
                                    </button>
                                )}
                            </div>

                            {/* ════ GRILLE ════ */}
                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="aspect-[3/4] bg-white/[0.04] mb-3" />
                                            <div className="h-2 bg-white/[0.04] mb-2 w-1/3" />
                                            <div className="h-3 bg-white/[0.06] mb-2 w-3/4" />
                                            <div className="h-3 bg-white/[0.04] mb-3 w-1/2" />
                                            <div className="h-10 bg-white/[0.04]" />
                                        </div>
                                    ))}
                                </div>
                            ) : results.length === 0 ? (
                                <div className="text-center py-24 border border-white/[0.06]">
                                    <p className="font-glacial text-lg text-white/80 uppercase tracking-[3px] mb-3">Aucun article trouvé</p>
                                    <p className="font-glacial text-sm text-white/60 mb-8">
                                        {products.length === 0 ? 'La boutique est en cours de réassort, revenez bientôt.' : 'Essayez d\'élargir votre recherche ou de retirer des filtres.'}
                                    </p>
                                    {chips.length > 0 && (
                                        <button type="button" onClick={resetAll}
                                                className="font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase px-6 py-3"
                                                style={{ background: GOLD, color: '#050505' }}>
                                            Voir tous les articles
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-5">
                                        {shown.map(p => <ProductCard key={p._id} product={p} />)}
                                    </div>
                                    {results.length > shown.length && (
                                        <div className="flex flex-col items-center gap-3 mt-14">
                                            <p className="font-glacial text-[13px] text-white/60">{shown.length} sur {results.length} articles</p>
                                            <div className="w-48 h-px bg-white/10 overflow-hidden">
                                                <div className="h-full" style={{ width: `${(shown.length / results.length) * 100}%`, background: GOLD }} />
                                            </div>
                                            <button type="button" onClick={() => setVisible(v => v + PAGE_SIZE)}
                                                    className="mt-2 font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase px-8 py-3.5 border transition-colors hover:bg-[#C9A84C] hover:text-[#050505]"
                                                    style={{ borderColor: GOLD, color: GOLD }}>
                                                Afficher plus
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* ════ FILTRES (mobile — tiroir) ════ */}
            {drawer && (
                <div className="fixed inset-0 z-[10000] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-[#0c0c0c] flex flex-col">
                        <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.08]">
                            <p className="font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase text-white">Filtres</p>
                            <button type="button" onClick={() => setDrawer(false)} aria-label="Fermer les filtres" className="text-white/80 text-xl leading-none">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5">
                            <Filters categories={categories} brands={brands} f={f} set={set} />
                        </div>
                        <div className="p-4 border-t border-white/[0.08] flex gap-2">
                            <button type="button" onClick={resetAll} className="flex-1 h-11 border border-white/15 font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase text-white/85">
                                Réinitialiser
                            </button>
                            <button type="button" onClick={() => setDrawer(false)} className="flex-[2] h-11 font-glacial font-semibold text-[12px] tracking-[1.5px] uppercase"
                                    style={{ background: GOLD, color: '#050505' }}>
                                Voir {results.length} article{results.length > 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
