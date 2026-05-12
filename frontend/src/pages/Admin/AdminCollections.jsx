import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';

// Gère URLs Cloudinary (https://...) ET anciens noms de fichiers locaux
const imgSrc = (val) => {
    if (!val) return '';
    if (val.startsWith('http') || val.startsWith('/')) return val;
    return `/uploads/${val}`;
};

function Spinner() {
    return (
        <svg className="animate-spin w-4 h-4 text-[#C9A84C]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
        </svg>
    );
}

const inputCls = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

function CollectionForm({ collection, brands, onSave, onCancel }) {
    const [form, setForm] = useState({
        name: '', description: '', brand: '', order: 0, is_active: true,
        ...(collection ? {
            name: collection.name || '',
            description: collection.description || '',
            brand: collection.brand?._id || collection.brand || '',
            order: collection.order ?? 0,
            is_active: collection.is_active ?? true,
        } : {}),
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        collection?.image ? imgSrc(collection.image) : null
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.brand) { setError('Veuillez sélectionner une marque'); return; }
        if (!form.name.trim()) { setError('Le nom est requis'); return; }
        setSaving(true); setError('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('description', form.description);
            fd.append('brand', form.brand);
            fd.append('order', form.order);
            fd.append('is_active', form.is_active ? 'true' : 'false');
            if (imageFile) fd.append('image', imageFile);
            let res;
            if (collection?._id) {
                res = await axios.put(`/api/admin/collections/${collection._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                res = await axios.post('/api/admin/collections', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSave(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally { setSaving(false); }
    };

    const selectedBrand = brands.find(b => b._id === form.brand);
    const brandHref = selectedBrand?.href || (selectedBrand?.slug ? `/marque/${selectedBrand.slug}` : null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    <div>
                        <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Collections</p>
                        <h3 className="text-base font-semibold text-[#111827]">
                            {collection ? 'Modifier la collection' : 'Nouvelle collection'}
                        </h3>
                    </div>
                    <button onClick={onCancel}
                        className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Marque *</label>
                        <select value={form.brand} onChange={e => set('brand', e.target.value)} className={inputCls} required>
                            <option value="">— Sélectionner une marque —</option>
                            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                        {selectedBrand && brandHref && (
                            <p className="text-xs text-[#9CA3AF] mt-1.5 flex items-center gap-1">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                Visible sur&nbsp;
                                <a href={brandHref} target="_blank" rel="noreferrer" className="text-[#C9A84C] hover:underline">{brandHref}</a>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Nom de la collection *</label>
                        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                            placeholder="ex: Été 2025 — Kente Moderne" className={inputCls} required />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => set('description', e.target.value)}
                            rows={3} placeholder="Présentation de la collection…" className={inputCls + " resize-y"} />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Image de couverture</label>
                        <div className="flex items-center gap-3">
                            {imagePreview && (
                                <img src={imagePreview} className="w-16 h-16 object-cover rounded-lg border border-[#E5E7EB]" alt="Preview" />
                            )}
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="text-sm font-medium text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB] px-4 py-2 rounded-lg transition-colors">
                                {imagePreview ? 'Changer l\'image' : 'Choisir une image'}
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </div>
                    </div>

                    <div className="flex items-end gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Ordre</label>
                            <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))}
                                className={inputCls + " w-28"} />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)}
                                className="w-4 h-4 accent-[#C9A84C] rounded" />
                            <span className="text-sm text-[#374151]">Actif (visible)</span>
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#F3F4F6]">
                        <button type="button" onClick={onCancel}
                            className="border border-[#E5E7EB] text-[#374151] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={saving}
                            className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                            {saving && <Spinner />}
                            {saving ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminCollections() {
    const [collections, setCollections] = useState([]);
    const [brands, setBrands]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [editing, setEditing]         = useState(null);
    const [filterBrand, setFilterBrand] = useState('');
    const [saved, setSaved]             = useState(null);

    useEffect(() => {
        Promise.all([
            axios.get('/api/admin/collections'),
            axios.get('/api/admin/brands'),
        ]).then(([cRes, bRes]) => {
            setCollections(cRes.data);
            setBrands(bRes.data);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleSave = (doc) => {
        setCollections(prev => {
            const exists = prev.find(c => c._id === doc._id);
            return exists ? prev.map(c => c._id === doc._id ? doc : c) : [doc, ...prev];
        });
        setSaved(doc._id);
        setTimeout(() => setSaved(null), 3000);
        setEditing(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette collection ? Les produits liés ne seront pas supprimés.')) return;
        await axios.delete(`/api/admin/collections/${id}`);
        setCollections(prev => prev.filter(c => c._id !== id));
    };

    const handleToggle = async (col) => {
        const res = await axios.put(`/api/admin/collections/${col._id}`, { is_active: !col.is_active });
        setCollections(prev => prev.map(c => c._id === col._id ? res.data : c));
    };

    const getBrandName = (col) => {
        const b = brands.find(b => b._id === (col.brand?._id || col.brand));
        return b?.name || '—';
    };
    const getBrandHref = (col) => {
        const b = brands.find(b => b._id === (col.brand?._id || col.brand));
        return b?.href || (b?.slug ? `/marque/${b.slug}` : null);
    };

    const filtered = filterBrand
        ? collections.filter(c => (c.brand?._id || c.brand) === filterBrand)
        : collections;

    const grouped = filtered.reduce((acc, col) => {
        const brandId = col.brand?._id || col.brand || 'other';
        if (!acc[brandId]) acc[brandId] = { name: getBrandName(col), href: getBrandHref(col), items: [] };
        acc[brandId].items.push(col);
        return acc;
    }, {});

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Contenu</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Collections</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">
                        {collections.length} collection{collections.length !== 1 ? 's' : ''} — {brands.length} marque{brands.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={() => setEditing({})}
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Nouvelle collection
                </button>
            </div>

            {/* Filtre marque */}
            {brands.length > 0 && (
                <div className="flex gap-1.5 mb-6 flex-wrap">
                    <button onClick={() => setFilterBrand('')}
                        className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                            !filterBrand
                                ? 'bg-[#FDF8EC] border-[#C9A84C]/40 text-[#C9A84C]'
                                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#374151]'
                        }`}>
                        Toutes
                    </button>
                    {brands.map(b => (
                        <button key={b._id} onClick={() => setFilterBrand(b._id)}
                            className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                                filterBrand === b._id
                                    ? 'bg-[#FDF8EC] border-[#C9A84C]/40 text-[#C9A84C]'
                                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#374151]'
                            }`}>
                            {b.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Flash saved */}
            {saved && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 mb-5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    <span className="text-sm font-medium text-emerald-700">Collection enregistrée — visible sur la page de la marque</span>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-2">
                    <Spinner />
                    <span className="text-sm text-[#9CA3AF]">Chargement…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-[#D1D5DB] py-20 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3">Aucune collection pour l'instant</p>
                    <button onClick={() => setEditing({})}
                        className="text-sm font-medium text-[#C9A84C] hover:text-[#B8973B] transition-colors">
                        + Créer la première collection
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(grouped).map(([brandId, group]) => (
                        <div key={brandId}>
                            {/* Séparateur marque */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold text-[#111827] uppercase tracking-widest">{group.name}</span>
                                {group.href && (
                                    <a href={group.href} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-1 text-xs text-[#C9A84C] hover:text-[#B8973B] transition-colors">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                        </svg>
                                        Voir la page
                                    </a>
                                )}
                                <div className="flex-1 h-px bg-[#E5E7EB]" />
                                <span className="text-xs text-[#9CA3AF]">{group.items.length} collection{group.items.length !== 1 ? 's' : ''}</span>
                            </div>

                            {/* Tableau */}
                            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                                {/* ── Desktop table ── */}
                                <table className="w-full hidden sm:table">
                                    <thead>
                                        <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                            <th className="w-16 px-4 py-3" />
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Collection</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Description</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                                            <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-48">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F3F4F6]">
                                        {group.items.map(col => (
                                            <tr key={col._id}
                                                className={`hover:bg-[#F9FAFB] transition-colors ${!col.is_active ? 'opacity-50' : ''} ${saved === col._id ? 'bg-[#FDF8EC]' : ''}`}>
                                                {/* Image */}
                                                <td className="px-4 py-3.5">
                                                    {col.image
                                                        ? <img src={imgSrc(col.image)} className="w-11 h-11 object-cover rounded-lg border border-[#E5E7EB]" alt={col.name} />
                                                        : <div className="w-11 h-11 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                          </div>}
                                                </td>
                                                {/* Nom */}
                                                <td className="px-4 py-3.5">
                                                    <p className="text-sm font-semibold text-[#111827]">{col.name}</p>
                                                    {col.order > 0 && <p className="text-xs text-[#9CA3AF] mt-0.5">Ordre : {col.order}</p>}
                                                </td>
                                                {/* Description */}
                                                <td className="px-4 py-3.5 hidden md:table-cell">
                                                    <p className="text-xs text-[#6B7280] max-w-xs line-clamp-2">{col.description || '—'}</p>
                                                </td>
                                                {/* Statut */}
                                                <td className="px-4 py-3.5">
                                                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${col.is_active ? 'bg-green-100 text-green-700' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
                                                        {col.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleToggle(col)}
                                                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                                                                col.is_active
                                                                    ? 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                                                                    : 'border-[#C9A84C]/40 bg-[#FDF8EC] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white'
                                                            }`}>
                                                            {col.is_active ? 'Désactiver' : 'Activer'}
                                                        </button>
                                                        <button onClick={() => setEditing(col)}
                                                            className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                                            Modifier
                                                        </button>
                                                        <button onClick={() => handleDelete(col._id)}
                                                            className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* ── Cartes mobile ── */}
                                <div className="sm:hidden divide-y divide-[#F3F4F6]">
                                    {group.items.map(col => (
                                        <div key={col._id} className={`flex items-center gap-3 p-4 ${!col.is_active ? 'opacity-50' : ''}`}>
                                            {col.image
                                                ? <img src={imgSrc(col.image)} className="w-14 h-14 object-cover rounded-xl border border-[#E5E7EB] flex-shrink-0" alt={col.name} />
                                                : <div className="w-14 h-14 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex-shrink-0 flex items-center justify-center">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                  </div>}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#111827] truncate">{col.name}</p>
                                                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${col.is_active ? 'bg-green-100 text-green-700' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
                                                    {col.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                                                <button onClick={() => setEditing(col)}
                                                    className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                                    Modifier
                                                </button>
                                                <button onClick={() => handleDelete(col._id)}
                                                    className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing !== null && (
                <CollectionForm
                    collection={editing?._id ? editing : null}
                    brands={brands}
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                />
            )}
        </div>
    );
}
