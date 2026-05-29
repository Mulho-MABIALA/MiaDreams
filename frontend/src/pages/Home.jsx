import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { imgSrc } from '../utils/imgSrc';

const GOLD = '#C9A84C';

// ─── Données par défaut ────────────────────────────────────────────────────────
const DEFAULT_SLIDES = [
    { image: '/img/index/home-image1.jpg', subtitle: 'Maison de mode africaine', title: 'RÉVOLUTION', content: "L'artisanat est au cœur de notre métier.", cta_label: 'DÉCOUVRIR', cta_href: '/miaDreams' },
    { image: '/img/index/home-image2.jpg', subtitle: 'Nos collections', title: 'MIA DREAMS', content: 'Notre ligne de vêtements — élégance africaine contemporaine.', cta_label: 'EXPLORER', cta_href: '/miaDreams' },
    { image: '/img/index/home-image5.jpg', subtitle: 'Nouveau', title: 'PERSONAL BRANDING', content: 'Développez votre style, affirmez votre leadership.', cta_label: "DÉCOUVRIR L'OFFRE", cta_href: '/personalBranding' },
];

const DEFAULT_UNIVERS = [
    { image: '/img/index/home-image2.jpg', subtitle: '01', title: 'Mia Dreams Brand',       content: 'Notre ligne de vêtements', cta_href: '/miaDreams' },
    { image: '/img/index/home-image3.jpg', subtitle: '02', title: 'Ma Petite Robe En Wax',  content: 'Notre application mobile',  cta_href: '/mprew' },
    { image: '/img/index/home-image4.jpg', subtitle: '03', title: 'Fashion Program',         content: 'Notre programme de formation', cta_href: '/fashionProgram' },
];

