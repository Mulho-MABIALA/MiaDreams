import { useState, useRef } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';

const inputCls = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

function Section({ title, icon, children }) {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 mb-5">
            <div className="flex items-center gap-3 mb-6">
                {icon && <span style={{ color: GOLD }}>{icon}</span>}
                <span className="text-xs font-semibold text-[#9E8272] uppercase tracking-widest">{title}</span>
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
            {hint && <p className="text-xs text-[#9CA3AF] mt-1">{hint}</p>}
        </div>
    );
}

function SaveBar({ saving, saved, error, label = 'Enregistrer' }) {
    return (
        <div className="flex items-center gap-4 pt-5 border-t border-[#F3F4F6]">
            <button
                type="submit"
                disabled={saving}
                className="bg-[#C9A84C] hover:bg-[#B8973B] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
                {saving ? 'Enregistrement…' : label}
            </button>
            {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Sauvegardé !
                </span>
            )}
            {error && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </span>
            )}
        </div>
    );
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminProfile() {
    const stored = JSON.parse(localStorage.getItem('admin_user') || '{}');

    /* ── Infos générales ── */
    const [info, setInfo]     = useState({ name: stored.name || '', email: stored.email || '' });
    const [infoSaving, setInfoSaving] = useState(false);
    const [infoSaved,  setInfoSaved]  = useState(false);
    const [infoError,  setInfoError]  = useState('');

    /* ── Mot de passe ── */
    const [pwd, setPwd]       = useState({ current: '', next: '', confirm: '' });
    const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
    const [pwdSaving, setPwdSaving] = useState(false);
    const [pwdSaved,  setPwdSaved]  = useState(false);
    const [pwdError,  setPwdError]  = useState('');

    /* ── Indicateur de force du mot de passe ── */
    const pwdStrength = (p) => {
        let score = 0;
        if (p.length >= 8)  score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score; // 0-4
    };
    const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort'];
    const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    const strength = pwdStrength(pwd.next);

    /* ── Sauvegarde infos ── */
    const handleInfoSave = async (e) => {
        e.preventDefault();
        setInfoError('');
        if (!info.name.trim()) return setInfoError('Le nom est requis.');
        if (!info.email.trim()) return setInfoError("L'email est requis.");
        setInfoSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.put('/api/auth/profile', info, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Mettre à jour le localStorage
            const updated = { ...stored, name: info.name, email: info.email };
            localStorage.setItem('admin_user', JSON.stringify(updated));
            setInfoSaved(true);
            setTimeout(() => setInfoSaved(false), 3000);
        } catch (err) {
            setInfoError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setInfoSaving(false);
        }
    };

    /* ── Changement de mot de passe ── */
    const handlePwdSave = async (e) => {
        e.preventDefault();
        setPwdError('');
        if (!pwd.current) return setPwdError('Entrez votre mot de passe actuel.');
        if (pwd.next.length < 8) return setPwdError('Le nouveau mot de passe doit faire au moins 8 caractères.');
        if (pwd.next !== pwd.confirm) return setPwdError('Les mots de passe ne correspondent pas.');
        setPwdSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            await axios.post('/api/auth/change-password', {
                currentPassword: pwd.current,
                newPassword: pwd.next,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPwd({ current: '', next: '', confirm: '' });
            setPwdSaved(true);
            setTimeout(() => setPwdSaved(false), 3000);
        } catch (err) {
            setPwdError(err.response?.data?.message || 'Mot de passe actuel incorrect.');
        } finally {
            setPwdSaving(false);
        }
    };

    const toggleShow = (field) => setShowPwd(p => ({ ...p, [field]: !p[field] }));

    const EyeIcon = ({ show }) => show
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

    return (
        <div style={{ maxWidth: '720px' }}>
            {/* ─── Header ─── */}
            <div className="mb-8">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Mon compte</p>
                <h1 className="text-2xl font-semibold text-[#111827]">Profil</h1>
            </div>

            {/* ─── Avatar + résumé ─── */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6 mb-5">
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div
                        className="flex-shrink-0 flex items-center justify-center rounded-full text-[#1E110A] font-bold text-xl select-none"
                        style={{
                            width: '72px',
                            height: '72px',
                            background: `linear-gradient(135deg, ${GOLD} 0%, #E8C66A 100%)`,
                            boxShadow: `0 0 0 4px ${GOLD}22`,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        {getInitials(info.name)}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-[#1E110A] truncate">{info.name || '—'}</h2>
                        <p className="text-sm text-[#9E8272] truncate">{info.email || '—'}</p>
                        <span
                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ background: `${GOLD}18`, color: GOLD }}
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Administrateur
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Informations générales ─── */}
            <Section
                title="Informations générales"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            >
                <form onSubmit={handleInfoSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nom complet">
                        <input
                            className={inputCls}
                            value={info.name}
                            onChange={e => setInfo(p => ({ ...p, name: e.target.value }))}
                            placeholder="Admin MiaDreams"
                        />
                    </Field>
                    <Field label="Adresse email" hint="Utilisée pour la connexion">
                        <input
                            type="email"
                            className={inputCls}
                            value={info.email}
                            onChange={e => setInfo(p => ({ ...p, email: e.target.value }))}
                            placeholder="admin@miadreams.com"
                        />
                    </Field>
                    <div className="sm:col-span-2">
                        <SaveBar saving={infoSaving} saved={infoSaved} error={infoError} />
                    </div>
                </form>
            </Section>

            {/* ─── Sécurité / Mot de passe ─── */}
            <Section
                title="Sécurité"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            >
                <form onSubmit={handlePwdSave} className="space-y-4">
                    {/* Mot de passe actuel */}
                    <Field label="Mot de passe actuel">
                        <div className="relative">
                            <input
                                type={showPwd.current ? 'text' : 'password'}
                                className={inputCls + ' pr-10'}
                                value={pwd.current}
                                onChange={e => setPwd(p => ({ ...p, current: e.target.value }))}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('current')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                            >
                                <EyeIcon show={showPwd.current} />
                            </button>
                        </div>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nouveau mot de passe */}
                        <Field label="Nouveau mot de passe" hint="Minimum 8 caractères">
                            <div className="relative">
                                <input
                                    type={showPwd.next ? 'text' : 'password'}
                                    className={inputCls + ' pr-10'}
                                    value={pwd.next}
                                    onChange={e => setPwd(p => ({ ...p, next: e.target.value }))}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('next')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                                >
                                    <EyeIcon show={showPwd.next} />
                                </button>
                            </div>
                            {/* Barre de force */}
                            {pwd.next && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{ background: i <= strength ? strengthColor[strength] : '#E5E7EB' }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs" style={{ color: strengthColor[strength] }}>
                                        {strengthLabel[strength]}
                                    </p>
                                </div>
                            )}
                        </Field>

                        {/* Confirmation */}
                        <Field label="Confirmer le nouveau mot de passe">
                            <div className="relative">
                                <input
                                    type={showPwd.confirm ? 'text' : 'password'}
                                    className={inputCls + ' pr-10'}
                                    value={pwd.confirm}
                                    onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                                >
                                    <EyeIcon show={showPwd.confirm} />
                                </button>
                            </div>
                            {/* Indicateur de correspondance */}
                            {pwd.confirm && pwd.next && (
                                <p className={`text-xs mt-1.5 flex items-center gap-1 ${pwd.next === pwd.confirm ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {pwd.next === pwd.confirm
                                        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Les mots de passe correspondent</>
                                        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ne correspondent pas</>
                                    }
                                </p>
                            )}
                        </Field>
                    </div>

                    {/* Conseils sécurité */}
                    <div
                        className="rounded-lg p-3 flex gap-3"
                        style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}22` }}
                    >
                        <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p className="text-xs text-[#9E8272] leading-relaxed">
                            Un bon mot de passe contient au moins 8 caractères, une majuscule, un chiffre et un caractère spécial (ex. <code className="bg-white/60 px-1 rounded">Admin@2024</code>).
                        </p>
                    </div>

                    <SaveBar saving={pwdSaving} saved={pwdSaved} error={pwdError} label="Changer le mot de passe" />
                </form>
            </Section>

            {/* ─── Informations du compte ─── */}
            <Section
                title="Informations du compte"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Rôle', value: 'Administrateur', icon: '🛡️' },
                        { label: 'Email', value: info.email || '—', icon: '✉️' },
                        { label: 'Session', value: 'Expire dans 7 jours', icon: '🔑' },
                    ].map(item => (
                        <div
                            key={item.label}
                            className="rounded-lg p-4"
                            style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">{item.icon}</span>
                                <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">{item.label}</span>
                            </div>
                            <p className="text-sm font-medium text-[#374151] truncate">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
