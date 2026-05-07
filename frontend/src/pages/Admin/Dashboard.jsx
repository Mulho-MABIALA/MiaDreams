import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GOLD = '#C9A84C';

const COLORS = {
    brands:       GOLD,
    posts:        '#7C9A84',
    gallery:      '#9A7C84',
    catalogues:   '#7C849A',
    podcasts:     '#9A847C',
    testimonials: '#7C9A9A',
    team:         '#9A9A7C',
    services:     '#84849A',
    initiatives:  '#7C847C',
    reservations: '#9A947C',
    contacts:     '#7C849A',
    newsletters:  '#847C9A',
    products:     '#C9A84C',
    orders:       '#7C9A84',
};

const CARD_STYLE = {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
};

function StatCard({ label, value, sub, icon, color = GOLD, to }) {
    const card = (
        <div
            className="relative overflow-hidden group cursor-pointer transition-all duration-200"
            style={{
                ...CARD_STYLE,
                padding: '20px',
                borderLeft: `4px solid ${color}`,
                transform: 'translateY(0)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,27,14,0.10), 0 16px 32px rgba(45,27,14,0.08)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(45,27,14,0.06), 0 8px 24px rgba(45,27,14,0.04)';
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `${color}18`,
                    }}
                >
                    <span style={{ color }}>{icon}</span>
                </div>
                <span
                    style={{
                        fontSize: '30px',
                        fontWeight: 700,
                        color: '#1E110A',
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                        opacity: value !== undefined ? 1 : 0.2,
                    }}
                >
                    {value ?? '—'}
                </span>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {label}
            </p>
            {sub && (
                <p style={{ fontSize: '11px', color: '#B8A090', marginTop: '2px' }}>{sub}</p>
            )}
        </div>
    );
    return to ? <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>{card}</Link> : card;
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function RecentItem({ label, sub, badge, badgeColor }) {
    return (
        <div
            className="flex items-center"
            style={{
                gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid #E5E7EB',
            }}
        >
            <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `${badgeColor || GOLD}18`,
                    fontSize: '11px',
                    fontWeight: 700,
                    color: badgeColor || GOLD,
                }}
            >
                {getInitials(label)}
            </div>
            <div className="flex-1 min-w-0">
                <p style={{ fontSize: '13px', color: '#3D2214', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                </p>
                {sub && (
                    <p style={{ fontSize: '11px', color: '#9E8272', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sub}
                    </p>
                )}
            </div>
            {badge && (
                <span
                    className="flex-shrink-0"
                    style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: `${badgeColor || GOLD}18`,
                        color: badgeColor || GOLD,
                        textTransform: 'uppercase',
                    }}
                >
                    {badge}
                </span>
            )}
        </div>
    );
}

