import { describe, it, expect } from 'vitest';
import { imgSrc } from '../utils/imgSrc';

describe('imgSrc()', () => {
    it('retourne une chaîne vide si la valeur est null', () => {
        expect(imgSrc(null)).toBe('');
    });

    it('retourne une chaîne vide si la valeur est undefined', () => {
        expect(imgSrc(undefined)).toBe('');
    });

    it('retourne le fallback si la valeur est vide', () => {
        expect(imgSrc('', '/default.jpg')).toBe('/default.jpg');
    });

    it('retourne l\'URL Cloudinary telle quelle', () => {
        const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
        expect(imgSrc(url)).toBe(url);
    });

    it('retourne un chemin absolu tel quel', () => {
        expect(imgSrc('/img/logo.png')).toBe('/img/logo.png');
    });

    it('préfixe /uploads/ pour un nom de fichier local', () => {
        expect(imgSrc('mia-123456.webp')).toBe('/uploads/mia-123456.webp');
    });
});
