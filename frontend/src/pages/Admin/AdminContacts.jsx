import { useEffect, useState } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';

function timeAgo(d) {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'À l\'instant';
    if (mins < 60) return `il y a ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `il y a ${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7)  return `il y a ${days}j`;
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function AdminContacts() {
    const [items, setItems]       = useState([]);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter]     = useState('all');

    const load = () => axios.get('/api/admin/contacts').then(r => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const markRead = async (item) => {
        if (item.is_read) return;
        await axios.put(`/api/admin/contacts/${item._id}`, { is_read: true }).catch(() => {});
        setItems(prev => prev.map(i => i._id === item._id ? { ...i, is_read: true } : i));
    };

    const handleSelect = (item) => {
        setSelected(item);
        markRead(item);
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (!confirm('Supprimer ce message définitivement ?')) return;
        await axios.delete(`/api/admin/contacts/${id}`).catch(() => {});
        setItems(prev => prev.filter(i => i._id !== id));
        if (selected?._id === id) setSelected(null);
    };

    const unread   = items.filter(i => !i.is_read).length;
    const filtered = filter === 'unread' ? items.filter(i => !i.is_read) : items;

    const buildWa = (item) => {
        const raw = (item.phone || '').replace(/\D/g, '');
        if (!raw) return null;
        const phone = raw.startsWith('221') ? raw : `221${raw}`;
        const text = encodeURIComponent(`Bonjour ${item.name} ! 👋\n\nMerci pour votre message concernant "${item.subject}".\n\n`);
        return `https://wa.me/${phone}?text=${text}`;
    };
    const buildMail = (item) => {
        const sub  = encodeURIComponent(`Re: ${item.subject} — MIA DREAMS & CO`);
        const body = encodeURIComponent(`Bonjour ${item.name},\n\nMerci pour votre message.\n\nCordialement,\nMIA DREAMS & CO`);
        return `mailto:${item.email}?subject=${sub}&body=${body}`;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Gestion</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Messages</h1>
                </div>
                {unread > 0 && (
                    <div className="flex items-center gap-2 bg-[#FDF8EC] border border-[#C9A84C]/30 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
                        <span className="text-sm font-semibold text-[#C9A84C]">{unread} non lu{unread > 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* Filtres */}
            <div className="flex gap-1 mb-4 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {[
                    { key: 'all',    label: 'Tous', count: items.length },
                    { key: 'unread', label: 'Non lus', count: unread },
                ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                            filter === f.key ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'
                        }`}>
                        {f.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === f.key ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-white text-[#6B7280]'}`}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Layout 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 flex-1 min-h-0">

                {/* Liste */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center flex-1 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </div>
                            <p className="text-sm text-[#6B7280]">Aucun message</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F3F4F6] overflow-y-auto flex-1">
                            {filtered.map((item) => (
                                <div key={item._id}
                                     onClick={() => handleSelect(item)}
                                     className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all hover:bg-[#F9FAFB] ${
                                         selected?._id === item._id
                                             ? 'bg-[#FDF8EC] border-l-2 border-l-[#C9A84C]'
                                             : 'border-l-2 border-l-transparent'
                                     }`} role="button" aria-label={`Voir le message de ${item.name}`}>

                                    {/* Dot non-lu */}
                                    <div className="flex-shrink-0 mt-2">
                                        {!item.is_read
                                            ? <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
                                            : <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm truncate ${item.is_read ? 'font-normal text-[#374151]' : 'font-semibold text-[#111827]'}`}>
                                                {item.name}
                                            </p>
                                            <span className="text-xs text-[#9CA3AF] flex-shrink-0">{timeAgo(item.createdAt)}</span>
                                        </div>
                                        {item.subject && (
                                            <p className="text-xs font-medium truncate mt-0.5 text-[#C9A84C]">{item.subject}</p>
                                        )}
                                        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                                            {item.message?.slice(0, 55)}{item.message?.length > 55 ? '…' : ''}
                                        </p>
                                        <span className="inline-block mt-2 text-xs font-semibold text-white px-2.5 py-1 rounded-md"
                                            style={{ background: '#C9A84C' }}>
                                            Voir
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Détail */}
                {selected ? (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">

                        {/* En-tête message */}
                        <div className="flex items-start justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                            <div>
                                <p className="text-base font-semibold text-[#111827]">{selected.name}</p>
                                <p className="text-sm text-[#6B7280] mt-0.5">{selected.email}</p>
                                {selected.phone && <p className="text-sm text-[#9CA3AF]">{selected.phone}</p>}
                                <p className="text-xs text-[#9CA3AF] mt-1">
                                    {new Date(selected.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <button onClick={(e) => handleDelete(selected._id, e)}
                                className="flex items-center gap-1.5 text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-red-200 px-3 py-2 rounded-lg transition-colors">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                Supprimer
                            </button>
                        </div>

                        {/* Sujet */}
                        {selected.subject && (
                            <div className="px-6 py-3 border-b border-[#E5E7EB] bg-[#FDF8EC]">
                                <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">Sujet : </span>
                                <span className="text-sm text-[#374151]">{selected.subject}</span>
                            </div>
                        )}

                        {/* Corps */}
                        <div className="px-6 py-5 flex-1">
                            <p className="text-sm text-[#374151] leading-loose whitespace-pre-wrap">{selected.message}</p>
                        </div>

                        {/* Actions réponse */}
                        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Répondre via</p>
                            <div className="flex gap-2 flex-wrap">
                                {/* Email */}
                                <a href={buildMail(selected)}
                                    className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-sm"
                                    style={{ background: GOLD, color: '#fff' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    Répondre par email
                                </a>

                                {/* WhatsApp */}
                                {buildWa(selected) && (
                                    <a href={buildWa(selected)} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.109 1.517 5.834L0 24l6.335-1.484A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 01-5.071-1.385l-.369-.221-3.762.881.936-3.672-.242-.381A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                                        WhatsApp
                                    </a>
                                )}

                                {/* Copier email */}
                                <button
                                    onClick={() => { navigator.clipboard.writeText(selected.email); }}
                                    title="Copier l'adresse email"
                                    className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                                    Copier email
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col items-center justify-center py-24">
                        <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center mb-4">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">Sélectionnez un message</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Cliquez sur un message pour le lire</p>
                    </div>
                )}
            </div>
        </div>
    );
}
