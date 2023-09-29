/* istanbul ignore file */

"use client";
import { Navbar, User } from "@diamondlightsource/ui-components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export const AppNavbarInner = ({ session }: { session: null | Session }) => (
  <Navbar>
    <User
      user={
        session && session.user ? { fedid: session.user.email!, name: session.user.name! } : null
      }
      onLogin={() => signIn("diamond")}
      onLogout={() => signOut({ callbackUrl: "https://authalpha.diamond.ac.uk/cas/oidc/logout" })}
    />
  </Navbar>
);
