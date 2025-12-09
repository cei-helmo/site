"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Point unique pour tous les providers client (auth, thèmes, etc.).
export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

