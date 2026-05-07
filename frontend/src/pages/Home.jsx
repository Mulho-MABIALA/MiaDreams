import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

const DEFAULT_SLIDES = [
    { image: '/img/index/home-image1.jpg', subtitle: 'Maison de mode africaine', title: 'RÉVOLUTION', content: "L'artisanat est au cœur de notre métier.", cta_label: 'DÉCOUVRIR', cta_href: '/miaDreams' },
    { image: '/img/index/home-image2.jpg', subtitle: 'Nos collections', title: 'MIA DREAMS', content: 'Notre ligne de vêtements — élégance africaine contemporaine.', cta_label: 'EXPLORER', cta_href: '/miaDreams' },
    { image: '/img/index/home-image5.jpg', subtitle: 'Nouveau', title: 'PERSONAL BRANDING', content: 'Développez votre style, affirmez votre leadership.', cta_label: "DÉCOUVRIR L'OFFRE", cta_href: '/personalBranding' },
];

function HeroCarousel({ slides }) {
    const list = slides.length > 0 ? slides : DEFAULT_SLIDES;
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const goTo = (n) => setCurrent((n + list.length) % list.length);
    const startAuto = () => { clearInterval(timerRef.current); timerRef.current = setInterval(() => setCurrent(c => (c + 1) % list.length), 5500); };
    useEffect(() => { startAuto(); return () => clearInterval(timerRef.current); }, [list.length]);

    const imgSrc = (s) => s.image?.startsWith('/') ? s.image : `/uploads/${s.image}`;

    return (
        <div className="hero-carousel">
            {list.map((s, i) => (
                <div key={i} className={`hero-slide ${i === current ? 'active' : ''}`}>
                    <img src={imgSrc(s)} alt="MIA DREAMS" loading={i === 0 ? 'eager' : 'lazy'} />
                    <div className="overlay" />
                    <div className="absolute inset-0 flex items-center z-10">
                        <div className="max-w-2xl px-8 lg:px-24">
                            <span className="eyebrow" style={{ opacity: 0, animation: 'fadeUp .7s .4s forwards' }}>{s.subtitle}</span>
                            <h1 className="display-title text-white mt-4 mb-5" style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', opacity: 0, animation: 'fadeUp .9s .6s forwards' }}>
                                {s.title}
                            </h1>
                            {s.content && (
                                <p className="font-glacial text-base text-white/55 tracking-[1px] leading-relaxed mb-9" style={{ opacity: 0, animation: 'fadeUp .8s .8s forwards' }}>
                                    {s.content}
                                </p>
                            )}
                            {s.cta_label && (
                                <div style={{ opacity: 0, animation: 'fadeUp .7s 1s forwards' }}>
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
                {list.map((_, i) => <div key={i} className={`hero-dot ${i === current ? 'active' : ''}`} onClick={() => { goTo(i); startAuto(); }} />)}
            </div>
            <div className="hero-counter hidden lg:block">
                <span className="text-gold">{String(current + 1).padStart(2, '0')}</span>
                <span className="mx-2 opacity-30">/</span>
                <span className="opacity-30">{String(list.length).padStart(2, '0')}</span>
            </div>
            <div className="hero-scroll hidden lg:flex"><div className="hero-scroll-line" /><span>SCROLL</span></div>
        </div>
    );
}

function ServiceModal({ service, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
             style={{ background: 'rgba(8,8,8,.93)' }}
             onClick={onClose}>
            <div className="relative w-full max-w-lg border border-gold/15 overflow-hidden"
                 style={{ background: '#0d0d0d' }}
                 onClick={e => e.stopPropagation()}>

                {/* Fermer */}
                <button onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border border-white/10 text-white/30 hover:text-gold hover:border-gold/30 transition-all">
                    ✕
                </button>

                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 280 }}>
                    {service.image
                        ? <img src={`/uploads/${service.image}`} className="w-full h-full object-cover object-top" alt={service.title} style={{ filter: 'brightness(.75)' }} />
                        : <div className="w-full h-full flex items-center justify-center" style={{ background: '#111' }}>
                              <svg className="w-12 h-12 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                              </svg>
                          </div>
                    }
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,.2) 60%, transparent 100%)' }} />
                    <div className="absolute top-0 inset-x-0 h-px bg-gold/30" />
                </div>

                {/* Contenu */}
                <div className="px-8 pb-8 -mt-4 relative z-10">
                    <span className="font-lastica text-[7px] tracking-[4px] text-gold/50 uppercase block mb-3">Nos services</span>
                    <h3 className="font-glacial text-2xl text-white uppercase tracking-[3px] mb-4 leading-tight">{service.title}</h3>
                    <div className="w-8 h-px mb-5" style={{ background: '#C9A84C' }} />
                    {service.description && (
                        <p className="font-glacial text-sm text-white/50 leading-relaxed mb-7">{service.description}</p>
                    )}
                    <a href="/reservation"
                       className="inline-block font-lastica text-[8px] tracking-[3px] px-6 py-3 transition-all"
                       style={{ background: '#C9A84C', color: '#050505' }}>
                        RÉSERVER UNE CONSULTATION
                    </a>
                </div>
            </div>
        </div>
    );
}

function TestimonialsSection({ testimonials }) {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef(null);
    const n = testimonials?.length || 0;

    const goTo = (idx) => {
        if (animating || idx === current) return;
        setAnimating(true);
        setTimeout(() => {
            setCurrent((idx + n) % n);
            setAnimating(false);
        }, 300);
    };

    const startAuto = () => {
        clearInterval(timerRef.current);
        if (n <= 1) return;
        timerRef.current = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setCurrent(c => (c + 1) % n);
                setAnimating(false);
            }, 300);
        }, 6000);
    };

    useEffect(() => { startAuto(); return () => clearInterval(timerRef.current); }, [n]);
    if (!testimonials || n === 0) return null;

    const t = testimonials[current];

    return (
        <section className="bg-[#080808] py-28 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 lg:px-10">

                {/* Titre */}
                <div className="text-center mb-16 reveal">
                    <span className="eyebrow justify-center">Ils nous font confiance</span>
                    <h2 className="display-title text-3xl lg:text-4xl text-white mb-5">
                        TÉMOIGNAGES <span className="text-gold">CLIENTS</span>
                    </h2>
                    <div className="gold-line-center" />
                </div>

                {/* Carrousel */}
                <div className="relative">
                    {/* Flèche gauche */}
                    {n > 1 && (
                        <button
                            onClick={() => { goTo(current - 1); startAuto(); }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-10 h-10 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/50 transition-all duration-300"
                            style={{ background: 'rgba(8,8,8,.8)' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                    )}

                    {/* Carte témoignage */}
                    <div className="border border-gold/10 px-8 py-12 lg:px-16 lg:py-14 text-center relative overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, rgba(196,162,103,0.03) 0%, rgba(8,8,8,0) 60%)' }}>

                        {/* Guillemet décoratif */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 font-glacial text-[100px] leading-none select-none pointer-events-none"
                             style={{ color: 'rgba(196,162,103,0.06)', fontStyle: 'italic' }}>"</div>

                        {/* Contenu animé */}
                        <div style={{
                            opacity: animating ? 0 : 1,
                            transform: animating ? 'translateY(12px)' : 'translateY(0)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }}>
                            {/* Étoiles */}
                            <div className="flex justify-center gap-1.5 mb-8">
                                {[1,2,3,4,5].map(i => (
                                    <svg key={i} className={`w-4 h-4 ${i <= (t?.rating || 5) ? 'text-gold fill-current' : 'text-white/10 fill-current'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                ))}
                            </div>

                            {/* Citation */}
                            <blockquote className="font-glacial text-lg lg:text-xl font-light text-white/70 leading-relaxed italic mb-10 max-w-2xl mx-auto">
                                "{t?.content}"
                            </blockquote>

                            {/* Séparateur */}
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="w-10 h-px bg-gold/25" />
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                <div className="w-10 h-px bg-gold/25" />
                            </div>

                            {/* Auteur */}
                            <div className="flex items-center justify-center gap-4">
                                {t?.photo ? (
                                    <img src={`/uploads/${t.photo}`} className="w-12 h-12 rounded-full object-cover border border-gold/25" alt={t?.name} />
                                ) : (
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center border border-gold/20" style={{ background: 'rgba(196,162,103,0.08)' }}>
                                        <span className="font-glacial text-gold text-base">{t?.name?.[0]?.toUpperCase()}</span>
                                    </div>
                                )}
                                <div className="text-left">
                                    <p className="font-glacial text-sm text-white uppercase tracking-[3px] leading-tight">{t?.name}</p>
                                    {(t?.role || t?.company) && (
                                        <p className="font-glacial text-xs text-white/30 mt-1">{[t?.role, t?.company].filter(Boolean).join(' · ')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flèche droite */}
                    {n > 1 && (
                        <button
                            onClick={() => { goTo(current + 1); startAuto(); }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-10 h-10 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/50 transition-all duration-300"
                            style={{ background: 'rgba(8,8,8,.8)' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                    )}

                    {/* Dots */}
                    {n > 1 && (
                        <div className="flex justify-center gap-3 mt-8">
                            {testimonials.map((_, i) => (
                                <button key={i}
                                    onClick={() => { goTo(i); startAuto(); }}
                                    className="h-px transition-all duration-500"
                                    style={{
                                        width: i === current ? 32 : 16,
                                        background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.15)'
                                    }} />
                            ))}
                        </div>
                    )}

                    {/* Compteur */}
                    {n > 1 && (
                        <p className="text-center mt-4 font-lastica text-[7px] tracking-[3px] text-white/15">
                            {String(current + 1).padStart(2,'0')} / {String(n).padStart(2,'0')}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

function TestimonialForm() {
    const [hoveredStar, setHoveredStar] = useState(0);
    const [form, setForm] = useState({ name: '', role: '', company: '', rating: 0, content: '' });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            await axios.post('/api/testimonials', form);
            setSuccess(true);
            setForm({ name: '', role: '', company: '', rating: 0, content: '' });
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setProcessing(false);
        }
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
                        <button key={star} type="button" onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)} onClick={() => set('rating', star)}
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {products.map((product, i) => (
                        <Link key={product._id} to={`/boutique/${product.slug}`}
                            className="group block reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                            <div className="relative overflow-hidden mb-3" style={{ background: '#111' }}>
                                <div className="aspect-[3/4] overflow-hidden">
                                    {product.image
                                        ? <img src={`/uploads/${product.image}`} alt={product.name}
                                               className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                        : <div className="w-full h-full flex items-center justify-center bg-[#161616]">
                                              <svg className="w-8 h-8 opacity-10" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                          </div>
                                    }
                                </div>
                                <button
                                    onClick={e => handleAdd(e, product)}
                                    disabled={product.stock === 0}
                                    className="absolute bottom-0 inset-x-0 py-2.5 font-lastica text-[7px] tracking-[3px] uppercase transition-all duration-300 translate-y-full group-hover:translate-y-0 disabled:hidden"
                                    style={{ background: added[product._id] ? '#2d7a3a' : '#C9A84C', color: '#050505' }}>
                                    {added[product._id] ? '✓ Ajouté' : '+ Panier'}
                                </button>
                            </div>
                            <p className="font-glacial text-xs text-white/60 uppercase tracking-[1px] mb-1 group-hover:text-white transition-colors truncate">{product.name}</p>
                            <p className="font-glacial text-sm" style={{ color: '#C9A84C' }}>
                                {(product.price || 0).toLocaleString('fr-FR')} FCFA
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

const DEFAULT_UNIVERS = [
    { image: '/img/index/home-image2.jpg', subtitle: '01', title: 'Mia Dreams Brand', content: 'Notre ligne de vêtements', cta_href: '/miaDreams' },
    { image: '/img/index/home-image3.jpg', subtitle: '02', title: 'Ma Petite Robe En Wax', content: 'Notre application mobile', cta_href: '/mprew' },
    { image: '/img/index/home-image4.jpg', subtitle: '03', title: 'Fashion Program', content: 'Notre programme de formation', cta_href: '/fashionProgram' },
];

export default function Home() {
    const [data, setData] = useState({ services: [], testimonials: [] });
    const [featured, setFeatured] = useState([]);
    const [heroSlides, setHeroSlides]         = useState([]);
    const [univers, setUnivers]               = useState([]);
    const [introSection, setIntro]            = useState(null);
    const [tagline, setTagline]               = useState('');
    const [personalBranding, setPersonalBranding] = useState(null);
    const [ethicalFashion, setEthicalFashion]     = useState(null);
    const [blogBanner, setBlogBanner]             = useState(null);
    const [selectedService, setSelectedService]   = useState(null);

    useEffect(() => {
        axios.get('/api/home').then(res => setData(res.data)).catch(() => {});
        axios.get('/api/shop', { params: { featured: '1', limit: 8 } }).then(r => setFeatured(r.data)).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'hero_slide' } }).then(r => setHeroSlides(r.data)).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'univers' } }).then(r => setUnivers(r.data)).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'intro' } }).then(r => { if (r.data[0]) setIntro(r.data[0]); }).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'tagline' } }).then(r => { if (r.data[0]) setTagline(r.data[0].content); }).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'personal_branding' } }).then(r => { if (r.data[0]) setPersonalBranding(r.data[0]); }).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'ethical_fashion' } }).then(r => { if (r.data[0]) setEthicalFashion(r.data[0]); }).catch(() => {});
        axios.get('/api/sections', { params: { page: 'home', type: 'blog_banner' } }).then(r => { if (r.data[0]) setBlogBanner(r.data[0]); }).catch(() => {});
    }, []);

    return (
        <Layout title="Maison de Mode Africaine">
            <HeroCarousel slides={heroSlides} />

            {/* INTRO */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="reveal">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/sTfEIkU309s" frameBorder="0" allowFullScreen loading="lazy" title="MIA DREAMS" />
                            </div>
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">Notre vision</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">UN UNIVERS <span className="text-gold">AFRICAIN</span></h2>
                            <div className="gold-line my-6" />
                            <blockquote className="relative mb-7">
                                <span className="absolute -top-3 -left-1 font-glacial text-6xl leading-none text-gold select-none">"</span>
                                <p className="font-glacial text-xl lg:text-2xl font-semibold text-[#1a1a1a] leading-snug pl-6 italic">
                                    {introSection?.title || "Notre startup diffuse l'ensemble de la richesse culturelle du continent africain"}
                                </p>
                                <span className="absolute -bottom-5 right-0 font-glacial text-6xl leading-none text-gold select-none">"</span>
                            </blockquote>
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-8 mt-6">
                                {introSection?.content || "Au-delà d'une simple entreprise ou d'une marque de vêtements, nous incarnons un univers contemporain de la mode africaine. Notre savoir-faire dans l'industrie textile du continent est empreint de valeurs vertueuses, tout en embrassant l'innovation numérique. Plaçant l'humain au cœur de notre métier, nous faisons de chaque création une expression de notre engagement envers l'excellence et l'authenticité."}
                            </p>
                            <Link to={introSection?.cta_href || '/apropos'} className="btn btn-gold">{introSection?.cta_label || 'VIEW WORK →'}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TAGLINE */}
            <div className="gold-strip py-9 text-center">
                <p className="relative z-10 font-glacial text-[#080808] text-sm tracking-[5px] uppercase">
                    {tagline || "Plus qu'une entreprise, un univers authentique aux inspirations africaines et contemporaines."}
                </p>
            </div>

            {/* NOS UNIVERS */}
            <section className="bg-[#faf9f7] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 reveal">
                        <div>
                            <span className="eyebrow">Explorer</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-3">NOS <span className="text-gold">UNIVERS</span></h2>
                        </div>
                        <Link to="/miaDreams" className="btn btn-cream mt-6 sm:mt-0 self-start sm:self-auto">TOUT VOIR</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
                        {(univers.length > 0 ? univers : DEFAULT_UNIVERS).map((u, i) => {
                            const imgSrc = u.image?.startsWith('/') ? u.image : `/uploads/${u.image}`;
                            return (
                                <Link key={u._id || i} to={u.cta_href || u.href || '/'} className="card-editorial reveal h-[480px] lg:h-[580px] group" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <img src={imgSrc} alt={u.title} loading="lazy" />
                                    <div className="card-overlay" />
                                    <span className="card-number">{u.subtitle || String(i + 1).padStart(2, '0')}</span>
                                    <div className="absolute bottom-0 inset-x-0 p-7 z-10">
                                        <span className="block font-lastica text-[7px] tracking-[4px] text-gold/70 uppercase mb-3">Découvrir</span>
                                        <h3 className="font-glacial text-xl font-light text-white uppercase tracking-[2px] mb-1.5">{u.title}</h3>
                                        <p className="font-glacial text-sm text-white/50">{u.content || u.sub}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* NOS SERVICES */}
            {data.services && data.services.length > 0 && (
                <section className="bg-texture py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="text-center mb-14 reveal">
                            <span className="eyebrow justify-center">Ce que nous proposons</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 mb-5">NOS <span className="text-gold">SERVICES</span></h2>
                            <div className="gold-line-center" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
                            {data.services.map((s, i) => (
                                <div key={s._id}
                                     className="reveal group border border-gold/8 hover:border-gold/25 bg-[#0f0f0f] transition-colors duration-400 cursor-pointer"
                                     style={{ transitionDelay: `${i * 0.08}s` }}
                                     onClick={() => setSelectedService(s)}>
                                    <div className="relative overflow-hidden">
                                        {s.image
                                            ? <img src={`/uploads/${s.image}`} className="w-full h-[200px] object-cover object-top transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(.7)' }} alt={s.title} loading="lazy" />
                                            : <div className="w-full h-[200px] bg-[#161616] flex items-center justify-center"><svg className="w-8 h-8 text-gold/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg></div>
                                        }
                                        <div className="absolute top-0 inset-x-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors duration-400" />
                                        {/* Overlay "En savoir plus" */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
                                             style={{ background: 'rgba(8,8,8,0.5)' }}>
                                            <div className="border border-gold/50 px-3 py-1.5">
                                                <span className="font-lastica text-[7px] tracking-[3px] text-gold uppercase">En savoir plus</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-glacial text-sm text-white uppercase tracking-[2px] mb-3 group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                                        <p className="font-glacial text-xs text-white/35 leading-relaxed line-clamp-2">{s.description || ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PRODUITS FEATURED */}
            <FeaturedProducts products={featured} />

            {/* PERSONAL BRANDING */}
            <section className="bg-white py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <div className="reveal img-hover">
                            <img
                                src={personalBranding?.image ? (personalBranding.image.startsWith('/') ? personalBranding.image : `/uploads/${personalBranding.image}`) : '/img/index/home-image5.jpg'}
                                className="w-full h-[450px] lg:h-auto object-cover object-top" alt="Personal Branding" loading="lazy" />
                        </div>
                        <div className="reveal" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">{personalBranding?.subtitle || 'Nouveau'}</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                {personalBranding?.title || <>OFFRE EN<br /><span className="text-gold">PERSONAL BRANDING</span></>}
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-9">
                                {personalBranding?.content || "Une méthode et un accompagnement uniques au service de votre leadership, qui vous font gagner du temps. Nous allons vous aider à développer votre propre style, dans une démarche bienveillante."}
                            </p>
                            <Link to={personalBranding?.cta_href || '/personalBranding'} className="btn btn-dark">
                                {personalBranding?.cta_label || 'DÉCOUVRIR NOTRE OFFRE'}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ETHICAL FASHION */}
            <section className="bg-[#faf9f7] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <div className="reveal order-2 lg:order-1" style={{ transitionDelay: '.15s' }}>
                            <span className="eyebrow">{ethicalFashion?.subtitle || 'Engagement'}</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-[#1a1a1a] mt-4 leading-tight">
                                {ethicalFashion?.title || <>ETHICAL<br /><span className="text-gold">FASHION</span></>}
                            </h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-[#777] leading-loose mb-9">
                                {ethicalFashion?.content || "Chez Mia Dreams and Co, notre engagement envers une mode éthique et responsable est au cœur de notre identité. Nous croyons fermement que la mode peut être une force positive pour les communautés africaines."}
                            </p>
                            <Link to={ethicalFashion?.cta_href || '/impact'} className="btn btn-gold">
                                {ethicalFashion?.cta_label || 'NOS ENGAGEMENTS →'}
                            </Link>
                        </div>
                        <div className="reveal order-1 lg:order-2 img-hover">
                            <img
                                src={ethicalFashion?.image ? (ethicalFashion.image.startsWith('/') ? ethicalFashion.image : `/uploads/${ethicalFashion.image}`) : '/img/index/home-image6.jpg'}
                                className="w-full h-[450px] lg:h-auto object-cover object-top" alt="Ethical Fashion" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOG */}
            {(() => {
                const bgImg = blogBanner?.image
                    ? (blogBanner.image.startsWith('/') ? blogBanner.image : `/uploads/${blogBanner.image}`)
                    : '/img/index/home-image7.webp';
                return (
                    <section className="relative py-36 overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${bgImg}')`, filter: 'brightness(.3)' }} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,.9) 0%, rgba(8,8,8,.5) 50%, rgba(196,162,103,.07) 100%)' }} />
                        <div className="relative z-10 max-w-xl mx-auto px-6 text-center reveal">
                            <span className="eyebrow justify-center">{blogBanner?.subtitle || 'Nos derniers articles'}</span>
                            <h2 className="display-title text-3xl lg:text-5xl text-white mt-4 mb-5">
                                {blogBanner?.title || <>BLOG <span className="text-gold">&</span> PODCAST</>}
                            </h2>
                            <div className="gold-line-center mb-8" />
                            <p className="font-glacial text-sm text-white/50 leading-loose mb-10">
                                {blogBanner?.content || "Bienvenue dans l'univers d'OTENTIK MIA — mode, personal branding, entrepreneuriat & culture africaine."}
                            </p>
                            <Link to={blogBanner?.cta_href || '/blog'} className="btn btn-gold">
                                {blogBanner?.cta_label || 'DÉCOUVRIR'}
                            </Link>
                        </div>
                    </section>
                );
            })()}

            {/* TÉMOIGNAGES */}
            <TestimonialsSection testimonials={data.testimonials} />

            {/* LAISSER UN TÉMOIGNAGE */}
            <section className="bg-[#111] py-24 lg:py-28">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div className="reveal">
                            <span className="eyebrow">Votre expérience compte</span>
                            <h2 className="display-title text-3xl lg:text-4xl text-white mt-4 leading-tight">LAISSEZ VOTRE<br /><span className="text-gold">TÉMOIGNAGE</span></h2>
                            <div className="gold-line my-6" />
                            <p className="font-glacial text-sm text-white/45 leading-loose mb-8">Vous avez travaillé avec nous ou porté une de nos créations ? Partagez votre expérience — votre avis inspire d'autres femmes à embrasser la mode africaine d'excellence.</p>
                            <div className="space-y-4">
                                {[
                                    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Votre avis est relu avant publication' },
                                    { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', text: 'Seuls votre prénom et rôle seront affichés' },
                                    { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', text: 'Chaque témoignage est une fierté pour notre équipe' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3.5 h-3.5 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/></svg>
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

            {/* MADE IN AFRICA */}
            <div className="bg-white py-16 lg:py-20 text-center border-t border-[#ede9e3]">
                <p className="font-lastica text-[8px] tracking-[6px] text-gold uppercase mb-4">Dakar, Sénégal</p>
                <h2 className="display-title text-[#1a1a1a]" style={{ fontSize: 'clamp(1.5rem,4vw,3.2rem)', letterSpacing: '0.12em' }}>Made In <span className="text-gold">Africa</span></h2>
            </div>

            {/* MODAL SERVICE */}
            {selectedService && (
                <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
            )}
        </Layout>
    );
}
