import Navbar from '@/src/components/Navbar'
import Image from 'next/image'
import React from 'react'
import place from '@/src/img/placeholder.png'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import Link from 'next/link'

export default function Page() {
  const events = [
    { id: 1, text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ", imageFirst: true },
    { id: 2, text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ", imageFirst: false },
    { id: 3, text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ", imageFirst: true },
    { id: 4, text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ", imageFirst: false },
  ]

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col justify-center items-center">
        <div className="text-center mb-16 mt-16">
          <h1 className="font-bold text-5xl text-black dark:text-white">
            Nos derniers événements
          </h1>
        </div>
        <div className="flex flex-col  gap-16 w-full max-w-5xl px-4 mb-16">
          {events.map(({ id, text, imageFirst }) => (
            <div
              key={id}
              className={`flex items-center justify-center flex-col md:flex-row ${imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'} items-center `}
            >
              <div className="w-full  md:w-1/2 flex items-center justify-center">
                <Image
                  src={place}
                  alt="Event placeholder"
                  className="rounded-md"
                  width={450}
                  height={300} // Optimisation des dimensions
                  priority={id === 1} // Chargement prioritaire de la première image
                />
              </div>
              <div className="w-full md:w-1/2 mt-6 md:mt-0 px-4">
                <p className="text-black dark:text-gray-300 text-justify">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-white dark:bg-gray-800 text-black dark:text-white  w-full flex items-center justify-between p-6">
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
    </>
  )
}
