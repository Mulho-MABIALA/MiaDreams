import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';

const GOLD  = '#C9A84C';
const GREEN = '#22c55e';
const RED   = '#ef4444';

const CATEGORIES_ENTREE = [
    'Vente boutique', 'Vente sur mesure', 'Prestation service', 'Consultation',
    'Formation', 'Sponsoring', 'Subvention', 'Remboursement', 'Autre entrée',
];
const CATEGORIES_SORTIE = [
    'Matières premières', 'Tissus & fournitures', 'Loyer', 'Électricité / Eau',
    'Salaires', 'Transport / Livraison', 'Marketing & Pub', 'Équipement',
    'Sous-traitance', 'Frais bancaires', 'Impôts & taxes', 'Autre sortie',
];
const MODES = [
    { value: 'especes',      label: 'Espèces',      icon: '💵' },
    { value: 'wave',         label: 'Wave',         icon: '📱' },
    { value: 'orange_money', label: 'Orange Money', icon: '🟠' },
];

const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

const fmt     = (n) => Number(n || 0).toLocaleString('fr-FR') + ' FCFA';
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
const imgSrc  = (img) => img ? (img.startsWith('http') || img.startsWith('/') ? img : `/uploads/${img}`) : null;
const genRef  = () => { const d = new Date(); return `REF-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*900)+100)}`; };
const emptyForm = () => ({ type: 'entree', montant: '', categorie: '', description: '', date: new Date().toISOString().split('T')[0], mode_paiement: 'especes', reference: genRef(), notes: '' });

// ─── Composants utilitaires ────────────────────────────────────────────────────

