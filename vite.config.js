import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['frontend/css/app.css', 'frontend/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    // Supprimer build: { outDir: 'dist' }
});
