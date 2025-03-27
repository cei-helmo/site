import Navbar from '@/components/Navbar';
import { FaFacebook, FaInstagram, FaDiscord, FaGlobe } from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Footer from '@/components/Footer';

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/CEI.HELMo', icon: <FaFacebook /> },
  { name: 'Instagram', url: 'https://www.instagram.com/cei.helmo/', icon: <FaInstagram /> },
  { name: 'Discord', url: 'https://discord.gg/xe6xuwrmhA', icon: <FaDiscord /> },
  { name: 'Nos Pulls', url: 'https://forms.office.com/pages/responsepage.aspx?id=uNXHDcYlskWKCwRkYf12IC43mEjEaU5Bj_w7WasDl89UOVIwOFJJNkJGU0NXQkxCM1pORzBZRjFDOS4u&route=shorturl', icon: <FaGlobe /> },
];

export default function SocialPage() {
  return (
    <>
      <Head>
        <title>Nos réseaux - CEI HELMo</title>
        <meta name="description" content="Suivez le Cercle des Étudiants en Informatique de HELMo sur Facebook, Instagram et Discord. Rejoignez notre communauté et restez informé des événements !" />
      </Head>

      <Navbar />
      <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
          Retrouvez-nous sur nos réseaux
        </h1>
        <div className="w-full max-w-md flex flex-col gap-4">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <div className="text-3xl text-blue-600 dark:text-blue-400">{link.icon}</div>
              <span className="text-lg font-medium text-black dark:text-white">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}
