import { useEffect, useState } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';
const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

const CATEGORIES = ['Prêt-à-porter', 'Accessoires', 'Bijoux', 'Sacs', 'Chaussures', 'Tissus', 'Autre'];

function ProductForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState(initial || {
        name: '', description: '', price: '', compare_price: '', category: 'Prêt-à-porter',
        sizes: '', colors: '', stock: '0', is_active: true, is_featured: false, order: '0',
        collection: '',
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/collections').then(r => setCollections(r.data)).catch(() => {});
    }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k !== '_id' && k !== '__v' && k !== 'image' && k !== 'images' && k !== 'slug' && v !== '' && v !== null && v !== undefined)
                    fd.append(k, v);
            });
            if (image) fd.append('image', image);
            const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (initial?._id) await axios.put(`/api/admin/products/${initial._id}`, fd, cfg);
            else await axios.post('/api/admin/products', fd, cfg);
            onSave();
        } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-widest">
                    {initial?._id ? 'Modifier le produit' : 'Nouveau produit'}
                </span>
                <div className="flex-1 h-px bg-[#F3F4F6]" />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Nom *</label>
                    <input className={inp} required value={form.name || ''} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Description</label>
                    <textarea className={inp + " resize-none"} rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Prix (FCFA) *</label>
                    <input type="number" className={inp} required value={form.price || ''} onChange={e => set('price', e.target.value)} placeholder="15000" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Prix barré (FCFA)</label>
                    <input type="number" className={inp} value={form.compare_price || ''} onChange={e => set('compare_price', e.target.value)} placeholder="20000" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Catégorie</label>
                    <select className={inp} value={form.category || 'Prêt-à-porter'} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Collection</label>
                    <select className={inp} value={form.collection || ''} onChange={e => set('collection', e.target.value)}>
                        <option value="">— Aucune collection —</option>
                        {collections.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Stock</label>
                    <input type="number" className={inp} value={form.stock || '0'} onChange={e => set('stock', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Tailles (séparées par virgule)</label>
                    <input className={inp} value={form.sizes || ''} onChange={e => set('sizes', e.target.value)} placeholder="XS, S, M, L, XL" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Couleurs (séparées par virgule)</label>
                    <input className={inp} value={form.colors || ''} onChange={e => set('colors', e.target.value)} placeholder="Noir, Blanc, Or" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Ordre</label>
                    <input type="number" className={inp} value={form.order || '0'} onChange={e => set('order', e.target.value)} />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Image principale</label>
                    <input type="file" accept="image/*" onChange={handleFile}
                        className="w-full text-sm text-[#374151] file:mr-3 file:border-0 file:bg-[#FDF8EC] file:text-[#C9A84C] file:text-xs file:font-medium file:px-3 file:py-2 file:rounded-lg cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white" />
                    {(preview || form.image) && (
                        <img src={preview || `/uploads/${form.image}`} className="mt-2 h-20 w-auto object-cover rounded-lg border border-[#E5E7EB]" alt="aperçu" />
                    )}
                </div>

                <div className="sm:col-span-2 flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!form.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-[#C9A84C] w-4 h-4 rounded" />
                        <span className="text-sm text-[#374151]">Actif (visible en boutique)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="accent-[#C9A84C] w-4 h-4 rounded" />
                        <span className="text-sm text-[#374151]">Mis en avant</span>
                    </label>
                </div>

                <div className="sm:col-span-2 flex gap-3 pt-4 border-t border-[#F3F4F6]">
                    <button type="submit" disabled={loading}
                        className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                        {loading ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                    <button type="button" onClick={onCancel}
                        className="border border-[#E5E7EB] text-[#374151] text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function AdminProduits() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = () => axios.get('/api/admin/products').then(r => setProducts(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const handleSave = () => { load(); setShowForm(false); setEditing(null); };
    const handleEdit = (p) => {
        setEditing({
            ...p,
            sizes:  Array.isArray(p.sizes)  ? p.sizes.join(', ')  : p.sizes  || '',
            colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || '',
        });
        setShowForm(true);
        window.scrollTo(0, 0);
    };
    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce produit ?')) return;
        await axios.delete(`/api/admin/products/${id}`).catch(() => {});
        load();
    };

    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5);
    const outStock = products.filter(p => p.stock === 0 && p.is_active);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">E-commerce</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Produits</h1>
                </div>
                <button onClick={() => { setEditing(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Ajouter
                </button>
            </div>

            {/* Alertes stock */}
            {(outStock.length > 0 || lowStock.length > 0) && (
                <div className="space-y-2 mb-6">
                    {outStock.length > 0 && (
                        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-200 bg-red-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-red-700">
                                    {outStock.length} produit{outStock.length > 1 ? 's' : ''} en rupture de stock
                                </p>
                                <p className="text-xs text-red-500 mt-0.5">{outStock.map(p => p.name).join(' · ')}</p>
                            </div>
                        </div>
                    )}
                    {lowStock.length > 0 && (
                        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-200 bg-amber-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-amber-700">Stock faible — moins de 5 unités</p>
                                <p className="text-xs text-amber-600 mt-0.5">{lowStock.map(p => `${p.name} (${p.stock})`).join(' · ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showForm && (
                <ProductForm
                    initial={editing}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                />
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {products.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">Aucun produit</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Cliquez sur "Ajouter" pour commencer</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="w-16 px-4 py-3.5 bg-[#F9FAFB]" />
                                <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Produit</th>
                                <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Prix</th>
                                <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Stock</th>
                                <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Statut</th>
                                <th className="text-right px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                            {products.map((p) => {
                                const isOut  = p.stock === 0 && p.is_active;
                                const isLow  = p.stock > 0 && p.stock < 5;
                                return (
                                    <tr key={p._id} className="hover:bg-[#F9FAFB] transition-colors"
                                        style={isOut ? { borderLeft: '3px solid #FCA5A5' } : isLow ? { borderLeft: '3px solid #FCD34D' } : {}}>
                                        <td className="px-4 py-3.5">
                                            {p.image
                                                ? <img src={`/uploads/${p.image}`} className="w-10 h-12 object-cover rounded-lg border border-[#E5E7EB]" alt="" />
                                                : <div className="w-10 h-12 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]" />
                                            }
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="text-sm font-medium text-[#111827]">{p.name}</p>
                                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#FDF8EC] text-[#C9A84C] font-medium">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 hidden md:table-cell">
                                            <p className="text-sm font-semibold" style={{ color: GOLD }}>{(p.price || 0).toLocaleString('fr-FR')} F</p>
                                            {p.compare_price > p.price && (
                                                <p className="text-xs text-[#9CA3AF] line-through">{p.compare_price.toLocaleString('fr-FR')} F</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold" style={{
                                                    color: p.stock === 0 ? '#DC2626' : p.stock < 5 ? '#D97706' : '#059669'
                                                }}>
                                                    {p.stock}
                                                </span>
                                                {p.stock === 0 && (
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Épuisé</span>
                                                )}
                                                {p.stock > 0 && p.stock < 5 && (
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 animate-pulse">Faible</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                                    {p.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                                {p.is_featured && (
                                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#FDF8EC] text-[#C9A84C]">★</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(p)}
                                                    className="text-xs font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors">
                                                    Modifier
                                                </button>
                                                <button onClick={() => handleDelete(p._id)}
                                                    className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
