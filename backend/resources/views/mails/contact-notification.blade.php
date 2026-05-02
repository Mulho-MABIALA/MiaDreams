<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message contact</title>
    <style>
        body { margin:0; padding:0; background:#f4f4f4; font-family:Arial,sans-serif; }
        .wrapper { max-width:600px; margin:30px auto; background:#fff; }
        .header { background:#1a1a1a; padding:30px 40px; }
        .header h1 { color:#C4A267; font-size:13px; letter-spacing:4px; margin:0; }
        .header p { color:#888; font-size:12px; margin:5px 0 0; }
        .body { padding:35px 40px; }
        .badge { display:inline-block; background:#C4A267; color:#1a1a1a; padding:4px 12px; font-size:11px; letter-spacing:2px; font-weight:bold; margin-bottom:20px; }
        .field { margin-bottom:18px; border-bottom:1px solid #f0f0f0; padding-bottom:18px; }
        .field label { font-size:11px; letter-spacing:2px; color:#999; text-transform:uppercase; display:block; margin-bottom:4px; }
        .field p { font-size:15px; color:#1a1a1a; margin:0; line-height:1.6; }
        .message-box { background:#f8f5f0; border-left:3px solid #C4A267; padding:18px 20px; margin-top:5px; }
        .message-box p { font-size:14px; color:#333; margin:0; line-height:1.7; white-space:pre-line; }
        .footer-mail { background:#1a1a1a; padding:20px 40px; margin-top:0; }
        .footer-mail p { color:#666; font-size:11px; margin:0; }
        .btn { display:inline-block; background:#C4A267; color:#1a1a1a !important; padding:12px 25px; text-decoration:none; font-size:11px; letter-spacing:2px; font-weight:bold; margin-top:20px; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>MIA DREAMS & CO</h1>
        <p>Nouveau message reçu via le formulaire de contact</p>
    </div>
    <div class="body">
        <div class="badge">NOUVEAU MESSAGE</div>

        <div class="field">
            <label>Nom</label>
            <p>{{ $contactMessage->name }}</p>
        </div>

        <div class="field">
            <label>Email</label>
            <p><a href="mailto:{{ $contactMessage->email }}" style="color:#C4A267;">{{ $contactMessage->email }}</a></p>
        </div>

        @if($contactMessage->phone)
        <div class="field">
            <label>Téléphone</label>
            <p>{{ $contactMessage->phone }}</p>
        </div>
        @endif

        <div class="field">
            <label>Sujet</label>
            <p>{{ $contactMessage->subject }}</p>
        </div>

        <div class="field" style="border:none; padding-bottom:0;">
            <label>Message</label>
            <div class="message-box">
                <p>{{ $contactMessage->message }}</p>
            </div>
        </div>

        <a href="{{ config('app.url') }}/admin/contact-messages" class="btn">
            VOIR DANS LE DASHBOARD →
        </a>
    </div>
    <div class="footer-mail">
        <p>MIA DREAMS & CO — Dakar, Sénégal | Message reçu le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>
</div>
</body>
</html>
