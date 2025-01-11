"use client";

import Sidebar from "@/src/components/Sidebar";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import GestionUsers from "./Components/GestionUsers";
import GestionEvent from "./Components/GestionEvent";
import Settings from "./Components/Settings";
import Event_User from "./user/components/Event_User";

interface DashboardContentProps {
  children?: ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePage, setActivePage] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    setIsLoaded(true);
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }
    const userRole = session?.user?.role;
    setActivePage(userRole === "ADMIN" ? "event" : "event_user");
  }, [session, status]);

  if (status === "loading" || !isLoaded || activePage === "") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar setActivePage={setActivePage} />
      <main className="flex-1 p-4">{renderContent(activePage)}</main>
    </div>
  );
};

const renderContent = (activePage: string) => {
  switch (activePage) {
    case "event":
      return <GestionEvent />;
    case "users":
      return <GestionUsers />;
    case "admin":
      return <div className="text-black dark:text-white">Admin Panel</div>;
    case "event_user":
      return <Event_User />;
    /* case "settings":
      return <Settings />; */
    default:
      return <div className="text-black dark:text-white">Page non trouvée</div>;
  }
};

export default DashboardContent;
