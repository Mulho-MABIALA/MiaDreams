import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Résolution des pages à la compilation (une seule fois, pas à chaque appel)
const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

// ─── BRIDGE: inertia-laravel v2 (PHP) embeds page data in <div id="app" data-page="...">
//            mais @inertiajs/react v3 (JS) cherche <script data-page="app" type="application/json">
//            On lit l'attribut data-page manuellement et on le passe via l'option `page`.
const appEl = document.getElementById('app');
const initialPage = appEl?.dataset?.page ? JSON.parse(appEl.dataset.page) : null;

createInertiaApp({
    page: initialPage,

    title: title => title ? `${title} — MIA DREAMS & CO` : 'MIA DREAMS & CO',

    resolve: name => {
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page introuvable : "${name}". Vérifie que le fichier ./Pages/${name}.jsx existe.`);
        }
        // Inertia v2/v3 attend le composant React (export default), pas le module entier
        return page.default ?? page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#C4A267',   // barre de chargement dorée
        showSpinner: false,
    },
});
