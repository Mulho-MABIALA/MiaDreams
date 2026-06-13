import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Composant pour traduire dynamiquement le contenu de la BDD
// Usage: <TranslatedText text={product.description} />
export default function TranslatedText({ text, as: Tag = 'span', className = '', fallback = '' }) {
    const { lang, translate } = useLanguage();
    const [translated, setTranslated] = useState(text || fallback);

    useEffect(() => {
        if (!text) { setTranslated(fallback); return; }
        if (lang === 'fr') { setTranslated(text); return; }
        let cancelled = false;
        translate(text).then(result => {
            if (!cancelled) setTranslated(result);
        });
        return () => { cancelled = true; };
    }, [text, lang]);

    return <Tag className={className}>{translated}</Tag>;
}

// Hook version pour usage dans des expressions JSX plus complexes
export function useTranslatedText(text) {
    const { lang, translate } = useLanguage();
    const [translated, setTranslated] = useState(text || '');

    useEffect(() => {
        if (!text) { setTranslated(''); return; }
        if (lang === 'fr') { setTranslated(text); return; }
        let cancelled = false;
        translate(text).then(result => {
            if (!cancelled) setTranslated(result);
        });
        return () => { cancelled = true; };
    }, [text, lang]);

    return translated;
}
