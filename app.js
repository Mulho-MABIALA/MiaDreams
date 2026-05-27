'use strict';

const fs   = require('fs');
const path = require('path');
const http = require('http');

// ─── Logging ──────────────────────────────────────────────────────────────
const LOG = path.join(__dirname, 'startup.log');
const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    try { fs.appendFileSync(LOG, line); } catch (_) {}
};

process.on('uncaughtException',  (e) => { log('UNCAUGHT: '  + e.stack); process.exit(1); });
process.on('unhandledRejection', (r) => { log('REJECTION: ' + (r && r.stack ? r.stack : String(r))); });
process.on('exit',   (code) => log('EXIT code=' + code));
process.on('SIGTERM', ()   => { log('SIGTERM'); process.exit(0); });

log('=== DÉMARRAGE v5 (chmod socket) ===');
log('PID=' + process.pid + ' | NODE=' + process.version);

const pEnv = Object.keys(process.env)
    .filter(k => k.startsWith('PASSENGER') || k === 'PORT' || k === 'NODE_ENV')
    .map(k => k + '=' + process.env[k]).join(' | ');
log('ENV: ' + pEnv);

const SPAWN_DIR = process.env.PASSENGER_SPAWN_WORK_DIR;

// ─── Patch http.Server.prototype.listen ───────────────────────────────────
// Stratégie v5 :
//   1. On laisse le module passenger npm créer son unix socket via _orig()
//      → il enverra "!" à Passenger depuis son propre handler 'listening'
//   2. On utilise prependOnceListener pour que NOTRE handler s'exécute
//      AVANT celui du module passenger
//   3. Dans notre handler : chmod 666 sur le socket AVANT que "!" soit envoyé
//   4. Quand Passenger reçoit "!" et se connecte, le socket est déjà accessible
//
// Pourquoi 666 ? Le socket est créé par l'utilisateur du domaine (ex: kariata),
// mais Apache/Passenger tourne en www-data. Sans chmod, www-data ne peut pas
// se connecter au socket (permission denied → "Primary script unknown").

const _orig = http.Server.prototype.listen;

http.Server.prototype.listen = function (...args) {
    const srv = this;

    // Appel du module passenger npm → crée unix socket, ajoute son handler
    const ret = _orig.apply(srv, args);

    // prependOnceListener : notre handler s'exécute AVANT le handler du module
    srv.prependOnceListener('listening', () => {
        const addr = srv.address();

        if (typeof addr === 'string') {
            // Unix socket créé par le module passenger
            log('Socket unix: ' + addr);

            // chmod 666 = lecture+écriture pour tous → www-data peut se connecter
            try {
                fs.chmodSync(addr, 0o666);
                log('✓ chmod 666: ' + addr);
            } catch (e) { log('✗ chmod socket: ' + e.message); }

            // Écriture du result file (redondant mais sécurise)
            if (SPAWN_DIR) {
                try {
                    fs.writeFileSync(path.join(SPAWN_DIR, 'result'), 'unix:' + addr + '\n');
                    log('✓ result file');
                } catch (e) { log('✗ result file: ' + e.message); }
            }

        } else if (addr && addr.port) {
            // Fallback TCP
            log('TCP: ' + addr.port);
            if (SPAWN_DIR) {
                try {
                    fs.writeFileSync(path.join(SPAWN_DIR, 'result'), 'tcp://127.0.0.1:' + addr.port + '\n');
                    log('✓ result file TCP');
                } catch (e) { log('✗ result file TCP: ' + e.message); }
            }
        }
        // Note : le handler du module passenger npm s'exécute APRÈS
        // et envoie "!" sur fd3 → Passenger accepte le spawn
    });

    return ret;
};

// ─── Chargement ────────────────────────────────────────────────────────────
log('Chargement backend/src/server.js...');
try {
    require('./backend/src/server.js');
    log('✓ server.js chargé');
} catch (e) {
    log('✗ ERREUR require: ' + e.stack);
    process.exit(1);
}

setTimeout(() => log('ALIVE 30s'),  30000);
setTimeout(() => log('ALIVE 60s'),  60000);
setTimeout(() => log('ALIVE 120s'), 120000);
setTimeout(() => log('ALIVE 180s'), 180000);
