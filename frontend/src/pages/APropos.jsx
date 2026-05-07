import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function TeamModal({ member, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
             style={{ background: 'rgba(8,8,8,.92)' }}
             onClick={onClose}>
            <div className="relative w-full max-w-lg border border-gold/15 overflow-hidden"
                 style={{ background: '#0d0d0d' }}
                 onClick={e => e.stopPropagation()}>

                {/* Bouton fermer */}
                <button onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border border-white/10 text-white/30 hover:text-gold hover:border-gold/30 transition-all">
                    ✕
                </button>

                {/* Photo pleine largeur */}
                <div className="relative overflow-hidden" style={{ height: 320 }}>
                    {member.photo
                        ? <img src={`/uploads/${member.photo}`}
                               className="w-full h-full object-cover object-top"
                               alt={member.name} />
                        : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(196,162,103,0.06)' }}>
                              <span className="font-glacial text-7xl text-gold/20">{member.name[0]}</span>
                          </div>
                    }
                    {/* Gradient bas */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.3) 50%, transparent 100%)' }} />
                    {/* Trait doré en haut */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gold/30" />
                </div>

                {/* Infos */}
                <div className="px-8 pb-8 -mt-6 relative z-10">
                    {member.role && (
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold/60 uppercase block mb-3">{member.role}</span>
                    )}
                    <h3 className="font-glacial text-2xl text-white uppercase tracking-[3px] mb-4">{member.name}</h3>
                    <div className="w-8 h-px mb-5" style={{ background: '#C9A84C' }} />
                    {member.bio && (
                        <p className="font-glacial text-sm text-white/50 leading-relaxed">{member.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const DEFAULT_HISTOIRE = {
    subtitle: 'Depuis 2018',
    title: 'NOTRE HISTOIRE',
    content: "MIA DREAMS & CO est une startup sénégalaise qui diffuse l'ensemble de la richesse culturelle du continent africain à travers la mode, le style et l'entrepreneuriat.\n\nFondée à Dakar, notre maison de mode incarne un univers contemporain africain. Notre savoir-faire dans l'industrie textile est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique.",
    image: null,
};

const DEFAULT_STATS = [
    { subtitle: '5+', title: "Années d'expérience" },
    { subtitle: '4', title: 'Marques & offres' },
    { subtitle: '100+', title: 'Clients satisfaits' },
];

const DEFAULT_VALEURS = [
    { subtitle: '01', title: 'Authenticité', content: "Chaque création reflète l'âme de l'Afrique, ses traditions et sa modernité." },
    { subtitle: '02', title: 'Excellence', content: 'Nous visons la perfection dans chaque détail, chaque tissu, chaque couture.' },
    { subtitle: '03', title: 'Innovation', content: "Allier savoir-faire artisanal et vision contemporaine pour créer l'unique." },
    { subtitle: '04', title: 'Durabilité', content: "Une mode responsable qui respecte les artisans, les matières et l'environnement." },
    { subtitle: '05', title: 'Communauté', content: "Créer du lien, valoriser les talents locaux et soutenir l'entrepreneuriat africain." },
    { subtitle: '06', title: 'Empowerment', content: "Permettre à chacun d'exprimer son identité et d'affirmer sa singularité." },
];

export default function APropos() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [histoire, setHistoire]       = useState(null);
    const [stats, setStats]             = useState([]);
    const [valeurs, setValeurs]         = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        axios.get('/api/apropos').then(res => setTeamMembers(res.data.teamMembers || [])).catch(() => {});
        axios.get('/api/sections', { params: { page: 'apropos', type: 'histoire' } })
            .then(r => { if (r.data[0]) setHistoire(r.data[0]); }).catch(() => {});
        axios.get('/api/sections', { params: { page: 'apropos', type: 'stat' } })
            .then(r => { if (r.data.length) setStats(r.data); }).catch(() => {});
        axios.get('/api/sections', { params: { page: 'apropos', type: 'valeur' } })
            .then(r => { if (r.data.length) setValeurs(r.data); }).catch(() => {});
    }, []);

    const h = histoire || DEFAULT_HISTOIRE;
    const activeStats = stats.length > 0 ? stats : DEFAULT_STATS;
    const activeValeurs = valeurs.length > 0 ? valeurs : DEFAULT_VALEURS;

    // Split histoire content on newlines for multiple paragraphs
    const histoireParagraphs = (h.content || '').split('\n').filter(Boolean);
    const histoireImg = h.image
        ? (h.image.startsWith('/') ? h.image : `/uploads/${h.image}`)
        : '/img/index/home-image2.jpg';

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
                            <img src={histoireImg} className="w-full h-[500px] object-cover object-top" alt="MIA DREAMS" loading="lazy" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">{h.subtitle || 'Depuis 2018'}</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 leading-tight">
                                NOTRE <span className="text-gold">HISTOIRE</span>
                            </h2>
                            <div className="gold-line my-6" />
                            {histoireParagraphs.length > 0
                                ? histoireParagraphs.map((para, i) => (
                                    <p key={i} className={`font-glacial text-sm text-white/55 leading-loose ${i < histoireParagraphs.length - 1 ? 'mb-6' : 'mb-8'}`}>
                                        {para}
                                    </p>
                                ))
                                : <p className="font-glacial text-sm text-white/55 leading-loose mb-8">{h.content}</p>
                            }
                            <div className="grid grid-cols-3 gap-6">
                                {activeStats.map((s, i) => (
                                    <div key={s._id || i} className="text-center">
                                        <p className="font-glacial text-2xl text-gold font-light">{s.subtitle}</p>
                                        <p className="font-lastica text-[7px] tracking-[3px] text-white/30 uppercase mt-1">{s.title}</p>
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
                        {activeValeurs.map((v, i) => (
                            <div key={v._id || i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-8 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <span className="font-lastica text-[9px] tracking-[4px] text-gold/40 block mb-4">{v.subtitle}</span>
                                <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{v.title}</h3>
                                <div className="w-6 h-px bg-gold/30 mb-4" />
                                <p className="font-glacial text-xs text-white/35 leading-relaxed">{v.content}</p>
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
                                <div key={m._id}
                                     className="reveal group text-center cursor-pointer"
                                     style={{ transitionDelay: `${i * 0.1}s` }}
                                     onClick={() => setSelectedMember(m)}>
                                    <div className="relative overflow-hidden mb-5 mx-auto" style={{ width: 220, height: 260 }}>
                                        {m.photo
                                            ? <img src={`/uploads/${m.photo}`}
                                                   className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                   alt={m.name} loading="lazy" />
                                            : <div className="w-full h-full flex items-center justify-center border border-gold/20"
                                                   style={{ background: 'rgba(196,162,103,0.06)' }}>
                                                  <span className="font-glacial text-5xl text-gold/30">{m.name[0]}</span>
                                              </div>
                                        }
                                        {/* Overlay hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
                                             style={{ background: 'rgba(8,8,8,0.55)' }}>
                                            <div className="border border-gold/50 px-4 py-2">
                                                <span className="font-lastica text-[7px] tracking-[3px] text-gold uppercase">Voir le profil</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-400" />
                                        <div className="absolute bottom-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/20 transition-colors duration-400" />
                                    </div>
                                    <h3 className="font-glacial text-base text-white uppercase tracking-[2px] mb-1 group-hover:text-gold transition-colors duration-300">{m.name}</h3>
                                    {m.role && <p className="font-lastica text-[8px] tracking-[3px] text-gold/50 uppercase">{m.role}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            {selectedMember && (
                <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />
            )}
        </Layout>
    );
}
