/**
 * Retourne l'URL correcte d'une image/fichier selon son origine :
 * - URL Cloudinary (https://...) → retournée telle quelle
 * - Chemin absolu (/...) → retourné tel quel
 * - Nom de fichier local → préfixé avec /uploads/
 * - Valeur vide/null → chaîne vide
 */
export const imgSrc = (val, fallback = '') => {
    if (!val) return fallback;
    if (val.startsWith('http') || val.startsWith('/')) return val;
    return `/uploads/${val}`;
};

export default imgSrc;
