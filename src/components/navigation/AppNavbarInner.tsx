"use client";
import { Breadcrumbs, Navbar, NavLink, NavLinks, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

export const AppNavbarInner = ({ session }: { session: null | Session }) => {
  const pathname = usePathname();

  // As for not using NextLink in breadcrumbs, https://github.com/vercel/next.js/discussions/54075
  return (
    <>
      <Navbar logo='/diamondgs.png'>
        {session && session.permissions.includes("em_admin") ? (
          <NavLinks>
            <NavLink as={NextLink} href='/inventory'>
              Inventory
            </NavLink>
          </NavLinks>
        ) : (
          <></>
        )}
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
