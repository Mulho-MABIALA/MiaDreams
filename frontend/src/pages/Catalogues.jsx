import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const imgSrc = (val) => {
    if (!val) return '';
    if (val.startsWith('http') || val.startsWith('/')) return val;
    return `/uploads/${val}`;
};

export default function Catalogues() {
    const [catalogues, setCatalogues]   = useState([]);
    const [gate, setGate]               = useState(null);   // catalogue en attente de download
    const [email, setEmail]             = useState('');
    const [status, setStatus]           = useState('idle'); // idle | loading | done | error
    const [errorMsg, setErrorMsg]       = useState('');
    const inputRef                      = useRef(null);

    useEffect(() => {
        axios.get('/api/catalogues').then(res => setCatalogues(res.data)).catch(() => {});
    }, []);

    const openGate = (cat) => {
        setGate(cat);
        setEmail('');
        setStatus('idle');
        setErrorMsg('');
        setTimeout(() => inputRef.current?.focus(), 80);
    };

    const closeGate = () => { setGate(null); setStatus('idle'); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            await axios.post('/api/newsletter', { email: email.trim() });
        } catch (err) {
            const msg = err.response?.data?.message || '';
            // email déjà inscrit → on laisse télécharger quand même
            if (!msg.toLowerCase().includes('déjà') && !msg.toLowerCase().includes('exist')) {
                setErrorMsg(msg || 'Une erreur est survenue.');
                setStatus('error');
                return;
            }
        }
        setStatus('done');
        // déclenche le téléchargement via un lien temporaire
        const a = document.createElement('a');
        a.href = `/api/catalogues/${gate._id}/download`;
        a.download = `${gate.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(closeGate, 1800);
    };

    return (
        <Layout title="Catalogues">
            {/* HERO */}
            <div className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>Nos collections</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        NOS <span className="text-gold">CATALOGUES</span>
                    </h1>
                </div>
            </div>

            <section className="bg-[#080808] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {catalogues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {catalogues.map((cat, i) => (
                                <div key={cat._id} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/25 transition-all duration-400" style={{ transitionDelay: `${i * 0.08}s` }}>
                                    {/* Cover */}
                                    <div className="relative overflow-hidden bg-[#141414]">
                                        {cat.cover_image
                                            ? <img src={imgSrc(cat.cover_image)} className="w-full h-auto block min-h-[180px] object-contain transition-transform duration-700 group-hover:scale-105" alt={cat.name} loading="lazy" />
                                            : <div className="w-full h-[240px] flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                                </svg>
                                              </div>
                                        }
                                        <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-6">
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-2 group-hover:text-gold transition-colors">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="font-glacial text-xs text-white/35 leading-relaxed mb-5">{cat.description}</p>
                                        )}
                                        {cat.pdf_path ? (
                                            <button onClick={() => openGate(cat)}
                                                    className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                TÉLÉCHARGER
                                            </button>
                                        ) : (
                                            <span className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2 opacity-40 cursor-not-allowed">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                PDF BIENTÔT DISPONIBLE
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/25 tracking-[3px] uppercase">Aucun catalogue disponible pour le moment</p>
                        </div>
                    )}
                </div>
            </section>

            {/* MODALE E-MAIL */}
            {gate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-[#080808]/90 backdrop-blur-sm"
                     onClick={closeGate}>
                    <div className="w-full max-w-sm bg-[#0f0f0f] border border-gold/20 shadow-2xl"
                         onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="relative p-6 pb-4 border-b border-white/5">
                            <button onClick={closeGate}
                                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-lg leading-none">✕</button>
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold uppercase block mb-2">Catalogue</span>
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
                                    <p className="font-glacial text-sm text-white/70 tracking-[1px]">Téléchargement en cours…</p>
                                    <p className="font-glacial text-xs text-gold/60 mt-1 tracking-[1px]">Merci pour votre inscription !</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <p className="font-glacial text-xs text-white/40 leading-relaxed mb-5 tracking-[0.5px]">
                                        Entrez votre adresse e-mail pour recevoir le catalogue et rester informé de nos actualités.
                                    </p>

                                    <div className="mb-4">
                                        <input
                                            ref={inputRef}
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-4 py-3 outline-none placeholder:text-white/20 font-glacial tracking-[1px] transition-colors"
                                        />
                                        {errorMsg && (
                                            <p className="mt-2 font-glacial text-xs text-red-400/80">{errorMsg}</p>
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
                                                CHARGEMENT…
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                TÉLÉCHARGER LE CATALOGUE
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-3 font-glacial text-[10px] text-white/15 text-center leading-relaxed">
                                        En continuant, vous acceptez de recevoir nos communications. Désinscription possible à tout moment.
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
