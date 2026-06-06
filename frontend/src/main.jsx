import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import './index.css';

// ─── Intercepteur global JWT ──────────────────────────────────────────────────
// Envoie le token dans DEUX headers pour contourner les configs Apache/Passenger
// qui peuvent bloquer ou ne pas transmettre le header Authorization standard.
axios.interceptors.request.use(config => {
    if (config.url && config.url.includes('/api/admin')) {
        const token = localStorage.getItem('admin_token');
        if (token) {
            // Header standard (peut être bloqué par Apache dans certains hébergeurs)
            config.headers['Authorization'] = `Bearer ${token}`;
            // Header personnalisé (passe toujours — Apache ne l'intercepte pas)
            config.headers['X-Admin-Token'] = `Bearer ${token}`;
        }
    }
    return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AppProvider>
        </BrowserRouter>
    </React.StrictMode>
);
