'use strict';

/**
 * Route : POST /api/deploy
 *
 * Webhook GitHub — déclenché automatiquement à chaque push sur main.
 * Enchaîne :
 *   1. Vérification signature HMAC-SHA256 (GitHub → GITHUB_WEBHOOK_SECRET)
 *   2. git pull origin main
 *   3. npm install + npm run build  (reconstruit frontend/dist/)
 *   4. touch tmp/restart.txt        (Passenger redémarre le process Node.js)
 *
 * Tout est journalisé dans /httpdocs/deploy.log
 */

const express  = require('express');
const router   = express.Router();
const crypto   = require('crypto');
const { exec } = require('child_process');
const fs       = require('fs');
const path     = require('path');

// Racine du projet sur le serveur (/httpdocs/)
const APP_ROOT = path.resolve(__dirname, '../../../');
const LOG_FILE = path.join(APP_ROOT, 'deploy.log');
const TMP_DIR  = path.join(APP_ROOT, 'tmp');

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    try { fs.appendFileSync(LOG_FILE, line); } catch (_) {}
    console.log('[deploy]', msg);
}

// ── POST /api/deploy ──────────────────────────────────────────────────────────
router.post('/', (req, res) => {

    // 0. Secret configuré ?
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
        log('ERREUR: GITHUB_WEBHOOK_SECRET absent des variables d\'environnement');
        return res.status(500).json({ message: 'Webhook secret non configuré côté serveur' });
    }

    // 1. Vérification signature HMAC-SHA256
    const sigHeader = req.headers['x-hub-signature-256'];
    if (!sigHeader) {
        return res.status(400).json({ message: 'En-tête X-Hub-Signature-256 manquant' });
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
        return res.status(400).json({ message: 'Corps brut non disponible (rawBody manquant)' });
    }

    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    let valid = false;
    try {
        valid = crypto.timingSafeEqual(Buffer.from(sigHeader), Buffer.from(expected));
    } catch (_) { /* longueurs différentes → invalid */ }

    if (!valid) {
        log('ERREUR: Signature invalide — requête rejetée');
        return res.status(401).json({ message: 'Signature invalide' });
    }

    // 2. Ignorer les pushs sur les branches autres que main
    const ref = req.body?.ref || '';
    if (ref && ref !== 'refs/heads/main') {
        return res.json({ message: `Branche ignorée : ${ref}` });
    }

    // 3. Répondre IMMÉDIATEMENT à GitHub (timeout 10 s côté GitHub)
    const commitSha = (req.body?.after || 'inconnu').substring(0, 7);
    res.json({ message: 'Déploiement démarré', commit: commitSha });

    // ── Déploiement en arrière-plan ───────────────────────────────────────────
    log(`=== DÉPLOIEMENT DÉCLENCHÉ (commit ${commitSha}) ===`);

    // Créer tmp/ si absent
    if (!fs.existsSync(TMP_DIR)) {
        try { fs.mkdirSync(TMP_DIR, { recursive: true }); } catch (_) {}
    }

    // Trouver npm (même dossier que l'exécutable node)
    const npmBin = path.join(path.dirname(process.execPath), 'npm');
    const npm    = fs.existsSync(npmBin) ? `"${npmBin}"` : 'npm';

    const commands = [
        // Récupérer le dernier code
        `git -C "${APP_ROOT}" pull origin main`,
        // Installer les dépendances frontend si nécessaire + rebuilder
        `cd "${APP_ROOT}/frontend" && ${npm} install --prefer-offline 2>&1 && ${npm} run build 2>&1`,
    ].join(' && ');

    log(`Commandes : ${commands}`);

    exec(commands, {
        cwd:     APP_ROOT,
        env:     { ...process.env },
        timeout: 5 * 60 * 1000, // 5 min max
        shell:   true,
    }, (err, stdout, stderr) => {
        if (err) {
            log(`❌ ÉCHEC :\n${stderr || err.message}`);
            return;
        }

        if (stdout) log(`Sortie :\n${stdout.trim()}`);

        // 4. Toucher tmp/restart.txt → Passenger redémarre l'app Node.js
        const restartFile = path.join(TMP_DIR, 'restart.txt');
        try {
            fs.writeFileSync(restartFile, new Date().toISOString() + '\n');
            log('✅ Déploiement réussi — restart.txt touché, Passenger va redémarrer l\'app');
        } catch (e) {
            log(`⚠️  restart.txt impossible (${e.message}) — redémarrage forcé dans 3 s`);
            setTimeout(() => {
                log('Redémarrage forcé via process.exit(0)');
                process.exit(0);
            }, 3000);
        }
    });
});

// ── GET /api/deploy/status — vérifie que le webhook est actif ─────────────────
router.get('/status', (req, res) => {
    let lastLines = '';
    try {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        lastLines = content.split('\n').filter(Boolean).slice(-20).join('\n');
    } catch (_) { lastLines = '(aucun log disponible)'; }
    res.json({ status: 'ok', log: lastLines });
});

module.exports = router;
