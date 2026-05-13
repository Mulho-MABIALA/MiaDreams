import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import BrandCollections from '../../components/BrandCollections';
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
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
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

            {/* COLLECTIONS DYNAMIQUES */}
            <BrandCollections brandSlug="mia-dreams" />

            <div className="gold-strip py-9 text-center">
                <p className="relative z-10 font-glacial text-[#080808] text-sm tracking-[5px] uppercase">Mode africaine d'exception — Made In Africa</p>
            </div>
        </Layout>
    );
}
