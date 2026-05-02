<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Message reçu — MIA DREAMS & CO</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#f0ece6; font-family:Arial,sans-serif; padding:40px 20px; }
        .wrapper { max-width:580px; margin:0 auto; background:#fff; }

        .header { background:#0d0d0d; padding:36px 40px; text-align:center; }
        .header-line { width:40px; height:1px; background:#C4A267; margin:0 auto 16px; }
        .header h1 { color:#fff; font-size:11px; letter-spacing:5px; text-transform:uppercase; margin-bottom:4px; }
        .header span { color:#C4A267; font-size:10px; letter-spacing:3px; }

        .body { padding:44px 40px; }
        .greeting { font-size:22px; color:#1a1a1a; margin-bottom:6px; font-weight:normal; }
        .gold-line { width:36px; height:2px; background:#C4A267; margin:18px 0; }
        .text { color:#666; font-size:14px; line-height:1.8; margin-bottom:16px; }

        .summary { background:#f8f5f0; border-left:3px solid #C4A267; padding:20px 24px; margin:24px 0; }
        .summary-label { font-size:10px; letter-spacing:3px; color:#C4A267; text-transform:uppercase; margin-bottom:14px; }
        .summary-row { display:flex; gap:12px; margin-bottom:10px; font-size:13px; }
        .summary-row strong { color:#1a1a1a; min-width:70px; }
        .summary-row span { color:#666; }

        .btn-wrap { text-align:center; margin:30px 0; }
        .btn { display:inline-block; background:#0d0d0d; color:#C4A267 !important;
               padding:14px 32px; text-decoration:none; font-size:11px;
               letter-spacing:3px; text-transform:uppercase; border:1px solid #C4A267; }

        .footer-mail { background:#0d0d0d; padding:24px 40px; text-align:center; }
        .footer-mail p { color:#555; font-size:11px; line-height:1.8; }
        .footer-mail a { color:#C4A267; text-decoration:none; }
    </style>
</head>
<body>
<div class="wrapper">

    {{-- Header --}}
    <div class="header">
        <div class="header-line"></div>
        <h1>MIA DREAMS & CO</h1>
        <span>Maison de Mode Africaine</span>
    </div>

    {{-- Body --}}
    <div class="body">
        <p class="greeting">Bonjour {{ $contactMessage->name }},</p>
        <div class="gold-line"></div>

        <p class="text">
            Nous avons bien reçu votre message et nous vous en remercions.
            Notre équipe prendra contact avec vous dans les plus brefs délais.
        </p>

        {{-- Récapitulatif --}}
        <div class="summary">
            <p class="summary-label">Récapitulatif de votre message</p>
            <div class="summary-row">
                <strong>Sujet</strong>
                <span>{{ $contactMessage->subject }}</span>
            </div>
            <div class="summary-row">
                <strong>Message</strong>
                <span>{{ Str::limit($contactMessage->message, 200) }}</span>
            </div>
            <div class="summary-row">
                <strong>Envoyé le</strong>
                <span>{{ now()->format('d/m/Y à H:i') }}</span>
            </div>
        </div>

        <p class="text">
            En attendant, n'hésitez pas à explorer nos collections et notre univers.
        </p>

        <div class="btn-wrap">
            <a href="{{ config('app.url') }}" class="btn">VISITER LE SITE →</a>
        </div>

        <p class="text" style="font-size:13px;color:#999;">
            Si vous n'êtes pas à l'origine de ce message, veuillez ignorer cet email.
        </p>
    </div>

    {{-- Footer --}}
    <div class="footer-mail">
        <p>
            <strong style="color:#C4A267;">MIA DREAMS & CO</strong><br>
            3 rue Bégenger Ferraud, CTIC DAKAR, Sénégal<br>
            <a href="mailto:contact@mia-dreams.com">contact@mia-dreams.com</a> · +221 76 463 91 69
        </p>
    </div>

</div>
</body>
</html>
