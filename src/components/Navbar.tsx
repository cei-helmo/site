"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-900">
      <div className="px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="block dark:hidden">
                  <Image src="/LogoBlack.svg" alt="Logo CEI Light" height={25} />
                </div>
                <div className="hidden dark:block">
                  <Image src="/LogoWhite.svg" alt="Logo CEI Dark" height={25} />
                </div>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/pages/Tutorat"
              className="text-gray-800 text-lg dark:text-gray-200 transition hover:text-blue-500 dark:hover:text-blue-400 font-bold"
            >
              Tutorat
            </Link>
            <Link
              href="/pages/Event"
              className="text-gray-800 text-lg dark:text-gray-200 transition hover:text-blue-500 dark:hover:text-blue-400 font-bold"
            >
              Événements
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="text-gray-800 dark:text-gray-200 focus:outline-none md:hidden"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center  text-lg  font-bold text-black rounded-md cursor-pointer bg-customBlue dark:text-white"
              >
                Auth <FaChevronDown className="ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link href="/auth/register">
                    <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Inscription
                    </span>
                  </Link>
                  <Link href="/auth/signin">
                    <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Connexion
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-2 pt-2 pb-3 bg-white dark:bg-gray-900">
          <Link
            href="/pages/Tutorat"
            className="text-gray-800 text-lg dark:text-gray-200 transition hover:text-blue-500 dark:hover:text-blue-400 font-bold"
          >
            Tutorat
          </Link>
          <Link
            href="/pages/Event"
            className="text-gray-800 text-lg dark:text-gray-200 transition hover:text-blue-500 dark:hover:text-blue-400 font-bold"
          >
            Événements
          </Link>
          <Link
            href="/auth/register"
            className="text-gray-800 text-lg dark:text-gray-200 transition hover:text-blue-500 dark:hover:text-blue-400 font-bold"
          >
            Register
          </Link>
          <Link
            href="/auth/signin"
            className="text-gray-800 text-lg dark:text-gray-200 transition hover:text-blue-500 dark:hover:text-blue-400 font-bold"
          >
            Connexion
          </Link>
        </div>
      )}
    </nav>
  );
}
