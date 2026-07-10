import { useEffect, useState } from 'react';
import axios from 'axios';
import CrudPage from './_CrudPage';
import { imgSrc } from '../../utils/imgSrc';

const fields = [
    { name: 'name',        label: 'Nom *',              type: 'text', required: true },
    { name: 'description', label: 'Description',         type: 'textarea' },
    { name: 'cover_image', label: 'Image de couverture', type: 'file', accept: 'image/*' },
    { name: 'pdf_path',    label: 'Fichier PDF',         type: 'file', accept: '.pdf,application/pdf', isPdf: true },
];

function StatsPanel() {
    const [data, setData] = useState(null);
    const [tab, setTab]   = useState('overview'); // overview | history

    useEffect(() => {
        axios.get('/api/admin/catalogues-downloads')
            .then(r => setData(r.data))
            .catch(() => setData({ downloads: [], catalogues: [] }));
    }, []);

    if (!data) return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6 text-center text-sm text-[#9CA3AF]">
            Chargement des statistiques…
        </div>
    );

    const { downloads, catalogues } = data;
    const total = downloads.length;

    // Top catalogue par téléchargements
    const sorted = [...catalogues].sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl mb-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
                <div>
                    <h2 className="text-base font-semibold text-[#111827]">Historique des téléchargements</h2>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{total} téléchargement{total !== 1 ? 's' : ''} au total</p>
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
                            {sorted.map((cat, i) => {
                                const count = cat.downloads_count || 0;
                                const max   = sorted[0]?.downloads_count || 1;
                                const pct   = Math.round((count / max) * 100);
                                return (
                                    <div key={cat._id} className="flex items-center gap-4">
                                        {/* Rang */}
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-[#C9A84C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                                            {i + 1}
                                        </div>
                                        {/* Cover */}
                                        {cat.cover_image
                                            ? <img src={imgSrc(cat.cover_image)} className="w-10 h-10 object-cover rounded flex-shrink-0 border border-[#E5E7EB]" alt="" />
                                            : <div className="w-10 h-10 bg-[#F3F4F6] rounded flex-shrink-0 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                                </svg>
                                              </div>
                                        }
                                        {/* Barre + nom */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-[#374151] truncate pr-2">{cat.name}</span>
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
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Nom complet</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">WhatsApp</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Ville</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Pays</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Profession</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Raisons</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">Catalogue</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {downloads.map(d => (
                                    <tr key={d._id} className="hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-4 py-3 text-[#374151] font-medium whitespace-nowrap">
                                            {[d.prenom, d.nom].filter(Boolean).join(' ') || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[#374151]">
                                            <a href={`mailto:${d.email}`} className="hover:text-[#C9A84C] transition-colors">{d.email}</a>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {d.whatsapp
                                                ? <a href={`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                                                     className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                                                     style={{ background: '#25D36615', color: '#25D366', border: '1px solid #25D36630' }}
                                                     onMouseEnter={e => e.currentTarget.style.background='#25D36625'}
                                                     onMouseLeave={e => e.currentTarget.style.background='#25D36615'}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                    </svg>
                                                    {d.whatsapp}
                                                </a>
                                                : <span className="text-[#D1D5DB]">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-[#6B7280]">{d.ville || '—'}</td>
                                        <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{d.pays || '—'}</td>
                                        <td className="px-4 py-3 text-[#6B7280]">{d.profession || '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                {(d.raisons || []).length > 0
                                                    ? d.raisons.map(r => (
                                                        <span key={r} className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">{r}</span>
                                                    ))
                                                    : <span className="text-[#D1D5DB]">—</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{d.catalogue_name}</td>
                                        <td className="px-4 py-3 text-[#9CA3AF] text-xs whitespace-nowrap">
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

export default function AdminCatalogues() {
    return (
        <div>
            <StatsPanel />
            <CrudPage title="Catalogues" apiPath="catalogues" fields={fields} imageFields={['cover_image']} pdfFields={['pdf_path']} pdfDownloadApiPath="catalogues" hideHeader />
        </div>
    );
}
