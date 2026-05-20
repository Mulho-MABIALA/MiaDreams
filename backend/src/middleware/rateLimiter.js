const rateLimit = require('express-rate-limit');

/** Message d'erreur standard */
const tooManyMsg = { message: 'Trop de tentatives. Réessayez dans quelques minutes.' };

/** Login : 10 tentatives / 15 min par IP */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/** Formulaires publics (contact, réservation) : 10 / 10 min par IP */
const formLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: tooManyMsg,
    standardHeaders: true,
    legacyHeaders: false,
});

/** Newsletter : 5 inscriptions / 10 min par IP */
const newsletterLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: tooManyMsg,
    standardHeaders: true,
    legacyHeaders: false,
});

/** API publique générale : 100 req / 1 min par IP */
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: tooManyMsg,
    standardHeaders: true,
    legacyHeaders: false,
});

/** Paiement : 20 req / 5 min par IP */
const paymentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: tooManyMsg,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, formLimiter, newsletterLimiter, apiLimiter, paymentLimiter };
