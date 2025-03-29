# Site du C.E.I

## Description générale du projet et de son objectif
Le site du C.E.I (Club Étudiant en Informatique) est une plateforme web développée pour servir de vitrine numérique et d'outil de gestion pour l'association. Initialement recodé de A à Z par Julien (NapoTwiixe), le projet vise à faciliter la gestion des événements, le système de tutorat, et la communication avec les membres.

## Technologies utilisées
### Frontend
- Next.js v14.2
- React v18
- Tailwind CSS v3.4.1
- TypeScript v5
- React Query / Tanstack Query v5.62.2
- React Hook Form v7.53.2
- GSAP v3.12.5
- React Toastify v10.0.6

### Backend
- Next.js (API Routes)
- Prisma v6.1.0 avec MySQL
- Next-Auth v4.24.10
- Nodemailer v6.9.16
- Zod v3.23.8 (validation)
- bcryptjs v2.4.3

### Outils de développement
- ESLint v8.57.1
- Prettier v3.4.2
- TypeScript
- Prisma CLI

## Configuration requise et prérequis
- Node.js v22.7.0 minimum
- MySQL
- Git

## Instructions d'installation et de configuration
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/cei-helmo/site.git
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   Créer un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   NEXT_PUBLIC_DISCORD_WEBHOOK_URL=
   DATABASE_URL="mysql://user:password@localhost:3306/cei?schema=public"
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXTAUTH_SECRET=
   GMAIL_USER=
   GMAIL_PASSWORD=
   NEXT_PUBLIC_ROLE_ID_TUTOREE=
   NEXT_PUBLIC_ROLE_ID_OTHER=
   MYSQL_ROOT_PASSWORD=
   MYSQL_DATABASE=
   MYSQL_USER=
   MYSQL_PASSWORD=
   ```

4. Initialiser la base de données avec Prisma :
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db pull
   ```

## Structure du projet et architecture
### Organisation des dossiers
```
- pages/
    - Dashboard/
        - admin/
            - admin.tsx
            - page.tsx
        - Components/
            - GestionEvent.tsx
            - GestionUser.tsx
        - user/
            - user.tsx
            - page.tsx
        - DashboardContent.tsx
        - page.tsx
```

Note: Les fichiers `page.tsx` sont des server components utilisés pour les vérifications de rôle. Les fichiers `admin.tsx` et `user.tsx` servent uniquement de redirection, la logique principale étant gérée dans `DashboardContent.tsx`.

## Scripts disponibles
- `npm run dev` : Lance le serveur de développement
- `npm run pre:dev` : Exécute le script local.sh avant le développement
- `npm run build` : Compile le projet pour la production
- `npm run start` : Démarre le serveur de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run security` : Effectue un audit de sécurité
- `npm run format` : Formate le code avec Prettier
- `npm run dev:clean` : Combine lint, format et dev

## Fonctionnalités principales
- Gestion d'événements
- Système de tutorat avec intégration Discord
- Gestion des newsletters
- Tableau de bord administrateur
- Authentification des utilisateurs

## Base de données et modèles de données
Le projet utilise Prisma avec MySQL. Les principaux modèles sont :

### User
- Gestion des utilisateurs avec rôles (USER, ADMIN)
- Authentification et réinitialisation de mot de passe
- Relations avec les événements

### Event
- Gestion des événements du club
- Titre, description, date, image
- Relation avec l'utilisateur créateur

### Newsletter
- Gestion des abonnés à la newsletter
- Stockage des adresses email

## Authentification et gestion des utilisateurs
- Utilisation de Next-Auth pour l'authentification
- Système de rôles (USER, ADMIN)
- Gestion des sessions
- Réinitialisation de mot de passe via email

## Contribution et développement
1. Créer une nouvelle branche pour chaque fonctionnalité
2. Suivre les conventions de code (utiliser Prettier et ESLint)
3. Tester les modifications
4. Soumettre une pull request avec une description détaillée

## Déploiement
1. Vérifier la configuration des variables d'environnement
2. Exécuter `npm run build`
3. Utiliser `npm run start` pour démarrer le serveur de production
Note: Le projet est configuré pour un déploiement "standalone" via Next.js

## Mise en production

### Prérequis pour l'environnement de production
- Serveur Linux (Ubuntu 20.04 ou plus récent recommandé)
- Node.js v16+ et npm v8+
- Accès SSH au serveur
- Certificat SSL pour HTTPS (Let's Encrypt recommandé)
- Minimum 2GB de RAM et 10GB d'espace disque

### Configuration du serveur
1. Installer Nginx comme proxy inverse :
   ```
   sudo apt update
   sudo apt install nginx
   ```
2. Configurer Nginx pour rediriger vers l'application Next.js :
   ```
   # Exemple de configuration Nginx
   server {
     listen 80;
     server_name votre-domaine.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```
3. Configurer le pare-feu pour autoriser le trafic HTTP/HTTPS :
   ```
   sudo ufw allow 'Nginx Full'
   ```

### Processus de déploiement
1. Cloner le dépôt sur le serveur de production :
   ```
   git clone https://github.com/cei-helmo/site.git
   cd site
   ```
2. ajout de la bdd dans le projet si docker ne le fait pas, 
  le `vi .env` permet de modifier le contenu du .env dans docker, ajouter le code du .env de base, pour `DATABASE_URL`remplacer localhost par cei_mysql
    ```txt
    npm i && npm install prisma @prisma/client && npx prisma init
    vi .env 
    npx prisma generate && npx prisma migrate dev && npx prisma migrate deploye && npx prisma db pull
    ```
2. Installer les dépendances :
   ```
   npm ci --production
   ```
3. Créer le fichier .env.production avec les variables nécessaires
4. Construire l'application :
   ```
   npm run build
   ```
5. Démarrer l'application avec PM2 (gestion des processus) :
   ```
   npm install -g pm2
   pm2 start npm --name "cei-site" -- start
   pm2 save
   pm2 startup
   ```

### Surveillance et maintenance
1. Configurer les journaux d'application avec PM2 :
   ```
   pm2 logs cei-site
   ```
2. Mettre en place une surveillance des performances :
   ```
   pm2 monit
   ```
3. Configurer des alertes par email en cas de panne du serveur
4. Planifier des mises à jour régulières :
   ```
   # Script de mise à jour (à placer dans un cron job)
   cd /chemin/vers/site
   git pull
   npm ci --production
   npm run build
   pm2 restart cei-site
   ```
5. Créer des sauvegardes quotidiennes de la base de données

## Contact et support
Pour toute question ou support :
- Discord : NapoTwiixe
- Repository : [https://github.com/cei-helmo/site.git](https://github.com/cei-helmo/site.git)
