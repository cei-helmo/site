"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";

export default function NavbarComponents() {
  const { data: session } = useSession(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active/désactive le thème sombre en appliquant l'état à la racine
  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const shouldDark = storedTheme === "dark";
    setIsDarkMode(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-100 dark:bg-gray-900">
      <div className="px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="block dark:hidden">
              <Image src="/LogoBlack.svg" alt="Logo CEI Light" height={25} width={75} />
            </div>
            <div className="hidden dark:block">
              <Image src="/LogoWhite.svg" alt="Logo CEI Dark" height={25} width={75} />
            </div>
          </Link>

          {/* Liens de navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/pages/Tutorat" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
              Tutorat
            </Link>
            <Link href="/pages/Event" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
              Événements
            </Link>
            <Link href="/pages/Link" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
              Liens
            </Link>
            {session && (
              <Link href="/pages/Dashboard/admin" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                Dashboard
              </Link>
            )}
          </div>

          {/* Boutons de droite */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="text-gray-800 dark:text-gray-200">
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-gray-200 md:hidden">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <div className="hidden md:block relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center text-lg font-bold text-black dark:text-white">
                Auth <FaChevronDown className="ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link href="/auth/register" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Inscription
                  </Link>
                  <Link href="/auth/signin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Connexion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-2 pt-2 pb-3 bg-white dark:bg-gray-900">
          <Link href="/pages/Tutorat" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
            Tutorat
          </Link>
          <Link href="/pages/Event" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
            Événements
          </Link>
          <Link href="/pages/Link" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
              Liens
            </Link>
          {session && (
            <Link href="/dashboard" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
              Dashboard
            </Link>
            
          )}
          <Link href="/auth/register" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
            Inscription
          </Link>
          <Link href="/auth/signin" className="text-lg font-bold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
            Connexion
          </Link>
        </div>
      )}
    </nav>
  );
}
