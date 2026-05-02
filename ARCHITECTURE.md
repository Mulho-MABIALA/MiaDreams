# Architecture du projet

Le projet garde les fichiers runtime Laravel a la racine pour rester compatible avec `artisan`, le serveur web, Composer, Vite et Render.

## Frontend

Tout le frontend React/Inertia est dans `frontend/`.

- `frontend/js/app.jsx` : point d'entree React/Inertia.
- `frontend/js/Pages/` : pages React rendues par `Inertia::render(...)`.
- `frontend/js/Components/` : composants React partages.
- `frontend/css/app.css` : styles Tailwind et styles globaux du site.

## Backend

Tout le code Laravel applicatif est dans `backend/`.

- `backend/app/` : controllers, models, middleware, providers, Filament.
- `backend/routes/` : routes web, api, console et channels.
- `backend/config/` : configuration Laravel.
- `backend/database/` : migrations, factories, seeders.
- `backend/resources/views/` : vues Blade encore necessaires pour Inertia, emails et Filament.
- `backend/resources/lang/` : traductions.
- `backend/tests/` : tests PHPUnit.

## Racine conservee

Ces dossiers restent volontairement a la racine.

- `bootstrap/` : boot Laravel.
- `public/` : document root, assets publics et build Vite.
- `storage/` : logs, cache, fichiers generes.
- `vendor/` : dependances PHP.
- `node_modules/` : dependances JS locales.
- `artisan`, `composer.json`, `package.json`, `vite.config.js`, `tailwind.config.js` : commandes et configuration du projet.
