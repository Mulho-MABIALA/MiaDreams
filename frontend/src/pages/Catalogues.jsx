import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const imgSrc = (val) => {
    if (!val) return '';
    if (val.startsWith('http') || val.startsWith('/')) return val;
    return `/uploads/${val}`;
};

export default function Catalogues() {
    const [catalogues, setCatalogues] = useState([]);

    useEffect(() => {
        axios.get('/api/catalogues').then(res => setCatalogues(res.data)).catch(() => {});
    }, []);

    return (
        <Layout title="Catalogues">
            {/* HERO */}
            <div className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nos collections</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOS <span className="text-gold">CATALOGUES</span>
                    </h1>
                </div>
            </div>

            <section className="bg-[#080808] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {catalogues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {catalogues.map((cat, i) => (
                                <div key={cat._id} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/25 transition-all duration-400" style={{ transitionDelay: `${i * 0.08}s` }}>
                                    {/* Cover */}
                                    <div className="relative overflow-hidden">
                                        {cat.cover_image
                                            ? <img src={imgSrc(cat.cover_image)} className="w-full h-[200px] sm:h-[240px] object-cover transition-transform duration-700 group-hover:scale-105" alt={cat.name} loading="lazy" />
                                            : <div className="w-full h-[200px] sm:h-[240px] bg-[#141414] flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                                </svg>
                                              </div>
                                        }
                                        <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-6">
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-2 group-hover:text-gold transition-colors">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="font-glacial text-xs text-white/35 leading-relaxed mb-5">{cat.description}</p>
                                        )}
                                        {cat.pdf_path ? (
                                            <a href={cat.pdf_path.startsWith('http') ? cat.pdf_path : `/api/catalogues/${cat._id}/download`}
                                               target="_blank" rel="noopener noreferrer"
                                               className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                TÉLÉCHARGER
                                            </a>
                                        ) : (
                                            <span className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2 opacity-40 cursor-not-allowed">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                PDF BIENTÔT DISPONIBLE
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">Aucun catalogue disponible pour le moment</p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
