import { authOptions } from "@/mappings/authOptions";
import { getServerSession } from "next-auth/next";
import { AppNavbarInner } from "./appNavbarInner";

// TODO: fix hydration errors
export const AppNavbar = async () => {
  const session = await getServerSession(authOptions);

  return <AppNavbarInner session={session} />;
};
