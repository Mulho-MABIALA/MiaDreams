import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/ConfirmDialog';

const GOLD = '#C9A84C';

const STATUS_OPTS = [
    { value: 'en attente', label: 'En attente', bg: '#FEF3C7', color: '#92400E' },
    { value: 'acceptée',   label: 'Acceptée',   bg: '#DCFCE7', color: '#15803D' },
    { value: 'refusée',    label: 'Refusée',    bg: '#FEF2F2', color: '#DC2626' },
];
const statusStyle = (s) => STATUS_OPTS.find(o => o.value === s) || { bg: '#F3F4F6', color: '#6B7280' };

const EMPTY_FORM = { programme: '', nom: '', email: '', telephone: '', message: '', status: 'en attente' };

/* ── Badge statut ── */
function StatusBadge({ status }) {
    const s = statusStyle(status);
    return (
        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
            {STATUS_OPTS.find(o => o.value === status)?.label || status}
        </span>
    );
}

/* ── Initiales avatar ── */
function Avatar({ nom }) {
    const initials = (nom || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#C9A84C,#E0BC6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#1E110A', flexShrink: 0 }}>
            {initials}
        </div>
    );
}

export default function AdminInscriptions() {
    const toast   = useToast();
    const confirm = useConfirm();

    const [inscriptions, setInscriptions] = useState([]);
    const [programmes, setProgrammes]     = useState([]);
    const [filter, setFilter]             = useState('');
    const [loading, setLoading]           = useState(true);

    // Modals
    const [showCreate, setShowCreate]   = useState(false);
    const [showFiche,  setShowFiche]    = useState(null);  // inscription complète
    const [showEdit,   setShowEdit]     = useState(null);  // inscription à modifier

    const [form, setForm]       = useState(EMPTY_FORM);
    const [saving, setSaving]   = useState(false);
    const [formErr, setFormErr] = useState('');

    // État envoi fiche
    const [sendingFiche, setSendingFiche] = useState(false);
    const [ficheEmail,   setFicheEmail]   = useState('');

    const load = (programmeId = '') => {
        setLoading(true);
        axios.get('/api/admin/inscriptions', { params: programmeId ? { programme: programmeId } : {} })
            .then(r => setInscriptions(r.data.inscriptions || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        axios.get('/api/admin/programmes').then(r => setProgrammes(r.data.programmes || []));
        load();
    }, []);

    /* ── Changer statut inline ── */
    const changeStatus = async (id, status) => {
        await axios.put(`/api/admin/inscriptions/${id}`, { status });
        setInscriptions(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        if (showFiche?._id === id) setShowFiche(f => ({ ...f, status }));
        toast('Statut mis à jour.', 'success');
    };

    /* ── Supprimer ── */
    const del = async (id) => {
        const ok = await confirm({ title: 'Supprimer cette inscription ?', message: 'Cette action est irréversible.', confirmLabel: 'Supprimer', danger: true });
        if (!ok) return;
        await axios.delete(`/api/admin/inscriptions/${id}`);
        setInscriptions(prev => prev.filter(i => i._id !== id));
        setShowFiche(null);
        toast('Inscription supprimée.', 'success');
    };

    /* ── Créer ── */
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.programme || !form.nom || !form.email) { setFormErr('Programme, nom et email requis.'); return; }
        setSaving(true); setFormErr('');
        try {
            const { data } = await axios.post('/api/admin/inscriptions', form);
            setInscriptions(prev => [data.inscription, ...prev]);
            setShowCreate(false);
            toast('Inscription ajoutée !', 'success');
        } catch (err) { setFormErr(err.response?.data?.message || 'Erreur.'); }
        finally { setSaving(false); }
    };

    /* ── Modifier ── */
    const handleEdit = async (e) => {
        e.preventDefault();
        if (!form.nom || !form.email) { setFormErr('Nom et email requis.'); return; }
        setSaving(true); setFormErr('');
        try {
            const { data } = await axios.put(`/api/admin/inscriptions/${showEdit._id}`, form);
            setInscriptions(prev => prev.map(i => i._id === data._id ? data : i));
            setShowEdit(null);
            toast('Inscription modifiée !', 'success');
        } catch (err) { setFormErr(err.response?.data?.message || 'Erreur.'); }
        finally { setSaving(false); }
    };

    /* ── Envoyer fiche ── */
    const sendFiche = async (insc) => {
        setSendingFiche(true);
        try {
            const dest = ficheEmail.trim() || insc.email;
            await axios.post(`/api/admin/inscriptions/${insc._id}/send-fiche`, { to: dest });
            toast(`Fiche envoyée à ${dest} !`, 'success');
            setFicheEmail('');
        } catch (err) {
            toast(err.response?.data?.message || 'Erreur envoi email.', 'error');
        } finally { setSendingFiche(false); }
    };

    const openEdit = (insc) => {
        setForm({ programme: insc.programme?._id || '', nom: insc.nom, email: insc.email, telephone: insc.telephone || '', message: insc.message || '', status: insc.status });
        setFormErr('');
        setShowEdit(insc);
    };

    const counts = { total: inscriptions.length, 'en attente': 0, 'acceptée': 0, 'refusée': 0 };
    inscriptions.forEach(i => { if (counts[i.status] !== undefined) counts[i.status]++; });

    return (
        <div>
            {/* ── En-tête ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1E110A' }}>Inscriptions aux formations</h1>
                    <p style={{ fontSize: '13px', color: '#9E8272', marginTop: '2px' }}>{counts.total} inscription{counts.total !== 1 ? 's' : ''}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select value={filter} onChange={e => { setFilter(e.target.value); load(e.target.value); }} style={selStyle}>
                        <option value="">Tous les programmes</option>
                        {programmes.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => { setForm({ ...EMPTY_FORM, programme: filter || '' }); setFormErr(''); setShowCreate(true); }} style={btnGold}>
                        + Inscrire manuellement
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
                {[['En attente', counts['en attente'], '#92400E', '#FEF3C7'], ['Acceptées', counts['acceptée'], '#15803D', '#DCFCE7'], ['Refusées', counts['refusée'], '#DC2626', '#FEF2F2']].map(([label, n, color, bg]) => (
                    <div key={label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', borderLeft: `4px solid ${color}` }}>
                        <p style={{ fontSize: '28px', fontWeight: 700, color: '#1E110A', margin: 0 }}>{n}</p>
                        <p style={{ fontSize: '11px', color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 0' }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Table ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#9E8272' }}>Chargement…</div>
            ) : inscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px', color: '#B8A090', fontSize: '14px' }}>Aucune inscription pour le moment.</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                {['Participant', 'Programme', 'Téléphone', 'Date', 'Statut', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9E8272', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inscriptions.map((insc, i) => (
                                <tr key={insc._id} style={{ borderBottom: i < inscriptions.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    {/* Participant */}
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Avatar nom={insc.nom} />
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, color: '#1E110A', fontSize: '13px' }}>{insc.nom}</p>
                                                <p style={{ margin: 0, color: '#9E8272', fontSize: '11px' }}>{insc.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#6B7280' }}>{insc.programme?.name || '—'}</td>
                                    <td style={{ padding: '12px 16px', color: '#6B7280' }}>{insc.telephone || '—'}</td>
                                    <td style={{ padding: '12px 16px', color: '#9E8272', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                        {new Date(insc.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <select value={insc.status} onChange={e => changeStatus(insc._id, e.target.value)}
                                            style={{ fontSize: '11px', border: 'none', borderRadius: '20px', padding: '4px 10px', cursor: 'pointer', fontWeight: 600, outline: 'none', ...(() => { const s = statusStyle(insc.status); return { background: s.bg, color: s.color }; })() }}>
                                            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <button onClick={() => { setFicheEmail(''); setShowFiche(insc); }} style={btnAction('#EEF2FF', '#4F46E5')}>Voir</button>
                                            <button onClick={() => openEdit(insc)} style={btnAction('#FFF7ED', '#C2410C')}>Modifier</button>
                                            <button onClick={() => del(insc._id)} style={btnAction('#FEF2F2', '#DC2626')}>Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                MODALE — FICHE INSCRIPTION
            ══════════════════════════════════════════════════════════ */}
            {showFiche && (
                <ModalOverlay onClose={() => setShowFiche(null)}>
                    <div style={{ width: '100%', maxWidth: '520px' }}>
                        {/* Header */}
                        <div style={{ background: 'linear-gradient(135deg,#1a0f07,#2D1B0E,#4A2C18)', borderRadius: '12px 12px 0 0', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Avatar nom={showFiche.nom} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '10px', letterSpacing: '3px', color: 'rgba(201,168,76,.6)', textTransform: 'uppercase' }}>Fiche d'inscription</p>
                                <h2 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: '#C9A84C' }}>{showFiche.nom}</h2>
                            </div>
                            <StatusBadge status={showFiche.status} />
                            <button onClick={() => setShowFiche(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', fontSize: '22px', cursor: 'pointer', lineHeight: 1, marginLeft: '4px' }}>×</button>
                        </div>

                        {/* Corps */}
                        <div style={{ background: '#fff', padding: '28px', borderRadius: '0 0 12px 12px' }}>
                            {/* Infos */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                {[
                                    ['Programme', showFiche.programme?.name || '—'],
                                    ['Email',     showFiche.email],
                                    ['Téléphone', showFiche.telephone || '—'],
                                    ['Date',      new Date(showFiche.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
                                ].map(([k, v]) => (
                                    <tr key={k} style={{ borderBottom: '1px solid #F0E8D8' }}>
                                        <td style={{ padding: '10px 0', fontSize: '11px', color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px', width: '120px' }}>{k}</td>
                                        <td style={{ padding: '10px 0', fontSize: '14px', color: '#1E110A', fontWeight: 500 }}>{v}</td>
                                    </tr>
                                ))}
                            </table>

                            {/* Message motivation */}
                            {showFiche.message && (
                                <div style={{ background: '#FDF8F2', borderLeft: '3px solid #C9A84C', padding: '14px 16px', borderRadius: '0 8px 8px 0', marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px' }}>Message de motivation</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#3D2214', lineHeight: 1.7 }}>{showFiche.message}</p>
                                </div>
                            )}

                            {/* Changer statut */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px' }}>Changer le statut</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {STATUS_OPTS.map(o => (
                                        <button key={o.value} onClick={() => changeStatus(showFiche._id, o.value)}
                                            style={{ flex: 1, padding: '8px 4px', border: showFiche.status === o.value ? `2px solid ${o.color}` : '2px solid #E5E7EB', borderRadius: '8px', background: showFiche.status === o.value ? o.bg : '#fff', color: showFiche.status === o.value ? o.color : '#6B7280', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Envoyer la fiche par email */}
                            <div style={{ borderTop: '1px solid #F0E8D8', paddingTop: '20px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px' }}>Envoyer la fiche par email</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input value={ficheEmail} onChange={e => setFicheEmail(e.target.value)}
                                        placeholder={showFiche.email}
                                        style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#1E110A', outline: 'none', background: '#fff' }} />
                                    <button onClick={() => sendFiche(showFiche)} disabled={sendingFiche}
                                        style={{ ...btnGold, opacity: sendingFiche ? 0.7 : 1, cursor: sendingFiche ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', padding: '9px 16px' }}>
                                        {sendingFiche ? 'Envoi…' : '✉ Envoyer'}
                                    </button>
                                </div>
                                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#9CA3AF' }}>Laissez vide pour envoyer à {showFiche.email}</p>
                            </div>

                            {/* Actions bas */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                                <button onClick={() => { setShowFiche(null); openEdit(showFiche); }}
                                    style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff', color: '#374151', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                                    ✏ Modifier
                                </button>
                                <button onClick={() => del(showFiche._id)}
                                    style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#FEF2F2', color: '#DC2626', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalOverlay>
            )}

            {/* ══════════════════════════════════════════════════════════
                MODALE — CRÉER / MODIFIER
            ══════════════════════════════════════════════════════════ */}
            {(showCreate || showEdit) && (
                <ModalOverlay onClose={() => { setShowCreate(false); setShowEdit(null); }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1E110A', margin: 0 }}>
                                {showEdit ? 'Modifier l\'inscription' : 'Inscription manuelle'}
                            </h2>
                            <button onClick={() => { setShowCreate(false); setShowEdit(null); }} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9E8272', lineHeight: 1 }}>×</button>
                        </div>
                        <form onSubmit={showEdit ? handleEdit : handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {!showEdit && (
                                <div>
                                    <label style={lblS}>Programme *</label>
                                    <select value={form.programme} onChange={e => setForm(f => ({ ...f, programme: e.target.value }))} style={inpS} required>
                                        <option value="">-- Choisir --</option>
                                        {programmes.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label style={lblS}>Nom complet *</label>
                                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Aminata Koné" style={inpS} required />
                            </div>
                            <div>
                                <label style={lblS}>Email *</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="exemple@email.com" style={inpS} required />
                            </div>
                            <div>
                                <label style={lblS}>Téléphone</label>
                                <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="+225 07 00 00 00 00" style={inpS} />
                            </div>
                            <div>
                                <label style={lblS}>Statut</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inpS}>
                                    {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lblS}>Message / Note</label>
                                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} style={{ ...inpS, resize: 'vertical' }} />
                            </div>
                            {formErr && <p style={{ fontSize: '12px', color: '#DC2626', background: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', margin: 0 }}>{formErr}</p>}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                <button type="button" onClick={() => { setShowCreate(false); setShowEdit(null); }} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff', color: '#6B7280', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={saving} style={{ ...btnGold, flex: 1, padding: '10px', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
                                    {saving ? 'Enregistrement…' : (showEdit ? 'Enregistrer' : 'Inscrire')}
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
}

function ModalOverlay({ children, onClose }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}
             onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            {children}
        </div>
    );
}

const btnGold    = { background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };
const btnAction  = (bg, color) => ({ fontSize: '11px', background: bg, color, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontWeight: 600 });
const selStyle   = { border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#1E110A', background: '#fff', outline: 'none' };
const lblS       = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inpS       = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#1E110A', outline: 'none', background: '#fff', boxSizing: 'border-box' };
