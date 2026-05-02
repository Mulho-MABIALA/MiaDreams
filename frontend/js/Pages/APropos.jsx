import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Components/Layout';

// ─── Carte membre éditorial ────────────────────────────────────────────────────
function MemberCard({ member, index }) {
    const [hovered, setHovered] = useState(false);
    const imgSrc = member.image ? `/storage/${member.image}` : null;

    return (
        <div className="reveal group"
             style={{ transitionDelay: `${index * 0.12}s` }}
             onMouseEnter={() => setHovered(true)}
             onMouseLeave={() => setHovered(false)}>

            {/* Photo */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>

                {/* Barre or supérieure */}
                <div className="absolute top-0 inset-x-0 h-px bg-gold z-20 origin-left transition-transform duration-500"
                     style={{ transform: hovered ? 'scaleX(1)' : 'scaleX(0)' }} />

                {/* Image ou placeholder */}
                {imgSrc ? (
                    <img src={imgSrc}
                         className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                         alt={member.name} loading="lazy" />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex flex-col items-center justify-center gap-4">
                        <svg className="w-16 h-16 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span className="font-lastica text-[7px] tracking-[3px] text-gold/20 uppercase">Photo à venir</span>
                    </div>
                )}

                {/* Overlay gradient permanent (bas) */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                     style={{ background: 'linear-gradient(to top, rgba(8,8,8,.9) 0%, transparent 100%)' }} />

                {/* Overlay bio au hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-7 transition-all duration-500 pointer-events-none"
                     style={{
                         background: 'linear-gradient(to top, rgba(8,8,8,.97) 0%, rgba(8,8,8,.75) 60%, rgba(196,162,103,.06) 100%)',
                         opacity: hovered ? 1 : 0,
                         transform: hovered ? 'translateY(0)' : 'translateY(12px)',
                     }}>
                    {member.bio && (
                        <p className="font-glacial text-xs text-white/60 leading-relaxed line-clamp-6">
                            {member.bio}
                        </p>
                    )}
                </div>

                {/* Numéro éditorial */}
                <div className="absolute top-4 right-4 z-10">
                    <span className="font-lastica text-[8px] tracking-[2px] text-white/20">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Infos en dessous */}
            <div className="pt-5 pb-2 border-b border-gold/0 group-hover:border-gold/20 transition-colors duration-500">
                <h3 className="font-glacial text-base text-white uppercase tracking-[3px] leading-tight mb-1.5">
                    {member.name}
                </h3>
                {member.role && (
                    <span className="font-lastica text-[8px] tracking-[4px] text-gold uppercase">
                        {member.role}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function APropos({ teamMembers }) {
    return (
        <Layout>
            <Head title="À Propos">
                <meta name="description" content="Découvrez l'histoire et l'équipe de MIA DREAMS & CO — maison de mode africaine éthique basée à Dakar." />
            </Head>

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <div className="relative h-[55vh] min-h-[440px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/index/home-image1.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(135deg, rgba(8,8,8,.95) 0%, rgba(8,8,8,.6) 60%, rgba(196,162,103,.06) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>
                        Notre histoire
                    </span>
                    <h1 className="display-title text-white mt-5 mb-5"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        À <span className="text-gold">PROPOS</span>
                    </h1>
                    <div className="gold-line-center"
                         style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            {/* ── STORY ────────────────────────────────────────────────────────── */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="reveal">
                            <span className="eyebrow">Notre origine</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                L'HISTOIRE <span className="text-gold">MIA DREAMS</span>
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-4">
                                MIA DREAMS & CO est née de la volonté de deux femmes entrepreneures passionnées de mode africaine,
                                qui ont décidé de valoriser le savoir-faire artisanal du continent.
                            </p>
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-4">
                                Basée à Dakar, notre maison de mode incarne l'excellence africaine contemporaine.
                                Chaque création est pensée pour sublimer la femme africaine d'aujourd'hui, fière de ses racines.
                            </p>
                            <p className="font-glacial text-sm text-[#777] leading-loose">
                                MIA signifie <span className="text-[#1a1a1a] font-medium">Made In Africa</span> — une philosophie qui guide
                                chacune de nos décisions, de la conception à la confection dans notre atelier au Sénégal.
                            </p>
                        </div>
                        <div className="reveal img-hover" style={{ transitionDelay: '.15s' }}>
                            <img src="/img/index/home-image6.jpg"
                                 className="w-full h-[500px] lg:h-auto object-cover object-top"
                                 alt="MIA DREAMS" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALEURS ──────────────────────────────────────────────────────── */}
            <section className="bg-texture py-24 lg:py-28">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Ce en quoi nous croyons</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">
                            NOS <span className="text-gold">VALEURS</span>
                        </h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
                        {[
                            { sym: '✦', title: 'Authenticité', desc: "Des pièces qui célèbrent l'identité africaine dans toute sa richesse." },
                            { sym: '◆', title: 'Excellence',   desc: 'Un savoir-faire artisanal de haute qualité, transmis de génération en génération.' },
                            { sym: '●', title: 'Responsabilité', desc: "Mode éthique et durable, respectueuse des artisans et de l'environnement." },
                            { sym: '▲', title: 'Innovation',   desc: 'Mariage du patrimoine culturel africain et de la création contemporaine.' },
                        ].map((v, i) => (
                            <div key={i}
                                 className="reveal group border border-gold/8 bg-[#0f0f0f] p-8 lg:p-10 text-center
                                            hover:border-gold/30 hover:bg-[#141414] transition-all duration-400"
                                 style={{ transitionDelay: `${i * 0.09}s` }}>
                                <div className="text-gold text-xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{v.sym}</div>
                                <h3 className="font-glacial text-[11px] text-white uppercase tracking-[4px] mb-4">{v.title}</h3>
                                <div className="w-5 h-px bg-gold/30 mx-auto mb-4 group-hover:w-8 transition-all duration-400" />
                                <p className="font-glacial text-xs text-white/35 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ÉQUIPE ───────────────────────────────────────────────────────── */}
            {teamMembers && teamMembers.length > 0 && (
                <section className="bg-[#080808] py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">

                        {/* En-tête */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 reveal">
                            <div>
                                <span className="eyebrow">Les visages derrière la marque</span>
                                <h2 className="display-title text-3xl lg:text-5xl text-white mt-4">
                                    NOTRE <span className="text-gold">ÉQUIPE</span>
                                </h2>
                            </div>
                            <p className="font-glacial text-sm text-white/30 max-w-xs leading-relaxed mt-4 lg:mt-0 lg:text-right">
                                Des femmes passionnées, au service de l'excellence africaine.
                            </p>
                        </div>

                        {/* Grille — 2 membres : layout 50/50 pleine largeur, sinon 3 colonnes */}
                        {teamMembers.length === 1 ? (
                            /* Layout solo — grand format centré */
                            <div className="max-w-sm mx-auto">
                                <MemberCard member={teamMembers[0]} index={0} />
                            </div>
                        ) : teamMembers.length === 2 ? (
                            /* Layout duo — deux grandes cartes côte à côte */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                {teamMembers.map((member, i) => (
                                    <MemberCard key={member.id} member={member} index={i} />
                                ))}
                            </div>
                        ) : (
                            /* Layout multi — 3 colonnes standard avec la 1ʳᵉ plus haute */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                                {teamMembers.map((member, i) => (
                                    <MemberCard key={member.id} member={member} index={i} />
                                ))}
                            </div>
                        )}

                        {/* Séparateur bas */}
                        <div className="mt-20 flex items-center gap-6 reveal">
                            <div className="flex-1 h-px bg-gold/8" />
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold/25 uppercase">MIA DREAMS & CO</span>
                            <div className="flex-1 h-px bg-gold/8" />
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ──────────────────────────────────────────────────────────── */}
            <div className="gold-strip py-16 text-center">
                <div className="relative z-10">
                    <span className="block font-lastica text-[8px] tracking-[5px] text-[#080808]/50 uppercase mb-4">Rejoignez l'aventure</span>
                    <h3 className="display-title text-2xl lg:text-3xl text-[#080808] tracking-[6px] mb-7">
                        TRAVAILLONS ENSEMBLE
                    </h3>
                    <Link href="/contact"
                          className="inline-flex items-center gap-3 font-glacial text-[10px] tracking-[4px] uppercase
                                     text-gold bg-[#080808] px-10 py-4 hover:bg-[#1c1c1c] transition-colors duration-300">
                        NOUS CONTACTER
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
