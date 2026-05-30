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
    cinetpay:     '💳 Paiement en ligne',
    cash:         '💵 Paiement à la livraison',
};

const ORDER_STATUS_INFO = {
    pending:    { label: 'En attente',     emoji: '⏳', color: '#C9A84C', msg: 'Votre commande est en attente de traitement.' },
    confirmed:  { label: 'Confirmée',      emoji: '✅', color: '#7C9A84', msg: 'Votre commande a été confirmée et sera bientôt préparée.' },
    processing: { label: 'En préparation', emoji: '📦', color: '#9A847C', msg: 'Votre commande est en cours de préparation.' },
    shipped:    { label: 'En livraison',   emoji: '🚚', color: '#7C849A', msg: 'Votre commande est en route vers vous !' },
    delivered:  { label: 'Livrée',         emoji: '🎉', color: '#7C9A84', msg: 'Votre commande a été livrée. Merci pour votre confiance !' },
    cancelled:  { label: 'Annulée',        emoji: '❌', color: '#9A7C7C', msg: 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.' },
};

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mia-dreams.com';

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

// ── EMAIL CONFIRMATION COMMANDE (→ client) ────────────────────────────────────
async function notifyOrderConfirmation(order) {
    if (!order.customer?.email) return;
    const trackUrl  = `${FRONTEND_URL}/commande/suivi/${order.order_number}`;
    const payLabel  = PAYMENT_LABELS[order.payment_method] || order.payment_method;
    const dateStr   = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const shipping  = order.shipping_fee || 0;

    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">
  <div style="background:linear-gradient(135deg,#1a0f07 0%,#2D1B0E 60%,#4A2C18 100%);padding:36px;text-align:center;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:5px;color:rgba(201,168,76,.6);text-transform:uppercase;">MIA DREAMS & CO</p>
    <h1 style="margin:0 0 6px;font-size:26px;font-weight:300;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Merci !</h1>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,.4);">Votre commande a bien été reçue</p>
  </div>
  <div style="padding:32px 36px;">
    <div style="background:#FDF8F2;border-left:4px solid #C9A84C;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:28px;">
      <p style="margin:0 0 3px;font-size:10px;letter-spacing:2px;color:#9E8272;text-transform:uppercase;">Numéro de commande</p>
      <p style="margin:0;font-size:22px;font-weight:700;color:#C9A84C;">${order.order_number}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#9E8272;">${dateStr}</p>
    </div>
    <p style="margin:0 0 20px;font-size:14px;color:#6B4F3A;">Bonjour <strong>${order.customer.name}</strong>,<br><br>
    Nous avons bien reçu votre commande et elle est en cours de traitement. Vous recevrez un email à chaque étape de votre livraison.</p>
    <h2 style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#9E8272;text-transform:uppercase;font-weight:600;">Articles commandés</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <thead><tr style="background:#FDF8F2;">
        <th style="padding:8px 12px;text-align:left;font-size:10px;letter-spacing:1.5px;color:#9E8272;text-transform:uppercase;">Article</th>
        <th style="padding:8px 12px;text-align:center;font-size:10px;letter-spacing:1.5px;color:#9E8272;text-transform:uppercase;">Qté</th>
        <th style="padding:8px 12px;text-align:right;font-size:10px;letter-spacing:1.5px;color:#9E8272;text-transform:uppercase;">Prix</th>
      </tr></thead>
      <tbody>${formatItemsHtml(order.items)}</tbody>
    </table>
    <div style="background:#FDF8F2;border-radius:8px;padding:16px 18px;margin-bottom:24px;">
      ${shipping > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:13px;color:#9E8272;">Sous-total</span><span style="font-size:13px;color:#6B4F3A;">${order.subtotal.toLocaleString('fr-FR')} FCFA</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="font-size:13px;color:#9E8272;">Livraison</span><span style="font-size:13px;color:#6B4F3A;">${shipping.toLocaleString('fr-FR')} FCFA</span></div>` : ''}
      <div style="border-top:1px solid #e8d8c4;padding-top:10px;display:flex;justify-content:space-between;">
        <span style="font-size:15px;font-weight:600;color:#1E110A;">Total</span>
        <span style="font-size:18px;font-weight:700;color:#C9A84C;">${order.total.toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>
    <p style="margin:0 0 8px;font-size:13px;color:#6B4F3A;">Mode de paiement : <strong>${payLabel}</strong></p>
    ${order.customer.address ? `<p style="margin:0 0 24px;font-size:13px;color:#6B4F3A;">Livraison à : <strong>${order.customer.address}, ${order.customer.city}</strong></p>` : '<br>'}
    <a href="${trackUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#C9A84C,#E0BC6A);color:#1E110A;font-weight:700;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:18px 24px;border-radius:8px;text-decoration:none;margin-bottom:12px;">
      SUIVRE MA COMMANDE →
    </a>
  </div>
  <div style="padding:20px 36px;border-top:1px solid #F0E8D8;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#B8A090;">Des questions ? Contactez-nous sur WhatsApp</p>
    <p style="margin:0;font-size:10px;color:#C8B8A0;">MIA DREAMS & CO · Mode Africaine d'Excellence</p>
  </div>
</div></body></html>`;

    await sendEmail({
        to:      order.customer.email,
        subject: `✅ Commande ${order.order_number} confirmée — MIA DREAMS`,
        html,
    });
}

// ── EMAIL MISE À JOUR STATUT (→ client) ───────────────────────────────────────
async function notifyStatusUpdate(order) {
    if (!order.customer?.email) return;
    const info     = ORDER_STATUS_INFO[order.order_status];
    if (!info) return;
    // N'envoyer que pour les statuts importants (pas "pending" qui est l'état initial)
    if (order.order_status === 'pending') return;

    const trackUrl = `${FRONTEND_URL}/commande/suivi/${order.order_number}`;

    const STEPS = ['pending','confirmed','processing','shipped','delivered'];
    const currentIdx = STEPS.indexOf(order.order_status);

    const stepsHtml = STEPS.map((s, i) => {
        const si = ORDER_STATUS_INFO[s];
        const done    = i < currentIdx;
        const current = i === currentIdx;
        const bg      = current ? '#C9A84C' : done ? '#7C9A84' : '#F0E8D8';
        const textCol = (current || done) ? '#fff' : '#B8A090';
        const labelCol = current ? '#C9A84C' : done ? '#7C9A84' : '#B8A090';
        return `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;">
            <div style="width:32px;height:32px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">
                <span style="color:${textCol};">${done ? '✓' : si.emoji}</span>
            </div>
            <span style="font-size:${current ? '15px' : '13px'};font-weight:${current ? '700' : '400'};color:${labelCol};">${si.label}</span>
            ${current ? `<span style="font-size:10px;background:#C9A84C20;color:#C9A84C;padding:3px 8px;border-radius:4px;letter-spacing:1px;text-transform:uppercase;">Actuel</span>` : ''}
        </div>`;
    }).join('');

    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(45,27,14,.10);">
  <div style="background:linear-gradient(135deg,#1a0f07 0%,#2D1B0E 60%,#4A2C18 100%);padding:36px;text-align:center;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:5px;color:rgba(201,168,76,.6);text-transform:uppercase;">MIA DREAMS & CO</p>
    <p style="margin:0 0 4px;font-size:32px;">${info.emoji}</p>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:2px;">${info.label}</h1>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,.4);">Commande ${order.order_number}</p>
  </div>
  <div style="padding:32px 36px;">
    <p style="margin:0 0 24px;font-size:15px;color:#3D2214;line-height:1.7;">Bonjour <strong>${order.customer.name}</strong>,<br><br>${info.msg}</p>
    <div style="background:#FDF8F2;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <h2 style="margin:0 0 14px;font-size:11px;letter-spacing:2px;color:#9E8272;text-transform:uppercase;font-weight:600;">Suivi de votre commande</h2>
      ${stepsHtml}
    </div>
    ${order.order_status === 'cancelled' ? '' : `
    <a href="${trackUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#C9A84C,#E0BC6A);color:#1E110A;font-weight:700;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:18px 24px;border-radius:8px;text-decoration:none;margin-bottom:12px;">
      VOIR LE DÉTAIL DE MA COMMANDE →
    </a>`}
  </div>
  <div style="padding:20px 36px;border-top:1px solid #F0E8D8;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#B8A090;">Des questions ? Contactez-nous sur WhatsApp</p>
    <p style="margin:0;font-size:10px;color:#C8B8A0;">MIA DREAMS & CO · Mode Africaine d'Excellence</p>
  </div>
</div></body></html>`;

    await sendEmail({
        to:      order.customer.email,
        subject: `${info.emoji} Commande ${order.order_number} : ${info.label} — MIA DREAMS`,
        html,
    });
}

module.exports = { notifyNewOrder, notifyOrderConfirmation, notifyStatusUpdate };
