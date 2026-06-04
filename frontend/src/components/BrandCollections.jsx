/**
 * Affiche les collections d'une marque (+ leurs produits) récupérées via l'API.
 * Usage : <BrandCollections brandSlug="fashion-program" />
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { imgSrc } from '../utils/imgSrc';
import { useApp } from '../context/AppContext';

export default function BrandCollections({ brandSlug }) {
    const [collections, setCollections] = useState([]);
    const [brand,       setBrand]       = useState(null);
    const { companyInfo } = useApp();
    const waNumber = (companyInfo?.whatsapp || companyInfo?.phone || '22507000000').replace(/\D/g, '');

    useEffect(() => {
        axios.get(`/api/brands/${brandSlug}`)
            .then(res => {
                setCollections(res.data.collections || []);
                setBrand(res.data.brand || null);
            })
            .catch(() => {});
    }, [brandSlug]);

    if (collections.length === 0) return null;

    const boutiqueUrl = brand ? `/boutique?marque=${brand._id}` : '/boutique';

    const waMsg = (product) => encodeURIComponent(
        `Bonjour MIA DREAMS 👋\nJe suis intéressé(e) par : *${product.name}*\nPourriez-vous me donner plus d'informations ?`
    );

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
                    <span className="font-lastica text-[8px] tracking-[3px] text-white/45">
                        {collections.length} collection{collections.length > 1 ? 's' : ''}
                    </span>
                </div>

                {/* ── Collections avec leurs produits ── */}
                {collections.map((col) => (
                    <div key={col._id} className="mb-16">
                        {/* Titre de la collection */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-lastica text-[9px] tracking-[4px] text-gold/60 uppercase">{col.name}</span>
                            <div className="flex-1 h-px bg-white/[0.06]" />
                        </div>

                        {/* Grille produits */}
                        {col.products && col.products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {col.products.map((prod, pi) => {
                                    const inBoutique = prod.is_active !== false && prod.slug;
                                    return (
                                        <div key={prod._id} className="group reveal" style={{ transitionDelay: `${pi * 0.06}s` }}>
                                            {/* Image */}
                                            <div className="relative overflow-hidden mb-3" style={{ paddingBottom: '133%', background: '#111' }}>
                                                {prod.image ? (
                                                    <img src={imgSrc(prod.image)} alt={prod.name}
                                                         className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                         loading="lazy" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gold/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                        </svg>
                                                    </div>
                                                )}

                                                {/* Badge disponibilité */}
                                                {!inBoutique && (
                                                    <div className="absolute top-2 left-2 font-lastica text-[7px] tracking-[2px] px-2 py-1 bg-black/70 text-white/60 uppercase">
                                                        Sur commande
                                                    </div>
                                                )}

                                                {/* Overlay bouton au hover */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-400 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                                                    {inBoutique ? (
                                                        <Link to={`/boutique/${prod.slug}`}
                                                            className="font-lastica text-[8px] tracking-[3px] uppercase px-5 py-2.5 transition-all duration-200 flex items-center gap-2"
                                                            style={{ background: '#C9A84C', color: '#080808' }}>
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                                            </svg>
                                                            VOIR EN BOUTIQUE
                                                        </Link>
                                                    ) : (
                                                        <a href={`https://wa.me/${waNumber}?text=${waMsg(prod)}`}
                                                           target="_blank" rel="noopener noreferrer"
                                                           className="font-lastica text-[8px] tracking-[2px] uppercase px-5 py-2.5 transition-all duration-200 flex items-center gap-2"
                                                           style={{ background: '#25D366', color: '#fff' }}>
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                            </svg>
                                                            COMMANDER WA
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold/0 group-hover:bg-gold/50 transition-colors duration-300" />
                                            </div>

                                            {/* Infos produit */}
                                            <h4 className="font-glacial text-sm text-white/75 uppercase tracking-[1.5px] leading-snug group-hover:text-gold transition-colors duration-200 mb-1">
                                                {prod.name}
                                            </h4>
                                            {prod.price > 0 && (
                                                <p className="font-glacial text-sm text-gold">
                                                    {prod.price.toLocaleString('fr-FR')} <span className="text-[11px] text-gold/70">FCFA</span>
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="font-lastica text-[9px] tracking-[3px] text-white/30 uppercase">Produits à venir</p>
                        )}
                    </div>
                ))}

                {/* ── CTA bas de section ── */}
                <div className="mt-16 lg:mt-20 text-center reveal">
                    <div className="gold-line-center mb-8" />
                    <p className="font-glacial text-sm text-white/65 tracking-[1px] mb-6">
                        Découvrez tous les articles disponibles à la commande
                    </p>
                    <Link to={boutiqueUrl}
                        className="inline-flex items-center gap-3 font-lastica text-[9px] tracking-[4px] uppercase px-8 py-4 border border-gold/40 text-gold hover:bg-gold hover:text-[#080808] transition-all duration-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        VOIR LES ARTICLES DE CETTE MARQUE
                    </Link>
                </div>

            </div>
        </section>
    );
}
