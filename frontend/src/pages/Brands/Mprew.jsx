import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import BrandCollections from '../../components/BrandCollections';

export default function Mprew() {
    return (
        <Layout title="MPREW — Ma Petite Robe En Wax">
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '80vh' }}>
                <div className="hero-slide active">
                    <img src="/img/index/home-image3.jpg" alt="MPREW" loading="eager" />
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-8 lg:px-24">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Application mobile</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                MPREW<br /><span className="text-gold">APP</span>
                            </h1>
                            <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mt-5 mb-9" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                Ma Petite Robe En Wax — la mode africaine dans votre poche.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONCEPT */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal img-hover">
                            <img src="/img/index/home-image3.jpg" className="w-full h-[500px] object-cover object-top" alt="MPREW" loading="lazy" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">L'application</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                MA PETITE ROBE<br /><span className="text-gold">EN WAX</span>
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-6">
                                MPREW est notre application mobile dédiée à la mode africaine. Elle permet à nos clientes de découvrir, personnaliser et commander leurs tenues en tissu wax directement depuis leur smartphone.
                            </p>
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-9">
                                Une expérience shopping unique, alliant technologie moderne et artisanat africain traditionnel.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/reservation" className="btn btn-gold">EN SAVOIR PLUS</Link>
                                <Link to="/contact" className="btn btn-dark">NOUS CONTACTER</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-texture py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Fonctionnalités</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">L'APPLICATION <span className="text-gold">MPREW</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
                        {[
                            { icon: '🎨', title: 'Catalogue Wax', desc: 'Des centaines de motifs wax africains sélectionnés par nos stylistes.' },
                            { icon: '✂️', title: 'Personnalisation', desc: 'Choisissez votre coupe, votre tissu et vos finitions sur mesure.' },
                            { icon: '📱', title: 'Commande Mobile', desc: 'Commandez en quelques clics depuis votre smartphone.' },
                            { icon: '🚚', title: 'Livraison', desc: 'Livraison à domicile partout au Sénégal et en Afrique de l\'Ouest.' },
                            { icon: '👗', title: 'Lookbook', desc: 'Inspirez-vous de nos collections et tendances africaines.' },
                            { icon: '🌟', title: 'Artisanat Local', desc: 'Vos créations réalisées par des artisans locaux qualifiés.' },
                        ].map((f, i) => (
                            <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-8 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <span className="text-3xl block mb-5">{f.icon}</span>
                                <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{f.title}</h3>
                                <p className="font-glacial text-xs text-white/35 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COLLECTIONS DYNAMIQUES */}
            <BrandCollections brandSlug="mprew" />

            <div className="bg-[#080808] py-14 text-center border-t border-gold/8">
                <Link to="/contact" className="btn btn-gold">REJOINDRE LA BÊTA</Link>
            </div>
        </Layout>
    );
}
