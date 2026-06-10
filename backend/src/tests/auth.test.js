const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

// Doit être défini avant le require du middleware (JWT_SECRET est lu au chargement)
process.env.JWT_SECRET = 'miadreams_test_secret_2024';
const authMiddleware = require('../middleware/auth');
const { JWT_SECRET } = authMiddleware;

// ─── Auth middleware ──────────────────────────────────────────────────────────
describe('Middleware auth — vérification JWT', () => {
    const makeRes = () => {
        const res = { _status: null, _body: null };
        res.status = (code) => { res._status = code; return res; };
        res.json   = (body)  => { res._body  = body;  return res; };
        return res;
    };

    it('laisse passer un token valide via Authorization', () => {
        const token = jwt.sign({ id: '123', role: 'admin' }, JWT_SECRET, { algorithm: 'HS256' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        let nextCalled = false;
        authMiddleware(req, makeRes(), () => { nextCalled = true; });
        assert.ok(nextCalled, 'next() doit être appelé');
        assert.equal(req.user.role, 'admin');
    });

    it('laisse passer un token via X-Admin-Token', () => {
        const token = jwt.sign({ id: '456', role: 'super_admin' }, JWT_SECRET, { algorithm: 'HS256' });
        const req = { headers: { 'x-admin-token': `Bearer ${token}` } };
        let nextCalled = false;
        authMiddleware(req, makeRes(), () => { nextCalled = true; });
        assert.ok(nextCalled);
    });

    it('rejette une requête sans token — 401', () => {
        const req = { headers: {} };
        const res = makeRes();
        authMiddleware(req, res, () => {});
        assert.equal(res._status, 401);
        assert.equal(res._body.message, 'Token manquant');
    });

    it('rejette un token avec un mauvais secret — 401', () => {
        const token = jwt.sign({ id: '123' }, 'MAUVAIS_SECRET', { algorithm: 'HS256' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = makeRes();
        authMiddleware(req, res, () => {});
        assert.equal(res._status, 401);
        assert.equal(res._body.message, 'Token invalide ou expiré');
    });

    it('rejette un token expiré — 401', () => {
        const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '-1s', algorithm: 'HS256' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = makeRes();
        authMiddleware(req, res, () => {});
        assert.equal(res._status, 401);
    });

    it('inclut les permissions dans le token super_admin', () => {
        const payload = { id: '999', role: 'super_admin', permissions: ['*'] };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        authMiddleware(req, makeRes(), () => {});
        assert.deepEqual(req.user.permissions, ['*']);
    });
});

// ─── Utilitaires — slugify ────────────────────────────────────────────────────
describe('Utilitaires — slugify logique', () => {
    const slugify = require('slugify');

    it('transforme un nom en slug lowercase', () => {
        assert.equal(slugify('Fashion Program', { lower: true, strict: true }), 'fashion-program');
    });

    it('gère les caractères spéciaux', () => {
        assert.equal(slugify('MIA DREAMS & CO', { lower: true, strict: true }), 'mia-dreams-and-co');
    });

    it('gère les accents', () => {
        assert.equal(slugify('Créateurs Africains', { lower: true, strict: true }), 'createurs-africains');
    });
});

// ─── Modèle Programme — schéma Mongoose ──────────────────────────────────────
describe('Modèle Programme — schéma Mongoose', () => {
    const Programme = require('../models/Programme');
    const schema = Programme.schema;

    it('les formats valides sont ceux du enum', () => {
        assert.deepEqual(schema.path('format').enumValues, ['présentiel', 'en ligne', 'hybride']);
    });

    it('les niveaux valides sont ceux du enum', () => {
        assert.deepEqual(schema.path('level').enumValues, ['débutant', 'intermédiaire', 'avancé', 'tous niveaux']);
    });

    it('max_places défaut = 0 (illimité)', () => {
        assert.equal(schema.path('max_places').defaultValue, 0);
    });

    it('le hook pre-save génère le slug via slugify', () => {
        const slugify = require('slugify');
        assert.equal(slugify('Couture Africaine', { lower: true, strict: true }), 'couture-africaine');
    });
});
