"use client";
import { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import LogoWhite from "@/src/img/LogoWhite.svg";
import LogoBlack from "@/src/img/LogoBlack.svg";
import { gsap } from "gsap"; // Import GSAP
import { FaFacebook, FaInstagram } from "react-icons/fa";
export default function Home() {
  useEffect(() => {
    gsap.fromTo(
      ".hero-title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
    );

    gsap.fromTo(
      ".hero-description",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power3.out" },
    );

    gsap.fromTo(
      ".hero-button",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
        stagger: 0.3,
      },
    );

    gsap.fromTo(
      ".section-title",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
    );

    gsap.fromTo(
      ".section-text",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: "power3.out" },
    );

    gsap.fromTo(
      ".logo",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1, delay: 1, ease: "power3.out" },
    );
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col justify-center items-center">
        {/* Section principale */}
        <div className="flex flex-col items-center text-center px-4 py-10  mt-12">
          <h1 className="hero-title text-black dark:text-white text-3xl sm:text-5xl font-bold">
            Cercle des Étudiants en Informatique
          </h1>
          <p className="hero-description text-black dark:text-white mt-4 text-base sm:text-lg max-w-2xl">
            Nous sommes une association d’étudiants des départements de
            cybersécurité, développement d’applications et intelligence
            artificielle à HELMo.
          </p>
          <div className="flex flex-col justify-center items-center sm:flex-row gap-4 mt-6">
            <Link href="/pages/Event">
              <button className="hero-button px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-700 transition">
                Événements
              </button>
            </Link>
            <Link href="/pages/Tutorat">
              <button className="hero-button px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-700 transition">
                Tutorat
              </button>
            </Link>
          </div>
        </div>

        {/* Section "Qui sommes-nous" */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4 lg:px-20 py-10 w-full mt-8 sm:mt-16 md:mt-8">
          <div className="lg:w-1/2">
            <h2 className="section-title text-black dark:text-white text-2xl sm:text-4xl font-bold">
              Qui sommes-nous
            </h2>
            <p className="section-text text-black text-justify dark:text-white mt-4 text-base sm:text-lg">
              Le Cercle Étudiant en Informatique{" "}
              <span className="font-bold">(CEI)</span> est une association
              étudiante dédiée aux étudiants en informatique. <br />
            </p>
            <p className="section-text text-justify text-black dark:text-white mt-4 text-base sm:text-lg">
              Notre mission est de créer une communauté dynamique et
              enrichissante pour tous les passionnés d&#39;informatique.
            </p>
            <p className="section-text text-justify text-black dark:text-white mt-4 text-base sm:text-lg">
              Nous organisons régulièrement des événements, des sessions de
              tutorat et des activités pour favoriser l&#39;apprentissage et les
              échanges entre étudiants.
            </p>
          </div>
          <div className="flex justify-center lg:w-1/2">
            <div className="block dark:hidden logo">
              <Image
                src={LogoBlack}
                alt="Logo CEI Light"
                width={400}
                height={200}
              />
            </div>
            <div className="hidden dark:block logo">
              <Image
                src={LogoWhite}
                alt="Logo CEI Dark"
                width={400}
                height={200}
              />
            </div>
          </div>
        </div>

        {/* Section Newsletter */}
        <div className="text-black dark:text-white w-full py-12">
          <div className="flex flex-col items-center px-4">
            <h3 className="text-3xl font-bold mb-4">
              Abonnez-vous à notre newsletter
            </h3>
            <p className="text-lg mb-6">
              Restez à jour avec nos événements et nos activités.
            </p>
            <form className="flex items-center w-full max-w-sm ">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="px-4 py-2 rounded-l-lg text-black w-full focus:outline-none border-solid border border-black dark:border-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                S&#39;abonner
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
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
      </div>
    </>
  );
}
