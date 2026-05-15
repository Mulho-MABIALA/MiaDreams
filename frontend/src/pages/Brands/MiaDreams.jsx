import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import BrandCollections from '../../components/BrandCollections';
import { imgSrc } from '../../utils/imgSrc';

/** Extrait l'ID YouTube depuis une URL complète ou un ID brut */
function extractYoutubeId(value) {
    if (!value) return null;
    const v = value.trim();
    // ID brut (11 chars alphanumériques)
    if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    // URL complète : ?v=XXXXX ou youtu.be/XXXXX
    try {
        const url = new URL(v);
        const param = url.searchParams.get('v');
        if (param) return param;
        // youtu.be/XXXXX
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length) return parts[parts.length - 1];
    } catch {}
    // fallback regex
    const m = v.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}

export default function MiaDreams() {
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/brands/mia-dreams')
            .then(res => { setBrand(res.data.brand); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const heroImg     = brand?.image       ? imgSrc(brand.image) : null;
    const heroTitle   = brand?.header_title || 'MIA DREAMS';
    const youtubeId   = extractYoutubeId(brand?.youtube_id);
    const description = brand?.description || "Mia Dreams Brand est notre ligne de vêtements — une collection qui marie l'artisanat africain traditionnel aux codes de la mode contemporaine.";

    if (loading) return (
        <Layout title="Mia Dreams Brand">
            <div style={{ height: '80vh', background: '#080808' }} />
        </Layout>
    );

    return (
        <Layout title={brand?.name || 'Mia Dreams Brand'}>
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '80vh' }}>
                <div className="hero-slide active">
                    {heroImg
                        ? <img src={heroImg} alt={brand?.name || 'Mia Dreams'} loading="eager" />
                        : <div className="absolute inset-0 bg-[#0d0d0d]" />
                    }
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Maison de mode</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                {heroTitle.includes('\n')
                                    ? heroTitle.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{i === heroTitle.split('\n').length - 1 ? <span className="text-gold">{line}</span> : line}</span>)
                                    : <>{heroTitle} <span className="text-gold">BRAND</span></>
                                }
                            </h1>
                            <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mt-5 mb-9" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                {brand?.tagline || "Élégance africaine contemporaine — chaque pièce raconte une histoire."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTRO */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
                        {/* Gauche : vidéo si dispo, sinon image, sinon fond sombre */}
                        <div className="reveal">
                            {youtubeId ? (
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${youtubeId}`}
                                        frameBorder="0" allowFullScreen loading="lazy"
                                        title={brand?.name || 'Mia Dreams'}
                                    />
                                </div>
                            ) : heroImg ? (
                                <img src={heroImg}
                                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover object-top"
                                    alt={brand?.name || 'Mia Dreams'} loading="lazy" />
                            ) : (
                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-[#111]" />
                            )}
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">La marque</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">ÉLÉGANCE <span className="text-gold">AFRICAINE</span></h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-8">{description}</p>
                            <Link to="/reservation" className="btn btn-gold">RÉSERVER UNE CONSULTATION</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* COLLECTIONS DYNAMIQUES */}
            <BrandCollections brandSlug="mia-dreams" />

            <div className="gold-strip py-9 text-center">
                <p className="relative z-10 font-glacial text-[#080808] text-sm tracking-[5px] uppercase">Mode africaine d'exception — Made In Africa</p>
            </div>
        </Layout>
    );
}
