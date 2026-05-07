import { useEffect, useState } from 'react';
import axios from 'axios';

const inputCls = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 mb-5">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-widest">{title}</span>
                <div className="flex-1 h-px bg-[#F3F4F6]" />
            </div>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>
            {children}
        </div>
    );
}

export default function AdminSettings() {
    const [company, setCompany] = useState({ name: '', tagline: '', email: '', phone: '', address: '', whatsapp: '' });
    const [social, setSocial]   = useState([]);
    const [logo, setLogo]       = useState(null);
    const [saving, setSaving]   = useState(false);
    const [saved, setSaved]     = useState(false);

    useEffect(() => {
        axios.get('/api/admin/company-info').then(r => { if (r.data) setCompany(r.data); }).catch(() => {});
        axios.get('/api/admin/social-media').then(r => setSocial(r.data)).catch(() => {});
    }, []);

    const saveCompany = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(company).forEach(([k, v]) => { if (v && k !== '_id' && k !== '__v') fd.append(k, v); });
            if (logo) fd.append('logo', logo);
            await axios.put('/api/admin/company-info', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch { } finally { setSaving(false); }
    };

    const updateSocial = (id, field, value) => setSocial(p => p.map(s => s._id === id ? { ...s, [field]: value } : s));
    const saveSocial   = async (item) => { await axios.put(`/api/admin/social-media/${item._id}`, item).catch(() => {}); };
    const addSocial    = async () => {
        const r = await axios.post('/api/admin/social-media', { platform: 'Instagram', url: '', order: social.length }).catch(() => null);
        if (r) setSocial(p => [...p, r.data]);
    };
    const deleteSocial = async (id) => {
        await axios.delete(`/api/admin/social-media/${id}`).catch(() => {});
        setSocial(p => p.filter(s => s._id !== id));
    };

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Configuration</p>
                <h1 className="text-2xl font-semibold text-[#111827]">Paramètres</h1>
            </div>

            {/* Company info */}
            <Section title="Informations de l'entreprise">
                <form onSubmit={saveCompany} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nom de l'entreprise">
                        <input className={inputCls} value={company.name || ''} onChange={e => setCompany(p => ({ ...p, name: e.target.value }))} placeholder="MIA DREAMS & CO" />
                    </Field>
                    <Field label="Slogan">
                        <input className={inputCls} value={company.tagline || ''} onChange={e => setCompany(p => ({ ...p, tagline: e.target.value }))} placeholder="Mode Africaine d'Excellence" />
                    </Field>
                    <Field label="Email de contact">
                        <input type="email" className={inputCls} value={company.email || ''} onChange={e => setCompany(p => ({ ...p, email: e.target.value }))} placeholder="contact@miadreams.com" />
                    </Field>
                    <Field label="Téléphone">
                        <input className={inputCls} value={company.phone || ''} onChange={e => setCompany(p => ({ ...p, phone: e.target.value }))} placeholder="+221 77 000 00 00" />
                    </Field>
                    <Field label="WhatsApp">
                        <input className={inputCls} value={company.whatsapp || ''} onChange={e => setCompany(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+221 77 000 00 00" />
                    </Field>
                    <Field label="Adresse">
                        <input className={inputCls} value={company.address || ''} onChange={e => setCompany(p => ({ ...p, address: e.target.value }))} placeholder="Dakar, Sénégal" />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Logo (PNG transparent recommandé)">
                            <input type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])}
                                className="w-full text-sm text-[#374151] file:mr-3 file:border-0 file:bg-[#FDF8EC] file:text-[#C9A84C] file:text-xs file:font-medium file:px-3 file:py-2 file:rounded-lg cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white" />
                            {company.logo && (
                                <p className="text-xs text-[#9CA3AF] mt-1.5">Logo actuel : {company.logo}</p>
                            )}
                        </Field>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-4 pt-4 border-t border-[#F3F4F6]">
                        <button type="submit" disabled={saving}
                            className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                            {saving ? 'Enregistrement…' : 'Enregistrer'}
                        </button>
                        {saved && (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                Sauvegardé !
                            </span>
                        )}
                    </div>
                </form>
            </Section>

            {/* Social media */}
            <Section title="Réseaux sociaux">
                <div className="space-y-3 mb-4">
                    {social.map(s => (
                        <div key={s._id} className="grid grid-cols-[160px_1fr_auto] gap-3 items-center">
                            <select value={s.platform || ''} onChange={e => updateSocial(s._id, 'platform', e.target.value)}
                                onBlur={() => saveSocial(s)}
                                className={inputCls}>
                                {['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter/X', 'Pinterest'].map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <input value={s.url || ''} placeholder="https://…"
                                onChange={e => updateSocial(s._id, 'url', e.target.value)}
                                onBlur={() => saveSocial(s)}
                                className={inputCls} />
                            <button onClick={() => deleteSocial(s._id)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors border border-red-200">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={addSocial}
                    className="flex items-center gap-2 text-sm font-medium text-[#C9A84C] hover:text-[#B8973B] border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 bg-[#FDF8EC] px-4 py-2 rounded-lg transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Ajouter un réseau
                </button>
            </Section>
        </div>
    );
}
