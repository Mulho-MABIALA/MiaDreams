import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Components/Layout';

function galleryUrl(path) {
    if (!path) return '';
    if (path.startsWith('img/') || path.startsWith('images/')) return `/${path}`;
    return `/storage/${path}`;
}

export default function Gallery({ photos, brands, collections }) {
    const [filter, setFilter] = useState('all');
    const [lightbox, setLightbox] = useState(null); // { src, caption }

    const applyFilter = (f) => setFilter(f);

    const visiblePhotos = photos ? photos.filter(p => {
        if (filter === 'all') return true;
        if (filter.startsWith('brand-')) return p.brand_id && `brand-${p.brand_id}` === filter;
        if (filter.startsWith('col-')) return p.collection_id && `col-${p.collection_id}` === filter;
        return true;
    }) : [];

    const filterBtnClass = (key) =>
        `gallery-filter font-glacial text-[10px] tracking-[2px] uppercase border px-4 py-1.5 transition-all duration-200 ${
            filter === key
                ? 'bg-gold text-[#0d0d0d] border-gold'
                : 'border-white/10 text-white/50 hover:bg-gold hover:text-[#0d0d0d] hover:border-gold'
        }`;

    return (
        <Layout>
            <Head title="Galerie">
                <meta name="description" content="Galerie photos MIA DREAMS & CO — collections, créations et moments forts." />
                <meta property="og:image" content="/img/index/home-image3.jpg" />
            </Head>

            {/* HERO */}
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/index/home-image1.jpg')", filter: 'brightness(.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(13,13,13,.5) 0%,rgba(13,13,13,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nos créations</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOTRE <span className="text-gold">GALERIE</span>
                    </h1>
                    <div className="w-12 h-px bg-gold mx-auto" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            {/* FILTRES */}
            {((brands && brands.length > 0) || (collections && collections.length > 0)) && (
                <div className="bg-[#111] border-b border-gold/10 sticky top-[70px] z-40 py-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap items-center gap-3">
                        <span className="font-lastica text-[8px] tracking-[3px] text-gold/50 uppercase mr-2">Filtrer :</span>
                        <button onClick={() => applyFilter('all')} className={filterBtnClass('all')}>Tout</button>
                        {brands && brands.map(b => (
                            <button key={b.id} onClick={() => applyFilter(`brand-${b.id}`)} className={filterBtnClass(`brand-${b.id}`)}>
                                {b.name}
                            </button>
                        ))}
                        {collections && collections.map(c => (
                            <button key={c.id} onClick={() => applyFilter(`col-${c.id}`)} className={filterBtnClass(`col-${c.id}`)}>
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* GRILLE */}
            <section className="bg-[#0d0d0d] py-16 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    {visiblePhotos.length > 0 ? (
                        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                            {visiblePhotos.map((photo, idx) => (
                                <div key={photo.id}
                                     className="reveal break-inside-avoid group relative overflow-hidden cursor-pointer"
                                     style={{ transitionDelay: `${(idx % 12) * 0.04}s` }}
                                     onClick={() => setLightbox({ src: galleryUrl(photo.image), caption: photo.caption || '' })}>
                                    <img src={galleryUrl(photo.image)}
                                         className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                         style={{ filter: 'brightness(.88)' }}
                                         alt={photo.caption || 'MIA DREAMS'} loading="lazy" />
                                    <div className="absolute inset-0 bg-[#0d0d0d]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                                        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                                        </svg>
                                        {photo.caption && (
                                            <span className="font-glacial text-[10px] tracking-[2px] text-white/80 uppercase px-4 text-center">
                                                {photo.caption}
                                            </span>
                                        )}
                                        {photo.collection && (
                                            <span className="font-lastica text-[8px] tracking-[2px] text-gold/70 uppercase">
                                                {photo.collection.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32">
                            <svg className="w-16 h-16 text-gold/15 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p className="font-glacial text-sm text-white/30 tracking-[3px] uppercase">Galerie à venir…</p>
                        </div>
                    )}
                </div>
            </section>

            {/* LIGHTBOX */}
            {lightbox && (
                <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
                     onClick={() => setLightbox(null)}>
                    <button className="absolute top-6 right-6 text-white/60 hover:text-gold transition-colors z-10"
                            onClick={() => setLightbox(null)}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <div className="relative max-w-5xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
                        <img src={lightbox.src} alt={lightbox.caption}
                             className="max-h-[85vh] max-w-full object-contain mx-auto" />
                        {lightbox.caption && (
                            <p className="font-glacial text-sm text-white/60 text-center mt-4 tracking-[2px] uppercase">
                                {lightbox.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="bg-gold py-10 text-center">
                <span className="block font-lastica text-[9px] tracking-[5px] text-[#0d0d0d] uppercase mb-3">Envie d'une pièce ?</span>
                <h3 className="font-glacial text-2xl font-light text-[#0d0d0d] uppercase tracking-[4px] mb-5">
                    DÉCOUVREZ NOS <span style={{ textDecoration: 'underline', textUnderlineOffset: '6px' }}>COLLECTIONS</span>
                </h3>
                <a href="/miaDreams"
                   className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
                    VOIR LES COLLECTIONS →
                </a>
            </div>
        </Layout>
    );
}

// Handle Escape key for lightbox
if (typeof window !== 'undefined') {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            // The lightbox state is component-local; nothing to do here globally
        }
    });
}
