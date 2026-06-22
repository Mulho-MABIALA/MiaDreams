import { createContext, useContext, useCallback } from 'react';
import fr from '../translations/fr';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const t = useCallback((key, vars = {}) => {
        let str = fr[key] ?? key;
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, v);
        });
        return str;
    }, []);

    const translate = useCallback(async (text) => text, []);

    return (
        <LanguageContext.Provider value={{ lang: 'fr', toggleLang: () => {}, t, translate }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
