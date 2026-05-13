/**
 * notify.js — Notifications automatiques MIA DREAMS
 * - WhatsApp via CallMeBot (gratuit, sans CB)
 * - Email admin via Nodemailer (SMTP Gmail)
 */

const nodemailer = require('nodemailer');

// ── Transporter email ─────────────────────────────────────────────────────────
let _transporter = null;
function getTransporter() {
    if (_transporter) return _transporter;
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return null;
    _transporter = nodemailer.createTransport({
        host:   process.env.MAIL_HOST || 'smtp.gmail.com',
        port:   Number(process.env.MAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    return _transporter;
}

// ── WhatsApp via CallMeBot ────────────────────────────────────────────────────
async function sendWhatsApp(message) {
    const phone  = process.env.WHATSAPP_PHONE;
    const apikey = process.env.WHATSAPP_APIKEY;
    if (!phone || !apikey) return;

    try {
        const text = encodeURIComponent(message);
        const url  = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apikey}`;
        const res  = await fetch(url);
        if (!res.ok) console.warn('⚠️  CallMeBot réponse :', res.status);
        else console.log('✅ WhatsApp envoyé');
    } catch (e) {
        console.error('❌ Erreur WhatsApp notify :', e.message);
    }
}

// ── Email HTML ────────────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
    const transporter = getTransporter();
    if (!transporter) return;
    try {
        await transporter.sendMail({
            from: `"MIA DREAMS" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`✅ Email envoyé à ${to}`);
    } catch (e) {
        console.error('❌ Erreur email notify :', e.message);
    }
}

// ── Formater les articles ─────────────────────────────────────────────────────
function formatItems(items) {
    return items.map(i =>
        `• ${i.name}${i.size ? ` (T. ${i.size})` : ''}${i.color ? ` / ${i.color}` : ''} × ${i.quantity} — ${(i.price * i.quantity).toLocaleString('fr-FR')} FCFA`
    ).join('\n');
}

function formatItemsHtml(items) {
    return items.map(i => `
        <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0e8d8;color:#3D2214;font-size:14px;">
                ${i.name}${i.size ? ` <span style="color:#9E8272">(T. ${i.size})</span>` : ''}${i.color ? ` / ${i.color}` : ''}
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0e8d8;text-align:center;color:#6B4F3A;font-size:14px;">× ${i.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0e8d8;text-align:right;color:#C9A84C;font-weight:600;font-size:14px;">
                ${(i.price * i.quantity).toLocaleString('fr-FR')} FCFA
            </td>
        </tr>
    `).join('');
}

const PAYMENT_LABELS = {
    wave:         '🌊 Wave',
    orange_money: '🟠 Orange Money',
    free_money:   '💜 Free Money',
    cash:         '💵 Paiement à la livraison',
};

// ── NOTIFICATION NOUVELLE COMMANDE ────────────────────────────────────────────
async function notifyNewOrder(order) {
    const payLabel = PAYMENT_LABELS[order.payment_method] || order.payment_method;
    const adminUrl = `${process.env.BACKEND_URL?.replace('/api','') || 'https://mia-dreams.onrender.com'}/admin/commandes`;

    // ── WhatsApp ──
    const waMsg = [
        `🛍️ *NOUVELLE COMMANDE — MIA DREAMS*`,
        ``,
        `📦 *${order.order_number}*`,
        `👤 ${order.customer.name}`,
        `📱 ${order.customer.phone}`,
        order.customer.email ? `📧 ${order.customer.email}` : '',
        order.customer.address ? `📍 ${order.customer.address}, ${order.customer.city}` : '',
        ``,
        `🛒 *Articles :*`,
        formatItems(order.items),
        ``,
        `💳 Paiement : ${payLabel}`,
        `💰 *Total : ${order.total.toLocaleString('fr-FR')} FCFA*`,
        order.notes ? `\n📝 Note : ${order.notes}` : '',
        ``,
        `👉 ${adminUrl}`,
    ].filter(l => l !== '').join('\n');

    // ── Email HTML ──
    const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDF8F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2D1B0E 0%,#4A2C18 100%);padding:32px 36px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:rgba(201,168,76,.7);text-transform:uppercase;">Boutique e-commerce</p>
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#C9A84C;letter-spacing:-0.5px;">Nouvelle commande reçue</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,.4);">${new Date(order.createdAt).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
    </div>

    <div style="padding:28px 36px;">

      <!-- Numéro commande -->
      <div style="background:#FDF8F2;border-left:3px solid #C9A84C;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0 0 2px;font-size:10px;letter-spacing:2px;color:#9E8272;text-transform:uppercase;">Numéro de commande</p>
        <p style="margin:0;font-size:20px;font-weight:700;color:#C9A84C;">${order.order_number}</p>
      </div>

      <!-- Client -->
      <h2 style="margin:0 0 12px;font-size:12px;letter-spacing:2px;color:#9E8272;text-transform:uppercase;font-weight:600;">Informations client</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:6px 0;color:#6B4F3A;font-size:13px;width:110px;">Nom</td><td style="padding:6px 0;color:#1E110A;font-size:14px;font-weight:500;">${order.customer.name}</td></tr>
        <tr><td style="padding:6px 0;color:#6B4F3A;font-size:13px;">Téléphone</td><td style="padding:6px 0;color:#1E110A;font-size:14px;">${order.customer.phone}</td></tr>
        ${order.customer.email ? `<tr><td style="padding:6px 0;color:#6B4F3A;font-size:13px;">Email</td><td style="padding:6px 0;color:#1E110A;font-size:14px;">${order.customer.email}</td></tr>` : ''}
        ${order.customer.address ? `<tr><td style="padding:6px 0;color:#6B4F3A;font-size:13px;">Adresse</td><td style="padding:6px 0;color:#1E110A;font-size:14px;">${order.customer.address}, ${order.customer.city}</td></tr>` : ''}
      </table>

      <!-- Articles -->
      <h2 style="margin:0 0 12px;font-size:12px;letter-spacing:2px;color:#9E8272;text-transform:uppercase;font-weight:600;">Articles commandés</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#FDF8F2;">
            <th style="padding:8px 12px;text-align:left;font-size:10px;letter-spacing:1.5px;color:#9E8272;text-transform:uppercase;font-weight:600;">Article</th>
            <th style="padding:8px 12px;text-align:center;font-size:10px;letter-spacing:1.5px;color:#9E8272;text-transform:uppercase;font-weight:600;">Qté</th>
            <th style="padding:8px 12px;text-align:right;font-size:10px;letter-spacing:1.5px;color:#9E8272;text-transform:uppercase;font-weight:600;">Prix</th>
          </tr>
        </thead>
        <tbody>${formatItemsHtml(order.items)}</tbody>
      </table>

      <!-- Totaux -->
      <div style="background:#FDF8F2;border-radius:8px;padding:16px 18px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#9E8272;">Sous-total</span>
          <span style="font-size:13px;color:#6B4F3A;">${order.subtotal.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
          <span style="font-size:13px;color:#9E8272;">Livraison</span>
          <span style="font-size:13px;color:#6B4F3A;">${order.shipping_fee.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div style="border-top:1px solid #e8d8c4;padding-top:10px;display:flex;justify-content:space-between;">
          <span style="font-size:15px;font-weight:600;color:#1E110A;">Total</span>
          <span style="font-size:18px;font-weight:700;color:#C9A84C;">${order.total.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      <!-- Paiement -->
      <p style="margin:0 0 24px;font-size:14px;color:#6B4F3A;">
        Mode de paiement : <strong style="color:#1E110A;">${payLabel}</strong>
        ${order.notes ? `<br><br>📝 <em>${order.notes}</em>` : ''}
      </p>

      <!-- CTA -->
      <a href="${adminUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#C9A84C,#E0BC6A);color:#1E110A;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:16px 24px;border-radius:8px;text-decoration:none;">
        Gérer la commande →
      </a>
    </div>

    <div style="padding:20px 36px;border-top:1px solid #F0E8D8;text-align:center;">
      <p style="margin:0;font-size:11px;color:#B8A090;">MIA DREAMS & CO — Tableau de bord admin</p>
    </div>
  </div>
</body>
</html>`;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_USER;

    // Envoyer en parallèle, sans bloquer la réponse
    await Promise.allSettled([
        sendWhatsApp(waMsg),
        sendEmail({
            to:      adminEmail,
            subject: `🛍️ Nouvelle commande ${order.order_number} — ${order.total.toLocaleString('fr-FR')} FCFA`,
            html:    emailHtml,
        }),
    ]);
}

module.exports = { notifyNewOrder };
