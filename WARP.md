# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Commands

- **Development Server**: To start the development server, run:
  ```bash
  npm run dev
  ```
- **Installation**: Install dependencies with:
  ```bash
  npm install
  ```
- **Build for Production**: To build the project for production:
  ```bash
  npm run build
  ```
- **Start Production Server**: To launch the production server:
  ```bash
  npm run start
  ```
- **Linting**: To lint the codebase with ESLint:
  ```bash
  npm run lint
  ```
- **Formatting**: To format code with Prettier:
  ```bash
  npm run format
  ```
- **Database Initialization**: Use Prisma CLI to manage database migrations:
  ```bash
  npx prisma generate
  npx prisma migrate dev
  npx prisma db pull
  ```

## Code Architecture

### Project Organization

The project is organized into various sections, with a clear separation between frontend and backend functionalities:

- **Frontend**: Built with Next.js, React, and Tailwind CSS.
- **Backend**: Utilizes Next.js API Routes and Prisma for database management with MySQL.

### Directory Structure

A glimpse into the `pages/` directory shows components such as Dashboard, Admin, and User pages:

```plaintext
pages/
   - Dashboard/
       - admin/
           - admin.tsx
           - page.tsx
       - user/
           - user.tsx
           - page.tsx
       - Components/
           - GestionEvent.tsx
           - GestionUser.tsx
       - DashboardContent.tsx
       - page.tsx
```

### Key Components

- **Dashboard**: The dashboard is central to the application, with components for managing events and users.
- **Auth System**: Managed via Next-Auth, supporting user sessions and password reset.
- **Event Management**: Event-related data is tightly integrated with the user management system.

### Database Models

- **User**: Includes user roles, authentication, and relations with events.
- **Event**: Manages club events, details, and creator relations.

### Development Considerations

Ensure consistency by adhering to code conventions enforced by Prettier and ESLint. Always work on a separate branch for new features and submit a detailed pull request for review.