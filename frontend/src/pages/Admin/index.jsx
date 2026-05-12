import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Dashboard from './Dashboard';
import AdminBrands from './AdminBrands';
import AdminBlogPodcast from './AdminBlogPodcast';
import AdminGallery from './AdminGallery';
import AdminCatalogues from './AdminCatalogues';
import AdminReservations from './AdminReservations';
import AdminContacts from './AdminContacts';
import AdminNewsletter from './AdminNewsletter';
import AdminTestimonials from './AdminTestimonials';
import AdminTeam from './AdminTeam';
import AdminServices from './AdminServices';
import AdminInitiatives from './AdminInitiatives';
import AdminSettings from './AdminSettings';
import AdminProduits from './AdminProduits';
import AdminCommandes from './AdminCommandes';
import AdminPages from './AdminPages';
import AdminCollections from './AdminCollections';

const NAV_GROUPS = [
    {
        label: 'Principal',
        items: [
            { to: '/admin',       label: 'Dashboard',       icon: <IconDashboard />, end: true },
            { to: '/admin/pages', label: 'Pages dynamiques', icon: <IconPages /> },
        ]
    },
    {
        label: 'Contenu',
        items: [
            { to: '/admin/marques',      label: 'Marques',         icon: <IconBrands /> },
            { to: '/admin/collections',  label: 'Collections',     icon: <IconCollections /> },
            { to: '/admin/blog',         label: 'Blog & Podcast',  icon: <IconBlogPod /> },
            { to: '/admin/galerie',      label: 'Galerie',         icon: <IconGallery /> },
            { to: '/admin/catalogues',   label: 'Catalogues',      icon: <IconCatalogues /> },
            { to: '/admin/temoignages',  label: 'Témoignages',     icon: <IconTestimonials /> },
            { to: '/admin/equipe',       label: 'Équipe',          icon: <IconTeam /> },
            { to: '/admin/services',     label: 'Services',        icon: <IconServices /> },
            { to: '/admin/initiatives',  label: 'Initiatives',     icon: <IconInitiatives /> },
        ]
    },
    {
        label: 'Boutique',
        items: [
            { to: '/admin/produits',   label: 'Produits',   icon: <IconShop /> },
            { to: '/admin/commandes',  label: 'Commandes',  icon: <IconCart /> },
        ]
    },
    {
        label: 'Clients',
        items: [
            { to: '/admin/reservations', label: 'Réservations', icon: <IconReservations /> },
            { to: '/admin/contacts', label: 'Messages', icon: <IconContacts /> },
            { to: '/admin/newsletter', label: 'Newsletter', icon: <IconNewsletter /> },
        ]
    },
    {
        label: 'Configuration',
        items: [
            { to: '/admin/parametres', label: 'Paramètres', icon: <IconSettings /> },
        ]
    },
];

