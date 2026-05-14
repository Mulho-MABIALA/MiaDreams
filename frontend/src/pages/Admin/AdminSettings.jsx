import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

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

function Field({ label, hint, children }) {
    return (
        <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>
            {children}
            {hint && <p className="text-[11px] text-[#9CA3AF] mt-1">{hint}</p>}
        </div>
    );
}

const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter/X', 'Pinterest', 'Snapchat'];

export default function AdminSettings() {
    const [company, setCompany]     = useState({ name: '', tagline: '', email: '', phone: '', whatsapp: '', address: '' });
    const [social, setSocial]       = useState([]);
    const [logoFile, setLogoFile]   = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [saving, setSaving]       = useState(false);
    const [saved, setSaved]         = useState(false);
    const [error, setError]         = useState('');
    const [savingId, setSavingId]   = useState(null);
    const [loading, setLoading]     = useState(true);
    const fileRef = useRef();

    const fetchData = async (attempt = 0) => {
        try {
            const [ci, sm] = await Promise.all([
                axios.get('/api/admin/company-info', { timeout: 10000 }),
                axios.get('/api/admin/social-media',  { timeout: 10000 }),
            ]);
            if (ci.data && Object.keys(ci.data).length) setCompany(ci.data);
            setSocial(sm.data || []);
            setLoading(false);
        } catch {
            if (attempt < 8) {
                setTimeout(() => fetchData(attempt + 1), 6000);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Prévisualisation logo sélectionné
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = ev => setLogoPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const saveCompany = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const fd = new FormData();
            // Envoyer tous les champs non vides
            ['name', 'tagline', 'email', 'phone', 'whatsapp', 'address'].forEach(k => {
                if (company[k] !== undefined && company[k] !== null) fd.append(k, company[k]);
            });
            if (logoFile) fd.append('logo', logoFile);

            const { data } = await axios.put('/api/admin/company-info', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Met à jour le logo actuel si un nouveau a été uploadé
            if (data.logo) setCompany(p => ({ ...p, logo: data.logo }));
            setLogoFile(null);
            setLogoPreview(null);
            if (fileRef.current) fileRef.current.value = '';
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally { setSaving(false); }
    };

    // ── Réseaux sociaux ─────────────────────────────────────────────────────────
    const updateSocial = (id, field, value) =>
        setSocial(p => p.map(s => s._id === id ? { ...s, [field]: value } : s));

    const saveSocial = async (item) => {
        setSavingId(item._id);
        try { await axios.put(`/api/admin/social-media/${item._id}`, item); }
        catch { /* silencieux */ }
        finally { setSavingId(null); }
    };

    const addSocial = async () => {
        try {
            const r = await axios.post('/api/admin/social-media', {
                platform: 'Instagram', url: '', order: social.length,
            });
            setSocial(p => [...p, r.data]);
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'ajout');
        }
    };

    const deleteSocial = async (id) => {
        if (!confirm('Supprimer ce réseau ?')) return;
        await axios.delete(`/api/admin/social-media/${id}`).catch(() => {});
        setSocial(p => p.filter(s => s._id !== id));
    };

    // Icônes réseaux
    const ICONS = {
        Instagram: '📸', Facebook: '👤', TikTok: '🎵', YouTube: '▶️',
        LinkedIn: '💼', 'Twitter/X': '🐦', Pinterest: '📌', Snapchat: '👻',
    };

    if (loading) return (
        <div>
            <div className="mb-6">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Configuration</p>
                <h1 className="text-2xl font-semibold text-[#111827]">Paramètres</h1>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-10 flex flex-col items-center gap-4 text-center">
                <svg style={{ animation: 'spin 1s linear infinite' }} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <p className="text-sm font-medium text-[#374151]">Connexion au serveur…</p>
                <p className="text-xs text-[#9CA3AF]">Le serveur se réveille après inactivité, patientez quelques secondes.</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-6">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Configuration</p>
                <h1 className="text-2xl font-semibold text-[#111827]">Paramètres</h1>
            </div>

            {/* ── Informations entreprise ── */}
            <Section title="Informations de l'entreprise">
                <form onSubmit={saveCompany} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nom de l'entreprise">
                            <input className={inp} value={company.name || ''}
                                onChange={e => setCompany(p => ({ ...p, name: e.target.value }))}
                                placeholder="MIA DREAMS & CO" />
                        </Field>
                        <Field label="Slogan">
                            <input className={inp} value={company.tagline || ''}
                                onChange={e => setCompany(p => ({ ...p, tagline: e.target.value }))}
                                placeholder="Mode Africaine d'Excellence" />
                        </Field>
                        <Field label="Email de contact">
                            <input type="email" className={inp} value={company.email || ''}
                                onChange={e => setCompany(p => ({ ...p, email: e.target.value }))}
                                placeholder="contact@miadreams.com" />
                        </Field>
                        <Field label="Téléphone">
                            <input className={inp} value={company.phone || ''}
                                onChange={e => setCompany(p => ({ ...p, phone: e.target.value }))}
                                placeholder="+225 07 00 00 00 00" />
                        </Field>
                        <Field label="WhatsApp" hint="Numéro utilisé pour le bouton WhatsApp flottant et la boutique">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📱</span>
                                <input className={inp + ' pl-8'} value={company.whatsapp || ''}
                                    onChange={e => setCompany(p => ({ ...p, whatsapp: e.target.value }))}
                                    placeholder="+225 07 00 00 00 00" />
                            </div>
                        </Field>
                        <Field label="Adresse">
                            <input className={inp} value={company.address || ''}
                                onChange={e => setCompany(p => ({ ...p, address: e.target.value }))}
                                placeholder="Abidjan, Côte d'Ivoire" />
                        </Field>
                    </div>

                    {/* Logo */}
                    <Field label="Logo" hint="PNG transparent recommandé — affiché dans la navbar, le footer et les reçus">
                        <div className="flex items-start gap-4">
                            {/* Aperçu logo actuel ou prévisualisation */}
                            <div className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-[#E5E7EB] flex items-center justify-center bg-[#1E110A] overflow-hidden">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Nouveau logo" className="w-full h-full object-contain p-2" />
                                ) : company.logo ? (
                                    <img src={company.logo} alt="Logo actuel" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <input ref={fileRef} type="file" accept="image/*" id="logo-upload"
                                    className="hidden" onChange={handleLogoChange} />
                                <label htmlFor="logo-upload"
                                    className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-[#C9A84C] border border-[#C9A84C]/40 bg-[#FDF8EC] hover:bg-[#FFF3CC] px-4 py-2.5 rounded-lg transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    {logoFile ? logoFile.name : 'Choisir un fichier…'}
                                </label>
                                {logoFile && (
                                    <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                                        className="ml-2 text-xs text-red-400 hover:text-red-600">
                                        Annuler
                                    </button>
                                )}
                                {!logoFile && company.logo && (
                                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 break-all">
                                        Logo actuel enregistré ✓
                                    </p>
                                )}
                            </div>
                        </div>
                    </Field>

                    {/* Feedback */}
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-[#F3F4F6]">
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                            {saving ? (
                                <>
                                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                                    </svg>
                                    Enregistrement…
                                </>
                            ) : 'Enregistrer les paramètres'}
                        </button>
                        {saved && (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Sauvegardé avec succès !
                            </span>
                        )}
                    </div>
                </form>
            </Section>

            {/* ── Réseaux sociaux ── */}
            <Section title="Réseaux sociaux">
                {social.length === 0 ? (
                    <p className="text-sm text-[#9CA3AF] mb-4">Aucun réseau social configuré.</p>
                ) : (
                    <div className="space-y-3 mb-4">
                        {social.map(s => (
                            <div key={s._id}
                                className="flex items-center gap-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3">
                                {/* Icône plateforme */}
                                <span className="text-xl flex-shrink-0 w-8 text-center">{ICONS[s.platform] || '🌐'}</span>

                                {/* Sélecteur plateforme */}
                                <select value={s.platform || ''}
                                    onChange={e => updateSocial(s._id, 'platform', e.target.value)}
                                    onBlur={() => saveSocial(s)}
                                    className={inp + ' w-36 flex-shrink-0'}>
                                    {PLATFORMS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>

                                {/* URL */}
                                <input value={s.url || ''} placeholder="https://…"
                                    onChange={e => updateSocial(s._id, 'url', e.target.value)}
                                    onBlur={() => saveSocial(s)}
                                    className={inp + ' flex-1'} />

                                {/* Statut sauvegarde */}
                                {savingId === s._id && (
                                    <svg className="animate-spin w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                                    </svg>
                                )}

                                {/* Actif/Inactif */}
                                <button type="button"
                                    onClick={() => { const updated = { ...s, is_active: !s.is_active }; updateSocial(s._id, 'is_active', !s.is_active); saveSocial(updated); }}
                                    className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                                        s.is_active
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]'
                                    }`}>
                                    {s.is_active ? 'Actif' : 'Inactif'}
                                </button>

                                {/* Supprimer */}
                                <button onClick={() => deleteSocial(s._id)}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors border border-red-100">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={addSocial}
                    className="flex items-center gap-2 text-sm font-medium text-[#C9A84C] hover:text-[#B8973B] border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 bg-[#FDF8EC] hover:bg-[#FFF3CC] px-4 py-2.5 rounded-lg transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Ajouter un réseau social
                </button>

                <p className="text-[11px] text-[#9CA3AF] mt-3">
                    Les modifications se sauvegardent automatiquement quand vous quittez un champ.
                </p>
            </Section>
        </div>
    );
}
