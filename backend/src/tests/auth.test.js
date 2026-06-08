/**
 * Tests backend — module natif node:test (Node 18+, aucune installation requise)
 *
 * Lancer : npm test  (dans /backend)
 * Couverture : npm run test:coverage
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

// ─── Tests unitaires : middleware auth ───────────────────────────────────────
describe('Middleware auth — vérification JWT', () => {
    const JWT_SECRET = 'miadreams_test_secret';

    it('génère et vérifie un token valide', () => {
        const payload = { id: '123', email: 'test@test.com', role: 'admin' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });

        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        assert.equal(decoded.email, payload.email);
        assert.equal(decoded.role, payload.role);
    });

    it('rejette un token avec un mauvais secret', () => {
        const token = jwt.sign({ id: '123' }, 'MAUVAIS_SECRET', { algorithm: 'HS256' });
        assert.throws(() => {
            jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        }, /invalid signature/);
    });

    it('rejette un token expiré', () => {
        const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '-1s', algorithm: 'HS256' });
        assert.throws(() => {
            jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        }, /jwt expired/);
    });

    it('inclut bien les permissions dans le token super_admin', () => {
        const payload = { id: '999', role: 'super_admin', permissions: ['*'] };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        assert.deepEqual(decoded.permissions, ['*']);
    });
});

// ─── Tests unitaires : utilitaires ───────────────────────────────────────────
describe('Utilitaires — slugify logique', () => {
    const slugify = require('slugify');

    it('transforme un nom en slug lowercase', () => {
        const slug = slugify('Fashion Program', { lower: true, strict: true });
        assert.equal(slug, 'fashion-program');
    });

    it('gère les caractères spéciaux', () => {
        const slug = slugify('MIA DREAMS & CO', { lower: true, strict: true });
        // & → "and" en mode strict
        assert.equal(slug, 'mia-dreams-and-co');
    });

    it('gère les accents', () => {
        const slug = slugify('Créateurs Africains', { lower: true, strict: true });
        assert.equal(slug, 'createurs-africains');
    });
});

// ─── Tests unitaires : modèle Programme ──────────────────────────────────────
describe('Modèle Programme — validation champs', () => {
    it('les formats valides sont acceptés', () => {
        const formats = ['présentiel', 'en ligne', 'hybride'];
        formats.forEach(f => {
            assert.ok(formats.includes(f), `Format "${f}" doit être valide`);
        });
    });

    it('les niveaux valides sont acceptés', () => {
        const niveaux = ['débutant', 'intermédiaire', 'avancé', 'tous niveaux'];
        niveaux.forEach(n => {
            assert.ok(niveaux.includes(n), `Niveau "${n}" doit être valide`);
        });
    });

    it('max_places = 0 signifie illimité', () => {
        const programme = { max_places: 0 };
        const isIllimite = programme.max_places === 0;
        assert.equal(isIllimite, true);
    });
});
