/**
 * fcm.js — DÉPRÉCIÉ
 * Remplacé par ./webpush.js (Web Push natif / VAPID, sans Firebase).
 * Ce fichier n'est plus require() nulle part (voir utils/notify.js et server.js).
 * Vous pouvez le supprimer manuellement (impossible de le faire depuis cette session,
 * l'accès shell au sandbox était indisponible).
 */
module.exports = require('./webpush');
