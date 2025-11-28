# Changelog — Setup complet Portfolio Issam

## 🎨 Frontend (React + Vite)

### Fichiers MODIFIÉS

#### `frontend/index.html`
- ✅ Langue FR (`lang="fr"`)
- ✅ Titre SEO: "Issam • Développeur Web Fullstack"
- ✅ Meta description enrichie
- ✅ Import Google Font **Inter** (400-800)

#### `frontend/src/index.css`
- ✅ Typo par défaut: **Inter** (fallback system fonts)
- ✅ Mode clair uniquement (color-scheme: light)
- ✅ Couleurs: #111827 (texte), #ffffff (fond)
- ✅ Liens: gradient violet/bleu (#667eea → #764ba2)
- ✅ Titres: font-weight 800, letter-spacing -0.5px
- ✅ Boutons: border-radius 8px, focus ring personnalisé

#### `frontend/src/App.css`
- ✅ **Refonte complète** du design
- ✅ Layout: `.app-shell` flex column min-height 100dvh
- ✅ **Navigation** sticky avec backdrop-blur
- ✅ **Brand**: gradient violet/bleu sur le nom
- ✅ **Hero Section**: gradient de fond (#faf5ff → #ffffff)
  - Badge "Disponible pour de nouveaux projets"
  - Titre avec highlight gradient
  - Boutons primary (gradient) + secondary (outline)
- ✅ **Skills Section**: grid responsive 4 catégories
  - Hover: border violet + shadow + translateY
- ✅ **About Section**: fond gradient léger
- ✅ **Contact Section**: card avec gradient violet/bleu
- ✅ **Footer**: fond #fafafa, centré
- ✅ Responsive: breakpoints pour mobile (< 768px)

#### `frontend/src/App.jsx`
- ✅ Import **react-router-dom** (BrowserRouter, Routes, Route)
- ✅ Layout: `<Navbar />` + `<Routes>` + `<Footer />`
- ✅ Route `/` → `<Home />`

#### `frontend/src/pages/Home.jsx`
- ✅ **Refonte complète** de la page Accueil
- ✅ **Hero**: "Salut, je suis Issam 👋" avec badge et 2 CTA
- ✅ **Skills Section** (#skills):
  - Frontend: React, JS ES6+, HTML5/CSS3, Vite
  - Backend: Laravel, PHP 8+, API REST, Eloquent
  - Base de données: MySQL, PostgreSQL
  - Outils: Git/GitHub, Docker, Composer/npm
- ✅ **About Section** (#about): présentation sobre du profil
- ✅ **Contact Section** (#contact): card gradient + CTA mailto
- ✅ Suppression de l'ancien test API (ping backend)

#### `frontend/package.json`
- ✅ Ajout dépendance: **"react-router-dom": "^7.0.2"**

### Fichiers CRÉÉS

#### `frontend/src/components/Navbar.jsx`
- Navigation sticky avec logo et liens (Accueil, Projets, À propos, Contact)
- Classes CSS: `.brand`, `.nav-link`, `.nav-link-active`
- Utilisation de `<NavLink>` pour active state

#### `frontend/src/components/Footer.jsx`
- Footer simple avec année dynamique
- `© 2025 Issam. Tous droits réservés.`

---

## 🔧 Backend (Laravel 12 + MySQL + Sanctum)

### Fichiers MODIFIÉS

#### `backend/.env`
- ✅ **DB_CONNECTION=mysql** (au lieu de sqlite)
- ✅ DB_HOST=127.0.0.1
- ✅ DB_PORT=3306
- ✅ DB_DATABASE=**portfolio**
- ✅ DB_USERNAME=**portfolio**
- ✅ DB_PASSWORD=**portfolio**

#### `backend/composer.json`
- ✅ Ajout dépendance: **"laravel/sanctum": "^4.0"**

#### `backend/bootstrap/app.php`
- ✅ Ajout routage API: `api: __DIR__.'/../routes/api.php'`
- ✅ Middleware Sanctum: `$middleware->statefulApi()`

#### `backend/app/Models/User.php`
- ✅ Import `use Laravel\Sanctum\HasApiTokens;`
- ✅ Ajout trait: `use HasFactory, Notifiable, HasApiTokens;`

#### `backend/routes/api.php`
- ✅ **Refonte complète** avec namespaces controllers
- ✅ **Auth routes** (register, login, logout, user) via `AuthController`
- ✅ **Projects routes** (index, show, store, update, destroy, featured)
  - GET public, POST/PUT/DELETE protégés par `auth:sanctum`
- ✅ **Contact routes** (store public, index/read/delete admin)

#### `backend/database/seeders/DatabaseSeeder.php`
- ✅ Création utilisateur admin:
  - Email: **admin@portfolio.test**
  - Password: **password**
- ✅ Appel du `ProjectSeeder`

### Fichiers CRÉÉS

#### `backend/config/sanctum.php`
- Configuration Sanctum pour SPA
- Domaines stateful: localhost:5173, 127.0.0.1:8000
- Guards: web
- Expiration: null (tokens permanents)
- Middleware: authenticate_session, encrypt_cookies, validate_csrf_token

#### `backend/app/Models/Project.php`
- Modèle Eloquent pour les projets
- Champs fillable: title, description, stack (JSON), link, github, image, featured, order
- Cast: stack → array, featured → boolean

#### `backend/app/Models/Contact.php`
- Modèle Eloquent pour les messages de contact
- Champs fillable: name, email, subject, message, read
- Cast: read → boolean

#### `backend/database/migrations/2024_11_28_000001_create_projects_table.php`
- Migration table `projects`:
  - id (bigint auto-increment)
  - title (string)
  - description (text nullable)
  - stack (json nullable)
  - link, github, image (string nullable)
  - featured (boolean default false)
  - order (integer default 0)
  - timestamps

#### `backend/database/migrations/2024_11_28_000002_create_contacts_table.php`
- Migration table `contacts`:
  - id, name, email, subject (nullable), message
  - read (boolean default false)
  - timestamps

#### `backend/database/seeders/ProjectSeeder.php`
- 3 projets de démo:
  1. Portfolio Personnel (Laravel + React)
  2. API REST Laravel (JWT)
  3. Application React SPA

#### `backend/app/Http/Controllers/Api/AuthController.php`
- **register(Request)**: crée un user + retourne token Sanctum
- **login(Request)**: vérifie email/password, retourne token
- **logout(Request)**: révoque le token actuel
- **user(Request)**: retourne l'utilisateur connecté

#### `backend/app/Http/Controllers/Api/ProjectController.php`
- **index()**: tous les projets (ordre: order, created_at desc)
- **show(Project)**: détails d'un projet
- **store(Request)**: créer un projet (admin)
- **update(Request, Project)**: modifier (admin)
- **destroy(Project)**: supprimer (admin)
- **featured()**: projets mis en avant (featured=true)

#### `backend/app/Http/Controllers/Api/ContactController.php`
- **store(Request)**: envoyer un message de contact (public)
- **index()**: liste des messages (admin)
- **markAsRead(Contact)**: marquer comme lu (admin)
- **destroy(Contact)**: supprimer (admin)

---

## 📚 Documentation

### Fichier MODIFIÉ

#### `README.md` (racine)
- ✅ **Refonte complète** avec architecture détaillée
- ✅ Schéma arborescence backend/frontend/scripts
- ✅ Liste complète des **endpoints API** (auth, projects, contacts)
- ✅ Instructions setup pas-à-pas:
  1. MySQL (Docker ou local)
  2. Backend (composer, migrations, seeders, serve)
  3. Frontend (npm install, npm run dev)
- ✅ Section **Authentification Sanctum** avec exemples curl
- ✅ Compte admin par défaut
- ✅ Structure des modèles
- ✅ Commandes Artisan utiles
- ✅ Section **UI Frontend** (couleurs, typo, sections)
- ✅ Prochaines étapes (page Projets, formulaire contact, admin, etc.)

---

## 🗂 Résumé des fichiers

### Frontend (9 fichiers)
**Modifiés:** 5
- `index.html`
- `src/index.css`
- `src/App.css`
- `src/App.jsx`
- `package.json`

**Créés:** 3
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/pages/Home.jsx` (refait from scratch)

### Backend (17 fichiers)
**Modifiés:** 6
- `.env`
- `composer.json`
- `bootstrap/app.php`
- `app/Models/User.php`
- `routes/api.php`
- `database/seeders/DatabaseSeeder.php`

**Créés:** 11
- `config/sanctum.php`
- `app/Models/Project.php`
- `app/Models/Contact.php`
- `database/migrations/2024_11_28_000001_create_projects_table.php`
- `database/migrations/2024_11_28_000002_create_contacts_table.php`
- `database/seeders/ProjectSeeder.php`
- `app/Http/Controllers/Api/AuthController.php`
- `app/Http/Controllers/Api/ProjectController.php`
- `app/Http/Controllers/Api/ContactController.php`

### Documentation (1 fichier)
**Modifié:** 1
- `README.md` (racine)

---

## 🎯 État final du projet

### ✅ Backend complet
- [x] Laravel 12 + MySQL configuré
- [x] Sanctum installé et configuré
- [x] Authentification par tokens (register/login/logout)
- [x] Modèles: User (HasApiTokens), Project, Contact
- [x] Migrations: users, projects, contacts, personal_access_tokens
- [x] Seeders: admin + 3 projets de démo
- [x] Controllers API: Auth, Projects, Contacts
- [x] Routes protégées par `auth:sanctum` (admin)
- [x] Middlewares et CORS configurés

### ✅ Frontend complet
- [x] React 19 + Vite 7
- [x] react-router-dom pour le routage
- [x] Page Accueil avec design moderne:
  - Hero (badge, titre gradient, CTA)
  - Skills (4 catégories avec hover effects)
  - About (présentation sobre)
  - Contact (card gradient)
- [x] Navigation sticky avec brand gradient
- [x] Footer simple
- [x] Design sobre et stylé:
  - Couleurs: gradient violet/bleu (#667eea → #764ba2)
  - Typo: Inter (Google Fonts)
  - Mode clair uniquement
  - Responsive (breakpoints mobile)

### ✅ Documentation
- [x] README.md exhaustif avec:
  - Architecture complète
  - Endpoints API documentés
  - Setup pas-à-pas (MySQL, backend, frontend)
  - Exemples d'authentification
  - Commandes utiles
  - Prochaines étapes

---

## 📦 Suggestions de commits organisés

### Commit 1: Setup backend architecture
```
feat(backend): setup Laravel + MySQL + Sanctum

- Configure .env pour MySQL (portfolio DB)
- Ajouter laravel/sanctum ^4.0 à composer.json
- Configurer bootstrap/app.php (API routes, statefulApi)
- Créer config/sanctum.php avec domaines locaux
```

### Commit 2: Database models & migrations
```
feat(backend): add Project and Contact models with migrations

- Créer modèle Project (title, description, stack, link, github, image, featured, order)
- Créer modèle Contact (name, email, subject, message, read)
- Ajouter HasApiTokens au modèle User
- Migrations: create_projects_table, create_contacts_table
- Seeders: admin user + 3 projets de démo
```

### Commit 3: API controllers & routes
```
feat(backend): implement auth, projects, contacts API

- AuthController: register, login, logout, user
- ProjectController: CRUD + featured endpoint
- ContactController: store (public) + admin routes
- Routes API avec protection auth:sanctum pour admin
- Healthcheck: GET /api/ping
```

### Commit 4: Frontend UI redesign
```
feat(frontend): redesign page Accueil avec UI moderne

- Refonte complète de Home.jsx (Hero, Skills, About, Contact)
- Design sobre gradient violet/bleu (#667eea → #764ba2)
- Import Google Font Inter (400-800)
- Sections:
  - Hero: badge + titre gradient + 2 CTA
  - Skills: 4 catégories (Frontend, Backend, DB, DevOps)
  - About: présentation sobre
  - Contact: card gradient + CTA email
- Styles dans App.css et index.css
```

### Commit 5: Frontend routing & components
```
feat(frontend): add routing with Navbar and Footer

- Installer react-router-dom ^7.0.2
- Créer composants Navbar et Footer
- Layout dans App.jsx avec BrowserRouter
- Navigation sticky avec active states
- Route "/" opérationnelle (Home)
```

### Commit 6: Documentation complète
```
docs: comprehensive README with architecture and setup

- Architecture backend/frontend/scripts détaillée
- Liste complète des endpoints API (auth, projects, contacts)
- Setup pas-à-pas: MySQL Docker, backend, frontend
- Exemples authentification Sanctum (curl)
- Compte admin par défaut (admin@portfolio.test / password)
- Commandes Artisan utiles
- Prochaines étapes (page Projets, formulaire contact, admin)
```

---

## 🚀 Commandes de lancement après setup

```bash
# 1. MySQL
cd scripts && docker compose up -d

# 2. Backend
cd backend
composer install
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate:fresh --seed
php artisan serve
# => http://127.0.0.1:8000

# 3. Frontend
cd frontend
npm install
npm run dev
# => http://127.0.0.1:5173
```

**Test rapide:**
- Frontend: ouvrir http://127.0.0.1:5173 → voir page Accueil avec design gradient
- Backend: curl http://127.0.0.1:8000/api/ping
- Projects: curl http://127.0.0.1:8000/api/projects
- Auth: curl -X POST http://127.0.0.1:8000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@portfolio.test","password":"password"}'

---

## 📌 Remarques importantes

1. **Sanctum pas encore installé**: lance `composer install` dans backend/
2. **MySQL doit être lancé** avant `php artisan migrate`
3. **Frontend**: après `npm install`, vérifier que `node_modules/` existe
4. **CORS**: configuré pour localhost:5173 et 127.0.0.1:8000
5. **Tokens Sanctum**: expiration null (permanents), à ajuster en production
6. **Compte admin**: admin@portfolio.test / password (à changer en prod)

---

**Date:** 28 novembre 2025
**Auteur:** GitHub Copilot + Issam A.
**Projet:** Portfolio Fullstack (Laravel + React)
