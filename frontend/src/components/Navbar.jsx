import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { navBrands, companyInfo } = useApp();
    const logoSrc      = companyInfo?.logo || '/img/logo_MIA.png';
    const logoIsCustom = !!companyInfo?.logo;
    const { count: cartCount } = useCart();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef(null);

    const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

    const defaultBrands = [
        { name: 'Mia Dreams', slug: 'mia-dreams', href: '/miaDreams' },
        { name: 'MPREW', slug: 'mprew', href: '/mprew' },
        { name: 'Fashion Program', slug: 'fashion-program', href: '/fashionProgram' },
        { name: 'Personal Branding', slug: 'personal-branding', href: '/personalBranding' },
    ];
    // Chemins des pages de marques statiques existantes
    const STATIC_BRAND_PATHS = ['/miaDreams', '/mprew', '/fashionProgram', '/personalBranding'];
    const brands = navBrands && navBrands.length > 0
        ? navBrands.map(b => {
            let href = b.href || '';
            // N'utiliser le href personnalisé que s'il correspond à une page statique existante
            // ou s'il commence par http. Sinon, utiliser la route dynamique /marque/:slug
            const isValidHref = href &&
                (STATIC_BRAND_PATHS.includes(href) || href.startsWith('http'));
            if (!isValidHref) {
                href = `/marque/${b.slug}`;
            }
            return { ...b, href };
        })
        : defaultBrands;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Fermer le menu mobile à chaque navigation
    useEffect(() => { setOpen(false); setSearchOpen(false); }, [pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q.length >= 2) {
            navigate(`/recherche?q=${encodeURIComponent(q)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navBg = scrolled
        ? 'bg-[#080808]/98 border-b border-[rgba(196,162,103,0.18)] shadow-[0_8px_32px_rgba(0,0,0,.6)]'
        : 'bg-[#080808]/90 border-b border-[rgba(196,162,103,0.08)]';

    return (
        <nav className={`fixed top-0 inset-x-0 z-[9999] h-[72px] flex items-center backdrop-blur-md transition-all duration-400 ${navBg}`}>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex-shrink-0 group">
                    <img src={logoSrc} alt={companyInfo?.name || 'MIA DREAMS'}
                         className={`h-7 sm:h-9 w-auto transition-opacity duration-300 group-hover:opacity-100 ${logoIsCustom ? 'opacity-100 object-contain' : 'brightness-0 invert opacity-85'}`} />
                </Link>

                {/* Desktop nav */}
                <ul className="hidden lg:flex items-center">
                    <li>
                        <Link to="/" className={`nav-link ${pathname === '/' ? 'active text-gold' : 'text-white/55'}`}>HOME</Link>
                    </li>

                    <li className="nav-dropdown">
                        <button className={`nav-link flex items-center gap-1.5 ${
                            ['/miaDreams','/mprew','/fashionProgram','/personalBranding'].some(p => pathname.startsWith(p)) || pathname.startsWith('/marque')
                                ? 'active text-gold' : 'text-white/55'}`}>
                            NOS MARQUES
                            <svg className="w-2 h-2 opacity-40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        <div className="nav-dropdown-menu">
                            {brands.map(b => (
                                <Link key={b.slug || b.name} to={b.href}>{b.name}</Link>
                            ))}
                        </div>
                    </li>

                    <li><Link to="/catalogues" className={`nav-link ${isActive('/catalogues') ? 'active text-gold' : 'text-white/55'}`}>CATALOGUES</Link></li>
                    <li><Link to="/galerie"    className={`nav-link ${isActive('/galerie')    ? 'active text-gold' : 'text-white/55'}`}>GALERIE</Link></li>

                    <li className="nav-dropdown">
                        <button className={`nav-link flex items-center gap-1.5 ${isActive('/apropos') || isActive('/blog') ? 'active text-gold' : 'text-white/55'}`}>
                            JOURNAL
                            <svg className="w-2 h-2 opacity-40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        <div className="nav-dropdown-menu">
                            <Link to="/apropos">À Propos</Link>
                            <Link to="/blog">Blog & Podcast</Link>
                        </div>
                    </li>

                    <li><Link to="/boutique"    className={`nav-link ${isActive('/boutique')    ? 'active text-gold' : 'text-white/55'}`}>BOUTIQUE</Link></li>
                    <li><Link to="/impact"     className={`nav-link ${isActive('/impact')     ? 'active text-gold' : 'text-white/55'}`}>IMPACT</Link></li>
                    <li><Link to="/reservation" className={`nav-link ${isActive('/reservation') ? 'active text-gold' : 'text-white/55'}`}>RÉSERVER</Link></li>

                    {/* Panier */}
                    <li>
                        <Link to="/panier" aria-label="Panier"
                              className="nav-link text-white/45 hover:text-gold transition-colors flex items-center relative">
                            <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center font-lastica text-[8px] leading-none"
                                      style={{ background: '#C9A84C', color: '#050505' }}>
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </li>

                    {/* Recherche */}
                    <li>
                        <button onClick={() => setSearchOpen(o => !o)} aria-label="Rechercher"
                                className="nav-link text-white/45 hover:text-gold transition-colors flex items-center">
                            {searchOpen
                                ? <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                : <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            }
                        </button>
                    </li>

                    <li className="ml-3">
                        <Link to="/contact" className="btn btn-gold text-[10px] py-[.7rem] px-5">CONTACT</Link>
                    </li>
                </ul>

                {/* Mobile icons */}
                <div className="lg:hidden flex items-center gap-1">
                    <Link to="/panier" className="relative p-2.5 text-white/50 hover:text-gold transition-colors">
                        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center font-lastica text-[7px] leading-none"
                                  style={{ background: '#C9A84C', color: '#050505' }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setSearchOpen(o => !o)} className="text-white/50 hover:text-gold p-2.5 transition-colors">
                        <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    </button>
                    <button className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] ml-1"
                            aria-label="Menu" onClick={() => setOpen(o => !o)}>
                        <span className="block w-5 h-px bg-white/70 transition-all duration-300 origin-center"
                              style={open ? { transform: 'translateY(6px) rotate(45deg)' } : {}} />
                        <span className="block w-5 h-px bg-white/70 transition-all duration-300"
                              style={open ? { opacity: 0 } : {}} />
                        <span className="block w-5 h-px bg-white/70 transition-all duration-300 origin-center"
                              style={open ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}} />
                    </button>
                </div>
            </div>

            {/* Barre de recherche */}
            {searchOpen && (
                <div className="absolute top-full inset-x-0 bg-[#080808] border-b border-[rgba(196,162,103,0.12)] px-6 py-5 z-50"
                     style={{ animation: 'fadeUp .2s forwards' }}>
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center gap-4">
                        <svg className="w-[14px] h-[14px] text-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                        </svg>
                        <input ref={searchRef} type="text" value={searchQuery}
                               onChange={e => setSearchQuery(e.target.value)}
                               placeholder="Rechercher articles, marques, produits…"
                               className="flex-1 bg-transparent text-white font-glacial text-sm tracking-[1px] outline-none placeholder:text-white/20 border-b border-white/10 pb-1.5 focus:border-gold/40 transition-colors" />
                        {searchQuery && (
                            <button type="button" onClick={() => setSearchQuery('')}
                                    className="text-white/25 hover:text-gold transition-colors text-sm leading-none">✕</button>
                        )}
                        <button type="submit" className="btn btn-gold py-[.55rem] px-4 text-[9px]">GO</button>
                    </form>
                </div>
            )}

            {/* Mobile menu */}
            <div id="mobile-menu" className={`absolute top-full inset-x-0 lg:hidden ${open ? 'open' : ''}`}>
                <ul className="py-5 px-6 flex flex-col">
                    {[
                        { to: '/', label: 'HOME' },
                        { to: '/boutique', label: 'BOUTIQUE' },
                        { to: '/catalogues', label: 'CATALOGUES' },
                        { to: '/galerie', label: 'GALERIE' },
                        { to: '/impact', label: 'IMPACT' },
                        { to: '/reservation', label: 'RÉSERVER' },
                    ].map(item => (
                        <li key={item.to}>
                            <Link to={item.to}
                                  className={`font-glacial text-[11px] tracking-[3px] uppercase py-3.5 block border-b border-white/[0.05] transition-colors duration-200 ${
                                      isActive(item.to) ? 'text-gold' : 'text-white/55 hover:text-gold'
                                  }`}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li className="py-3 border-b border-white/[0.05]">
                        <span className="font-lastica text-[8px] tracking-[4px] uppercase text-gold/40 block mb-3">NOS MARQUES</span>
                        <div className="flex flex-col gap-1 pl-2">
                            {brands.map(b => (
                                <Link key={b.slug || b.name} to={b.href}
                                      className="font-glacial text-[11px] tracking-[2px] uppercase text-white/45 hover:text-gold py-1.5 transition-colors">
                                    {b.name}
                                </Link>
                            ))}
                        </div>
                    </li>
                    <li className="py-3 border-b border-white/[0.05]">
                        <span className="font-lastica text-[8px] tracking-[4px] uppercase text-gold/40 block mb-3">JOURNAL</span>
                        <div className="flex flex-col gap-1 pl-2">
                            <Link to="/apropos" className="font-glacial text-[11px] tracking-[2px] uppercase text-white/45 hover:text-gold py-1.5 transition-colors">À Propos</Link>
                            <Link to="/blog" className="font-glacial text-[11px] tracking-[2px] uppercase text-white/45 hover:text-gold py-1.5 transition-colors">Blog & Podcast</Link>
                        </div>
                    </li>
                    <li className="pt-5">
                        <Link to="/contact" className="btn btn-gold w-full justify-center">CONTACT</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
