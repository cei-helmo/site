FROM node:20-alpine AS base

# Étape des dépendances
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Étape de la construction
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma: Génération et mise à jour de la base de données
RUN npx prisma generate

# Attente de MySQL et exécution des migrations Prisma
RUN npx prisma migrate deploy
RUN npx prisma db pull

RUN npm run build

# Étape d'exécution
FROM base AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Création de l'utilisateur 'nextjs' pour l'exécution
RUN addgroup -S nodejs && adduser -S -D -H nextjs && mkdir .next && chown nextjs:nodejs .next

# Copie des fichiers nécessaires pour le serveur
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Passage à l'utilisateur 'nextjs' pour éviter les problèmes de permission
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Lancer le serveur
CMD ["node", "server.js"]
