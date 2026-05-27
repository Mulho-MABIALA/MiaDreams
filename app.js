'use strict';

const fs   = require('fs');
const path = require('path');
const http = require('http');
const cp   = require('child_process');

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

log('=== DÉMARRAGE APP.JS ===');
log('PID=' + process.pid + ' | NODE=' + process.version);

// Dump de TOUS les env vars Passenger
const pEnv = Object.keys(process.env)
    .filter(k => k.startsWith('PASSENGER') || k === 'PORT' || k === 'NODE_ENV' || k === 'SOCKET_PATH')
    .map(k => k + '=' + process.env[k]).join(' | ');
log('ENV: ' + pEnv);

const SPAWN_DIR = process.env.PASSENGER_SPAWN_WORK_DIR;
const FORCE_PORT = 5000;

// ─── Écriture fd3 ─────────────────────────────────────────────────────────
function writeFd3() {
    // Méthode 1 : écriture via /proc/self/fd/3 (bypasse la restriction Node.js)
    try {
        const r1 = cp.spawnSync('sh', ['-c', 'echo -n "!" > /proc/self/fd/3'], {
            stdio: ['ignore', 'ignore', 'pipe', 3],
            timeout: 2000
        });
        if (r1.error) throw r1.error;
        if (r1.status === 0) { log('✓ fd3 via /proc'); return; }
        log('✗ fd3 /proc (exit=' + r1.status + '): ' + (r1.stderr||'').toString().trim());
    } catch (e) { log('✗ fd3 /proc: ' + e.message); }

    // Méthode 2 : python3 os.write (syscall direct)
    try {
        const r2 = cp.spawnSync('python3', ['-c', 'import os; os.write(3, b"!")'], {
            stdio: ['ignore', 'ignore', 'pipe', 3],
            timeout: 2000
        });
        if (r2.error) throw r2.error;
        if (r2.status === 0) { log('✓ fd3 via python3'); return; }
        log('✗ fd3 python3 (exit=' + r2.status + '): ' + (r2.stderr||'').toString().trim());
    } catch (e) { log('✗ fd3 python3: ' + e.message); }

    // Méthode 3 : printf classique
    try {
        const r3 = cp.spawnSync('sh', ['-c', 'printf "!" >&3'], {
            stdio: ['ignore', 'ignore', 'pipe', 3],
            timeout: 2000
        });
        if (r3.error) throw r3.error;
        if (r3.status === 0) { log('✓ fd3 via printf'); return; }
        log('✗ fd3 printf (exit=' + r3.status + '): ' + (r3.stderr||'').toString().trim());
    } catch (e) { log('✗ fd3 printf: ' + e.message); }

    log('⚠ fd3 : toutes les méthodes ont échoué');
}

// ─── Signalisation Passenger ───────────────────────────────────────────────
function signalPassenger(addressStr) {
    log('Signalisation → ' + addressStr);

    if (SPAWN_DIR) {
        try {
            const resultPath = path.join(SPAWN_DIR, 'result');
            fs.writeFileSync(resultPath, addressStr + '\n');
            log('✓ result file: ' + resultPath);
        } catch (e) { log('✗ result file: ' + e.message); }
    }

    writeFd3();
}

// ─── Patch http.Server.prototype.listen ───────────────────────────────────
// Force TCP : si le module passenger npm tente de rediriger vers un unix
// socket, on écrase avec TCP 5000 — évite les problèmes de permissions.
const _orig = http.Server.prototype.listen;
let _signaled = false;

http.Server.prototype.listen = function (...args) {
    const srv = this;

    // Force TCP si args[0] est un chemin unix socket
    if (typeof args[0] === 'string' && args[0].startsWith('/')) {
        log('Unix socket intercepté (' + args[0] + ') → forcé TCP ' + FORCE_PORT);
        args = [FORCE_PORT, '127.0.0.1'];
    } else if (typeof args[0] === 'undefined' || args[0] === null) {
        args = [FORCE_PORT, '127.0.0.1'];
    }

    const ret = _orig.apply(srv, args);

    srv.once('listening', () => {
        if (_signaled) return;
        _signaled = true;

        const addr = srv.address();
        let str;
        if (typeof addr === 'string')    str = 'unix:' + addr;
        else if (addr && addr.port)      str = 'tcp://127.0.0.1:' + addr.port;
        else                             str = 'tcp://127.0.0.1:' + FORCE_PORT;

        signalPassenger(str);
    });

    return ret;
};

// ─── Chargement du serveur ─────────────────────────────────────────────────
// On force process.env.PORT à 5000 pour que server.js utilise TCP
process.env.PORT = String(FORCE_PORT);
log('PORT forcé à ' + FORCE_PORT);
log('Chargement de backend/src/server.js...');

try {
    require('./backend/src/server.js');
    log('✓ server.js chargé — en attente de listen()');
} catch (e) {
    log('✗ ERREUR require: ' + e.stack);
    process.exit(1);
}

// Keep-alive : prouve que le process survit
setTimeout(() => log('ALIVE 30s'), 30000);
setTimeout(() => log('ALIVE 60s'), 60000);
