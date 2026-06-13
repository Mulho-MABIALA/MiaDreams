import { createContext, useContext, useState, useCallback, useRef } from 'react';
import fr from '../translations/fr';
import en from '../translations/en';

const LanguageContext = createContext(null);

// Cache en mémoire pour éviter les appels API répétés
const translationCache = {};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem('mia_lang') || 'fr');

    const toggleLang = () => {
        const next = lang === 'fr' ? 'en' : 'fr';
        setLang(next);
        localStorage.setItem('mia_lang', next);
    };

    // Traduction statique (UI)
    const t = useCallback((key, vars = {}) => {
        const dict = lang === 'fr' ? fr : en;
        let str = dict[key] ?? fr[key] ?? key;
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, v);
        });
        return str;
    }, [lang]);

    // Traduction dynamique (contenu base de données) via MyMemory
    const translate = useCallback(async (text) => {
        if (!text || lang === 'fr') return text;
        const cacheKey = `${text.slice(0, 120)}`;
        if (translationCache[cacheKey]) return translationCache[cacheKey];
        try {
            const res = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=fr|en`
            );
            const data = await res.json();
            const translated = data.responseData?.translatedText || text;
            translationCache[cacheKey] = translated;
            return translated;
        } catch {
            return text;
        }
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t, translate }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
