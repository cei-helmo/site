"use client";
import { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import LogoWhite from "@/src/img/LogoWhite.svg";
import LogoBlack from "@/src/img/LogoBlack.svg";
import { gsap } from "gsap";
import Footer from "@/src/components/Footer";

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
              <div className="flex items-center justify-center">
                <div className="relative group">
                  <button className="hero-button relative inline-block p-px font-semibold leading-6 text-white bg-blue-500 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out  active:scale-95">
                    <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-500">
                      <div className="relative z-10 flex items-center space-x-2">
                        <span className="transition-all duration-500 group-hover:translate-x-1">
                          Événements
                        </span>
                        <svg
                          className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                          data-slot="icon"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </span>
                  </button>
                </div>
              </div>
            </Link>
            <Link href="/pages/Tutorat">
              <div className="flex items-center justify-center">
                <div className="relative group">
                  <button className="hero-button relative inline-block p-px font-semibold leading-6 text-white bg-blue-500 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out  active:scale-95">
                    <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-500">
                      <div className="relative z-10 flex items-center space-x-2">
                        <span className="transition-all duration-500 group-hover:translate-x-1">
                          Tutorat
                        </span>
                        <svg
                          className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                          data-slot="icon"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </span>
                  </button>
                </div>
              </div>
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

        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4 lg:px-20 py-10 w-full mt-8 sm:mt-16 md:mt-8">
          <h1 className="font-bold text-4xl text-black dark:text-white">Nos Sponsors</h1>
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
                className="px-4 py-2 rounded-l-lg text-black w-full focus:outline-none border-solid border  dark:border-none"
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
        <Footer />
      </div>
    </>
  );
}
