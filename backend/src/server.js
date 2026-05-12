const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');
const seedAdmin = require('./seed');

const app = express();

// Créer le dossier uploads/ s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

connectDB().then(() => seedAdmin());

// CORS : accepte toutes les origines connues + reflect pour credentials
app.use(cors({
    origin: true,        // reflète l'origine de la requête → compatible credentials
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // pré-vol OPTIONS sur toutes les routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check — utilisé pour garder le serveur éveillé (cron ping)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gestion des 404 API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Route API non trouvée' });
});

// Frontend servi séparément sur Vercel — pas de fallback React ici

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
