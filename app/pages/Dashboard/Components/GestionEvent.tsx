import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  createdBy: {
    name: string;
  };
}

export default function GestionEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Etats pour le formulaire
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Charger les événements au montage du composant
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Erreur de récupération des événements");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements :", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function closeModal() {
    setIsOpen(false);
    setTitle("");
    setDescription("");
    setDate("");
  }

  function handleEventClick(event: Event) {
    setSelectedEvent(event);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = new Date(date).toISOString();

    const eventData = {
      title,
      description,
      date: formattedDate,
    };

    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'événement");
      }

      const data = await response.json();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-7">
        <div className="title flex flex-col md:flex-row lg:flex-row justify-between">
          <h1 className="text-black dark:text-white font-bold text-4xl">
            Gestion des Événements
          </h1>
          <button
            onClick={handleClick}
            className="flex  justify-center items-center  gap-2 p-4 font-semibold rounded-md text-white dark:text-black bg-black dark:bg-white"
          >
            <Plus /> Ajouter un événement
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <p className="text-center text-gray-500">
              Chargement des événements...
            </p>
          ) : (
            events?.map((event: Event) => (
              <div
                key={event.id}
                className="up w-full p-6 border-gray-500 rounded-md border-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleEventClick(event)}
              >
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal pour ajouter un événement */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-1/3"
          >
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Ajouter un événement
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col text-black dark:text-white gap-1">
                <label htmlFor="title">Titre :</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Le titre de l'événement"
                  required
                  className="py-2 px-3 text-black dark:text-black rounded-md border-black border-2"
                />
              </div>
              <div className="flex flex-col text-black dark:text-white gap-1">
                <label htmlFor="description">Description :</label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ajoutez une description"
                  required
                  className="rounded-md p-3 text-black dark:text-black border-black border-2"
                ></textarea>
              </div>
              <div className="flex flex-col text-black dark:text-white gap-1">
                <label htmlFor="date">Date :</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="py-2 px-3 text-black dark:text-black rounded-md border-black border-2"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal pour afficher les détails d'un événement */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              {selectedEvent.title}
            </h2>
            <p className="text-gray-500 mb-2">
              Date : {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {selectedEvent.description}
            </p>
            <p className="text-gray-500">
              Créé par : {selectedEvent.createdBy.name}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
