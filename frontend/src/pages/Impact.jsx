import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

export default function Impact() {
    const [data, setData] = useState({ sections: [], initiatives: [] });

    useEffect(() => {
        axios.get('/api/impact').then(res => setData(res.data)).catch(() => {});
    }, []);

    return (
        <Layout title="Notre Impact">
            {/* HERO */}
            <div className="relative h-[45vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image6.jpg')", filter: 'brightness(.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.3) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Ethical Fashion</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOTRE <span className="text-gold">IMPACT</span>
                    </h1>
                </div>
            </div>

            {/* MISSION / VISION */}
            <section className="bg-[#0d0d0d] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px">
                        {[
                            { label: 'Mission', icon: 'M13 10V3L4 14h7v7l9-11h-7z', text: "Diffuser la richesse culturelle africaine à travers une mode éthique, innovante et accessible." },
                            { label: 'Vision', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', text: "Devenir la référence mondiale de la mode africaine contemporaine d'excellence." },
                            { label: 'Valeurs', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', text: "Authenticité, excellence, durabilité, communauté — au cœur de chaque décision." },
                        ].map((item, i) => (
                            <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-10 transition-colors" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                                    </svg>
                                </div>
                                <span className="font-lastica text-[9px] tracking-[4px] text-gold/60 uppercase block mb-3">{item.label}</span>
                                <p className="font-glacial text-sm text-white/50 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS */}
            <div className="gold-strip py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { num: '500+', label: 'Pièces créées' },
                            { num: '100+', label: 'Artisans soutenus' },
                            { num: '4', label: 'Programmes actifs' },
                            { num: '5+', label: 'Années d\'impact' },
                        ].map((s, i) => (
                            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <p className="font-glacial text-3xl lg:text-4xl font-light text-[#080808]">{s.num}</p>
                                <p className="font-lastica text-[7px] tracking-[4px] text-[#080808]/55 uppercase mt-2">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ENGAGEMENTS */}
            <section className="bg-[#080808] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Ce que nous faisons concrètement</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">ENGAGEMENTS</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
                        {[
                            { title: 'Mode Éthique', desc: "Nous sélectionnons des matières premières durables, favorisons des processus de production respectueux de l'environnement." },
                            { title: 'Valorisation Artisanale', desc: "Nous collaborons avec des artisans locaux, préservant les techniques traditionnelles tout en créant de l'emploi." },
                            { title: 'Fashion Program', desc: "Notre programme de formation accompagne la nouvelle génération de créateurs africains vers l'excellence." },
                            { title: 'Personal Branding', desc: "Nous aidons les entrepreneurs africains à développer leur identité visuelle et à affirmer leur leadership." },
                        ].map((e, i) => (
                            <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-10 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <div className="flex items-center gap-4 mb-5">
                                    <span className="font-lastica text-[9px] tracking-[4px] text-gold/40">0{i + 1}</span>
                                    <div className="flex-1 h-px bg-gold/10" />
                                </div>
                                <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-4 group-hover:text-gold transition-colors">{e.title}</h3>
                                <p className="font-glacial text-sm text-white/40 leading-relaxed">{e.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INITIATIVES DB */}
            {data.initiatives.length > 0 && (
                <section className="bg-texture py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-16 reveal">
                            <span className="eyebrow justify-center">Projets en cours</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">INITIATIVES</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {data.initiatives.map((init, i) => (
                                <div key={init._id} className="reveal border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 overflow-hidden transition-colors group" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    {init.youtube_id && (
                                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                            <iframe className="absolute inset-0 w-full h-full"
                                                    src={`https://www.youtube.com/embed/${init.youtube_id}`}
                                                    frameBorder="0" allowFullScreen loading="lazy" title={init.name} />
                                        </div>
                                    )}
                                    {init.image && !init.youtube_id && (
                                        <img src={`/uploads/${init.image}`} className="w-full h-48 object-cover object-top" alt={init.name} loading="lazy" />
                                    )}
                                    <div className="p-7">
                                        <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{init.name}</h3>
                                        {init.description && <p className="font-glacial text-sm text-white/40 leading-relaxed">{init.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-[#080808] py-24 text-center border-t border-gold/8">
                <div className="max-w-xl mx-auto px-6 reveal">
                    <span className="eyebrow justify-center">Rejoignez le mouvement</span>
                    <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-6">MODE <span className="text-gold">RESPONSABLE</span></h2>
                    <p className="font-glacial text-sm text-white/40 leading-loose mb-10">Chaque achat, chaque collaboration est un acte pour une mode plus juste, plus belle et plus africaine.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="/contact" className="btn btn-gold">NOUS REJOINDRE</a>
                        <a href="/reservation" className="btn btn-white">PRENDRE RDV</a>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
