# Deploiement Render

Ce projet se deploie sur Render avec Docker et PostgreSQL.

## 1. Pousser le projet sur GitHub

Render doit lire le repo depuis GitHub, GitLab ou Bitbucket.

## 2. Creer le Blueprint

Dans Render :

1. New
2. Blueprint
3. Connecter le repo
4. Render detecte `render.yaml`
5. Deploy Blueprint

Le Blueprint cree :

- un web service Docker `mia-dreams`
- une base PostgreSQL `mia-dreams-db`

## 3. Variables demandees par Render

Render demandera les variables marquees `sync: false`.

### APP_KEY

Generer la valeur localement :

```bash
php artisan key:generate --show
```

Coller la valeur complete, par exemple :

```text
base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=
```

### ADMIN_EMAIL

Adresse email pour se connecter a Filament :

```text
admin@example.com
```

### ADMIN_PASSWORD

Mot de passe temporaire pour la demo cliente.

## 4. Apres deploiement

URLs :

- Site public : `https://mia-dreams.onrender.com`
- Admin : `https://mia-dreams.onrender.com/admin/login`

Si Render donne une URL differente, modifier la variable `APP_URL` dans le dashboard Render.

## 5. Notes importantes

- Les migrations et seeders se lancent automatiquement au demarrage du conteneur.
- Les emails sont en mode `log` pour la demo.
- Les fichiers uploades sur le disque local Render peuvent disparaitre sur redeploiement si aucun disque persistant n'est ajoute. Pour une demo rapide, c'est acceptable.
