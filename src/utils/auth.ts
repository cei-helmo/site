import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";

// Définir le type personnalisé pour le JWT avec un champ 'role' et 'name'
interface CustomJWT extends JWT {
  role?: string;
  name?: string | null; // Accepter `null` si le nom est absent
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        // Retourner l'utilisateur avec son nom et rôle
        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          name: user.name, // Inclure le nom ici
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as CustomJWT).role = user.role || 'user';
        (token as CustomJWT).name = user.name || null; // Permettre `null`
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = (token as CustomJWT).role || 'user';
        session.user.name = (token as CustomJWT).name || ''; // Utiliser une chaîne vide par défaut
      }
      return session;
    },
  },
};
