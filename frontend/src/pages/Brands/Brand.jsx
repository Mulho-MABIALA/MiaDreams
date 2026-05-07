import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function Brand() {
    const { slug } = useParams();
    const [data, setData] = useState({ brand: null, collections: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/brands/${slug}`)
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
                    ? <img src={`/uploads/${brand.image}`} className="absolute inset-0 w-full h-full object-cover object-top" style={{ filter: 'brightness(.3)' }} alt={brand.name} />
                    : <div className="absolute inset-0 bg-[#0d0d0d]" />
                }
                {brand.youtube_id && (
                    <div className="absolute inset-0" style={{ paddingBottom: '56.25%' }}>
                        <iframe className="absolute inset-0 w-full h-full object-cover" src={`https://www.youtube.com/embed/${brand.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${brand.youtube_id}&controls=0`} frameBorder="0" allow="autoplay" title={brand.name} />
                    </div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(8,8,8,.9) 0%, rgba(8,8,8,.4) 60%, transparent 100%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-24 w-full">
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
                <section className="bg-[#080808] py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-16 reveal">
                            <span className="eyebrow justify-center">Nos créations</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">COLLECTIONS</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        {collections.map((col, ci) => {
                            const colImg = col.image
                                ? (col.image.startsWith('/') ? col.image : `/uploads/${col.image}`)
                                : null;
                            return (
                            <div key={col._id} className="mb-32 last:mb-0">

                                {/* ── Bannière collection ── */}
                                {colImg ? (
                                    <div className="relative overflow-hidden mb-12 reveal" style={{ height: 420 }}>
                                        <img src={colImg} alt={col.name}
                                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                                            loading="lazy" />
                                        {/* Dégradé sombre sur le bas */}
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,.95) 0%, rgba(8,8,8,.4) 50%, rgba(8,8,8,.1) 100%)' }} />
                                        {/* Infos en overlay */}
                                        <div className="absolute bottom-0 inset-x-0 p-8 lg:p-12">
                                            <div className="flex items-end gap-6">
                                                <div className="flex-1">
                                                    <span className="font-lastica text-[8px] tracking-[5px] text-gold/50 block mb-2">COLLECTION {String(ci + 1).padStart(2, '0')}</span>
                                                    <h3 className="font-glacial text-3xl lg:text-4xl text-white uppercase tracking-[3px] mb-3">{col.name}</h3>
                                                    {col.description && (
                                                        <p className="font-glacial text-sm text-white/55 leading-relaxed max-w-xl">{col.description}</p>
                                                    )}
                                                </div>
                                                {col.products?.length > 0 && (
                                                    <span className="font-lastica text-[7px] tracking-[3px] text-gold/40 flex-shrink-0">
                                                        {col.products.length} pièce{col.products.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Trait doré en haut */}
                                        <div className="absolute top-0 inset-x-0 h-px bg-gold/20" />
                                    </div>
                                ) : (
                                    /* Sans image : header simple */
                                    <div className="border-l-2 border-gold/30 pl-6 mb-10 reveal">
                                        <span className="font-lastica text-[8px] tracking-[5px] text-gold/40 block mb-1">COLLECTION {String(ci + 1).padStart(2, '0')}</span>
                                        <h3 className="font-glacial text-2xl text-white uppercase tracking-[3px]">{col.name}</h3>
                                        {col.description && (
                                            <p className="font-glacial text-sm text-white/45 mt-3 leading-relaxed max-w-2xl">{col.description}</p>
                                        )}
                                    </div>
                                )}

                                {/* ── Grille produits ── */}
                                {col.products && col.products.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {col.products.map((prod, pi) => (
                                            <div key={prod._id} className="reveal group" style={{ transitionDelay: `${pi * 0.08}s` }}>
                                                <div className="overflow-hidden mb-4 relative" style={{ background: '#111' }}>
                                                    {prod.image
                                                        ? <img src={`/uploads/${prod.image}`}
                                                               className="w-full h-[320px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                               alt={prod.name} loading="lazy" />
                                                        : <div className="w-full h-[320px] bg-[#141414] flex items-center justify-center">
                                                              <svg className="w-8 h-8 text-gold/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                              </svg>
                                                          </div>
                                                    }
                                                    <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-400" />
                                                    <div className="absolute bottom-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/20 transition-colors duration-400" />
                                                </div>
                                                <h4 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-1 group-hover:text-gold transition-colors duration-300">{prod.name}</h4>
                                                {prod.price > 0 && (
                                                    <p className="font-glacial text-sm font-light" style={{ color: '#C9A84C' }}>
                                                        {prod.price.toLocaleString('fr-FR')} FCFA
                                                        {prod.compare_price > prod.price && (
                                                            <span className="ml-2 line-through text-white/20 text-xs">{prod.compare_price.toLocaleString('fr-FR')}</span>
                                                        )}
                                                    </p>
                                                )}
                                                {prod.description && (
                                                    <p className="font-glacial text-xs text-white/30 mt-1.5 leading-relaxed line-clamp-2">{prod.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-white/[0.05] py-12 text-center">
                                        <p className="font-lastica text-[7px] tracking-[3px] text-white/15 uppercase">Produits à venir</p>
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <div className="bg-[#080808] py-12 text-center border-t border-gold/8">
                <Link to="/reservation" className="btn btn-gold">RÉSERVER UNE CONSULTATION</Link>
            </div>
        </Layout>
    );
}
