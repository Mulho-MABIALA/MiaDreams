import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import './index.css';

// ─── Intercepteur global JWT ──────────────────────────────────────────────────
// Lit le token depuis localStorage à CHAQUE requête vers /api/admin
// → aucune race condition possible, fonctionne dès le premier render
axios.interceptors.request.use(config => {
    if (config.url && config.url.includes('/api/admin')) {
        const token = localStorage.getItem('admin_token');
        if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
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
