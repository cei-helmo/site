import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-black dark:text-white w-full flex items-center justify-between p-6">
      <div className="text-center mt-4 text-sm">
        <p>
          &copy; 2024 Cercle des Étudiants en Informatique. Tous droits
          réservés.
        </p>
      </div>
      <div className="flex justify-center items-center space-x-8">
        <Link href="https://www.facebook.com/CEI.HELMo" target="_blank">
          <FaFacebook className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200" />
        </Link>
        <Link href="https://www.instagram.com/cei.helmo/" target="_blank">
          <FaInstagram className="w-6 h-6 text-pink-600 hover:text-pink-800 transition duration-200" />
        </Link>
      </div>
    </footer>
  );
}
