/**
 * Utilitaires de gestion d'erreurs centralisés pour les routes Express
 */

/** Répond avec une erreur structurée */
const apiError = (res, err, status = 500) => {
    console.error(err);
    res.status(status).json({ message: err?.message || String(err) });
};

/** Wrapper async — élimine les try/catch répétitifs dans les routes */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((err) => apiError(res, err));

module.exports = { apiError, asyncHandler };
