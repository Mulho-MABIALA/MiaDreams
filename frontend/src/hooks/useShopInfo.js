import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Infos boutique affichées aux clients, réglables dans Admin → Paramètres :
 *   - WhatsApp (champ « WhatsApp », à défaut « Téléphone »)
 *   - texte Livraison / texte Moyens de paiement (section « Boutique »)
 * Si un texte n'est pas renseigné, on affiche le texte par défaut (translations/fr.js).
 */
export function useShopInfo() {
    const { companyInfo } = useApp() || {};
    const { t } = useLanguage();
    const whatsapp = (companyInfo?.whatsapp || companyInfo?.phone || '').trim();
    return {
        whatsapp,                                   // tel que saisi dans l'admin (affichage)
        waNumber: whatsapp.replace(/\D/g, ''),      // chiffres seuls pour wa.me
        delivery: (companyInfo?.shop_delivery || '').trim() || t('product_delivery'),
        payment:  (companyInfo?.shop_payment  || '').trim() || t('product_payment'),
    };
}

/** Lien WhatsApp avec message pré-rempli (null si aucun numéro n'est configuré). */
export function whatsappLink(waNumber, message) {
    if (!waNumber) return null;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}
