import { useEffect, useState } from 'react';
import axios from 'axios';
import CrudPage from './_CrudPage';
import { imgSrc } from '../../utils/imgSrc';

const fields = [
    { name: 'name',        label: 'Titre du rapport *',  type: 'text', required: true },
    { name: 'period',      label: 'Période (ex. 2024)',  type: 'text' },
    { name: 'description', label: 'Description',          type: 'textarea' },
    { name: 'cover_image', label: 'Image de couverture', type: 'file', accept: 'image/*' },
    { name: 'pdf_path',    label: 'Fichier PDF',         type: 'file', accept: '.pdf,application/pdf', isPdf: true },
];

function StatsPanel() {
    const [data, setData] = useState(null);
    const [tab, setTab]   = useState('overview'); // overview | history

    useEffect(() => {
        axios.get('/api/admin/rapports-downloads')
            .then(r => setData(r.data))
            .catch(() => setData({ downloads: [], rapports: [] }));
    }, []);

    if (!data) return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6 text-center text-sm text-[#9CA3AF]">
            Chargement des statistiques…
        </div>
    );

    const { downloads, rapports } = data;
    const total = downloads.length;

    // Top rapport par téléchargements
    const sorted = [...rapports].sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl mb-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
                <div>
                    <h2 className="text-base font-semibold text-[#111827]">Téléchargements des rapports</h2>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{total} téléchargement{total !== 1 ? 's' : ''} · e-mails professionnels collectés</p>
                </div>
                <div className="flex gap-1 bg-[#F9FAFB] p-1 rounded-lg border border-[#E5E7EB]">
                    <button onClick={() => setTab('overview')}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${tab === 'overview' ? 'bg-white text-[#C9A84C] shadow-sm border border-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#374151]'}`}>
                        Vue d'ensemble
                    </button>
                    <button onClick={() => setTab('history')}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${tab === 'history' ? 'bg-white text-[#C9A84C] shadow-sm border border-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#374151]'}`}>
                        Historique détaillé
                    </button>
                </div>
            </div>

            {tab === 'overview' && (
                <div className="p-6">
                    {sorted.length === 0 ? (
                        <p className="text-sm text-[#9CA3AF] text-center py-4">Aucun téléchargement enregistré pour l'instant.</p>
                    ) : (
                        <div className="space-y-4">
                            {sorted.map((rap, i) => {
                                const count = rap.downloads_count || 0;
                                const max   = sorted[0]?.downloads_count || 1;
                                const pct   = Math.round((count / max) * 100);
                                return (
                                    <div key={rap._id} className="flex items-center gap-4">
                                        {/* Rang */}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-[#C9A84C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                            {i + 1}
                                        </div>
                                        {/* Cover */}
                                        {rap.cover_image
                                            ? <img src={imgSrc(rap.cover_image)} className="w-10 h-10 object-cover rounded flex-shrink-0 border border-[#E5E7EB]" alt="" />
                                            : <div className="w-10 h-10 bg-[#F3F4F6] rounded flex-shrink-0 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                              </div>
                                        }
                                        {/* Barre + nom */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-[#374151] truncate pr-2">{rap.name}</span>
                                                <span className={`text-sm font-bold flex-shrink-0 ${i === 0 ? 'text-[#C9A84C]' : 'text-[#6B7280]'}`}>{count}</span>
                                            </div>
                                            <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full transition-all ${i === 0 ? 'bg-[#C9A84C]' : 'bg-[#D1D5DB]'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {tab === 'history' && (
                <div className="overflow-x-auto">
                    {downloads.length === 0 ? (
                        <p className="text-sm text-[#9CA3AF] text-center py-8">Aucun téléchargement enregistré pour l'instant.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F9FAFB] border-b border-[#F3F4F6]">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">E-mail professionnel</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Rapport</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {downloads.map(d => (
                                    <tr key={d._id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-3 text-[#374151] font-medium">{d.email}</td>
                                        <td className="px-6 py-3 text-[#6B7280]">{d.rapport_name}</td>
                                        <td className="px-6 py-3 text-[#9CA3AF] text-xs">
                                            {new Date(d.downloaded_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminRapports() {
    return (
        <div>
            <StatsPanel />
            <CrudPage title="Rapports d'activité" apiPath="rapports" fields={fields} imageFields={['cover_image']} pdfFields={['pdf_path']} pdfDownloadApiPath="rapports" hideHeader />
        </div>
    );
}
