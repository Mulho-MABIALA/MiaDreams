import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { imgSrc } from '../../utils/imgSrc';

const GOLD = '#C9A84C';

function ImageGallery({ mainImage, images = [] }) {
    const allImages = [mainImage, ...images].filter(Boolean);
    const [active, setActive] = useState(0);

    if (allImages.length === 0) return (
        <div className="w-full aspect-[4/5] bg-[#0c0c0c] flex items-center justify-center">
            <svg className="w-20 h-20 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {/* Image principale */}
            <div className="relative overflow-hidden" style={{ background: '#0c0c0c' }}>
                <img
                    key={active}
                    src={imgSrc(allImages[active])}
                    alt="Produit"
                    className="w-full aspect-[4/5] object-cover object-top"
                    style={{ animation: 'fadeIn .25s ease' }}
                />
                {/* Flèches navigation si plusieurs images */}
                {allImages.length > 1 && (
                    <>
                        <button onClick={() => setActive(a => (a - 1 + allImages.length) % allImages.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button onClick={() => setActive(a => (a + 1) % allImages.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        {/* Indicateur */}
                        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                            {allImages.map((_, i) => (
                                <button key={i} onClick={() => setActive(i)}
                                    className="w-1.5 h-1.5 rounded-full transition-all"
                                    style={{ background: i === active ? GOLD : 'rgba(255,255,255,0.4)' }} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Miniatures */}
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="flex-shrink-0 w-16 h-20 overflow-hidden transition-all"
                            style={{ outline: i === active ? `2px solid ${GOLD}` : '2px solid transparent', outlineOffset: '2px' }}>
                            <img src={imgSrc(img)} className="w-full h-full object-cover object-top" alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function BoutiqueProduct() {
    const { slug } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize,  setSelectedSize]  = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [qty,   setQty]   = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setLoading(true);
        setSelectedSize('');
        setSelectedColor('');
        setQty(1);
        axios.get(`/api/shop/${slug}`)
            .then(r => {
                // L'API retourne maintenant { product, similar }
                if (r.data.product) {
                    setProduct(r.data.product);
                    setSimilar(r.data.similar || []);
                } else {
                    // Rétrocompat : si l'API retourne directement le produit
                    setProduct(r.data);
                    setSimilar([]);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    const handleAdd = () => {
        if (!product) return;
        addItem(product, qty, selectedSize, selectedColor);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const shareLink = () => {
        if (navigator.share) {
            navigator.share({ title: product.name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) return (
        <Layout title="Produit">
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-px" style={{ background: `${GOLD}40` }} />
            </div>
        </Layout>
    );

    if (!product) return (
        <Layout title="Produit introuvable">
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
                <p className="font-glacial text-white/40 tracking-[3px]">Produit introuvable</p>
                <Link to="/boutique" className="font-lastica text-[8px] tracking-[3px] px-5 py-2.5" style={{ background: GOLD, color: '#050505' }}>
                    ← RETOUR BOUTIQUE
                </Link>
            </div>
        </Layout>
    );

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100) : null;
    const extraImages = Array.isArray(product.images) ? product.images : [];

    return (
        <Layout title={`${product.name} — MIA DREAMS`}>
            <div className="bg-[#050505] min-h-screen pt-24 pb-20 px-6 lg:px-10">
                <div className="max-w-6xl mx-auto">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-10 font-lastica text-[7px] tracking-[2px] text-white/20 uppercase">
                        <Link to="/" className="hover:text-white/50 transition-colors">Accueil</Link>
                        <span>/</span>
                        <Link to="/boutique" className="hover:text-white/50 transition-colors">Boutique</Link>
                        <span>/</span>
                        <span style={{ color: `${GOLD}80` }}>{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* Galerie d'images */}
                        <div className="relative">
                            <ImageGallery mainImage={product.image} images={extraImages} />
                            {discount && (
                                <div className="absolute top-4 left-4 px-2.5 py-1 font-lastica text-[9px] tracking-[2px] z-10"
                                     style={{ background: GOLD, color: '#050505' }}>
                                    -{discount}%
                                </div>
                            )}
                        </div>

                        {/* Détails */}
                        <div className="flex flex-col">
                            {product.category && (
                                <p className="font-lastica text-[8px] tracking-[4px] mb-3 uppercase" style={{ color: `${GOLD}70` }}>{product.category}</p>
                            )}

                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h1 className="font-glacial text-3xl lg:text-4xl text-white uppercase tracking-[3px] leading-tight">{product.name}</h1>
                                {/* Bouton partager */}
                                <button onClick={shareLink} title="Partager ce produit"
                                    className="flex-shrink-0 w-10 h-10 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors mt-1">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="font-glacial text-2xl font-medium" style={{ color: GOLD }}>
                                    {product.price.toLocaleString('fr-FR')} FCFA
                                </span>
                                {product.compare_price > product.price && (
                                    <span className="font-glacial text-base text-white/25 line-through">
                                        {product.compare_price.toLocaleString('fr-FR')} FCFA
                                    </span>
                                )}
                            </div>

                            <div className="w-12 h-px mb-6" style={{ background: `${GOLD}40` }} />

                            {product.description && (
                                <p className="font-glacial text-sm text-white/50 leading-loose mb-8">{product.description}</p>
                            )}

                            {/* Tailles */}
                            {product.sizes?.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase mb-3">Taille</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button key={size} onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
                                                className="w-11 h-11 font-glacial text-sm border transition-all"
                                                style={selectedSize === size
                                                    ? { borderColor: GOLD, color: GOLD, background: `${GOLD}15` }
                                                    : { borderColor: '#ffffff15', color: 'rgba(255,255,255,0.4)' }}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Couleurs */}
                            {product.colors?.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase mb-3">Couleur</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map(color => (
                                            <button key={color} onClick={() => setSelectedColor(color === selectedColor ? '' : color)}
                                                className="px-4 py-2 font-glacial text-xs border transition-all"
                                                style={selectedColor === color
                                                    ? { borderColor: GOLD, color: GOLD, background: `${GOLD}15` }
                                                    : { borderColor: '#ffffff15', color: 'rgba(255,255,255,0.4)' }}>
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantité */}
                            <div className="mb-6">
                                <p className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase mb-3">Quantité</p>
                                <div className="flex items-center gap-0 w-fit border border-white/10">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors text-lg">−</button>
                                    <span className="w-12 text-center font-glacial text-sm text-white/70">{qty}</span>
                                    <button onClick={() => setQty(q => q + 1)}
                                        className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors text-lg">+</button>
                                </div>
                            </div>

                            {/* Stock */}
                            {product.stock > 0
                                ? <p className="font-glacial text-xs text-green-400/60 mb-6">● En stock ({product.stock} disponibles)</p>
                                : <p className="font-glacial text-xs text-red-400/60 mb-6">● Épuisé</p>
                            }

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <button onClick={handleAdd} disabled={product.stock === 0}
                                    className="flex-1 py-4 font-lastica text-[9px] tracking-[4px] uppercase disabled:opacity-40 transition-all"
                                    style={{ background: added ? '#2d7a3a' : GOLD, color: '#050505' }}>
                                    {added ? '✓ Ajouté au panier' : '+ Ajouter au panier'}
                                </button>
                                <Link to="/panier"
                                    className="flex-1 py-4 font-lastica text-[9px] tracking-[4px] uppercase text-center border transition-all"
                                    style={{ borderColor: `${GOLD}40`, color: `${GOLD}80` }}>
                                    VOIR LE PANIER
                                </Link>
                            </div>

                            {/* Infos livraison */}
                            <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-3">
                                {[
                                    { icon: 'M5 13l4 4L19 7', text: 'Livraison à domicile à Abidjan et environs' },
                                    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: 'WhatsApp : +225 07 00 00 00 00' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: `${GOLD}70` }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                                        </svg>
                                        <p className="font-glacial text-xs text-white/30">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Articles similaires ── */}
                    {similar.length > 0 && (
                        <section className="mt-24 pt-16 border-t border-white/[0.05]">
                            <div className="flex items-center gap-5 mb-10">
                                <div>
                                    <p className="font-lastica text-[7px] tracking-[4px] text-white/20 uppercase mb-1">Vous aimerez aussi</p>
                                    <h2 className="font-glacial text-xl text-white uppercase tracking-[3px]">Articles similaires</h2>
                                </div>
                                <div className="flex-1 h-px bg-white/[0.05]" />
                                <Link to="/boutique" className="font-lastica text-[7px] tracking-[3px] text-white/20 hover:text-white/50 transition-colors uppercase">
                                    Voir tout →
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {similar.map(p => (
                                    <Link key={p._id} to={`/boutique/${p.slug}`} className="group">
                                        <div className="overflow-hidden mb-3" style={{ background: '#0c0c0c' }}>
                                            {p.image
                                                ? <img src={imgSrc(p.image)}
                                                       className="w-full h-[220px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                       alt={p.name} loading="lazy" />
                                                : <div className="w-full h-[220px] bg-[#141414] flex items-center justify-center">
                                                      <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                      </svg>
                                                  </div>
                                            }
                                        </div>
                                        <p className="font-glacial text-xs text-white/60 uppercase tracking-[1px] group-hover:text-gold transition-colors leading-snug mb-1">{p.name}</p>
                                        <p className="font-glacial text-sm" style={{ color: GOLD }}>
                                            {p.price.toLocaleString('fr-FR')} <span className="text-xs text-gold/60">FCFA</span>
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </Layout>
    );
}
