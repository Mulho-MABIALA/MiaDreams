import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const GOLD  = '#C9A84C';
const GREEN = '#22c55e';

const MODES = [
    { value: 'especes', label: 'Espèces', icon: '💵' },
    { value: 'wave',    label: 'Wave',    icon: '📱' },
];

const inp = "w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]";

const fmt     = (n) => Number(n || 0).toLocaleString('fr-FR') + ' FCFA';
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
const imgSrc  = (img) => img ? (img.startsWith('http') || img.startsWith('/') ? img : `/uploads/${img}`) : null;

function Spinner({ small }) {
    return (
        <svg className={`animate-spin text-[#C9A84C] ${small ? 'w-3.5 h-3.5' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
        </svg>
    );
}

// ─── Impression du reçu dans une nouvelle fenêtre ─────────────────────────────
function printReceipt(order, remiseMt) {
    const modeLbl = MODES.find(m => m.value === order.payment_method)?.label || order.payment_method;
    const lines   = order.items.map(i =>
        `<tr>
            <td style="padding:6px 0;font-size:13px;color:#374151;">${i.quantity}× ${i.name}</td>
            <td style="padding:6px 0;font-size:13px;color:#111827;text-align:right;font-weight:600;">${fmt(i.price * i.quantity)}</td>
        </tr>`
    ).join('');

    const w = window.open('', '_blank', 'width=400,height=620');
    w.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Reçu ${order.order_number}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; background: #fff; padding: 24px; color: #111827; }
  .logo { text-align: center; margin-bottom: 20px; }
  .logo h1 { font-size: 18px; letter-spacing: 4px; font-weight: 900; color: #111827; }
  .logo p  { font-size: 10px; letter-spacing: 2px; color: #9CA3AF; margin-top: 2px; }
  .divider { border: none; border-top: 1px dashed #D1D5DB; margin: 14px 0; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 3px 0; font-size: 12px; }
  .label { color: #6B7280; }
  .value { color: #111827; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  .total-row td { font-size: 15px; font-weight: 800; color: #C9A84C; padding-top: 10px; }
  .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #9CA3AF; line-height: 1.8; }
  @media print {
    body { padding: 8px; }
    button { display: none; }
  }
</style>
</head>
<body>
<div class="logo">
  <h1>MIA DREAMS</h1>
  <p>& CO — REÇU DE VENTE</p>
</div>
<hr class="divider"/>
<div class="row"><span class="label">N° commande</span><span class="value">${order.order_number}</span></div>
<div class="row"><span class="label">Date</span><span class="value">${fmtDate(new Date())}</span></div>
${order.customer?.name && order.customer.name !== 'Client comptoir'
    ? `<div class="row"><span class="label">Client</span><span class="value">${order.customer.name}</span></div>`
    : ''}
${order.customer?.phone ? `<div class="row"><span class="label">Téléphone</span><span class="value">${order.customer.phone}</span></div>` : ''}
<hr class="divider"/>
<table>
  <tbody>${lines}</tbody>
</table>
<hr class="divider"/>
${remiseMt > 0 ? `
<div class="row"><span class="label">Sous-total</span><span class="value">${fmt(order.subtotal)}</span></div>
<div class="row"><span class="label">Remise</span><span class="value" style="color:#ef4444;">− ${fmt(remiseMt)}</span></div>` : ''}
<table><tbody>
  <tr class="total-row">
    <td>TOTAL ENCAISSÉ</td>
    <td style="text-align:right;">${fmt(order.total)}</td>
  </tr>
</tbody></table>
<div class="row" style="margin-top:8px;"><span class="label">Mode de paiement</span><span class="value">${modeLbl}</span></div>
<hr class="divider"/>
<div class="footer">
  Merci pour votre confiance !<br/>
  MIA DREAMS & CO — Abidjan, Côte d'Ivoire<br/>
  <strong style="color:#C9A84C;">www.miadreams.com</strong>
</div>
<br/>
<div style="text-align:center;">
  <button onclick="window.print()" style="background:#C9A84C;color:#fff;border:none;padding:8px 24px;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">
    🖨 Imprimer
  </button>
</div>
</body>
</html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
}

// ─── URL de la facture ────────────────────────────────────────────────────────
const SITE_URL = 'https://miadreams.netlify.app';
function invoiceUrl(order) {
    return `${SITE_URL}/api/invoices/order/${order._id}`;
}

// ─── Compose le texte WhatsApp du reçu ───────────────────────────────────────
function buildWhatsAppText(order, remiseMt) {
    const modeLbl = MODES.find(m => m.value === order.payment_method)?.label || order.payment_method;
    const lines   = order.items.map(i => `  • ${i.quantity}× ${i.name} — ${fmt(i.price * i.quantity)}`).join('\n');
    const remiseLine = remiseMt > 0 ? `\nRemise : -${fmt(remiseMt)}` : '';
    const client = order.customer?.name && order.customer.name !== 'Client comptoir'
        ? `\nClient : ${order.customer.name}` : '';

    return `🛍️ *MIA DREAMS & CO — Reçu de vente*
━━━━━━━━━━━━━━━━━━━━
📋 Commande : ${order.order_number}
📅 Date : ${fmtDate(new Date())}${client}
━━━━━━━━━━━━━━━━━━━━
*Articles :*
${lines}
━━━━━━━━━━━━━━━━━━━━${remiseLine}
*💰 Total encaissé : ${fmt(order.total)}*
💳 Paiement : ${modeLbl}
━━━━━━━━━━━━━━━━━━━━
📄 Voir la facture :
${invoiceUrl(order)}
━━━━━━━━━━━━━━━━━━━━
Merci pour votre confiance ! 🌸
_MIA DREAMS & CO — Abidjan, Côte d'Ivoire_`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AdminPOS — Page principale
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminPOS() {
    const [products, setProducts]         = useState([]);
    const [search, setSearch]             = useState('');
    const [panier, setPanier]             = useState([]);
    const [customer, setCustomer]         = useState({ name: '', phone: '' });
    const [payMethod, setPayMethod]       = useState('especes');
    const [remise, setRemise]             = useState('');
    const [notes, setNotes]               = useState('');
    const [saving, setSaving]             = useState(false);
    const [receipt, setReceipt]           = useState(null);   // { order, remiseMt }
    const [loadingProds, setLoadingProds] = useState(true);
    const searchRef                       = useRef();

    const loadProducts = () => {
        setLoadingProds(true);
        axios.get('/api/admin/products')
            .then(r => setProducts(r.data.filter(p => p.is_active && p.stock > 0)))
            .catch(() => {})
            .finally(() => setLoadingProds(false));
    };

    useEffect(() => { loadProducts(); }, []);

    const filtered = products.filter(p =>
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const addToPanier = (product) => {
        setPanier(prev => {
            const ex = prev.find(i => i.product._id === product._id);
            if (ex) {
                if (ex.quantity >= product.stock) return prev;
                return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product, quantity: 1, size: '', color: '' }];
        });
    };

    const updateLine = (pid, field, value) => setPanier(prev => prev.map(i => i.product._id === pid ? { ...i, [field]: value } : i));
    const removeLine = (pid) => setPanier(prev => prev.filter(i => i.product._id !== pid));

    const subtotal = panier.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const remiseMt = Math.min(Number(remise) || 0, subtotal);
    const total    = Math.max(0, subtotal - remiseMt);

    const handleSale = async () => {
        if (!panier.length) return;
        setSaving(true);
        try {
            const items = panier.map(i => ({
                product_id: i.product._id,
                name:       i.product.name,
                image:      i.product.image,
                price:      i.product.price,
                quantity:   i.quantity,
                size:       i.size,
                color:      i.color,
            }));
            const { data } = await axios.post('/api/caisse/vente', {
                items, customer, payment_method: payMethod, remise: remiseMt, notes,
            });
            setReceipt({ order: data.order, remiseMt });
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la vente');
        } finally { setSaving(false); }
    };

    const reset = () => {
        setPanier([]); setCustomer({ name: '', phone: '' });
        setPayMethod('especes'); setRemise(''); setNotes(''); setReceipt(null);
        loadProducts();
        setTimeout(() => searchRef.current?.focus(), 100);
    };

    // ── Écran reçu ─────────────────────────────────────────────────────────────
    if (receipt) {
        const { order, remiseMt: rm } = receipt;
        const hasPhone = order.customer?.phone?.replace(/\D/g, '').length >= 8;
        const waPhone  = order.customer?.phone?.replace(/\D/g, '').replace(/^0/, '225');
        const waText   = buildWhatsAppText(order, rm);
        const waHref   = hasPhone
            ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`
            : `https://wa.me/?text=${encodeURIComponent(waText)}`;

        return (
            <div className="max-w-md mx-auto">
                {/* Header page */}
                <div className="mb-6">
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Finance</p>
                    <h1 className="text-2xl font-semibold text-[#111827]">Point de Vente</h1>
                </div>

                {/* Reçu */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden">
                    {/* Entête */}
                    <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">Vente enregistrée ✓</p>
                        <p className="text-3xl font-bold text-[#111827]">{fmt(order.total)}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1.5 font-mono">{order.order_number}</p>
                    </div>

                    {/* Articles */}
                    <div className="px-5 py-4 border-b border-[#F3F4F6]">
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Articles</p>
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-1.5">
                                <span className="text-sm text-[#374151]">{item.quantity}× {item.name}</span>
                                <span className="text-sm font-semibold text-[#111827]">{fmt(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Détails */}
                    <div className="px-5 py-4 space-y-2 border-b border-[#F3F4F6]">
                        {rm > 0 && (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#9CA3AF]">Sous-total</span>
                                    <span className="text-[#374151]">{fmt(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#9CA3AF]">Remise</span>
                                    <span className="text-red-500 font-medium">− {fmt(rm)}</span>
                                </div>
                            </>
                        )}
                        {order.customer?.name && order.customer.name !== 'Client comptoir' && (
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9CA3AF]">Client</span>
                                <span className="text-[#374151] font-medium">{order.customer.name}</span>
                            </div>
                        )}
                        {order.customer?.phone && (
                            <div className="flex justify-between text-sm">
                                <span className="text-[#9CA3AF]">Téléphone</span>
                                <span className="text-[#374151]">{order.customer.phone}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-[#9CA3AF]">Paiement</span>
                            <span className="text-[#374151]">{MODES.find(m => m.value === order.payment_method)?.label || order.payment_method}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-1 border-t border-[#F3F4F6]">
                            <span className="text-[#374151]">Total encaissé</span>
                            <span className="text-emerald-600">{fmt(order.total)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 py-4 space-y-3">
                        {/* WhatsApp */}
                        <a href={waHref} target="_blank" rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[.98]"
                            style={{ background: '#25D366' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Envoyer le reçu par WhatsApp
                        </a>

                        {/* Voir la facture */}
                        <a href={invoiceUrl(order)} target="_blank" rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-[#FFFBF0] active:scale-[.98]"
                            style={{ borderColor: GOLD, color: GOLD }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                            Voir / Imprimer la facture
                        </a>

                        <div className="flex gap-3">
                            {/* Imprimer reçu rapide */}
                            <button onClick={() => printReceipt(order, rm)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E5E7EB] text-[#374151] text-sm font-medium hover:bg-[#F9FAFB] transition-all">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                    <rect x="6" y="14" width="12" height="8"/>
                                </svg>
                                Ticket rapide
                            </button>

                            {/* Nouvelle vente */}
                            <button onClick={reset}
                                className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[.98]"
                                style={{ background: GOLD }}>
                                + Nouvelle vente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Interface POS ──────────────────────────────────────────────────────────
    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-0.5">Finance</p>
                <h1 className="text-2xl font-semibold text-[#111827]">Point de Vente</h1>
                <p className="text-sm text-[#9CA3AF] mt-1">Enregistrez une vente en boutique</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

                {/* ── Catalogue ── */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    {/* Barre de recherche */}
                    <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
                        <svg className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input ref={searchRef} type="text" placeholder="Rechercher un produit…"
                            className="flex-1 text-sm text-[#374151] outline-none placeholder:text-[#9CA3AF] bg-transparent"
                            value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-[#9CA3AF] hover:text-[#374151] transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        )}
                        <span className="text-xs text-[#9CA3AF] flex-shrink-0 font-medium">
                            {filtered.length} produit{filtered.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Grille */}
                    {loadingProds ? (
                        <div className="flex items-center justify-center gap-2.5 py-20">
                            <Spinner /><span className="text-sm text-[#9CA3AF]">Chargement du catalogue…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="text-4xl mb-3">📦</div>
                            <p className="text-sm text-[#9CA3AF]">
                                {search ? `Aucun résultat pour « ${search} »` : 'Aucun produit disponible en stock'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-px bg-[#F3F4F6]">
                            {filtered.map(product => {
                                const inCart = panier.find(i => i.product._id === product._id);
                                return (
                                    <button key={product._id}
                                        onClick={() => addToPanier(product)}
                                        disabled={inCart?.quantity >= product.stock}
                                        className={`bg-white p-3 text-left transition-all hover:bg-[#FFFBF0] active:scale-[.97] disabled:opacity-40 disabled:cursor-not-allowed relative ${
                                            inCart ? 'ring-2 ring-inset ring-[#C9A84C]' : ''
                                        }`}>
                                        {/* Image */}
                                        <div className="aspect-square rounded-lg overflow-hidden bg-[#F9FAFB] mb-2.5 relative">
                                            {product.image
                                                ? <img src={imgSrc(product.image)} alt={product.name}
                                                       className="w-full h-full object-cover object-top" />
                                                : <div className="w-full h-full flex items-center justify-center">
                                                      <svg className="w-7 h-7 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                      </svg>
                                                  </div>
                                            }
                                            {inCart && (
                                                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md"
                                                     style={{ background: GOLD }}>
                                                    {inCart.quantity}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-[#111827] leading-tight mb-1 line-clamp-2">{product.name}</p>
                                        <p className="text-xs font-bold" style={{ color: GOLD }}>{fmt(product.price)}</p>
                                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                                            Stock : <span className={product.stock <= 3 ? 'text-orange-500 font-semibold' : ''}>{product.stock}</span>
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Colonne droite : panier + paiement ── */}
                <div className="flex flex-col gap-4">

                    {/* Panier */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                                🛒 Panier
                                {panier.length > 0 && (
                                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded-full"
                                          style={{ background: GOLD }}>
                                        {panier.reduce((s, i) => s + i.quantity, 0)}
                                    </span>
                                )}
                            </h3>
                            {panier.length > 0 && (
                                <button onClick={() => setPanier([])}
                                    className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium">
                                    Vider
                                </button>
                            )}
                        </div>

                        {panier.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="text-3xl mb-2">🛍️</div>
                                <p className="text-sm text-[#9CA3AF]">Cliquez sur un produit pour l'ajouter</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F9FAFB] max-h-72 overflow-y-auto">
                                {panier.map(({ product, quantity, size, color }) => (
                                    <div key={product._id} className="p-3">
                                        <div className="flex items-start gap-3">
                                            {/* Miniature */}
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                                                {product.image
                                                    ? <img src={imgSrc(product.image)} alt="" className="w-full h-full object-cover object-top" />
                                                    : <div className="w-full h-full bg-[#E5E7EB]" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-[#111827] truncate">{product.name}</p>
                                                <p className="text-xs font-bold mt-0.5" style={{ color: GOLD }}>
                                                    {fmt(product.price * quantity)}
                                                </p>
                                            </div>
                                            {/* Quantité */}
                                            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden flex-shrink-0">
                                                <button
                                                    onClick={() => quantity <= 1 ? removeLine(product._id) : updateLine(product._id, 'quantity', quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] transition-colors text-base">
                                                    {quantity <= 1 ? '×' : '−'}
                                                </button>
                                                <span className="w-7 text-center text-xs font-bold text-[#374151]">{quantity}</span>
                                                <button
                                                    onClick={() => quantity < product.stock && updateLine(product._id, 'quantity', quantity + 1)}
                                                    disabled={quantity >= product.stock}
                                                    className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-30 transition-colors">
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Taille / couleur */}
                                        {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                                            <div className="flex gap-2 mt-2 pl-13">
                                                {product.sizes?.length > 0 && (
                                                    <select value={size} onChange={e => updateLine(product._id, 'size', e.target.value)}
                                                        className="flex-1 text-xs border border-[#E5E7EB] rounded-md px-2 py-1 outline-none focus:border-[#C9A84C] text-[#374151] bg-white">
                                                        <option value="">Taille</option>
                                                        {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                )}
                                                {product.colors?.length > 0 && (
                                                    <select value={color} onChange={e => updateLine(product._id, 'color', e.target.value)}
                                                        className="flex-1 text-xs border border-[#E5E7EB] rounded-md px-2 py-1 outline-none focus:border-[#C9A84C] text-[#374151] bg-white">
                                                        <option value="">Couleur</option>
                                                        {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Client */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Client (optionnel)</p>
                        <div className="space-y-2">
                            <input type="text" placeholder="Nom du client" className={inp}
                                value={customer.name}
                                onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} />
                            <div className="relative">
                                <input type="tel" placeholder="Téléphone (pour WhatsApp)" className={inp + ' pl-9'}
                                    value={customer.phone}
                                    onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }}>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Paiement + total + encaisser */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4">
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Paiement</p>

                        {/* Modes */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {MODES.map(m => (
                                <button key={m.value} onClick={() => setPayMethod(m.value)}
                                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                                        payMethod === m.value
                                            ? 'border-[#C9A84C] bg-[#FFFBF0] text-[#C9A84C] shadow-sm'
                                            : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#C9A84C]/40 hover:bg-[#FEFCE8]'
                                    }`}>
                                    <span className="text-xl">{m.icon}</span>
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Remise */}
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Remise (FCFA)</label>
                            <input type="number" min="0" max={subtotal} placeholder="0"
                                className={inp} value={remise}
                                onChange={e => setRemise(e.target.value)} />
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[#374151] mb-1.5">Notes</label>
                            <textarea rows={2} placeholder="Remarque…" className={inp + ' resize-none'}
                                value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>

                        {/* Récapitulatif */}
                        {panier.length > 0 && (
                            <div className="space-y-1.5 mb-4 py-3 border-t border-b border-[#F3F4F6]">
                                <div className="flex justify-between text-sm text-[#6B7280]">
                                    <span>Sous-total</span>
                                    <span>{fmt(subtotal)}</span>
                                </div>
                                {remiseMt > 0 && (
                                    <div className="flex justify-between text-sm text-red-500">
                                        <span>Remise</span>
                                        <span>− {fmt(remiseMt)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold text-[#111827]">
                                    <span>Total à encaisser</span>
                                    <span style={{ color: GOLD }}>{fmt(total)}</span>
                                </div>
                            </div>
                        )}

                        {/* Bouton */}
                        <button onClick={handleSale} disabled={!panier.length || saving}
                            className="w-full flex items-center justify-center gap-2.5 text-white text-sm font-bold py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-[.98]"
                            style={{ background: panier.length ? GOLD : '#9CA3AF' }}>
                            {saving
                                ? <><Spinner small /> Enregistrement…</>
                                : <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    {panier.length > 0 ? `Encaisser ${fmt(total)}` : 'Encaisser'}
                                  </>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
