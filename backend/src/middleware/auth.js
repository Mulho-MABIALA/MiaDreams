const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'miadreams_jwt_secret_2024';

module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ message: 'Token manquant' });

    try {
        req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};
