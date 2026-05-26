# Déploiement sur Jokko Cloud (Docker)

## 1. Variables d'environnement à configurer

Sur le panneau Jokko, crée ces variables (ou passe-les au `docker run`) :

```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas — ton URI de connexion
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/MiaDreamsdb

# URL finale du site (le domaine Jokko)
FRONTEND_URL=https://mia-dreams.com
BACKEND_URL=https://mia-dreams.com

# JWT — génère une clé aléatoire longue
JWT_SECRET=remplace-par-une-cle-secrete-64-chars

# Compte admin créé au 1er démarrage
ADMIN_NAME=Admin MiaDreams
ADMIN_EMAIL=admin@miadreams.com
ADMIN_PASSWORD=MotDePasseSecurise!

# SMTP (email)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=ton@gmail.com
MAIL_PASS=xxxx-xxxx-xxxx-xxxx
MAIL_FROM=ton@gmail.com

# Anti-sleep (optionnel — laisse vide si non nécessaire sur Jokko)
SELF_URL=
```

## 2. Construire l'image Docker

```bash
docker build -t miadreams .
```

## 3. Lancer le conteneur

```bash
docker run -d \
  --name miadreams \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  miadreams
```

## 4. Ce que fait le conteneur

- Port **5000** : backend API + frontend React servis ensemble
- Routes `/api/*` → Express (Node.js)
- Toutes les autres routes → React SPA (index.html)
- `/uploads/*` → fichiers uploadés (images produits, etc.)

## 5. Volumes (persistance des uploads)

Les images uploadées sont stockées dans `/app/uploads` à l'intérieur du conteneur.
Pour ne pas les perdre à chaque redéploiement, monte un volume :

```bash
docker run -d \
  --name miadreams \
  -p 5000:5000 \
  --env-file .env \
  -v miadreams_uploads:/app/uploads \
  --restart unless-stopped \
  miadreams
```
