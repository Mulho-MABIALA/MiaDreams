import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';

const GOLD = '#C9A84C';

function ProductCard({ product }) {
    const { addItem, count } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : null;

    return (
        <Link to={`/boutique/${product.slug}`} className="group block">
            <div className="relative overflow-hidden mb-4" style={{ background: '#111' }}>
                <div className="aspect-[3/4] overflow-hidden">
                    {product.image
                        ? <img src={`/uploads/${product.image}`} alt={product.name}
                               className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-12 h-12 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          </div>
                    }
                </div>

                {discount && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-lastica tracking-[2px]"
                         style={{ background: GOLD, color: '#050505' }}>
                        -{discount}%
                    </div>
                )}

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="font-lastica text-[9px] tracking-[3px] text-white/50 uppercase">Épuisé</span>
                    </div>
                )}

                <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="absolute bottom-0 inset-x-0 py-3 font-lastica text-[8px] tracking-[3px] uppercase transition-all duration-300 translate-y-full group-hover:translate-y-0 disabled:hidden"
                    style={{ background: added ? '#2d7a3a' : GOLD, color: '#050505' }}>
                    {added ? '✓ Ajouté' : '+ Ajouter au panier'}
                </button>
            </div>

            <div>
                {product.category && (
                    <p className="font-lastica text-[7px] tracking-[3px] mb-1.5" style={{ color: `${GOLD}80` }}>{product.category}</p>
                )}
                <h3 className="font-glacial text-sm text-white/80 uppercase tracking-[1px] mb-2 group-hover:text-white transition-colors">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="font-glacial text-sm font-medium" style={{ color: GOLD }}>
                        {product.price.toLocaleString('fr-FR')} FCFA
                    </span>
                    {product.compare_price > product.price && (
                        <span className="font-glacial text-xs text-white/25 line-through">
                            {product.compare_price.toLocaleString('fr-FR')} FCFA
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function BoutiqueIndex() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('categorie') || '';

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
        if (cat) setSearchParams({ categorie: cat });
        else setSearchParams({});
    };

    return (
        <Layout title="Boutique — MIA DREAMS">
            {/* Hero */}
            <div className="relative h-[35vh] min-h-[260px] flex items-center justify-center overflow-hidden" style={{ background: '#080808' }}>
                <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')" }} />
                <div className="relative z-10 text-center px-6">
                    <span className="font-lastica text-[8px] tracking-[6px] uppercase block mb-3" style={{ color: `${GOLD}80` }}>Collection</span>
                    <h1 className="font-glacial text-white uppercase tracking-[8px]" style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                        NOTRE <span style={{ color: GOLD }}>BOUTIQUE</span>
                    </h1>
                </div>
            </div>

            <div className="bg-[#050505] min-h-screen py-16 px-6 lg:px-10">
                <div className="max-w-7xl mx-auto">

                    {/* Filtres catégories */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-12">
                            <button onClick={() => setCategory('')}
                                className="font-lastica text-[7px] tracking-[3px] px-4 py-2 border transition-colors uppercase"
                                style={!activeCategory ? { background: GOLD, color: '#050505', borderColor: GOLD } : { borderColor: '#ffffff15', color: 'rgba(255,255,255,0.3)' }}>
                                Tout
                            </button>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setCategory(cat)}
                                    className="font-lastica text-[7px] tracking-[3px] px-4 py-2 border transition-colors uppercase"
                                    style={activeCategory === cat ? { background: GOLD, color: '#050505', borderColor: GOLD } : { borderColor: '#ffffff15', color: 'rgba(255,255,255,0.3)' }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-24">
                            <div className="w-8 h-px mx-auto mb-4" style={{ background: `${GOLD}40` }} />
                            <p className="font-glacial text-xs text-white/20 tracking-[3px]">Chargement…</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24 border border-white/5 rounded-sm" style={{ background: '#0c0c0c' }}>
                            <div className="w-8 h-px mx-auto mb-5" style={{ background: `${GOLD}30` }} />
                            <h2 className="font-glacial text-xl text-white/40 uppercase tracking-[4px] mb-3">Boutique bientôt disponible</h2>
                            <p className="font-glacial text-sm text-white/20">Les produits seront ajoutés depuis l'espace d'administration.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                            {products.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
