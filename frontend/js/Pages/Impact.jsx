import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Components/Layout';

// ─── Compteur animé ────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = Date.now();
                const tick = () => {
                    const elapsed = Date.now() - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Easing out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>;
}

const STATS = [
    { value: 500,  suffix: '+',   label: 'Clients satisfaits' },
    { value: 100,  suffix: '%',   label: 'Made In Africa' },
    { value: 8,    suffix: ' ans', label: 'D\'expérience' },
    { value: 1200, suffix: '+',   label: 'Pièces créées' },
];

const DEFAULT_ICONS = {
    mission: '/img/impact/symbole1.png',
    vision:  '/img/impact/symbole2.png',
    value:   '/img/impact/symbole3.png',
};

const DEFAULT_SECTIONS = [
    { type: 'mission', title: 'MISSION', content: "Rendre accessible l'artisanat africain d'excellence à travers des créations uniques et responsables." },
    { type: 'vision',  title: 'VISION',  content: "Faire de l'artisanat africain ce qui a de plus noble et de plus abouti — une référence mondiale." },
    { type: 'value',   title: 'VALEURS', content: 'Créativité & innovation · Professionnalisme · Mode responsable · Made In Africa' },
];

const DEFAULT_INITIATIVES = [
    { name: 'Made In Africa', description: '100% de nos créations sont fabriquées sur le continent africain.' },
    { name: 'Artisans', description: 'Nous valorisons et rémunérons équitablement chaque artisan partenaire.' },
    { name: 'Matières', description: 'Sélection rigoureuse de matières locales et eco-responsables.' },
    { name: 'Formation', description: 'Programme de formation pour transmettre le savoir-faire africain.' },
];

