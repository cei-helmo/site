"use client";
import Navbar from "@/src/components/Navbar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import jeu from "@/src/img/JeuSociete.png";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Erreur de récupération des événements");
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements : ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col items-center">
        <div className="text-center mt-16 mb-12">
          <h1 className="font-bold text-5xl text-black dark:text-white">
            Nos derniers événements
          </h1>
        </div>
        <div className="flex flex-col gap-16 w-full max-w-5xl px-4 mb-16">
          {isLoading ? (
            <p className="text-center text-gray-500">
              Chargement des événements...
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-center flex-col md:flex-row ${
                  event.id % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="w-full md:w-1/2 flex items-center justify-center">
                  <Image
                    src={jeu}
                    alt={`Image de l'événement ${event.title}`}
                    className="rounded-md"
                    width={450}
                    height={300}
                    priority={event.id === 1}
                  />
                </div>
                <div className="w-full md:w-1/2 mt-6 md:mt-0 px-4">
                  <h2 className="font-bold text-xl text-black dark:text-white">
                    {event.title}
                  </h2>

                  <p className="mt-4 text-black dark:text-gray-300 text-justify">
                    {event.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <footer className="bg-white dark:bg-gray-800 text-black dark:text-white w-full flex items-center justify-between p-6">
        <div className="text-center text-sm">
          <p>
            &copy; 2024 Cercle des Étudiants en Informatique. Tous droits
            réservés.
          </p>
        </div>
        <div className="flex space-x-8">
          <Link href="https://www.facebook.com/CEI.HELMo" target="_blank">
            <FaFacebook className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200" />
          </Link>
          <Link href="https://www.instagram.com/cei.helmo/" target="_blank">
            <FaInstagram className="w-6 h-6 text-pink-600 hover:text-pink-800 transition duration-200" />
          </Link>
        </div>
      </footer>
    </>
  );
}
