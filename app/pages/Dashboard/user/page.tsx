"use client";

import { SessionProvider } from "next-auth/react";
import UserDashboard from "./user";
const Dashboard = () => {
  return (
    <SessionProvider>
      <UserDashboard />
    </SessionProvider>
  );
};

export default Dashboard;
