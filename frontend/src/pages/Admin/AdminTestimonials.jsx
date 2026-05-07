import { useEffect, useState } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';
const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

const Stars = ({ n }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
            <svg key={i} className={`w-3.5 h-3.5 ${i <= n ? 'fill-[#C9A84C] text-[#C9A84C]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
        ))}
    </div>
);

function EditModal({ item, onSave, onClose }) {
    const [form, setForm] = useState({ ...item });
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/api/admin/testimonials/${item._id}`, form);
            onSave();
        } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-7" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-[#111827]">Modifier le témoignage</h3>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Nom</label>
                            <input className={inp} value={form.name || ''} onChange={e => set('name', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Rôle</label>
                            <input className={inp} value={form.role || ''} onChange={e => set('role', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Entreprise</label>
                        <input className={inp} value={form.company || ''} onChange={e => set('company', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Témoignage</label>
                        <textarea className={inp + " resize-none"} rows={4} value={form.content || ''} onChange={e => set('content', e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Note (1-5)</label>
                            <input type="number" min="1" max="5" className={inp} value={form.rating || 5} onChange={e => set('rating', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Ordre</label>
                            <input type="number" className={inp} value={form.order || 0} onChange={e => set('order', e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-[#F3F4F6]">
                        <button type="submit" disabled={loading}
                            className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                            {loading ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="border border-[#E5E7EB] text-[#374151] text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminTestimonials() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [editing, setEditing] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const load = () => axios.get('/api/admin/testimonials').then(r => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const toggle = async (item) => {
        try {
            await axios.put(`/api/admin/testimonials/${item._id}`, { is_active: !item.is_active });
            load();
        } catch { alert('Erreur'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce témoignage ?')) return;
        await axios.delete(`/api/admin/testimonials/${id}`).catch(() => {});
        load();
    };

    const filtered = items.filter(t =>
        filter === 'all' ? true :
        filter === 'pending' ? !t.is_active :
        t.is_active
    );

    const pendingCount = items.filter(t => !t.is_active).length;

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Gestion</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Témoignages</h1>
                </div>
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 bg-[#FDF8EC] border border-[#C9A84C]/30 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                        <span className="text-sm font-semibold text-[#C9A84C]">{pendingCount} en attente</span>
                    </div>
                )}
            </div>

            {/* Filtres */}
            <div className="flex gap-1 mb-6 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {[
                    { key: 'all',       label: 'Tous',        count: items.length },
                    { key: 'pending',   label: 'En attente',  count: pendingCount },
                    { key: 'published', label: 'Publiés',     count: items.length - pendingCount },
                ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                            filter === f.key ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'
                        }`}>
                        {f.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === f.key ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-white text-[#6B7280]'}`}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Liste */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm py-16 text-center">
                        <p className="text-sm text-[#6B7280]">Aucun témoignage</p>
                    </div>
                ) : filtered.map(t => (
                    <div key={t._id} className={`bg-white rounded-xl border shadow-sm transition-all ${
                        t.is_active ? 'border-[#E5E7EB]' : 'border-[#C9A84C]/30'
                    }`}>
                        <div className="flex items-start gap-4 p-5">
                            {/* Avatar */}
                            <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-[#E5E7EB] overflow-hidden bg-[#F9FAFB]">
                                {t.photo
                                    ? <img src={`/uploads/${t.photo}`} className="w-full h-full object-cover" alt="" />
                                    : <span className="text-sm font-bold text-[#C9A84C]">{t.name?.[0]?.toUpperCase()}</span>
                                }
                            </div>

                            {/* Infos */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                    <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                                    {(t.role || t.company) && (
                                        <p className="text-xs text-[#9CA3AF]">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                                    )}
                                    <Stars n={t.rating || 5} />
                                    <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        t.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-[#FDF8EC] text-[#C9A84C]'
                                    }`}>
                                        {t.is_active ? 'Publié' : 'En attente'}
                                    </span>
                                </div>

                                <p className="text-sm text-[#6B7280] leading-relaxed">
                                    {expanded === t._id ? t.content : (t.content?.length > 120 ? t.content.slice(0, 120) + '…' : t.content)}
                                </p>
                                {t.content?.length > 120 && (
                                    <button onClick={() => setExpanded(expanded === t._id ? null : t._id)}
                                        className="text-xs font-semibold text-[#C9A84C] hover:text-[#B8973B] mt-1.5">
                                        {expanded === t._id ? 'Réduire ↑' : 'Lire tout ↓'}
                                    </button>
                                )}

                                {t.createdAt && (
                                    <p className="text-xs text-[#9CA3AF] mt-2">
                                        Reçu le {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-[#F3F4F6] px-5 py-3 flex items-center justify-between gap-3 bg-[#FAFAFA] rounded-b-xl">
                            <button onClick={() => toggle(t)}
                                className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                                    t.is_active
                                        ? 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                                        : 'border-[#C9A84C]/40 text-[#C9A84C] bg-[#FDF8EC] hover:bg-[#C9A84C] hover:text-white'
                                }`}>
                                {t.is_active ? 'Dépublier' : '✓ Publier'}
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(t)}
                                    className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                    Modifier
                                </button>
                                <button onClick={() => handleDelete(t._id)}
                                    className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <EditModal
                    item={editing}
                    onSave={() => { load(); setEditing(null); }}
                    onClose={() => setEditing(null)}
                />
            )}
        </div>
    );
}
