import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { imgSrc } from '../../utils/imgSrc';

const GOLD = '#C9A84C';

function ProductCard({ product }) {
    const { addItem } = useCart();
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

                {/* Badge réduction */}
                {discount && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-lastica tracking-[2px] font-bold"
                         style={{ background: GOLD, color: '#050505' }}>
                        -{discount}%
                    </div>
                )}

                {/* Badge épuisé */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="font-lastica text-[9px] tracking-[4px] text-white/80 uppercase border border-white/20 px-4 py-2">Épuisé</span>
                    </div>
                )}

                {/* Bouton ajout rapide */}
                <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="absolute bottom-0 inset-x-0 py-3.5 font-lastica text-[8px] tracking-[3px] uppercase transition-all duration-300 translate-y-full group-hover:translate-y-0 disabled:hidden"
                    style={{ background: added ? '#2a6e35' : GOLD, color: '#050505', fontWeight: 600 }}>
                    {added ? '✓ Ajouté au panier' : '+ Ajouter au panier'}
                </button>
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
                {/* Indicateur multi-images */}
                {Array.isArray(product.images) && product.images.length > 0 && (
                    <p className="font-glacial text-[10px] text-white/30">+{product.images.length} photo{product.images.length > 1 ? 's' : ''}</p>
                )}
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
        else     setSearchParams({});
    };

    return (
        <Layout title="Boutique — MIA DREAMS">

            {/* Hero */}
            <div className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
                <img src="/img/index/home-image2.jpg" alt="Boutique"
                     className="absolute inset-0 w-full h-full object-cover object-top"
                     style={{ filter: 'brightness(.25)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,.2) 0%, rgba(5,5,5,.8) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="font-lastica text-[8px] tracking-[6px] uppercase block mb-3" style={{ color: GOLD }}>
                        Collection
                    </span>
                    <h1 className="font-glacial text-white uppercase tracking-[8px]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                        NOTRE <span style={{ color: GOLD }}>BOUTIQUE</span>
                    </h1>
                    <p className="font-glacial text-white/50 text-sm tracking-[2px] mt-4">
                        {products.length > 0 ? `${products.length} article${products.length > 1 ? 's' : ''}` : 'Mode africaine d\'exception'}
                    </p>
                </div>
            </div>

            <div className="bg-[#050505] min-h-screen py-16 px-6 lg:px-10">
                <div className="max-w-7xl mx-auto">

                    {/* Filtres catégories */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-12">
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

                    {/* États */}
                    {loading ? (
                        <div className="text-center py-32">
                            <div className="w-8 h-px mx-auto mb-5 animate-pulse" style={{ background: GOLD }} />
                            <p className="font-glacial text-sm text-white/40 tracking-[3px]">Chargement…</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-32 border border-white/[0.06]" style={{ background: '#0c0c0c' }}>
                            <svg className="w-12 h-12 text-white/10 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <h2 className="font-glacial text-xl text-white/50 uppercase tracking-[4px] mb-3">
                                {activeCategory ? `Aucun article dans "${activeCategory}"` : 'Boutique bientôt disponible'}
                            </h2>
                            <p className="font-glacial text-sm text-white/30 mb-6">
                                {activeCategory ? 'Essayez une autre catégorie.' : 'Les produits seront ajoutés prochainement.'}
                            </p>
                            {activeCategory && (
                                <button onClick={() => setCategory('')}
                                    className="font-lastica text-[8px] tracking-[3px] px-6 py-3 uppercase"
                                    style={{ background: GOLD, color: '#050505' }}>
                                    Voir tout
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                            {products.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
