const express     = require('express');
const router      = express.Router();
const crypto      = require('crypto');
const TempInvoice = require('../models/TempInvoice');
const Order       = require('../models/Order');

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString('fr-FR') + ' FCFA';
const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
const payLabel = { especes: 'Espèces', wave: 'Wave', orange_money: 'Orange Money', cash: 'Espèces' };

// ── HTML Invoice template ─────────────────────────────────────────────────────
function buildInvoiceHTML(order) {
    const items = order.items.map(i => `
        <tr>
            <td class="desc">${i.quantity}&times; ${i.name}${i.size ? ` <span class="attr">(${i.size}${i.color ? ', ' + i.color : ''})</span>` : ''}</td>
            <td class="qty">${i.quantity}</td>
            <td class="price">${fmt(i.price)}</td>
            <td class="amount">${fmt(i.price * i.quantity)}</td>
        </tr>`
    ).join('');

    const subtotal = order.subtotal ?? order.total;
    const remise   = subtotal - order.total;
    const remiseRow = remise > 0 ? `
        <tr class="sub">
            <td colspan="3" class="right muted">Remise</td>
            <td class="amount red">− ${fmt(remise)}</td>
        </tr>` : '';

    const methodLabel = payLabel[order.payment_method] || order.payment_method || '—';
    const orderDate   = fmtDate(order.createdAt || new Date());
    const clientName  = order.customer?.name || '—';
    const clientPhone = order.customer?.phone || '';
    const clientAddr  = order.customer?.address || '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Facture ${order.order_number} — MIA DREAMS</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #F2F3F5; color: #111827; }
  .page { max-width: 760px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.1); }

  /* Header */
  .header { background: #1E110A; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; }
  .brand-name { font-size: 22px; letter-spacing: 5px; font-weight: 900; color: #fff; text-transform: uppercase; }
  .brand-sub { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,.4); margin-top: 4px; }
  .invoice-badge { text-align: right; }
  .invoice-badge .label { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,.35); text-transform: uppercase; }
  .invoice-badge .number { font-size: 18px; font-weight: 700; color: #C9A84C; margin-top: 4px; font-family: monospace; letter-spacing: 1px; }

  /* Gold bar */
  .gold-bar { height: 4px; background: linear-gradient(90deg, #C9A84C 0%, #E8C66A 50%, #C9A84C 100%); }

  /* Meta */
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px 40px; border-bottom: 1px solid #F3F4F6; }
  .meta-block p.title { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 10px; }
  .meta-block p { font-size: 13px; color: #374151; line-height: 1.8; }
  .meta-block p strong { color: #111827; font-weight: 600; }

  /* Table */
  .table-wrap { padding: 0 40px 32px; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #F9FAFB; border-top: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; }
  thead th { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #9CA3AF; padding: 10px 12px; text-align: left; }
  thead th.right { text-align: right; }
  tbody tr { border-bottom: 1px solid #F3F4F6; }
  tbody tr:last-child { border-bottom: none; }
  td { padding: 12px; font-size: 13px; color: #374151; }
  td.desc { max-width: 300px; }
  .attr { color: #9CA3AF; font-size: 12px; }
  td.qty, td.price, td.amount { text-align: right; white-space: nowrap; }
  td.amount { font-weight: 600; color: #111827; }
  tr.sub td { padding: 6px 12px; font-size: 12px; }
  .right { text-align: right; }
  .muted { color: #6B7280; }
  .red { color: #ef4444; }

  /* Total */
  .total-row { background: #FFFBF0; }
  .total-row td { padding: 16px 12px; font-size: 15px; font-weight: 800; border-top: 2px solid #C9A84C; }
  .total-row .total-label { color: #374151; }
  .total-row .total-amount { color: #C9A84C; }

  /* Footer */
  .footer { background: #F9FAFB; padding: 24px 40px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid #E5E7EB; }
  .footer-left p { font-size: 12px; color: #9CA3AF; line-height: 1.7; }
  .footer-left strong { color: #C9A84C; }
  .status-badge { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

  /* Print button */
  .print-bar { text-align: center; padding: 20px; }
  .btn-print { background: #C9A84C; color: #fff; border: none; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; transition: opacity .2s; }
  .btn-print:hover { opacity: .88; }

  @media print {
    body { background: #fff; }
    .page { box-shadow: none; border-radius: 0; margin: 0; }
    .print-bar { display: none; }
  }
  @media (max-width: 600px) {
    .header { padding: 24px 20px; flex-direction: column; gap: 16px; text-align: center; }
    .invoice-badge { text-align: center; }
    .meta { grid-template-columns: 1fr; padding: 24px 20px; }
    .table-wrap { padding: 0 12px 24px; }
    .footer { flex-direction: column; padding: 20px; text-align: center; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">MIA DREAMS</div>
      <div class="brand-sub">&amp; CO — Maison de Mode Africaine</div>
    </div>
    <div class="invoice-badge">
      <div class="label">Facture</div>
      <div class="number">${order.order_number}</div>
    </div>
  </div>
  <div class="gold-bar"></div>

  <!-- Méta -->
  <div class="meta">
    <div class="meta-block">
      <p class="title">Informations client</p>
      <p><strong>${clientName}</strong></p>
      ${clientPhone ? `<p>${clientPhone}</p>` : ''}
      ${clientAddr && clientAddr !== 'Vente en boutique' ? `<p>${clientAddr}</p>` : '<p>Vente en boutique</p>'}
    </div>
    <div class="meta-block" style="text-align:right;">
      <p class="title">Détails</p>
      <p><strong>Date :</strong> ${orderDate}</p>
      <p><strong>N° commande :</strong> ${order.order_number}</p>
      <p><strong>Mode de paiement :</strong> ${methodLabel}</p>
    </div>
  </div>

  <!-- Articles -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="right">Qté</th>
          <th class="right">Prix unit.</th>
          <th class="right">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${items}
        ${remiseRow}
        <tr class="total-row">
          <td colspan="3" class="right total-label">Total encaissé</td>
          <td class="amount total-amount">${fmt(order.total)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <p>Merci pour votre confiance !</p>
      <p><strong>MIA DREAMS & CO</strong> — Abidjan, Côte d'Ivoire</p>
      <p>www.miadreams.com</p>
    </div>
    <div class="status-badge">✓ Payé</div>
  </div>

  <!-- Bouton impression (masqué à l'impression) -->
  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">🖨 Imprimer / Enregistrer en PDF</button>
  </div>
</div>
</body>
</html>`;
}

// ── GET /api/invoices/order/:id — Facture HTML depuis une commande ─────────────
// Route publique : accessible via le lien WhatsApp sans authentification
router.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Chercher par _id (ObjectId) ou order_number
        const isObjectId = /^[a-f\d]{24}$/i.test(id);
        const order = isObjectId
            ? await Order.findById(id)
            : await Order.findOne({ order_number: id });

        if (!order) return res.status(404).send(`
            <html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#6B7280;">
              <h2>Facture introuvable</h2>
              <p>La commande ${id} n'existe pas ou a été supprimée.</p>
            </body></html>
        `);

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.send(buildInvoiceHTML(order));
    } catch (err) {
        res.status(500).send(`<html><body><p>Erreur : ${err.message}</p></body></html>`);
    }
});

// ── POST /api/invoices/upload — Stocker un PDF base64 (legacy) ────────────────
router.post('/upload', async (req, res) => {
    try {
        const { data: dataUri, filename } = req.body;
        if (!dataUri) return res.status(400).json({ message: 'Données PDF manquantes' });

        const base64Data = dataUri.replace(/^data:application\/pdf;base64,/, '');
        const buffer     = Buffer.from(base64Data, 'base64');
        const token      = crypto.randomBytes(20).toString('hex');

        await TempInvoice.create({
            token,
            filename:    filename || 'facture.pdf',
            data:        buffer,
            contentType: 'application/pdf',
        });

        res.json({ token, url: `/api/invoices/${token}` });
    } catch (err) {
        console.error('Invoice upload error:', err.message);
        res.status(500).json({ message: 'Erreur lors de la génération du lien' });
    }
});

// ── GET /api/invoices/:token — Servir un PDF stocké (legacy) ─────────────────
router.get('/:token', async (req, res) => {
    try {
        const inv = await TempInvoice.findOne({ token: req.params.token });
        if (!inv) return res.status(404).send(`
            <html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#6B7280;">
              <h2>Facture expirée</h2>
              <p>Ce lien est expiré ou introuvable. Les factures temporaires sont valables 72 heures.</p>
            </body></html>
        `);

        res.set({
            'Content-Type':        'application/pdf',
            'Content-Disposition': `inline; filename="${inv.filename}"`,
            'Content-Length':      inv.data.length,
            'Cache-Control':       'private, max-age=3600',
        });
        res.send(inv.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
