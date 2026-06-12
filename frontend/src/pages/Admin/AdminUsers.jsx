import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/ConfirmDialog';

const GOLD = '#C9A84C';

// Labels + icônes pour chaque module
const MODULE_META = {
    pages:        { label: 'Pages dynamiques', icon: '📄' },
    marques:      { label: 'Marques',          icon: '⭐' },
    collections:  { label: 'Collections',      icon: '🗂️' },
    blog:         { label: 'Blog & Podcast',   icon: '✍️' },
    galerie:      { label: 'Galerie',          icon: '🖼️' },
    catalogues:   { label: 'Catalogues',       icon: '📚' },
    temoignages:  { label: 'Témoignages',      icon: '💬' },
    equipe:       { label: 'Équipe',           icon: '👥' },
    initiatives:  { label: 'Initiatives',      icon: '🌍' },
    programmes:   { label: 'Formations',       icon: '🎓' },
    inscriptions: { label: 'Inscriptions',     icon: '📝' },
    produits:     { label: 'Produits',         icon: '🛍️' },
    commandes:    { label: 'Commandes',        icon: '🛒' },
    reservations: { label: 'Réservations',     icon: '📅' },
    contacts:     { label: 'Messages',         icon: '✉️' },
    newsletter:   { label: 'Newsletter',       icon: '📬' },
    pos:          { label: 'Point de Vente',   icon: '🏪' },
    caisse:       { label: 'Caisse',           icon: '💰' },
    parametres:   { label: 'Paramètres',       icon: '⚙️' },
};
const MODULE_LABELS = Object.fromEntries(Object.entries(MODULE_META).map(([k,v]) => [k, v.label]));

const MODULE_GROUPS = [
    {
        label: 'Principal', color: '#C9A84C',
        fixed: [{ key: 'dashboard', label: 'Dashboard', icon: '🏠', desc: 'Toujours accessible' }],
        keys: ['pages'],
    },
    {
        label: 'Contenu', color: '#7C9A84',
        keys: ['marques','collections','blog','galerie','catalogues','temoignages','equipe','initiatives'],
    },
    {
        label: 'Programmes', color: '#9A7C84',
        keys: ['programmes','inscriptions'],
    },
    {
        label: 'Boutique', color: '#7C849A',
        keys: ['produits','commandes'],
    },
    {
        label: 'Finance', color: '#C9A84C',
        keys: ['pos','caisse'],
    },
    {
        label: 'Clients', color: '#9A847C',
        keys: ['reservations','contacts','newsletter'],
    },
    {
        label: 'Configuration', color: '#6B7280',
        keys: ['parametres'],
    },
];

const empty = { name: '', email: '', password: '', role: 'admin', permissions: [], is_active: true };

