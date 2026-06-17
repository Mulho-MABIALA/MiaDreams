import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Plugin : injecte les variables Firebase dans le service worker après le build
function injectFirebaseSWPlugin() {
    return {
        name: 'inject-firebase-sw',
        closeBundle() {
            const swPath = path.resolve('dist', 'firebase-messaging-sw.js');
            if (!fs.existsSync(swPath)) return;
            let content = fs.readFileSync(swPath, 'utf-8');
            const env = loadEnv('production', process.cwd(), 'VITE_');
            const replacements = {
                '__FIREBASE_API_KEY__':             env.VITE_FIREBASE_API_KEY             || '',
                '__FIREBASE_AUTH_DOMAIN__':         env.VITE_FIREBASE_AUTH_DOMAIN         || '',
                '__FIREBASE_PROJECT_ID__':          env.VITE_FIREBASE_PROJECT_ID          || '',
                '__FIREBASE_STORAGE_BUCKET__':      env.VITE_FIREBASE_STORAGE_BUCKET      || '',
                '__FIREBASE_MESSAGING_SENDER_ID__': env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
                '__FIREBASE_APP_ID__':              env.VITE_FIREBASE_APP_ID              || '',
            };
            for (const [k, v] of Object.entries(replacements)) {
                content = content.replaceAll(k, v);
            }
            fs.writeFileSync(swPath, content);
            console.log('✅ Firebase SW — variables injectées');
        },
    };
}

export default defineConfig({
    plugins: [react(), injectFirebaseSWPlugin()],
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
