const jwt = require('jsonwebtoken');

/** Récupère le secret JWT — plante au démarrage si absent en production */
const getSecret = () => {
    if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET manquant en production !');
    }
    // Dev uniquement — avertissement visible
    console.warn('⚠️  JWT_SECRET non défini — utilisez un secret fort en production');
    return 'miadreams_dev_secret_change_me';
};

const JWT_SECRET = getSecret();

module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ message: 'Token manquant' });

    try {
        // Spécification explicite de l'algorithme → bloque l'attaque alg=none
        req.user = jwt.verify(header.split(' ')[1], JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports.JWT_SECRET = JWT_SECRET;
