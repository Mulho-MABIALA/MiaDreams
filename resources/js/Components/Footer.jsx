import { Link, usePage, useForm } from '@inertiajs/react';

const SOCIAL_ICONS = {
    facebook:  { bg: '#1877F2', svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' },
    instagram: { bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)', svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>' },
    youtube:   { bg: '#FF0000', svg: '<path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>' },
    linkedin:  { bg: '#0A66C2', svg: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' },
    tiktok:    { bg: '#010101', svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>' },
    pinterest: { bg: '#E60023', svg: '<path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>' },
};

function SocialIcon({ platform, url }) {
    const key = platform.toLowerCase();
    const icon = SOCIAL_ICONS[key];
    if (!icon) return null;
    return (
        <a href={url} target="_blank" rel="noopener"
           className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-90"
           style={{ background: icon.bg }}
           title={platform}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"
                 dangerouslySetInnerHTML={{ __html: icon.svg }} />
        </a>
    );
}

export default function Footer() {
    const { companyInfo, socialMediaLinks, navBrands, navCatalogues, flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    const defaultBrands = [
        { name: 'Mia Dreams', href: '/miaDreams' },
        { name: 'MPREW', href: '/mprew' },
        { name: 'Personal Branding', href: '/personalBranding' },
        { name: 'Fashion Program', href: '/fashionProgram' },
    ];
    const brands = navBrands && navBrands.length > 0 ? navBrands : defaultBrands;

    const handleNewsletter = (e) => {
        e.preventDefault();
        post('/newsletter/store', { preserveScroll: true, onSuccess: () => reset() });
    };

    const address = companyInfo?.address || '3 rue Bégenger Ferraud\nCTIC DAKAR, Sénégal';
    const phone   = companyInfo?.phone   || '+221 76 463 91 69';
    const email   = companyInfo?.email   || 'contact@mia-dreams.com';

    return (
        <>
            {/* ── Bande newsletter ── */}
            <div className="gold-strip py-14">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                        <div className="flex-1">
                            <p className="font-lastica text-[8px] tracking-[5px] text-[#080808]/55 uppercase mb-2">Restez connecté</p>
                            <h4 className="font-glacial text-2xl lg:text-3xl font-light text-[#080808] tracking-[4px] uppercase leading-tight">
                                NEWSLETTER<br className="lg:hidden" />
                                <span className="lg:ml-2">MIA DREAMS</span>
                            </h4>
                        </div>

                        <div className="w-full lg:w-[420px]">
                            {flash?.success && flash.success.includes('newsletter') ? (
                                <p className="font-glacial text-sm text-[#080808] tracking-[3px]">✓ Inscription confirmée !</p>
                            ) : (
                                <form onSubmit={handleNewsletter}>
                                    <div className="flex">
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="VOTRE ADRESSE EMAIL"
                                            required
                                            className="flex-1 bg-[#080808]/12 border border-[#080808]/20 border-r-0 text-[#080808] placeholder-[#080808]/35 px-5 py-4 font-glacial text-sm tracking-wide outline-none focus:border-[#080808]/40 transition-colors duration-300"
                                        />
                                        <button type="submit" disabled={processing}
                                                className="bg-[#080808] text-gold border-none px-6 py-4 font-glacial text-[9px] tracking-[3px] uppercase whitespace-nowrap hover:bg-[#1c1c1c] transition-colors duration-300 cursor-pointer disabled:opacity-60">
                                            S'ABONNER
                                        </button>
                                    </div>
                                    {errors.email && <p className="text-red-700 text-xs mt-2 font-glacial">{errors.email}</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Corps du footer ── */}
            <footer className="bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">

                    {/* Grille principale */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/[0.06]">

                        {/* Col 1 — Identité (4/12) */}
                        <div className="lg:col-span-4">
                            <img src="/img/logo_MIA.png" alt="MIA DREAMS"
                                 className="h-11 w-auto mb-5 brightness-0 invert opacity-70" />

                            <p className="font-glacial text-[13px] text-white/35 leading-relaxed mb-8 max-w-[240px]">
                                Maison de mode africaine d'excellence, basée à Dakar. Chaque pièce raconte une histoire.
                            </p>

                            {/* Réseaux sociaux */}
                            <div className="mb-8">
                                <p className="font-lastica text-[7px] tracking-[4px] text-gold/40 uppercase mb-4">Nous suivre</p>
                                <div className="flex flex-wrap gap-2">
                                    {socialMediaLinks && socialMediaLinks.length > 0
                                        ? socialMediaLinks.map(s => <SocialIcon key={s.id} platform={s.platform} url={s.url} />)
                                        : ['facebook','instagram','youtube','linkedin'].map(p => (
                                            <SocialIcon key={p} platform={p} url="#" />
                                        ))
                                    }
                                </div>
                            </div>

                            {/* Coordonnées compactes */}
                            <div className="space-y-3">
                                <a href={`tel:${phone.replace(/\s/g, '')}`}
                                   className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold/50 transition-colors">
                                        <svg className="w-3 h-3 text-gold/50 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <span className="font-glacial text-[13px] text-white/40 group-hover:text-gold transition-colors">{phone}</span>
                                </a>
                                <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                                    <div className="w-7 h-7 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold/50 transition-colors">
                                        <svg className="w-3 h-3 text-gold/50 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <span className="font-glacial text-[13px] text-white/40 group-hover:text-gold transition-colors">{email}</span>
                                </a>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-gold/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <span className="font-glacial text-[13px] text-white/40 leading-relaxed whitespace-pre-line">{address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Col 2 — Navigation (2/12) */}
                        <div className="lg:col-span-2 lg:col-start-6">
                            <p className="eyebrow mb-6">Navigation</p>
                            <ul className="space-y-3.5">
                                {[
                                    { href: '/', label: 'Home' },
                                    { href: '/galerie', label: 'Galerie' },
                                    { href: '/catalogues', label: 'Catalogues' },
                                    { href: '/apropos', label: 'À Propos' },
                                    { href: '/impact', label: 'Notre Impact' },
                                    { href: '/blog', label: 'Blog & Podcast' },
                                    { href: '/reservation', label: 'Réservation' },
                                ].map(item => (
                                    <li key={item.href}>
                                        <Link href={item.href}
                                              className="font-glacial text-[13px] text-white/35 tracking-wide hover:text-gold transition-colors duration-250 inline-block">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3 — Marques (2/12) */}
                        <div className="lg:col-span-2">
                            <p className="eyebrow mb-6">Nos Marques</p>
                            <ul className="space-y-3.5">
                                {brands.map(b => (
                                    <li key={b.slug || b.name}>
                                        <Link href={b.href || `/marque/${b.slug}`}
                                              className="font-glacial text-[13px] text-white/35 tracking-wide hover:text-gold transition-colors duration-250 inline-block">
                                            {b.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 4 — Catalogues (2/12) */}
                        <div className="lg:col-span-2">
                            <p className="eyebrow mb-6">Catalogues</p>
                            <ul className="space-y-3.5">
                                {navCatalogues && navCatalogues.length > 0
                                    ? navCatalogues.slice(0, 5).map(c => (
                                        <li key={c.id}>
                                            <a href={`/catalogue/telecharger/${c.id}`}
                                               className="font-glacial text-[13px] text-white/35 tracking-wide hover:text-gold transition-colors duration-250 inline-flex items-center gap-2">
                                                <svg className="w-2.5 h-2.5 text-gold/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                </svg>
                                                {c.name}
                                            </a>
                                        </li>
                                    ))
                                    : <li className="font-glacial text-[13px] text-white/20">Aucun catalogue</li>
                                }
                                <li className="pt-1">
                                    <Link href="/catalogues" className="font-glacial text-[12px] text-gold/50 tracking-wide hover:text-gold transition-colors">
                                        Voir tous →
                                    </Link>
                                </li>
                            </ul>

                            {/* CTA */}
                            <div className="mt-10">
                                <Link href="/contact" className="btn btn-gold text-[9px] py-3 px-5">
                                    NOUS ÉCRIRE
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Copyright ── */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-7">
                        <p className="font-glacial text-[11px] text-white/20 tracking-wide">
                            © {new Date().getFullYear()} <span className="text-white/35">MIA DREAMS & CO</span> — Tous droits réservés
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-px bg-gold/25" />
                            <p className="font-lastica text-[7px] tracking-[4px] text-gold/50 uppercase">Made In Africa</p>
                            <span className="w-6 h-px bg-gold/25" />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
