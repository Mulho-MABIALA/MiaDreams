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

log('=== DÉMARRAGE APP.JS ===');
log('PID=' + process.pid + ' | NODE=' + process.version);
log('SPAWN_DIR=' + (process.env.PASSENGER_SPAWN_WORK_DIR || '(vide)'));
log('PORT_ENV='  + (process.env.PORT || '(vide)'));
log('USE_FEEDBACK_FD=' + (process.env.PASSENGER_USE_FEEDBACK_FD || '(vide)'));

const SPAWN_DIR = process.env.PASSENGER_SPAWN_WORK_DIR;

// ─── Signalisation Passenger (appelée APRÈS listen()) ─────────────────────
function signalPassenger(addressStr) {
    log('Signalisation Passenger → ' + addressStr);

    // Protocole 1 : fichier result (Passenger 5+ / "GenericApp")
    if (SPAWN_DIR) {
        try {
            fs.writeFileSync(path.join(SPAWN_DIR, 'result'), addressStr + '\n');
            log('✓ result file écrit');
        } catch (e) { log('✗ result file: ' + e.message); }
    }

    // Protocole 2 : écrire "!" sur fd 3 (PASSENGER_USE_FEEDBACK_FD)
    // Node.js ne peut pas écrire sur ce fd directement (type "UNKNOWN"),
    // mais un sous-shell qui hérite le fd le peut via dup2.
    try {
        const r = cp.spawnSync('/bin/sh', ['-c', 'printf "!" >&3'], {
            stdio: ['ignore', 'ignore', 'pipe', 3],   // fd 3 hérité du parent
            timeout: 3000
        });
        const stderr = (r.stderr || Buffer.alloc(0)).toString().trim();
        if (r.error)          throw r.error;
        if (r.status !== 0)   log('✗ fd3 shell (exit=' + r.status + '): ' + stderr);
        else                  log('✓ fd3 signal envoyé');
    } catch (e) { log('✗ fd3: ' + e.message); }
}

// ─── Patch http.Server.prototype.listen ───────────────────────────────────
// On intercepte l'événement 'listening' pour signaler Passenger APRÈS que
// le port soit réellement ouvert — élimine la race condition.
const _origListen = http.Server.prototype.listen;
let _signaled = false;

http.Server.prototype.listen = function (...args) {
    const srv = this;
    const ret = _origListen.apply(srv, args);
    srv.once('listening', () => {
        if (_signaled) return;
        _signaled = true;

        const addr = srv.address();
        let str;
        if (typeof addr === 'string')    str = 'unix:' + addr;
        else if (addr && addr.port)      str = 'tcp://127.0.0.1:' + addr.port;
        else                             str = 'tcp://127.0.0.1:5000';

        signalPassenger(str);
    });
    return ret;
};

// ─── Chargement du serveur ─────────────────────────────────────────────────
log('Chargement de backend/src/server.js...');
try {
    require('./backend/src/server.js');
    log('✓ server.js chargé — en attente de listen()');
} catch (e) {
    log('✗ ERREUR require: ' + e.stack);
    process.exit(1);
}
