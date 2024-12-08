"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "@/src/components/Navbar";
import { GraduationCap, HelpCircle, Calendar, Users } from "lucide-react";

const textData = [
  {
    icon: <GraduationCap className="w-8 h-8 text-black dark:text-white" />,
    title: "Orientation première année",
    description:
      "Obtenez de l'aide pour vos premiers pas dans l'enseignement supérieur.",
  },
  {
    icon: <Calendar className="w-8 h-8 text-black dark:text-white" />,
    title: "Planification de l'emploi du temps",
    description:
      "Apprenez à gérer efficacement vos cours et votre temps d'étude.",
  },
  {
    icon: <HelpCircle className="w-8 h-8 text-black dark:text-white" />,
    title: "Clarification des concepts",
    description:
      "Obtenez de l'aide pour comprendre les concepts difficiles des cours.",
  },
  {
    icon: <Users className="w-8 h-8 text-black dark:text-white" />,
    title: "Soutien par les pairs",
    description:
      "Connectez-vous avec des étudiants qui ont suivi les mêmes cours.",
  },
];

export default function Tutorat() {
  const [activeTab, setActiveTab] = useState<"tutor" | "tutoree">("tutor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discord: "",
    details: "",
    departement: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
  
    if (!webhookUrl) {
      console.error("L'URL du webhook est manquante. Vérifiez vos variables d'environnement.");
      alert("Erreur de configuration : L'URL du webhook est absente.");
      return;
    }
  
    const payload = {
      content: `Nouvelle inscription : `,
      embeds: [
        {
          title: "Détails de l'inscription",
          color: activeTab === "tutoree" ? 0x3498db : 0x2ecc71,
          author: { name: "Programme de Tutorat" },
          fields: [
            { name: "Nom", value: `${formData.name || "Non fourni"}\n`, inline: false },
            { name: "Email", value: `${formData.email || "Non fourni"}\n`, inline: false },
            { name: "Discord", value: `${formData.discord || "Non fourni"}\n`, inline: false },
            { name: "Détails", value: `${formData.details || "Non fourni"}\n`, inline: false },
            { name: "Département", value: `${formData.departement || "Non fourni"}\n`, inline: false },
          ],
          description:
            "Voici les détails de l'inscription à notre programme de tutorat.\n\nNous vous remercions de votre inscription et nous vous contacterons bientôt pour vous fournir des informations supplémentaires.",
          footer: { text: "Tutoring Program - HELMo", icon_url: "https://www.example.com/footer-logo.png" },
          timestamp: new Date(),
        },
      ],
    };
  
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
  
      alert("Inscription envoyée avec succès !");
      setFormData({ name: "", email: "", discord: "", details: "", departement: "" }); // Réinitialise le formulaire
    } catch (error) {
      console.error("Erreur lors de l'envoi des données au webhook :", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };
  


  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col md:flex-row justify-center items-center p-4 gap-6">
        {/* Section gauche */}
        <div className="left w-full md:w-1/2 p-4">
          <div>
            <h1 className="font-bold text-3xl md:text-5xl  text-black dark:text-white text-center md:text-left">
              Programme de Tutorat
            </h1>
            <p className="text-lg md:text-xl mt-3 text-gray-400 text-center md:text-left">
              Obtenez de l&#39;aide d&#39;étudiants expérimentés ou devenez
              mentor vous-même. Rejoignez notre communauté d&#39;apprenants!
            </p>
          </div>
          <ul className="mt-6 space-y-6 cursor-pointer">
            {textData.map((item, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 bg-white dark:bg-gray-500 border-2 hover:scale-105 transition border-gray-400 p-4 shadow-lg rounded-lg dark:shadow-white dark:shadow-md"
              >
                <div>{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-black dark:text-white">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Section droite */}
        <div className="right w-full md:w-2/5 bg-white dark:bg-gray-700 border-2 border-gray-400 p-4 rounded-md">
          <div>
            <h1 className="font-bold text-xl text-black dark:text-white text-center md:text-left">
              Inscrivez-vous maintenant!
            </h1>
            <p className="text-md mt-3 text-gray-400 text-center md:text-left">
              Choisissez votre rôle dans le programme de Tutorat
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-200 border-2 border-gray-400 rounded-md">
              <button
                className={`flex-1 py-2 px-4 text-center rounded-md ${
                  activeTab === "tutoree"
                    ? "bg-white text-black dark:text-black"
                    : "bg-muted text-gray-400"
                }`}
                onClick={() => setActiveTab("tutoree")}
              >
                J&#39;ai besoin d&#39;aide (B1)
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center rounded-md ${
                  activeTab === "tutor"
                    ? "bg-white text-black dark:text-black"
                    : "bg-muted text-gray-400"
                }`}
                onClick={() => setActiveTab("tutor")}
              >
                Je veux aider (B2/B3)
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black dark:text-white"
                >
                  Votre nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="Entrez votre nom complet"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black dark:text-white"
                >
                  Votre adresse e-mail HELMo
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="votre.nom@student.helmo.be"
                />
              </div>
              <div>
                <label
                  htmlFor="discord"
                  className="block text-sm font-medium text-black dark:text-white"
                >
                  Nom d&#39;utilisateur Discord (optionnel)
                </label>
                <input
                  type="text"
                  id="discord"
                  value={formData.discord}
                  onChange={handleInputChange}
                  className="mt-1 h-10 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  placeholder="utilisateur#0000"
                />
              </div>
              <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Détails sur la demande
                  </label>
                  <textarea
                    id="details"
                    value={formData.details}
                    onChange={handleTextAreaChange}
                    className="mt-1 h-24 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="Détails"
                  />
                </div>

              <div>
                <label
                  htmlFor="departement"
                  className="block text-sm font-medium text-black dark:text-white"
                >
                  Votre département
                </label>
                <select
                  id="departement"
                  value={formData.departement}
                  onChange={handleInputChange}
                  className="mt-1 h-10 p-2 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="">Sélectionnez votre département</option>
                  <option value="apps">
                    Développement d&#39;applications / programmation
                  </option>
                  <option value="networks">Cybersécurité</option>
                  <option value="systems">Intélligence Artificielle</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 dark:hover:bg-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {activeTab === "tutoree"
                  ? "S'inscrire comme tutoré"
                  : "S'inscrire comme tuteur"}
              </button>
            </form>
            <p className="mt-4 text-xs text-gray-500 text-center">
              Vos données ne seront pas partagées et seront uniquement utilisées
              pour le programme de Tutorat
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
