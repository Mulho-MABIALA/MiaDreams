import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
    { value: 'especes', label: 'Espèces', icon: '💵' },
    { value: 'wave',    label: 'Wave',    icon: '📱' },
];

const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

const fmt     = (n) => Number(n || 0).toLocaleString('fr-FR') + ' FCFA';
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
const genRef  = () => { const d = new Date(); return `REF-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*900)+100)}`; };
const emptyForm = () => ({ type: 'entree', montant: '', categorie: '', description: '', date: new Date().toISOString().split('T')[0], mode_paiement: 'especes', reference: genRef(), notes: '' });

// ─── Composants ───────────────────────────────────────────────────────────────

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

// ═══════════════════════════════════════════════════════════════════════════════
// AdminCaisse — Transactions & Statistiques
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
    const [tab, setTab]                   = useState('transactions');

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

    const soldeTotal = stats?.allTime.solde   ?? 0;
    const entreeMois = stats?.periode.entrees  ?? 0;
    const sortieMois = stats?.periode.sorties  ?? 0;
    const soldeMois  = stats?.periode.solde    ?? 0;

    const TABS = [
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
                <div className="flex gap-2 flex-wrap">
                    {/* Raccourci POS */}
                    <Link to="/admin/pos"
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors border"
                        style={{ borderColor: GOLD, color: GOLD, background: '#FFFBF0' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FFF3CC'}
                        onMouseLeave={e => e.currentTarget.style.background = '#FFFBF0'}>
                        🛒 Point de Vente
                    </Link>
                    {tab === 'transactions' && (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {/* ── Cartes résumé ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Solde caisse"   value={soldeTotal} icon="💰"
                    color={soldeTotal >= 0 ? GREEN : RED} sub="Solde global toutes périodes" />
                <StatCard label="Solde du mois"  value={soldeMois}  icon="📅"
                    color={soldeMois >= 0 ? GOLD : RED}
                    sub={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} />
                <StatCard label="Entrées du mois" value={entreeMois} icon="📈"
                    color={GREEN} sub={`${stats?.periode.nb_entrees || 0} transaction(s)`} />
                <StatCard label="Sorties du mois" value={sortieMois} icon="📉"
                    color={RED}   sub={`${stats?.periode.nb_sorties || 0} transaction(s)`} />
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

            {/* ══ ONGLET TRANSACTIONS ══════════════════════════════════════════ */}
            {tab === 'transactions' && (
                <>
                    {/* Formulaire */}
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
                                {/* Table desktop */}
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
                                                    {MODES.find(m => m.value === tx.mode_paiement)?.icon}{' '}
                                                    {MODES.find(m => m.value === tx.mode_paiement)?.label || tx.mode_paiement}
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
                                                    const t = transactions.reduce((s, tx) => s + (tx.type === 'entree' ? tx.montant : -tx.montant), 0);
                                                    return <span className={`font-bold text-sm ${t >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{t >= 0 ? '+' : ''}{fmt(t)}</span>;
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
                                                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                                                            {fmtDate(tx.date)} · {MODES.find(m => m.value === tx.mode_paiement)?.label || tx.mode_paiement}
                                                        </p>
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
                                    const maxVal   = stats.topCategories[0]?.total || 1;
                                    const pct      = Math.round((c.total / maxVal) * 100);
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
                                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: isEntree ? GREEN : RED }} />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                     onClick={() => setViewing(null)}>
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
                                { label: 'Type',          value: viewing.type === 'entree' ? '↑ Entrée' : '↓ Sortie' },
                                { label: 'Catégorie',     value: viewing.categorie },
                                { label: 'Date',          value: fmtDate(viewing.date) },
                                { label: 'Mode paiement', value: MODES.find(m => m.value === viewing.mode_paiement)?.label || viewing.mode_paiement },
                                { label: 'Description',   value: viewing.description || null },
                                { label: 'Référence',     value: viewing.reference || null },
                                { label: 'Notes',         value: viewing.notes || null },
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
