import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const GOLD = '#C9A84C';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const STATUS_LABELS = {
    pending:    { label: 'En attente',     color: '#D97706', bg: '#FEF3C7' },
    confirmed:  { label: 'Confirmée',      color: '#059669', bg: '#D1FAE5' },
    processing: { label: 'En préparation', color: '#7C3AED', bg: '#EDE9FE' },
    shipped:    { label: 'En livraison',   color: '#2563EB', bg: '#DBEAFE' },
    delivered:  { label: 'Livrée',         color: '#059669', bg: '#D1FAE5' },
    cancelled:  { label: 'Annulée',        color: '#DC2626', bg: '#FEE2E2' },
};
const PAYMENT_LABELS = {
    pending:  { label: 'En attente', color: '#D97706', bg: '#FEF3C7' },
    paid:     { label: 'Payé',       color: '#059669', bg: '#D1FAE5' },
    failed:   { label: 'Échoué',     color: '#DC2626', bg: '#FEE2E2' },
    refunded: { label: 'Remboursé',  color: '#7C3AED', bg: '#EDE9FE' },
};
const PAYMENT_METHOD_LABELS = {
    wave:         'Wave',
    orange_money: 'Orange Money',
    free_money:   'Free Money',
    cash:         'À la livraison',
};

function Badge({ type, value }) {
    const map = type === 'order' ? STATUS_LABELS : PAYMENT_LABELS;
    const s = map[value] || { label: value, color: '#6B7280', bg: '#F3F4F6' };
    return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

// ─── Facture / Invoice ────────────────────────────────────────────────────────

function InvoiceModal({ order, onClose }) {
    const printRef = useRef();

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`<!DOCTYPE html><html><head>
            <meta charset="UTF-8"/>
            <title>Facture ${order.order_number} — MIA DREAMS</title>
            <style>
                *{margin:0;padding:0;box-sizing:border-box;}
                body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;background:#fff;padding:40px;max-width:800px;margin:0 auto;}
                .inv-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2.5px solid #C9A84C;margin-bottom:32px;}
                .brand-name{font-size:20px;font-weight:800;letter-spacing:5px;text-transform:uppercase;}
                .brand-tag{font-size:8px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin-top:5px;}
                .inv-title{font-size:30px;font-weight:300;letter-spacing:8px;text-transform:uppercase;color:#C9A84C;text-align:right;}
                .inv-num{font-size:11px;letter-spacing:2px;color:#888;text-align:right;margin-top:4px;}
                .grid2{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px;}
                .label{font-size:7px;letter-spacing:4px;text-transform:uppercase;color:#aaa;margin-bottom:8px;}
                .client-name{font-size:15px;font-weight:600;}
                .client-info{font-size:12px;color:#666;line-height:1.8;margin-top:4px;}
                table{width:100%;border-collapse:collapse;margin-bottom:24px;}
                th{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#999;padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:left;}
                th:not(:first-child){text-align:right;}
                td{padding:12px;font-size:13px;border-bottom:1px solid #f5f5f5;vertical-align:top;}
                td:not(:first-child){text-align:right;}
                .totals{display:flex;justify-content:flex-end;margin-bottom:36px;}
                .totals-inner{width:260px;}
                .tot-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#555;}
                .tot-final{display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #C9A84C;font-size:16px;font-weight:700;color:#C9A84C;}
                .inv-footer{text-align:center;padding-top:24px;border-top:1px solid #f0f0f0;}
                .inv-footer p{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#ccc;line-height:2;}
                @media print{body{padding:16px;}button{display:none!important;}}
            </style>
        </head><body>${content}</body></html>`);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    const itemsText = order.items.map(i =>
        `• ${i.name} × ${i.quantity}${i.size ? ` (T.${i.size})` : ''}${i.color ? ` — ${i.color}` : ''} → *${(i.price * i.quantity).toLocaleString('fr-FR')} FCFA*`
    ).join('\n');

    const dateStr = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    const whatsappText =
`🧾 *FACTURE — MIA DREAMS & CO*
━━━━━━━━━━━━━━━━
📋 N° commande : *${order.order_number}*
📅 Date : ${dateStr}
👤 Client : *${order.customer.name}*
━━━━━━━━━━━━━━━━
📦 *ARTICLES :*
${itemsText}
━━━━━━━━━━━━━━━━
${order.shipping_fee > 0 ? `🚚 Livraison : ${order.shipping_fee.toLocaleString('fr-FR')} FCFA\n` : ''}💰 *TOTAL : ${order.total.toLocaleString('fr-FR')} FCFA*
💳 Paiement : ${PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}
━━━━━━━━━━━━━━━━
Merci pour votre confiance ! 🙏✨
*MIA DREAMS & CO*`;

    const rawPhone = (order.customer.phone || '').replace(/\D/g, '');
    const phone = rawPhone.startsWith('221') ? rawPhone : rawPhone.startsWith('0') ? `221${rawPhone.slice(1)}` : `221${rawPhone}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`;
    const emailSubject = `Votre facture ${order.order_number} — MIA DREAMS & CO`;
    const emailBody = whatsappText.replace(/\*/g, '').replace(/━/g, '---');
    const mailtoUrl = `mailto:${order.customer.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const subtotal = order.subtotal || order.total - (order.shipping_fee || 0);
    const shipping = order.shipping_fee || 0;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.92)' }}>
            <div className="min-h-full flex flex-col items-center py-8 px-4">
                {/* Barre d'actions */}
                <div className="w-full max-w-2xl flex items-center gap-2 mb-5 flex-wrap">
                    <button onClick={handlePrint}
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-80"
                        style={{ background: GOLD }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Imprimer / PDF
                    </button>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.109 1.517 5.834L0 24l6.335-1.484A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.899 0-3.67-.524-5.183-1.435l-.369-.221-3.762.881.936-3.672-.242-.381A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                        WhatsApp
                    </a>
                    <a href={mailtoUrl}
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Email
                    </a>
                    <button onClick={onClose} className="ml-auto text-sm font-medium px-4 py-2.5 rounded-lg border border-white/20 text-white/50 hover:text-white/80 hover:border-white/40 transition-colors">
                        ✕ Fermer
                    </button>
                </div>

                {/* Facture */}
                <div ref={printRef} style={{ background: '#fff', color: '#1a1a1a', padding: '40px', width: '100%', maxWidth: '672px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '2.5px solid #C9A84C', marginBottom: '32px' }}>
                        <div>
                            <p style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '5px', textTransform: 'uppercase' }}>MIA DREAMS & CO</p>
                            <p style={{ fontSize: '8px', letterSpacing: '4px', color: '#C9A84C', textTransform: 'uppercase', marginTop: '5px' }}>MODE AFRICAINE D'EXCELLENCE</p>
                            <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', lineHeight: '1.7' }}>Dakar, Sénégal<br/>contact@miadreams.com</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '30px', fontWeight: '300', letterSpacing: '8px', color: '#C9A84C', textTransform: 'uppercase' }}>FACTURE</p>
                            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', marginTop: '4px' }}>{order.order_number}</p>
                            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>{dateStr}</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                        <div>
                            <p style={{ fontSize: '7px', letterSpacing: '4px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px' }}>Facturé à</p>
                            <p style={{ fontSize: '15px', fontWeight: '600' }}>{order.customer.name}</p>
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px', lineHeight: '1.8' }}>
                                {order.customer.email}<br/>{order.customer.phone}
                                {order.customer.address && <><br/>{order.customer.address}{order.customer.city ? `, ${order.customer.city}` : ''}</>}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '7px', letterSpacing: '4px', textTransform: 'uppercase', color: '#aaa', marginBottom: '8px' }}>Paiement</p>
                            <p style={{ fontSize: '13px', marginBottom: '8px' }}>{PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}</p>
                            {order.payment_ref && <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>Réf : {order.payment_ref}</p>}
                            <span style={{
                                display: 'inline-block', fontSize: '9px', letterSpacing: '2px', padding: '3px 10px', borderRadius: '3px', textTransform: 'uppercase',
                                background: order.payment_status === 'paid' ? '#dcfce7' : '#fef9c3',
                                color: order.payment_status === 'paid' ? '#166534' : '#854d0e',
                            }}>{PAYMENT_LABELS[order.payment_status]?.label || order.payment_status}</span>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', padding: '10px 12px', textAlign: 'left' }}>Produit</th>
                                <th style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', padding: '10px 12px', textAlign: 'center' }}>Qté</th>
                                <th style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', padding: '10px 12px', textAlign: 'right' }}>P.U.</th>
                                <th style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', padding: '10px 12px', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '12px', fontSize: '13px', verticalAlign: 'top' }}>
                                        <p style={{ fontWeight: '500' }}>{item.name}</p>
                                        {(item.size || item.color) && <p style={{ fontSize: '10px', color: '#aaa', marginTop: '3px' }}>{[item.size && `Taille: ${item.size}`, item.color && `${item.color}`].filter(Boolean).join(' · ')}</p>}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', color: '#666' }}>{item.quantity}</td>
                                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', color: '#666' }}>{item.price.toLocaleString('fr-FR')} FCFA</td>
                                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: '500' }}>{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
                        <div style={{ width: '260px' }}>
                            {shipping > 0 && <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#666' }}><span>Sous-total</span><span>{subtotal.toLocaleString('fr-FR')} FCFA</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#666' }}><span>Livraison</span><span>{shipping.toLocaleString('fr-FR')} FCFA</span></div>
                            </>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid #C9A84C', fontSize: '16px', fontWeight: '700', color: '#C9A84C' }}>
                                <span>TOTAL</span><span>{order.total.toLocaleString('fr-FR')} FCFA</span>
                            </div>
                        </div>
                    </div>
                    {order.notes && (
                        <div style={{ padding: '14px 16px', background: '#fafafa', borderLeft: '2px solid #C9A84C', marginBottom: '28px' }}>
                            <p style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Notes</p>
                            <p style={{ fontSize: '12px', color: '#666' }}>{order.notes}</p>
                        </div>
                    )}
                    <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ccc' }}>Merci pour votre confiance</p>
                        <p style={{ fontSize: '8px', letterSpacing: '2px', color: '#ddd', marginTop: '4px', textTransform: 'uppercase' }}>MIA DREAMS & CO · Mode Africaine d'Excellence · Dakar, Sénégal</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Détail commande ──────────────────────────────────────────────────────────

function OrderDetail({ order, onClose, onUpdate }) {
    const [orderStatus,   setOrderStatus]   = useState(order.order_status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [saving,        setSaving]        = useState(false);
    const [showInvoice,   setShowInvoice]   = useState(false);

    const save = async () => {
        setSaving(true);
        try {
            await axios.patch(`/api/admin/orders/${order._id}`, { order_status: orderStatus, payment_status: paymentStatus });
            onUpdate();
            onClose();
        } catch (e) { alert(e.response?.data?.message || 'Erreur'); }
        finally { setSaving(false); }
    };

    const selCls = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors";

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-[#E5E7EB]"
                 onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    <div>
                        <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Commande</p>
                        <p className="text-base font-bold" style={{ color: GOLD }}>{order.order_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowInvoice(true)}
                            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#FDF8EC] transition-colors">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            Facture
                        </button>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Client */}
                    <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Client</p>
                        <p className="text-sm font-semibold text-[#111827]">{order.customer.name}</p>
                        <p className="text-sm text-[#6B7280] mt-0.5">{order.customer.email} · {order.customer.phone}</p>
                        {order.customer.address && (
                            <p className="text-sm text-[#9CA3AF] mt-0.5">{order.customer.address}, {order.customer.city}</p>
                        )}
                    </div>

                    {/* Articles */}
                    <div>
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Articles</p>
                        <div className="space-y-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] overflow-hidden">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-[#F3F4F6] last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827]">{item.name}</p>
                                        <p className="text-xs text-[#9CA3AF]">
                                            × {item.quantity}{item.size ? ` — T. ${item.size}` : ''}{item.color ? ` — ${item.color}` : ''}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-[#374151]">
                                        {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between px-4 py-3 bg-white border-t border-[#E5E7EB]">
                                <span className="text-sm font-semibold text-[#374151]">Total</span>
                                <span className="text-base font-bold" style={{ color: GOLD }}>
                                    {order.total.toLocaleString('fr-FR')} FCFA
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Paiement */}
                    <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Paiement</p>
                        <p className="text-sm text-[#374151]">{PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}</p>
                        {order.payment_ref && <p className="text-xs text-[#9CA3AF] mt-0.5">Réf : {order.payment_ref}</p>}
                    </div>

                    {/* Mise à jour statuts */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F3F4F6]">
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Statut commande</label>
                            <select className={selCls} value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                                {ORDER_STATUSES.map(s => (
                                    <option key={s} value={s}>{STATUS_LABELS[s]?.label || s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Statut paiement</label>
                            <select className={selCls} value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                                {PAYMENT_STATUSES.map(s => (
                                    <option key={s} value={s}>{PAYMENT_LABELS[s]?.label || s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button onClick={save} disabled={saving}
                        className="w-full py-3 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                        style={{ background: GOLD, color: '#fff' }}>
                        {saving ? 'Enregistrement…' : 'Mettre à jour la commande'}
                    </button>
                </div>
            </div>
        </div>

        {showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}
        </>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AdminCommandes() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPayment, setFilterPayment] = useState('');
    const [selected, setSelected] = useState(null);
    const [invoiceOrder, setInvoiceOrder] = useState(null);

    const load = () => {
        const params = {};
        if (filterStatus)  params.status  = filterStatus;
        if (filterPayment) params.payment = filterPayment;
        axios.get('/api/admin/orders', { params }).then(r => setOrders(r.data)).catch(() => {});
    };

    useEffect(() => { load(); }, [filterStatus, filterPayment]);

    const revenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0);

    const selCls = "bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors";

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">E-commerce</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Commandes</h1>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm px-5 py-3 text-right">
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-0.5">Revenu total (payé)</p>
                    <p className="text-xl font-bold" style={{ color: GOLD }}>
                        {revenue.toLocaleString('fr-FR')} FCFA
                    </p>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mb-5">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selCls}>
                    <option value="">Tous les statuts</option>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]?.label}</option>)}
                </select>
                <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className={selCls}>
                    <option value="">Tous les paiements</option>
                    {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{PAYMENT_LABELS[s]?.label}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                {orders.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        </div>
                        <p className="text-sm text-[#6B7280]">Aucune commande</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">N° / Date</th>
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Client</th>
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Montant</th>
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">Paiement</th>
                                <th className="text-left px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Statut</th>
                                <th className="text-right px-5 py-3.5 bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                            {orders.map((o) => (
                                <tr key={o._id} className="hover:bg-[#F9FAFB] transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold" style={{ color: GOLD }}>{o.order_number}</p>
                                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                                            {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <p className="text-sm font-medium text-[#111827]">{o.customer.name}</p>
                                        <p className="text-xs text-[#9CA3AF]">{o.customer.phone}</p>
                                    </td>
                                    <td className="px-5 py-4 hidden lg:table-cell">
                                        <span className="text-sm font-semibold" style={{ color: GOLD }}>
                                            {o.total.toLocaleString('fr-FR')} FCFA
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <Badge type="payment" value={o.payment_status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge type="order" value={o.order_status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setSelected(o)}
                                                className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                                                style={{ background: '#C9A84C' }}>
                                                Voir
                                            </button>
                                            <button onClick={() => setInvoiceOrder(o)}
                                                title="Voir la facture"
                                                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                                                style={{ borderColor: '#C9A84C', color: '#C9A84C', background: 'transparent' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#FDF8EC'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                                Facture
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selected && (
                <OrderDetail
                    order={selected}
                    onClose={() => setSelected(null)}
                    onUpdate={load}
                />
            )}

            {invoiceOrder && !selected && (
                <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
            )}
        </div>
    );
}
