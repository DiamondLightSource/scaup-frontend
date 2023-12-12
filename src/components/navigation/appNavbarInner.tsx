/* istanbul ignore file */

"use client";
import { Breadcrumbs, Navbar, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export const AppNavbarInner = ({ session }: { session: null | Session }) => {
  const pathname = usePathname();

  return (
    <>
      <Navbar logo='/diamondgs.png'>
        <User
          user={
            session && session.user
              ? { fedid: session.user.email!, name: session.user.name! }
              : null
          }
          onLogin={() => signIn("diamond")}
          onLogout={() =>
            signOut({ callbackUrl: "https://authalpha.diamond.ac.uk/cas/oidc/logout" })
          }
        />
      </Navbar>
      <Breadcrumbs path={pathname} />
    </>
  );
};
