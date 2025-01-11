"use client";
import { useSession } from "next-auth/react";
import DashboardContent from "../DashboardContent";

const UserDashboard = () => {
  const { data: session } = useSession();
  return <DashboardContent></DashboardContent>;
};

export default UserDashboard;
