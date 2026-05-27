import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import BrandCollections from '../../components/BrandCollections';
import { imgSrc } from '../../utils/imgSrc';
import { extractYoutubeId } from '../../utils/formatters';

export default function PersonalBranding() {
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/brands/personal-branding')
            .then(res => { setBrand(res.data.brand); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const heroImg     = brand?.image        ? imgSrc(brand.image) : null;
    const heroTitle   = brand?.header_title || 'PERSONAL';
    const youtubeId   = extractYoutubeId(brand?.youtube_id);
    const description = brand?.description  || "Une méthode et un accompagnement uniques au service de votre leadership, qui vous font gagner du temps. Nous allons vous aider à développer votre propre style, dans une démarche bienveillante.";

    if (loading) return (
        <Layout title="Personal Branding">
            <div style={{ height: '80vh', background: '#080808' }} />
        </Layout>
    );

    return (
        <Layout title={brand?.name || 'Personal Branding'}>
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '80vh' }}>
                <div className="hero-slide active">
                    {heroImg
                        ? <img src={heroImg} alt={brand?.name || 'Personal Branding'} loading="eager" />
                        : <div className="absolute inset-0 bg-[#0d0d0d]" />
                    }
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nouveau</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                {heroTitle.includes('\n')
                                    ? heroTitle.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{i === heroTitle.split('\n').length - 1 ? <span className="text-gold">{line}</span> : line}</span>)
                                    : <>{heroTitle}<br /><span className="text-gold">BRANDING</span></>
                                }
                            </h1>
                            <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mt-5 mb-9" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                {brand?.tagline || 'Développez votre style, affirmez votre leadership.'}
                            </p>
                            <div style={{ opacity: 0, animation: 'fadeUp .7s 1s forwards' }}>
                                <Link to="/reservation" className="btn btn-gold">RÉSERVER UNE SESSION</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTRO */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">L'offre</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                VOTRE IMAGE,<br /><span className="text-gold">VOTRE POUVOIR</span>
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-6">
                                {description}
                            </p>
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-9">
                                Que vous soyez entrepreneur, cadre dirigeant ou créatif, notre programme de Personal Branding vous aide à construire une identité visuelle forte et cohérente qui reflète vos valeurs.
                            </p>
                            <Link to="/reservation" className="btn btn-gold">COMMENCER MON ACCOMPAGNEMENT</Link>
                        </div>
                        <div className="reveal">
                            {youtubeId ? (
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen loading="lazy"
                                        title={brand?.name || 'Personal Branding'}
                                    />
                                </div>
                            ) : heroImg ? (
                                <img src={heroImg} className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover object-top" alt={brand?.name || 'Personal Branding'} loading="lazy" />
                            ) : (
                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-[#111]" />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAMME */}
            <section className="bg-texture py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Méthode</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">LE <span className="text-gold">PROGRAMME</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
                        {[
                            { num: '01', title: 'Audit de Style', desc: 'Analyse de votre image actuelle, de vos objectifs et de votre personnalité.' },
                            { num: '02', title: 'Identité Visuelle', desc: 'Définition de vos codes couleurs, matières et coupes signature.' },
                            { num: '03', title: 'Garde-robe Capsule', desc: 'Constitution d\'une garde-robe cohérente et polyvalente pour toutes occasions.' },
                            { num: '04', title: 'Suivi & Coaching', desc: 'Accompagnement continu pour ancrer votre nouveau style dans la durée.' },
                        ].map((s, i) => (
                            <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-8 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <span className="font-lastica text-[10px] tracking-[4px] text-gold/60 block mb-5">{s.num}</span>
                                <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{s.title}</h3>
                                <div className="w-5 h-px bg-gold/30 mb-4" />
                                <p className="font-glacial text-xs text-white/35 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COLLECTIONS DYNAMIQUES */}
            <BrandCollections brandSlug="personal-branding" />

            {/* CTA */}
            <section className="bg-[#080808] py-24 text-center border-t border-gold/8">
                <div className="max-w-xl mx-auto px-6 reveal">
                    <span className="eyebrow justify-center">Prêt(e) à vous transformer ?</span>
                    <h2 className="display-title text-3xl text-white mt-4 mb-6">COMMENCEZ <span className="text-gold">AUJOURD'HUI</span></h2>
                    <p className="font-glacial text-sm text-white/40 leading-loose mb-10">Réservez une consultation gratuite de 30 minutes pour découvrir comment nous pouvons vous aider.</p>
                    <Link to="/reservation" className="btn btn-gold">RÉSERVER MA CONSULTATION GRATUITE</Link>
                </div>
            </section>
        </Layout>
    );
}
