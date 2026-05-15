import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { imgSrc } from '../utils/imgSrc';

// ── SVG icons for MVV cards (keyed by subtitle/label) ──────────────────────────
const MVV_ICONS = {
    Mission: 'M13 10V3L4 14h7v7l9-11h-7z',
    Vision:  'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    Valeurs: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
};
const DEFAULT_MVV_ICON = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

// ── Default fallback data ──────────────────────────────────────────────────────
const DEFAULT_MVV = [
    {
        subtitle: 'Vision',
        content: "Construire une Afrique où la femme leader s'impose par la force de son identité et la puissance du digital.",
    },
    {
        subtitle: 'Mission',
        content: "Accompagner les dirigeantes et entrepreneures africaines à travers une mode authentique, un personal branding stratégique et des outils technologiques innovants.",
    },
    {
        subtitle: 'Valeurs',
        content: '',
        bullets: [
            { label: 'Authenticité',  text: "Préserver l'héritage culturel et l'élégance des racines dans chaque création." },
            { label: 'Innovation',    text: "Mettre le digital et l'intelligence artificielle au service de la modernisation de l'artisanat." },
            { label: 'Excellence',    text: "Garantir une précision stratégique et une qualité irréprochable dans l'exécution de chaque projet." },
            { label: 'Transmission',  text: "Favoriser l'impact social en formant les artisans et en partageant les clés de la réussite entrepreneuriale." },
            { label: 'Audace',        text: "Encourager les femmes à briser les plafonds de verre et à revendiquer leur place dans l'économie de demain." },
        ],
    },
];

const DEFAULT_STATS = [
    { subtitle: '500+', title: 'Pièces créées' },
    { subtitle: '100+', title: 'Artisans soutenus' },
    { subtitle: '4',    title: 'Programmes actifs' },
    { subtitle: '5+',   title: "Années d'impact" },
];

const DEFAULT_ENGAGEMENTS = [
    {
        subtitle: '01',
        title: "L'Émancipation par le Leadership",
        content: "Nous nous engageons à transformer le potentiel des femmes africaines en une force économique réelle. Par le biais du Personal Branding et de la maîtrise de la posture, nous accompagnons les dirigeantes vers une visibilité accrue et un impact social durable.",
    },
    {
        subtitle: '02',
        title: "L'Innovation Technologique Responsable",
        content: "Nous faisons du digital un allié de l'artisanat. À travers notre application « Ma Petite Robe en Wax » et l'intégration de l'intelligence artificielle, nous modernisons les processus de création pour offrir des solutions de sur-mesure accessibles et performantes.",
    },
    {
        subtitle: '03',
        title: "La Préservation de l'Environnement",
        content: "Conscientes des enjeux écologiques, nous militons pour une mode éthique et durable.",
        bullets: [
            "Réduction des déchets : Nous privilégions la production à la demande pour éviter les stocks invendus et le gaspillage textile.",
            "Innovation 3D : L'utilisation de la technologie 3D nous permet de prototyper virtuellement nos créations, limitant ainsi la consommation de matières premières.",
            "Éco-responsabilité : Nous encourageons l'usage de ressources locales et des méthodes de production à faible impact environnemental.",
        ],
    },
    {
        subtitle: '04',
        title: "L'Impact Social et la Transmission",
        content: "Nous nous engageons à ne laisser personne de côté dans la transition numérique. À travers nos programmes de formation, nous assurons le renforcement des capacités des artisans tailleurs, garantissant ainsi leur insertion professionnelle et la pérennité des savoir-faire locaux.",
    },
    {
        subtitle: '05',
        title: "L'Excellence et l'Authenticité",
        content: "Chaque projet et chaque vêtement sont le reflet d'une exigence de qualité supérieure. Nous nous engageons à respecter l'héritage culturel africain tout en l'inscrivant dans une modernité sophistiquée et universelle.",
    },
];