export default function AdminUsers() {
    const toast   = useToast();
    const confirm = useConfirm();
    const [users, setUsers]   = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal]   = useState(null); // null | 'create' | user object
    const [form, setForm]     = useState(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');
    const [showPwd, setShowPwd] = useState(false);

    // Récupère l'utilisateur courant depuis localStorage
    const me = (() => { try { return JSON.parse(localStorage.getItem('admin_user')); } catch { return null; } })();

    const load = () => {
        setLoading(true);
        axios.get('/api/admin/users')
            .then(r => { setUsers(r.data.users || []); setModules(r.data.modules || []); })
            .catch(e => setError(e.response?.data?.message || 'Erreur chargement'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setForm(empty);
        setError('');
        setShowPwd(false);
        setModal('create');
    };

    const openEdit = (u) => {
        setForm({
            name: u.name || '',
            email: u.email || '',
            password: '',
            role: u.role || 'admin',
            permissions: u.permissions || [],
            is_active: u.is_active !== false,
        });
        setError('');
        setShowPwd(false);
        setModal(u);
    };

    const togglePerm = (key) => {
        setForm(f => ({
            ...f,
            permissions: f.permissions.includes(key)
                ? f.permissions.filter(p => p !== key)
                : [...f.permissions, key],
        }));
    };

    const selectAll = () => setForm(f => ({ ...f, permissions: [...modules] }));
    const clearAll  = () => setForm(f => ({ ...f, permissions: [] }));

    const save = async () => {
        setError('');
        if (!form.name.trim() || !form.email.trim()) { setError('Nom et email requis.'); return; }
        if (modal === 'create' && !form.password) { setError('Mot de passe requis.'); return; }
        if (form.password && form.password.length < 8) { setError('Mot de passe minimum 8 caractères.'); return; }

        setSaving(true);
        try {
            const payload = { ...form };
            if (!payload.password) delete payload.password;
            if (modal === 'create') {
                await axios.post('/api/admin/users', payload);
            } else {
                await axios.put(`/api/admin/users/${modal._id}`, payload);
            }
            load();
            setModal(null);
        } catch (e) {
            setError(e.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const del = async (id) => {
        const ok = await confirm({
            title: 'Supprimer cet utilisateur ?',
            message: 'Cet utilisateur perdra définitivement son accès à l\'administration.',
            confirmLabel: 'Supprimer',
            danger: true,
        });
        if (!ok) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            load();
            toast('Utilisateur supprimé.', 'success');
        } catch (e) {
            toast(e.response?.data?.message || 'Erreur lors de la suppression.', 'error');
        }
    };

    // Rétrocompatibilité : ancien token sans permissions = accès complet (seul admin du système)
    const isSuperAdmin = me?.role === 'super_admin' || !me?.permissions;

    if (!isSuperAdmin) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9E8272' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔒</div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E110A' }}>Accès réservé</h2>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Seul le super administrateur peut gérer les utilisateurs.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1E110A' }}>Gestion des utilisateurs</h1>
                    <p style={{ fontSize: '13px', color: '#9E8272', marginTop: '2px' }}>
                        {users.length} utilisateur{users.length !== 1 ? 's' : ''} · Super admin uniquement
                    </p>
                </div>
                <button onClick={openCreate} style={{ background: GOLD, color: '#1E110A', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px' }}>
                    + Nouvel utilisateur
                </button>
            </div>

            {/* Info box */}
            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '12.5px', color: '#92400E', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>ℹ️</span>
                <span>
                    <strong>Super Admin</strong> a accès à tout sans restriction.
                    <strong> Admin</strong> n'accède qu'aux modules que vous lui accordez.
                    Le mot de passe est laissé vide lors de la modification pour le conserver tel quel.
                </span>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9E8272' }}>Chargement…</div>
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {users.map(u => (
                        <div key={u._id} style={{
                            background: '#fff', borderRadius: '12px',
                            border: `1px solid ${u._id === me?._id ? GOLD + '40' : '#E5E7EB'}`,
                            padding: '18px 20px',
                            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                background: u.role === 'super_admin' ? `linear-gradient(135deg, ${GOLD}, #E8C66A)` : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', fontWeight: 700, color: '#fff',
                            }}>
                                {u.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                            </div>

                            {/* Infos */}
                            <div style={{ flex: 1, minWidth: '180px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E110A' }}>{u.name}</span>
                                    {u._id === me?._id && <span style={{ fontSize: '10px', color: GOLD, background: GOLD + '15', borderRadius: '4px', padding: '1px 7px' }}>Vous</span>}
                                    <RoleBadge role={u.role} />
                                    {!u.is_active && <span style={{ fontSize: '10px', background: '#FEF2F2', color: '#DC2626', borderRadius: '4px', padding: '1px 7px' }}>Inactif</span>}
                                </div>
                                <p style={{ fontSize: '12px', color: '#9E8272', marginTop: '2px' }}>{u.email}</p>
                                {u.role !== 'super_admin' && (
                                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {u.permissions?.length === 0 ? (
                                            <span style={{ fontSize: '10px', color: '#DC2626' }}>Aucun accès accordé</span>
                                        ) : u.permissions?.map(p => (
                                            <span key={p} style={{ fontSize: '10px', background: '#F0FDF4', color: '#15803D', borderRadius: '3px', padding: '1px 6px' }}>
                                                {MODULE_LABELS[p] || p}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <button onClick={() => openEdit(u)} style={{ fontSize: '12px', background: '#F5EDE0', color: '#6B4F3A', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontWeight: 500 }}>
                                    Modifier
                                </button>
                                {u._id !== me?._id && (
                                    <button onClick={() => del(u._id)} style={{ fontSize: '12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                                        Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── MODAL ── */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '32px', marginTop: '20px', marginBottom: '20px' }}>

                        {/* Header modal */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1E110A' }}>
                                    {modal === 'create' ? 'Nouvel utilisateur' : `Modifier — ${modal.name}`}
                                </h2>
                                <p style={{ fontSize: '12px', color: '#9E8272', marginTop: '3px' }}>
                                    {modal === 'create' ? 'Créez un compte admin et définissez ses accès.' : 'Mettez à jour les informations et les droits.'}
                                </p>
                            </div>
                            <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9E8272', lineHeight: 1 }}>✕</button>
                        </div>

                        {/* Informations de base */}
                        <Section title="Informations">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Field label="Nom complet *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Prénom Nom" />
                                <Field label="Email *" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="email@exemple.com" />
                                <div style={{ position: 'relative' }}>
                                    <Field
                                        label={modal === 'create' ? 'Mot de passe *' : 'Nouveau mot de passe (laisser vide = inchangé)'}
                                        type={showPwd ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={v => setForm(f => ({ ...f, password: v }))}
                                        placeholder="Min. 8 caractères"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPwd(s => !s)}
                                        style={{ position: 'absolute', right: '10px', bottom: '9px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#9E8272' }}
                                    >
                                        {showPwd ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <div>
                                    <label style={labelStyle}>Statut</label>
                                    <Toggle label="Compte actif" checked={form.is_active} onChange={v => setForm(f => ({ ...f, is_active: v }))} />
                                </div>
                            </div>
                        </Section>

                        {/* Rôle */}
                        <Section title="Rôle">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {[
                                    { value: 'super_admin', label: 'Super Admin', desc: 'Accès complet à tout, gère les utilisateurs', color: GOLD },
                                    { value: 'admin',       label: 'Admin',       desc: 'Accès limité aux modules sélectionnés', color: '#6B7280' },
                                ].map(opt => (
                                    <div
                                        key={opt.value}
                                        onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                                        style={{
                                            border: `2px solid ${form.role === opt.value ? opt.color : '#E5E7EB'}`,
                                            borderRadius: '10px', padding: '14px',
                                            cursor: 'pointer',
                                            background: form.role === opt.value ? opt.color + '08' : '#fff',
                                            transition: 'all .15s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: form.role === opt.value ? opt.color : '#E5E7EB', flexShrink: 0 }} />
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E110A' }}>{opt.label}</span>
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#9E8272', paddingLeft: '18px' }}>{opt.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Permissions — seulement si role = admin */}
                        {form.role === 'admin' && (
                            <Section title="Droits d'accès">
                                {/* Barre d'actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '10px 14px', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #F0E8D8' }}>
                                    <button onClick={selectAll} style={{ fontSize: '11px', fontWeight: 600, background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: '7px', padding: '5px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="#15803D" strokeWidth="2" strokeLinecap="round"/></svg>
                                        Tout sélectionner
                                    </button>
                                    <button onClick={clearAll} style={{ fontSize: '11px', fontWeight: 600, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '7px', padding: '5px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><line x1="2" y1="2" x2="10" y2="10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/><line x1="10" y1="2" x2="2" y2="10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/></svg>
                                        Tout désélectionner
                                    </button>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `conic-gradient(${GOLD} ${(form.permissions.length/modules.length)*360}deg, #E5E7EB 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: GOLD }}>
                                                {form.permissions.length}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '11px', color: '#9E8272', fontWeight: 500 }}>{form.permissions.length}/{modules.length}</span>
                                    </div>
                                </div>

                                {/* Groupes */}
                                {MODULE_GROUPS.map(group => (
                                    <div key={group.label} style={{ marginBottom: '18px' }}>
                                        {/* Header groupe */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '8px' }}>
                                            <div style={{ width: 3, height: 14, borderRadius: 2, background: group.color, flexShrink: 0 }} />
                                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
                                                {group.label}
                                            </p>
                                            {group.fixed && (
                                                <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: 1 }}>· accès inclus par défaut</span>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '6px' }}>
                                            {/* Items toujours actifs (dashboard…) */}
                                            {(group.fixed || []).map(item => (
                                                <div key={item.key} style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '9px 11px', borderRadius: '9px',
                                                    border: `1px solid ${group.color}40`,
                                                    background: `${group.color}08`,
                                                    opacity: 0.75,
                                                    cursor: 'default',
                                                }}>
                                                    <span style={{ fontSize: '14px', lineHeight: 1 }}>{item.icon}</span>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                                                        <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '0.5px' }}>{item.desc}</span>
                                                    </div>
                                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11 7V5a3 3 0 00-6 0v2M5 7h6a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1z" stroke={group.color} strokeWidth="1.5" strokeLinecap="round"/></svg>
                                                </div>
                                            ))}

                                            {/* Items sélectionnables */}
                                            {group.keys.filter(k => modules.includes(k)).map(key => {
                                                const meta    = MODULE_META[key] || { label: key, icon: '📌' };
                                                const checked = form.permissions.includes(key);
                                                return (
                                                    <div
                                                        key={key}
                                                        onClick={() => togglePerm(key)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '9px',
                                                            padding: '9px 11px', borderRadius: '9px', cursor: 'pointer',
                                                            border: `1px solid ${checked ? group.color + '50' : '#E5E7EB'}`,
                                                            background: checked ? group.color + '0D' : '#FAFAFA',
                                                            transition: 'all .15s',
                                                            userSelect: 'none',
                                                        }}
                                                        onMouseEnter={e => { if (!checked) e.currentTarget.style.background = '#F5F5F5'; }}
                                                        onMouseLeave={e => { if (!checked) e.currentTarget.style.background = '#FAFAFA'; }}
                                                    >
                                                        {/* Checkbox */}
                                                        <div style={{
                                                            width: '17px', height: '17px', borderRadius: '5px', flexShrink: 0,
                                                            border: `2px solid ${checked ? group.color : '#D1D5DB'}`,
                                                            background: checked ? group.color : 'transparent',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'all .15s',
                                                        }}>
                                                            {checked && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>}
                                                        </div>
                                                        <span style={{ fontSize: '13px', lineHeight: 1, flexShrink: 0 }}>{meta.icon}</span>
                                                        <span style={{ fontSize: '12px', color: checked ? '#1E110A' : '#6B7280', fontWeight: checked ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {error && <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px', padding: '8px 12px', background: '#FEF2F2', borderRadius: '6px' }}>{error}</p>}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setModal(null)} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#6B7280' }}>
                                Annuler
                            </button>
                            <button onClick={save} disabled={saving} style={{ padding: '9px 28px', borderRadius: '8px', background: GOLD, border: 'none', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', color: '#1E110A', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Enregistrement…' : (modal === 'create' ? 'Créer l\'utilisateur' : 'Enregistrer')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Composants internes ───────────────────────────────────────────────────────

function RoleBadge({ role }) {
    const config = role === 'super_admin'
        ? { label: 'Super Admin', bg: '#FEF3C7', color: '#92400E' }
        : { label: 'Admin',       bg: '#F3F4F6', color: '#374151' };
    return (
        <span style={{ fontSize: '10px', background: config.bg, color: config.color, borderRadius: '4px', padding: '1px 8px', fontWeight: 600 }}>
            {config.label}
        </span>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E110A', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
                <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
            </div>
            {children}
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' };
const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#1E110A', background: '#FAFAFA', outline: 'none', boxSizing: 'border-box' };

function Field({ label, value, onChange, type = 'text', placeholder }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    const GOLD = '#C9A84C';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', cursor: 'pointer' }} onClick={() => onChange(!checked)}>
            <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: checked ? GOLD : '#E5E7EB', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: checked ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
            <span style={{ fontSize: '13px', color: '#1E110A' }}>{label}</span>
        </div>
    );
}
