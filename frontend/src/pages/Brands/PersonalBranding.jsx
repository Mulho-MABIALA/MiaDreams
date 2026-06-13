import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import BrandCollections from '../../components/BrandCollections';
import { imgSrc } from '../../utils/imgSrc';
import { extractYoutubeId } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function PersonalBranding() {
    const { t } = useLanguage();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/brands/personal-branding', { params: { _t: Date.now() } })
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
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>{t('brand_eyebrow_pb')}</span>
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
                                <Link to="/reservation" className="btn btn-gold">{t('brand_session_btn')}</Link>
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
                            <span className="eyebrow">{t('brand_about_pb')}</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                {t('brand_pb_title').split(',')[0]},<br /><span className="text-gold">{t('brand_pb_title').split(',')[1]?.trim()}</span>
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#444] leading-loose mb-6">
                                {description}
                            </p>
                            <p className="font-glacial text-sm text-[#444] leading-loose mb-9">
                                {t('brand_free_consult')}
                            </p>
                            <Link to="/reservation" className="btn btn-gold">{t('brand_pb_start')}</Link>
                        </div>
                        <div className="reveal">
                            {youtubeId ? (
                                <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer"
                                   className="relative w-full block group overflow-hidden"
                                   style={{ paddingBottom: '56.25%', background: '#111' }}>
                                    <img src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} alt={brand?.name || 'Personal Branding'}
                                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                         onError={e => { e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; }} />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                             style={{ background: 'rgba(201,168,76,0.95)' }}>
                                            <svg className="w-6 h-6 ml-1" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                </a>
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
                        <span className="eyebrow justify-center">{t('brand_method')}</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">{t('brand_program').split(' ').slice(0,1).join(' ')} <span className="text-gold">{t('brand_program').split(' ').slice(1).join(' ')}</span></h2>
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
                                <p className="font-glacial text-sm text-white/60 leading-relaxed">{s.desc}</p>
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
                    <span className="eyebrow justify-center">{t('brand_cta_title')}</span>
                    <h2 className="display-title text-3xl text-white mt-4 mb-6">{t('brand_cta_subtitle').split(' ').slice(0,1).join(' ')} <span className="text-gold">{t('brand_cta_subtitle').split(' ').slice(1).join(' ')}</span></h2>
                    <p className="font-glacial text-sm text-white/65 leading-loose mb-10">{t('brand_free_consult')}</p>
                    <Link to="/reservation" className="btn btn-gold">{t('brand_free_btn')}</Link>
                </div>
            </section>
        </Layout>
    );
}