export default function Impact({ sections, initiatives }) {
    const impactSections = sections
        ? sections.filter(s => ['mission','vision','value'].includes(s.type))
        : DEFAULT_SECTIONS;

    const engagements = initiatives && initiatives.length > 0 ? initiatives : DEFAULT_INITIATIVES;

    return (
        <Layout>
            <Head title="Notre Impact">
                <meta name="description" content="L'impact social et environnemental de MIA DREAMS & CO. Mode africaine responsable, atelier de confection, artisans valorisés." />
                <meta property="og:image" content="/img/impact/impact.jpg" />
            </Head>

            {/* HERO */}
            <div className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/impact/impact.jpg')", filter: 'brightness(.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(13,13,13,.6) 0%,rgba(13,13,13,.95) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="block font-lastica text-[10px] tracking-[6px] text-gold uppercase mb-5"
                          style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Engagement & responsabilité</span>
                    <h1 className="font-glacial font-light text-white uppercase tracking-[6px] mb-5"
                        style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOTRE <span className="text-gold">IMPACT</span>
                    </h1>
                    <div className="w-12 h-px bg-gold mx-auto" style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }} />
                </div>
            </div>

            {/* MISSION / VISION / VALEURS */}
            <section className="bg-[#0d0d0d] py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Ce qui nous anime</span>
                        <h2 className="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">
                            CULTURE <span className="text-gold">D'ENTREPRISE</span>
                        </h2>
                        <div className="w-10 h-px bg-gold mx-auto mt-5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {impactSections.map((sec, i) => (
                            <div key={sec.type || i}
                                 className="reveal text-center border border-gold/10 p-10 hover:border-gold/30 transition-colors duration-300 group"
                                 style={{ transitionDelay: `${i * 0.12}s` }}>
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                                    <img src={sec.image ? `/storage/${sec.image}` : DEFAULT_ICONS[sec.type] || DEFAULT_ICONS.mission}
                                         className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                         style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)' }}
                                         alt={sec.title} />
                                </div>
                                <span className="block font-lastica text-[9px] tracking-[4px] text-gold uppercase mb-4">{sec.title}</span>
                                {sec.subtitle && <p className="font-glacial text-xs text-gold/50 tracking-wide mb-2">{sec.subtitle}</p>}
                                <p className="font-glacial text-sm text-white/45 leading-relaxed">{sec.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* NOS ENGAGEMENTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal">
                            <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Notre promesse</span>
                            <h2 className="font-glacial text-4xl font-light text-white uppercase tracking-[3px] leading-tight mb-3">
                                NOS <span className="text-gold">ENGAGEMENTS</span>
                            </h2>
                            <div className="w-10 h-px bg-gold my-5" />
                            <p className="font-glacial text-sm text-white/50 leading-loose mb-5">
                                Chez nous, la durabilité n'est pas un simple point de destination, mais un périple incessant.
                                Chaque jour, nous nous engageons dans ce voyage, guidés par notre conviction profonde.
                            </p>
                            <p className="font-glacial text-sm text-white/50 leading-loose">
                                Nous sommes pleinement conscients que notre parcours est semé d'embûches. Cependant, nous restons
                                résolus à honorer notre engagement en tant qu'entreprise de mode responsable.
                            </p>
                        </div>
                        <div className="reveal grid grid-cols-2 gap-4" style={{ transitionDelay: '.15s' }}>
                            {engagements.map((eng, j) => (
                                <div key={j} className="bg-[#1a1a1a] border border-gold/10 p-5 hover:border-gold/30 transition-colors duration-300 group">
                                    {eng.image ? (
                                        <img src={`/storage/${eng.image}`}
                                             className="w-10 h-10 object-cover mb-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                             alt={eng.name} />
                                    ) : (
                                        <div className="w-8 h-8 border border-gold/30 flex items-center justify-center mb-3">
                                            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                            </svg>
                                        </div>
                                    )}
                                    <h4 className="font-glacial text-[11px] tracking-[2px] text-gold uppercase mb-2">{eng.name}</h4>
                                    <p className="font-glacial text-xs text-white/40 leading-relaxed">{eng.description}</p>
                                    {eng.youtube_id && (
                                        <a href={`https://youtube.com/watch?v=${eng.youtube_id}`} target="_blank" rel="noopener"
                                           className="inline-block mt-3 font-lastica text-[8px] tracking-[2px] text-gold/50 hover:text-gold uppercase transition-colors">
                                            ▶ Voir la vidéo
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CHIFFRES CLÉS */}
            <section className="bg-gold py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {STATS.map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="font-glacial font-light text-[#0d0d0d] leading-none mb-2"
                                   style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
                                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                                </p>
                                <p className="font-lastica text-[8px] tracking-[3px] text-[#0d0d0d]/60 uppercase">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ATELIER */}
            <section className="bg-[#111] py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-14 reveal">
                        <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-3">Fait au Sénégal</span>
                        <h2 className="font-glacial text-4xl font-light text-white uppercase tracking-[3px]">
                            NOTRE <span className="text-gold">ATELIER</span>
                        </h2>
                        <div className="w-10 h-px bg-gold mx-auto mt-5" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="reveal relative overflow-hidden group">
                            <img src="/img/impact/impact.jpg"
                                 className="w-full h-[420px] lg:h-auto object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                 style={{ filter: 'brightness(.75)' }} alt="Atelier de confection" loading="lazy" />
                            <div className="absolute inset-0 border border-gold/10 pointer-events-none" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <p className="font-glacial text-sm text-white/50 leading-loose mb-6">
                                Toutes nos créations sont produites en série limitée dans notre atelier de confection basé au
                                Sénégal, afin de maîtriser notre production et de créer de l'emploi local.
                            </p>
                            <p className="font-glacial text-sm text-white/50 leading-loose mb-8">
                                Notre atelier à taille humaine est parfaitement équipé avec des machines de qualité
                                pour offrir de belles finitions et garantir l'excellence de chaque pièce.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['Série limitée', 'Fait main', 'Qualité premium', 'Local & éthique'].map(tag => (
                                    <span key={tag} className="font-lastica text-[8px] tracking-[3px] uppercase text-gold border border-gold/30 px-4 py-2">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODE RESPONSABLE */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                     style={{ backgroundImage: "url('/img/impact/impact1.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'rgba(13,13,13,.6)' }} />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center reveal">
                    <span className="block font-lastica text-[9px] tracking-[5px] text-gold uppercase mb-5">Notre philosophie</span>
                    <h2 className="font-glacial font-light text-white uppercase tracking-[4px] mb-8"
                        style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
                        UNE MODE <span className="text-gold">RESPONSABLE</span>
                    </h2>
                    <p className="font-glacial text-base text-white/50 leading-loose max-w-2xl mx-auto mb-10">
                        Nous croyons que la mode peut être un vecteur de changement positif. Chaque pièce que nous
                        créons raconte une histoire — celle d'un artisan, d'un territoire, d'un héritage qui mérite
                        d'être célébré et transmis aux générations futures.
                    </p>
                    <Link href="/contact"
                          className="inline-block font-glacial text-[11px] tracking-[4px] uppercase text-gold border border-gold px-10 py-4 hover:bg-gold hover:text-[#0d0d0d] transition-all duration-300">
                        NOUS REJOINDRE
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
