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

/* ── Composeur d'email ───────────────────────────────────────────────────────── */
function ComposeModal({ items, selected, onClose }) {
    const [step,       setStep]       = useState('compose'); // compose | preview | sending | done
    const [subject,    setSubject]    = useState('');
    const [body,       setBody]       = useState('');
    const [audience,   setAudience]   = useState(selected.size > 0 ? 'selected' : 'all');
    const [result,     setResult]     = useState(null);
    const [error,      setError]      = useState('');

    const recipientCount = audience === 'all'
        ? items.length
        : audience === 'selected'
            ? selected.size
            : 0;

    const recipientEmails = audience === 'all'
        ? items.map(i => i.email)
        : items.filter(i => selected.has(i._id)).map(i => i.email);

    const handleSend = async () => {
        if (!subject.trim() || !body.trim()) { setError('Sujet et message requis.'); return; }
        setError('');
        setStep('sending');
        try {
            const htmlBody = body
                .split('\n\n')
                .map(para => `<p style="margin:0 0 16px;line-height:1.7;color:#374151;font-size:15px;">${para.replace(/\n/g,'<br>')}</p>`)
                .join('');

            const finalHtml = buildEmailHtml(subject, htmlBody);
            const { data } = await axios.post('/api/admin/newsletter/send-campaign', {
                subject,
                html_body: finalHtml,
                recipients: recipientEmails,
            });
            setResult(data);
            setStep('done');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi.');
            setStep('compose');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] max-h-[92vh] flex flex-col"
                 onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-2xl flex-shrink-0">
                    <div>
                        <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Newsletter</p>
                        <p className="text-base font-semibold text-[#111827]">
                            {step === 'compose' && 'Rédiger un email'}
                            {step === 'preview' && 'Aperçu avant envoi'}
                            {step === 'sending' && 'Envoi en cours…'}
                            {step === 'done'    && 'Email envoyé !'}
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                {/* ── ÉTAPE : Rédaction ── */}
                {step === 'compose' && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-5">

                            {/* Destinataires */}
                            <div>
                                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-2">Destinataires</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setAudience('all')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                                            audience === 'all'
                                                ? 'border-[#C9A84C] bg-[#FDF8EC] text-[#C9A84C]'
                                                : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                                        }`}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                                        Tous les abonnés
                                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#C9A84C]/15 text-[#C9A84C]">{items.length}</span>
                                    </button>
                                    {selected.size > 0 && (
                                        <button type="button" onClick={() => setAudience('selected')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                                                audience === 'selected'
                                                    ? 'border-[#C9A84C] bg-[#FDF8EC] text-[#C9A84C]'
                                                    : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
                                            }`}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                                            Sélectionnés
                                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#C9A84C]/15 text-[#C9A84C]">{selected.size}</span>
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-[#9CA3AF] mt-1.5">
                                    {recipientCount} destinataire{recipientCount > 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Sujet */}
                            <div>
                                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-2">Sujet *</label>
                                <input value={subject} onChange={e => setSubject(e.target.value)}
                                    placeholder="Ex: Nouvelle collection disponible ✨"
                                    className="w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-4 py-3 rounded-xl outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]" />
                            </div>

                            {/* Corps */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Message *</label>
                                    <span className="text-xs text-[#9CA3AF]">Séparez les paragraphes avec une ligne vide</span>
                                </div>
                                <textarea value={body} onChange={e => setBody(e.target.value)}
                                    rows={10}
                                    placeholder={"Bonjour,\n\nNous avons le plaisir de vous annoncer notre nouvelle collection…\n\nMerci de votre fidélité,\nL'équipe MIA DREAMS & CO"}
                                    className="w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-4 py-3 rounded-xl outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF] resize-none font-mono leading-relaxed" />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA] flex items-center gap-3 rounded-b-2xl">
                            <button onClick={() => { if (!subject.trim() || !body.trim()) { setError('Sujet et message requis.'); return; } setError(''); setStep('preview'); }}
                                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl transition-colors"
                                style={{ background: '#C9A84C' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                Aperçu avant envoi
                            </button>
                            <button onClick={onClose}
                                className="px-5 py-3 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ÉTAPE : Aperçu ── */}
                {step === 'preview' && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            {/* Email preview */}
                            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-5">
                                {/* Email header sim */}
                                <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3 space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <span className="font-semibold w-16">De :</span>
                                        <span>MIA DREAMS & CO</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <span className="font-semibold w-16">À :</span>
                                        <span>{recipientCount} abonné{recipientCount > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <span className="font-semibold w-16">Sujet :</span>
                                        <span className="font-medium text-[#111827]">{subject}</span>
                                    </div>
                                </div>
                                {/* Email body preview */}
                                <div className="p-6 bg-white">
                                    <div className="max-w-md mx-auto">
                                        <div className="border-b-2 border-[#C9A84C] pb-4 mb-5">
                                            <p className="text-[10px] tracking-[3px] text-[#C9A84C] uppercase font-bold">MIA DREAMS & CO</p>
                                        </div>
                                        <h2 className="text-xl font-bold text-[#111827] mb-4">{subject}</h2>
                                        {body.split('\n\n').map((para, i) => (
                                            <p key={i} className="text-sm text-[#374151] leading-relaxed mb-4 whitespace-pre-line">{para}</p>
                                        ))}
                                        <div className="border-t border-[#E5E7EB] pt-4 mt-6">
                                            <p className="text-xs text-[#9CA3AF]">Vous recevez cet email car vous êtes abonné à la newsletter MIA DREAMS & CO.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                                <strong>Prêt à envoyer</strong> — {recipientCount} destinataire{recipientCount > 1 ? 's' : ''} recevront cet email.
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA] flex items-center gap-3 rounded-b-2xl">
                            <button onClick={handleSend}
                                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl transition-colors"
                                style={{ background: '#059669' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                                Envoyer maintenant
                            </button>
                            <button onClick={() => setStep('compose')}
                                className="px-5 py-3 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                                Modifier
                            </button>
                        </div>
                    </div>
                )}

                {/* ── ÉTAPE : Envoi en cours ── */}
                {step === 'sending' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 gap-5">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FDF8EC' }}>
                            <svg className="animate-spin w-8 h-8 text-[#C9A84C]" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-base font-semibold text-[#111827] mb-1">Envoi en cours…</p>
                            <p className="text-sm text-[#9CA3AF]">Envoi à {recipientCount} destinataire{recipientCount > 1 ? 's' : ''}. Patientez.</p>
                        </div>
                    </div>
                )}

                {/* ── ÉTAPE : Succès ── */}
                {step === 'done' && result && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6">
                        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#111827] mb-2">Email envoyé !</p>
                            <div className="flex items-center justify-center gap-6 mt-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{result.sent}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Envoyés</p>
                                </div>
                                {result.failed > 0 && (
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-500">{result.failed}</p>
                                        <p className="text-xs text-[#9CA3AF] mt-0.5">Échoués</p>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#374151]">{result.total}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">Total</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
                            style={{ background: '#C9A84C' }}>
                            Fermer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Template email HTML ──────────────────────────────────────────────────────── */
function buildEmailHtml(subject, bodyHtml) {
    return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:32px 36px;text-align:center;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;">MIA DREAMS & CO</p>
      <div style="width:40px;height:2px;background:#C9A84C;margin:0 auto 20px;"></div>
      <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${subject}</h1>
    </div>
    <div style="padding:36px;">
      ${bodyHtml}
      <div style="margin-top:32px;text-align:center;">
        <a href="https://miadreams.netlify.app/boutique" style="display:inline-block;background:#C9A84C;color:#1a1a1a;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:8px;text-decoration:none;">
          VOIR LA BOUTIQUE
        </a>
      </div>
    </div>
    <div style="padding:20px 36px;border-top:1px solid #F0E8D8;text-align:center;background:#FAFAFA;">
      <p style="margin:0 0 6px;font-size:11px;color:#9CA3AF;">MIA DREAMS & CO — Mode Africaine d'Excellence</p>
      <p style="margin:0;font-size:10px;color:#C9A84C;">Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
    </div>
  </div>
</body></html>`;
}

/* ── Page principale ─────────────────────────────────────────────────────────── */
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
    const [compose,    setCompose]    = useState(false);

    const load = () => {
        setLoading(true);
        axios.get('/api/admin/newsletters')
            .then(r => { setItems(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const stats = useMemo(() => {
        const now   = new Date();
        const month = now.getMonth();
        const year  = now.getFullYear();
        const week  = new Date(now); week.setDate(now.getDate() - 7);
        return {
            total:     items.length,
            thisMonth: items.filter(i => { const d = new Date(i.createdAt); return d.getMonth() === month && d.getFullYear() === year; }).length,
            thisWeek:  items.filter(i => new Date(i.createdAt) >= week).length,
        };
    }, [items]);

    const filtered = useMemo(() => {
        if (!search.trim()) return items;
        const q = search.toLowerCase();
        return items.filter(i => i.email.toLowerCase().includes(q));
    }, [items, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const handleSearch = (v) => { setSearch(v); setPage(1); setSelected(new Set()); };

    const allPageSelected = paginated.length > 0 && paginated.every(i => selected.has(i._id));
    const toggleAll = () => {
        if (allPageSelected) setSelected(prev => { const next = new Set(prev); paginated.forEach(i => next.delete(i._id)); return next; });
        else setSelected(prev => { const next = new Set(prev); paginated.forEach(i => next.add(i._id)); return next; });
    };
    const toggleOne = (id) => setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

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

    const handleAdd = async (e) => {
        e.preventDefault();
        setAddError(''); setAddLoading(true);
        try {
            await axios.post('/api/newsletter', { email: addEmail });
            setAddEmail(''); setAddOpen(false); load();
        } catch (err) {
            setAddError(err.response?.data?.errors?.email || 'Erreur lors de l\'ajout.');
        } finally { setAddLoading(false); }
    };

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

    const copyAllEmails = () => {
        navigator.clipboard.writeText(filtered.map(i => i.email).join(', ')).then(() => {
            setCopied('all'); setTimeout(() => setCopied(''), 2000);
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
                    <button onClick={copyAllEmails}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm border ${copied === 'all' ? 'bg-green-50 text-green-700 border-green-200' : 'text-[#374151] bg-white border-[#E5E7EB] hover:bg-[#F9FAFB]'}`}>
                        {copied === 'all'
                            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Copié !</>
                            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier emails</>
                        }
                    </button>
                    <button onClick={exportCSV}
                        className="flex items-center gap-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Exporter CSV
                    </button>
                    <button onClick={() => { setAddOpen(true); setAddEmail(''); setAddError(''); }}
                        className="flex items-center gap-2 text-sm font-medium text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Ajouter
                    </button>
                    {/* Bouton principal : Envoyer un email */}
                    <button onClick={() => setCompose(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                        style={{ background: '#C9A84C' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Envoyer un email
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total abonnés"  value={stats.total}     sub="depuis le début" />
                <StatCard label="Ce mois-ci"     value={stats.thisMonth} sub="nouveaux abonnés"  color="#059669" />
                <StatCard label="Cette semaine"  value={stats.thisWeek}  sub="7 derniers jours"  color="#3B82F6" />
            </div>

            {/* Barre de recherche + actions masse */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input value={search} onChange={e => handleSearch(e.target.value)}
                        placeholder="Rechercher par email…"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#374151] placeholder-[#9CA3AF] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors" />
                    {search && (
                        <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    )}
                </div>
                <span className="text-sm text-[#9CA3AF] whitespace-nowrap">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>

                {selected.size > 0 && (
                    <div className="flex items-center gap-2 bg-[#FDF8EC] border border-[#C9A84C]/30 rounded-lg px-3 py-2">
                        <span className="text-xs font-semibold text-[#C9A84C]">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
                        <button onClick={() => setCompose(true)}
                            className="text-xs font-medium text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] px-2.5 py-1 rounded-lg transition-colors">
                            ✉ Envoyer
                        </button>
                        <button onClick={handleBulkDelete}
                            className="text-xs font-medium text-[#DC2626] hover:underline">
                            Supprimer
                        </button>
                        <button onClick={() => setSelected(new Set())} className="text-xs text-[#9CA3AF] hover:text-[#374151]">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                        <p className="text-sm text-[#6B7280]">{search ? 'Aucun résultat' : 'Aucun abonné'}</p>
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
                                    <th className="text-left px-4 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Inscription</th>
                                    <th className="text-right px-4 py-3.5 bg-[#F9FAFB] w-32" />
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
                                                    <span className="text-xs font-bold text-[#C9A84C] uppercase">{item.email[0]}</span>
                                                </div>
                                                <span className="text-sm font-medium text-[#111827]">{item.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-[#9CA3AF] hidden sm:table-cell">{fmt(item.createdAt)}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-1">
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
                                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
                                        .reduce((acc, p, idx, arr) => { if (idx > 0 && arr[idx-1] !== p-1) acc.push('…'); acc.push(p); return acc; }, [])
                                        .map((p, i) => p === '…'
                                            ? <span key={`e${i}`} className="px-1 text-xs text-[#9CA3AF]">…</span>
                                            : <button key={p} onClick={() => setPage(p)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'text-white shadow-sm' : 'border border-[#E5E7EB] text-[#374151] hover:bg-white'}`}
                                                style={p === page ? { background: '#C9A84C' } : {}}>
                                                {p}
                                              </button>
                                        )}
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

            {/* Modal composeur */}
            {compose && (
                <ComposeModal items={items} selected={selected} onClose={() => setCompose(false)} />
            )}

            {/* Modal ajouter */}
            {addOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                     onClick={() => setAddOpen(false)}>
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E5E7EB]"
                         onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-2xl">
                            <p className="text-base font-semibold text-[#111827]">Ajouter un abonné</p>
                            <button onClick={() => setAddOpen(false)} className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white py-2.5 rounded-xl disabled:opacity-50"
                                    style={{ background: '#C9A84C' }}>
                                    {addLoading ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/></svg> : 'Ajouter'}
                                </button>
                                <button type="button" onClick={() => setAddOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
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
