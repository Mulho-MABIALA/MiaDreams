import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { imgSrc } from '../../utils/imgSrc';

export default function MiaDreams() {
    const [data, setData] = useState({ brand: null, collections: [] });

    useEffect(() => {
        axios.get('/api/brands/mia-dreams').then(res => setData(res.data)).catch(() => {});
    }, []);

    return (
        <Layout title="Mia Dreams Brand">
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '80vh' }}>
                <div className="hero-slide active">
                    <img src="/img/index/home-image2.jpg" alt="Mia Dreams" loading="eager" />
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-8 lg:px-24">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Maison de mode</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                MIA DREAMS<br /><span className="text-gold">BRAND</span>
                            </h1>
                            <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mt-5 mb-9" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                Élégance africaine contemporaine — chaque pièce raconte une histoire.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTRO */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe className="absolute inset-0 w-full h-full"
                                        src="https://www.youtube.com/embed/sTfEIkU309s"
                                        frameBorder="0" allowFullScreen loading="lazy" title="Mia Dreams" />
                            </div>
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">La marque</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">ÉLÉGANCE <span className="text-gold">AFRICAINE</span></h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-8">
                                {data.brand?.description || "Mia Dreams Brand est notre ligne de vêtements — une collection qui marie l'artisanat africain traditionnel aux codes de la mode contemporaine."}
                            </p>
                            <Link to="/reservation" className="btn btn-gold">RÉSERVER UNE CONSULTATION</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* COLLECTIONS */}
            {data.collections.length > 0 && (
                <section className="bg-[#080808] py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-16 reveal">
                            <span className="eyebrow justify-center">Nos créations</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">COLLECTIONS</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        {data.collections.map((col, ci) => (
                            <div key={col._id} className="mb-20 last:mb-0">
                                <div className="flex items-center gap-5 mb-10 reveal">
                                    <span className="font-lastica text-[9px] tracking-[4px] text-gold/40">0{ci + 1}</span>
                                    <h3 className="font-glacial text-xl text-white uppercase tracking-[4px]">{col.name}</h3>
                                    <div className="flex-1 h-px bg-gold/10" />
                                </div>
                                {col.products && col.products.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {col.products.map((prod, pi) => (
                                            <div key={prod._id} className="reveal group" style={{ transitionDelay: `${pi * 0.08}s` }}>
                                                <div className="overflow-hidden mb-4">
                                                    {prod.image
                                                        ? <img src={imgSrc(prod.image)} className="w-full h-[320px] object-cover object-top transition-transform duration-700 group-hover:scale-105" alt={prod.name} loading="lazy" />
                                                        : <div className="w-full h-[320px] bg-[#141414] flex items-center justify-center"><svg className="w-8 h-8 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                                                    }
                                                </div>
                                                <h4 className="font-glacial text-sm text-white uppercase tracking-[2px] group-hover:text-gold transition-colors">{prod.name}</h4>
                                                {prod.description && <p className="font-glacial text-xs text-white/30 mt-2 leading-relaxed">{prod.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="gold-strip py-9 text-center">
                <p className="relative z-10 font-glacial text-[#080808] text-sm tracking-[5px] uppercase">Mode africaine d'exception — Made In Africa</p>
            </div>
        </Layout>
    );
}
