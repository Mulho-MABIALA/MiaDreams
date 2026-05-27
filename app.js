'use strict';

const fs   = require('fs');
const path = require('path');
const http = require('http');
const net  = require('net');

// ─── Logging ──────────────────────────────────────────────────────────────
const LOG = path.join(__dirname, 'startup.log');
const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    try { fs.appendFileSync(LOG, line); } catch (_) {}
};

process.on('uncaughtException',  (e) => { log('UNCAUGHT: '  + e.stack); process.exit(1); });
process.on('unhandledRejection', (r) => { log('REJECTION: ' + (r && r.stack ? r.stack : String(r))); });
process.on('exit',   (code) => log('EXIT code=' + code));
process.on('SIGTERM', ()   => { log('SIGTERM reçu'); process.exit(0); });

log('=== DÉMARRAGE v4 (net bypass) ===');
log('PID=' + process.pid + ' | NODE=' + process.version);

const pEnv = Object.keys(process.env)
    .filter(k => k.startsWith('PASSENGER') || k === 'PORT' || k === 'NODE_ENV')
    .map(k => k + '=' + process.env[k]).join(' | ');
log('ENV: ' + pEnv);

const SPAWN_DIR  = process.env.PASSENGER_SPAWN_WORK_DIR;
const FORCE_PORT = 5000;

// ─── Signalisation Passenger ───────────────────────────────────────────────
function signalPassenger(addressStr) {
    log('Signal → ' + addressStr);
    if (SPAWN_DIR) {
        try {
            fs.writeFileSync(path.join(SPAWN_DIR, 'result'), addressStr + '\n');
            log('✓ result file écrit');
        } catch (e) { log('✗ result file: ' + e.message); }
    } else {
        log('⚠ SPAWN_DIR absent — pas de result file');
    }
}

// ─── Bypass du module passenger npm ───────────────────────────────────────
// Le module passenger npm shadowe http.Server.prototype.listen pour forcer
// un unix socket (créé par Passenger, accessible uniquement par son user).
// http.Server hérite de net.Server → net.Server.prototype.listen N'est PAS
// patché par passenger. On l'appelle directement pour forcer TCP 5000.

const _netListen = net.Server.prototype.listen;  // original Node.js, jamais modifié
let _signaled = false;

http.Server.prototype.listen = function (...args) {
    const srv = this;
    log('listen() intercepté (args[0]=' + JSON.stringify(args[0]) + ') → TCP ' + FORCE_PORT);

    // Appel DIRECT à net.Server.prototype.listen — bypasse passenger npm
    const ret = _netListen.call(srv, FORCE_PORT, '127.0.0.1');

    srv.once('listening', () => {
        if (_signaled) return;
        _signaled = true;
        const addr = srv.address();
        const str  = (addr && addr.port)
            ? 'tcp://127.0.0.1:' + addr.port
            : 'tcp://127.0.0.1:' + FORCE_PORT;
        signalPassenger(str);
    });

    return ret;
};

// ─── Chargement ────────────────────────────────────────────────────────────
process.env.PORT = String(FORCE_PORT);
log('PORT forcé à ' + FORCE_PORT);
log('Chargement backend/src/server.js...');

try {
    require('./backend/src/server.js');
    log('✓ server.js chargé — en attente de listen()');
} catch (e) {
    log('✗ ERREUR require: ' + e.stack);
    process.exit(1);
}

setTimeout(() => log('ALIVE 30s'), 30000);
setTimeout(() => log('ALIVE 60s'), 60000);
