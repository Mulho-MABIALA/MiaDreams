import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/ConfirmDialog';

const GOLD = '#C9A84C';

const STATUS_COLORS = {
    'en attente': { bg: '#FEF3C7', color: '#92400E' },
    'acceptée':   { bg: '#DCFCE7', color: '#15803D' },
    'refusée':    { bg: '#FEF2F2', color: '#DC2626' },
};

const EMPTY_FORM = { programme: '', nom: '', email: '', telephone: '', message: '', status: 'en attente' };

export default function AdminInscriptions() {
    const toast   = useToast();
    const confirm = useConfirm();
    const [inscriptions, setInscriptions] = useState([]);
    const [programmes, setProgrammes]     = useState([]);
    const [filter, setFilter]             = useState('');
    const [loading, setLoading]           = useState(true);
    const [showModal, setShowModal]       = useState(false);
    const [form, setForm]                 = useState(EMPTY_FORM);
    const [saving, setSaving]             = useState(false);
    const [formError, setFormError]       = useState('');

    const load = (programmeId = '') => {
        setLoading(true);
        const params = programmeId ? { programme: programmeId } : {};
        axios.get('/api/admin/inscriptions', { params })
            .then(r => setInscriptions(r.data.inscriptions || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        axios.get('/api/admin/programmes').then(r => setProgrammes(r.data.programmes || []));
        load();
    }, []);

    const changeStatus = async (id, status) => {
        await axios.put(`/api/admin/inscriptions/${id}`, { status });
        setInscriptions(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        toast('Statut mis à jour.', 'success');
    };

    const del = async (id) => {
        const ok = await confirm({
            title: 'Supprimer cette inscription ?',
            message: 'Cette inscription sera définitivement supprimée.',
            confirmLabel: 'Supprimer',
            danger: true,
        });
        if (!ok) return;
        await axios.delete(`/api/admin/inscriptions/${id}`);
        setInscriptions(prev => prev.filter(i => i._id !== id));
        toast('Inscription supprimée.', 'success');
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        load(e.target.value);
    };

    const openModal = () => {
        setForm({ ...EMPTY_FORM, programme: filter || '' });
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.programme || !form.nom || !form.email) {
            setFormError('Programme, nom et email sont requis.');
            return;
        }
        setSaving(true);
        setFormError('');
        try {
            const { data } = await axios.post('/api/admin/inscriptions', form);
            setInscriptions(prev => [data.inscription, ...prev]);
            setShowModal(false);
            toast('Inscription ajoutée avec succès !', 'success');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
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
                    <select value={filter} onChange={handleFilterChange} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#1E110A', background: '#fff', outline: 'none' }}>
                        <option value="">Tous les programmes</option>
                        {programmes.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <button onClick={openModal} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        + Inscrire manuellement
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[['En attente', counts['en attente'], '#FEF3C7', '#92400E'], ['Acceptées', counts['acceptée'], '#DCFCE7', '#15803D'], ['Refusées', counts['refusée'], '#FEF2F2', '#DC2626']].map(([label, n, bg, color]) => (
                    <div key={label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px', borderLeft: `4px solid ${color}` }}>
                        <p style={{ fontSize: '24px', fontWeight: 700, color: '#1E110A' }}>{n}</p>
                        <p style={{ fontSize: '11px', color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Table ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9E8272' }}>Chargement…</div>
            ) : inscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#B8A090', fontSize: '14px' }}>Aucune inscription.</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                {['Nom', 'Email', 'Téléphone', 'Programme', 'Date', 'Statut', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9E8272', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inscriptions.map((insc, i) => (
                                <tr key={insc._id} style={{ borderBottom: i < inscriptions.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1E110A' }}>{insc.nom}</td>
                                    <td style={{ padding: '12px 16px', color: '#6B7280' }}>{insc.email}</td>
                                    <td style={{ padding: '12px 16px', color: '#6B7280' }}>{insc.telephone || '—'}</td>
                                    <td style={{ padding: '12px 16px', color: '#6B7280' }}>{insc.programme?.name || '—'}</td>
                                    <td style={{ padding: '12px 16px', color: '#9E8272', whiteSpace: 'nowrap' }}>
                                        {new Date(insc.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <select
                                            value={insc.status}
                                            onChange={e => changeStatus(insc._id, e.target.value)}
                                            style={{ fontSize: '11px', border: 'none', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer', fontWeight: 600, ...(STATUS_COLORS[insc.status] || {}) }}
                                        >
                                            <option value="en attente">En attente</option>
                                            <option value="acceptée">Acceptée</option>
                                            <option value="refusée">Refusée</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button onClick={() => del(insc._id)} style={{ fontSize: '11px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Messages de motivation ── */}
            {inscriptions.some(i => i.message) && (
                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1E110A', marginBottom: '12px' }}>Messages de motivation</h3>
                    {inscriptions.filter(i => i.message).map(insc => (
                        <div key={insc._id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '16px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <strong style={{ fontSize: '13px', color: '#1E110A' }}>{insc.nom}</strong>
                                <span style={{ fontSize: '11px', color: '#9E8272' }}>{insc.programme?.name}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{insc.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Modal inscription manuelle ── */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                     onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1E110A' }}>Inscription manuelle</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9E8272', lineHeight: 1 }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Programme */}
                            <div>
                                <label style={labelStyle}>Programme *</label>
                                <select value={form.programme} onChange={e => setForm(f => ({ ...f, programme: e.target.value }))} style={inputStyle} required>
                                    <option value="">-- Choisir un programme --</option>
                                    {programmes.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>

                            {/* Nom */}
                            <div>
                                <label style={labelStyle}>Nom complet *</label>
                                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex: Aminata Koné" style={inputStyle} required />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={labelStyle}>Email *</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="exemple@email.com" style={inputStyle} required />
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label style={labelStyle}>Téléphone</label>
                                <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="+225 07 00 00 00 00" style={inputStyle} />
                            </div>

                            {/* Statut */}
                            <div>
                                <label style={labelStyle}>Statut</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                                    <option value="en attente">En attente</option>
                                    <option value="acceptée">Acceptée</option>
                                    <option value="refusée">Refusée</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label style={labelStyle}>Message / Note (optionnel)</label>
                                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Note interne ou message du participant…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>

                            {formError && (
                                <p style={{ fontSize: '12px', color: '#DC2626', background: '#FEF2F2', padding: '8px 12px', borderRadius: '6px' }}>{formError}</p>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff', color: '#6B7280', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: GOLD, color: '#fff', fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Enregistrement…' : 'Inscrire'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle  = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#1E110A', outline: 'none', background: '#fff', boxSizing: 'border-box' };
