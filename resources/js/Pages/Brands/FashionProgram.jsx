import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function FashionProgram({ brand }) {
    const heroImg = brand?.image ? `/storage/${brand.image}` : '/img/index/home-image4.jpg';

    return (
        <Layout>
            <Head title={brand?.name || 'Fashion Program'}>
                <meta name="description" content="Fashion Program MIA DREAMS & CO — formation et accompagnement dans le domaine de la mode africaine." />
            </Head>

            <div className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: `url('${heroImg}')`, filter: 'brightness(.3)', animation: 'kb 14s ease forwards' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-14 w-full">
                    <span className="block font-lastica text-[9px] tracking-[6px] text-gold uppercase mb-4"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Formation</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[5px] leading-tight"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        FASHION<br /><span className="text-gold">PROGRAM</span>
                    </h1>
                </div>
            </div>

            <section className="bg-[#0d0d0d] py-20">
                <div className="max-w-4xl mx-auto px-6 lg:px-10">
                    <div className="reveal">
                        <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre programme</span>
                        <h2 className="font-glacial text-3xl font-light text-white uppercase tracking-[3px] mb-5">
                            FORMEZ-VOUS À LA <span className="text-gold">MODE AFRICAINE</span>
                        </h2>
                        <div className="w-10 h-px bg-gold mb-8" />
                        {brand?.description ? (
                            brand.description.split('\n').filter(p => p.trim()).map((para, i) => (
                                <p key={i} className="font-glacial text-sm text-white/55 leading-loose mb-4">{para.trim()}</p>
                            ))
                        ) : (
                            <>
                                <p className="font-glacial text-sm text-white/55 leading-loose mb-4">
                                    Notre Fashion Program est un programme de formation dédié aux passionnés de mode africaine.
                                    Nous formons la prochaine génération de créateurs, stylistes et entrepreneurs de la mode en Afrique.
                                </p>
                                <p className="font-glacial text-sm text-white/55 leading-loose mb-4">
                                    À travers des ateliers pratiques et un mentorat personnalisé, vous maîtriserez les codes
                                    de la mode africaine contemporaine.
                                </p>
                            </>
                        )}
                        {brand?.youtube_id && (
                            <div className="mt-10 relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${brand.youtube_id}`}
                                        frameBorder="0" allowFullScreen loading="lazy" title="Fashion Program" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="bg-gold py-14 text-center">
                <h3 className="font-glacial text-2xl font-light text-[#0d0d0d] uppercase tracking-[4px] mb-6">
                    REJOIGNEZ LE PROGRAMME
                </h3>
                <Link href="/contact"
                      className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold bg-[#0d0d0d] px-10 py-4 hover:bg-[#1a1a1a] transition-all duration-300">
                    S'INSCRIRE →
                </Link>
            </div>
        </Layout>
    );
}
