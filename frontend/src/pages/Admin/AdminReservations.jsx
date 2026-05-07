import { useEffect, useState } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';

const STATUS_CONFIG = {
    pending:   { label: 'En attente',  color: '#D97706', bg: '#FEF3C7' },
    confirmed: { label: 'Confirmée',   color: '#059669', bg: '#D1FAE5' },
    cancelled: { label: 'Annulée',     color: '#DC2626', bg: '#FEE2E2' },
};

function formatDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(d) {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `il y a ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `il y a ${days}j`;
}

// ─── Modal détail ─────────────────────────────────────────────────────────────

function ReservationModal({ item, onClose, onUpdate }) {
    const [saving, setSaving] = useState(false);

    const save = async (newStatus) => {
        setSaving(true);
        try {
            await axios.put(`/api/admin/reservations/${item._id}`, { status: newStatus, is_read: true });
            onUpdate();
            onClose();
        } catch { alert('Erreur lors de la mise à jour'); }
        finally { setSaving(false); }
    };

    const rawPhone = (item.phone || '').replace(/\D/g, '');
    const phone = rawPhone.startsWith('221') ? rawPhone : rawPhone ? `221${rawPhone}` : '';
    const waConfirm = encodeURIComponent(
`Bonjour ${item.name} ! 👋

✅ Votre réservation chez *MIA DREAMS & CO* est *confirmée*.

📋 *Détails :*
• Service : *${item.service}*${item.preferred_date ? `\n• Date : *${formatDate(item.preferred_date)}*` : ''}${item.preferred_time ? `\n• Heure : *${item.preferred_time}*` : ''}

Nous vous attendons avec impatience ! 🌟
Pour toute question, n'hésitez pas à nous contacter.

*MIA DREAMS & CO* — Mode Africaine d'Excellence`
    );
    const waCancel = encodeURIComponent(
`Bonjour ${item.name},

Nous sommes désolés de vous informer que votre réservation du service *${item.service}* n'a pas pu être confirmée pour le moment.

N'hésitez pas à nous recontacter pour trouver une autre disponibilité. 🙏

*MIA DREAMS & CO*`
    );
    const emailSubject = encodeURIComponent(`Votre réservation ${item.service} — MIA DREAMS & CO`);
    const emailBody = encodeURIComponent(
`Bonjour ${item.name},

Nous avons bien reçu votre demande de réservation pour le service "${item.service}"${item.preferred_date ? ` le ${formatDate(item.preferred_date)}` : ''}.

Nous reviendrons vers vous très prochainement pour confirmer votre rendez-vous.

Cordialement,
MIA DREAMS & CO`
    );

    const st = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-[#E5E7EB]"
                 onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    <div>
                        <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Réservation</p>
                        <p className="text-base font-semibold text-[#111827]">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                            {st.label}
                        </span>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Client + Service */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Client</p>
                            <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                            <p className="text-xs text-[#6B7280] mt-1">{item.email}</p>
                            {item.phone && <p className="text-xs text-[#6B7280]">{item.phone}</p>}
                        </div>
                        <div className="bg-[#FDF8EC] rounded-xl p-4 border border-[#C9A84C]/20">
                            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Service</p>
                            <p className="text-sm font-semibold text-[#C9A84C]">{item.service}</p>
                            {item.preferred_date && (
                                <p className="text-xs text-[#374151] mt-1">📅 {formatDate(item.preferred_date)}</p>
                            )}
                            {item.preferred_time && (
                                <p className="text-xs text-[#374151]">🕐 {item.preferred_time}</p>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    {item.message && (
                        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Message du client</p>
                            <p className="text-sm text-[#374151] leading-relaxed italic">"{item.message}"</p>
                        </div>
                    )}

                    <p className="text-xs text-[#9CA3AF]">
                        Reçu le {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>

                    {/* Contacter */}
                    <div className="border-t border-[#F3F4F6] pt-5">
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Contacter le client</p>
                        <div className="flex gap-2 flex-wrap">
                            {phone && (
                                <a href={`https://wa.me/${phone}?text=${waConfirm}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.109 1.517 5.834L0 24l6.335-1.484A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 01-5.071-1.385l-.369-.221-3.762.881.936-3.672-.242-.381A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                                    WA Confirmer
                                </a>
                            )}
                            {phone && (
                                <a href={`https://wa.me/${phone}?text=${waCancel}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.109 1.517 5.834L0 24l6.335-1.484A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 01-5.071-1.385l-.369-.221-3.762.881.936-3.672-.242-.381A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                                    WA Annuler
                                </a>
                            )}
                            <a href={`mailto:${item.email}?subject=${emailSubject}&body=${emailBody}`}
                                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                Email
                            </a>
                        </div>
                    </div>

                    {/* Changer statut */}
                    <div className="border-t border-[#F3F4F6] pt-5">
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Statut de la réservation</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => save('confirmed')} disabled={saving || item.status === 'confirmed'}
                                className="py-2.5 text-sm font-semibold rounded-xl border-2 transition-all disabled:opacity-40"
                                style={item.status === 'confirmed'
                                    ? { background: '#D1FAE5', borderColor: '#059669', color: '#059669' }
                                    : { background: 'white', borderColor: '#D1D5DB', color: '#374151' }}>
                                ✓ Confirmer
                            </button>
                            <button onClick={() => save('pending')} disabled={saving || item.status === 'pending'}
                                className="py-2.5 text-sm font-semibold rounded-xl border-2 transition-all disabled:opacity-40"
                                style={item.status === 'pending'
                                    ? { background: '#FEF3C7', borderColor: '#D97706', color: '#D97706' }
                                    : { background: 'white', borderColor: '#D1D5DB', color: '#374151' }}>
                                ⏳ Attente
                            </button>
                            <button onClick={() => save('cancelled')} disabled={saving || item.status === 'cancelled'}
                                className="py-2.5 text-sm font-semibold rounded-xl border-2 transition-all disabled:opacity-40"
                                style={item.status === 'cancelled'
                                    ? { background: '#FEE2E2', borderColor: '#DC2626', color: '#DC2626' }
                                    : { background: 'white', borderColor: '#D1D5DB', color: '#374151' }}>
                                ✕ Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AdminReservations() {
    const [items, setItems]       = useState([]);
    const [filter, setFilter]     = useState('all');
    const [selected, setSelected] = useState(null);

    const load = () => axios.get('/api/admin/reservations').then(r => setItems(r.data)).catch(() => {});
    useEffect(() => { load(); }, []);

    const markRead = async (item) => {
        if (item.is_read) return;
        await axios.put(`/api/admin/reservations/${item._id}`, { is_read: true }).catch(() => {});
        setItems(prev => prev.map(i => i._id === item._id ? { ...i, is_read: true } : i));
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Supprimer cette réservation définitivement ?')) return;
        await axios.delete(`/api/admin/reservations/${id}`).catch(() => {});
        setItems(prev => prev.filter(i => i._id !== id));
    };

    const openDetail = (item) => {
        markRead(item);
        setSelected(item);
    };

    const counts = {
        all: items.length,
        pending: items.filter(i => i.status === 'pending').length,
        confirmed: items.filter(i => i.status === 'confirmed').length,
        cancelled: items.filter(i => i.status === 'cancelled').length,
    };
    const unread = items.filter(i => !i.is_read).length;
    const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

    const FILTERS = [
        { key: 'all',       label: `Toutes`,         count: counts.all },
        { key: 'pending',   label: `En attente`,     count: counts.pending },
        { key: 'confirmed', label: `Confirmées`,     count: counts.confirmed },
        { key: 'cancelled', label: `Annulées`,       count: counts.cancelled },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Gestion</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Réservations</h1>
                </div>
                {unread > 0 && (
                    <div className="flex items-center gap-2 bg-[#FDF8EC] border border-[#C9A84C]/30 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
                        <span className="text-sm font-semibold text-[#C9A84C]">{unread} non lue{unread > 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'En attente', count: counts.pending,   color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
                    { label: 'Confirmées', count: counts.confirmed, color: '#059669', bg: '#D1FAE5', border: '#6EE7B7' },
                    { label: 'Annulées',   count: counts.cancelled, color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border px-5 py-4 shadow-sm" style={{ borderColor: s.border }}>
                        <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="flex gap-1 mb-5 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                {FILTERS.map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                            filter === f.key
                                ? 'bg-white text-[#111827] shadow-sm'
                                : 'text-[#6B7280] hover:text-[#374151]'
                        }`}>
                        {f.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === f.key ? 'bg-[#F3F4F6] text-[#374151]' : 'bg-white text-[#6B7280]'}`}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Liste */}
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">Aucune réservation</p>
                    </div>
                ) : filtered.map(item => {
                    const st = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                    const rawPhone = (item.phone || '').replace(/\D/g, '');
                    const waPhone = rawPhone.startsWith('221') ? rawPhone : rawPhone ? `221${rawPhone}` : '';
                    const quickWa = encodeURIComponent(`Bonjour ${item.name} ! 👋\n\nConcernant votre demande de *${item.service}* chez MIA DREAMS & CO :\n`);

                    return (
                        <div key={item._id}
                             onClick={() => openDetail(item)}
                             className={`bg-white rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-px ${
                                 !item.is_read ? 'border-[#C9A84C]/40' : 'border-[#E5E7EB]'
                             }`}>
                            <div className="flex items-start gap-4 p-4">

                                {/* Dot non-lu */}
                                <div className="flex-shrink-0 mt-2">
                                    {!item.is_read
                                        ? <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: GOLD }} />
                                        : <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                                    }
                                </div>

                                {/* Contenu */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <p className={`text-sm font-semibold ${item.is_read ? 'text-[#374151]' : 'text-[#111827]'}`}>{item.name}</p>
                                            <p className="text-xs text-[#9CA3AF] mt-0.5">{item.email}{item.phone ? ` · ${item.phone}` : ''}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
                                                {st.label}
                                            </span>
                                            <span className="text-xs text-[#9CA3AF]">{timeAgo(item.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDF8EC] text-[#C9A84C]">
                                            {item.service}
                                        </span>
                                        {item.preferred_date && (
                                            <span className="text-xs text-[#6B7280]">
                                                📅 {formatDateShort(item.preferred_date)}{item.preferred_time ? ` à ${item.preferred_time}` : ''}
                                            </span>
                                        )}
                                        {item.message && (
                                            <span className="text-xs text-[#9CA3AF] italic truncate max-w-xs">
                                                "{item.message.slice(0, 60)}{item.message.length > 60 ? '…' : ''}"
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions rapides */}
                                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    {waPhone && (
                                        <a href={`https://wa.me/${waPhone}?text=${quickWa}`}
                                           target="_blank" rel="noopener noreferrer"
                                           title="WhatsApp"
                                           className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.109 1.517 5.834L0 24l6.335-1.484A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 01-5.071-1.385l-.369-.221-3.762.881.936-3.672-.242-.381A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                                        </a>
                                    )}
                                    <a href={`mailto:${item.email}`}
                                       title="Email"
                                       className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </a>
                                    <button onClick={(e) => handleDelete(item._id, e)}
                                        title="Supprimer"
                                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#DC2626] hover:bg-red-50 hover:border-red-200 transition-colors">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selected && (
                <ReservationModal
                    item={selected}
                    onClose={() => setSelected(null)}
                    onUpdate={() => { load(); setSelected(null); }}
                />
            )}
        </div>
    );
}
