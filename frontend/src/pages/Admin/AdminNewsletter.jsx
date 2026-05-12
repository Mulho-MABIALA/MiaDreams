import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNewsletter() {
    const [items, setItems] = useState([]);
    const [viewing, setViewing] = useState(null);

    useEffect(() => {
        axios.get('/api/admin/newsletters').then(r => setItems(r.data)).catch(() => {});
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ?')) return;
        await axios.delete(`/api/admin/newsletters/${id}`).catch(() => {});
        setItems(p => p.filter(i => i._id !== id));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Gestion</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Newsletter</h1>
                </div>
                <div className="bg-[#FDF8EC] border border-[#C9A84C]/30 px-5 py-2.5 rounded-xl">
                    <span className="text-sm font-semibold text-[#C9A84C]">
                        {items.length} abonné{items.length > 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {items.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">Aucun abonné</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email</th>
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Date d'inscription</th>
                                <th className="text-right px-5 py-3.5 bg-[#F9FAFB] w-24" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                            {items.map((item) => (
                                <tr key={item._id} className="hover:bg-[#F9FAFB] transition-colors">
                                    <td className="px-5 py-4 text-sm font-medium text-[#111827]">{item.email}</td>
                                    <td className="px-5 py-4 text-sm text-[#9CA3AF] hidden sm:table-cell">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setViewing(item)}
                                                className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                                                style={{ background: '#C9A84C' }}>
                                                Voir
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

            {/* ── Modal abonné ── */}
            {viewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setViewing(null)}>
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB]"
                         onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                            <div>
                                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Abonné newsletter</p>
                                <p className="text-base font-semibold text-[#111827]">{viewing.email}</p>
                            </div>
                            <button onClick={() => setViewing(null)}
                                className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col gap-1 py-2 border-b border-[#F3F4F6]">
                                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Email</span>
                                <span className="text-sm text-[#374151]">{viewing.email}</span>
                            </div>
                            <div className="flex flex-col gap-1 py-2 border-b border-[#F3F4F6]">
                                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Date d'inscription</span>
                                <span className="text-sm text-[#374151]">
                                    {viewing.createdAt
                                        ? new Date(viewing.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                        : '—'}
                                </span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <a href={`mailto:${viewing.email}`}
                                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90 shadow-sm text-white"
                                    style={{ background: '#C9A84C' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    Envoyer un email
                                </a>
                                <button onClick={() => { navigator.clipboard.writeText(viewing.email); }}
                                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                                    Copier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
