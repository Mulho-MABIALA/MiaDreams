import { Head } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function Catalogues({ catalogues }) {
    return (
        <Layout>
            <Head title="Catalogues">
                <meta name="description" content="Téléchargez les catalogues MIA DREAMS & CO — collections, lookbooks et guides de style." />
            </Head>

            {/* HERO */}
            <div className="relative h-[38vh] min-h-[280px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(13,13,13,.5) 0%,rgba(13,13,13,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nos publications</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOS <span className="text-gold">CATALOGUES</span>
                    </h1>
                    <div className="w-12 h-px bg-gold mx-auto" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            {/* GRILLE */}
            <section className="bg-[#0d0d0d] py-20 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {catalogues && catalogues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {catalogues.map((cat, i) => (
                                <div key={cat.id}
                                     className="reveal group border border-gold/10 hover:border-gold/30 transition-all duration-300 bg-[#111]"
                                     style={{ transitionDelay: `${(i % 8) * 0.07}s` }}>
                                    {/* Cover */}
                                    <div className="relative overflow-hidden">
                                        {cat.cover_image ? (
                                            <img src={`/storage/${cat.cover_image}`}
                                                 className="w-full h-[320px] object-cover transition-transform duration-700 group-hover:scale-105"
                                                 style={{ filter: 'brightness(.85)' }}
                                                 alt={cat.name} loading="lazy" />
                                        ) : (
                                            <div className="w-full h-[320px] bg-[#1a1a1a] flex flex-col items-center justify-center gap-3">
                                                <svg className="w-12 h-12 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                                </svg>
                                                <span className="font-lastica text-[8px] tracking-[3px] text-white/20 uppercase">PDF</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-[#0d0d0d]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="font-glacial text-[10px] tracking-[3px] uppercase text-gold border border-gold px-6 py-2.5">
                                                TÉLÉCHARGER
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        {cat.year && (
                                            <span className="block font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-2">
                                                {cat.year}
                                            </span>
                                        )}
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-3">
                                            {cat.name}
                                        </h3>
                                        {cat.description && (
                                            <p className="font-glacial text-xs text-white/40 leading-relaxed mb-4">
                                                {cat.description.slice(0, 90)}
                                            </p>
                                        )}
                                        <a href={`/catalogue/telecharger/${cat.id}`}
                                           className="inline-flex items-center gap-2 font-glacial text-[10px] tracking-[3px] uppercase text-gold hover:text-white transition-colors duration-200">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                            </svg>
                                            Télécharger
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32">
                            <svg className="w-16 h-16 text-gold/15 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            <p className="font-glacial text-sm text-white/30 tracking-[3px] uppercase">Catalogues à venir…</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <div className="bg-[#111] border-t border-gold/10 py-16 text-center">
                <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Besoin d'une pièce ?</span>
                <h3 className="font-glacial text-2xl font-light text-white uppercase tracking-[4px] mb-6">
                    CONTACTEZ-NOUS POUR <span className="text-gold">COMMANDER</span>
                </h3>
                <a href="/contact"
                   className="inline-block font-glacial text-[11px] tracking-[4px] uppercase bg-gold text-[#0d0d0d] px-10 py-4 hover:bg-gold-light transition-all duration-300">
                    NOUS ÉCRIRE →
                </a>
            </div>
        </Layout>
    );
}
