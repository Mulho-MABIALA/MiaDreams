import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const PAGE_SIZE = 20;

function StatCard({ label, value, sub, color = '#C9A84C' }) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-5">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">{label}</p>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            {sub && <p className="text-xs text-[#9CA3AF] mt-1">{sub}</p>}
        </div>
    );
}

function CopiedBadge({ show }) {
    if (!show) return null;
    return (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[10px] px-2.5 py-1 rounded-lg whitespace-nowrap">
            Copié !
        </span>
    );
}

export default function AdminNewsletter() {
    const [items,      setItems]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [search,     setSearch]     = useState('');
    const [page,       setPage]       = useState(1);
    const [selected,   setSelected]   = useState(new Set());
    const [addEmail,   setAddEmail]   = useState('');
    const [addOpen,    setAddOpen]    = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError,   setAddError]   = useState('');
    const [copied,     setCopied]     = useState('');

    const load = () => {
        setLoading(true);
        axios.get('/api/admin/newsletters')
            .then(r => { setItems(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const now   = new Date();
        const month = now.getMonth();
        const year  = now.getFullYear();
        const week  = new Date(now); week.setDate(now.getDate() - 7);

        const thisMonth = items.filter(i => {
            const d = new Date(i.createdAt);
            return d.getMonth() === month && d.getFullYear() === year;
        }).length;

        const thisWeek = items.filter(i => new Date(i.createdAt) >= week).length;

        return { total: items.length, thisMonth, thisWeek };
    }, [items]);

    // ── Filtrage + pagination ─────────────────────────────────────────────────
    const filtered = useMemo(() => {
        if (!search.trim()) return items;
        const q = search.toLowerCase();
        return items.filter(i => i.email.toLowerCase().includes(q));
    }, [items, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (v) => { setSearch(v); setPage(1); setSelected(new Set()); };

    // ── Sélection ─────────────────────────────────────────────────────────────
    const allPageSelected = paginated.length > 0 && paginated.every(i => selected.has(i._id));
    const toggleAll = () => {
        if (allPageSelected) {
            setSelected(prev => { const next = new Set(prev); paginated.forEach(i => next.delete(i._id)); return next; });
        } else {
            setSelected(prev => { const next = new Set(prev); paginated.forEach(i => next.add(i._id)); return next; });
        }
    };
    const toggleOne = (id) => {
        setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    };

    // ── Suppression ───────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet abonné ?')) return;
        await axios.delete(`/api/admin/newsletters/${id}`).catch(() => {});
        setItems(p => p.filter(i => i._id !== id));
        setSelected(prev => { const next = new Set(prev); next.delete(id); return next; });
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Supprimer ${selected.size} abonné(s) ?`)) return;
        await Promise.all([...selected].map(id => axios.delete(`/api/admin/newsletters/${id}`).catch(() => {})));
        setItems(p => p.filter(i => !selected.has(i._id)));
        setSelected(new Set());
    };

    // ── Ajout manuel ──────────────────────────────────────────────────────────
    const handleAdd = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddLoading(true);
        try {
            await axios.post('/api/newsletter', { email: addEmail });
            setAddEmail('');
            setAddOpen(false);
            load();
        } catch (err) {
            setAddError(err.response?.data?.errors?.email || 'Erreur lors de l\'ajout.');
        } finally { setAddLoading(false); }
    };

    // ── Export CSV ────────────────────────────────────────────────────────────
    const exportCSV = () => {
        const rows = ['Email,Date inscription', ...filtered.map(i =>
            `${i.email},${i.createdAt ? new Date(i.createdAt).toLocaleDateString('fr-FR') : ''}`
        )];
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `newsletter_${new Date().toISOString().slice(0,10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    // ── Copier emails ─────────────────────────────────────────────────────────
    const copyEmails = (list, key) => {
        navigator.clipboard.writeText(list.map(i => i.email).join(', ')).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(''), 2000);
        });
    };

    const fmt = (iso) => iso
        ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <svg className="animate-spin w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
            </svg>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Gestion</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Newsletter</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Copier tous les emails */}
                    <div className="relative">
                        <button onClick={() => copyEmails(filtered, 'all')}
                            className="flex items-center gap-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                            </svg>
                            Copier tous les emails
                        </button>
                        <CopiedBadge show={copied === 'all'} />
                    </div>
                    {/* Export CSV */}
                    <button onClick={exportCSV}
                        className="flex items-center gap-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Exporter CSV
                    </button>
                    {/* Ajouter */}
                    <button onClick={() => { setAddOpen(true); setAddEmail(''); setAddError(''); }}
                        className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                        style={{ background: '#C9A84C' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Ajouter un email
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total abonnés" value={stats.total} sub="depuis le début" />
                <StatCard label="Ce mois-ci" value={stats.thisMonth} sub="nouveaux abonnés" color="#059669" />
                <StatCard label="Cette semaine" value={stats.thisWeek} sub="7 derniers jours" color="#3B82F6" />
            </div>

            {/* Barre d'actions */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Recherche */}
                <div className="relative flex-1 min-w-[200px]">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input value={search} onChange={e => handleSearch(e.target.value)}
                        placeholder="Rechercher par email…"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#374151] placeholder-[#9CA3AF] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors" />
                    {search && (
                        <button onClick={() => handleSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Info résultats */}
                <span className="text-sm text-[#9CA3AF] whitespace-nowrap">
                    {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                    {search && ` pour "${search}"`}
                </span>

                {/* Sélection en masse */}
                {selected.size > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <span className="text-xs font-semibold text-red-700">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
                        <button onClick={handleBulkDelete}
                            className="text-xs font-medium text-[#DC2626] hover:text-red-800 underline underline-offset-2">
                            Supprimer
                        </button>
                        <button onClick={() => setSelected(new Set())}
                            className="text-xs text-red-400 hover:text-red-600">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">{search ? 'Aucun résultat trouvé' : 'Aucun abonné'}</p>
                        {search && <button onClick={() => handleSearch('')} className="text-xs text-[#C9A84C] mt-1 hover:underline">Effacer la recherche</button>}
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    <th className="px-4 py-3.5 bg-[#F9FAFB] w-10">
                                        <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                                            className="w-4 h-4 accent-[#C9A84C] rounded cursor-pointer" />
                                    </th>
                                    <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email</th>
                                    <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Date d'inscription</th>
                                    <th className="text-right px-4 py-3.5 bg-[#F9FAFB] w-28" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {paginated.map((item) => (
                                    <tr key={item._id}
                                        className={`hover:bg-[#F9FAFB] transition-colors ${selected.has(item._id) ? 'bg-[#FDF8EC]' : ''}`}>
                                        <td className="px-4 py-3.5">
                                            <input type="checkbox" checked={selected.has(item._id)} onChange={() => toggleOne(item._id)}
                                                className="w-4 h-4 accent-[#C9A84C] rounded cursor-pointer" />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-[#FDF8EC] border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-[#C9A84C] uppercase">
                                                        {item.email[0]}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-[#111827]">{item.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-[#9CA3AF] hidden sm:table-cell">{fmt(item.createdAt)}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <a href={`mailto:${item.email}`} title="Envoyer un email"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#C9A84C] hover:bg-[#FDF8EC] transition-colors">
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                        <polyline points="22,6 12,13 2,6"/>
                                                    </svg>
                                                </a>
                                                <button onClick={() => { navigator.clipboard.writeText(item.email); setCopied(item._id); setTimeout(() => setCopied(''), 2000); }}
                                                    title="Copier l'email"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] transition-colors">
                                                    {copied === item._id
                                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                                        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                                                    }
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} title="Supprimer"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F3F4F6] bg-[#F9FAFB]">
                                <span className="text-xs text-[#9CA3AF]">
                                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                        .reduce((acc, p, idx, arr) => {
                                            if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, i) => p === '…'
                                            ? <span key={`e${i}`} className="px-1 text-xs text-[#9CA3AF]">…</span>
                                            : <button key={p} onClick={() => setPage(p)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                                                    p === page
                                                        ? 'text-white shadow-sm'
                                                        : 'border border-[#E5E7EB] text-[#374151] hover:bg-white'
                                                }`}
                                                style={p === page ? { background: '#C9A84C' } : {}}>
                                                {p}
                                            </button>
                                        )
                                    }
                                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Modale Ajouter un email ── */}
            {addOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                     onClick={() => setAddOpen(false)}>
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E5E7EB]"
                         onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-2xl">
                            <div>
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Newsletter</p>
                                <p className="text-base font-semibold text-[#111827]">Ajouter un abonné</p>
                            </div>
                            <button onClick={() => setAddOpen(false)}
                                className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#374151] mb-1.5">Adresse email *</label>
                                <input type="email" required value={addEmail}
                                    onChange={e => { setAddEmail(e.target.value); setAddError(''); }}
                                    placeholder="exemple@email.com"
                                    className="w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]"
                                    autoFocus />
                                {addError && <p className="text-xs text-red-500 mt-1.5">{addError}</p>}
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={addLoading}
                                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                                    style={{ background: '#C9A84C' }}>
                                    {addLoading
                                        ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/></svg>
                                        : 'Ajouter'}
                                </button>
                                <button type="button" onClick={() => setAddOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
