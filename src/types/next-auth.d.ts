import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string; // Ajoute le rôle ici
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string; // Ajoute le rôle ici
  }
}
