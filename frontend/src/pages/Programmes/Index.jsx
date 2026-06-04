import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { imgSrc } from '../../utils/imgSrc';

export default function ProgrammesIndex() {
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/programmes')
            .then(r => setProgrammes(r.data.programmes || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout title="Nos Programmes">
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '60vh' }}>
                <div className="hero-slide active">
                    <div className="absolute inset-0 bg-[#0d0d0d]" />
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Formations</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                NOS<br /><span className="text-gold">PROGRAMMES</span>
                            </h1>
                            <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mt-5" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                Des formations d'excellence pour les créateurs et entrepreneurs de la mode africaine.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LISTE */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                        </div>
                    ) : programmes.length === 0 ? (
                        <p className="font-glacial text-center text-[#888] py-20">Aucun programme disponible pour le moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {programmes.map((prog, i) => (
                                <Link
                                    key={prog._id}
                                    to={`/programmes/${prog.slug}`}
                                    className="reveal group block"
                                    style={{ transitionDelay: `${i * 0.1}s`, textDecoration: 'none' }}
                                >
                                    <div className="border border-[#e8e0d0] hover:border-gold/40 transition-colors overflow-hidden">
                                        {prog.image ? (
                                            <img
                                                src={imgSrc(prog.image)}
                                                alt={prog.name}
                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-56 bg-[#111]" />
                                        )}
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-lastica text-[9px] tracking-[3px] text-gold uppercase">{prog.format || 'formation'}</span>
                                                {prog.is_open ? (
                                                    <span className="font-glacial text-[10px] tracking-[1px] text-green-600 bg-green-50 px-2 py-0.5">Inscriptions ouvertes</span>
                                                ) : (
                                                    <span className="font-glacial text-[10px] tracking-[1px] text-[#999] bg-[#f5f5f5] px-2 py-0.5">Inscriptions fermées</span>
                                                )}
                                            </div>
                                            <h2 className="font-glacial text-xl text-[#1a1a1a] uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">
                                                {prog.name}
                                            </h2>
                                            {prog.description && (
                                                <p className="font-glacial text-sm text-[#666] leading-relaxed mb-5 line-clamp-3">
                                                    {prog.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-4 text-[11px] font-glacial text-[#888] mb-6">
                                                {prog.duration && <span>⏱ {prog.duration}</span>}
                                                {prog.price    && <span>💰 {prog.price}</span>}
                                                {prog.level    && <span>📚 {prog.level}</span>}
                                            </div>
                                            <span className="btn btn-gold text-[10px] py-[.7rem] px-5 inline-block">
                                                DÉCOUVRIR LA FORMATION
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
