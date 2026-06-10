import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/ConfirmDialog';

const GOLD = '#C9A84C';
const API = '/api/admin/programmes';

const empty = {
    name: '', description: '', duration: '', price: '',
    format: 'présentiel', level: 'tous niveaux',
    start_date: '', end_date: '', max_places: 0, is_open: true, is_active: true, order: 0,
    youtube_id: '', modules: [],
};

export default function AdminProgrammes() {
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast   = useToast();
    const confirm = useConfirm();
    const [modal, setModal] = useState(null); // null | 'create' | programme object
    const [form, setForm] = useState(empty);
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const load = () => {
        setLoading(true);
        axios.get(API).then(r => setProgrammes(r.data.programmes || [])).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setForm(empty);
        setImageFile(null);
        setError('');
        setModal('create');
    };

    const openEdit = (p) => {
        setForm({
            name: p.name || '', description: p.description || '',
            duration: p.duration || '', price: p.price || '',
            format: p.format || 'présentiel', level: p.level || 'tous niveaux',
            start_date: p.start_date || '', end_date: p.end_date || '', max_places: p.max_places || 0,
            is_open: p.is_open !== false, is_active: p.is_active !== false,
            order: p.order || 0, youtube_id: p.youtube_id || '',
            modules: p.modules || [],
        });
        setImageFile(null);
        setError('');
        setModal(p);
    };

    const save = async () => {
        if (!form.name.trim()) { setError('Le nom est requis.'); return; }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'modules') fd.append(k, JSON.stringify(v));
                else fd.append(k, v);
            });
            if (imageFile) fd.append('image', imageFile);
            if (modal === 'create') {
                await axios.post(API, fd);
            } else {
                await axios.put(`${API}/${modal._id}`, fd);
            }
            load();
            setModal(null);
            toast(modal === 'create' ? 'Programme créé avec succès !' : 'Programme mis à jour !', 'success');
        } catch (e) {
            setError(e.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const del = async (id) => {
        const ok = await confirm({
            title: 'Supprimer ce programme ?',
            message: 'Cette action supprimera le programme et toutes ses inscriptions. Elle est irréversible.',
            confirmLabel: 'Supprimer',
            danger: true,
        });
        if (!ok) return;
        try {
            await axios.delete(`${API}/${id}`);
            load();
            toast('Programme supprimé.', 'success');
        } catch {
            toast('Erreur lors de la suppression.', 'error');
        }
    };

    const addModule = () => setForm(f => ({ ...f, modules: [...f.modules, { title: '', description: '' }] }));
    const updateModule = (i, key, val) => setForm(f => {
        const mods = [...f.modules];
        mods[i] = { ...mods[i], [key]: val };
        return { ...f, modules: mods };
    });
    const removeModule = (i) => setForm(f => ({ ...f, modules: f.modules.filter((_, idx) => idx !== i) }));

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1E110A' }}>Programmes de formation</h1>
                    <p style={{ fontSize: '13px', color: '#9E8272', marginTop: '2px' }}>{programmes.length} programme{programmes.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={openCreate} style={{ background: GOLD, color: '#1E110A', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px' }}>
                    + Nouveau programme
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9E8272' }}>Chargement…</div>
            ) : programmes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#B8A090', fontSize: '14px' }}>
                    Aucun programme. Créez le premier !
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                    {programmes.map(p => (
                        <div key={p._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {p.image && (
                                <img src={p.image} alt={p.name} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E110A' }}>{p.name}</span>
                                    <span style={{ fontSize: '10px', background: p.is_open ? '#DCFCE7' : '#F3F4F6', color: p.is_open ? '#15803D' : '#6B7280', borderRadius: '4px', padding: '2px 8px' }}>
                                        {p.is_open ? 'Inscriptions ouvertes' : 'Fermé'}
                                    </span>
                                    {!p.is_active && <span style={{ fontSize: '10px', background: '#FEF2F2', color: '#DC2626', borderRadius: '4px', padding: '2px 8px' }}>Inactif</span>}
                                </div>
                                <div style={{ fontSize: '12px', color: '#9E8272', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    {p.duration && <span>⏱ {p.duration}</span>}
                                    {p.price    && <span>💰 {p.price}</span>}
                                    {p.format   && <span>📍 {p.format}</span>}
                                    {p.max_places > 0 && <span>👥 {p.max_places} places max</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <a href={`/programmes/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: GOLD, textDecoration: 'none', padding: '6px 12px', border: `1px solid ${GOLD}30`, borderRadius: '6px' }}>Voir</a>
                                <button onClick={() => openEdit(p)} style={{ fontSize: '12px', background: '#F5EDE0', color: '#6B4F3A', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>Modifier</button>
                                <button onClick={() => del(p._id)} style={{ fontSize: '12px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', padding: '32px', marginTop: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1E110A' }}>
                                {modal === 'create' ? 'Nouveau programme' : `Modifier — ${modal.name}`}
                            </h2>
                            <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9E8272' }}>✕</button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <Field label="Nom *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                            <Field label="Description" type="textarea" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Field label="Durée" placeholder="ex: 6 semaines" value={form.duration} onChange={v => setForm(f => ({ ...f, duration: v }))} />
                                <Field label="Prix" placeholder="ex: 150 000 FCFA" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} />
                                <div>
                                    <label style={labelStyle}>Format</label>
                                    <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} style={inputStyle}>
                                        {['présentiel','en ligne','hybride'].map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Niveau</label>
                                    <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} style={inputStyle}>
                                        {['débutant','intermédiaire','avancé','tous niveaux'].map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                                <Field label="Date de début" placeholder="ex: 15 janvier 2025" value={form.start_date} onChange={v => setForm(f => ({ ...f, start_date: v }))} />
                                <Field label="Date de fin" placeholder="ex: 28 mars 2025" value={form.end_date} onChange={v => setForm(f => ({ ...f, end_date: v }))} />
                                <Field label="Places max (0 = illimité)" type="number" value={form.max_places} onChange={v => setForm(f => ({ ...f, max_places: Number(v) }))} />
                                <Field label="Ordre" type="number" value={form.order} onChange={v => setForm(f => ({ ...f, order: Number(v) }))} />
                                <Field label="YouTube ID / URL" value={form.youtube_id} onChange={v => setForm(f => ({ ...f, youtube_id: v }))} />
                            </div>

                            <div style={{ display: 'flex', gap: '24px' }}>
                                <Toggle label="Inscriptions ouvertes" checked={form.is_open} onChange={v => setForm(f => ({ ...f, is_open: v }))} />
                                <Toggle label="Programme actif" checked={form.is_active} onChange={v => setForm(f => ({ ...f, is_active: v }))} />
                            </div>

                            {/* Image */}
                            <div>
                                <label style={labelStyle}>Image</label>
                                <input type="file" accept="image/*" ref={fileRef} onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '13px', color: '#6B4F3A' }} />
                                {modal !== 'create' && modal.image && !imageFile && (
                                    <img src={modal.image} alt="" style={{ marginTop: '8px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                                )}
                            </div>

                            {/* Modules */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={labelStyle}>Modules du programme</label>
                                    <button onClick={addModule} style={{ fontSize: '12px', background: '#F5EDE0', color: '#6B4F3A', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>+ Ajouter</button>
                                </div>
                                {form.modules.map((m, i) => (
                                    <div key={i} style={{ background: '#F9F5F0', borderRadius: '8px', padding: '12px', marginBottom: '8px', display: 'grid', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                placeholder={`Module ${i + 1} — titre`}
                                                value={m.title}
                                                onChange={e => updateModule(i, 'title', e.target.value)}
                                                style={{ ...inputStyle, flex: 1 }}
                                            />
                                            <button onClick={() => removeModule(i)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                                        </div>
                                        <textarea
                                            placeholder="Description du module (optionnel)"
                                            value={m.description}
                                            onChange={e => updateModule(i, 'description', e.target.value)}
                                            rows={2}
                                            style={{ ...inputStyle, resize: 'vertical' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setModal(null)} style={{ padding: '9px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#6B7280' }}>Annuler</button>
                            <button onClick={save} disabled={saving} style={{ padding: '9px 24px', borderRadius: '8px', background: GOLD, border: 'none', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', color: '#1E110A', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Enregistrement…' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#9E8272', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' };
const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#1E110A', background: '#FAFAFA', outline: 'none', boxSizing: 'border-box' };

function Field({ label, value, onChange, type = 'text', placeholder }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            {type === 'textarea'
                ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
            }
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#1E110A' }}>
            <div onClick={() => onChange(!checked)} style={{ width: '40px', height: '22px', borderRadius: '11px', background: checked ? GOLD : '#E5E7EB', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: checked ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
            {label}
        </label>
    );
}
