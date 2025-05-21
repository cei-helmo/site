import React, { useState, useEffect, Fragment } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Vue = 'mois' | 'semaine' | 'jour';
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  createdBy: { name: string };
}

const joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const cellBase = 'flex flex-col p-2';
const cellMonth = 'bg-white dark:bg-gray-800';
const cellOther = 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500';
const cellToday = 'ring-2 ring-blue-500 dark:ring-blue-400';
const eventClass = 'bg-blue-500 dark:bg-blue-600 text-white rounded cursor-pointer hover:opacity-80';

export default function Calendrier() {
  const [dateActuelle, setDateActuelle] = useState(new Date());
  const [vue, setVue] = useState<Vue>('mois');
  const [evenements, setEvenements] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/events');
        setEvenements(res.ok ? await res.json() : []);
      } catch {
        setEvenements([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const mois = dateActuelle.getMonth(), année = dateActuelle.getFullYear();
  const changerMois = (d: number) => setDateActuelle(new Date(année, mois + d, 1));
  const premierJour = new Date(année, mois, 1).getDay();
  const nbJours = new Date(année, mois + 1, 0).getDate();
  const nbJoursPrec = new Date(année, mois, 0).getDate();
  const decalage = (premierJour + 6) % 7;

  // Génère la liste des jours à afficher (mois précédent, courant, suivant)
  const genererJours = () => {
    const jours = [];
    for (let i = decalage - 1; i >= 0; i--)
      jours.push({
        jour: nbJoursPrec - i,
        date: new Date(année, mois - 1, nbJoursPrec - i),
        estActuel: false,
        estDuMois: false,
        evenements: evenements.filter(e => new Date(e.date).toDateString() === new Date(année, mois - 1, nbJoursPrec - i).toDateString()),
      });
    for (let i = 1; i <= nbJours; i++) {
      const d: Date = new Date(année, mois, i);
      jours.push({
        jour: i,
        date: d,
        estActuel: d.toDateString() === new Date().toDateString(),
        estDuMois: true,
        evenements: evenements.filter(e => new Date(e.date).toDateString() === d.toDateString()),
      });
    }
    while (jours.length % 7 !== 0) {
      const d: Date = new Date(année, mois + 1, jours.length - nbJours - decalage + 1);
      jours.push({
        jour: jours.length - nbJours - decalage + 1,
        date: d,
        estActuel: false,
        estDuMois: false,
        evenements: evenements.filter(e => new Date(e.date).toDateString() === d.toDateString()),
      });
    }
    return jours;
  };

  // Cellule d'un jour (vue mois/semaine)
  const Cell = ({ cell, idx, showDay = true, children }: any) => (
    <div
      key={idx}
      className={[
        cellBase,
        cell.estDuMois ? cellMonth : cellOther,
        cell.estActuel ? cellToday : '',
        showDay ? '' : 'p-4',
      ].join(' ')}
    >
      {showDay && (
        <span className={`font-medium ${cell.estActuel ? 'text-blue-500 dark:text-blue-400' : ''}`}>{cell.jour}</span>
      )}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );

  // Affichage des événements dans une cellule
  const Events = ({ events, desc }: { events: Event[]; desc?: boolean }) => (
    <>
      {events.map((e, idx) => (
        <div
          key={e.id || idx}
          className={eventClass + (desc ? ' p-2 mb-2 text-sm' : ' text-xs p-1 mb-1')}
          onClick={() => setSelectedEvent(e)}
        >
          <div className="font-medium">{e.title}</div>
          {desc && <div className="opacity-90">{e.description.substring(0, 50)}...</div>}
        </div>
      ))}
    </>
  );

  // Vues
  const jours = genererJours();
  const renderVueMois = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
      {jours.map((cell, i) => (
        <Cell cell={cell} idx={i} key={i}>
          <Events events={cell.evenements} />
        </Cell>
      ))}
    </div>
  );
  const renderVueSemaine = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
      {jours.slice(0, 7).map((cell, i) => (
        <Cell cell={cell} idx={i} showDay={false} key={i}>
          <div className="font-medium mb-2">
            <div className="text-gray-500 dark:text-gray-400">{joursSemaine[i]}</div>
            <div className={`text-lg ${cell.estActuel ? 'text-blue-500 dark:text-blue-400' : ''}`}>{cell.jour}</div>
          </div>
          <Events events={cell.evenements} desc />
        </Cell>
      ))}
    </div>
  );
  const renderVueJour = () => {
    const jour = jours.find(j => j.estActuel) || jours[0];
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-[calc(100vh-12rem)]">
        <div className="font-medium text-xl mb-4 text-gray-900 dark:text-white">
          {jour.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div className="space-y-2">
          {jour.evenements.map((event, idx) => (
            <div
              key={event.id || idx}
              className="bg-blue-500 dark:bg-blue-600 text-white p-3 rounded cursor-pointer hover:opacity-80"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="font-medium text-lg">{event.title}</div>
              <div className="text-sm mt-1">{event.description}</div>
              <div className="text-xs mt-2 opacity-90">Créé par {event.createdBy.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modal d'affichage de l'événement sélectionné
  const Modal = () => selectedEvent && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-full sm:w-4/5 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">{selectedEvent.title}</h2>
        <p className="text-gray-500 mb-2">Date : {new Date(selectedEvent.date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedEvent.description}</p>
        <p className="text-gray-500 mb-2">Créé par : {selectedEvent.createdBy.name}</p>
        <div className="flex justify-end mt-4">
          <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700">Fermer</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen p-6 flex flex-col bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {dateActuelle.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
          </h1>
          <div className="flex items-center space-x-2">
            <button onClick={() => changerMois(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => changerMois(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex space-x-2">
          {(['mois', 'semaine', 'jour'] as Vue[]).map(v => (
            <button
              key={v}
              onClick={() => setVue(v)}
              className={`px-4 py-2 rounded ${vue === v ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Chargement des événements...</p>
        </div>
      ) : (
        <Fragment>
          {vue === 'mois' && (
            <Fragment key="vue-mois">
              <div className="grid grid-cols-7 text-center mb-2">
                {joursSemaine.map((j, i) => (
                  <div key={i} className="font-semibold text-gray-600 dark:text-gray-400 uppercase text-sm">{j}</div>
                ))}
              </div>
              {renderVueMois()}
            </Fragment>
          )}
          {vue === 'semaine' && <Fragment key="vue-semaine">{renderVueSemaine()}</Fragment>}
          {vue === 'jour' && <Fragment key="vue-jour">{renderVueJour()}</Fragment>}
        </Fragment>
      )}
      <Modal />
    </div>
  );
}
