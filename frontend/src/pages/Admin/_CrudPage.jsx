import { useEffect, useState } from 'react';
import axios from 'axios';

const inputCls = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

// Génère un slug depuis un texte (même logique que le backend)
const toSlug = (str) =>
    str.toLowerCase()
       .normalize('NFD').replace(/[̀-ͯ]/g, '') // enlève les accents
       .replace(/[^a-z0-9\s-]/g, '')
       .trim()
       .replace(/\s+/g, '-')
       .replace(/-+/g, '-');

// Gère les URLs Cloudinary (https://...) ET les anciens noms de fichiers locaux
const imgSrc = (val) => {
    if (!val) return '';
    if (val.startsWith('http') || val.startsWith('/')) return val;
    return `/uploads/${val}`;
};

/* ── Champ fichier (image ou PDF) ───────────────────────────────────────────── */
function FileField({ f, isPdf, selectedFile, existingVal, setFiles }) {
    return (
        <div>
            <input type="file"
                accept={f.accept || 'image/*,.pdf'}
                onChange={e => setFiles(p => ({ ...p, [f.name]: e.target.files[0] }))}
                className="w-full text-sm text-[#374151] file:mr-3 file:border-0 file:bg-[#FDF8EC] file:text-[#C9A84C] file:text-xs file:font-medium file:px-3 file:py-2 file:rounded-lg cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white" />

            {/* Aperçu du nouveau fichier sélectionné */}
            {selectedFile && (
                isPdf ? (
                    <div className="mt-2 flex items-center gap-3 p-3 bg-[#FDF8EC] border border-[#C9A84C]/25 rounded-lg">
                        <svg className="w-8 h-8 text-[#C9A84C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-[#374151] truncate">{selectedFile.name}</p>
                            <p className="text-xs text-[#9CA3AF]">{(selectedFile.size / 1024).toFixed(0)} Ko — Prêt à enregistrer</p>
                        </div>
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                ) : (
                    <img src={URL.createObjectURL(selectedFile)} className="mt-2 h-20 w-auto object-cover rounded-lg border border-[#E5E7EB]" alt="aperçu" />
                )
            )}

            {/* Valeur existante déjà enregistrée */}
            {!selectedFile && existingVal && (
                isPdf ? (
                    <div className="flex items-center gap-3 mt-2 p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                        <svg className="w-6 h-6 text-[#C9A84C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#374151]">PDF enregistré</p>
                            <p className="text-xs text-[#9CA3AF] truncate">{existingVal.startsWith('http') ? 'Cloudinary ✓' : existingVal}</p>
                        </div>
                        <a href={existingVal} target="_blank" rel="noreferrer"
                            className="text-xs font-medium text-[#C9A84C] hover:text-[#B8973B] border border-[#C9A84C]/30 px-2.5 py-1 rounded-md flex-shrink-0">
                            Ouvrir
                        </a>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 mt-2">
                        <img src={imgSrc(existingVal)} className="h-14 w-auto object-cover rounded-lg border border-[#E5E7EB]" alt="actuel" />
                        <p className="text-xs text-[#9CA3AF] truncate max-w-[180px]">{existingVal.startsWith('http') ? 'Cloudinary ✓' : existingVal}</p>
                    </div>
                )
            )}
        </div>
    );
}

export default function CrudPage({ title, apiPath, fields, imageFields = [], pdfFields = [], hideHeader = false }) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({});
    const [files, setFiles] = useState({});
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewing, setViewing] = useState(null);

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
                // Exclure les champs image ET pdf (envoyés uniquement via files si nouveau fichier sélectionné)
                if (v !== undefined && v !== null && !imageFields.includes(k) && !pdfFields.includes(k) && k !== '_id' && k !== '__v') fd.append(k, v);
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
                                    <FileField
                                        f={f}
                                        isPdf={f.isPdf || pdfFields.includes(f.name)}
                                        selectedFile={files[f.name]}
                                        existingVal={form[f.name]}
                                        setFiles={setFiles}
                                    />
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
                                    <>
                                        <input
                                            type={f.type || 'text'}
                                            value={form[f.name] ?? ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                const hasSlugField = fields.some(x => x.name === 'slug');
                                                if (f.name === 'name' && hasSlugField && !editing) {
                                                    // Auto-génère le slug depuis le nom (seulement en création)
                                                    setForm(p => ({ ...p, name: val, slug: toSlug(val) }));
                                                } else {
                                                    setForm(p => ({ ...p, [f.name]: val }));
                                                }
                                            }}
                                            className={inputCls}
                                            readOnly={f.name === 'slug' && !editing}
                                            style={f.name === 'slug' && !editing ? { background: '#F9FAFB', color: '#9CA3AF', cursor: 'default' } : {}}
                                        />
                                        {f.name === 'slug' && !editing && form.slug && (
                                            <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                                                Page accessible sur&nbsp;<strong>/marque/{form.slug}</strong>
                                            </p>
                                        )}
                                    </>
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
                    <>
                        {/* ── Tableau desktop (≥ sm) ── */}
                        <table className="w-full hidden sm:table">
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
                                                    ? <img src={imgSrc(item[imageFields[0]])} className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB]" alt="" />
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
                                                <button onClick={() => setViewing(item)}
                                                    className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                                                    style={{ background: '#C9A84C' }}>
                                                    Voir
                                                </button>
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

                        {/* ── Cartes mobile (< sm) ── */}
                        <div className="sm:hidden divide-y divide-[#F3F4F6]">
                            {items.map((item) => (
                                <div key={item._id} className="flex items-center gap-3 p-4">
                                    {imageFields.length > 0 && (
                                        item[imageFields[0]]
                                            ? <img src={imgSrc(item[imageFields[0]])} className="w-14 h-14 object-cover rounded-xl border border-[#E5E7EB] flex-shrink-0" alt="" />
                                            : <div className="w-14 h-14 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#111827] truncate">
                                            {item[firstTextField?.name] || item.name || item.title || '—'}
                                        </p>
                                        {item.slug && <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">/{item.slug}</p>}
                                        {item.category && (
                                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#FDF8EC] text-[#C9A84C] font-medium">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                                        <button onClick={() => setViewing(item)}
                                            className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                                            style={{ background: '#C9A84C' }}>
                                            Voir
                                        </button>
                                        <button onClick={() => openEdit(item)}
                                            className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                            Modifier
                                        </button>
                                        <button onClick={() => handleDelete(item._id)}
                                            className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Modal Détail ── */}
            {viewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setViewing(null)}>
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-[#E5E7EB]"
                         onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                            <div>
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Détail</p>
                                <p className="text-base font-semibold text-[#111827]">
                                    {viewing[firstTextField?.name] || viewing.name || viewing.title || '—'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setViewing(null); openEdit(viewing); }}
                                    className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                    Modifier
                                </button>
                                <button onClick={() => setViewing(null)}
                                    className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                        </div>
                        {/* Corps */}
                        <div className="p-6 space-y-4">
                            {/* Image principale si présente */}
                            {imageFields.length > 0 && viewing[imageFields[0]] && (
                                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden bg-[#F9FAFB]">
                                    <img src={imgSrc(viewing[imageFields[0]])} className="w-full max-h-72 object-contain" alt="" />
                                </div>
                            )}
                            {/* Champs texte */}
                            {fields.filter(f => f.type !== 'file').map(f => {
                                const val = viewing[f.name];
                                if (val === undefined || val === null || val === '') return null;
                                return (
                                    <div key={f.name} className="flex flex-col gap-1 py-2 border-b border-[#F3F4F6] last:border-0">
                                        <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">{f.label}</span>
                                        <span className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">
                                            {f.type === 'checkbox'
                                                ? (val ? '✓ Oui' : '✗ Non')
                                                : f.type === 'select'
                                                    ? (f.options?.find(o => o.value === val)?.label || val)
                                                    : String(val)}
                                        </span>
                                    </div>
                                );
                            })}
                            {/* Autres images si plusieurs */}
                            {imageFields.slice(1).map(imgF => viewing[imgF] ? (
                                <div key={imgF} className="flex flex-col gap-1 py-2 border-b border-[#F3F4F6] last:border-0">
                                    <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">{imgF}</span>
                                    <img src={imgSrc(viewing[imgF])} className="h-20 w-auto object-contain rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]" alt="" />
                                </div>
                            ) : null)}
                            {/* Fichiers PDF */}
                            {pdfFields.map(pdfF => {
                                const pdfVal = viewing[pdfF];
                                if (!pdfVal) return null;
                                const field = fields.find(f => f.name === pdfF);
                                const pdfUrl = pdfVal.startsWith('http') || pdfVal.startsWith('/') ? pdfVal : `/uploads/${pdfVal}`;
                                return (
                                    <div key={pdfF} className="py-2 border-b border-[#F3F4F6] last:border-0">
                                        <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider block mb-3">
                                            {field?.label || 'PDF'}
                                        </span>
                                        <div className="flex items-center gap-3 p-3 bg-[#FDF8EC] border border-[#C9A84C]/20 rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                                                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-[#374151]">Fichier PDF disponible</p>
                                                <p className="text-xs text-[#9CA3AF] truncate">{pdfVal.startsWith('http') ? 'Cloudinary ✓' : pdfVal}</p>
                                            </div>
                                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                                               className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#C9A84C] hover:bg-[#B8973B] px-3 py-2 rounded-lg transition-colors flex-shrink-0">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                                    <polyline points="15 3 21 3 21 9"/>
                                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                                </svg>
                                                Ouvrir
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
