import { useEffect, useState } from 'react';
import axios from 'axios';
import { imgSrc } from '../../utils/imgSrc';

const GOLD = '#C9A84C';
const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";
const SITE_URL = 'https://miadreams.netlify.app';

const CATEGORIES = ['Prêt-à-porter', 'Accessoires', 'Bijoux', 'Sacs', 'Chaussures', 'Tissus', 'Autre'];

function CopyBtn({ value, label = 'Copier' }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button type="button" onClick={copy}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={copied ? { background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' } : { background: '#FDF8EC', color: '#C9A84C', border: '1px solid #C9A84C30' }}>
            {copied ? (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Copié !</>
            ) : (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> {label}</>
            )}
        </button>
    );
}

function MultiImageUpload({ existingImages = [], onExistingChange, onNewFiles }) {
    const [newPreviews, setNewPreviews] = useState([]);
    const [newFiles, setNewFiles]       = useState([]);

    const handleAdd = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        setNewPreviews(p => [...p, ...previews]);
        setNewFiles(p => {
            const updated = [...p, ...files];
            onNewFiles(updated);
            return updated;
        });
        e.target.value = ''; // reset input
    };

    const removeExisting = (idx) => {
        onExistingChange(existingImages.filter((_, i) => i !== idx));
    };
    const removeNew = (idx) => {
        setNewPreviews(p => p.filter((_, i) => i !== idx));
        setNewFiles(p => {
            const updated = p.filter((_, i) => i !== idx);
            onNewFiles(updated);
            return updated;
        });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3 mb-3">
                {/* Images existantes */}
                {existingImages.map((img, i) => (
                    <div key={i} className="relative group">
                        <img src={imgSrc(img)} className="w-20 h-20 object-cover rounded-lg border border-[#E5E7EB]" alt="" />
                        <button type="button" onClick={() => removeExisting(i)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs shadow">
                            ×
                        </button>
                        <span className="absolute bottom-0 inset-x-0 text-center text-[8px] bg-black/50 text-white py-0.5 rounded-b-lg">Actuel</span>
                    </div>
                ))}
                {/* Nouvelles images */}
                {newPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative group">
                        <img src={src} className="w-20 h-20 object-cover rounded-lg border-2 border-[#C9A84C]/40" alt="" />
                        <button type="button" onClick={() => removeNew(i)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs shadow">
                            ×
                        </button>
                        <span className="absolute bottom-0 inset-x-0 text-center text-[8px] bg-[#C9A84C]/80 text-white py-0.5 rounded-b-lg">Nouveau</span>
                    </div>
                ))}
                {/* Bouton ajouter */}
                <label className="w-20 h-20 border-2 border-dashed border-[#E5E7EB] hover:border-[#C9A84C]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="text-[9px] text-[#9CA3AF] mt-1">Ajouter</span>
                    <input type="file" accept="image/*" multiple onChange={handleAdd} className="hidden" />
                </label>
            </div>
            <p className="text-xs text-[#9CA3AF]">Max 8 images — Survole une image et clique × pour la supprimer</p>
        </div>
    );
}

function ProductForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState(initial || {
        name: '', description: '', price: '', compare_price: '', category: 'Prêt-à-porter',
        sizes: '', colors: '', stock: '0', is_active: true, is_featured: false, order: '0',
        collection: '',
    });
    const [mainImage,   setMainImage]   = useState(null);
    const [mainPreview, setMainPreview] = useState(null);
    const [extraFiles,  setExtraFiles]  = useState([]);
    const [existingImages, setExistingImages] = useState(
        Array.isArray(initial?.images) ? initial.images : []
    );
    const [loading,     setLoading]     = useState(false);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/collections').then(r => setCollections(r.data)).catch(() => {});
    }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleMainFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMainImage(file);
        setMainPreview(URL.createObjectURL(file));
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
            if (mainImage) fd.append('image', mainImage);
            // Images supplémentaires conservées
            existingImages.forEach(img => fd.append('existingImages', img));
            // Nouvelles images supplémentaires
            extraFiles.forEach(f => fd.append('images', f));

            const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (initial?._id) await axios.put(`/api/admin/products/${initial._id}`, fd, cfg);
            else              await axios.post('/api/admin/products', fd, cfg);
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
                {initial?.slug && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9CA3AF] truncate max-w-[180px]">/boutique/{initial.slug}</span>
                        <CopyBtn value={`${SITE_URL}/boutique/${initial.slug}`} label="Copier le lien" />
                    </div>
                )}
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
                        {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
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

                {/* Image principale */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Image principale</label>
                    <input type="file" accept="image/*" onChange={handleMainFile}
                        className="w-full text-sm text-[#374151] file:mr-3 file:border-0 file:bg-[#FDF8EC] file:text-[#C9A84C] file:text-xs file:font-medium file:px-3 file:py-2 file:rounded-lg cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white" />
                    {(mainPreview || form.image) && (
                        <img src={mainPreview || imgSrc(form.image)} className="mt-2 h-20 w-auto object-cover rounded-lg border border-[#E5E7EB]" alt="aperçu" />
                    )}
                </div>

                {/* Images supplémentaires */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#374151] mb-2">
                        Images supplémentaires
                        <span className="text-[#9CA3AF] font-normal ml-1">(galerie visible côté client)</span>
                    </label>
                    <MultiImageUpload
                        existingImages={existingImages}
                        onExistingChange={setExistingImages}
                        onNewFiles={setExtraFiles}
                    />
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
    const [editing,  setEditing]  = useState(null);
    const [copied,   setCopied]   = useState(null); // id du produit dont le lien vient d'être copié

    const load = () => axios.get('/api/admin/products').then(r => setProducts(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const handleSave   = () => { load(); setShowForm(false); setEditing(null); };
    const handleEdit   = (p) => {
        setEditing({ ...p, sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || '', colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || '' });
        setShowForm(true);
        window.scrollTo(0, 0);
    };
    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce produit ?')) return;
        await axios.delete(`/api/admin/products/${id}`).catch(() => {});
        load();
    };
    const copyLink = (p) => {
        navigator.clipboard.writeText(`${SITE_URL}/boutique/${p.slug}`).then(() => {
            setCopied(p._id);
            setTimeout(() => setCopied(null), 2000);
        });
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <div>
                                <p className="text-sm font-semibold text-red-700">{outStock.length} produit{outStock.length > 1 ? 's' : ''} en rupture de stock</p>
                                <p className="text-xs text-red-500 mt-0.5">{outStock.map(p => p.name).join(' · ')}</p>
                            </div>
                        </div>
                    )}
                    {lowStock.length > 0 && (
                        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-200 bg-amber-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            <div>
                                <p className="text-sm font-semibold text-amber-700">Stock faible — moins de 5 unités</p>
                                <p className="text-xs text-amber-600 mt-0.5">{lowStock.map(p => `${p.name} (${p.stock})`).join(' · ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showForm && (
                <ProductForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {products.length === 0 ? (
                    <div className="py-16 text-center">
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
                                <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Lien</th>
                                <th className="text-right px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                            {products.map((p) => {
                                const isOut = p.stock === 0 && p.is_active;
                                const isLow = p.stock > 0 && p.stock < 5;
                                return (
                                    <tr key={p._id} className="hover:bg-[#F9FAFB] transition-colors"
                                        style={isOut ? { borderLeft: '3px solid #FCA5A5' } : isLow ? { borderLeft: '3px solid #FCD34D' } : {}}>
                                        <td className="px-4 py-3.5">
                                            {p.image
                                                ? <img src={imgSrc(p.image)} className="w-10 h-12 object-cover rounded-lg border border-[#E5E7EB]" alt="" />
                                                : <div className="w-10 h-12 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]" />}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="text-sm font-medium text-[#111827]">{p.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDF8EC] text-[#C9A84C] font-medium">{p.category}</span>
                                                {p.is_featured && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDF8EC] text-[#C9A84C]">★ Mis en avant</span>}
                                                {Array.isArray(p.images) && p.images.length > 0 && (
                                                    <span className="text-xs text-[#9CA3AF]">📷 +{p.images.length}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 hidden md:table-cell">
                                            <p className="text-sm font-semibold" style={{ color: GOLD }}>{(p.price || 0).toLocaleString('fr-FR')} F</p>
                                            {p.compare_price > p.price && (
                                                <p className="text-xs text-[#9CA3AF] line-through">{p.compare_price.toLocaleString('fr-FR')} F</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            <span className="text-sm font-semibold" style={{ color: p.stock === 0 ? '#DC2626' : p.stock < 5 ? '#D97706' : '#059669' }}>
                                                {p.stock} {p.stock === 0 && '(Épuisé)'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                            {p.slug ? (
                                                <button onClick={() => copyLink(p)}
                                                    title={`${SITE_URL}/boutique/${p.slug}`}
                                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                                                    style={copied === p._id
                                                        ? { background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }
                                                        : { background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                                                    {copied === p._id ? (
                                                        <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Copié !</>
                                                    ) : (
                                                        <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> Copier lien</>
                                                    )}
                                                </button>
                                            ) : <span className="text-xs text-[#D1D5DB]">—</span>}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                {p.slug && (
                                                    <a href={`${SITE_URL}/boutique/${p.slug}`} target="_blank" rel="noreferrer"
                                                        className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                                                        style={{ background: '#C9A84C' }}
                                                        title="Voir sur le site">
                                                        Voir
                                                    </a>
                                                )}
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
