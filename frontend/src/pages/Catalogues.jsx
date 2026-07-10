import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { imgSrc } from '../utils/imgSrc';
import { useLanguage } from '../context/LanguageContext';

const RAISONS = [
    'Découvrir les collections',
    'Mieux m\'habiller',
    'Personal branding',
    'Entrepreneuriat',
    'Mode africaine',
    'Spiritualité',
    'Autre',
];

const PAYS = [
    // Afrique de l'Ouest
    { label: '🇨🇮 Côte d\'Ivoire',     value: 'Côte d\'Ivoire' },
    { label: '🇸🇳 Sénégal',            value: 'Sénégal' },
    { label: '🇲🇱 Mali',               value: 'Mali' },
    { label: '🇧🇫 Burkina Faso',       value: 'Burkina Faso' },
    { label: '🇬🇳 Guinée',             value: 'Guinée' },
    { label: '🇬🇼 Guinée-Bissau',      value: 'Guinée-Bissau' },
    { label: '🇬🇲 Gambie',             value: 'Gambie' },
    { label: '🇸🇱 Sierra Leone',       value: 'Sierra Leone' },
    { label: '🇱🇷 Liberia',            value: 'Liberia' },
    { label: '🇹🇬 Togo',               value: 'Togo' },
    { label: '🇧🇯 Bénin',              value: 'Bénin' },
    { label: '🇳🇪 Niger',              value: 'Niger' },
    { label: '🇳🇬 Nigeria',            value: 'Nigeria' },
    { label: '🇬🇭 Ghana',              value: 'Ghana' },
    { label: '🇲🇷 Mauritanie',         value: 'Mauritanie' },
    { label: '🇨🇻 Cap-Vert',           value: 'Cap-Vert' },
    // Afrique Centrale
    { label: '🇨🇲 Cameroun',           value: 'Cameroun' },
    { label: '🇨🇬 Congo',              value: 'Congo' },
    { label: '🇨🇩 RD Congo',           value: 'RD Congo' },
    { label: '🇬🇦 Gabon',              value: 'Gabon' },
    { label: '🇹🇩 Tchad',              value: 'Tchad' },
    { label: '🇨🇫 Centrafrique',       value: 'Centrafrique' },
    { label: '🇬🇶 Guinée équatoriale', value: 'Guinée équatoriale' },
    { label: '🇸🇹 São Tomé-et-Príncipe', value: 'São Tomé-et-Príncipe' },
    // Afrique de l'Est
    { label: '🇪🇹 Éthiopie',           value: 'Éthiopie' },
    { label: '🇰🇪 Kenya',              value: 'Kenya' },
    { label: '🇹🇿 Tanzanie',           value: 'Tanzanie' },
    { label: '🇺🇬 Ouganda',            value: 'Ouganda' },
    { label: '🇷🇼 Rwanda',             value: 'Rwanda' },
    { label: '🇧🇮 Burundi',            value: 'Burundi' },
    { label: '🇩🇯 Djibouti',           value: 'Djibouti' },
    { label: '🇸🇴 Somalie',            value: 'Somalie' },
    // Afrique Australe
    { label: '🇿🇦 Afrique du Sud',     value: 'Afrique du Sud' },
    { label: '🇦🇴 Angola',             value: 'Angola' },
    { label: '🇿🇲 Zambie',             value: 'Zambie' },
    { label: '🇿🇼 Zimbabwe',           value: 'Zimbabwe' },
    { label: '🇲🇿 Mozambique',         value: 'Mozambique' },
    { label: '🇲🇼 Malawi',             value: 'Malawi' },
    { label: '🇧🇼 Botswana',           value: 'Botswana' },
    { label: '🇳🇦 Namibie',            value: 'Namibie' },
    { label: '🇲🇬 Madagascar',         value: 'Madagascar' },
    { label: '🇸🇨 Seychelles',         value: 'Seychelles' },
    { label: '🇲🇺 Maurice',            value: 'Maurice' },
    { label: '🇰🇲 Comores',            value: 'Comores' },
    // Afrique du Nord
    { label: '🇲🇦 Maroc',              value: 'Maroc' },
    { label: '🇩🇿 Algérie',            value: 'Algérie' },
    { label: '🇹🇳 Tunisie',            value: 'Tunisie' },
    { label: '🇱🇾 Libye',              value: 'Libye' },
    { label: '🇪🇬 Égypte',             value: 'Égypte' },
    { label: '🇸🇩 Soudan',             value: 'Soudan' },
    // Europe / Diaspora
    { label: '🇫🇷 France',             value: 'France' },
    { label: '🇧🇪 Belgique',           value: 'Belgique' },
    { label: '🇨🇭 Suisse',             value: 'Suisse' },
    { label: '🇱🇺 Luxembourg',         value: 'Luxembourg' },
    { label: '🇬🇧 Royaume-Uni',        value: 'Royaume-Uni' },
    { label: '🇩🇪 Allemagne',          value: 'Allemagne' },
    { label: '🇮🇹 Italie',             value: 'Italie' },
    { label: '🇪🇸 Espagne',            value: 'Espagne' },
    { label: '🇵🇹 Portugal',           value: 'Portugal' },
    { label: '🇳🇱 Pays-Bas',           value: 'Pays-Bas' },
    // Amérique
    { label: '🇨🇦 Canada',             value: 'Canada' },
    { label: '🇺🇸 États-Unis',         value: 'États-Unis' },
    { label: '🇧🇷 Brésil',             value: 'Brésil' },
    // Autre
    { label: '🌍 Autre',               value: 'Autre' },
];

