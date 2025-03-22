"use client";

import { SessionProvider } from "next-auth/react";
import NavbarComponents from "./NavbarComponents";

export default function Navbar() {
  return (
    <SessionProvider>
      <NavbarComponents />
    </SessionProvider>
  );
}
