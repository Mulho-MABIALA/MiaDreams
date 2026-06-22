export default function TranslatedText({ text, as: Tag = 'span', className = '', fallback = '' }) {
    return <Tag className={className}>{text || fallback}</Tag>;
}

export function useTranslatedText(text) {
    return text || '';
}
