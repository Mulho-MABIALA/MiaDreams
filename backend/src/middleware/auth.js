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
    // Cherche le token dans plusieurs sources (ordre de priorité) :
    // 1. Header Authorization standard (peut être bloqué par Apache)
    // 2. Header X-Admin-Token personnalisé (passe toujours via Apache/Passenger)
    // 3. Variable env HTTP_AUTHORIZATION (injectée par la règle RewriteRule .htaccess)
    const authHeader =
        req.headers['authorization'] ||
        req.headers['x-admin-token'] ||
        (req.headers['http_authorization']) ||
        '';

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader || null;

    if (!token)
        return res.status(401).json({ message: 'Token manquant' });

    try {
        req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        next();
    } catch {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports.JWT_SECRET = JWT_SECRET;
