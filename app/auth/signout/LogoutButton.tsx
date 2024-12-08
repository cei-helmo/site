// app/auth/signout/LogoutButton.tsx
"use client";

import React from "react";
import { signOut } from "next-auth/react";

export interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/"
      alert("Vous êtes bien déconnecté");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      alert("Une erreur s'est produite lors de la déconnexion.");
    }

    onLogout();
  };

  return (
    <button
      className="text-red-600 cursor-pointer hover:underline"
      onClick={handleLogout}
    >
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
