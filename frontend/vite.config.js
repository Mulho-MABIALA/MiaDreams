import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Notifications push : Web Push natif (VAPID). Le service worker (public/push-sw.js)
// ne contient aucun secret et n'a besoin d'aucune variable injectée au build —
// la clé publique VAPID est récupérée à l'exécution via GET /api/push/vapid-public-key.

export default defineConfig({
    plugins: [react()],
    publicDir: '../public',
    server: {
        port: 5173,
        proxy: {
            '/api':     { target: 'http://localhost:5000', changeOrigin: true },
            '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    http: ['axios'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.js',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: ['node_modules/', 'dist/', 'src/main.jsx'],
        },
    },
});