function Panel({ title, to, toLabel = 'Voir tout', children }) {
    return (
        <div
            className="flex flex-col"
            style={{ ...CARD_STYLE, padding: '20px' }}
        >
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <p style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9E8272',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                }}>
                    {title}
                </p>
                {to && (
                    <Link
                        to={to}
                        style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: GOLD,
                            textDecoration: 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        {toLabel} →
                    </Link>
                )}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

function Empty({ label }) {
    return (
        <p style={{
            fontSize: '13px',
            color: '#B8A090',
            textAlign: 'center',
            padding: '24px 0',
            fontStyle: 'italic',
        }}>
            {label}
        </p>
    );
}

function SectionLabel({ children }) {
    return (
        <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#9E8272',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '12px',
        }}>
            {children}
        </p>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [recent, setRecent] = useState({ reservations: [], contacts: [], posts: [], testimonials: [], newsletters: [], orders: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get('/api/admin/brands').catch(() => ({ data: [] })),
            axios.get('/api/admin/posts').catch(() => ({ data: [] })),
            axios.get('/api/admin/gallery').catch(() => ({ data: [] })),
            axios.get('/api/admin/catalogues').catch(() => ({ data: [] })),
            axios.get('/api/admin/podcasts').catch(() => ({ data: [] })),
            axios.get('/api/admin/testimonials').catch(() => ({ data: [] })),
            axios.get('/api/admin/team').catch(() => ({ data: [] })),
            axios.get('/api/admin/services').catch(() => ({ data: [] })),
            axios.get('/api/admin/initiatives').catch(() => ({ data: [] })),
            axios.get('/api/admin/reservations').catch(() => ({ data: [] })),
            axios.get('/api/admin/contacts').catch(() => ({ data: [] })),
            axios.get('/api/admin/newsletters').catch(() => ({ data: [] })),
            axios.get('/api/admin/products').catch(() => ({ data: [] })),
            axios.get('/api/admin/orders').catch(() => ({ data: [] })),
        ]).then(([brands, posts, gallery, catalogues, podcasts, testimonials, team, services, initiatives, reservations, contacts, newsletters, products, orders]) => {
            setStats({
                brands:       brands.data.length,
                posts:        posts.data.length,
                gallery:      gallery.data.length,
                catalogues:   catalogues.data.length,
                podcasts:     podcasts.data.length,
                testimonials: testimonials.data.length,
                team:         team.data.length,
                services:     services.data.length,
                initiatives:  initiatives.data.length,
                reservations: reservations.data.length,
                contacts:     contacts.data.length,
                newsletters:  newsletters.data.length,
                products:     products.data.length,
                orders:       orders.data.length,
                revenue:      orders.data.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0),
            });
            setRecent({
                reservations: reservations.data.slice(-5).reverse(),
                contacts:     contacts.data.slice(-5).reverse(),
                posts:        posts.data.slice(-5).reverse(),
                testimonials: testimonials.data.slice(-5).reverse(),
                newsletters:  newsletters.data.slice(-5).reverse(),
                orders:       orders.data.slice(-5).reverse(),
            });
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* ─── HEADER ─── */}
            <div
                className="flex items-end justify-between"
                style={{ marginBottom: '32px', paddingTop: '4px' }}
            >
                <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#9E8272', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
                        Vue d'ensemble
                    </p>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1E110A', letterSpacing: '-0.5px', lineHeight: 1 }}>
                        Dashboard
                    </h1>
                </div>
                <p style={{ fontSize: '12px', color: '#B8A090' }}>
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* ─── BOUTIQUE ─── */}
            <div style={{ marginBottom: '8px' }}>
                <SectionLabel>Boutique e-commerce</SectionLabel>
            </div>
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px' }}
            >
                <StatCard label="Produits"      value={stats.products} icon={<IcoShop />}  color={COLORS.products}  to="/admin/produits"  sub="en boutique" />
                <StatCard label="Commandes"     value={stats.orders}   icon={<IcoCart />}  color={COLORS.orders}   to="/admin/commandes" sub="total reçues" />

                {/* Revenue card — special gradient */}
                <div
                    className="relative overflow-hidden"
                    style={{
                        borderRadius: '16px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #2D1B0E 0%, #4A2C18 100%)',
                        boxShadow: '0 1px 4px rgba(45,27,14,0.10), 0 8px 24px rgba(45,27,14,0.12)',
                        border: '1px solid rgba(201,168,76,0.2)',
                    }}
                >
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(201,168,76,0.2)',
                            marginBottom: '12px',
                        }}
                    >
                        <span style={{ color: GOLD }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="12" y1="1" x2="12" y2="23"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </span>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
                        Revenu total
                    </p>
                    <p style={{ fontSize: '22px', fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                        {(stats.revenue || 0).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                        paiements confirmés
                    </p>
                    {/* decorative circle */}
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-20px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(201,168,76,0.06)',
                        pointerEvents: 'none',
                    }} />
                </div>
            </div>

            {/* ─── CONTENU DU SITE ─── */}
            <div style={{ marginBottom: '8px' }}>
                <SectionLabel>Contenu du site</SectionLabel>
            </div>
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', marginBottom: '32px' }}
            >
                <StatCard label="Marques"     value={stats.brands}      icon={<IcoStar />}     color={COLORS.brands}       to="/admin/marques" />
                <StatCard label="Articles"    value={stats.posts}       icon={<IcoPosts />}    color={COLORS.posts}        to="/admin/blog" />
                <StatCard label="Galerie"     value={stats.gallery}     icon={<IcoGallery />}  color={COLORS.gallery}      to="/admin/galerie" />
                <StatCard label="Catalogues"  value={stats.catalogues}  icon={<IcoBook />}     color={COLORS.catalogues}   to="/admin/catalogues" />
                <StatCard label="Podcasts"    value={stats.podcasts}    icon={<IcoPodcast />}  color={COLORS.podcasts}     to="/admin/blog" />
                <StatCard label="Témoignages" value={stats.testimonials} icon={<IcoQuote />}   color={COLORS.testimonials} to="/admin/temoignages" />
                <StatCard label="Équipe"      value={stats.team}        icon={<IcoTeam />}     color={COLORS.team}         to="/admin/equipe" />
                <StatCard label="Services"    value={stats.services}    icon={<IcoServices />} color={COLORS.services}     to="/admin/services" />
                <StatCard label="Initiatives" value={stats.initiatives} icon={<IcoGlobe />}    color={COLORS.initiatives}  to="/admin/initiatives" />
            </div>

            {/* ─── ACTIVITÉ CLIENTS ─── */}
            <div style={{ marginBottom: '8px' }}>
                <SectionLabel>Activité clients</SectionLabel>
            </div>
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px' }}
            >
                <StatCard label="Réservations" value={stats.reservations} icon={<IcoCal />}   color={COLORS.reservations} to="/admin/reservations" sub="demandes reçues" />
                <StatCard label="Messages"     value={stats.contacts}     icon={<IcoMail />}  color={COLORS.contacts}     to="/admin/contacts"     sub="via le formulaire" />
                <StatCard label="Abonnés"      value={stats.newsletters}  icon={<IcoUsers />} color={COLORS.newsletters}  to="/admin/newsletter"   sub="newsletter" />
            </div>

            {/* ─── PANNEAUX RÉCENTS ─── */}
            <div style={{ marginBottom: '8px' }}>
                <SectionLabel>Activité récente</SectionLabel>
            </div>
            <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginBottom: '32px' }}
            >
                <Panel title="Dernières réservations" to="/admin/reservations">
                    {recent.reservations.length === 0
                        ? <Empty label="Aucune réservation" />
                        : recent.reservations.map(r => (
                            <RecentItem key={r._id}
                                label={r.name || '—'}
                                sub={r.service || r.email}
                                badge={r.status || 'En attente'}
                                badgeColor={COLORS.reservations} />
                        ))
                    }
                </Panel>

                <Panel title="Derniers messages" to="/admin/contacts">
                    {recent.contacts.length === 0
                        ? <Empty label="Aucun message" />
                        : recent.contacts.map(c => (
                            <RecentItem key={c._id}
                                label={c.name || '—'}
                                sub={c.subject || c.email}
                                badge="Nouveau"
                                badgeColor={COLORS.contacts} />
                        ))
                    }
                </Panel>

                <Panel title="Derniers articles" to="/admin/blog">
                    {recent.posts.length === 0
                        ? <Empty label="Aucun article" />
                        : recent.posts.map(p => (
                            <RecentItem key={p._id}
                                label={p.title || '—'}
                                sub={p.category}
                                badge={p.is_published ? 'Publié' : 'Brouillon'}
                                badgeColor={p.is_published ? COLORS.posts : '#9E8272'} />
                        ))
                    }
                </Panel>

                <Panel title="Derniers témoignages" to="/admin/temoignages">
                    {recent.testimonials.length === 0
                        ? <Empty label="Aucun témoignage" />
                        : recent.testimonials.map(t => (
                            <RecentItem key={t._id}
                                label={t.name || '—'}
                                sub={[t.role, t.company].filter(Boolean).join(' · ')}
                                badge={t.is_approved ? 'Approuvé' : 'En attente'}
                                badgeColor={t.is_approved ? COLORS.testimonials : '#9E8272'} />
                        ))
                    }
                </Panel>

                <Panel title="Dernières commandes" to="/admin/commandes">
                    {recent.orders.length === 0
                        ? <Empty label="Aucune commande" />
                        : recent.orders.map(o => (
                            <RecentItem key={o._id}
                                label={o.order_number}
                                sub={`${o.customer.name} — ${o.total.toLocaleString('fr-FR')} FCFA`}
                                badge={o.payment_status === 'paid' ? 'Payé' : 'En attente'}
                                badgeColor={o.payment_status === 'paid' ? COLORS.orders : '#9E8272'} />
                        ))
                    }
                </Panel>

                <Panel title="Abonnés newsletter" to="/admin/newsletter">
                    {recent.newsletters.length === 0
                        ? <Empty label="Aucun abonné" />
                        : recent.newsletters.map(n => (
                            <RecentItem key={n._id}
                                label={n.email || '—'}
                                sub={n.createdAt ? new Date(n.createdAt).toLocaleDateString('fr-FR') : ''}
                                badge="Abonné"
                                badgeColor={COLORS.newsletters} />
                        ))
                    }
                </Panel>

                {/* Pages publiques */}
                <Panel title="Pages publiques">
                    <div>
                        {[
                            { label: 'Accueil',          href: '/' },
                            { label: 'À Propos',         href: '/apropos' },
                            { label: 'Mia Dreams Brand', href: '/miaDreams' },
                            { label: 'MPREW',            href: '/mprew' },
                            { label: 'Personal Branding',href: '/personalBranding' },
                            { label: 'Fashion Program',  href: '/fashionProgram' },
                            { label: 'Galerie',          href: '/gallery' },
                            { label: 'Catalogues',       href: '/catalogues' },
                            { label: 'Blog',             href: '/blog' },
                            { label: 'Impact',           href: '/impact' },
                            { label: 'Contact',          href: '/contact' },
                            { label: 'Réservation',      href: '/reservation' },
                        ].map(p => (
                            <a
                                key={p.href}
                                href={p.href}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between group"
                                style={{
                                    padding: '8px 0',
                                    borderBottom: '1px solid #E5E7EB',
                                    textDecoration: 'none',
                                }}
                            >
                                <span style={{ fontSize: '13px', color: '#6B4F3A', transition: 'color 150ms' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#1E110A'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#6B4F3A'}
                                >
                                    {p.label}
                                </span>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" style={{ flexShrink: 0, opacity: 0.6 }}>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                    <polyline points="15 3 21 3 21 9"/>
                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                            </a>
                        ))}
                    </div>
                </Panel>
            </div>

            {/* ─── ACTIONS RAPIDES ─── */}
            <div style={{ marginBottom: '8px' }}>
                <SectionLabel>Actions rapides</SectionLabel>
            </div>
            <div style={{ ...CARD_STYLE, padding: '20px', marginBottom: '8px' }}>
                <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}
                >
                    {[
                        { label: 'Nouvelle marque',    to: '/admin/marques',      color: COLORS.brands },
                        { label: 'Nouvel article',     to: '/admin/articles',     color: COLORS.posts },
                        { label: 'Ajouter une photo',  to: '/admin/galerie',      color: COLORS.gallery },
                        { label: 'Nouveau catalogue',  to: '/admin/catalogues',   color: COLORS.catalogues },
                        { label: 'Nouveau service',    to: '/admin/services',     color: COLORS.services },
                        { label: 'Voir réservations',  to: '/admin/reservations', color: COLORS.reservations },
                        { label: 'Nouveau podcast',    to: '/admin/podcasts',     color: COLORS.podcasts },
                        { label: 'Ajouter équipe',     to: '/admin/equipe',       color: COLORS.team },
                        { label: 'Nouvelle initiative',to: '/admin/initiatives',  color: COLORS.initiatives },
                        { label: 'Voir messages',      to: '/admin/contacts',     color: COLORS.contacts },
                        { label: 'Abonnés',            to: '/admin/newsletter',   color: COLORS.newsletters },
                        { label: 'Paramètres',         to: '/admin/parametres',   color: '#9E8272' },
                    ].map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className="flex flex-col items-center text-center transition-all duration-150"
                            style={{
                                padding: '16px 12px',
                                background: '#FAFAFA',
                                border: '1px solid #E5E7EB',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                gap: '10px',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#F3F4F6';
                                e.currentTarget.style.borderColor = '#D1D5DB';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,27,14,0.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#FAFAFA';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: `${l.color}18`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: '#6B4F3A', lineHeight: '1.3' }}>
                                {l.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function IcoShop()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> }
function IcoCart()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg> }
function IcoStar()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> }
function IcoPosts()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> }
function IcoGallery()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function IcoBook()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> }
function IcoPodcast()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg> }
function IcoQuote()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IcoTeam()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IcoServices() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IcoGlobe()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
function IcoCal()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IcoMail()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> }
function IcoUsers()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
