import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

export default function Gallery() {
    const [data, setData] = useState({ items: [], brands: [], collections: [] });
    const [selectedBrand, setSelectedBrand] = useState('');
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        const params = {};
        if (selectedBrand) params.brand = selectedBrand;
        axios.get('/api/gallery', { params }).then(res => setData(res.data)).catch(() => {});
    }, [selectedBrand]);

    return (
        <Layout title="Galerie">
            {/* HERO */}
            <div className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nos créations</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        GALERIE <span className="text-gold">PHOTOS</span>
                    </h1>
                </div>
            </div>

            {/* FILTRES */}
            {data.brands.length > 0 && (
                <div className="bg-[#080808] border-b border-gold/8 py-5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap gap-2.5 items-center">
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold/35 uppercase mr-2">Marques</span>
                        {[{ _id: '', name: 'Toutes' }, ...data.brands].map(b => (
                            <button key={b._id} onClick={() => setSelectedBrand(b._id)}
                                    className={`font-glacial text-[10px] tracking-[2px] uppercase border px-4 py-1.5 transition-all duration-200 ${
                                        selectedBrand === b._id ? 'bg-gold text-[#080808] border-gold' : 'border-white/10 text-white/40 hover:border-gold/40 hover:text-gold'
                                    }`}>
                                {b.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* GRILLE */}
            <section className="bg-[#080808] py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {data.items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                            {data.items.map((item, i) => (
                                <div key={item._id} className="reveal group relative overflow-hidden cursor-pointer aspect-square" style={{ transitionDelay: `${(i % 8) * 0.05}s` }}
                                     onClick={() => setLightbox(item)}>
                                    <img src={`/uploads/${item.image}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.caption || ''} loading="lazy" />
                                    <div className="absolute inset-0 bg-[#080808]/0 group-hover:bg-[#080808]/50 transition-all duration-400 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                                        </svg>
                                    </div>
                                    {item.brand?.name && (
                                        <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                                            <span className="font-lastica text-[7px] tracking-[2px] text-gold uppercase">{item.brand.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">Aucune photo pour le moment</p>
                        </div>
                    )}
                </div>
            </section>

            {/* LIGHTBOX */}
            {lightbox && (
                <div className="fixed inset-0 z-[9998] bg-[#080808]/95 flex items-center justify-center p-4"
                     onClick={() => setLightbox(null)}>
                    <button className="absolute top-4 right-4 text-white/40 hover:text-gold transition-colors text-2xl leading-none z-10">✕</button>
                    <img src={`/uploads/${lightbox.image}`}
                         className="max-w-full max-h-[90vh] object-contain"
                         alt={lightbox.caption || ''}
                         onClick={e => e.stopPropagation()} />
                    {lightbox.caption && (
                        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-glacial text-xs text-white/40 tracking-[2px]">{lightbox.caption}</p>
                    )}
                </div>
            )}
        </Layout>
    );
}
