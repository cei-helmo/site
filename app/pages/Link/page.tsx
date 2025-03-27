import Navbar from '@/components/Navbar';
import { FaFacebook, FaInstagram, FaDiscord, FaGlobe } from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/CEI.HELMo', icon: <FaFacebook /> },
  { name: 'Instagram', url: 'https://www.instagram.com/cei.helmo/', icon: <FaInstagram /> },
  { name: 'Discord', url: 'https://discord.gg/xe6xuwrmhA', icon: <FaDiscord /> },
  { name: 'Site Web', url: 'https://cei.helmo.be', icon: <FaGlobe /> },
];

export default function SocialPage() {
  return (
    <>
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
    </>
  );
}