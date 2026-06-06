import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { imgSrc } from '../../utils/imgSrc';
import { extractYoutubeId } from '../../utils/formatters';

export default function ProgrammeDetail() {
    const { slug } = useParams();
    const [programme, setProgramme] = useState(null);
    const [inscCount, setInscCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`/api/programmes/${slug}`)
            .then(r => { setProgramme(r.data.programme); setInscCount(r.data.inscriptions_count || 0); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    const placesLeft = programme?.max_places > 0 ? programme.max_places - inscCount : null;
    const isFull = placesLeft !== null && placesLeft <= 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.nom.trim() || !form.email.trim()) { setError('Nom et email requis.'); return; }
        setSending(true);
        try {
            await axios.post(`/api/programmes/${slug}/inscriptions`, form);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi. Réessayez.');
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <Layout title="Formation">
            <div style={{ height: '80vh', background: '#080808' }} />
        </Layout>
    );

    if (!programme) return (
        <Layout title="Formation introuvable">
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <div className="text-center">
                    <p className="font-glacial text-white/50 mb-6">Programme introuvable.</p>
                    <Link to="/programmes" className="btn btn-gold">Voir tous les programmes</Link>
                </div>
            </div>
        </Layout>
    );

    const heroImg   = programme.image    ? imgSrc(programme.image) : null;
    const youtubeId = extractYoutubeId(programme.youtube_id);

    return (
        <Layout title={programme.name}>
            {/* HERO */}
            <div className="hero-carousel" style={{ height: '80vh' }}>
                <div className="hero-slide active">
                    {heroImg
                        ? <img
                            src={heroImg}
                            alt={programme.name}
                            loading="eager"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        : <div className="absolute inset-0 bg-[#0d0d0d]" />
                    }
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Formation</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                {programme.name.includes(' ')
                                    ? <>{programme.name.split(' ').slice(0, -1).join(' ')}<br /><span className="text-gold">{programme.name.split(' ').slice(-1)}</span></>
                                    : <span className="text-gold">{programme.name}</span>
                                }
                            </h1>
                            <div style={{ opacity: 0, animation: 'fadeUp .7s 1s forwards' }}>
                                <a href="#inscription" className="btn btn-gold mt-8 inline-block">S'INSCRIRE</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRÉSENTATION */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
                        <div className="reveal">
                            {youtubeId ? (
                                <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer"
                                   className="relative w-full block group overflow-hidden"
                                   style={{ paddingBottom: '56.25%', background: '#111' }}>
                                    <img src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} alt={programme.name}
                                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                         onError={e => { e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; }} />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.95)' }}>
                                            <svg className="w-6 h-6 ml-1" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                </a>
                            ) : heroImg ? (
                                <img src={heroImg} className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover object-top" alt={programme.name} />
                            ) : (
                                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-[#111]" />
                            )}
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">La formation</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                {programme.name.toUpperCase()}
                            </h2>
                            <div className="gold-line my-6" />
                            {programme.description && (
                                <p className="font-glacial text-sm text-[#444] leading-loose mb-6">
                                    {programme.description}
                                </p>
                            )}
                            {/* Infos formation */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {programme.duration   && <InfoItem icon="⏱" label="Durée"   value={programme.duration} />}
                                {programme.price      && <InfoItem icon="💰" label="Tarif"   value={programme.price} />}
                                {programme.format     && <InfoItem icon="📍" label="Format"  value={programme.format} />}
                                {programme.level      && <InfoItem icon="📚" label="Niveau"  value={programme.level} />}
                                {programme.start_date && <InfoItem icon="📅" label="Début"   value={programme.start_date} />}
                                {programme.max_places > 0 && (
                                    <InfoItem icon="👥" label="Places" value={isFull ? 'Complet' : `${placesLeft} place${placesLeft > 1 ? 's' : ''} restante${placesLeft > 1 ? 's' : ''}`} />
                                )}
                            </div>
                            <div className="mt-8">
                                {programme.is_open && !isFull ? (
                                    <a href="#inscription" className="btn btn-gold">S'INSCRIRE À CETTE FORMATION</a>
                                ) : (
                                    <span className="font-glacial text-sm text-[#999]">
                                        {isFull ? 'Places épuisées — contactez-nous pour être sur liste d\'attente.' : 'Inscriptions fermées pour le moment.'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULES */}
            {programme.modules && programme.modules.length > 0 && (
                <section className="bg-texture py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-16 reveal">
                            <span className="eyebrow justify-center">Curriculum</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">LE <span className="text-gold">PROGRAMME</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
                            {programme.modules.map((m, i) => (
                                <div key={i} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/20 p-10 transition-colors" style={{ transitionDelay: `${i * 0.08}s` }}>
                                    <div className="flex items-start gap-6">
                                        <span className="font-lastica text-[12px] tracking-[4px] text-gold/40 flex-shrink-0 mt-1">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h3 className="font-glacial text-base text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors">{m.title}</h3>
                                            {m.description && <p className="font-glacial text-sm text-white/60 leading-relaxed">{m.description}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FORMULAIRE INSCRIPTION */}
            <section id="inscription" className="bg-[#080808] py-24 lg:py-32 border-t border-gold/8">
                <div className="max-w-2xl mx-auto px-6 reveal">
                    <div className="text-center mb-12">
                        <span className="eyebrow justify-center">Rejoindre la formation</span>
                        <h2 className="display-title text-3xl text-white mt-4 mb-4">S'INSCRIRE AU <span className="text-gold">PROGRAMME</span></h2>
                        {programme.max_places > 0 && !isFull && (
                            <p className="font-glacial text-sm text-gold/70">{placesLeft} place{placesLeft > 1 ? 's' : ''} restante{placesLeft > 1 ? 's' : ''}</p>
                        )}
                    </div>

                    {!programme.is_open || isFull ? (
                        <div className="text-center border border-gold/15 p-10">
                            <p className="font-glacial text-white/60 mb-6">
                                {isFull ? 'Toutes les places sont prises pour cette formation.' : 'Les inscriptions sont actuellement fermées.'}
                            </p>
                            <Link to="/contact" className="btn btn-white">NOUS CONTACTER</Link>
                        </div>
                    ) : sent ? (
                        <div className="text-center border border-gold/15 p-10">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(201,168,76,0.15)' }}>
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3">Inscription reçue !</h3>
                            <p className="font-glacial text-sm text-white/55 leading-relaxed">
                                Merci pour votre inscription à <strong className="text-gold">{programme.name}</strong>. Nous vous contacterons sous peu pour les prochaines étapes.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">Nom complet *</label>
                                    <input
                                        type="text" required
                                        value={form.nom}
                                        onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">Email *</label>
                                    <input
                                        type="email" required
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors"
                                        placeholder="votre@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    value={form.telephone}
                                    onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                                    className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors"
                                    placeholder="+221 XX XXX XX XX"
                                />
                            </div>
                            <div>
                                <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">Message / Motivation</label>
                                <textarea
                                    rows={4}
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors resize-none"
                                    placeholder="Parlez-nous de vous et de vos motivations…"
                                />
                            </div>
                            {error && <p className="font-glacial text-sm text-red-400">{error}</p>}
                            <button
                                type="submit" disabled={sending}
                                className="btn btn-gold w-full justify-center"
                            >
                                {sending ? 'Envoi en cours…' : "S'INSCRIRE À LA FORMATION"}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </Layout>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="border border-[#e8e0d0] p-4">
            <div className="text-lg mb-1">{icon}</div>
            <p className="font-lastica text-[9px] tracking-[2px] text-[#999] uppercase mb-1">{label}</p>
            <p className="font-glacial text-sm text-[#1a1a1a] font-medium">{value}</p>
        </div>
    );
}
