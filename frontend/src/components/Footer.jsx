import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const SOCIAL_ICONS = {
    facebook:  { bg: '#1877F2', svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' },
    instagram: { bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)', svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>' },
    youtube:   { bg: '#FF0000', svg: '<path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>' },
    linkedin:  { bg: '#0A66C2', svg: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' },
    tiktok:    { bg: '#010101', svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>' },
};

function SocialIcon({ platform, url }) {
    const key = platform.toLowerCase().replace('/', '').replace(' ', '').replace('twitter', 'twitterx');
    const icon = SOCIAL_ICONS[key] || SOCIAL_ICONS[platform.toLowerCase()];
    // Ne pas afficher si pas d'icône connue, pas d'URL, ou URL invalide (ex: "#")
    const isValidUrl = url && url.startsWith('http');
    if (!icon || !isValidUrl) return null;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer"
           className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 rounded-sm"
           style={{ background: icon.bg }} title={platform}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="white"
                 dangerouslySetInnerHTML={{ __html: icon.svg }} />
        </a>
    );
}

export default function Footer() {
    const { companyInfo, socialMediaLinks, navBrands, navCatalogues } = useApp();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subError, setSubError] = useState('');

    // ── Gate email pour téléchargement catalogue ───────────────────────────────
    const [dlGate, setDlGate]     = useState(null);   // catalogue sélectionné
    const [dlEmail, setDlEmail]   = useState('');
    const [dlStatus, setDlStatus] = useState('idle'); // idle | loading | done | error
    const [dlError, setDlError]   = useState('');
    const dlInputRef = useRef(null);

    const openDlGate = (cat) => {
        setDlGate(cat); setDlEmail(''); setDlStatus('idle'); setDlError('');
        setTimeout(() => dlInputRef.current?.focus(), 80);
    };
    const closeDlGate = () => { setDlGate(null); setDlStatus('idle'); };

    const handleDlSubmit = async (e) => {
        e.preventDefault();
        if (!dlEmail.trim()) return;
        setDlStatus('loading'); setDlError('');
        try {
            await axios.post('/api/newsletter', { email: dlEmail.trim() });
        } catch (err) {
            const msg = err.response?.data?.message || '';
            if (!msg.toLowerCase().includes('déjà') && !msg.toLowerCase().includes('exist')) {
                setDlError(msg || 'Une erreur est survenue.');
                setDlStatus('error');
                return;
            }
        }
        setDlStatus('done');
        const a = document.createElement('a');
        a.href = `/api/catalogues/${dlGate._id}/download`;
        a.download = `${dlGate.name}.pdf`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(closeDlGate, 1800);
    };

    const defaultBrands = [
        { name: 'Mia Dreams', href: '/miaDreams' },
        { name: 'MPREW', href: '/mprew' },
        { name: 'Personal Branding', href: '/personalBranding' },
        { name: 'Fashion Program', href: '/fashionProgram' },
    ];
    const brands = navBrands && navBrands.length > 0
        ? navBrands.map(b => ({ ...b, href: b.href || `/marque/${b.slug}` }))
        : defaultBrands;

    const address  = companyInfo?.address  || '3 rue Bégenger Ferraud\nCTIC DAKAR, Sénégal';
    const phone    = companyInfo?.phone    || '+221 76 463 91 69';
    const emailCo  = companyInfo?.email    || 'contact@mia-dreams.com';
    const whatsapp = companyInfo?.whatsapp || companyInfo?.phone || '';
    const waNumber = whatsapp.replace(/\D/g, '');
    const logoSrc      = companyInfo?.logo     || '/img/logo_MIA.png';
    const logoIsCustom = !!companyInfo?.logo;

    const handleNewsletter = async (e) => {
        e.preventDefault();
        setSubError('');
        try {
            await axios.post('/api/newsletter', { email });
            setSubscribed(true);
            setEmail('');
        } catch (err) {
            setSubError(err.response?.data?.errors?.email || 'Erreur.');
        }
    };

    return (
        <>
            {/* Newsletter strip */}
            <div className="gold-strip py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-10">
                        <div className="flex-1">
                            <p className="font-lastica text-[8px] tracking-[5px] text-[#080808]/55 uppercase mb-2">{t('footer_newsletter_label')}</p>
                            <h4 className="font-glacial text-xl sm:text-2xl lg:text-3xl font-light text-[#080808] tracking-[3px] sm:tracking-[4px] uppercase leading-tight">
                                {t('footer_newsletter_title')}
                            </h4>
                        </div>
                        <div className="w-full lg:w-[420px]">
                            {subscribed ? (
                                <p className="font-glacial text-sm text-[#080808] tracking-[3px]">✓ {t('footer_newsletter_success')}</p>
                            ) : (
                                <form onSubmit={handleNewsletter}>
                                    <div className="flex">
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                               placeholder={t('footer_newsletter_placeholder')} required
                                               className="flex-1 min-w-0 bg-[#080808]/12 border border-[#080808]/20 border-r-0 text-[#080808] placeholder-[#080808]/35 px-4 py-3.5 sm:px-5 sm:py-4 font-glacial text-sm tracking-wide outline-none focus:border-[#080808]/40 transition-colors" />
                                        <button type="submit"
                                                className="bg-[#080808] text-gold border-none px-4 sm:px-6 py-3.5 sm:py-4 font-glacial text-[9px] tracking-[2px] sm:tracking-[3px] uppercase whitespace-nowrap hover:bg-[#1c1c1c] transition-colors cursor-pointer flex-shrink-0">
                                            {t('footer_newsletter_btn')}
                                        </button>
                                    </div>
                                    {subError && <p className="text-red-700 text-xs mt-2 font-glacial">{subError}</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer body */}
            <footer className="bg-[#080808]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-14 border-b border-white/[0.06]">

                        {/* Identité */}
                        <div className="lg:col-span-4">
                            <img src={logoSrc} alt={companyInfo?.name || 'MIA DREAMS'}
                                 className={`h-14 w-auto mb-5 ${logoIsCustom ? 'opacity-100 object-contain' : 'brightness-0 invert opacity-100 drop-shadow-[0_0_8px_rgba(201,168,76,0.4)]'}`} />
                            <p className="font-glacial text-[14px] text-white/65 leading-relaxed mb-8 max-w-[240px]">
                                {t('footer_about')}
                            </p>
                            <div className="mb-8">
                                <p className="font-lastica text-[9px] tracking-[4px] text-gold/70 uppercase mb-4">{t('footer_follow')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {socialMediaLinks && socialMediaLinks.length > 0
                                        ? socialMediaLinks.map(s => <SocialIcon key={s._id} platform={s.platform} url={s.url} />)
                                        : null
                                    }
                                </div>
                            </div>
                            <div className="space-y-3">
                                <a href={`tel:${phone.replace(/\s/g,'')}`} className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold/50 transition-colors">
                                        <svg className="w-3 h-3 text-gold/50 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    </div>
                                    <span className="font-glacial text-[14px] text-white/70 group-hover:text-gold transition-colors">{phone}</span>
                                </a>
                                <a href={`mailto:${emailCo}`} className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold/50 transition-colors">
                                        <svg className="w-3 h-3 text-gold/50 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    </div>
                                    <span className="font-glacial text-[14px] text-white/70 group-hover:text-gold transition-colors">{emailCo}</span>
                                </a>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-gold/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    </div>
                                    <span className="font-glacial text-[14px] text-white/70 leading-relaxed whitespace-pre-line">{address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="lg:col-span-2 lg:col-start-6">
                            <p className="eyebrow mb-6">{t('footer_nav')}</p>
                            <ul className="space-y-3.5">
                                {[
                                    { to: '/', label: t('footer_nav_home') },
                                    { to: '/galerie', label: t('footer_nav_gallery') },
                                    { to: '/catalogues', label: t('footer_nav_catalogues') },
                                    { to: '/apropos', label: t('footer_nav_about') },
                                    { to: '/impact', label: t('footer_nav_impact') },
                                    { to: '/blog', label: t('footer_nav_blog') },
                                    { to: '/reservation', label: t('footer_nav_reservation') },
                                ].map(item => (
                                    <li key={item.to}>
                                        <Link to={item.to}
                                              className="font-glacial text-[14px] text-white/70 tracking-wide hover:text-gold transition-colors duration-250 inline-block">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Marques */}
                        <div className="lg:col-span-2">
                            <p className="eyebrow mb-6">{t('footer_brands')}</p>
                            <ul className="space-y-3.5">
                                {brands.map(b => (
                                    <li key={b.slug || b.name}>
                                        <Link to={b.href}
                                              className="font-glacial text-[14px] text-white/70 tracking-wide hover:text-gold transition-colors duration-250 inline-block">
                                            {b.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Catalogues */}
                        <div className="lg:col-span-2">
                            <p className="eyebrow mb-6">{t('nav_catalogues')}</p>
                            <ul className="space-y-3.5">
                                {navCatalogues && navCatalogues.length > 0
                                    ? navCatalogues.slice(0, 5).map(c => (
                                        <li key={c._id}>
                                            <button onClick={() => openDlGate(c)}
                                               className="font-glacial text-[14px] text-white/70 tracking-wide hover:text-gold transition-colors duration-250 inline-flex items-center gap-2 text-left">
                                                <svg className="w-2.5 h-2.5 text-gold/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {c.name}
                                            </button>
                                        </li>
                                    ))
                                    : <li className="font-glacial text-[13px] text-white/20">{t('footer_no_catalogue')}</li>
                                }
                                <li className="pt-1">
                                    <Link to="/catalogues" className="font-glacial text-[12px] text-gold/50 tracking-wide hover:text-gold transition-colors">
                                        {t('footer_see_all')}
                                    </Link>
                                </li>
                            </ul>
                            <div className="mt-10">
                                <Link to="/contact" className="btn btn-gold text-[9px] py-3 px-5">{t('footer_write')}</Link>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-7">
                        <p className="font-glacial text-[12px] text-white/50 tracking-wide">
                            © {new Date().getFullYear()} <span className="text-white/70">MIA DREAMS & CO</span> — {t('footer_copyright')}
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-px bg-gold/25" />
                            <p className="font-lastica text-[9px] tracking-[4px] text-gold/80 uppercase">{t('footer_made')}</p>
                            <span className="w-6 h-px bg-gold/25" />
                        </div>
                    </div>
                    {/* Crédit développeur */}
                    <div className="flex justify-center pt-3">
                        <a
                            href="https://zolaa.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-glacial text-[11px] text-white/25 hover:text-gold/70 tracking-[1px] transition-colors duration-300"
                        >
                            {t('footer_credit')}
                        </a>
                    </div>
                </div>
            </footer>
        {/* ── Modale email catalogue (footer) ─────────────────────────────── */}
        {dlGate && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-[#080808]/90 backdrop-blur-sm"
                 onClick={closeDlGate}>
                <div className="w-full max-w-sm bg-[#0f0f0f] border border-gold/20 shadow-2xl"
                     onClick={e => e.stopPropagation()}>
                    <div className="relative p-6 pb-4 border-b border-white/5">
                        <button onClick={closeDlGate}
                                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-lg leading-none">✕</button>
                        <span className="font-lastica text-[7px] tracking-[4px] text-gold uppercase block mb-2">{t('cat_modal_title')}</span>
                        <p className="font-glacial text-base text-white uppercase tracking-[2px]">{dlGate.name}</p>
                    </div>
                    <div className="p-6">
                        {dlStatus === 'done' ? (
                            <div className="text-center py-4">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <p className="font-glacial text-sm text-white/70 tracking-[1px]">{t('loading')}</p>
                                <p className="font-glacial text-xs text-gold/60 mt-1 tracking-[1px]">{t('cat_success')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleDlSubmit}>
                                <p className="font-glacial text-sm text-white/65 leading-relaxed mb-5 tracking-[0.5px]">
                                    {t('cat_email_intro')}
                                </p>
                                <div className="mb-4">
                                    <input ref={dlInputRef} type="email" required value={dlEmail}
                                        onChange={e => setDlEmail(e.target.value)}
                                        placeholder={t('cat_email_placeholder')}
                                        className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors" />
                                    {dlError && <p className="mt-2 font-glacial text-xs text-red-400/80">{dlError}</p>}
                                </div>
                                <button type="submit" disabled={dlStatus === 'loading'}
                                        className="w-full btn btn-gold text-[9px] py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {dlStatus === 'loading' ? (
                                        <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>{t('cat_loading_btn')}</>
                                    ) : (
                                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                        </svg>{t('cat_download_btn')}</>
                                    )}
                                </button>
                                <p className="mt-3 font-glacial text-[11px] text-white/45 text-center leading-relaxed">
                                    {t('cat_disclaimer')}
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
