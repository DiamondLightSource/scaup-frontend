"use client";

import { useSession } from "next-auth/react";
import { AppNavbarInner } from "./appNavbarInner";

// TODO: move to a server component when someone adds setting cookies to server components.

export const AppNavbar = () => {
  const { data: session } = useSession();

  return <AppNavbarInner session={session} />;
};

/*
export const AppNavbar = async () => {
  const session = await getServerSession(authOptions);

  return <AppNavbarInner session={session} />;
};
*/
