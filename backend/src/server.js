const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
const { apiLimiter } = require('./middleware/rateLimiter');
const seedAdmin    = require('./seed');
const seedBrands   = require('./seedBrands');
const seedSections = require('./seedSections');

const app = express();

// Créer le dossier uploads/ s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

connectDB().then(async () => {
    await seedAdmin();
    await seedBrands();
    await seedSections();
});

// ── Sécurité HTTP headers (helmet) ──────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },   // permet les images externes
    contentSecurityPolicy: false,                             // géré côté frontend
    crossOriginEmbedderPolicy: false,                        // autorise YouTube / Vimeo / Maps dans les iframes
}));

// ── CORS : origines autorisées explicitement ─────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

// Origines par défaut si non configurées
if (!ALLOWED_ORIGINS.length) {
    ALLOWED_ORIGINS.push(
        'http://localhost:5173',
        'http://localhost:3000',
        'https://miadreams.netlify.app',
        'https://mia-dreams.com',
        'http://mia-dreams.com',
    );
}

app.use(cors({
    origin: (origin, cb) => {
        // Autorise les requêtes sans origin (Postman, mobile, server-to-server)
        if (!origin) return cb(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origine non autorisée — ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// ── Rate limiting global sur toutes les routes /api ──────────────────────────
app.use('/api/', apiLimiter);

// Capture le corps brut pour vérification de signature webhook (Wave)
app.use(express.json({
    verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(express.urlencoded({ extended: true }));

// Health check en premier — Render pingue cette URL pour savoir si le service est up
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Servir les assets publics (images, polices, etc.)
app.use(express.static(path.join(__dirname, '../../public')));

// Routes API — chaque require est blindé pour ne pas crasher le serveur
const routes = [
    ['/api/auth',         './routes/auth'],
    ['/api/settings',     './routes/settings'],
    ['/api/home',         './routes/home'],
    ['/api/brands',       './routes/brands'],
    ['/api/blog',         './routes/blog'],
    ['/api/podcasts',     './routes/podcasts'],
    ['/api/gallery',      './routes/gallery'],
    ['/api/catalogues',   './routes/catalogues'],
    ['/api/search',       './routes/search'],
    ['/api/contact',      './routes/contact'],
    ['/api/reservation',  './routes/reservation'],
    ['/api/newsletter',   './routes/newsletter'],
    ['/api/testimonials', './routes/testimonials'],
    ['/api/apropos',      './routes/apropos'],
    ['/api/impact',       './routes/impact'],
    ['/api/sections',     './routes/sections'],
    ['/api/shop',         './routes/shop'],
    ['/api/orders',       './routes/orders'],
    ['/api/payment',      './routes/payment'],
    ['/api/caisse',       './routes/caisse'],
    ['/api/invoices',    './routes/invoices'],
];

routes.forEach(([path, file]) => {
    try {
        app.use(path, require(file));
        console.log(`✅ Route chargée : ${path}`);
    } catch (e) {
        console.error(`❌ Erreur route ${path} :`, e.message);
    }
});

// Route admin (authentifiée)
try {
    app.use('/api/admin', authMiddleware, require('./routes/admin'));
    console.log('✅ Route chargée : /api/admin');
} catch (e) {
    console.error('❌ Erreur route /api/admin :', e.message);
}

// Gestion des 404 API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Route API non trouvée' });
});

// Sert le build React (frontend/dist/) — mode Docker monolithique
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // SPA fallback — toutes les routes non-API renvoient index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

// Middleware d'erreur global — capture toutes les erreurs non gérées
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error('Erreur non gérée :', err);
    res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

// Ping anti-sleep Render (évite le cold start de 30-50s)
// Se ping lui-même toutes les 14 min pour rester actif sur le plan gratuit
if (process.env.SELF_URL) {
    const https = require('https');
    const http  = require('http');
    setInterval(() => {
        const url = process.env.SELF_URL + '/api/health';
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, () => {}).on('error', () => {});
    }, 14 * 60 * 1000); // toutes les 14 minutes
    console.log('✅ Ping anti-sleep activé →', process.env.SELF_URL);
}