export default function Impact() {
    const [initiatives, setInitiatives] = useState([]);
    const [stats, setStats]             = useState([]);

    useEffect(() => {
        axios.get('/api/impact').then(res => setInitiatives(res.data.initiatives || [])).catch(() => {});
        axios.get('/api/sections', { params: { page: 'impact', type: 'impact_stat' } })
            .then(r => { if (r.data.length) setStats(r.data); }).catch(() => {});
    }, []);

    const activeMvv         = DEFAULT_MVV;
    const activeStats       = stats.length > 0 ? stats : DEFAULT_STATS;
    const activeEngagements = DEFAULT_ENGAGEMENTS;

    return (
        <Layout title="Notre Impact">
            {/* HERO */}
            <div className="relative h-[45vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image6.jpg')", filter: 'brightness(.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.3) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Ethical Fashion</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOTRE <span className="text-gold">IMPACT</span>
                    </h1>
                </div>
            </div>

            {/* MISSION / VISION / VALEURS */}
            <section className="bg-[#0d0d0d] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className={`grid grid-cols-1 gap-px ${activeMvv.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                        {activeMvv.map((item, i) => {
                            const icon = MVV_ICONS[item.subtitle] || DEFAULT_MVV_ICON;
                            return (
                                <div key={item._id || i}
                                     className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-10 transition-colors"
                                     style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={icon}/>
                                        </svg>
                                    </div>
                                    <span className="font-lastica text-[9px] tracking-[4px] text-gold/60 uppercase block mb-3">{item.subtitle}</span>
                                    {item.content && (
                                        <p className="font-glacial text-sm text-white/50 leading-relaxed">{item.content}</p>
                                    )}
                                    {item.bullets && (
                                        <ul className="space-y-3 mt-1">
                                            {item.bullets.map(b => (
                                                <li key={b.label} className="flex items-start gap-2.5 font-glacial text-xs text-white/45 leading-relaxed">
                                                    <span className="w-1 h-1 rounded-full bg-gold/60 mt-1.5 flex-shrink-0" />
                                                    <span><span className="text-white/70 font-semibold">{b.label}</span> : {b.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* STATS */}
            <div className="gold-strip py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className={`grid gap-8 text-center ${activeStats.length <= 2 ? 'grid-cols-2' : activeStats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
                        {activeStats.map((s, i) => (
                            <div key={s._id || i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <p className="font-glacial text-3xl lg:text-4xl font-light text-[#080808]">{s.subtitle}</p>
                                <p className="font-lastica text-[7px] tracking-[4px] text-[#080808]/55 uppercase mt-2">{s.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ENGAGEMENTS */}
            <section className="bg-[#080808] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Ce que nous faisons concrètement</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">ENGAGEMENTS</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
                        {activeEngagements.map((e, i) => (
                            <div key={e._id || i}
                                 className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-10 transition-colors"
                                 style={{ transitionDelay: `${i * 0.08}s` }}>
                                <div className="flex items-center gap-4 mb-5">
                                    <span className="font-lastica text-[9px] tracking-[4px] text-gold/40">{e.subtitle}</span>
                                    <div className="flex-1 h-px bg-gold/10" />
                                </div>
                                <h3 className="font-glacial text-base text-white uppercase tracking-[2px] mb-4 group-hover:text-gold transition-colors">{e.title}</h3>
                                {e.content && (
                                    <p className="font-glacial text-sm text-white/40 leading-relaxed">{e.content}</p>
                                )}
                                {e.bullets && (
                                    <ul className="space-y-2.5 mt-3">
                                        {e.bullets.map((b, bi) => (
                                            <li key={bi} className="flex items-start gap-2.5 font-glacial text-xs text-white/35 leading-relaxed">
                                                <span className="w-1 h-1 rounded-full bg-gold/50 mt-1.5 flex-shrink-0" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INITIATIVES DB */}
            {initiatives.length > 0 && (
                <section className="bg-texture py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-16 reveal">
                            <span className="eyebrow justify-center">Projets en cours</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">INITIATIVES</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {initiatives.map((init, i) => (
                                <div key={init._id} className="reveal border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 overflow-hidden transition-colors group" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    {init.youtube_id && (
                                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                            <iframe className="absolute inset-0 w-full h-full"
                                                    src={`https://www.youtube.com/embed/${init.youtube_id}`}
                                                    frameBorder="0" allowFullScreen loading="lazy" title={init.name} />
                                        </div>
                                    )}
                                    {init.image && !init.youtube_id && (
                                        <img src={imgSrc(init.image)} className="w-full h-48 object-cover object-top" alt={init.name} loading="lazy" />
                                    )}
                                    <div className="p-7">
                                        <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{init.name}</h3>
                                        {init.description && <p className="font-glacial text-sm text-white/40 leading-relaxed">{init.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-[#080808] py-24 text-center border-t border-gold/8">
                <div className="max-w-xl mx-auto px-6 reveal">
                    <span className="eyebrow justify-center">Rejoignez le mouvement</span>
                    <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-6">MODE <span className="text-gold">RESPONSABLE</span></h2>
                    <p className="font-glacial text-sm text-white/40 leading-loose mb-10">Chaque achat, chaque collaboration est un acte pour une mode plus juste, plus belle et plus africaine.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="/contact" className="btn btn-gold">NOUS REJOINDRE</a>
                        <a href="/reservation" className="btn btn-white">PRENDRE RDV</a>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
