import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "CEI - Cercle des Étudiants en Informatique | HELMo",
  description: "Rejoignez le CEI, le Cercle des Étudiants en Informatique de HELMo. Participez à des événements, ateliers et projets collaboratifs pour enrichir vos compétences en programmation, cybersécurité et développement web.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className=""
      >
        {children}
      </body>
    </html>
  );
}
