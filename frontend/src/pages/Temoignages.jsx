import { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const STARS = [1, 2, 3, 4, 5];

export default function Temoignages() {
    const { t } = useLanguage();
    const [form, setForm]         = useState({ name: '', email: '', rating: 5, programme: '', message: '' });
    const [hover, setHover]       = useState(0);
    const [status, setStatus]     = useState('idle'); // idle | loading | done | error
    const [errorMsg, setErrorMsg] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.message.trim()) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            await axios.post('/api/testimonials', {
                name:      form.name.trim(),
                email:     form.email.trim(),
                rating:    form.rating,
                programme: form.programme.trim(),
                message:   form.message.trim(),
                is_approved: false,
            });
            setStatus('done');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Une erreur est survenue.');
            setStatus('error');
        }
    };

    return (
        <Layout title="Laisser un avis">
            {/* HERO */}
            <div className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>{t('temoignages_eyebrow')}</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {t('temoignages_title').split(' ').slice(0,1).join(' ')} <span className="text-gold">{t('temoignages_title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="font-glacial text-white/50 text-sm mt-4 tracking-widest" style={{ opacity: 0, animation: 'fadeUp .9s .7s forwards' }}>
                        {t('temoignages_subtitle')}
                    </p>
                </div>
            </div>

            <section className="bg-[#080808] py-20">
                <div className="max-w-2xl mx-auto px-6">

                    {status === 'done' ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h2 className="font-glacial text-xl text-white uppercase tracking-[4px] mb-3">{t('temoignages_success_title')}</h2>
                            <p className="font-glacial text-sm text-white/55 leading-relaxed">
                                {t('temoignages_success_msg')}
                            </p>
                            <div className="w-10 h-px bg-gold/30 mx-auto mt-8" />
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                                <p className="font-glacial text-sm text-white/55 tracking-[2px] leading-relaxed">
                                    Votre expérience nous aide à grandir et guide les futures clientes.<br/>Prenez un moment pour partager votre ressenti.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Note en étoiles */}
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[3px] uppercase text-gold block mb-3">{t('temoignages_rating')}</label>
                                    <div className="flex gap-2">
                                        {STARS.map(s => (
                                            <button key={s} type="button"
                                                onMouseEnter={() => setHover(s)}
                                                onMouseLeave={() => setHover(0)}
                                                onClick={() => set('rating', s)}
                                                className="text-3xl transition-transform hover:scale-110 focus:outline-none">
                                                <span style={{ color: s <= (hover || form.rating) ? '#C9A84C' : '#2D2D2D' }}>★</span>
                                            </button>
                                        ))}
                                        <span className="font-glacial text-sm text-white/40 self-center ml-2">
                                            {['', t('temoignages_rating1'), t('temoignages_rating2'), t('temoignages_rating3'), t('temoignages_rating4'), t('temoignages_rating5')][hover || form.rating]}
                                        </span>
                                    </div>
                                </div>

                                {/* Nom */}
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[3px] uppercase text-white/50 block mb-2">{t('temoignages_name')}</label>
                                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                                        placeholder={t('temoignages_ph_name')}
                                        className="w-full bg-[#0f0f0f] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[3px] uppercase text-white/50 block mb-2">{t('temoignages_email')}</label>
                                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                        placeholder={t('temoignages_ph_email')}
                                        className="w-full bg-[#0f0f0f] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors" />
                                </div>

                                {/* Programme / Produit */}
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[3px] uppercase text-white/50 block mb-2">{t('temoignages_programme')}</label>
                                    <input value={form.programme} onChange={e => set('programme', e.target.value)}
                                        placeholder={t('temoignages_ph_programme')}
                                        className="w-full bg-[#0f0f0f] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors" />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="font-glacial text-[10px] tracking-[3px] uppercase text-white/50 block mb-2">{t('temoignages_message')}</label>
                                    <textarea required value={form.message} onChange={e => set('message', e.target.value)}
                                        placeholder={t('temoignages_ph_message')}
                                        rows={5}
                                        className="w-full bg-[#0f0f0f] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors resize-none" />
                                </div>

                                {errorMsg && (
                                    <p className="font-glacial text-xs text-red-400/80">{errorMsg}</p>
                                )}

                                <button type="submit" disabled={status === 'loading'}
                                    className="w-full btn btn-gold text-[9px] py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {status === 'loading' ? (
                                        <>
                                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            {t('temoignages_submitting')}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                            </svg>
                                            {t('temoignages_submit')}
                                        </>
                                    )}
                                </button>

                                <p className="font-glacial text-[11px] text-white/30 text-center leading-relaxed">
                                    {t('temoignages_disclaimer')}
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </Layout>
    );
}
