const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth');

const app = express();

// Créer le dossier uploads/ s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

connectDB();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Autoriser les requêtes sans origin (Postman, mobile, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin.startsWith(o))) {
            callback(null, true);
        } else {
            callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Servir les assets publics (images, polices, etc.)
app.use(express.static(path.join(__dirname, '../../public')));

// Routes API
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/settings',     require('./routes/settings'));
app.use('/api/home',         require('./routes/home'));
app.use('/api/brands',       require('./routes/brands'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/podcasts',     require('./routes/podcasts'));
app.use('/api/gallery',      require('./routes/gallery'));
app.use('/api/catalogues',   require('./routes/catalogues'));
app.use('/api/search',       require('./routes/search'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/reservation',  require('./routes/reservation'));
app.use('/api/newsletter',   require('./routes/newsletter'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/apropos',      require('./routes/apropos'));
app.use('/api/impact',       require('./routes/impact'));
app.use('/api/sections',     require('./routes/sections'));
app.use('/api/shop',         require('./routes/shop'));
app.use('/api/orders',       require('./routes/orders'));
app.use('/api/payment',      require('./routes/payment'));
app.use('/api/admin',        authMiddleware, require('./routes/admin'));

// Gestion des 404 API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Route API non trouvée' });
});

// Frontend servi séparément sur Vercel — pas de fallback React ici

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
