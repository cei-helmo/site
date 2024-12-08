"use client";

import { SessionProvider } from "next-auth/react";
import AdminDashboard from "./admin";
const Dashboard = () => {
  return (
    <SessionProvider>
      <AdminDashboard />
    </SessionProvider>
  );
};

export default Dashboard;
