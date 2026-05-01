// Generic dynamic brand page — used for all brands created in admin
import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function Brand({ brand, collections }) {
    if (!brand) return null;
    const heroImg = brand.image ? `/storage/${brand.image}` : '/img/index/home-image2.jpg';

    return (
        <Layout>
            <Head title={brand.name}>
                <meta name="description" content={brand.description ? brand.description.slice(0, 160) : `Découvrez ${brand.name} — MIA DREAMS & CO`} />
            </Head>

            {/* HERO */}
            <div className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: `url('${heroImg}')`, filter: 'brightness(.3)', animation: 'kb 14s ease forwards' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-14 w-full">
                    <span className="block font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nos marques</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[5px] leading-tight"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {brand.name.toUpperCase()}<br />
                        {brand.header_title && <span className="text-gold">{brand.header_title.toUpperCase()}</span>}
                    </h1>
                </div>
            </div>

            {/* DESCRIPTION */}
            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="max-w-3xl mx-auto text-center reveal">
                        <div className="w-10 h-px bg-gold mx-auto mb-8" />
                        {brand.description ? (
                            brand.description.split('\n').filter(p => p.trim()).map((para, i) => (
                                <p key={i} className="font-glacial text-sm text-white/55 leading-loose mb-4">{para.trim()}</p>
                            ))
                        ) : (
                            <p className="font-glacial text-sm text-white/55 leading-loose">
                                Découvrez {brand.name} — une marque de la maison MIA DREAMS & CO.
                            </p>
                        )}
                        {brand.youtube_id && (
                            <div className="mt-10 relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${brand.youtube_id}`}
                                        frameBorder="0" allowFullScreen loading="lazy" title={brand.name} />
                            </div>
                        )}
                    </div>

                    {/* Collections */}
                    {collections && collections.length > 0 && (
                        <div className="mt-20">
                            {collections.map((col, i) => (
                                <div key={col.id} className="mb-16">
                                    <div className="text-center mb-10 reveal">
                                        <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Collection</span>
                                        <h2 className="font-glacial text-3xl font-light text-white uppercase tracking-[4px]">{col.name}</h2>
                                        <div className="w-10 h-px bg-gold mx-auto mt-4" />
                                    </div>
                                    {col.products && col.products.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {col.products.map((p, j) => (
                                                <div key={p.id} className="reveal group" style={{ transitionDelay: `${j * 0.1}s` }}>
                                                    <div className="overflow-hidden mb-4">
                                                        {p.image ? (
                                                            <img src={`/storage/${p.image}`}
                                                                 className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                                                                 style={{ filter: 'brightness(.88)' }} alt={p.name} loading="lazy" />
                                                        ) : (
                                                            <div className="w-full h-[380px] bg-[#1a1a1a]" />
                                                        )}
                                                    </div>
                                                    <h4 className="font-glacial text-sm text-white uppercase tracking-[2px] text-center">{p.name}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <div className="bg-gold py-14 text-center">
                <Link href="/contact"
                      className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
                    NOUS CONTACTER →
                </Link>
            </div>
        </Layout>
    );
}
