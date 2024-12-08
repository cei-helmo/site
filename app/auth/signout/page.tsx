// app/auth/signout/page.tsx
"use client";

import React from "react";
import LogoutButton from "./LogoutButton";
const SignOutPage: React.FC = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LogoutButton onLogout={handleLogout} />
    </div>
  );
};

export default SignOutPage;
