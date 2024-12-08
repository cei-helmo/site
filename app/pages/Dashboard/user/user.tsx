"use client";
import { useSession } from "next-auth/react";
import DashboardContent from "../DashboardContent";

const UserDashboard = () => {
  const {data: session} = useSession();
  return (
    <DashboardContent>
      <h2 className="text-2xl font-bold">User Dashboard</h2>
      <p>Bienvenue, utilisateur {session?.user.email}!</p>
    </DashboardContent>
  );
};

export default UserDashboard;
