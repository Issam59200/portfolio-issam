# Portfolio Issam

Monorepo contenant le backend API (Laravel) et le frontend (React + Vite) pour le site portfolio fullstack.

## 🏗 Architecture

```
backend/              # API Laravel 12 + MySQL + Sanctum
  app/
    Http/Controllers/Api/
      AuthController.php
      ProjectController.php
      ContactController.php
    Models/
      User.php (HasApiTokens)
      Project.php
      Contact.php
  database/
    migrations/
      - create_users_table
      - create_projects_table
      - create_contacts_table
    seeders/
      DatabaseSeeder.php
      ProjectSeeder.php
  routes/api.php      # Auth, Projects, Contacts
  config/sanctum.php
  .env                # MySQL configuré

frontend/             # React SPA (Vite)
  src/
    components/       # Navbar, Footer
    pages/            # Home (Hero + Skills + About + Contact)
    App.jsx           # Layout + routes
    App.css           # Design moderne gradient violet/bleu
    index.css         # Typo Inter, couleurs claires
  .env                # VITE_API_URL=http://127.0.0.1:8000/api

scripts/
  docker-compose.yml  # MySQL 8
```

## ✨ Fonctionnalités Backend

### Authentification (Laravel Sanctum)
- **POST** `/api/auth/register` — Créer un compte
- **POST** `/api/auth/login` — Connexion (retourne token)
- **POST** `/api/auth/logout` — Déconnexion (révoque token) 🔒
- **GET** `/api/auth/user` — Utilisateur connecté 🔒

### Projets
- **GET** `/api/projects` — Liste tous les projets
- **GET** `/api/projects/featured` — Projets mis en avant
- **GET** `/api/projects/{id}` — Détails d'un projet
- **POST** `/api/projects` — Créer un projet 🔒 (admin)
- **PUT** `/api/projects/{id}` — Modifier 🔒
- **DELETE** `/api/projects/{id}` — Supprimer 🔒

### Contact
- **POST** `/api/contact` — Envoyer un message
- **GET** `/api/contacts` — Tous les messages 🔒 (admin)
- **PUT** `/api/contacts/{id}/read` — Marquer comme lu 🔒
- **DELETE** `/api/contacts/{id}` — Supprimer 🔒

🔒 = Routes protégées par `auth:sanctum`

## 🚀 Setup Complet

### Prérequis
- PHP 8.2+, Composer
- Node 18+ et npm
- MySQL 8

### 1️⃣ Base de données MySQL

Option A: Docker (recommandé)
```bash
cd scripts
docker compose up -d
# MySQL écoute sur 127.0.0.1:3306
# DB: portfolio | User: portfolio | Pass: portfolio
```

Option B: MySQL local
```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio'@'localhost' IDENTIFIED BY 'portfolio';
GRANT ALL ON portfolio.* TO 'portfolio'@'localhost';
FLUSH PRIVILEGES;
```

### 2️⃣ Backend Laravel

```bash
cd backend

# Installer les dépendances (dont Sanctum)
composer install

# Vérifier .env (déjà configuré)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=portfolio
# DB_USERNAME=portfolio
# DB_PASSWORD=portfolio

# Générer la clé d'application (déjà fait si APP_KEY présent)
php artisan key:generate

# Publier la config Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Migrations + seeders
php artisan migrate:fresh --seed
# ✅ Crée les tables users, projects, contacts, personal_access_tokens
# ✅ Ajoute un admin (admin@portfolio.test / password)
# ✅ Ajoute 3 projets de démo

# Lancer le serveur
php artisan serve
# => http://127.0.0.1:8000
```

**Endpoints de test:**
- http://127.0.0.1:8000/api/ping
- http://127.0.0.1:8000/api/projects

### 3️⃣ Frontend React

```bash
cd frontend

# Vérifier .env
# VITE_API_URL=http://127.0.0.1:8000/api

# Installer les dépendances
npm install

# Lancer en dev
npm run dev
# => http://127.0.0.1:5173
```

**Build production:**
```bash
npm run build
# => dossier dist/
```

## 🎨 UI Frontend

### Design
- **Couleurs:** Gradient violet/bleu (#667eea → #764ba2)
- **Typo:** Inter (Google Fonts) — poids 400 à 800
- **Sections:**
  - Hero: titre + tagline + CTA
  - Skills: 4 catégories (Frontend, Backend, DB, DevOps)
  - About: présentation sobre
  - Contact: card avec gradient + CTA email

### Navigation
- Accueil (Hero + Skills + About + Contact)
- Projets (à venir)
- À propos (à venir)
- Contact (formulaire à connecter à `/api/contact`)

## 🔐 Authentification Sanctum

### Flow tokens (SPA ou mobile)

1. **Inscription/Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.test","password":"password"}'
# => { "user": {...}, "token": "1|abc..." }
```

2. **Utiliser le token:**
```bash
curl -H "Authorization: Bearer 1|abc..." \
  http://127.0.0.1:8000/api/auth/user
```

3. **Logout:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout \
  -H "Authorization: Bearer 1|abc..."
```

### Compte admin par défaut
- **Email:** admin@portfolio.test
- **Password:** password

## 📦 Structure des modèles

### User
```php
- id, name, email, password
- HasApiTokens (Sanctum)
```

### Project
```php
- id, title, description
- stack (JSON array)
- link, github, image
- featured (boolean)
- order (integer)
```

### Contact
```php
- id, name, email, subject, message
- read (boolean)
```

## 🛠 Commandes Artisan utiles

```bash
# Rafraîchir DB + seeders
php artisan migrate:fresh --seed

# Créer une migration
php artisan make:migration create_xxx_table

# Créer un modèle + migration + controller
php artisan make:model Product -mc

# Créer un controller API
php artisan make:controller Api/XxxController --api

# Liste des routes
php artisan route:list

# Nettoyer cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 🐳 Docker (optionnel)

Si besoin d'un environnement complet (PHP + MySQL + Node):
```yaml
# Ajouter services pour backend/frontend dans docker-compose.yml
# Exemple: php:8.2-fpm, node:18, nginx
```

## 🧪 Tests

```bash
cd backend
php artisan test
```

## 📝 Prochaines étapes

- [ ] Page Projets frontend (fetch `/api/projects`)
- [ ] Formulaire de contact (POST `/api/contact`)
- [ ] Page Admin (CRUD projets, gestion contacts)
- [ ] Upload d'images (storage Laravel + endpoint)
- [ ] Email notifications (contact reçu)
- [ ] Pagination API
- [ ] Tests unitaires (PHPUnit) + E2E (Vitest)
- [ ] CI/CD (GitHub Actions)
- [ ] Déploiement (VPS/Vercel/Railway)

## 🤝 Contribution

Projet personnel — Issam A.

## 📄 Licence

MIT
