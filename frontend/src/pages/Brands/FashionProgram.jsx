import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import BrandCollections from '../../components/BrandCollections';
import { imgSrc } from '../../utils/imgSrc';

export default function FashionProgram() {
    const [brand, setBrand] = useState(null);

    useEffect(() => {
        axios.get('/api/brands/fashion-program').then(res => setBrand(res.data.brand)).catch(() => {});
    }, []);

    const heroImg     = brand?.image        ? imgSrc(brand.image) : '/img/index/home-image4.jpg';
    const heroTitle   = brand?.header_title || 'FASHION';
    const description = brand?.description  || "Notre Fashion Program est un programme de formation complet destiné aux créateurs, stylistes et entrepreneurs de la mode africaine. En quelques semaines, maîtrisez les codes du secteur.";

    return (
        <Layout title={brand?.name || 'Fashion Program'}>
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '80vh' }}>
                <div className="hero-slide active">
                    <img src={heroImg} alt={brand?.name || 'Fashion Program'} loading="eager" />
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Formation</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                {heroTitle.includes('\n')
                                    ? heroTitle.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{i === heroTitle.split('\n').length - 1 ? <span className="text-gold">{line}</span> : line}</span>)
                                    : <>{heroTitle}<br /><span className="text-gold">PROGRAM</span></>
                                }
                            </h1>
                            <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mt-5 mb-9" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                {brand?.tagline || "Notre programme de formation à la mode africaine d'excellence."}
                            </p>
                            <div style={{ opacity: 0, animation: 'fadeUp .7s 1s forwards' }}>
                                <Link to="/reservation" className="btn btn-gold">S'INSCRIRE</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRÉSENTATION */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
                        <div className="reveal img-hover">
                            <img src={heroImg} className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover object-top" alt={brand?.name || 'Fashion Program'} loading="lazy" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">Le programme</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                FORMEZ-VOUS À<br /><span className="text-gold">L'EXCELLENCE</span>
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-6">
                                {description}
                            </p>
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-9">
                                Du design à la commercialisation, en passant par la gestion d'atelier et le marketing digital, notre programme couvre tous les aspects essentiels de l'industrie de la mode.
                            </p>
                            <Link to="/reservation" className="btn btn-gold">DÉCOUVRIR LE PROGRAMME</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULES */}
            <section className="bg-texture py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Curriculum</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">LES <span className="text-gold">MODULES</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
                        {[
                            { num: '01', title: 'Design & Création', desc: "Techniques de design, patronage, coupe et confection de vêtements africains." },
                            { num: '02', title: 'Textile & Matières', desc: "Découverte des tissus africains (wax, kente, bazin), leur histoire et leur utilisation." },
                            { num: '03', title: 'Gestion d\'Atelier', desc: "Organisation de la production, gestion des artisans et contrôle qualité." },
                            { num: '04', title: 'Marketing & Vente', desc: "Stratégies de vente, présence digitale et développement de clientèle." },
                            { num: '05', title: 'Personal Branding', desc: "Construction de votre identité de créateur et positionnement sur le marché." },
                            { num: '06', title: 'Entrepreneuriat', desc: "Business plan, financement, juridique et lancement de votre maison de mode." },
                        ].map((m, i) => (
                            <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-10 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <div className="flex items-start gap-6">
                                    <span className="font-lastica text-[12px] tracking-[4px] text-gold/40 flex-shrink-0 mt-1">{m.num}</span>
                                    <div>
                                        <h3 className="font-glacial text-base text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{m.title}</h3>
                                        <p className="font-glacial text-sm text-white/35 leading-relaxed">{m.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COLLECTIONS DYNAMIQUES */}
            <BrandCollections brandSlug="fashion-program" />

            {/* CTA */}
            <section className="bg-[#080808] py-24 text-center border-t border-gold/8">
                <div className="max-w-xl mx-auto px-6 reveal">
                    <span className="eyebrow justify-center">Rejoignez la prochaine promotion</span>
                    <h2 className="display-title text-3xl text-white mt-4 mb-6">CANDIDATER AU <span className="text-gold">PROGRAMME</span></h2>
                    <p className="font-glacial text-sm text-white/40 leading-loose mb-10">Les candidatures pour la prochaine promotion sont ouvertes. Places limitées — postulez dès maintenant.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/reservation" className="btn btn-gold">SOUMETTRE MA CANDIDATURE</Link>
                        <Link to="/contact" className="btn btn-white">POSER UNE QUESTION</Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
