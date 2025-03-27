"use client";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import jeu from '../../../public/JeuSociete.png'
import Footer from "@/components/Footer";

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
      <Head>
        <title>Événements - Cercle des Étudiants en Informatique</title>
        <meta name="description" content="Découvrez les derniers événements organisés par le Cercle des Étudiants en Informatique de HELMo. Rejoignez-nous pour participer !" />
      </Head>
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
      <Footer/>
    </>
  );
}
