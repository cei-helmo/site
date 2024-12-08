"use client";

import { SessionProvider } from "next-auth/react";
import DashboardContent from "./DashboardContent";

const Dashboard = () => {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
};

export default Dashboard;
