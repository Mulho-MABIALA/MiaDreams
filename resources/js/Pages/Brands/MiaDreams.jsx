import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

function CollectionSection({ collection, index }) {
    const bg = index % 2 === 0 ? 'bg-[#111]' : 'bg-[#0d0d0d]';
    const cols = Math.min(collection.products?.length || 0, 3);
    const gridClass = cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
        <section className={`${bg} py-20`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-12 reveal">
                    {collection.image && (
                        <img src={`/storage/${collection.image}`}
                             className="w-full max-h-[340px] object-cover mb-8" style={{ filter: 'brightness(.85)' }}
                             alt={collection.name} loading="lazy" />
                    )}
                    <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Collection</span>
                    <h2 className="font-glacial text-4xl font-light text-white uppercase tracking-[4px]">
                        {collection.name.toUpperCase()}
                    </h2>
                    <div className="w-10 h-px bg-gold mx-auto mt-4" />
                </div>

                {collection.products && collection.products.length > 0 ? (
                    <div className={`grid ${gridClass} gap-6`}>
                        {collection.products.map((product, j) => (
                            <div key={product.id} className="reveal group" style={{ transitionDelay: `${j * 0.1}s` }}>
                                <div className="relative overflow-hidden mb-4">
                                    {product.image ? (
                                        <img src={`/storage/${product.image}`}
                                             className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                                             style={{ filter: 'brightness(.88)' }} alt={product.name} loading="lazy" />
                                    ) : (
                                        <div className="w-full h-[420px] bg-[#1a1a1a] flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gold/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 h-16"
                                         style={{ background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }} />
                                </div>
                                <h4 className="font-glacial text-base text-white uppercase tracking-[2px] text-center">{product.name}</h4>
                                {product.description && (
                                    <p className="font-glacial text-xs text-white/40 text-center mt-1 leading-relaxed">
                                        {product.description.slice(0, 80)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="font-glacial text-sm text-white/30 tracking-[3px] uppercase">Produits à venir…</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function MiaDreams({ brand, collections }) {
    const heroImg = brand?.image ? `/storage/${brand.image}` : '/img/miadreams/img1.jpg';

    return (
        <Layout>
            <Head title={brand?.name || 'Mia Dreams'}>
                <meta name="description" content="Découvrez la marque Mia Dreams — mode africaine éthique, collections en série limitée depuis Dakar." />
            </Head>

            {/* HERO */}
            <div className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: `url('${heroImg}')`, filter: 'brightness(.35)', animation: 'kb 14s ease forwards' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-14 w-full">
                    <span className="block font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Collection</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[5px] leading-tight"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {brand ? brand.name.toUpperCase() : 'MIA DREAMS'}<br />
                        <span className="text-gold">{brand?.header_title?.toUpperCase() || 'BRAND'}</span>
                    </h1>
                </div>
            </div>

            {/* UNIVERS */}
            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        <div className="reveal grid grid-cols-2 gap-3">
                            <img src="/img/miadreams/img1.jpg" className="w-full h-64 object-cover" style={{ filter: 'brightness(.85)' }} alt="Mia Dreams" loading="lazy" />
                            <img src="/img/miadreams/img2.jpg" className="w-full h-64 object-cover mt-6" style={{ filter: 'brightness(.85)' }} alt="Mia Dreams" loading="lazy" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre univers</span>
                            <h2 className="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">
                                NOTRE <span className="text-gold">IDENTITÉ</span>
                            </h2>
                            <div className="w-10 h-px bg-gold my-5" />
                            {brand?.description ? (
                                brand.description.split('\n').filter(p => p.trim()).map((para, i) => (
                                    <p key={i} className="font-glacial text-sm text-white/55 leading-loose mb-3">{para.trim()}</p>
                                ))
                            ) : (
                                <>
                                    <p className="font-glacial text-sm text-white/55 leading-loose mb-3">
                                        Mia Dreams est une marque de mode et de style de vie aux influences Afro-vintage, créée pour apporter une touche d'authenticité dans vos garde-robes.
                                    </p>
                                    <p className="font-glacial text-sm text-white/55 leading-loose mb-3">
                                        Toutes nos créations sont éditées en petites séries pour satisfaire les adeptes d'exclusivité.
                                    </p>
                                    <p className="font-glacial text-sm text-white/55 leading-loose">
                                        MIA signifie Made In Africa — une volonté de promouvoir notre culture et les savoir-faire des artisans.
                                    </p>
                                </>
                            )}
                            {brand?.youtube_id && (
                                <div className="mt-8">
                                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe className="absolute inset-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${brand.youtube_id}`}
                                                frameBorder="0" allowFullScreen loading="lazy" title={brand.name} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* COLLECTIONS */}
            {collections && collections.length > 0 ? (
                <>
                    <div className="bg-gold py-6 text-center">
                        <span className="font-glacial text-[#0d0d0d] text-xs tracking-[8px] uppercase">
                            Nos Collections · {new Date().getFullYear()}
                        </span>
                    </div>
                    {collections.map((col, i) => (
                        <CollectionSection key={col.id} collection={col} index={i} />
                    ))}
                </>
            ) : (
                // Fallback
                <>
                    <section className="bg-[#111] py-20">
                        <div className="max-w-7xl mx-auto px-6 lg:px-10">
                            <div className="text-center mb-12 reveal">
                                <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-2">Collection</span>
                                <h2 className="font-glacial text-4xl font-light text-white uppercase tracking-[4px]">BCBG</h2>
                                <div className="w-10 h-px bg-gold mx-auto mt-4" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[['img/miadreams/img3.jpg','Cape Scarlett'],['img/miadreams/img4.jpg','Tunique Lou'],['img/miadreams/img5.jpg','Julia Dress']].map(([src, name], j) => (
                                    <div key={j} className="reveal group" style={{ transitionDelay: `${j * 0.1}s` }}>
                                        <div className="overflow-hidden mb-4">
                                            <img src={`/${src}`} className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                                                 style={{ filter: 'brightness(.88)' }} alt={name} loading="lazy" />
                                        </div>
                                        <h4 className="font-glacial text-base text-white uppercase tracking-[2px] text-center">{name}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* CTA */}
            <div className="bg-gold py-14 text-center">
                <span className="block font-lastica text-[9px] tracking-[5px] text-[#0d0d0d] uppercase mb-3">Commander</span>
                <h3 className="font-glacial text-3xl font-light text-[#0d0d0d] uppercase tracking-[4px] mb-6">
                    UNE PIÈCE VOUS A <span style={{ textDecoration: 'underline', textUnderlineOffset: '6px' }}>SÉDUIT</span> ?
                </h3>
                <Link href="/contact"
                      className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
                    NOUS CONTACTER →
                </Link>
            </div>
        </Layout>
    );
}
