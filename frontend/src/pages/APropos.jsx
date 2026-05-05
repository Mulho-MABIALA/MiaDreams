import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

export default function APropos() {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        axios.get('/api/apropos').then(res => setTeamMembers(res.data.teamMembers)).catch(() => {});
    }, []);

    return (
        <Layout title="À Propos">
            {/* HERO */}
            <div className="relative h-[45vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image1.jpg')", filter: 'brightness(.15)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.3) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Notre histoire</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        À <span className="text-gold">PROPOS</span>
                    </h1>
                </div>
            </div>

            {/* HISTOIRE */}
            <section className="bg-[#0d0d0d] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="reveal img-hover">
                            <img src="/img/index/home-image2.jpg" className="w-full h-[500px] object-cover object-top" alt="MIA DREAMS" loading="lazy" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">Depuis 2018</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 leading-tight">NOTRE <span className="text-gold">HISTOIRE</span></h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-white/55 leading-loose mb-6">
                                MIA DREAMS & CO est une startup sénégalaise qui diffuse l'ensemble de la richesse culturelle du continent africain à travers la mode, le style et l'entrepreneuriat.
                            </p>
                            <p className="font-glacial text-sm text-white/55 leading-loose mb-8">
                                Fondée à Dakar, notre maison de mode incarne un univers contemporain africain. Notre savoir-faire dans l'industrie textile est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique.
                            </p>
                            <div className="grid grid-cols-3 gap-6">
                                {[{ num: '5+', label: 'Années d\'expérience' }, { num: '4', label: 'Marques & offres' }, { num: '100+', label: 'Clients satisfaits' }].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <p className="font-glacial text-2xl text-gold font-light">{s.num}</p>
                                        <p className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase mt-1">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALEURS */}
            <section className="bg-texture py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Ce qui nous guide</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">VALEURS</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
                        {[
                            { num: '01', title: 'Authenticité', desc: "Chaque création reflète l'âme de l'Afrique, ses traditions et sa modernité." },
                            { num: '02', title: 'Excellence', desc: "Nous visons la perfection dans chaque détail, chaque tissu, chaque couture." },
                            { num: '03', title: 'Innovation', desc: "Allier savoir-faire artisanal et vision contemporaine pour créer l'unique." },
                            { num: '04', title: 'Durabilité', desc: "Une mode responsable qui respecte les artisans, les matières et l'environnement." },
                            { num: '05', title: 'Communauté', desc: "Créer du lien, valoriser les talents locaux et soutenir l'entrepreneuriat africain." },
                            { num: '06', title: 'Empowerment', desc: "Permettre à chacun d'exprimer son identité et d'affirmer sa singularité." },
                        ].map((v, i) => (
                            <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-8 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <span className="font-lastica text-[9px] tracking-[4px] text-gold/40 block mb-4">{v.num}</span>
                                <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{v.title}</h3>
                                <div className="w-6 h-px bg-gold/30 mb-4" />
                                <p className="font-glacial text-xs text-white/35 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ÉQUIPE */}
            {teamMembers.length > 0 && (
                <section className="bg-[#080808] py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-16 reveal">
                            <span className="eyebrow justify-center">Les visages de MIA DREAMS</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOTRE <span className="text-gold">ÉQUIPE</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teamMembers.map((m, i) => (
                                <div key={m._id} className="reveal group text-center" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <div className="relative overflow-hidden mb-5 mx-auto" style={{ width: 200, height: 200 }}>
                                        {m.photo
                                            ? <img src={`/uploads/${m.photo}`} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" alt={m.name} loading="lazy" />
                                            : <div className="w-full h-full bg-gold/10 border border-gold/20 flex items-center justify-center"><span className="font-glacial text-4xl text-gold/40">{m.name[0]}</span></div>
                                        }
                                        <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors" />
                                    </div>
                                    <h3 className="font-glacial text-base text-white uppercase tracking-[2px] mb-1">{m.name}</h3>
                                    {m.role && <p className="font-lastica text-[8px] tracking-[3px] text-gold/60 uppercase mb-3">{m.role}</p>}
                                    {m.bio && <p className="font-glacial text-xs text-white/30 leading-relaxed max-w-xs mx-auto">{m.bio}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}