export default function Admin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem('admin_user');
        return u ? JSON.parse(u) : null;
    });
    const [collapsed, setCollapsed] = useState(false);

    // Supprimer le padding-top du body (prévu pour la nav publique)
    useEffect(() => {
        const prev = document.body.style.paddingTop;
        document.body.style.paddingTop = '0';
        return () => { document.body.style.paddingTop = prev; };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) { navigate('/login'); return; }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Intercepteur 401 : token expiré → redirect login
        const interceptor = axios.interceptors.response.use(
            r => r,
            err => {
                if (err.response?.status === 401) {
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    navigate('/login');
                }
                return Promise.reject(err);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    // Page title from path
    const allItems = NAV_GROUPS.flatMap(g => g.items);
    const active = allItems.find(i => i.end ? location.pathname === i.to : location.pathname.startsWith(i.to));

    if (!user) return null;

    return (
        <div className="h-screen flex overflow-hidden" style={{ background: '#F2F3F5', fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" }}>
            {/* SIDEBAR */}
            <aside
                className="flex-shrink-0 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    background: '#1E110A',
                    width: collapsed ? '64px' : '240px',
                    boxShadow: '2px 0 16px rgba(30,17,10,0.18)',
                }}
            >
                {/* Brand */}
                <div
                    className="flex items-center flex-shrink-0 overflow-hidden"
                    style={{
                        height: '64px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        padding: collapsed ? '0 16px' : '0 20px',
                        gap: collapsed ? 0 : '12px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                >
                    <img
                        src="/img/logo_MIA.png"
                        alt="MIA"
                        style={{ height: '28px', flexShrink: 0, filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                    />
                    {!collapsed && (
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <p style={{ fontFamily: 'inherit', fontSize: '11px', letterSpacing: '3px', color: '#FFFFFF', textTransform: 'uppercase', lineHeight: 1, fontWeight: 700 }}>
                                MIA DREAMS
                            </p>
                            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '3px', letterSpacing: '1px' }}>
                                Administration
                            </p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto" style={{ padding: '16px 8px', overflowX: 'hidden' }}>
                    {NAV_GROUPS.map(group => (
                        <div key={group.label} style={{ marginBottom: '20px' }}>
                            {!collapsed && (
                                <p style={{
                                    fontSize: '10px',
                                    letterSpacing: '2.5px',
                                    color: 'rgba(255,255,255,0.25)',
                                    textTransform: 'uppercase',
                                    padding: '0 12px',
                                    marginBottom: '6px',
                                    fontWeight: 600,
                                }}>
                                    {group.label}
                                </p>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {group.items.map(item => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center transition-all duration-150 rounded-lg ${
                                                collapsed ? 'justify-center' : 'gap-3'
                                            } ${
                                                isActive
                                                    ? 'bg-[#C9A84C] text-[#1E110A]'
                                                    : 'text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                                            }`
                                        }
                                        style={{ padding: collapsed ? '10px 0' : '9px 12px' }}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span className="flex-shrink-0" style={{ opacity: isActive ? 1 : 0.8 }}>
                                                    {item.icon}
                                                </span>
                                                {!collapsed && (
                                                    <span style={{
                                                        fontSize: '13px',
                                                        fontWeight: isActive ? 600 : 400,
                                                        letterSpacing: '0.2px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                                        {item.label}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '8px', flexShrink: 0 }}>
                    <button
                        onClick={logout}
                        className="flex items-center w-full rounded-lg transition-all duration-150 hover:bg-red-900/30"
                        style={{
                            gap: collapsed ? 0 : '12px',
                            padding: collapsed ? '10px 0' : '9px 12px',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            color: 'rgba(255,255,255,0.35)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                    >
                        <IconLogout />
                        {!collapsed && (
                            <span style={{ fontSize: '13px', letterSpacing: '0.2px' }}>Déconnexion</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header
                    className="flex items-center flex-shrink-0"
                    style={{
                        height: '64px',
                        background: '#FFFFFF',
                        borderBottom: '1px solid #EDE5DA',
                        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
                        padding: '0 24px',
                        gap: '16px',
                    }}
                >
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className="flex items-center justify-center rounded-lg transition-all duration-150"
                        style={{
                            width: '36px',
                            height: '36px',
                            color: '#9E8272',
                            background: 'transparent',
                            border: '1px solid transparent',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#F5EDE0';
                            e.currentTarget.style.borderColor = '#DDD0C0';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        <IconMenu />
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center" style={{ gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#B8A090' }}>Admin</span>
                        {active && (
                            <>
                                <span style={{ color: '#DDD0C0', fontSize: '13px' }}>/</span>
                                <span style={{ fontSize: '13px', color: '#6B4F3A', fontWeight: 500 }}>{active.label}</span>
                            </>
                        )}
                    </div>

                    <div className="flex-1" />

                    {/* View site button */}
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center rounded-lg transition-all duration-150"
                        style={{
                            fontSize: '11px',
                            letterSpacing: '1.5px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: '#7A6048',
                            border: '1px solid #DDD0C0',
                            padding: '6px 14px',
                            textDecoration: 'none',
                            background: 'transparent',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5EDE0'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        Voir le site
                    </a>

                    {/* User */}
                    <div
                        className="flex items-center"
                        style={{
                            gap: '10px',
                            paddingLeft: '16px',
                            borderLeft: '1px solid #EDE5DA',
                        }}
                    >
                        <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #C9A84C 0%, #E8C66A 100%)',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#1E110A',
                            }}
                        >
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="hidden sm:block">
                            <p style={{ fontSize: '13px', color: '#3D2214', fontWeight: 500, lineHeight: 1 }}>{user.name}</p>
                            <p style={{ fontSize: '11px', color: '#9E8272', marginTop: '2px' }}>Administrateur</p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto" style={{ background: '#F2F3F5' }}>
                    <div style={{ padding: '32px', maxWidth: '1400px' }}>
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="marques/*"     element={<AdminBrands />} />
                            <Route path="collections/*" element={<AdminCollections />} />
                            <Route path="blog/*"    element={<AdminBlogPodcast />} />
                            {/* redirects anciens liens */}
                            <Route path="articles/*" element={<Navigate to="/admin/blog" replace />} />
                            <Route path="podcasts/*" element={<Navigate to="/admin/blog" replace />} />
                            <Route path="galerie/*" element={<AdminGallery />} />
                            <Route path="catalogues/*" element={<AdminCatalogues />} />
                            <Route path="temoignages/*" element={<AdminTestimonials />} />
                            <Route path="equipe/*" element={<AdminTeam />} />
                            <Route path="services/*" element={<AdminServices />} />
                            <Route path="initiatives/*" element={<AdminInitiatives />} />
                            <Route path="produits/*"   element={<AdminProduits />} />
                            <Route path="commandes/*"  element={<AdminCommandes />} />
                            <Route path="reservations" element={<AdminReservations />} />
                            <Route path="contacts" element={<AdminContacts />} />
                            <Route path="newsletter" element={<AdminNewsletter />} />
                            <Route path="pages/*"    element={<AdminPages />} />
                            <Route path="parametres" element={<AdminSettings />} />
                            <Route path="*" element={<Navigate to="/admin" replace />} />
                        </Routes>
                    </div>

                    {/* Footer */}
                    <footer style={{
                        borderTop: '1px solid #E5E7EB',
                        background: '#FFFFFF',
                        padding: '14px 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                    }}>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                            © {new Date().getFullYear()} <span style={{ color: '#C9A84C', fontWeight: 600 }}>MIA DREAMS & CO</span> — Tous droits réservés
                        </span>
                        <span style={{ fontSize: '11px', color: '#D1D5DB', letterSpacing: '0.5px' }}>
                            Administration v1.0
                        </span>
                    </footer>
                </main>
            </div>
        </div>
    );
}

// Icons SVG
function IconDashboard() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function IconPages()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> }
function IconBrands()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> }
function IconCollections() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconPosts() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> }
function IconBlogPod() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="14" r="1"/><path d="M12.5 12.5a3 3 0 0 1 0 3.5"/></svg> }
function IconGallery() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> }
function IconCatalogues() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> }
function IconPodcasts() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg> }
function IconTestimonials() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IconTeam() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IconServices() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInitiatives() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
function IconReservations() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function IconContacts() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> }
function IconNewsletter() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> }
function IconSettings() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconShop() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> }
function IconCart() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg> }
function IconMenu() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg> }
