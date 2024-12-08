# Bienvenue sur la doc du site du C.E.I

# LE CODE DU PROJET EST EN SOURCE FERMER, NE LE PARTAGEZ PAS

## Intro
Ce README est fait pour les personnes reprennant le projet du site du C.E.I <br>
Le site du C.E.I a été recoder de A à Z par Julien (NapoTwiixe sur discord).
La stack qui a été utilisé est celle-ci : <br>

### Prérequis :
* NextJs [Next v15](https://nextjs.org)
* React v19-RC [React](https://react.dev/blog/2024/12/05/react-19)
* MYSQL [MySql](https://www.mysql.com/fr/)
* Node v22.7.0 minimum [Node](https://nodejs.org/fr)

### Front : 
* NextJS
* Typescript
* TailwindCSS <br>

### Back
* Typescript
* Next-auth
* Prisma avec Mysql

### Installation du projet

1. Commencez par clone le repos github
    ```bash
   git clone https://github.com/NapoTwiixe306/cei-site.git
   ```
2. installez les dépendances `npm install`
3. ajout du fichier `.env` dedans vous y retrouverez ceci
    ```txt
   NEXT_PUBLIC_DISCORD_WEBHOOK_URL=
   DATABASE_URL="mysql://user:password@localhost:3306/cei?schema=public"
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
    ```
4. Mise en place de Prisma
    ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db pull
    ```
   

# Structure pour le dashboard
```txt
- pages
    - Dashboard
      - admin
        - admin.tsx
        - page.tsx
      - Components
        - GestionEvent.tsx
        - GestionUser.tsx
      - user
        - user.tsx
        - page.tsx
      - DashboardContent.tsx
      - page.tsx
```

Les fichiers `page.tsx` sont utilisé pour avoir un `server component` et faire les vérifications de rôle <br>
Le n'ajoutez pas de code dans les fichiers `admin.tsx` et `user.tsx`, ils servent uniquement de redirection,
tout est géré dans le fichier `DashboardContent.tsx`

Pour ajouter une page, ajoutez-la dans le `switch` du fichier `DashboardContent` et dans la `sidebar`


# Tutorat

Le tutorat est géré dans le dossier `Tutorat` et dans el fichier `page.tsx`
avec un simple call vers le webhook discord qui est dans votre fichier `.env` pour avoir le lien du webhook, 
demandez au président sur le discord
