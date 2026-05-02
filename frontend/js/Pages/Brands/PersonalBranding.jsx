import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function PersonalBranding({ brand }) {
    const heroImg = brand?.image ? `/storage/${brand.image}` : '/img/index/home-image5.jpg';

    return (
        <Layout>
            <Head title={brand?.name || 'Personal Branding'}>
                <meta name="description" content="Offre Personal Branding MIA DREAMS & CO — développez votre style et affirmez votre leadership." />
            </Head>

            <div className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: `url('${heroImg}')`, filter: 'brightness(.3)', animation: 'kb 14s ease forwards' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-14 w-full">
                    <span className="block font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Accompagnement</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[5px] leading-tight"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        PERSONAL<br /><span className="text-gold">BRANDING</span>
                    </h1>
                </div>
            </div>

            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal">
                            <span className="block font-lastica text-[8px] tracking-[4px] text-gold uppercase mb-3">Notre offre</span>
                            <h2 className="font-glacial text-4xl font-light text-[#1a1a1a] uppercase tracking-[3px] leading-tight mb-3">
                                DÉVELOPPEZ <span className="text-gold">VOTRE STYLE</span>
                            </h2>
                            <div className="w-10 h-px bg-gold my-5" />
                            {brand?.description ? (
                                brand.description.split('\n').filter(p => p.trim()).map((para, i) => (
                                    <p key={i} className="font-glacial text-sm text-[#666] leading-loose mb-4">{para.trim()}</p>
                                ))
                            ) : (
                                <>
                                    <p className="font-glacial text-sm text-[#666] leading-loose mb-4">
                                        Une méthode et un accompagnement uniques au service de votre leadership, qui vous font gagner du temps.
                                    </p>
                                    <p className="font-glacial text-sm text-[#666] leading-loose mb-4">
                                        Nous allons vous aider à développer votre propre style, dans une démarche bienveillante.
                                        Notre approche structurée et ultra-professionnelle vous permettra de constituer un dressing digne de la Haute Couture.
                                    </p>
                                </>
                            )}
                            <Link href="/contact"
                                  className="inline-block font-glacial text-[11px] tracking-[4px] uppercase bg-[#1a1a1a] text-gold px-10 py-4 hover:bg-gold hover:text-[#1a1a1a] transition-all duration-300 mt-4">
                                PRENDRE RENDEZ-VOUS →
                            </Link>
                        </div>
                        <div className="reveal overflow-hidden" style={{ transitionDelay: '.15s' }}>
                            <img src={heroImg}
                                 className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                                 alt="Personal Branding" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-12 reveal">
                        <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Ce que vous obtenez</span>
                        <h2 className="font-glacial text-3xl font-light text-white uppercase tracking-[3px]">NOS <span className="text-gold">SERVICES</span></h2>
                        <div className="w-10 h-px bg-gold mx-auto mt-5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Audit de style', desc: "Analyse complète de votre garde-robe et de votre image actuelle." },
                            { title: 'Conseil personnalisé', desc: "Un programme sur mesure adapté à votre morphologie et vos objectifs." },
                            { title: 'Shopping accompagné', desc: "Sélection de pièces qui vous correspondent parfaitement." },
                        ].map((s, i) => (
                            <div key={i} className="reveal border border-gold/10 p-8 hover:border-gold/30 transition-colors duration-300" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="w-8 h-px bg-gold mb-5" />
                                <h3 className="font-glacial text-sm text-white uppercase tracking-[3px] mb-3">{s.title}</h3>
                                <p className="font-glacial text-xs text-white/40 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="bg-gold py-14 text-center">
                <Link href="/contact"
                      className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
                    COMMENCER MON ACCOMPAGNEMENT →
                </Link>
            </div>
        </Layout>
    );
}
