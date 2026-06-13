import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import { imgSrc } from '../../utils/imgSrc';
import { extractYoutubeId } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function ProgrammeDetail() {
    const { t } = useLanguage();
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
                    {/* Fond sombre toujours présent */}
                    <div style={{ position: 'absolute', inset: 0, background: '#0d0d0d' }} />
                    {/* Image par-dessus le fond */}
                    {heroImg && (
                        <img
                            src={heroImg}
                            alt={programme.name}
                            loading="eager"
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover', objectPosition: 'center top',
                            }}
                        />
                    )}
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-5 sm:px-10 lg:px-20">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>{t('prog_eyebrow')}</span>
                            <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                                {programme.name.includes(' ')
                                    ? <>{programme.name.split(' ').slice(0, -1).join(' ')}<br /><span className="text-gold">{programme.name.split(' ').slice(-1)}</span></>
                                    : <span className="text-gold">{programme.name}</span>
                                }
                            </h1>
                            <div style={{ opacity: 0, animation: 'fadeUp .7s 1s forwards' }}>
                                <a href="#inscription" className="btn btn-gold mt-8 inline-block">{t('prog_enroll_btn')}</a>
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
                            <span className="eyebrow">{t('prog_curriculum_eyebrow')}</span>
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
                                {programme.duration   && <InfoItem icon={<IcoClock />}  label={t('prog_duration')}   value={programme.duration} />}
                                {programme.price      && <InfoItem icon={<IcoPrice />}  label={t('prog_price')}   value={programme.price} />}
                                {programme.format     && <InfoItem icon={<IcoFormat />} label={t('prog_format')}  value={programme.format} />}
                                {programme.level      && <InfoItem icon={<IcoLevel />}  label={t('prog_level')}  value={programme.level} />}
                                {programme.start_date && <InfoItem icon={<IcoCal />}    label={t('prog_start_date')}   value={programme.start_date} />}
                                {programme.end_date   && <InfoItem icon={<IcoFlag />}   label={t('prog_end_date')}     value={programme.end_date} />}
                                {programme.max_places > 0 && (
                                    <InfoItem icon={<IcoUsers />} label={t('prog_places')} value={isFull ? t('prog_full') : `${placesLeft} place${placesLeft > 1 ? 's' : ''} restante${placesLeft > 1 ? 's' : ''}`} />
                                )}
                            </div>
                            <div className="mt-8">
                                {programme.is_open && !isFull ? (
                                    <a href="#inscription" className="btn btn-gold">{t('prog_enroll_cta')}</a>
                                ) : isFull ? (
                                    <div className="border border-red-200 bg-red-50 p-4">
                                        <p className="font-glacial text-sm text-red-600 mb-2">
                                            {t('prog_sold_out')}
                                        </p>
                                        <a href="/contact" className="font-glacial text-xs text-[#999] underline">{t('prog_contact')}</a>
                                    </div>
                                ) : (
                                    <div className="border border-gold/20 bg-[#fdf9f3] p-4">
                                        <p className="font-glacial text-sm text-[#6B4F3A] font-medium mb-1">
                                            {t('prog_coming_soon')}
                                        </p>
                                        {(programme.start_date || programme.end_date) && (
                                            <p className="font-glacial text-xs text-[#999] mt-1">
                                                {t('prog_next_session')}
                                                {programme.start_date && <> <span className="text-[#6B4F3A] font-medium">{programme.start_date}</span></>}
                                                {programme.start_date && programme.end_date && ' → '}
                                                {programme.end_date && <span className="text-[#6B4F3A] font-medium">{programme.end_date}</span>}
                                            </p>
                                        )}
                                        <a href="/contact" className="font-glacial text-xs text-gold underline mt-2 block">{t('prog_notify')}</a>
                                    </div>
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
                            <span className="eyebrow justify-center">{t('prog_curriculum_label')}</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">{t('prog_curriculum')}</h2>
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
                        <span className="eyebrow justify-center">{t('prog_join_title')}</span>
                        <h2 className="display-title text-3xl text-white mt-4 mb-4">{t('prog_form_title')}</h2>
                        {programme.max_places > 0 && !isFull && (
                            <p className="font-glacial text-sm text-gold/70">{placesLeft} place{placesLeft > 1 ? 's' : ''} restante{placesLeft > 1 ? 's' : ''}</p>
                        )}
                    </div>

                    {!programme.is_open || isFull ? (
                        <div className="text-center border border-gold/15 p-10">
                            <p className="font-glacial text-white/60 mb-6">
                                {isFull ? t('prog_full_msg') : t('prog_closed_msg')}
                            </p>
                            <Link to="/contact" className="btn btn-white">{t('prog_contact')}</Link>
                        </div>
                    ) : sent ? (
                        <div className="text-center border border-gold/15 p-10">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(201,168,76,0.15)' }}>
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <h3 className="font-glacial text-lg text-white uppercase tracking-[2px] mb-3">{t('prog_success_title')}</h3>
                            <p className="font-glacial text-sm text-white/55 leading-relaxed">
                                {t('prog_success_msg')}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">{t('prog_name')}</label>
                                    <input
                                        type="text" required
                                        value={form.nom}
                                        onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors"
                                        placeholder={t('prog_ph_name')}
                                    />
                                </div>
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">{t('prog_email')}</label>
                                    <input
                                        type="email" required
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors"
                                        placeholder={t('prog_ph_email')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">{t('prog_phone')}</label>
                                <input
                                    type="tel"
                                    value={form.telephone}
                                    onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                                    className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors"
                                    placeholder={t('prog_ph_phone')}
                                />
                            </div>
                            <div>
                                <label className="font-glacial text-[10px] tracking-[2px] text-white/40 uppercase block mb-2">{t('prog_motivation')}</label>
                                <textarea
                                    rows={4}
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="w-full bg-transparent border border-white/10 px-4 py-3 font-glacial text-sm text-white focus:border-gold/50 outline-none transition-colors resize-none"
                                    placeholder={t('prog_ph_motivation')}
                                />
                            </div>
                            {error && <p className="font-glacial text-sm text-red-400">{error}</p>}
                            <button
                                type="submit" disabled={sending}
                                className="btn btn-gold w-full justify-center"
                            >
                                {sending ? t('prog_submitting') : t('prog_submit')}
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
        <div className="border border-[#e8e0d0] p-4 relative overflow-hidden group hover:border-[#C4A267]/40 transition-colors"
             style={{ background: 'linear-gradient(135deg, #fff 0%, #fdfaf6 100%)' }}>
            {/* Reflet miroir subtil au hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{ background: 'linear-gradient(135deg, rgba(196,162,103,0.06) 0%, transparent 60%)' }} />
            <div className="text-[#C4A267] mb-2">{icon}</div>
            <p className="font-lastica text-[9px] tracking-[2px] text-[#999] uppercase mb-1">{label}</p>
            <p className="font-glacial text-sm text-[#1a1a1a] font-medium">{value}</p>
        </div>
    );
}

// ── Icônes SVG sémantiques ────────────────────────────────────────────────────
const ico = (d, vb = '0 0 24 24') => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox={vb}><path strokeLinecap="round" strokeLinejoin="round" d={d}/></svg>
);
const IcoClock = () => ico('M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l3 3');
const IcoPrice = () => ico('M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6');
const IcoFormat = () => ico('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0');
const IcoLevel = () => ico('M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z');
const IcoCal  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoFlag = () => ico('M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7');
const IcoUsers= () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