// ─── Hero Carousel ─────────────────────────────────────────────────────────────
function HeroCarousel({ slides }) {
    // slides === null  → API pas encore répondue → skeleton (pas de flash des DEFAULT_SLIDES)
    // slides === []    → API a répondu, aucune slide en base → DEFAULT_SLIDES
    // slides = [...]   → slides du dashboard
    const isLoading = slides === null;
    const list = (slides === null || slides.length === 0) ? DEFAULT_SLIDES : slides;

    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const goTo = (n) => setCurrent((n + list.length) % list.length);
    const startAuto = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCurrent(c => (c + 1) % list.length), 5500);
    };
    useEffect(() => {
        if (!isLoading) { setCurrent(0); startAuto(); }
        return () => clearInterval(timerRef.current);
    }, [list.length, isLoading]);

    // Skeleton sombre pendant le chargement — évite le flash des vieilles images
    if (isLoading) return (
        <div className="hero-carousel" style={{ background: '#060606' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ width: 1, height: 48, background: 'rgba(196,162,103,.25)', animation: 'pulse 1.8s ease-in-out infinite' }} />
            </div>
        </div>
    );

    return (
        <div className="hero-carousel">
            {list.map((s, i) => (
                <div key={i} className={`hero-slide ${i === current ? 'active' : ''}`}>
                    <img src={imgSrc(s.image)} alt="MIA DREAMS" loading={i === 0 ? 'eager' : 'lazy'} />
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-end z-10 pb-16 sm:pb-20 lg:pb-24">
                        <div className="max-w-7xl w-full mx-auto px-5 sm:px-10 lg:px-20">
                            {/* Trait horizontal fin */}
                            <div className="w-10 h-px mb-6" style={{ background: GOLD, opacity: 0, animation: 'fadeUp .6s .3s forwards' }} />
                            <p className="font-lastica text-[7px] tracking-[6px] uppercase mb-3 text-white/50"
                               style={{ opacity: 0, animation: 'fadeUp .7s .4s forwards' }}>
                                {s.subtitle}
                            </p>
                            <h1 className="display-title text-white mb-5"
                                style={{ fontSize: 'clamp(3rem,8vw,6.5rem)', opacity: 0, animation: 'fadeUp .9s .55s forwards' }}>
                                {s.title}
                            </h1>
                            {s.content && (
                                <p className="font-glacial text-sm sm:text-base text-white/50 tracking-[1px] leading-relaxed mb-8 max-w-md"
                                   style={{ opacity: 0, animation: 'fadeUp .8s .7s forwards' }}>
                                    {s.content}
                                </p>
                            )}
                            {s.cta_label && (
                                <div style={{ opacity: 0, animation: 'fadeUp .7s .9s forwards' }}>
                                    <Link to={s.cta_href || '/'} className="btn btn-gold">{s.cta_label}</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <button className="hero-arrow hero-arrow-prev" onClick={() => { goTo(current - 1); startAuto(); }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="hero-arrow hero-arrow-next" onClick={() => { goTo(current + 1); startAuto(); }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <div className="hero-dots">
                {list.map((_, i) => (
                    <div key={i} className={`hero-dot ${i === current ? 'active' : ''}`}
                         onClick={() => { goTo(i); startAuto(); }} />
                ))}
            </div>

            <div className="hero-counter hidden lg:block">
                <span style={{ color: GOLD }}>{String(current + 1).padStart(2, '0')}</span>
                <span className="mx-2 opacity-30">/</span>
                <span className="opacity-30">{String(list.length).padStart(2, '0')}</span>
            </div>
            <div className="hero-scroll hidden lg:flex"><div className="hero-scroll-line" /><span>SCROLL</span></div>
        </div>
    );
}

// ─── Témoignages ───────────────────────────────────────────────────────────────
function TestimonialsSection({ testimonials }) {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef(null);
    const n = testimonials?.length || 0;

    const goTo = (idx) => {
        if (animating || idx === current) return;
        setAnimating(true);
        setTimeout(() => { setCurrent((idx + n) % n); setAnimating(false); }, 300);
    };
    const startAuto = () => {
        clearInterval(timerRef.current);
        if (n <= 1) return;
        timerRef.current = setInterval(() => {
            setAnimating(true);
            setTimeout(() => { setCurrent(c => (c + 1) % n); setAnimating(false); }, 300);
        }, 6000);
    };
    useEffect(() => { startAuto(); return () => clearInterval(timerRef.current); }, [n]);
    if (!testimonials || n === 0) return null;

    const t = testimonials[current];
    return (
        <section className="bg-[#060606] py-28 lg:py-36 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-16 reveal">
                    <span className="eyebrow justify-center">Ils nous font confiance</span>
                    <h2 className="display-title text-3xl lg:text-4xl text-white mb-5">
                        TÉMOIGNAGES <span className="text-gold">CLIENTS</span>
                    </h2>
                    <div className="gold-line-center" />
                </div>
                <div className="relative">
                    {n > 1 && (
                        <button onClick={() => { goTo(current - 1); startAuto(); }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/50 transition-all"
                            style={{ background: 'rgba(6,6,6,.8)' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                    )}
                    <div className="border border-gold/8 px-5 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-14 text-center relative overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, rgba(196,162,103,0.03) 0%, rgba(8,8,8,0) 60%)' }}>
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 font-glacial text-[100px] leading-none select-none pointer-events-none"
                             style={{ color: 'rgba(196,162,103,0.05)', fontStyle: 'italic' }}>"</div>
                        <div style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
                            <div className="flex justify-center gap-1.5 mb-8">
                                {[1,2,3,4,5].map(i => (
                                    <svg key={i} className={`w-4 h-4 ${i <= (t?.rating || 5) ? 'text-gold fill-current' : 'text-white/10 fill-current'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                ))}
                            </div>
                            <blockquote className="font-glacial text-lg lg:text-xl font-light text-white/65 leading-relaxed italic mb-10 max-w-2xl mx-auto">
                                "{t?.content}"
                            </blockquote>
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="w-10 h-px bg-gold/25" />
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                <div className="w-10 h-px bg-gold/25" />
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                {t?.photo
                                    ? <img src={imgSrc(t.photo)} className="w-11 h-11 rounded-full object-cover border border-gold/25" alt={t?.name} />
                                    : <div className="w-11 h-11 rounded-full flex items-center justify-center border border-gold/20" style={{ background: 'rgba(196,162,103,0.08)' }}>
                                          <span className="font-glacial text-gold text-base">{t?.name?.[0]?.toUpperCase()}</span>
                                      </div>
                                }
                                <div className="text-left">
                                    <p className="font-glacial text-sm text-white uppercase tracking-[3px] leading-tight">{t?.name}</p>
                                    {(t?.role || t?.company) && (
                                        <p className="font-glacial text-xs text-white/30 mt-1">{[t?.role, t?.company].filter(Boolean).join(' · ')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {n > 1 && (
                        <button onClick={() => { goTo(current + 1); startAuto(); }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/50 transition-all"
                            style={{ background: 'rgba(6,6,6,.8)' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                    )}
                    {n > 1 && (
                        <div className="flex justify-center gap-3 mt-8">
                            {testimonials.map((_, i) => (
                                <button key={i} onClick={() => { goTo(i); startAuto(); }}
                                    className="h-px transition-all duration-500"
                                    style={{ width: i === current ? 32 : 16, background: i === current ? GOLD : 'rgba(255,255,255,0.15)' }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// ─── Formulaire témoignage ──────────────────────────────────────────────────────
function TestimonialForm() {
    const [hoveredStar, setHoveredStar] = useState(0);
    const [form, setForm] = useState({ name: '', role: '', company: '', rating: 0, content: '' });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true); setErrors({});
        try {
            await axios.post('/api/testimonials', form);
            setSuccess(true);
            setForm({ name: '', role: '', company: '', rating: 0, content: '' });
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
        } finally { setProcessing(false); }
    };

    if (success) return (
        <div className="text-center py-16 reveal">
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="font-glacial text-xl text-white uppercase tracking-[3px] mb-3">Merci pour votre <span className="text-gold">témoignage</span></h3>
            <p className="font-glacial text-sm text-white/40 max-w-sm mx-auto leading-relaxed">Votre avis a été transmis à notre équipe. Il sera publié après validation sous 24–48h.</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="reveal" style={{ transitionDelay: '.15s' }}>
            <div className="mb-8">
                <label className="input-label mb-4 block">Votre note *</label>
                <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                        <button key={star} type="button"
                            onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => set('rating', star)}
                            className="p-1 transition-transform duration-150 hover:scale-110 focus:outline-none">
                            <svg className={`w-7 h-7 transition-colors duration-150 ${star <= (hoveredStar || form.rating) ? 'text-gold fill-current' : 'text-white/15 fill-current'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        </button>
                    ))}
                </div>
                {errors.message && <p className="text-red-400 text-xs mt-2 font-glacial">{errors.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="input-label">Votre nom *</label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Aminata Diallo" className="input-mia" required />
                </div>
                <div>
                    <label className="input-label">Fonction / Rôle</label>
                    <input type="text" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Directrice artistique" className="input-mia" />
                </div>
            </div>
            <div className="mb-6">
                <label className="input-label">Entreprise / Organisation</label>
                <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Studio Créatif" className="input-mia" />
            </div>
            <div className="mb-8">
                <label className="input-label">Votre témoignage *</label>
                <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} placeholder="Partagez votre expérience avec MIA DREAMS & CO…" className="input-mia resize-none" required />
                <span className="font-glacial text-[10px] text-white/20 block text-right mt-1">{form.content.length}/1000</span>
            </div>
            <div className="flex items-center justify-between gap-6 flex-wrap">
                <p className="font-glacial text-xs text-white/25 leading-relaxed max-w-xs">Votre avis sera publié après validation par notre équipe.</p>
                <button type="submit" disabled={processing || !form.rating} className="btn btn-gold disabled:opacity-40 disabled:cursor-not-allowed">
                    {processing ? 'ENVOI…' : 'ENVOYER MON AVIS'}
                </button>
            </div>
        </form>
    );
}

// ─── Produits vedettes ─────────────────────────────────────────────────────────
function FeaturedProducts({ products }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState({});
    const handleAdd = (e, product) => {
        e.preventDefault();
        addItem(product, 1);
        setAdded(p => ({ ...p, [product._id]: true }));
        setTimeout(() => setAdded(p => ({ ...p, [product._id]: false })), 1500);
    };
    if (!products || products.length === 0) return null;
    return (
        <section className="bg-[#050505] py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 reveal">
                    <div>
                        <span className="eyebrow" style={{ color: 'rgba(196,162,103,0.6)' }}>Sélection</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-3">
                            NOS <span className="text-gold">COUPS DE CŒUR</span>
                        </h2>
                    </div>
                    <Link to="/boutique" className="btn btn-gold mt-6 sm:mt-0 self-start sm:self-auto">VOIR LA BOUTIQUE</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {products.map((product, i) => (
                        <Link key={product._id} to={`/boutique/${product.slug}`} className="group block reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                            <div className="relative overflow-hidden mb-3" style={{ background: '#111' }}>
                                <div className="aspect-[3/4] overflow-hidden">
                                    {product.image
                                        ? <img src={imgSrc(product.image)} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                        : <div className="w-full h-full flex items-center justify-center bg-[#161616]">
                                              <svg className="w-8 h-8 opacity-10" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                          </div>
                                    }
                                </div>
                                <button onClick={e => handleAdd(e, product)} disabled={product.stock === 0}
                                    className="absolute bottom-0 inset-x-0 py-2.5 font-lastica text-[7px] tracking-[3px] uppercase transition-all duration-300 translate-y-full group-hover:translate-y-0 disabled:hidden"
                                    style={{ background: added[product._id] ? '#2d7a3a' : GOLD, color: '#050505' }}>
                                    {added[product._id] ? '✓ Ajouté' : '+ Panier'}
                                </button>
                            </div>
                            <p className="font-glacial text-xs text-white/60 uppercase tracking-[1px] mb-1 group-hover:text-white transition-colors truncate">{product.name}</p>
                            <p className="font-glacial text-sm" style={{ color: GOLD }}>{(product.price || 0).toLocaleString('fr-FR')} FCFA</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
    const [data, setData]                         = useState({ services: [], testimonials: [] });
    const [featured, setFeatured]                 = useState([]);
    const [heroSlides, setHeroSlides]             = useState(null); // null = chargement en cours
    const [univers, setUnivers]                   = useState([]);
    const [introSection, setIntro]                = useState(null);
    const [tagline, setTagline]                   = useState('');
    const [personalBranding, setPersonalBranding] = useState(null);
    const [ethicalFashion, setEthicalFashion]     = useState(null);
    const [blogBanner, setBlogBanner]             = useState(null);

    useEffect(() => {
        const t = Date.now();
        const sec = (type) => axios.get('/api/sections', { params: { page: 'home', type, _t: t } });
        axios.get('/api/home', { params: { _t: t } }).then(res => setData(res.data)).catch(() => {});
        axios.get('/api/shop', { params: { featured: '1', limit: 8, _t: t } }).then(r => setFeatured(r.data)).catch(() => {});
        sec('hero_slide').then(r => setHeroSlides(r.data)).catch(() => {});
        sec('univers').then(r => setUnivers(r.data)).catch(() => {});
        sec('intro').then(r => { if (r.data[0]) setIntro(r.data[0]); }).catch(() => {});
        sec('tagline').then(r => { if (r.data[0]) setTagline(r.data[0].content); }).catch(() => {});
        sec('personal_branding').then(r => { if (r.data[0]) setPersonalBranding(r.data[0]); }).catch(() => {});
        sec('ethical_fashion').then(r => { if (r.data[0]) setEthicalFashion(r.data[0]); }).catch(() => {});
        sec('blog_banner').then(r => { if (r.data[0]) setBlogBanner(r.data[0]); }).catch(() => {});
    }, []);

    const activeUnivers = univers.length > 0 ? univers : DEFAULT_UNIVERS;

    return (
        <Layout title="Maison de Mode Africaine">

            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <HeroCarousel slides={heroSlides} />

            {/* ══ MANIFESTE ════════════════════════════════════════════════ */}
            {(() => {
                // Construit l'URL embed seulement si une vidéo est configurée dans le dashboard
                const rawUrl   = introSection?.video_url || '';
                const embedUrl = rawUrl
                    ? (rawUrl.includes('embed/')
                        ? rawUrl
                        : (() => { const m = rawUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/); return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : rawUrl; })())
                    : '';

                return (
                    <section className="bg-white py-20 lg:py-28">
                        <div className="max-w-7xl mx-auto px-6 lg:px-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-center">

                                {/* ── Vidéo ou placeholder ── */}
                                <div className="reveal">
                                    {embedUrl ? (
                                        <div className="relative w-full shadow-lg" style={{ paddingBottom: '56.25%' }}>
                                            <iframe
                                                className="absolute inset-0 w-full h-full"
                                                src={embedUrl}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen loading="lazy" title="MIA DREAMS" />
                                        </div>
                                    ) : (
                                        /* Placeholder — ajoute une vidéo dans le dashboard (Section › Intro › video_url) */
                                        <div className="relative w-full shadow-lg flex items-center justify-center"
                                             style={{ paddingBottom: '56.25%', background: '#f5f3f0' }}>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                                <svg className="w-12 h-12 opacity-20" fill="none" stroke="#1a1a1a" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <p className="font-lastica text-[7px] tracking-[3px] text-[#aaa] uppercase">
                                                    Vidéo non configurée
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {/* Trait doré décoratif sous la vidéo */}
                                    <div className="flex items-center gap-3 mt-5">
                                        <div className="h-px flex-1" style={{ background: '#e8e3da' }} />
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(196,162,103,.4)' }} />
                                        <div className="h-px w-8" style={{ background: GOLD, opacity: .5 }} />
                                    </div>
                                </div>

                                {/* ── Texte ── */}
                                <div className="flex flex-col gap-7 reveal" style={{ transitionDelay: '.12s' }}>
                                    <span className="font-lastica text-[7px] tracking-[6px] uppercase"
                                          style={{ color: 'rgba(196,162,103,.7)' }}>
                                        Notre vision
                                    </span>

                                    {/* Citation */}
                                    <p className="font-glacial leading-[1.6] text-[#1a1a1a] italic font-light"
                                       style={{ fontSize: 'clamp(1.15rem, 2vw, 1.55rem)' }}>
                                        «&thinsp;{introSection?.title || "Notre startup diffuse l'ensemble de la richesse culturelle du continent africain"}&thinsp;»
                                    </p>

                                    <div className="w-10 h-px" style={{ background: GOLD }} />

                                    {/* Corps */}
                                    <p className="font-glacial text-sm text-[#888] leading-[1.95]">
                                        {introSection?.content ||
                                            "Au-delà d'une simple entreprise ou d'une marque de vêtements, nous incarnons un univers contemporain de la mode africaine. Notre savoir-faire dans l'industrie textile est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique."}
                                    </p>

                                    {/* Chiffres clés */}
                                    <div className="flex gap-8 sm:gap-10 py-6 border-t border-b border-[#ede9e3]">
                                        {[
                                            { n: '2018', l: 'Fondée à Dakar' },
                                            { n: '4',    l: 'Univers créatifs' },
                                            { n: '100+', l: 'Clients satisfaits' },
                                        ].map((s, i) => (
                                            <div key={i}>
                                                <p className="font-glacial text-2xl font-light" style={{ color: GOLD }}>{s.n}</p>
                                                <p className="font-lastica text-[6px] tracking-[3px] text-[#aaa] uppercase mt-1.5">{s.l}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Link to={introSection?.cta_href || '/apropos'} className="btn btn-gold self-start">
                                        {introSection?.cta_label || 'NOTRE HISTOIRE'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* ══ TAGLINE ══════════════════════════════════════════════════ */}
            <div className="gold-strip py-8 text-center">
                <p className="relative z-10 font-lastica text-[7px] sm:text-[8px] tracking-[5px] sm:tracking-[7px] text-[#080808] uppercase">
                    {tagline || "Plus qu'une entreprise, un univers authentique aux inspirations africaines et contemporaines."}
                </p>
            </div>

            {/* ══ NOS UNIVERS ══════════════════════════════════════════════ */}
            <section className="bg-[#080808]">
                {/* En-tête de section */}
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 reveal">
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="font-lastica text-[7px] tracking-[5px] uppercase block mb-3"
                                  style={{ color: 'rgba(196,162,103,.5)' }}>
                                Explorer
                            </span>
                            <h2 className="display-title text-3xl sm:text-4xl text-white">
                                NOS <span className="text-gold">UNIVERS</span>
                            </h2>
                        </div>
                        <Link to="/miaDreams"
                              className="hidden sm:flex items-center gap-2 font-lastica text-[7px] tracking-[3px] uppercase transition-colors"
                              style={{ color: 'rgba(255,255,255,.25)' }}
                              onMouseEnter={e => e.currentTarget.style.color = GOLD}
                              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.25)'}>
                            Tout explorer <span>→</span>
                        </Link>
                    </div>
                </div>

                {/* Grille éditoriale */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
                    {activeUnivers.map((u, i) => (
                        <Link key={u._id || i} to={u.cta_href || u.href || '/'}
                              className="card-editorial reveal h-[380px] sm:h-[500px] lg:h-[640px] group"
                              style={{ transitionDelay: `${i * 0.1}s` }}>
                            <img src={imgSrc(u.image)} alt={u.title} loading="lazy" />
                            <div className="card-overlay" />
                            {/* Numéro discret */}
                            <span className="absolute top-7 right-7 font-lastica text-[9px] tracking-[3px] z-10"
                                  style={{ color: 'rgba(196,162,103,.4)' }}>
                                {u.subtitle || String(i + 1).padStart(2, '0')}
                            </span>
                            {/* Contenu bas */}
                            <div className="absolute bottom-0 inset-x-0 p-7 lg:p-9 z-10">
                                {/* Trait doré qui s'étend au hover */}
                                <div className="h-px mb-5 transition-all duration-500 group-hover:opacity-100"
                                     style={{ width: 32, background: GOLD, opacity: 0.5 }} />
                                <h3 className="font-glacial text-lg sm:text-xl font-light text-white uppercase tracking-[3px] mb-2 group-hover:text-gold transition-colors duration-300">
                                    {u.title}
                                </h3>
                                <p className="font-glacial text-sm text-white/40 mb-5">{u.content || u.sub}</p>
                                <span className="flex items-center gap-2 font-lastica text-[7px] tracking-[3px] uppercase transition-all duration-300"
                                      style={{ color: 'rgba(196,162,103,.6)' }}>
                                    Découvrir
                                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══ NOS PILIERS D'ACTION ═════════════════════════════════════ */}
            <section className="bg-[#080808] py-24 lg:py-32 border-t border-gold/6">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">

                    {/* En-tête */}
                    <div className="text-center mb-16 reveal">
                        <span className="eyebrow justify-center">Ce que nous faisons</span>
                        <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">
                            NOS PILIERS <span className="text-gold">D'ACTION</span>
                        </h2>
                        <div className="gold-line-center" />
                        <p className="font-glacial text-xs text-white/30 tracking-[2px] uppercase mt-6 max-w-xl mx-auto leading-relaxed">
                            Parce que l'impact ne commence pas par la visibilité. Il commence par l'alignement.
                        </p>
                    </div>

                    {/* Grille 2 × 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gold/8">

                        {/* 1 — Mode consciente */}
                        <div className="reveal bg-[#0a0a0a] p-8 lg:p-10 group hover:bg-[#0f0f0f] transition-colors duration-400">
                            <div className="w-8 h-px bg-gold mb-6" />
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold/50 uppercase block mb-3">01</span>
                            <h3 className="font-glacial text-base text-white uppercase tracking-[3px] mb-5 leading-snug group-hover:text-gold transition-colors duration-300">
                                Mode Consciente<br />&amp; Innovation Digitale
                            </h3>
                            <p className="font-glacial text-xs text-white/40 leading-relaxed mb-4">
                                À travers <span className="text-gold/70">MIA DREAMS</span> et <span className="text-gold/70">MA PETITE ROBE EN WAX</span>, nous développons une mode africaine contemporaine intégrant :
                            </p>
                            <ul className="space-y-2 mb-5">
                                {['Production à la demande', 'Digitalisation de l\'expérience client', 'Réduction du gaspillage textile', 'Valorisation des savoir-faire locaux'].map(item => (
                                    <li key={item} className="flex items-start gap-2.5 font-glacial text-xs text-white/35">
                                        <span className="w-1 h-1 rounded-full bg-gold/50 mt-1.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="font-glacial text-xs text-white/25 leading-relaxed italic">
                                La mode devient un outil d'affirmation, une solution économique et environnementale.
                            </p>
                        </div>

                        {/* 2 — Image & positionnement */}
                        <div className="reveal bg-[#0a0a0a] p-8 lg:p-10 group hover:bg-[#0f0f0f] transition-colors duration-400" style={{ transitionDelay: '0.08s' }}>
                            <div className="w-8 h-px bg-gold mb-6" />
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold/50 uppercase block mb-3">02</span>
                            <h3 className="font-glacial text-base text-white uppercase tracking-[3px] mb-5 leading-snug group-hover:text-gold transition-colors duration-300">
                                Image &amp; Positionnement<br />Stratégique
                            </h3>
                            <p className="font-glacial text-xs text-white/40 leading-relaxed mb-4">
                                Nous accompagnons les leaders, entrepreneurs et dirigeants dans la construction d'une image cohérente et puissante :
                            </p>
                            <ul className="space-y-2 mb-5">
                                {['Personal branding stratégique', 'Garde-robe identitaire', 'Plateformes digitales personnalisées'].map(item => (
                                    <li key={item} className="flex items-start gap-2.5 font-glacial text-xs text-white/35">
                                        <span className="w-1 h-1 rounded-full bg-gold/50 mt-1.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="font-glacial text-xs text-white/25 leading-relaxed italic">
                                Parce qu'une marque forte est d'abord une identité assumée.
                            </p>
                        </div>

                        {/* 3 — Entrepreneuriat */}
                        <div className="reveal bg-[#0a0a0a] p-8 lg:p-10 group hover:bg-[#0f0f0f] transition-colors duration-400" style={{ transitionDelay: '0.16s' }}>
                            <div className="w-8 h-px bg-gold mb-6" />
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold/50 uppercase block mb-3">03</span>
                            <h3 className="font-glacial text-base text-white uppercase tracking-[3px] mb-5 leading-snug group-hover:text-gold transition-colors duration-300">
                                Entrepreneuriat<br />&amp; ICC
                            </h3>
                            <p className="font-glacial text-xs text-white/40 leading-relaxed">
                                <span className="text-gold/70 not-italic">Mia for Startup</span> est un programme de formation de{' '}
                                <span className="text-white/60">6 semaines transformatrices</span> conçu pour aider les entrepreneurs à structurer et accélérer leur business.
                                À travers une approche pratique, les participants apprennent à intégrer le digital, maîtriser les fondamentaux du marketing, comprendre leur comptabilité,
                                tout en développant leur leadership et leur capacité à lever des fonds.
                            </p>
                        </div>

                        {/* 4 — Institutions */}
                        <div className="reveal bg-[#0a0a0a] p-8 lg:p-10 group hover:bg-[#0f0f0f] transition-colors duration-400" style={{ transitionDelay: '0.24s' }}>
                            <div className="w-8 h-px bg-gold mb-6" />
                            <span className="font-lastica text-[7px] tracking-[4px] text-gold/50 uppercase block mb-3">04</span>
                            <h3 className="font-glacial text-base text-white uppercase tracking-[3px] mb-5 leading-snug group-hover:text-gold transition-colors duration-300">
                                Pour les<br />Institutions
                            </h3>
                            <p className="font-glacial text-xs text-white/40 leading-relaxed">
                                Mia Dreams développe des solutions à l'intersection de la{' '}
                                <span className="text-white/60">mode responsable, du digital, de l'entrepreneuriat et du leadership féminin</span>,
                                et sollicite les institutions souhaitant soutenir ces axes à fort impact.
                                Nous proposons des <span className="text-white/60">interventions sur mesure</span>, adaptées aux besoins spécifiques de chaque organisation.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12 reveal">
                        <Link to="/reservation" className="btn btn-gold">RÉSERVER UNE CONSULTATION</Link>
                    </div>
                </div>
            </section>

            {/* ══ PRODUITS VEDETTES ════════════════════════════════════════ */}
            <FeaturedProducts products={featured} />

            {/* ══ PERSONAL BRANDING — panneau plein bord ══════════════════ */}
            <section className="bg-[#090909] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] lg:min-h-[620px]">

                    {/* Image plein bord */}
                    <div className="relative h-[360px] lg:h-auto overflow-hidden reveal">
                        <img src={imgSrc(personalBranding?.image, '/img/index/home-image5.jpg')}
                             className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1.2s] hover:scale-105"
                             alt="Personal Branding" loading="lazy" />
                        {/* Fondu vers le panneau texte */}
                        <div className="absolute inset-0 hidden lg:block"
                             style={{ background: 'linear-gradient(to right, transparent 55%, #090909 100%)' }} />
                        <div className="absolute inset-0 lg:hidden"
                             style={{ background: 'linear-gradient(to top, #090909 0%, transparent 60%)' }} />
                    </div>

                    {/* Panneau texte */}
                    <div className="flex flex-col justify-center px-8 py-14 lg:px-14 xl:px-20 reveal"
                         style={{ transitionDelay: '.15s' }}>
                        <span className="font-lastica text-[7px] tracking-[5px] uppercase block mb-6"
                              style={{ color: 'rgba(196,162,103,.55)' }}>
                            {personalBranding?.subtitle || 'Nouveau'}
                        </span>
                        <h2 className="display-title text-white leading-[1.1] mb-6"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                            {personalBranding?.title || <>OFFRE EN<br /><span className="text-gold">PERSONAL BRANDING</span></>}
                        </h2>
                        <div className="w-10 h-px mb-8" style={{ background: GOLD }} />
                        <p className="font-glacial text-sm text-white/45 leading-[1.95] mb-10 max-w-sm">
                            {personalBranding?.content ||
                                "Une méthode et un accompagnement uniques au service de votre leadership, qui vous font gagner du temps. Nous allons vous aider à développer votre propre style, dans une démarche bienveillante."}
                        </p>
                        <Link to={personalBranding?.cta_href || '/personalBranding'} className="btn btn-gold self-start">
                            {personalBranding?.cta_label || 'DÉCOUVRIR NOTRE OFFRE'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ ETHICAL FASHION — panneau inversé, fond clair ═══════════ */}
            <section className="bg-[#faf9f7] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] lg:min-h-[620px]">

                    {/* Panneau texte à gauche */}
                    <div className="flex flex-col justify-center px-8 py-14 lg:px-14 xl:px-20 order-2 lg:order-1 reveal"
                         style={{ transitionDelay: '.15s' }}>
                        <span className="font-lastica text-[7px] tracking-[5px] uppercase block mb-6"
                              style={{ color: 'rgba(196,162,103,.75)' }}>
                            {ethicalFashion?.subtitle || 'Engagement'}
                        </span>
                        <h2 className="display-title text-[#1a1a1a] leading-[1.1] mb-6"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                            {ethicalFashion?.title || <>ETHICAL<br /><span className="text-gold">FASHION</span></>}
                        </h2>
                        <div className="w-10 h-px mb-8" style={{ background: GOLD }} />
                        <p className="font-glacial text-sm text-[#777] leading-[1.95] mb-10 max-w-sm">
                            {ethicalFashion?.content ||
                                "Chez Mia Dreams and Co, notre engagement envers une mode éthique et responsable est au cœur de notre identité. Nous croyons fermement que la mode peut être une force positive pour les communautés africaines."}
                        </p>
                        <Link to={ethicalFashion?.cta_href || '/impact'} className="btn btn-gold self-start">
                            {ethicalFashion?.cta_label || 'NOS ENGAGEMENTS →'}
                        </Link>
                    </div>

                    {/* Image plein bord à droite */}
                    <div className="relative h-[360px] lg:h-auto overflow-hidden order-1 lg:order-2 reveal">
                        <img src={imgSrc(ethicalFashion?.image, '/img/index/home-image6.jpg')}
                             className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1.2s] hover:scale-105"
                             alt="Ethical Fashion" loading="lazy" />
                        <div className="absolute inset-0 hidden lg:block"
                             style={{ background: 'linear-gradient(to left, transparent 55%, #faf9f7 100%)' }} />
                        <div className="absolute inset-0 lg:hidden"
                             style={{ background: 'linear-gradient(to bottom, #faf9f7 0%, transparent 60%)' }} />
                    </div>
                </div>
            </section>

            {/* ══ BLOG & PODCAST — bannière cinématique ═══════════════════ */}
            {(() => {
                const bgImg = imgSrc(blogBanner?.image, '/img/index/home-image7.webp');
                return (
                    <section className="relative overflow-hidden" style={{ minHeight: 560 }}>
                        {/* Fond image avec zoom subtle */}
                        <div className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-[2s]"
                             style={{ backgroundImage: `url('${bgImg}')`, filter: 'brightness(.28)' }} />
                        {/* Double gradient */}
                        <div className="absolute inset-0"
                             style={{ background: 'linear-gradient(135deg, rgba(8,8,8,.88) 0%, rgba(8,8,8,.45) 50%, rgba(196,162,103,.06) 100%)' }} />
                        {/* Trait doré vertical décoratif */}
                        <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
                             style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,162,103,.3), transparent)' }} />

                        <div className="relative z-10 flex items-center justify-center min-h-[560px] py-24 px-6">
                            <div className="text-center max-w-xl reveal">
                                <span className="eyebrow justify-center">
                                    {blogBanner?.subtitle || 'Nos derniers articles'}
                                </span>
                                <h2 className="display-title text-white mt-4 mb-5"
                                    style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
                                    {blogBanner?.title || <>BLOG <span className="text-gold">&</span> PODCAST</>}
                                </h2>
                                <div className="gold-line-center mb-8" />
                                <p className="font-glacial text-sm text-white/45 leading-[1.9] mb-10">
                                    {blogBanner?.content ||
                                        "Bienvenue dans l'univers d'OTENTIK MIA — mode, personal branding, entrepreneuriat & culture africaine."}
                                </p>
                                <Link to={blogBanner?.cta_href || '/blog'} className="btn btn-gold">
                                    {blogBanner?.cta_label || 'DÉCOUVRIR'}
                                </Link>
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* ══ TÉMOIGNAGES ══════════════════════════════════════════════ */}
            <TestimonialsSection testimonials={data.testimonials} />

            {/* ══ LAISSER UN TÉMOIGNAGE ════════════════════════════════════ */}
            <section className="bg-[#0d0d0d] py-24 lg:py-28 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div className="reveal">
                            <span className="eyebrow">Votre expérience compte</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 leading-tight">
                                LAISSEZ VOTRE<br /><span className="text-gold">TÉMOIGNAGE</span>
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-white/40 leading-[1.9] mb-8">
                                Vous avez travaillé avec nous ou porté une de nos créations ? Partagez votre expérience — votre avis inspire d'autres femmes à embrasser la mode africaine d'excellence.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',   text: 'Votre avis est relu avant publication' },
                                    { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', text: 'Seuls votre prénom et rôle seront affichés' },
                                    { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', text: "Chaque témoignage est une fierté pour notre équipe" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                                            </svg>
                                        </div>
                                        <p className="font-glacial text-sm text-white/40 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div><TestimonialForm /></div>
                    </div>
                </div>
            </section>

            {/* ══ NOUS TROUVER — carte Google Maps ════════════════════════ */}
            <section className="bg-[#080808] border-t border-white/[0.04]">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[460px]">

                    {/* Infos adresse */}
                    <div className="flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-20 reveal">
                        <span className="font-lastica text-[7px] tracking-[5px] uppercase block mb-6"
                              style={{ color: 'rgba(196,162,103,.55)' }}>
                            Nous trouver
                        </span>
                        <h2 className="display-title text-white leading-[1.1] mb-6"
                            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                            NOTRE <span className="text-gold">ATELIER</span>
                        </h2>
                        <div className="w-10 h-px mb-8" style={{ background: GOLD }} />

                        <div className="space-y-5">
                            {/* Adresse */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-lastica text-[6px] tracking-[3px] text-white/25 uppercase mb-1">Adresse</p>
                                    <p className="font-glacial text-sm text-white/60 leading-relaxed">Abidjan, Côte d'Ivoire</p>
                                </div>
                            </div>

                            {/* Horaires */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path strokeLinecap="round" d="M12 6v6l4 2"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-lastica text-[6px] tracking-[3px] text-white/25 uppercase mb-1">Horaires</p>
                                    <p className="font-glacial text-sm text-white/60">Lun – Sam : 09h00 – 18h00</p>
                                </div>
                            </div>

                            {/* RDV */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-lastica text-[6px] tracking-[3px] text-white/25 uppercase mb-1">Sur rendez-vous</p>
                                    <p className="font-glacial text-sm text-white/60">Consultations sur réservation</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link to="/reservation" className="btn btn-gold self-start">
                                PRENDRE RDV
                            </Link>
                        </div>
                    </div>

                    {/* Carte Google Maps */}
                    <div className="relative h-[320px] lg:h-auto overflow-hidden reveal" style={{ transitionDelay: '.1s' }}>
                        <iframe
                            title="MIA DREAMS & CO — Notre emplacement"
                            src="https://maps.google.com/maps?q=5.3808284,-3.9060769&z=16&output=embed"
                            className="absolute inset-0 w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            style={{ filter: 'grayscale(30%) contrast(1.05)' }}
                        />
                        {/* Trait doré en haut */}
                        <div className="absolute top-0 inset-x-0 h-px z-10" style={{ background: 'rgba(196,162,103,.3)' }} />
                    </div>
                </div>
            </section>

            {/* ══ MADE IN AFRICA — signature finale ═══════════════════════ */}
            <div className="bg-white py-20 lg:py-24 text-center border-t border-[#ede9e3]">
                <p className="font-lastica text-[7px] tracking-[8px] uppercase mb-6"
                   style={{ color: 'rgba(196,162,103,.7)' }}>
                    Dakar, Sénégal
                </p>
                <h2 className="font-glacial text-[#1a1a1a] font-light"
                    style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', letterSpacing: '0.14em' }}>
                    Made In <span style={{ color: GOLD }}>Africa</span>
                </h2>
                {/* Séparateur décoratif */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="h-px w-16 sm:w-24" style={{ background: '#e8e3da' }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(196,162,103,.4)' }} />
                    <div className="h-px w-16 sm:w-24" style={{ background: '#e8e3da' }} />
                </div>
            </div>

        </Layout>
    );
}
