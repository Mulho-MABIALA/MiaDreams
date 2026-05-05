require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Servir les assets publics (images, polices, etc.)
app.use(express.static(path.join(__dirname, '../../public')));

// Routes API
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
app.use('/api/admin',        require('./routes/admin'));

// Gestion des 404 API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Route API non trouvée' });
});

// En production : servir le build React
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
