import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { imgSrc } from '../utils/imgSrc';
import { useLanguage } from '../context/LanguageContext';
import { isProfessionalEmail } from '../utils/proEmail';

export default function RapportActivite() {
    const { t } = useLanguage();
    const [rapports, setRapports] = useState([]);
    const [gate, setGate]         = useState(null);
    const [email, setEmail]       = useState('');
    const [status, setStatus]     = useState('idle'); // idle | loading | done | error
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef                = useRef(null);

    useEffect(() => {
        axios.get('/api/rapports', { params: { _t: Date.now() } }).then(res => setRapports(res.data)).catch(() => {});
    }, []);

    const openGate = (rap) => {
        setGate(rap);
        setEmail('');
        setStatus('idle');
        setErrorMsg('');
        setTimeout(() => inputRef.current?.focus(), 80);
    };

    const closeGate = () => { setGate(null); setStatus('idle'); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = email.trim();
        if (!value) return;

        // ── Vérification email professionnel côté client (feedback immédiat) ──
        if (!isProfessionalEmail(value)) {
            setErrorMsg(t('rapport_pro_error'));
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMsg('');

        // ── Enregistrement + revalidation serveur : bloque si l'email n'est pas pro ──
        try {
            await axios.post(`/api/rapports/${gate._id}/record`, { email: value });
        } catch (err) {
            setErrorMsg(err.response?.data?.message || t('rapport_pro_error'));
            setStatus('error');
            return; // on ne déclenche PAS le téléchargement si l'email est refusé
        }

        // ── Inscription newsletter — on tolère l'erreur « déjà inscrit » ──
        try {
            await axios.post('/api/newsletter', { email: value });
        } catch (_) { /* déjà inscrit ou erreur non bloquante : on continue le téléchargement */ }

        // ── Téléchargement (seulement après validation réussie) ──
        const a = document.createElement('a');
        a.href = `/api/rapports/${gate._id}/download`;
        a.download = `${gate.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setStatus('done');
        setTimeout(closeGate, 1800);
    };

    return (
        <Layout title="Rapport d'activité">
            {/* HERO */}
            <div className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image6.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>{t('rapport_eyebrow')}</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {t('rapport_title').split(' ').slice(0, 1).join(' ')} <span className="text-gold">{t('rapport_title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                </div>
            </div>

            <section className="bg-[#080808] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {rapports.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rapports.map((rap, i) => (
                                <div key={rap._id} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/25 transition-all duration-400" style={{ transitionDelay: `${i * 0.08}s` }}>
                                    {/* Cover */}
                                    <div className="relative overflow-hidden bg-[#141414]">
                                        {rap.cover_image
                                            ? <img src={imgSrc(rap.cover_image)} className="w-full h-auto block min-h-[180px] object-contain transition-transform duration-700 group-hover:scale-105" alt={rap.name} loading="lazy" />
                                            : <div className="w-full h-[240px] flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                              </div>
                                        }
                                        <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors" />
                                        {rap.period && (
                                            <span className="absolute top-3 left-3 font-lastica text-[8px] tracking-[2px] uppercase text-gold bg-[#080808]/80 border border-gold/25 px-2.5 py-1">
                                                {rap.period}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-6">
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-2 group-hover:text-gold transition-colors">{rap.name}</h3>
                                        {rap.description && (
                                            <p className="font-glacial text-sm text-white/60 leading-relaxed mb-5">{rap.description}</p>
                                        )}
                                        {rap.pdf_path ? (
                                            <button onClick={() => openGate(rap)}
                                                    className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {t('rapport_download')}
                                            </button>
                                        ) : (
                                            <span className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2 opacity-40 cursor-not-allowed">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {t('rapport_soon')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/55 tracking-[3px] uppercase">{t('rapport_empty')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* MODALE E-MAIL PROFESSIONNEL */}
            {gate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-[#080808]/90 backdrop-blur-sm"
                     onClick={closeGate}>
                    <div className="w-full max-w-sm bg-[#0f0f0f] border border-gold/20 shadow-2xl"
                         onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="relative p-6 pb-4 border-b border-white/5">
                            <button onClick={closeGate}
                                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-lg leading-none">✕</button>
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold uppercase block mb-2">{t('rapport_modal_title')}</span>
                            <p className="font-glacial text-base text-white uppercase tracking-[2px]">{gate.name}</p>
                        </div>

                        {/* Corps */}
                        <div className="p-6">
                            {status === 'done' ? (
                                <div className="text-center py-4">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </div>
                                    <p className="font-glacial text-sm text-white/70 tracking-[1px]">{t('loading')}</p>
                                    <p className="font-glacial text-xs text-gold/60 mt-1 tracking-[1px]">{t('rapport_success')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <p className="font-glacial text-sm text-white/65 leading-relaxed mb-5 tracking-[0.5px]">
                                        {t('rapport_email_intro')}
                                    </p>

                                    <div className="mb-4">
                                        <input
                                            ref={inputRef}
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setErrorMsg(''); } }}
                                            placeholder={t('rapport_email_placeholder')}
                                            className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors"
                                        />
                                        {errorMsg && (
                                            <p className="mt-2 font-glacial text-xs text-red-400/80 leading-relaxed">{errorMsg}</p>
                                        )}
                                    </div>

                                    <button type="submit" disabled={status === 'loading'}
                                            className="w-full btn btn-gold text-[9px] py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                        {status === 'loading' ? (
                                            <>
                                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                                </svg>
                                                {t('rapport_loading_btn')}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {t('rapport_download_btn')}
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-3 font-glacial text-[12px] text-white/45 text-center leading-relaxed">
                                        {t('rapport_disclaimer')}
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
