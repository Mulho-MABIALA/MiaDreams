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
const LOGO_URL = 'https://miadreams.netlify.app/img/logo_MIA.png';

function buildInvoiceHTML(order) {
    const subtotal    = order.subtotal ?? order.total;
    const remise      = Math.max(0, subtotal - order.total);
    const methodLabel = payLabel[order.payment_method] || order.payment_method || '—';
    const orderDate   = fmtDate(order.createdAt || new Date());
    const clientName  = order.customer?.name && order.customer.name !== 'Client comptoir' ? order.customer.name : 'Client comptoir';
    const clientPhone = order.customer?.phone || '';
    const clientAddr  = order.customer?.address && order.customer.address !== 'Vente en boutique' ? order.customer.address : '';

    const itemRows = order.items.map((i, idx) => `
        <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
            <td class="td-desc">
                <span class="item-name">${i.name}</span>
                ${i.size || i.color ? `<span class="item-attr">${[i.size, i.color].filter(Boolean).join(' · ')}</span>` : ''}
            </td>
            <td class="td-center">${i.quantity}</td>
            <td class="td-right">${fmt(i.price)}</td>
            <td class="td-right td-amount">${fmt(i.price * i.quantity)}</td>
        </tr>`
    ).join('');

    const remiseRow = remise > 0 ? `
        <tr class="subtotal-row">
            <td colspan="3" class="td-right subtotal-label">Sous-total</td>
            <td class="td-right subtotal-val">${fmt(subtotal)}</td>
        </tr>
        <tr class="remise-row">
            <td colspan="3" class="td-right remise-label">Remise accordée</td>
            <td class="td-right remise-val">− ${fmt(remise)}</td>
        </tr>` : '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Facture ${order.order_number} — MIA DREAMS &amp; CO</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    background: #ECEEF1;
    color: #1a1a1a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    max-width: 820px;
    margin: 36px auto;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,.12);
  }

  /* ── HEADER ── */
  .header {
    background: #1E110A;
    padding: 36px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .header-brand { display: flex; align-items: center; gap: 18px; }
  .header-logo {
    width: 64px; height: 64px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: .92;
    flex-shrink: 0;
  }
  .brand-text {}
  .brand-name { font-size: 20px; letter-spacing: 6px; font-weight: 900; color: #fff; text-transform: uppercase; line-height: 1; }
  .brand-tagline { font-size: 9px; letter-spacing: 2.5px; color: #C9A84C; text-transform: uppercase; margin-top: 5px; font-weight: 600; }
  .brand-addr { font-size: 10px; color: rgba(255,255,255,.3); margin-top: 7px; line-height: 1.6; }

  .invoice-info { text-align: right; flex-shrink: 0; }
  .invoice-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,.3); font-weight: 600; }
  .invoice-num { font-size: 22px; font-weight: 800; color: #C9A84C; margin-top: 5px; font-family: monospace; letter-spacing: 1px; }
  .invoice-date { font-size: 11px; color: rgba(255,255,255,.45); margin-top: 5px; }

  /* ── BARRE DORÉE ── */
  .gold-bar { height: 5px; background: linear-gradient(90deg, #8B6914 0%, #C9A84C 25%, #E8C66A 50%, #C9A84C 75%, #8B6914 100%); }

  /* ── STATUS BANNER ── */
  .status-banner {
    background: #F0FDF4;
    border-bottom: 1px solid #DCFCE7;
    padding: 10px 48px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #15803D;
    font-weight: 600;
  }
  .status-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; flex-shrink: 0; }

  /* ── META GRID ── */
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-bottom: 1px solid #F3F4F6;
  }
  .meta-block { padding: 28px 48px; }
  .meta-block:first-child { border-right: 1px solid #F3F4F6; }
  .meta-title {
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;
    padding-bottom: 8px; border-bottom: 1px solid #F3F4F6;
  }
  .meta-row { display: flex; gap: 8px; margin-bottom: 5px; font-size: 13px; }
  .meta-key { color: #9CA3AF; min-width: 80px; flex-shrink: 0; }
  .meta-val { color: #1a1a1a; font-weight: 600; }

  /* ── TABLE ARTICLES ── */
  .table-section { padding: 0 48px 36px; }
  .table-title { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #9CA3AF; padding: 20px 0 12px; }

  table.invoice-table { width: 100%; border-collapse: collapse; }

  thead tr {
    background: #1E110A;
  }
  thead th {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: rgba(255,255,255,.6);
    padding: 12px 14px; text-align: left;
  }
  thead th.td-right { text-align: right; }
  thead th.td-center { text-align: center; }

  tbody tr.even { background: #fff; }
  tbody tr.odd  { background: #FAFAFA; }
  tbody tr:hover { background: #FFFBF0; }

  td { padding: 13px 14px; border-bottom: 1px solid #F3F4F6; vertical-align: middle; }
  td.td-desc {}
  .item-name { font-size: 13px; font-weight: 500; color: #1a1a1a; display: block; }
  .item-attr { font-size: 11px; color: #9CA3AF; display: block; margin-top: 2px; }
  td.td-center { text-align: center; font-size: 13px; font-weight: 600; color: #374151; }
  td.td-right { text-align: right; font-size: 13px; color: #374151; }
  td.td-amount { font-weight: 700; color: #1a1a1a; }

  /* Sous-total / remise */
  tr.subtotal-row td, tr.remise-row td {
    padding: 8px 14px;
    border-bottom: none;
    font-size: 12px;
  }
  .subtotal-label, .remise-label { color: #6B7280; font-weight: 500; }
  .subtotal-val { color: #374151; font-weight: 600; }
  .remise-val { color: #ef4444; font-weight: 700; }

  /* Ligne total */
  tr.total-row td {
    padding: 18px 14px;
    border-top: 2px solid #C9A84C;
    border-bottom: none;
    background: #FFFBF0;
  }
  .total-label-td { font-size: 13px; font-weight: 700; color: #374151; text-align: right; }
  .total-amount-td { font-size: 20px; font-weight: 900; color: #C9A84C; text-align: right; white-space: nowrap; }

  /* ── PAIEMENT ── */
  .payment-row {
    margin: 0 48px 32px;
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }
  .pay-icon { font-size: 20px; }
  .pay-text { color: #6B7280; }
  .pay-method { color: #1a1a1a; font-weight: 700; }

  /* ── FOOTER ── */
  .footer {
    background: #1E110A;
    padding: 24px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .footer-left { }
  .footer-thanks { font-size: 14px; font-weight: 700; color: #C9A84C; margin-bottom: 4px; }
  .footer-sub { font-size: 11px; color: rgba(255,255,255,.35); line-height: 1.6; }
  .footer-right { text-align: right; }
  .footer-logo { width: 40px; height: 40px; object-fit: contain; filter: brightness(0) invert(1); opacity: .4; }
  .footer-web { font-size: 11px; color: #C9A84C; font-weight: 600; margin-top: 6px; }

  /* ── BOUTON IMPRESSION ── */
  .print-bar { text-align: center; padding: 24px; background: #F9FAFB; border-top: 1px solid #E5E7EB; }
  .btn-print {
    background: #C9A84C; color: #fff; border: none;
    padding: 13px 36px; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    letter-spacing: 0.5px; transition: opacity .2s;
    font-family: inherit;
  }
  .btn-print:hover { opacity: .88; }

  @media print {
    body { background: #fff; }
    .page { box-shadow: none; border-radius: 0; margin: 0; max-width: 100%; }
    .print-bar { display: none !important; }
    .footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }

  @media (max-width: 640px) {
    .header { padding: 24px 20px; flex-direction: column; gap: 16px; }
    .invoice-info { text-align: left; }
    .meta-grid { grid-template-columns: 1fr; }
    .meta-block { padding: 20px; }
    .meta-block:first-child { border-right: none; border-bottom: 1px solid #F3F4F6; }
    .table-section { padding: 0 12px 24px; }
    .status-banner, .payment-row { margin-left: 12px; margin-right: 12px; }
    .footer { padding: 20px; flex-direction: column; text-align: center; }
    .footer-right { text-align: center; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="header-brand">
      <img class="header-logo" src="${LOGO_URL}" alt="MIA DREAMS" onerror="this.style.display='none'"/>
      <div class="brand-text">
        <div class="brand-name">MIA DREAMS</div>
        <div class="brand-tagline">&amp; CO — Maison de Mode Africaine</div>
        <div class="brand-addr">Abidjan, Côte d'Ivoire<br/>www.miadreams.com</div>
      </div>
    </div>
    <div class="invoice-info">
      <div class="invoice-label">Facture N°</div>
      <div class="invoice-num">${order.order_number}</div>
      <div class="invoice-date">Émise le ${orderDate}</div>
    </div>
  </div>
  <div class="gold-bar"></div>

  <!-- STATUT -->
  <div class="status-banner">
    <div class="status-dot"></div>
    Paiement reçu — Cette facture est acquittée
  </div>

  <!-- MÉTA -->
  <div class="meta-grid">
    <div class="meta-block">
      <div class="meta-title">Vendu à</div>
      <div class="meta-row"><span class="meta-key">Nom</span><span class="meta-val">${clientName}</span></div>
      ${clientPhone ? `<div class="meta-row"><span class="meta-key">Téléphone</span><span class="meta-val">${clientPhone}</span></div>` : ''}
      ${clientAddr  ? `<div class="meta-row"><span class="meta-key">Adresse</span><span class="meta-val">${clientAddr}</span></div>`  : '<div class="meta-row"><span class="meta-key">Point de vente</span><span class="meta-val">Boutique Abidjan</span></div>'}
    </div>
    <div class="meta-block">
      <div class="meta-title">Détails de la transaction</div>
      <div class="meta-row"><span class="meta-key">Date</span><span class="meta-val">${orderDate}</span></div>
      <div class="meta-row"><span class="meta-key">Réf.</span><span class="meta-val" style="font-family:monospace;">${order.order_number}</span></div>
      <div class="meta-row"><span class="meta-key">Paiement</span><span class="meta-val">${methodLabel}</span></div>
      <div class="meta-row"><span class="meta-key">Statut</span><span class="meta-val" style="color:#15803D;">✓ Payé</span></div>
    </div>
  </div>

  <!-- ARTICLES -->
  <div class="table-section">
    <div class="table-title">Détail des articles</div>
    <table class="invoice-table">
      <thead>
        <tr>
          <th style="width:50%">Description</th>
          <th class="td-center" style="width:10%">Qté</th>
          <th class="td-right" style="width:20%">Prix unit.</th>
          <th class="td-right" style="width:20%">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        ${remiseRow}
        <tr class="total-row">
          <td colspan="3" class="total-label-td">Total encaissé</td>
          <td class="total-amount-td">${fmt(order.total)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAIEMENT -->
  <div class="payment-row">
    <span class="pay-icon">${methodLabel === 'Wave' ? '📱' : '💵'}</span>
    <span class="pay-text">Règlement effectué par</span>
    <span class="pay-method">${methodLabel}</span>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-left">
      <div class="footer-thanks">Merci pour votre confiance !</div>
      <div class="footer-sub">
        Ce document tient lieu de reçu et de facture.<br/>
        MIA DREAMS &amp; CO — Abidjan, Côte d'Ivoire — www.miadreams.com
      </div>
    </div>
    <div class="footer-right">
      <img class="footer-logo" src="${LOGO_URL}" alt="" onerror="this.style.display='none'"/>
      <div class="footer-web">miadreams.com</div>
    </div>
  </div>

  <!-- BOUTON IMPRESSION -->
  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">🖨&nbsp; Imprimer / Enregistrer en PDF</button>
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
    const errPage = (title, msg) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/>
<title>${title}</title>
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#F9FAFB;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);padding:48px 56px;text-align:center;max-width:480px;}
  .icon{font-size:48px;margin-bottom:16px;}
  h2{color:#1E110A;font-size:20px;margin:0 0 10px;}
  p{color:#6B7280;font-size:14px;line-height:1.6;margin:0 0 28px;}
  a{display:inline-block;background:#C9A84C;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;}
</style></head>
<body><div class="card">
  <div class="icon">🧾</div>
  <h2>${title}</h2>
  <p>${msg}</p>
  <a href="https://miadreams.netlify.app">Retour à la boutique</a>
</div></body></html>`;

    try {
        const inv = await TempInvoice.findOne({ token: req.params.token });

        if (!inv) {
            return res.status(404).send(errPage(
                'Facture expirée',
                'Ce lien de facture est expiré ou introuvable.<br/>Les liens temporaires sont valables 72 heures après la vente.'
            ));
        }

        // Valider que les données sont bien un PDF (magic bytes %PDF)
        const buf = Buffer.isBuffer(inv.data) ? inv.data : Buffer.from(inv.data.buffer || inv.data);
        const magic = buf.slice(0, 4).toString('ascii');
        if (magic !== '%PDF') {
            return res.status(422).send(errPage(
                'Facture corrompue',
                'Le fichier PDF de cette facture est endommagé et ne peut pas être affiché.<br/>Contactez la boutique pour obtenir un duplicata.'
            ));
        }

        res.set({
            'Content-Type':        'application/pdf',
            'Content-Disposition': `inline; filename="${inv.filename}"`,
            'Content-Length':      buf.length,
            'Cache-Control':       'private, max-age=3600',
        });
        res.send(buf);
    } catch (err) {
        res.status(500).send(errPage('Erreur serveur', err.message));
    }
});

module.exports = router;
