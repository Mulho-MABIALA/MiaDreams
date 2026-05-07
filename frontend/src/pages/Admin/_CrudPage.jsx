import { useEffect, useState } from 'react';
import axios from 'axios';

const inputCls = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

export default function CrudPage({ title, apiPath, fields, imageFields = [], hideHeader = false }) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({});
    const [files, setFiles] = useState({});
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = () => axios.get(`/api/admin/${apiPath}`).then(r => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, [apiPath]);

    const openNew = () => { setEditing(null); setForm({}); setFiles({}); setShowForm(true); };
    const openEdit = (item) => { setEditing(item._id); setForm({ ...item }); setFiles({}); setShowForm(true); };
    const cancel = () => { setShowForm(false); setEditing(null); setForm({}); setFiles({}); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v !== undefined && v !== null && !imageFields.includes(k) && k !== '_id' && k !== '__v') fd.append(k, v);
            });
            Object.entries(files).forEach(([k, v]) => fd.append(k, v));
            const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (editing) await axios.put(`/api/admin/${apiPath}/${editing}`, fd, cfg);
            else await axios.post(`/api/admin/${apiPath}`, fd, cfg);
            await load(); cancel();
        } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet élément ?')) return;
        await axios.delete(`/api/admin/${apiPath}/${id}`).catch(() => {});
        load();
    };

    const firstTextField = fields.find(f => f.type !== 'file');

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                {!hideHeader && (
                    <div>
                        <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Gestion</p>
                        <h1 className="text-2xl font-semibold text-[#111827]">{title}</h1>
                    </div>
                )}
                {hideHeader && <div />}
                <button onClick={openNew}
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Ajouter
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-widest">
                            {editing ? 'Modifier' : 'Nouvel élément'}
                        </span>
                        <div className="flex-1 h-px bg-[#F3F4F6]" />
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map(f => (
                            <div key={f.name} className={f.type === 'textarea' || f.type === 'url' ? 'sm:col-span-2' : ''}>
                                <label className="block text-xs font-medium text-[#374151] mb-1.5">{f.label}</label>
                                {f.type === 'textarea' ? (
                                    <textarea rows={4} value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} className={inputCls + " resize-none"} />
                                ) : f.type === 'file' ? (
                                    <div>
                                        <input type="file" accept="image/*,.pdf" onChange={e => setFiles(p => ({ ...p, [f.name]: e.target.files[0] }))}
                                            className="w-full text-sm text-[#374151] file:mr-3 file:border-0 file:bg-[#FDF8EC] file:text-[#C9A84C] file:text-xs file:font-medium file:px-3 file:py-2 file:rounded-lg cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white" />
                                        {files[f.name] ? (
                                            <img src={URL.createObjectURL(files[f.name])} className="mt-2 h-20 w-auto object-cover rounded-lg border border-[#E5E7EB]" alt="aperçu" />
                                        ) : form[f.name] ? (
                                            <div className="flex items-center gap-3 mt-2">
                                                <img src={`/uploads/${form[f.name]}`} className="h-14 w-auto object-cover rounded-lg border border-[#E5E7EB]" alt="actuel" />
                                                <p className="text-xs text-[#9CA3AF]">{form[f.name]}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : f.type === 'select' ? (
                                    <select value={form[f.name] || ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} className={inputCls}>
                                        <option value="">— Choisir —</option>
                                        {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                ) : f.type === 'checkbox' ? (
                                    <label className="flex items-center gap-3 cursor-pointer pt-1">
                                        <input type="checkbox"
                                            checked={!!form[f.name]}
                                            onChange={e => setForm(p => ({ ...p, [f.name]: e.target.checked }))}
                                            className="accent-[#C9A84C] w-4 h-4 rounded" />
                                        <span className="text-sm text-[#374151]">{f.checkboxLabel || f.label}</span>
                                    </label>
                                ) : (
                                    <input type={f.type || 'text'} value={form[f.name] ?? ''} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} className={inputCls} />
                                )}
                            </div>
                        ))}
                        <div className="sm:col-span-2 flex gap-3 pt-2 border-t border-[#F3F4F6]">
                            <button type="submit" disabled={loading}
                                className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                                {loading ? 'Enregistrement…' : 'Enregistrer'}
                            </button>
                            <button type="button" onClick={cancel}
                                className="border border-[#E5E7EB] text-[#374151] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* LIST */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {items.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">Aucun élément</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Cliquez sur "Ajouter" pour commencer</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                {imageFields.length > 0 && <th className="w-16 px-4 py-3 bg-[#F9FAFB]" />}
                                <th className="text-left px-4 py-3 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Élément</th>
                                <th className="text-right px-4 py-3 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                            {items.map((item) => (
                                <tr key={item._id} className="hover:bg-[#F9FAFB] transition-colors">
                                    {imageFields.length > 0 && (
                                        <td className="px-4 py-3.5">
                                            {item[imageFields[0]]
                                                ? <img src={`/uploads/${item[imageFields[0]]}`} className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB]" alt="" />
                                                : <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]" />}
                                        </td>
                                    )}
                                    <td className="px-4 py-3.5">
                                        <p className="text-sm font-medium text-[#111827]">{item[firstTextField?.name] || item.name || item.title || '—'}</p>
                                        {item.slug && <p className="text-xs text-[#9CA3AF] mt-0.5">/{item.slug}</p>}
                                        {item.category && (
                                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#FDF8EC] text-[#C9A84C] font-medium">
                                                {item.category}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(item)}
                                                className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                                Modifier
                                            </button>
                                            <button onClick={() => handleDelete(item._id)}
                                                className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
