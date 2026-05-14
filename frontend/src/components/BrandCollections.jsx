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

                {/* ── Grille portrait des collections ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {collections.map((col, ci) => (
                        <div key={col._id} className="group reveal" style={{ transitionDelay: `${ci * 0.07}s` }}>

                            {/* Image portrait 3:4 */}
                            <div className="relative overflow-hidden" style={{ paddingBottom: '133%', background: '#111' }}>
                                {col.image ? (
                                    <img
                                        src={imgSrc(col.image)}
                                        alt={col.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gold/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Overlay hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                {/* Barre dorée bottom */}
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold/0 group-hover:bg-gold/60 transition-colors duration-300" />
                            </div>

                            {/* Nom uniquement */}
                            <div className="mt-3">
                                <h3 className="font-glacial text-xs text-white/70 uppercase tracking-[2px] leading-snug group-hover:text-gold transition-colors duration-300">
                                    {col.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