const EMPTY_FORM = {
    nom: '', prenom: '', email: '', whatsapp: '',
    ville: '', pays: '', profession: '', raisons: [],
};

export default function Catalogues() {
    const { t } = useLanguage();
    const [catalogues, setCatalogues] = useState([]);
    const [gate, setGate]             = useState(null);
    const [form, setForm]             = useState(EMPTY_FORM);
    const [status, setStatus]         = useState('idle'); // idle | loading | done | error
    const [errorMsg, setErrorMsg]     = useState('');
    const firstRef                    = useRef(null);

    useEffect(() => {
        axios.get('/api/catalogues', { params: { _t: Date.now() } })
            .then(res => setCatalogues(res.data)).catch(() => {});
    }, []);

    const openGate = (cat) => {
        setGate(cat);
        setForm(EMPTY_FORM);
        setStatus('idle');
        setErrorMsg('');
        setTimeout(() => firstRef.current?.focus(), 80);
    };

    const closeGate = () => { setGate(null); setStatus('idle'); };

    const toggleRaison = (r) => {
        setForm(f => ({
            ...f,
            raisons: f.raisons.includes(r) ? f.raisons.filter(x => x !== r) : [...f.raisons, r],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nom || !form.prenom || !form.email) return;
        setStatus('loading');
        setErrorMsg('');

        try {
            // Enregistre le téléchargement avec le profil qualifié
            await axios.post(`/api/catalogues/${gate._id}/record`, form);

            // Inscription newsletter en parallèle (tolérant aux erreurs)
            axios.post('/api/newsletter', { email: form.email }).catch(() => {});

            // Déclenche le téléchargement
            const a = document.createElement('a');
            a.href = `/api/catalogues/${gate._id}/download`;
            a.download = `${gate.name}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setStatus('done');
            setTimeout(closeGate, 2200);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Une erreur est survenue.');
            setStatus('error');
        }
    };

    return (
        <Layout title="Catalogues">
            {/* HERO */}
            <div className="relative h-[38vh] min-h-[260px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/index/home-image2.jpg')", filter: 'brightness(.18)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(8,8,8,.4) 0%,rgba(8,8,8,.98) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <span className="eyebrow justify-center" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>{t('catalogues_eyebrow')}</span>
                    <h1 className="display-title text-white mt-4" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', opacity: 0, animation: 'fadeUp .9s .5s forwards' }}>
                        {t('catalogues_title').split(' ').slice(0,1).join(' ')} <span className="text-gold">{t('catalogues_title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                </div>
            </div>

            <section className="bg-[#080808] py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {catalogues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {catalogues.map((cat, i) => (
                                <div key={cat._id} className="reveal group border border-gold/8 bg-[#0f0f0f] hover:border-gold/25 transition-all duration-400" style={{ transitionDelay: `${i * 0.08}s` }}>
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
                                    <div className="p-6">
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-2 group-hover:text-gold transition-colors">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="font-glacial text-sm text-white/60 leading-relaxed mb-5">{cat.description}</p>
                                        )}
                                        {cat.pdf_path ? (
                                            <button onClick={() => openGate(cat)}
                                                    className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {t('catalogues_download')}
                                            </button>
                                        ) : (
                                            <span className="btn btn-gold text-[9px] py-3 px-5 inline-flex items-center gap-2 opacity-40 cursor-not-allowed">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {t('catalogues_soon')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
                            <p className="font-glacial text-sm text-white/55 tracking-[3px] uppercase">{t('catalogues_empty')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* MODALE — FORMULAIRE QUALIFIÉ */}
            {gate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 bg-[#080808]/92 backdrop-blur-sm"
                     onClick={closeGate}>
                    <div className="w-full max-w-lg bg-[#0f0f0f] border border-gold/20 shadow-2xl max-h-[90vh] overflow-y-auto"
                         onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sticky top-0 bg-[#0f0f0f] z-10 px-6 pt-6 pb-4 border-b border-white/5">
                            <button onClick={closeGate}
                                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors text-lg leading-none">✕</button>
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold uppercase block mb-1">Accès au magazine</span>
                            <p className="font-glacial text-base text-white uppercase tracking-[2px]">{gate.name}</p>
                        </div>

                        <div className="p-6">
                            {status === 'done' ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </div>
                                    <p className="font-glacial text-sm text-white/80 tracking-[1px]">Téléchargement en cours…</p>
                                    <p className="font-glacial text-xs text-gold/60 mt-2 tracking-[1px]">Merci ! Votre magazine est en cours de téléchargement.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>
                                    <p className="font-glacial text-xs text-white/45 leading-relaxed mb-6 tracking-[0.5px]">
                                        Remplissez ce formulaire pour accéder au magazine. Vos informations nous permettent de mieux vous accompagner.
                                    </p>

                                    {/* Nom / Prénom */}
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">Prénom *</label>
                                            <input
                                                ref={firstRef}
                                                type="text" required
                                                value={form.prenom}
                                                onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                                                placeholder="Awa"
                                                className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/15 font-glacial tracking-[0.5px] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">Nom *</label>
                                            <input
                                                type="text" required
                                                value={form.nom}
                                                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                                                placeholder="Konaté"
                                                className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/15 font-glacial tracking-[0.5px] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">Email *</label>
                                        <input
                                            type="email" required
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            placeholder="awa@example.com"
                                            className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/15 font-glacial tracking-[0.5px] transition-colors"
                                        />
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="mb-3">
                                        <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={form.whatsapp}
                                            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                                            placeholder="+225 07 00 00 00 00"
                                            className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/15 font-glacial tracking-[0.5px] transition-colors"
                                        />
                                    </div>

                                    {/* Ville / Pays */}
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">Ville</label>
                                            <input
                                                type="text"
                                                value={form.ville}
                                                onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                                                placeholder="Abidjan"
                                                className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/15 font-glacial tracking-[0.5px] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">Pays</label>
                                            <select
                                                value={form.pays}
                                                onChange={e => setForm(f => ({ ...f, pays: e.target.value }))}
                                                className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none font-glacial tracking-[0.5px] transition-colors appearance-none"
                                            >
                                                <option value="">— Pays</option>
                                                {PAYS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Profession */}
                                    <div className="mb-5">
                                        <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-1.5">Profession</label>
                                        <input
                                            type="text"
                                            value={form.profession}
                                            onChange={e => setForm(f => ({ ...f, profession: e.target.value }))}
                                            placeholder="Ex : Entrepreneur, Styliste, Étudiant…"
                                            className="w-full bg-[#080808] border border-white/10 focus:border-gold/50 text-white text-sm px-3 py-2.5 outline-none placeholder:text-white/15 font-glacial tracking-[0.5px] transition-colors"
                                        />
                                    </div>

                                    {/* Raisons */}
                                    <div className="mb-6">
                                        <label className="font-glacial text-[10px] text-white/40 uppercase tracking-[2px] block mb-3">Pourquoi souhaitez-vous recevoir le magazine ?</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {RAISONS.map(r => {
                                                const checked = form.raisons.includes(r);
                                                return (
                                                    <label key={r}
                                                           onClick={() => toggleRaison(r)}
                                                           className={`flex items-center gap-3 px-3 py-2.5 border cursor-pointer transition-all ${checked ? 'border-gold/50 bg-gold/5' : 'border-white/8 hover:border-white/20'}`}>
                                                        <span className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${checked ? 'border-gold bg-gold' : 'border-white/20 bg-transparent'}`}>
                                                            {checked && (
                                                                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <span className={`font-glacial text-xs tracking-[0.5px] ${checked ? 'text-white' : 'text-white/55'}`}>{r}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <p className="mb-4 font-glacial text-xs text-red-400/80">{errorMsg}</p>
                                    )}

                                    <button type="submit" disabled={status === 'loading'}
                                            className="w-full btn btn-gold text-[9px] py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                                        {status === 'loading' ? (
                                            <>
                                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                                </svg>
                                                Envoi en cours…
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                Télécharger le magazine
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-3 font-glacial text-[11px] text-white/30 text-center leading-relaxed">
                                        Vos données sont confidentielles et ne seront jamais partagées.
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
