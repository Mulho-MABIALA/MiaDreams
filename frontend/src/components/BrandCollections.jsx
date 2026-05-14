/**
 * Affiche les collections d'une marque (+ leurs produits) récupérées via l'API.
 * Usage : <BrandCollections brandSlug="fashion-program" />
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { imgSrc } from '../utils/imgSrc';

export default function BrandCollections({ brandSlug }) {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios.get(`/api/brands/${brandSlug}`)
            .then(res => setCollections(res.data.collections || []))
            .catch(() => {});
    }, [brandSlug]);

    if (collections.length === 0) return null;

    return (
        <section className="bg-[#080808] py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">

                {/* Titre */}
                <div className="flex items-center gap-4 sm:gap-6 mb-10 sm:mb-16 reveal">
                    <div>
                        <span className="font-lastica text-[8px] tracking-[5px] text-gold/40 uppercase block mb-2">
                            Nos créations
                        </span>
                        <h2 className="display-title text-2xl lg:text-3xl text-white">
                            NOS <span className="text-gold">COLLECTIONS</span>
                        </h2>
                    </div>
                    <div className="flex-1 h-px bg-gold/10" />
                    <span className="font-lastica text-[8px] tracking-[3px] text-white/15">
                        {collections.length} collection{collections.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-16">
                    {collections.map((col, ci) => (
                        <div key={col._id} className="reveal">

                            {/* ── Nom de la collection (discret) ── */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-4 h-px" style={{ background: '#C9A84C' }} />
                                <span className="font-lastica text-[8px] tracking-[4px] text-gold/50 uppercase">
                                    {col.name}
                                </span>
                                <div className="flex-1 h-px bg-white/[0.05]" />
                                {col.products?.length > 0 && (
                                    <span className="font-lastica text-[7px] tracking-[2px] text-white/15">
                                        {col.products.length} pièce{col.products.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {/* ── Grille produits portrait ── */}
                            {col.products && col.products.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                                    {col.products.map((prod, pi) => (
                                        <div key={prod._id} className="group reveal" style={{ transitionDelay: `${pi * 0.06}s` }}>
                                            {/* Image portrait 3:4 */}
                                            <div className="relative overflow-hidden mb-3" style={{ background: '#111', paddingBottom: '133%' }}>
                                                {prod.image ? (
                                                    <img src={imgSrc(prod.image)}
                                                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                        alt={prod.name} loading="lazy" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
                                                        <svg className="w-7 h-7 text-gold/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
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
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
