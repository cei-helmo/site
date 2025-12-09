"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Tab = "tutoree" | "tutor";
type ContactMethod = "MAIL" | "TEAMS" | "DISCORD";
type Cursus = "DEV_APPS" | "SEC_SY" | "AI";

const COURSE_OPTIONS: Record<Cursus, string[]> = {
  DEV_APPS: [
    "Algorithmique",
    "Programmation procédurale",
    "Programmation orientée objet",
    "Bases de données",
    "Systèmes d'exploitation",
    "Réseaux",
    "Mathématiques discrètes",
  ],
  SEC_SY: [
    "Algorithmique",
    "Sécurité informatique (intro)",
    "Programmation",
    "Bases de données",
    "Réseaux",
    "Mathématiques",
  ],
  AI: [
    "Algorithmique",
    "Programmation",
    "Bases de données",
    "Réseaux",
    "Mathématiques",
    "Probabilités / Statistiques",
  ],
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  contactMethod: "MAIL" as ContactMethod,
  contactHandle: "",
  cursus: "" as Cursus | "",
  courses: [] as string[],
  details: "",
};

export default function Tutorat() {
  const [activeTab, setActiveTab] = useState<Tab>("tutoree");
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof formData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCourse = (course: string) => {
    setFormData((prev) => {
      const exists = prev.courses.includes(course);
      return {
        ...prev,
        courses: exists ? prev.courses.filter((c) => c !== course) : [...prev.courses, course],
      };
    });
  };

  const validate = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Prénom et nom sont requis.");
      return false;
    }
    if (!formData.email.trim() || !/.*@([^.]+\.)?(helmo|hepl)\.be$/i.test(formData.email)) {
      toast.error("Email étudiant requis (helmo.be ou hepl.be).");
      return false;
    }
    if (formData.contactMethod === "DISCORD" && !formData.contactHandle.trim()) {
      toast.error("Pseudo Discord requis si Discord est choisi.");
      return false;
    }
    if (!formData.cursus) {
      toast.error("Sélectionnez un cursus.");
      return false;
    }
    if (formData.courses.length === 0) {
      toast.error("Choisissez au moins un cours.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const endpoint =
        activeTab === "tutoree" ? "/api/tutorat/request" : "/api/tutorat/offer";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
      toast.success(
        activeTab === "tutoree"
          ? "Demande envoyée. Vous recevrez un mail quand un tuteur sera confirmé."
          : "Offre enregistrée. Nous vous contacterons quand un étudiant correspondra."
      );
      setFormData(initialState);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Erreur interne");
    } finally {
      setIsSubmitting(false);
    }
  };

  const coursesForCursus = formData.cursus ? COURSE_OPTIONS[formData.cursus] : [];

  return (
    <>
      <Head>
        <title>Programme de Tutorat - HELMo</title>
        <meta
          name="description"
          content="Rejoignez le programme de tutorat de HELMo pour obtenir de l'aide ou aider d'autres étudiants."
        />
      </Head>
      <Navbar />
      <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col items-center p-4">
        <div className="max-w-5xl w-full">
          <h1 className="font-bold text-3xl md:text-4xl text-black dark:text-white text-center mt-10">
            Programme de Tutorat
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
            Inscrivez-vous comme tutoré ou comme tuteur. Nous faisons le matching automatiquement
            et vous envoyons les infos par email cei.helmo.be.
          </p>

          <div className="flex flex-col sm:flex-row mt-8 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
            <button
              className={`flex-1 py-3 font-semibold ${
                activeTab === "tutoree"
                  ? "bg-white dark:bg-gray-800 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("tutoree")}
            >
              J'ai besoin d'aide (B1)
            </button>
            <button
              className={`flex-1 py-3 font-semibold ${
                activeTab === "tutor"
                  ? "bg-white dark:bg-gray-800 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab("tutor")}
            >
              Je veux aider (B2/B3)
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-6 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Prénom
                </label>
                <input
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Nom
                </label>
                <input
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Adresse HELMo
              </label>
              <input
                className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="prenom.nom@student.helmo.be"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Mode de contact
                </label>
                <select
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                  value={formData.contactMethod}
                  onChange={(e) => updateField("contactMethod", e.target.value as ContactMethod)}
                >
                  <option value="MAIL">Mail</option>
                  <option value="TEAMS">Teams</option>
                  <option value="DISCORD">Discord</option>
                </select>
              </div>
              {formData.contactMethod === "DISCORD" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Pseudo Discord
                  </label>
                  <input
                    className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                    value={formData.contactHandle}
                    onChange={(e) => updateField("contactHandle", e.target.value)}
                    placeholder="utilisateur#0000 ou ID"
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Cursus
                </label>
                <select
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                  value={formData.cursus}
                  onChange={(e) => {
                    const next = e.target.value as Cursus;
                    updateField("cursus", next);
                    updateField("courses", []);
                  }}
                >
                  <option value="">Sélectionnez votre cursus</option>
                  <option value="DEV_APPS">Dev Apps</option>
                  <option value="SEC_SY">Secsy</option>
                  <option value="AI">AI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">
                  Cours (B1)
                </label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {coursesForCursus.map((course) => (
                    <label
                      key={course}
                      className="flex items-center space-x-2 text-sm text-black dark:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.courses.includes(course)}
                        onChange={() => toggleCourse(course)}
                      />
                      <span>{course}</span>
                    </label>
                  ))}
                  {coursesForCursus.length === 0 && (
                    <p className="text-sm text-gray-500">Choisissez un cursus pour voir les cours.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white">
                Détails supplémentaires
              </label>
              <textarea
                className="mt-1 h-24 p-2 text-black block w-full rounded-md border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800"
                value={formData.details}
                onChange={(e) => updateField("details", e.target.value)}
                placeholder="Précisez les chapitres, les dispos, etc."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold disabled:opacity-60"
            >
              {isSubmitting
                ? "Envoi en cours..."
                : activeTab === "tutoree"
                ? "Envoyer une demande"
                : "Proposer mon aide"}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Vos données ne sont utilisées que pour le programme de tutorat CEI.
            </p>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
