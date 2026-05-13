import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { imgSrc } from '../../utils/imgSrc';

const GOLD = '#C9A84C';
const WA_NUMBER = '22507000000'; // ← remplace par ton numéro CI sans le +

/* ── Galerie d'images ────────────────────────────────────────── */
function ImageGallery({ mainImage, images = [] }) {
    const all = [mainImage, ...images].filter(Boolean);
    const [active, setActive] = useState(0);

    if (all.length === 0) return (
        <div className="w-full aspect-[4/5] flex items-center justify-center" style={{ background: '#0c0c0c' }}>
            <svg className="w-20 h-20 opacity-10" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {/* Image principale */}
            <div className="relative overflow-hidden" style={{ background: '#0c0c0c' }}>
                <img key={active} src={imgSrc(all[active])} alt="Produit"
                     className="w-full aspect-[4/5] object-cover object-top"
                     style={{ animation: 'fadeIn .2s ease' }} />

                {all.length > 1 && (
                    <>
                        <button onClick={() => setActive(a => (a - 1 + all.length) % all.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all"
                            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button onClick={() => setActive(a => (a + 1) % all.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all"
                            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        {/* Compteur */}
                        <div className="absolute bottom-3 right-4 font-lastica text-[8px] tracking-[2px] text-white/70"
                             style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
                            {active + 1} / {all.length}
                        </div>
                    </>
                )}
            </div>

            {/* Miniatures */}
            {all.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {all.map((img, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="flex-shrink-0 w-16 h-20 overflow-hidden transition-all duration-200"
                            style={{ outline: i === active ? `2px solid ${GOLD}` : '2px solid transparent', outlineOffset: '2px', opacity: i === active ? 1 : 0.55 }}>
                            <img src={imgSrc(img)} className="w-full h-full object-cover object-top" alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Page produit ────────────────────────────────────────────── */
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
        setSelectedSize(''); setSelectedColor(''); setQty(1);
        axios.get(`/api/shop/${slug}`)
            .then(r => {
                if (r.data.product) { setProduct(r.data.product); setSimilar(r.data.similar || []); }
                else                { setProduct(r.data); setSimilar([]); }
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

    const shareProduct = () => {
        if (navigator.share) navigator.share({ title: product.name, url: window.location.href });
        else navigator.clipboard.writeText(window.location.href).then(() => alert('Lien copié !'));
    };

    if (loading) return (
        <Layout title="Produit">
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-10 h-px animate-pulse" style={{ background: `${GOLD}60` }} />
            </div>
        </Layout>
    );

    if (!product) return (
        <Layout title="Produit introuvable">
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-5 px-6">
                <svg className="w-14 h-14 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="font-glacial text-white/50 tracking-[3px] uppercase text-sm">Produit introuvable</p>
                <Link to="/boutique" className="font-lastica text-[9px] tracking-[4px] px-6 py-3.5 uppercase"
                      style={{ background: GOLD, color: '#050505' }}>
                    ← Retour boutique
                </Link>
            </div>
        </Layout>
    );

    const discount   = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100) : null;
    const extraImages = Array.isArray(product.images) ? product.images : [];
    const inStock     = product.stock > 0;

    return (
        <Layout title={`${product.name} — MIA DREAMS`}>
            <div className="bg-[#050505] min-h-screen pt-20 pb-12 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-10">
                <div className="max-w-6xl mx-auto">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-10 flex-wrap">
                        <Link to="/"        className="font-lastica text-[8px] tracking-[2px] text-white/40 hover:text-white/70 transition-colors uppercase">Accueil</Link>
                        <span className="text-white/20">/</span>
                        <Link to="/boutique" className="font-lastica text-[8px] tracking-[2px] text-white/40 hover:text-white/70 transition-colors uppercase">Boutique</Link>
                        <span className="text-white/20">/</span>
                        <span className="font-lastica text-[8px] tracking-[2px] uppercase" style={{ color: GOLD }}>{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">

                        {/* ── Galerie ── */}
                        <div className="relative">
                            <ImageGallery mainImage={product.image} images={extraImages} />
                            {discount && (
                                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 font-lastica text-[9px] tracking-[2px] font-bold"
                                     style={{ background: GOLD, color: '#050505' }}>
                                    -{discount}%
                                </div>
                            )}
                        </div>

                        {/* ── Détails ── */}
                        <div className="flex flex-col">

                            {/* Catégorie */}
                            {product.category && (
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-lastica text-[8px] tracking-[4px] uppercase" style={{ color: GOLD }}>
                                        {product.category}
                                    </span>
                                    {/* Bouton partager */}
                                    <button onClick={shareProduct} title="Partager"
                                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-glacial">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                        </svg>
                                        Partager
                                    </button>
                                </div>
                            )}

                            {/* Nom */}
                            <h1 className="font-glacial text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-[2px] sm:tracking-[3px] mb-4 sm:mb-5 leading-tight">
                                {product.name}
                            </h1>

                            {/* Prix */}
                            <div className="flex items-baseline gap-4 mb-5 pb-5 border-b border-white/[0.08]">
                                <span className="font-glacial text-2xl sm:text-3xl font-semibold" style={{ color: GOLD }}>
                                    {product.price.toLocaleString('fr-FR')} <span className="text-lg sm:text-xl">FCFA</span>
                                </span>
                                {product.compare_price > product.price && (
                                    <span className="font-glacial text-base sm:text-lg text-white/35 line-through">
                                        {product.compare_price.toLocaleString('fr-FR')} FCFA
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="font-glacial text-sm text-white/65 leading-relaxed mb-7">
                                    {product.description}
                                </p>
                            )}

                            {/* Tailles */}
                            {product.sizes?.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-lastica text-[8px] tracking-[3px] text-white/50 uppercase mb-3">
                                        Taille
                                        {selectedSize && <span className="ml-2 text-gold">— {selectedSize}</span>}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button key={size} onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
                                                className="min-w-[44px] h-11 px-3 font-glacial text-sm border transition-all duration-200"
                                                style={selectedSize === size
                                                    ? { borderColor: GOLD, color: GOLD, background: `${GOLD}18` }
                                                    : { borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Couleurs */}
                            {product.colors?.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-lastica text-[8px] tracking-[3px] text-white/50 uppercase mb-3">
                                        Couleur
                                        {selectedColor && <span className="ml-2 text-gold">— {selectedColor}</span>}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map(color => (
                                            <button key={color} onClick={() => setSelectedColor(color === selectedColor ? '' : color)}
                                                className="px-4 py-2.5 font-glacial text-sm border transition-all duration-200"
                                                style={selectedColor === color
                                                    ? { borderColor: GOLD, color: GOLD, background: `${GOLD}18` }
                                                    : { borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}>
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantité + Stock */}
                            <div className="flex items-center gap-6 mb-7">
                                <div>
                                    <p className="font-lastica text-[8px] tracking-[3px] text-white/50 uppercase mb-3">Quantité</p>
                                    <div className="flex items-center border border-white/20 w-fit">
                                        <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                            className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors text-lg font-light">
                                            −
                                        </button>
                                        <span className="w-12 text-center font-glacial text-base text-white">{qty}</span>
                                        <button onClick={() => setQty(q => q + 1)}
                                            className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors text-lg font-light">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    {inStock
                                        ? <p className="font-glacial text-sm text-green-400">● En stock <span className="text-green-400/60">({product.stock} dispo.)</span></p>
                                        : <p className="font-glacial text-sm text-red-400">● Rupture de stock</p>
                                    }
                                </div>
                            </div>

                            {/* ── CTAs ── */}
                            <div className="flex flex-col gap-3 mb-8">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Bouton principal */}
                                    <button onClick={handleAdd} disabled={!inStock}
                                        className="flex-1 py-4 font-lastica text-[9px] tracking-[4px] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{ background: added ? '#2a6e35' : GOLD, color: '#050505', fontWeight: 700 }}>
                                        {!inStock ? 'ÉPUISÉ'
                                         : added  ? '✓ AJOUTÉ AU PANIER'
                                                  : '+ AJOUTER AU PANIER'}
                                    </button>
                                    {/* Voir panier */}
                                    <Link to="/panier"
                                        className="flex-1 py-4 font-lastica text-[9px] tracking-[4px] uppercase text-center border transition-all duration-200"
                                        style={{ borderColor: 'rgba(201,168,76,0.5)', color: 'rgba(201,168,76,0.8)' }}>
                                        VOIR LE PANIER →
                                    </Link>
                                </div>
                                {/* Bouton WhatsApp */}
                                <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                                    `Bonjour MIA DREAMS 👋\nJe suis intéressé(e) par : *${product.name}*` +
                                    (selectedSize  ? `\nTaille : ${selectedSize}`  : '') +
                                    (selectedColor ? `\nCouleur : ${selectedColor}` : '') +
                                    `\n${window.location.href}`
                                )}`}
                                   target="_blank" rel="noopener noreferrer"
                                   className="flex items-center justify-center gap-3 py-3.5 font-lastica text-[9px] tracking-[3px] uppercase transition-all hover:brightness-110"
                                   style={{ background: '#25D366', color: '#fff' }}>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    COMMANDER VIA WHATSAPP
                                </a>
                            </div>

                            {/* Infos livraison */}
                            <div className="pt-6 border-t border-white/[0.08] space-y-4">
                                <p className="font-lastica text-[7px] tracking-[4px] text-white/30 uppercase mb-3">Informations</p>
                                {[
                                    { icon: 'M5 13l4 4L19 7', text: 'Livraison à domicile à Abidjan et environs' },
                                    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: 'WhatsApp : +225 07 00 00 00 00' },
                                    { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', text: 'Paiement sécurisé — Wave · Orange Money · Espèces' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 border border-white/[0.08] rounded-full">
                                            <svg className="w-3.5 h-3.5" style={{ color: GOLD }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                                            </svg>
                                        </div>
                                        <p className="font-glacial text-sm text-white/55">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Articles similaires ── */}
                    {similar.length > 0 && (
                        <section className="mt-24 pt-16 border-t border-white/[0.07]">
                            <div className="flex items-center gap-6 mb-12">
                                <div>
                                    <p className="font-lastica text-[7px] tracking-[5px] text-white/30 uppercase mb-1">Vous aimerez aussi</p>
                                    <h2 className="font-glacial text-2xl text-white uppercase tracking-[4px]">Articles <span style={{ color: GOLD }}>similaires</span></h2>
                                </div>
                                <div className="flex-1 h-px bg-white/[0.06]" />
                                <Link to="/boutique"
                                    className="font-lastica text-[8px] tracking-[3px] text-white/40 hover:text-white/70 transition-colors uppercase flex-shrink-0">
                                    Voir tout →
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                {similar.map(p => (
                                    <Link key={p._id} to={`/boutique/${p.slug}`} className="group block">
                                        <div className="overflow-hidden mb-3" style={{ background: '#0d0d0d' }}>
                                            {p.image
                                                ? <img src={imgSrc(p.image)} alt={p.name}
                                                       className="w-full h-[160px] sm:h-[200px] lg:h-[220px] object-cover object-top transition-transform duration-600 group-hover:scale-105"
                                                       loading="lazy" />
                                                : <div className="w-full h-[220px] bg-[#141414] flex items-center justify-center">
                                                      <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                      </svg>
                                                  </div>
                                            }
                                        </div>
                                        <div className="space-y-1">
                                            {p.category && <p className="font-lastica text-[7px] tracking-[2px] uppercase" style={{ color: GOLD }}>{p.category}</p>}
                                            <p className="font-glacial text-sm text-white/80 uppercase tracking-[1px] group-hover:text-white transition-colors leading-snug">
                                                {p.name}
                                            </p>
                                            <p className="font-glacial text-sm font-semibold" style={{ color: GOLD }}>
                                                {p.price.toLocaleString('fr-FR')} FCFA
                                            </p>
                                        </div>
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
