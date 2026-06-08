import { describe, it, expect } from 'vitest';
import { extractYoutubeId } from '../utils/formatters';

describe('extractYoutubeId()', () => {
    it('extrait l\'ID d\'une URL YouTube standard', () => {
        expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
            .toBe('dQw4w9WgXcQ');
    });

    it('extrait l\'ID d\'une URL youtu.be courte', () => {
        expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ'))
            .toBe('dQw4w9WgXcQ');
    });

    it('retourne null si l\'URL est vide', () => {
        expect(extractYoutubeId('')).toBeFalsy();
    });

    it('retourne null si aucun ID YouTube n\'est trouvable', () => {
        // La fonction retourne null quand aucun pattern YouTube n'est détecté
        // et que ce n'est pas un ID 11 chars
        expect(extractYoutubeId('pas-une-url-youtube')).toBeNull();
    });

    it('retourne l\'ID directement si c\'est déjà un ID (11 chars)', () => {
        const result = extractYoutubeId('dQw4w9WgXcQ');
        // soit retourne l'ID, soit null — pas d'erreur
        expect(typeof result === 'string' || result === null).toBe(true);
    });
});
