// Validation d'adresse e-mail professionnelle.
// Un e-mail « pro » = format valide ET domaine qui n'est PAS un webmail gratuit/personnel.
// Utilisé pour le téléchargement des rapports d'activité.

// Domaines gratuits/personnels explicitement refusés (variantes localisées incluses)
const FREE_EMAIL_DOMAINS = new Set([
    // Google
    'gmail.com', 'googlemail.com',
    // Microsoft
    'hotmail.com', 'hotmail.fr', 'hotmail.co.uk', 'hotmail.es', 'hotmail.it', 'hotmail.de', 'hotmail.be',
    'outlook.com', 'outlook.fr', 'outlook.es', 'outlook.de', 'outlook.it', 'outlook.be',
    'live.com', 'live.fr', 'live.co.uk', 'live.be', 'msn.com', 'windowslive.com',
    // Yahoo
    'yahoo.com', 'yahoo.fr', 'yahoo.co.uk', 'yahoo.es', 'yahoo.it', 'yahoo.de', 'yahoo.ca',
    'ymail.com', 'rocketmail.com',
    // Apple
    'icloud.com', 'me.com', 'mac.com',
    // AOL
    'aol.com', 'aol.fr',
    // Proton
    'protonmail.com', 'protonmail.ch', 'proton.me', 'pm.me',
    // GMX / Mail.com
    'gmx.com', 'gmx.fr', 'gmx.de', 'gmx.net', 'mail.com', 'email.com',
    // Yandex / Russie
    'yandex.com', 'yandex.ru', 'mail.ru', 'inbox.ru', 'list.ru', 'bk.ru',
    // FAI français (adresses perso)
    'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr', 'laposte.net', 'bbox.fr',
    'neuf.fr', 'numericable.fr', 'aliceadsl.fr', 'club-internet.fr', 'voila.fr',
    // Autres webmails perso
    'zoho.com', 'tutanota.com', 'tuta.io', 'tutamail.com', 'fastmail.com', 'hey.com',
    // Jetables courants
    'yopmail.com', 'yopmail.fr', 'mailinator.com', 'guerrillamail.com', '10minutemail.com',
    'trashmail.com', 'temp-mail.org', 'getnada.com', 'sharklasers.com', 'maildrop.cc', 'jetable.org',
]);

// Marques toujours personnelles quel que soit le TLD (yahoo.xx, hotmail.xx, gmail.xx…)
const FREE_EMAIL_LABELS = new Set([
    'gmail', 'googlemail', 'yahoo', 'ymail', 'hotmail', 'outlook', 'live', 'msn',
    'icloud', 'aol', 'protonmail', 'proton', 'gmx', 'yandex',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
    return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

function isProfessionalEmail(email) {
    if (!isValidEmail(email)) return false;
    const domain = email.trim().toLowerCase().split('@')[1];
    if (!domain) return false;
    if (FREE_EMAIL_DOMAINS.has(domain)) return false;
    // Label de second niveau (ex. « yahoo » dans yahoo.fr)
    const label = domain.split('.')[0];
    if (FREE_EMAIL_LABELS.has(label)) return false;
    return true;
}

module.exports = { isValidEmail, isProfessionalEmail, FREE_EMAIL_DOMAINS, FREE_EMAIL_LABELS };
