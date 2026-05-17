/**
 * Utilitaires de formatage partagés dans tout le frontend
 */

/** Formate un nombre en FCFA */
export const fmt = (n) =>
    Number(n || 0).toLocaleString('fr-FR') + ' FCFA';

/** Formate un nombre sans symbole monétaire */
export const fmtNumber = (n) =>
    Number(n || 0).toLocaleString('fr-FR');

/** Formate une date en format court français */
export const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

/** Formate une date avec l'heure */
export const fmtDateTime = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

/** Génère un slug depuis un texte */
export const toSlug = (str) =>
    str.toLowerCase().trim()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

/** Extrait l'ID YouTube depuis une URL complète ou un ID brut */
export const extractYoutubeId = (value) => {
    if (!value) return null;
    const v = value.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    try {
        const url = new URL(v);
        const param = url.searchParams.get('v');
        if (param) return param;
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length) return parts[parts.length - 1];
    } catch {}
    const m = v.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
};

/** Classes CSS communes pour les inputs admin */
export const inputCls = 'w-full bg-white border border-[#E5E7EB] text-[#374151] text-sm px-3 py-2.5 rounded-lg outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-colors placeholder:text-[#9CA3AF]';
