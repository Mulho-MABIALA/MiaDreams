import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNewsletter() {
    const [items, setItems] = useState([]);

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
                                        <button onClick={() => handleDelete(item._id)}
                                            className="text-xs font-medium text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors">
                                            Supprimer
                                        </button>
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
