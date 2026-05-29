import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { imgSrc } from '../../utils/imgSrc';

export default function Brand() {
    const { slug } = useParams();
    const [data, setData] = useState({ brand: null, collections: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/brands/${slug}`, { params: { _t: Date.now() } })
            .then(res => { setData(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [slug]);

    if (loading) return <Layout><div className="min-h-screen bg-[#080808] flex items-center justify-center"><div className="w-8 h-px bg-gold animate-pulse" /></div></Layout>;
    if (!data.brand) return <Layout title="Marque introuvable"><div className="min-h-screen bg-[#080808] flex items-center justify-center text-center px-6"><div><p className="font-glacial text-gold text-sm tracking-[4px] uppercase mb-4">Marque introuvable</p><Link to="/" className="btn btn-gold">RETOUR À L'ACCUEIL</Link></div></div></Layout>;

    const { brand, collections } = data;

    return (
        <Layout title={brand.name}>
            {/* HERO */}
            <div className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
                {brand.image
                    ? <img src={imgSrc(brand.image)} className="absolute inset-0 w-full h-full object-cover object-top" style={{ filter: 'brightness(.3)' }} alt={brand.name} />
                    : <div className="absolute inset-0 bg-[#0d0d0d]" />
                }
                {brand.youtube_id && (
                    <div className="absolute inset-0" style={{ paddingBottom: '56.25%' }}>
                        <iframe className="absolute inset-0 w-full h-full object-cover" src={`https://www.youtube.com/embed/${brand.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${brand.youtube_id}&controls=0`} frameBorder="0" allow="autoplay" title={brand.name} />
                    </div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(8,8,8,.9) 0%, rgba(8,8,8,.4) 60%, transparent 100%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 w-full">
                    <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>MIA DREAMS & CO</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {brand.header_title || brand.name}
                    </h1>
                </div>
            </div>

            {/* DESCRIPTION */}
            {brand.description && (
                <section className="bg-[#0d0d0d] py-20">
                    <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center reveal">
                        <p className="font-glacial text-lg text-white/60 leading-relaxed">{brand.description}</p>
                    </div>
                </section>
            )}

            {/* COLLECTIONS */}
            {collections.length > 0 && (
                <section className="bg-[#080808] py-20 lg:py-28">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">

                        {/* Titre section */}
                        <div className="flex items-center gap-6 mb-16 reveal">
                            <div>
                                <span className="font-lastica text-[8px] tracking-[5px] text-gold/40 uppercase block mb-2">Nos créations</span>
                                <h2 className="display-title text-2xl lg:text-3xl text-white">NOS <span className="text-gold">COLLECTIONS</span></h2>
                            </div>
                            <div className="flex-1 h-px bg-gold/10" />
                            <span className="font-lastica text-[8px] tracking-[3px] text-white/15">
                                {collections.length} collection{collections.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-20">
                            {collections.map((col, ci) => (
                                <div key={col._id} className="reveal">

                                    {/* ── En-tête de collection ── */}
                                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 mb-10 overflow-hidden border border-white/[0.06] ${ci % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                                        {/* Image */}
                                        <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
                                            {col.image ? (
                                                <img src={imgSrc(col.image)} alt={col.name}
                                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.04]"
                                                    loading="lazy" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0f0f0f' }}>
                                                    <svg className="w-12 h-12 text-gold/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Numéro flottant */}
                                            <div className="absolute top-5 left-5">
                                                <span className="font-lastica text-[9px] tracking-[4px] text-white/30 bg-black/40 backdrop-blur-sm px-3 py-1.5">
                                                    {String(ci + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Infos */}
                                        <div className="flex flex-col justify-center p-8 lg:p-12" style={{ background: '#0c0c0c' }}>
                                            <span className="font-lastica text-[7px] tracking-[5px] text-gold/50 uppercase mb-4">Collection</span>
                                            <h3 className="font-glacial text-2xl lg:text-3xl text-white uppercase tracking-[3px] leading-tight mb-4">
                                                {col.name}
                                            </h3>
                                            <div className="w-8 h-px mb-5" style={{ background: '#C9A84C' }} />
                                            {col.description && (
                                                <p className="font-glacial text-sm text-white/45 leading-loose mb-6">
                                                    {col.description}
                                                </p>
                                            )}
                                            {col.products?.length > 0 && (
                                                <div className="flex items-center gap-2 mt-auto">
                                                    <div className="w-1 h-1 rounded-full bg-gold/60" />
                                                    <span className="font-lastica text-[8px] tracking-[3px] text-gold/50">
                                                        {col.products.length} pièce{col.products.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ── Grille produits ── */}
                                    {col.products && col.products.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {col.products.map((prod, pi) => (
                                                <div key={prod._id} className="group reveal" style={{ transitionDelay: `${pi * 0.06}s` }}>
                                                    <div className="overflow-hidden mb-3 relative" style={{ background: '#111' }}>
                                                        {prod.image
                                                            ? <img src={imgSrc(prod.image)}
                                                                   className="w-full h-[240px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                                   alt={prod.name} loading="lazy" />
                                                            : <div className="w-full h-[240px] bg-[#141414] flex items-center justify-center">
                                                                  <svg className="w-7 h-7 text-gold/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                                  </svg>
                                                              </div>
                                                        }
                                                        <div className="absolute inset-x-0 bottom-0 h-px bg-gold/0 group-hover:bg-gold/30 transition-colors duration-300" />
                                                    </div>
                                                    <h4 className="font-glacial text-xs text-white/70 uppercase tracking-[1.5px] mb-1 group-hover:text-gold transition-colors duration-300 leading-snug">
                                                        {prod.name}
                                                    </h4>
                                                    {prod.price > 0 && (
                                                        <p className="font-glacial text-sm" style={{ color: '#C9A84C' }}>
                                                            {prod.price.toLocaleString('fr-FR')} <span className="text-xs text-gold/60">FCFA</span>
                                                            {prod.compare_price > prod.price && (
                                                                <span className="ml-2 line-through text-white/20 text-xs">
                                                                    {prod.compare_price.toLocaleString('fr-FR')}
                                                                </span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-white/[0.06] py-10 text-center">
                                            <svg className="w-6 h-6 text-white/10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                            </svg>
                                            <p className="font-lastica text-[7px] tracking-[3px] text-white/15 uppercase">Produits à venir</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="bg-[#080808] py-12 text-center border-t border-gold/8">
                <Link to="/reservation" className="btn btn-gold">RÉSERVER UNE CONSULTATION</Link>
            </div>
        </Layout>
    );
}