function Spinner({ small }) {
    return (
        <svg className={`animate-spin text-[#C9A84C] ${small ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
        </svg>
    );
}

function StatCard({ label, value, sub, color, icon }) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{icon}</span>
                <span className="text-xl font-bold" style={{ color }}>{fmt(value)}</span>
            </div>
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">{label}</p>
            {sub && <p className="text-xs text-[#B8A090] mt-0.5">{sub}</p>}
        </div>
    );
}

// ─── POS — Point de Vente ─────────────────────────────────────────────────────

function POSPanel({ onSaleComplete }) {
    const [products, setProducts]       = useState([]);
    const [search, setSearch]           = useState('');
    const [panier, setPanier]           = useState([]);       // { product, quantity, size, color }
    const [customer, setCustomer]       = useState({ name: '', phone: '', address: '' });
    const [payMethod, setPayMethod]     = useState('especes');
    const [remise, setRemise]           = useState('');
    const [notes, setNotes]             = useState('');
    const [saving, setSaving]           = useState(false);
    const [success, setSuccess]         = useState(null);     // { order, transaction }
    const [loadingProds, setLoadingProds] = useState(true);
    const searchRef = useRef();

    useEffect(() => {
        axios.get('/api/admin/products')
            .then(r => setProducts(r.data.filter(p => p.is_active && p.stock > 0)))
            .catch(() => {})
            .finally(() => setLoadingProds(false));
    }, []);

    const filtered = products.filter(p =>
        !search || p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const addToPanier = (product) => {
        setPanier(prev => {
            const existing = prev.find(i => i.product._id === product._id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // stock max atteint
                return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product, quantity: 1, size: '', color: '' }];
        });
    };

    const updateLine = (pid, field, value) => {
        setPanier(prev => prev.map(i => i.product._id === pid ? { ...i, [field]: value } : i));
    };

    const removeLine = (pid) => setPanier(prev => prev.filter(i => i.product._id !== pid));

    const subtotal  = panier.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const remiseMt  = Math.min(Number(remise) || 0, subtotal);
    const total     = Math.max(0, subtotal - remiseMt);

    const handleSale = async () => {
        if (!panier.length) return;
        setSaving(true);
        try {
            const items = panier.map(i => ({
                product_id: i.product._id,
                name:       i.product.name,
                image:      i.product.image,
                price:      i.product.price,
                quantity:   i.quantity,
                size:       i.size,
                color:      i.color,
            }));
            const { data } = await axios.post('/api/caisse/vente', {
                items, customer, payment_method: payMethod, remise: remiseMt, notes,
            });
            setSuccess(data);
            onSaleComplete();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la vente');
        } finally { setSaving(false); }
    };

    const reset = () => {
        setPanier([]); setCustomer({ name: '', phone: '', address: '' });
        setPayMethod('especes'); setRemise(''); setNotes(''); setSuccess(null);
        // Recharger les produits pour avoir les stocks à jour
        setLoadingProds(true);
        axios.get('/api/admin/products')
            .then(r => setProducts(r.data.filter(p => p.is_active && p.stock > 0)))
            .finally(() => setLoadingProds(false));
    };

    // ── Reçu de vente ──
    if (success) return (
        <div className="max-w-sm mx-auto mt-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
                {/* Entête reçu */}
                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">Vente enregistrée</p>
                    <p className="text-2xl font-bold text-[#111827]">{fmt(success.order.total)}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Commande {success.order.order_number}</p>
                </div>

                {/* Articles */}
                <div className="px-5 py-4 border-b border-[#F3F4F6]">
                    {success.order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5">
                            <span className="text-sm text-[#374151]">{item.quantity}× {item.name}</span>
                            <span className="text-sm font-medium text-[#111827]">{fmt(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>

                {/* Détails */}
                <div className="px-5 py-4 space-y-2 text-sm border-b border-[#F3F4F6]">
                    {success.order.customer?.name !== 'Client comptoir' && (
                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Client</span>
                            <span className="text-[#374151] font-medium">{success.order.customer.name}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-[#9CA3AF]">Paiement</span>
                        <span className="text-[#374151]">{MODES.find(m => m.value === success.order.payment_method)?.label || success.order.payment_method}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span className="text-[#374151]">Total encaissé</span>
                        <span className="text-emerald-600">{fmt(success.order.total)}</span>
                    </div>
                </div>

                <div className="px-5 py-4 flex gap-3">
                    <button onClick={reset}
                        className="flex-1 bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                        Nouvelle vente
                    </button>
                    <button onClick={() => window.print()}
                        className="flex-shrink-0 border border-[#E5E7EB] text-[#6B7280] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        🖨 Imprimer
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

            {/* ── Catalogue produits ── */}
            <div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    {/* Barre recherche */}
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
                        <svg className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input ref={searchRef} type="text" placeholder="Rechercher un produit…"
                            className="flex-1 text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF]"
                            value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-[#9CA3AF] hover:text-[#374151]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        )}
                    </div>

                    {/* Grille produits */}
                    {loadingProds ? (
                        <div className="flex items-center justify-center py-16 gap-2">
                            <Spinner /><span className="text-sm text-[#9CA3AF]">Chargement…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="text-3xl mb-2">📦</div>
                            <p className="text-sm text-[#9CA3AF]">{search ? 'Aucun résultat' : 'Aucun produit disponible en stock'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#F3F4F6]">
                            {filtered.map(product => {
                                const inPanier = panier.find(i => i.product._id === product._id);
                                const maxStock = product.stock;
                                return (
                                    <button key={product._id}
                                        onClick={() => addToPanier(product)}
                                        disabled={inPanier?.quantity >= maxStock}
                                        className={`bg-white p-3 text-left transition-all hover:bg-[#FFFBF0] active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed relative group ${inPanier ? 'ring-2 ring-inset ring-[#C9A84C]' : ''}`}>
                                        {/* Image */}
                                        <div className="aspect-square rounded-lg overflow-hidden bg-[#F9FAFB] mb-2.5 relative">
                                            {product.image
                                                ? <img src={imgSrc(product.image)} alt={product.name}
                                                       className="w-full h-full object-cover object-top" />
                                                : <div className="w-full h-full flex items-center justify-center">
                                                      <svg className="w-6 h-6 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                  </div>
                                            }
                                            {/* Badge quantité panier */}
                                            {inPanier && (
                                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                                     style={{ background: GOLD }}>
                                                    {inPanier.quantity}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-[#111827] leading-tight mb-1 line-clamp-2">{product.name}</p>
                                        <p className="text-xs font-bold" style={{ color: GOLD }}>{fmt(product.price)}</p>
                                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">Stock : {product.stock}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Panier + encaissement ── */}
            <div className="flex flex-col gap-4">

                {/* Panier */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                            🛒 Panier
                            {panier.length > 0 && (
                                <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: GOLD }}>
                                    {panier.reduce((s,i) => s + i.quantity, 0)}
                                </span>
                            )}
                        </h3>
                        {panier.length > 0 && (
                            <button onClick={() => setPanier([])}
                                className="text-xs text-red-400 hover:text-red-600 transition-colors">
                                Vider
                            </button>
                        )}
                    </div>

                    {panier.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-sm text-[#9CA3AF]">Cliquez sur un produit pour l'ajouter</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F3F4F6]">
                            {panier.map(({ product, quantity, size, color }) => (
                                <div key={product._id} className="p-3">
                                    <div className="flex items-start gap-3">
                                        {/* Miniature */}
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                                            {product.image
                                                ? <img src={imgSrc(product.image)} alt="" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full bg-[#E5E7EB]" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#111827] truncate">{product.name}</p>
                                            <p className="text-xs font-bold mt-0.5" style={{ color: GOLD }}>
                                                {fmt(product.price * quantity)}
                                            </p>
                                        </div>
                                        {/* Quantité */}
                                        <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden flex-shrink-0">
                                            <button onClick={() => quantity <= 1 ? removeLine(product._id) : updateLine(product._id, 'quantity', quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors text-lg leading-none">
                                                {quantity <= 1 ? '×' : '−'}
                                            </button>
                                            <span className="w-7 text-center text-xs font-semibold text-[#374151]">{quantity}</span>
                                            <button onClick={() => quantity < product.stock && updateLine(product._id, 'quantity', quantity + 1)}
                                                disabled={quantity >= product.stock}
                                                className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-30 transition-colors">
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Taille / couleur si dispo */}
                                    {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                                        <div className="flex gap-2 mt-2 ml-13">
                                            {product.sizes?.length > 0 && (
                                                <select value={size} onChange={e => updateLine(product._id, 'size', e.target.value)}
                                                    className="flex-1 text-xs border border-[#E5E7EB] rounded-md px-2 py-1 outline-none focus:border-[#C9A84C] text-[#374151]">
                                                    <option value="">Taille</option>
                                                    {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            )}
                                            {product.colors?.length > 0 && (
                                                <select value={color} onChange={e => updateLine(product._id, 'color', e.target.value)}
                                                    className="flex-1 text-xs border border-[#E5E7EB] rounded-md px-2 py-1 outline-none focus:border-[#C9A84C] text-[#374151]">
                                                    <option value="">Couleur</option>
                                                    {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Client (optionnel) */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Client (optionnel)</p>
                    <div className="space-y-2">
                        <input type="text" placeholder="Nom du client"
                            className={inp} value={customer.name}
                            onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} />
                        <input type="text" placeholder="Téléphone"
                            className={inp} value={customer.phone}
                            onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                </div>

                {/* Paiement + total */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Paiement</p>

                    {/* Modes */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {MODES.map(m => (
                            <button key={m.value} onClick={() => setPayMethod(m.value)}
                                className={`py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                                    payMethod === m.value
                                        ? 'border-[#C9A84C] bg-[#FFFBF0] text-[#C9A84C]'
                                        : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#C9A84C]/40'
                                }`}>
                                <span className="text-base">{m.icon}</span>
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Remise */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Remise (FCFA)</label>
                        <input type="number" min="0" max={subtotal} placeholder="0"
                            className={inp} value={remise}
                            onChange={e => setRemise(e.target.value)} />
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#374151] mb-1.5">Notes</label>
                        <textarea rows={2} placeholder="Remarque…" className={inp + ' resize-none'}
                            value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>

                    {/* Récapitulatif */}
                    {panier.length > 0 && (
                        <div className="space-y-1.5 mb-4 py-3 border-t border-b border-[#F3F4F6]">
                            <div className="flex justify-between text-sm text-[#6B7280]">
                                <span>Sous-total</span>
                                <span>{fmt(subtotal)}</span>
                            </div>
                            {remiseMt > 0 && (
                                <div className="flex justify-between text-sm text-red-500">
                                    <span>Remise</span>
                                    <span>− {fmt(remiseMt)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold text-[#111827]">
                                <span>Total</span>
                                <span style={{ color: GOLD }}>{fmt(total)}</span>
                            </div>
                        </div>
                    )}

                    {/* Bouton encaisser */}
                    <button onClick={handleSale} disabled={!panier.length || saving}
                        className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        style={{ background: panier.length ? GOLD : '#9CA3AF' }}>
                        {saving ? <><Spinner small /> Enregistrement…</> : <>✓ Encaisser {panier.length > 0 ? fmt(total) : ''}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AdminCaisse — composant principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminCaisse() {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats]               = useState(null);
    const [form, setForm]                 = useState(emptyForm());
    const [editing, setEditing]           = useState(null);
    const [viewing, setViewing]           = useState(null);
    const [showForm, setShowForm]         = useState(false);
    const [saving, setSaving]             = useState(false);
    const [filters, setFilters]           = useState({ type: '', debut: '', fin: '', categorie: '' });
    const [tab, setTab]                   = useState('pos');    // 'pos' | 'transactions' | 'stats'

    const loadStats = useCallback(() => {
        axios.get('/api/caisse/stats').then(r => setStats(r.data)).catch(() => {});
    }, []);

    const loadTransactions = useCallback(() => {
        const params = {};
        if (filters.type)      params.type      = filters.type;
        if (filters.debut)     params.debut     = filters.debut;
        if (filters.fin)       params.fin       = filters.fin;
        if (filters.categorie) params.categorie = filters.categorie;
        axios.get('/api/caisse', { params }).then(r => setTransactions(r.data)).catch(() => {});
    }, [filters]);

    useEffect(() => { loadTransactions(); loadStats(); }, [loadTransactions, loadStats]);

    const categories = form.type === 'entree' ? CATEGORIES_ENTREE : CATEGORIES_SORTIE;

    const openNew = (type = 'entree') => {
        setEditing(null);
        setForm({ ...emptyForm(), type });
        setShowForm(true);
        setTimeout(() => document.getElementById('caisse-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
    };
    const openEdit = (tx) => {
        setEditing(tx._id);
        setForm({ ...tx, date: tx.date?.split('T')[0] || new Date().toISOString().split('T')[0] });
        setShowForm(true);
        setTimeout(() => document.getElementById('caisse-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
    };
    const cancel = () => { setShowForm(false); setEditing(null); setForm(emptyForm()); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.montant || !form.categorie) return;
        setSaving(true);
        try {
            if (editing) await axios.put(`/api/caisse/${editing}`, form);
            else         await axios.post('/api/caisse', form);
            cancel(); loadTransactions(); loadStats();
        } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette transaction ?')) return;
        await axios.delete(`/api/caisse/${id}`).catch(() => {});
        loadTransactions(); loadStats();
    };

    const soldeTotal  = stats?.allTime.solde   ?? 0;
    const entreeMois  = stats?.periode.entrees  ?? 0;
    const sortieMois  = stats?.periode.sorties  ?? 0;
    const soldeMois   = stats?.periode.solde    ?? 0;

    const TABS = [
        { key: 'pos',          label: '🛒 Point de Vente' },
        { key: 'transactions', label: '📋 Transactions' },
        { key: 'stats',        label: '📊 Statistiques' },
    ];

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Finance</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Gestion de Caisse</h1>
                </div>
                {tab === 'transactions' && (
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => openNew('entree')}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Entrée
                        </button>
                        <button onClick={() => openNew('sortie')}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Sortie
                        </button>
                    </div>
                )}
            </div>

            {/* ── Cartes résumé ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Solde caisse" value={soldeTotal} icon="💰"
                    color={soldeTotal >= 0 ? GREEN : RED} sub="Solde global toutes périodes" />
                <StatCard label="Solde du mois" value={soldeMois} icon="📅"
                    color={soldeMois >= 0 ? GOLD : RED}
                    sub={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} />
                <StatCard label="Entrées du mois" value={entreeMois} icon="📈"
                    color={GREEN} sub={`${stats?.periode.nb_entrees || 0} transaction(s)`} />
                <StatCard label="Sorties du mois" value={sortieMois} icon="📉"
                    color={RED} sub={`${stats?.periode.nb_sorties || 0} transaction(s)`} />
            </div>

            {/* ── Onglets ── */}
            <div className="flex gap-1 mb-5 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {TABS.map(({ key, label }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === key ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ══ ONGLET POS ══════════════════════════════════════════════════ */}
            {tab === 'pos' && (
                <POSPanel onSaleComplete={() => { loadTransactions(); loadStats(); }} />
            )}

            {/* ══ ONGLET TRANSACTIONS ══════════════════════════════════════════ */}
            {tab === 'transactions' && (
                <>
                    {/* Formulaire transaction manuelle */}
                    {showForm && (
                        <div id="caisse-form" className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex rounded-lg overflow-hidden border border-[#E5E7EB]">
                                    <button type="button"
                                        onClick={() => setForm(p => ({ ...p, type: 'entree', categorie: '' }))}
                                        className={`px-4 py-2 text-xs font-semibold transition-colors ${form.type === 'entree' ? 'bg-emerald-500 text-white' : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
                                        ↑ ENTRÉE
                                    </button>
                                    <button type="button"
                                        onClick={() => setForm(p => ({ ...p, type: 'sortie', categorie: '' }))}
                                        className={`px-4 py-2 text-xs font-semibold transition-colors ${form.type === 'sortie' ? 'bg-red-500 text-white' : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
                                        ↓ SORTIE
                                    </button>
                                </div>
                                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">
                                    {editing ? 'Modifier la transaction' : 'Nouvelle transaction'}
                                </span>
                                <div className="flex-1 h-px bg-[#F3F4F6]" />
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Montant (FCFA) *</label>
                                    <input type="number" min="0" step="1" required className={inp}
                                        value={form.montant} onChange={e => setForm(p => ({ ...p, montant: e.target.value }))} placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Catégorie *</label>
                                    <select required className={inp} value={form.categorie}
                                        onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))}>
                                        <option value="">— Choisir —</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Date</label>
                                    <input type="date" className={inp} value={form.date}
                                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Mode de paiement</label>
                                    <select className={inp} value={form.mode_paiement}
                                        onChange={e => setForm(p => ({ ...p, mode_paiement: e.target.value }))}>
                                        {MODES.map(m => <option key={m.value} value={m.value}>{m.icon} {m.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Description</label>
                                    <input type="text" className={inp} value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Ex: Vente robe sur mesure Mme Koné" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Référence / N° reçu</label>
                                    <div className="flex gap-2">
                                        <input type="text" className={inp + ' font-mono'} value={form.reference}
                                            onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} />
                                        <button type="button" onClick={() => setForm(p => ({ ...p, reference: genRef() }))}
                                            className="flex-shrink-0 px-2.5 border border-[#E5E7EB] rounded-lg text-[#9CA3AF] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Notes internes</label>
                                    <textarea rows={2} className={inp + ' resize-none'} value={form.notes}
                                        onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                                        placeholder="Remarques, détails supplémentaires…" />
                                </div>
                                <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2 border-t border-[#F3F4F6]">
                                    <button type="submit" disabled={saving}
                                        className={`text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm ${form.type === 'entree' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}>
                                        {saving ? 'Enregistrement…' : (editing ? 'Modifier' : `Enregistrer ${form.type === 'entree' ? "l'entrée" : 'la sortie'}`)}
                                    </button>
                                    <button type="button" onClick={cancel}
                                        className="border border-[#E5E7EB] text-[#374151] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filtres */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Type</label>
                                <select className={inp} value={filters.type}
                                    onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
                                    <option value="">Tous</option>
                                    <option value="entree">Entrées</option>
                                    <option value="sortie">Sorties</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Du</label>
                                <input type="date" className={inp} value={filters.debut}
                                    onChange={e => setFilters(p => ({ ...p, debut: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#9CA3AF] mb-1">Au</label>
                                <input type="date" className={inp} value={filters.fin}
                                    onChange={e => setFilters(p => ({ ...p, fin: e.target.value }))} />
                            </div>
                            <div className="flex items-end">
                                <button onClick={() => setFilters({ type: '', debut: '', fin: '', categorie: '' })}
                                    className="w-full border border-[#E5E7EB] text-[#6B7280] text-xs font-medium px-3 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Liste */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                        {transactions.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="text-4xl mb-3">💰</div>
                                <p className="text-sm text-[#6B7280]">Aucune transaction</p>
                            </div>
                        ) : (
                            <>
                                <table className="w-full hidden sm:table">
                                    <thead>
                                        <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Catégorie</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Description</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Mode</th>
                                            <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Montant</th>
                                            <th className="px-4 py-3 w-28"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F3F4F6]">
                                        {transactions.map(tx => (
                                            <tr key={tx._id} className="hover:bg-[#F9FAFB] transition-colors">
                                                <td className="px-4 py-3.5 text-sm text-[#6B7280] whitespace-nowrap">{fmtDate(tx.date)}</td>
                                                <td className="px-4 py-3.5">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${tx.type === 'entree' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                        {tx.type === 'entree' ? '↑' : '↓'} {tx.categorie}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-[#374151] max-w-[200px]">
                                                    <p className="truncate">{tx.description || '—'}</p>
                                                    {tx.reference && <p className="text-xs text-[#9CA3AF] mt-0.5 font-mono">{tx.reference}</p>}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-[#9CA3AF]">
                                                    {MODES.find(m => m.value === tx.mode_paiement)?.icon} {MODES.find(m => m.value === tx.mode_paiement)?.label || tx.mode_paiement}
                                                </td>
                                                <td className={`px-4 py-3.5 text-right font-bold text-sm ${tx.type === 'entree' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {tx.type === 'entree' ? '+' : '−'}{fmt(tx.montant)}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button onClick={() => setViewing(tx)}
                                                            className="text-xs font-medium text-white px-2.5 py-1.5 rounded-lg" style={{ background: GOLD }}>
                                                            Voir
                                                        </button>
                                                        <button onClick={() => openEdit(tx)}
                                                            className="text-xs text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] px-2.5 py-1.5 rounded-lg transition-colors">
                                                            Modifier
                                                        </button>
                                                        <button onClick={() => handleDelete(tx._id)}
                                                            className="text-xs text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-2.5 py-1.5 rounded-lg transition-colors">
                                                            ✕
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-[#F9FAFB] border-t-2 border-[#E5E7EB]">
                                            <td colSpan={4} className="px-4 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                                                Total ({transactions.length} transaction{transactions.length > 1 ? 's' : ''})
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {(() => {
                                                    const total = transactions.reduce((s, tx) => s + (tx.type === 'entree' ? tx.montant : -tx.montant), 0);
                                                    return <span className={`font-bold text-sm ${total >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{total >= 0 ? '+' : ''}{fmt(total)}</span>;
                                                })()}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>

                                {/* Mobile */}
                                <div className="sm:hidden divide-y divide-[#F3F4F6]">
                                    {transactions.map(tx => (
                                        <div key={tx._id} className="p-4 flex items-start gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${tx.type === 'entree' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {tx.type === 'entree' ? '↑' : '↓'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-[#111827]">{tx.categorie}</p>
                                                        {tx.description && <p className="text-xs text-[#6B7280] mt-0.5 truncate">{tx.description}</p>}
                                                        <p className="text-xs text-[#9CA3AF] mt-0.5">{fmtDate(tx.date)} · {MODES.find(m => m.value === tx.mode_paiement)?.label}</p>
                                                    </div>
                                                    <span className={`font-bold text-sm flex-shrink-0 ${tx.type === 'entree' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {tx.type === 'entree' ? '+' : '−'}{fmt(tx.montant)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={() => setViewing(tx)} className="text-xs font-medium text-white px-2.5 py-1 rounded-lg" style={{ background: GOLD }}>Voir</button>
                                                    <button onClick={() => openEdit(tx)} className="text-xs text-[#374151] bg-[#F3F4F6] px-2.5 py-1 rounded-lg">Modifier</button>
                                                    <button onClick={() => handleDelete(tx._id)} className="text-xs text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">Supprimer</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* ══ ONGLET STATS ════════════════════════════════════════════════ */}
            {tab === 'stats' && stats && (
                <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4">Bilan global (toutes périodes)</p>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-2xl font-bold text-emerald-600">{fmt(stats.allTime.entrees)}</p>
                                <p className="text-xs text-[#9CA3AF] mt-1">Total entrées</p>
                                <p className="text-xs text-emerald-500 mt-0.5">{stats.allTime.nb_entrees} transaction(s)</p>
                            </div>
                            <div className="border-x border-[#F3F4F6]">
                                <p className={`text-2xl font-bold ${stats.allTime.solde >= 0 ? 'text-[#C9A84C]' : 'text-red-600'}`}>
                                    {fmt(stats.allTime.solde)}
                                </p>
                                <p className="text-xs text-[#9CA3AF] mt-1">Solde net</p>
                                <p className={`text-xs mt-0.5 ${stats.allTime.solde >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {stats.allTime.solde >= 0 ? '✓ Positif' : '⚠ Négatif'}
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{fmt(stats.allTime.sorties)}</p>
                                <p className="text-xs text-[#9CA3AF] mt-1">Total sorties</p>
                                <p className="text-xs text-red-400 mt-0.5">{stats.allTime.nb_sorties} transaction(s)</p>
                            </div>
                        </div>
                    </div>
                    {stats.topCategories.length > 0 && (
                        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4">Top catégories — mois en cours</p>
                            <div className="space-y-3">
                                {stats.topCategories.map((c, i) => {
                                    const maxVal = stats.topCategories[0]?.total || 1;
                                    const pct = Math.round((c.total / maxVal) * 100);
                                    const isEntree = c._id.type === 'entree';
                                    return (
                                        <div key={i}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-[#374151] flex items-center gap-2">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isEntree ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                        {isEntree ? '↑' : '↓'}
                                                    </span>
                                                    {c._id.categorie}
                                                </span>
                                                <span className={`text-sm font-bold ${isEntree ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(c.total)}</span>
                                            </div>
                                            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isEntree ? GREEN : RED }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Modal détail transaction ── */}
            {viewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setViewing(null)}>
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-[#E5E7EB]"
                         onClick={e => e.stopPropagation()}>
                        <div className={`flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] ${viewing.type === 'entree' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div>
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Transaction</p>
                                <p className={`text-xl font-bold ${viewing.type === 'entree' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {viewing.type === 'entree' ? '+' : '−'}{fmt(viewing.montant)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setViewing(null); openEdit(viewing); }}
                                    className="text-xs font-medium text-[#374151] bg-white hover:bg-[#F3F4F6] px-3 py-1.5 rounded-lg transition-colors border border-[#E5E7EB]">
                                    Modifier
                                </button>
                                <button onClick={() => setViewing(null)}
                                    className="w-8 h-8 rounded-lg bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-3">
                            {[
                                { label: 'Type',            value: viewing.type === 'entree' ? '↑ Entrée' : '↓ Sortie' },
                                { label: 'Catégorie',       value: viewing.categorie },
                                { label: 'Date',            value: fmtDate(viewing.date) },
                                { label: 'Mode paiement',   value: MODES.find(m => m.value === viewing.mode_paiement)?.label || viewing.mode_paiement },
                                { label: 'Description',     value: viewing.description || null },
                                { label: 'Référence',       value: viewing.reference || null },
                                { label: 'Notes',           value: viewing.notes || null },
                            ].map(row => row.value ? (
                                <div key={row.label} className="flex flex-col gap-1 py-2 border-b border-[#F3F4F6] last:border-0">
                                    <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">{row.label}</span>
                                    <span className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{row.value}</span>
                                </div>
                            ) : null)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
