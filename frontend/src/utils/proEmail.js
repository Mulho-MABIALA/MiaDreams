// Validation d'adresse e-mail professionnelle (miroir de backend/src/utils/proEmail.js).
// Un e-mail « pro » = format valide ET domaine qui n'est PAS un webmail gratuit/personnel.

const FREE_EMAIL_DOMAINS = new Set([
    'gmail.com', 'googlemail.com',
    'hotmail.com', 'hotmail.fr', 'hotmail.co.uk', 'hotmail.es', 'hotmail.it', 'hotmail.de', 'hotmail.be',
    'outlook.com', 'outlook.fr', 'outlook.es', 'outlook.de', 'outlook.it', 'outlook.be',
    'live.com', 'live.fr', 'live.co.uk', 'live.be', 'msn.com', 'windowslive.com',
    'yahoo.com', 'yahoo.fr', 'yahoo.co.uk', 'yahoo.es', 'yahoo.it', 'yahoo.de', 'yahoo.ca',
    'ymail.com', 'rocketmail.com',
    'icloud.com', 'me.com', 'mac.com',
    'aol.com', 'aol.fr',
    'protonmail.com', 'protonmail.ch', 'proton.me', 'pm.me',
    'gmx.com', 'gmx.fr', 'gmx.de', 'gmx.net', 'mail.com', 'email.com',
    'yandex.com', 'yandex.ru', 'mail.ru', 'inbox.ru', 'list.ru', 'bk.ru',
    'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr', 'laposte.net', 'bbox.fr',
    'neuf.fr', 'numericable.fr', 'aliceadsl.fr', 'club-internet.fr', 'voila.fr',
    'zoho.com', 'tutanota.com', 'tuta.io', 'tutamail.com', 'fastmail.com', 'hey.com',
    'yopmail.com', 'yopmail.fr', 'mailinator.com', 'guerrillamail.com', '10minutemail.com',
    'trashmail.com', 'temp-mail.org', 'getnada.com', 'sharklasers.com', 'maildrop.cc', 'jetable.org',
]);

const FREE_EMAIL_LABELS = new Set([
    'gmail', 'googlemail', 'yahoo', 'ymail', 'hotmail', 'outlook', 'live', 'msn',
    'icloud', 'aol', 'protonmail', 'proton', 'gmx', 'yandex',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
    return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

export function isProfessionalEmail(email) {
    if (!isValidEmail(email)) return false;
    const domain = email.trim().toLowerCase().split('@')[1];
    if (!domain) return false;
    if (FREE_EMAIL_DOMAINS.has(domain)) return false;
    const label = domain.split('.')[0];
    if (FREE_EMAIL_LABELS.has(label)) return false;
    return true;
}
