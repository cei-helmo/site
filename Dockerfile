FROM node:18-alpine AS build

# Étape 1 : Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances nécessaires pour compiler bcrypt
RUN apk add --no-cache python3 make g++

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel Next.js écoute (par défaut 3000)
EXPOSE 3000

# Construire l'application Next.js pour la production
RUN npm run build

# Démarrer l'application
CMD ["npm", "start"]
